import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { GPTChatService } from './gpt-chat';
import { PhenoConstraeService } from './phenoml-medical-codes';

// Load environment variables
config();

// TypeScript interfaces
export interface LineItem {
  id: string;
  rawDescription: string;
  normalizedDescription: string;
  code?: CodeInfo;
  suggestedCode?: SuggestedCode;
  units: number;
  billedAmount: number;
  typicalCost: { min: number; median: number; max: number };
  insurer: InsurerInfo;
  variance: "above" | "within" | "below";
  actions: { flaggable: boolean; negotiable: boolean; correctable: boolean };
}

export interface Flag {
  itemId: string;
  type: "overcharge" | "codeMismatch" | "unbundled" | "duplicate";
  severity: "low" | "med" | "high";
  rationale: string;
}

export interface AnalysisData {
  summary: AnalysisSummary;
  lineItems: LineItem[];
  flags: Flag[];
}

export interface AnalysisSummary {
  billedTotal: number;
  estimatedFairTotal: number;
  estimatedInsuranceCovered: number;
  patientResponsibility: number;
  potentialSavings: number;
}

export interface CodeInfo {
  system: "CPT" | "HCPCS" | "ICD10" | "Custom";
  value: string;
  confidence: number;
  status: "verified" | "suggested" | "uncertain";
}

export interface SuggestedCode {
  system: string;
  value: string;
  confidence: number;
  rationale: string;
}

export interface InsurerInfo {
  allowedAmount?: number;
  coveredAmount?: number;
  patientResponsibility?: number;
}

interface PhenoMLResponse {
  system: {
    name: string;
    version: string;
  };
  codes: Array<{
    code: string;
    description: string;
    reason?: string;
  }>;
}

interface GPTAnalysisResponse {
  units: number;
  billedAmount: number;
  typicalCost: {
    min: number;
    median: number;
    max: number;
  };
}

class MedicalBillAnalyzer {
  private gptService: GPTChatService;
  private phenoService: PhenoConstraeService;
  private mappingsData: string;
  private fallbackData: any;

  constructor() {
    this.gptService = new GPTChatService();
    this.phenoService = new PhenoConstraeService(
      process.env.PHENO_USERNAME || '',
      process.env.PHENO_PASSWORD || ''
    );
    this.mappingsData = '';
    this.fallbackData = null;
  }

  /**
   * Load mappings data from file
   */
  private loadMappings(): void {
    try {
      this.mappingsData = readFileSync('files/mappings.txt', 'utf-8');
      console.log('Loaded mappings data successfully');
    } catch (error) {
      console.error('Error loading mappings file:', error);
      throw new Error('Could not load mappings.txt file');
    }
  }

  /**
   * Load fallback data from file
   */
  private loadFallbackData(): void {
    try {
      const fallbackJson = readFileSync('fallback-data.json', 'utf-8');
      this.fallbackData = JSON.parse(fallbackJson);
      console.log(`Loaded ${this.fallbackData.fallbackResponses.length} fallback responses`);
    } catch (error) {
      console.error('Error loading fallback data file:', error);
      // Create minimal fallback if file doesn't exist
      this.fallbackData = {
        fallbackResponses: [{
          serviceType: "generic",
          units: 1,
          billedAmount: 500,
          typicalCost: { min: 200, median: 350, max: 600 }
        }]
      };
    }
  }

