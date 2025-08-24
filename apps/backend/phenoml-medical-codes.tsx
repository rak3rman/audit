const phenomlexper = require('@api/phenomlexper');

interface ExtractedCode {
    code: string;
    description: string;
    longDescription?: string;
    rationale?: string;
}

class PhenoConstraeService {
    private username: string;
    private password: string;
    private isAuthenticated: boolean = false;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    /**
     * Authenticate with Pheno.ml API - hybrid approach
     */
    async authenticate(): Promise<void> {
        try {
            // Configure the server URL for the hackathon instance
            phenomlexper.server('https://phenoml-hackathon.app.pheno.ml');

            // Step 1: Get bearer token using manual fetch (SDK doesn't include auth endpoint)
            const credentials = `${this.username}:${this.password}`;
            const encodedCredentials = Buffer.from(credentials, 'utf-8').toString('base64');

            const response = await fetch('https://phenoml-hackathon.app.pheno.ml/auth/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${encodedCredentials}`
                }
            });

            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
            }

            const authResponse = await response.json();
            const bearerToken = authResponse.token;
            console.log('Retrieved auth token:', bearerToken.substring(0, 20) + '...');

            // Step 2: Use the bearer token with the SDK for subsequent API calls
            phenomlexper.auth(bearerToken);

            console.log('Successfully authenticated with Pheno.ml SDK');
            console.log("this is the bearerToken: ", bearerToken);
            this.isAuthenticated = true;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    /**
     * Ensure we have valid authentication
     */
    private async ensureAuthenticated(): Promise<void> {
        if (!this.isAuthenticated) {
            await this.authenticate();
        }
    }

    /**
     * Convert natural language text to medical codes using the official SDK
     */
    async convertLanguageToMedicalCodes(
        text: string,
        systemName: string = 'SNOMED_CT_US_LITE'
    ): Promise<ExtractedCode[]> {
        await this.ensureAuthenticated();

        try {
            const response = await phenomlexper.postConstrueExtract({
                text: text,
                system: {
                    name: "SNOMED_CT_US_LITE",
                    version: "20240901",
                },
                config: {
                    chunking_method: 'none',
                    max_codes_per_chunk: 20,
                    code_similarity_filter: 0.9,
                    include_rationale: true
                }
            });

            if (response.data && response.data.codes) {
                return response.data.codes;
            } else {
                throw new Error('No codes returned from API');
            }
        } catch (error) {
            console.error('Error extracting medical codes:', error);
            throw error;
        }
    }
}

// Simple usage function
async function convertLanguageToMedicalCodes() {
    const phenoService = new PhenoConstraeService(
        'ryannewkirk2024@u.northwestern.edu',
        'KZI0nTvkeAqmfdS'
    );

    // Sample medical text
    const medicalText = `
        Patient presents with chest pain and shortness of breath.
    `;

    try {
        console.log('Converting text to medical codes using official SDK...');
        console.log('Input text:', medicalText.trim());
        console.log('\n--- Processing ---\n');

        const extractedCodes = await phenoService.convertLanguageToMedicalCodes(medicalText);

        console.log('=== EXTRACTED MEDICAL CODES ===');
        console.log(`Total codes found: ${extractedCodes.length}\n`);

        extractedCodes.forEach((code, index) => {
            console.log(`${index + 1}. Code: ${code.code}`);
            console.log(`   Description: ${code.description}`);
            if (code.longDescription) {
                console.log(`   Long Description: ${code.longDescription}`);
            }
            if (code.rationale) {
                console.log(`   Rationale: ${code.rationale}`);
            }
            console.log('');
        });

        return extractedCodes;

    } catch (error) {
        console.error('Failed to convert text to medical codes:', error);
        throw error;
    }
}

export { PhenoConstraeService, convertLanguageToMedicalCodes };

// Run the function only if this file is executed directly (not imported)
if (require.main === module) {
    convertLanguageToMedicalCodes()
        .then(result => console.log('Processing completed successfully'))
        .catch(error => console.error('Processing failed:', error));
}