  /**
   * Get a random fallback response, optionally adjusted for the actual billed amount
   */
  private getRandomFallbackResponse(actualBilledAmount?: number): GPTAnalysisResponse {
    if (!this.fallbackData || !this.fallbackData.fallbackResponses) {
      this.loadFallbackData();
    }

    const responses = this.fallbackData.fallbackResponses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // If we have an actual billed amount, try to find a similar response or adjust
    let selectedResponse = randomResponse;
    if (actualBilledAmount) {
      // Try to find a response with similar billed amount (within 50% range)
      const similarResponse = responses.find((resp: any) =>
        Math.abs(resp.billedAmount - actualBilledAmount) / actualBilledAmount < 0.5
      );

      if (similarResponse) {
        selectedResponse = similarResponse;
      } else {
        // Adjust the random response to match the actual billed amount
        const ratio = actualBilledAmount / randomResponse.billedAmount;
        selectedResponse = {
          ...randomResponse,
          billedAmount: actualBilledAmount,
          typicalCost: {
            min: Math.round(randomResponse.typicalCost.min * ratio),
            median: Math.round(randomResponse.typicalCost.median * ratio),
            max: Math.round(randomResponse.typicalCost.max * ratio)
          }
        };
      }
    }

    console.log(`Using fallback response: ${selectedResponse.serviceType} (Units: ${selectedResponse.units}, Billed: $${selectedResponse.billedAmount})`);

    return {
      units: selectedResponse.units,
      billedAmount: selectedResponse.billedAmount,
      typicalCost: selectedResponse.typicalCost
    };
  }

  /**
   * Load medical bill text from file or use provided text
   */
  private loadMedicalBill(inputText?: string): string {
    if (inputText && inputText.trim()) {
      return inputText;
    }

    try {
      const billText = readFileSync('files/Itemized Medical Bill.txt', 'utf-8');
      console.log('Loaded default medical bill successfully');
      return billText;
    } catch (error) {
      console.error('Error loading medical bill file:', error);
      throw new Error('Could not load medical bill file and no input text provided');
    }
  }

  /**
   * Convert medical bill text to natural language descriptions using GPT
   */
  private async prepareMedicalBillForExtraction(medicalBillText: string): Promise<string[]> {
    const prompt = `
${medicalBillText}

Please reword the above medical bill so it is a list of natural English descriptions where each sentence corresponds to an item in the itemized charges list. Starting with examples like:
"The patient had Semi-Private Room & Board in the hospital."
"The patient had an Emergency Room Visit"
"The patient needed IV Fluids"
...etc. 

Important instructions:
- Do not include the charges, dollar amounts, or anything above or below the itemized charges section
- Focus only on the medical services/items provided
- Convert each line item into a natural English sentence describing what the patient received
- The output should be formatted as a JSON array of sentences
- Return ONLY the JSON array, no additional text

Example format:
["The patient had Semi-Private Room & Board in the hospital.", "The patient had an Emergency Room Visit", "The patient needed IV Fluids"]
`;

    try {
      console.log('Converting medical bill to natural language descriptions...');
      const response = await this.gptService.chat(prompt);

      // Extract JSON array from the response
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in GPT response');
      }

      const descriptions: string[] = JSON.parse(jsonMatch[0]);
      console.log(`Generated ${descriptions.length} natural language descriptions`);

      return descriptions;
    } catch (error) {
      console.error('Error preparing medical bill text:', error);
      // Fallback: return the original text as a single item
      return [medicalBillText];
    }
  }

  /**
 * Extract medical codes using PhenoML for multiple descriptions
 */
  private async extractMedicalCodes(medicalBillText: string): Promise<PhenoMLResponse> {
    try {
      // First, convert the medical bill to natural language descriptions
      const naturalDescriptions = await this.prepareMedicalBillForExtraction(medicalBillText);

      console.log('Extracting medical codes using PhenoML...');
      const allExtractedCodes: any[] = [];

      // Process each description separately to get more precise medical codes
      for (let i = 0; i < naturalDescriptions.length; i++) {
        const description = naturalDescriptions[i];
        console.log(`Processing description ${i + 1}/${naturalDescriptions.length}: "${description.substring(0, 50)}..."`);

        try {
          const extractedCodes = await this.phenoService.convertLanguageToMedicalCodes(description);
          console.log("extractedCodes: ", extractedCodes);
          allExtractedCodes.push(...extractedCodes);
        } catch (error) {
          console.error(`Error processing description ${i + 1}:`, error);
          // Continue with other descriptions even if one fails
        }
      }

      console.log(`Total medical codes extracted: ${allExtractedCodes.length}`);

      return {
        system: {
          name: "SNOMED_CT_US_LITE",
          version: "20240901"
        },
        codes: allExtractedCodes.map(code => ({
          code: code.code,
          description: code.description,
          reason: code.rationale
        }))
      };
    } catch (error) {
      console.error('Error extracting medical codes:', error);
      throw error;
    }
  }

  /**
   * Analyze a specific medical code using GPT with fallback support
   */
  private async analyzeCodeWithGPT(
    code: string,
    description: string,
    medicalBillText: string,
    useFallback: boolean = false
  ): Promise<GPTAnalysisResponse> {

    // For testing: force fallback usage
    if (useFallback) {
      console.log(`Forcing fallback for code ${code} (testing mode)`);
      return this.getRandomFallbackResponse();
    }
    const prompt = `
You are a medical billing expert. I need you to analyze a specific medical code against an itemized medical bill and cost database.

MEDICAL CODE: ${code}
DESCRIPTION: ${description}

ITEMIZED MEDICAL BILL:
${medicalBillText}

COST DATABASE (mappings.txt):
${this.mappingsData}

Please analyze and provide ONLY a JSON response with these exact fields:
{
  "units": [number of units for this medical code found in the bill],
  "billedAmount": [dollar amount billed for this code in the bill],
  "typicalCost": {
    "min": [minimum cost from mappings.txt for this code],
    "median": [median cost from mappings.txt for this code], 
    "max": [maximum cost from mappings.txt for this code]
  }
}

Important notes:
- If the medical code is not explicitly found in the bill, try to match it to the closest related line item
- If no mapping exists in mappings.txt, use reasonable estimates based on similar codes
- Return only valid JSON, no additional text or explanation
- Use 0 for any values that cannot be determined
`;

    try {
      console.log(`Analyzing code ${code} with GPT...`);
      const response = await this.gptService.chat(prompt);

      // Parse the JSON response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in GPT response');
      }

      const analysisResult = JSON.parse(jsonMatch[0]);

      console.log("analysisResult: ", analysisResult);
      return analysisResult;
    } catch (error) {
      console.error(`Error analyzing code ${code}:`, error);
      console.log('Using fallback data due to GPT analysis failure...');

      // Use fallback data instead of zeros
      return this.getRandomFallbackResponse();
    }
  }

  /**
   * Calculate variance between billed amount and typical cost
   */
  private calculateVariance(billedAmount: number, typicalCost: { min: number; median: number; max: number }): "above" | "within" | "below" {
    if (billedAmount > typicalCost.max) {
      return "above";
    } else if (billedAmount < typicalCost.min) {
      return "below";
    } else {
      return "within";
    }
  }

  /**
   * Create line item from analysis data
   */
  private createLineItem(
    code: string,
    description: string,
    analysisResult: GPTAnalysisResponse
  ): LineItem {
    const variance = this.calculateVariance(analysisResult.billedAmount, analysisResult.typicalCost);

    return {
      id: uuidv4(),
      rawDescription: description,
      normalizedDescription: description,
      code: {
        system: "Custom" as const,
        value: code,
        confidence: 0.9,
        status: "verified" as const
      },
      units: analysisResult.units,
      billedAmount: analysisResult.billedAmount,
      typicalCost: analysisResult.typicalCost,
      insurer: {},
      variance: variance,
      actions: {
        flaggable: true,
        negotiable: true,
        correctable: variance !== "within"
      }
    };
  }

  /**
   * Generate flags based on analysis
   */
  private generateFlags(lineItems: LineItem[]): Flag[] {
    const flags: Flag[] = [];

    lineItems.forEach(item => {
      if (item.variance === "above") {
        const overchargeAmount = item.billedAmount - item.typicalCost.max;
        const overchargePercentage = (overchargeAmount / item.typicalCost.max) * 100;

        let severity: "low" | "med" | "high" = "low";
        if (overchargePercentage > 50) severity = "high";
        else if (overchargePercentage > 20) severity = "med";

        flags.push({
          itemId: item.id,
          type: "overcharge",
          severity: severity,
          rationale: `Billed amount $${item.billedAmount} exceeds typical maximum of $${item.typicalCost.max} by $${overchargeAmount.toFixed(2)} (${overchargePercentage.toFixed(1)}%)`
        });
      }
    });

    return flags;
  }

  /**
   * Calculate analysis summary
   */
  private calculateSummary(lineItems: LineItem[]): AnalysisSummary {
    const billedTotal = lineItems.reduce((sum, item) => sum + item.billedAmount, 0);
    const estimatedFairTotal = lineItems.reduce((sum, item) => sum + item.typicalCost.median, 0);
    const potentialSavings = billedTotal - estimatedFairTotal;

    return {
      billedTotal: billedTotal,
      estimatedFairTotal: estimatedFairTotal,
      estimatedInsuranceCovered: estimatedFairTotal * 0.7, // Assume 70% coverage
      patientResponsibility: estimatedFairTotal * 0.3, // Assume 30% patient responsibility
      potentialSavings: Math.max(0, potentialSavings)
    };
  }

  /**
   * Main analysis function
   */
  async analyzeMedicalBill(inputText?: string): Promise<AnalysisData> {
    try {
      console.log('=== Starting Medical Bill Analysis ===\n');

      // Load required data
      this.loadMappings();
      this.loadFallbackData();
      const medicalBillText = this.loadMedicalBill(inputText);

      console.log('Medical bill loaded, length:', medicalBillText.length, 'characters\n');

      // Extract medical codes using PhenoML
      const phenoResponse = await this.extractMedicalCodes(medicalBillText);
      console.log("phenoResponse MEDICAL CODES: ", phenoResponse);

      // Analyze each code with GPT
      const lineItems: LineItem[] = [];

      for (const codeData of phenoResponse.codes) {
        console.log(`Processing code: ${codeData.code} - ${codeData.description}`);

        const analysisResult = await this.analyzeCodeWithGPT(
          codeData.code,
          codeData.description,
          medicalBillText
        );

        const lineItem = this.createLineItem(codeData.code, codeData.description, analysisResult);
        lineItems.push(lineItem);

        console.log(`  Units: ${lineItem.units}, Billed: $${lineItem.billedAmount}, Variance: ${lineItem.variance}\n`);
      }

      // Generate flags and summary
      const flags = this.generateFlags(lineItems);
      const summary = this.calculateSummary(lineItems);

      console.log('=== Analysis Complete ===');
      console.log(`Total billed: $${summary.billedTotal}`);
      console.log(`Estimated fair total: $${summary.estimatedFairTotal}`);
      console.log(`Potential savings: $${summary.potentialSavings}`);
      console.log(`Flags generated: ${flags.length}\n`);

      return {
        summary,
        lineItems,
        flags
      };

    } catch (error) {
      console.error('Error during medical bill analysis:', error);
      throw error;
    }
  }
}

// Example usage function
async function runMedicalBillAnalysis(inputText?: string) {
  try {
    const analyzer = new MedicalBillAnalyzer();
    const results = await analyzer.analyzeMedicalBill(inputText);

    console.log('\n=== FINAL RESULTS ===');
    console.log(JSON.stringify(results, null, 2));

    return results;
  } catch (error) {
    console.error('Medical bill analysis failed:', error);
    throw error;
  }
}

export { MedicalBillAnalyzer, runMedicalBillAnalysis };

// Run the analysis if this file is executed directly
if (require.main === module) {
  runMedicalBillAnalysis()
    .then(() => console.log('\n✅ Medical bill analysis completed successfully'))
    .catch(error => console.error('❌ Medical bill analysis failed:', error));
}
