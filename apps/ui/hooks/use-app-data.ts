"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HistoryItem {
  id: string
  fileName: string
  provider: string
  uploadDate: string
  lastUpdated: string
  status: "draft" | "reviewed" | "pending" | "negotiated" | "resolved"
  totalBilled: number
  potentialSavings: number
  actualSavings: number
  flaggedCount: number
  itemCount: number
  negotiationSent: boolean
  tags: string[]
}

export interface AnalysisSummary {
  billedTotal: number
  estimatedFairTotal: number
  estimatedInsuranceCovered: number
  patientResponsibility: number
  potentialSavings: number
}

export interface CodeInfo {
  system: "CPT" | "HCPCS" | "ICD10" | "Custom"
  value: string
  confidence: number
  status: "verified" | "suggested" | "uncertain"
}

export interface SuggestedCode {
  system: string
  value: string
  confidence: number
  rationale: string
}

export interface InsurerInfo {
  allowedAmount?: number
  coveredAmount?: number
  patientResponsibility?: number
}

export interface LineItem {
  id: string
  rawDescription: string
  normalizedDescription: string
  code?: CodeInfo
  suggestedCode?: SuggestedCode
  units: number
  billedAmount: number
  typicalCost: { min: number; median: number; max: number }
  insurer: InsurerInfo
  variance: "above" | "within" | "below"
  actions: { flaggable: boolean; negotiable: boolean; correctable: boolean }
}

export interface Flag {
  itemId: string
  type: "overcharge" | "codeMismatch" | "unbundled" | "duplicate"
  severity: "low" | "med" | "high"
  rationale: string
}

export interface AnalysisData {
  summary: AnalysisSummary
  lineItems: LineItem[]
  flags: Flag[]
}

export interface NegotiationItem {
  id: string
  description: string
  code: string
  billedAmount: number
  typicalRange: { min: number; max: number; median: number }
  allowedAmount: number
  variance: "above" | "within" | "below"
  evidence: string
}

export interface UploadedFile {
  id: string
  file: File
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  error?: string
}

export interface CodeDetails {
  name: string
  synonyms: string[]
  modifiers: string[]
  documentation: string
  bundling: string[]
}

export interface RegionalPriceData {
  region: string
  min: number
  median: number
  max: number
  percentile90: number
}

export interface AlternativeCode {
  value: string
  label: string
  confidence: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockHistoryData: HistoryItem[] = [
  {
    id: "analysis-001",
    fileName: "Medical_Bill_Jan_2024.pdf",
    provider: "City General Hospital",
    uploadDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    status: "negotiated",
    totalBilled: 2847.5,
    potentialSavings: 923.75,
    actualSavings: 650.0,
    flaggedCount: 3,
    itemCount: 8,
    negotiationSent: true,
    tags: ["emergency", "imaging"],
  },
  {
    id: "analysis-002",
    fileName: "Routine_Checkup_Dec_2023.pdf",
    provider: "Family Health Clinic",
    uploadDate: "2023-12-10",
    lastUpdated: "2023-12-12",
    status: "reviewed",
    totalBilled: 485.0,
    potentialSavings: 125.0,
    actualSavings: 0,
    flaggedCount: 1,
    itemCount: 4,
    negotiationSent: false,
    tags: ["routine", "preventive"],
  },
  {
    id: "analysis-003",
    fileName: "Specialist_Visit_Nov_2023.pdf",
    provider: "Metro Cardiology Associates",
    uploadDate: "2023-11-22",
    lastUpdated: "2023-11-25",
    status: "pending",
    totalBilled: 1250.0,
    potentialSavings: 380.0,
    actualSavings: 0,
    flaggedCount: 2,
    itemCount: 5,
    negotiationSent: true,
    tags: ["specialist", "cardiology"],
  },
  {
    id: "analysis-004",
    fileName: "Lab_Results_Oct_2023.pdf",
    provider: "QuickLab Diagnostics",
    uploadDate: "2023-10-08",
    lastUpdated: "2023-10-15",
    status: "resolved",
    totalBilled: 320.0,
    potentialSavings: 95.0,
    actualSavings: 95.0,
    flaggedCount: 1,
    itemCount: 3,
    negotiationSent: true,
    tags: ["lab", "diagnostic"],
  },
  {
    id: "analysis-005",
    fileName: "Physical_Therapy_Sep_2023.pdf",
    provider: "Wellness Physical Therapy",
    uploadDate: "2023-09-14",
    lastUpdated: "2023-09-14",
    status: "draft",
    totalBilled: 680.0,
    potentialSavings: 180.0,
    actualSavings: 0,
    flaggedCount: 2,
    itemCount: 6,
    negotiationSent: false,
    tags: ["therapy", "rehabilitation"],
  },
]

export const mockAnalysisData: AnalysisData = {
  summary: {
    billedTotal: 2847.5,
    estimatedFairTotal: 1923.75,
    estimatedInsuranceCovered: 1538.0,
    patientResponsibility: 385.75,
    potentialSavings: 923.75,
  },
  lineItems: [
    {
      id: "1",
      rawDescription: "Office Visit - Established Patient",
      normalizedDescription: "Established Patient Office Visit (Level 3)",
      code: {
        system: "CPT",
        value: "99213",
        confidence: 0.95,
        status: "verified",
      },
      units: 1,
      billedAmount: 285.0,
      typicalCost: { min: 180, median: 220, max: 260 },
      insurer: {
        allowedAmount: 200,
        coveredAmount: 160,
        patientResponsibility: 40,
      },
      variance: "above",
      actions: { flaggable: true, negotiable: true, correctable: false },
    },
    {
      id: "2",
      rawDescription: "Blood Test - Comprehensive Panel",
      normalizedDescription: "Comprehensive Metabolic Panel",
      code: {
        system: "CPT",
        value: "80053",
        confidence: 0.88,
        status: "suggested",
      },
      suggestedCode: {
        system: "CPT",
        value: "80048",
        confidence: 0.92,
        rationale: "Basic metabolic panel more appropriate for routine screening",
      },
      units: 1,
      billedAmount: 156.0,
      typicalCost: { min: 45, median: 65, max: 85 },
      insurer: {
        allowedAmount: 75,
        coveredAmount: 60,
        patientResponsibility: 15,
      },
      variance: "above",
      actions: { flaggable: true, negotiable: true, correctable: true },
    },
    {
      id: "3",
      rawDescription: "X-Ray Chest 2 Views",
      normalizedDescription: "Chest X-Ray, 2 Views",
      code: {
        system: "CPT",
        value: "71020",
        confidence: 0.98,
        status: "verified",
      },
      units: 1,
      billedAmount: 125.0,
      typicalCost: { min: 95, median: 115, max: 135 },
      insurer: {
        allowedAmount: 105,
        coveredAmount: 84,
        patientResponsibility: 21,
      },
      variance: "within",
      actions: { flaggable: false, negotiable: false, correctable: false },
    },
  ],
  flags: [
    {
      itemId: "1",
      type: "overcharge",
      severity: "high",
      rationale: "Billed amount 30% above typical range for this procedure",
    },
    {
      itemId: "2",
      type: "codeMismatch",
      severity: "med",
      rationale: "Comprehensive panel may be overbilling for basic screening",
    },
  ],
}

export const mockCodeDetails: Record<string, CodeDetails> = {
  "99213": {
    name: "Office or other outpatient visit for the evaluation and management of an established patient",
    synonyms: ["Established patient office visit", "Level 3 E&M visit"],
    modifiers: ["25 - Significant, separately identifiable evaluation and management service"],
    documentation: "https://www.cms.gov/medicare/coding/place-of-service-codes/place_of_service_code_set",
    bundling: ["Cannot be billed with 99214 on same day", "May require modifier 25 with procedures"],
  },
  "80053": {
    name: "Comprehensive metabolic panel",
    synonyms: ["CMP", "Chemistry panel", "Basic metabolic panel plus liver function"],
    modifiers: [],
    documentation: "https://www.cms.gov/medicare/coverage/coverage-with-evidence-development",
    bundling: [
      "Includes glucose, BUN, creatinine, sodium, potassium, chloride, CO2, ALT, AST, bilirubin, alkaline phosphatase, total protein, albumin",
    ],
  },
  "71020": {
    name: "Radiologic examination, chest, 2 views, frontal and lateral",
    synonyms: ["Chest X-ray", "CXR", "Chest radiograph"],
    modifiers: [],
    documentation: "https://www.cms.gov/medicare/coverage/coverage-with-evidence-development",
    bundling: ["Cannot be billed with 71021 (3 views) on same day"],
  },
}

export const mockRegionalData = {
  regions: ["National", "Northeast", "Southeast", "Midwest", "Southwest", "West"],
  priceData: [
    { region: "National", min: 180, median: 220, max: 260, percentile90: 245 },
    { region: "Northeast", min: 200, median: 250, max: 300, percentile90: 280 },
    { region: "Southeast", min: 160, median: 200, max: 240, percentile90: 225 },
    { region: "Midwest", min: 170, median: 210, max: 250, percentile90: 235 },
    { region: "Southwest", min: 150, median: 190, max: 230, percentile90: 215 },
    { region: "West", min: 190, median: 230, max: 270, percentile90: 255 },
  ],
}

export const mockAlternativeCodes: AlternativeCode[] = [
  { value: "99214", label: "Office visit, established patient, level 4", confidence: 0.85 },
  { value: "99212", label: "Office visit, established patient, level 2", confidence: 0.72 },
  { value: "99215", label: "Office visit, established patient, level 5", confidence: 0.45 },
]

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useAppData() {
  const router = useRouter()
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // History/Analysis Data
  const [historyData, setHistoryData] = useState<HistoryItem[]>(mockHistoryData)
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData>(mockAnalysisData)
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null)
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [selectedHistoryItems, setSelectedHistoryItems] = useState<Set<string>>(new Set())
  const [selectedLineItems, setSelectedLineItems] = useState<Set<string>>(new Set())
  
  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [textInput, setTextInput] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Negotiation State
  const [negotiationItems, setNegotiationItems] = useState<NegotiationItem[]>([])
  const [negotiationMessage, setNegotiationMessage] = useState("")
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
  const [isSendingNegotiation, setIsSendingNegotiation] = useState(false)
  
  // Item Detail State
  const [selectedRegion, setSelectedRegion] = useState("National")
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set())
  
  // Code Verification State
  const [codeSearchQuery, setCodeSearchQuery] = useState("")
  const [isSearchingCodes, setIsSearchingCodes] = useState(false)
  const [codeSearchResults, setCodeSearchResults] = useState<AlternativeCode[]>([])
  
  // Negotiation Composer State
  const [templateType, setTemplateType] = useState<"email" | "letter" | "portal">("email")
  const [voiceTone, setVoiceTone] = useState<"concise" | "empathetic" | "firm">("empathetic")
  const [customMessage, setCustomMessage] = useState("")
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false)
  
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesProvider = providerFilter === "all" || item.provider === providerFilter

      return matchesSearch && matchesStatus && matchesProvider
    })
  }, [historyData, searchQuery, statusFilter, providerFilter])

  const uniqueProviders = useMemo(() => {
    return Array.from(new Set(historyData.map((item) => item.provider)))
  }, [historyData])

  const summaryStats = useMemo(() => {
    const totalSavings = historyData.reduce((sum, item) => sum + item.actualSavings, 0)
    const totalAnalyzed = historyData.length
    const totalNegotiated = historyData.filter((item) => item.negotiationSent).length
    const averageSavings = totalNegotiated > 0 ? totalSavings / totalNegotiated : 0

    return {
      totalSavings,
      totalAnalyzed,
      totalNegotiated,
      averageSavings,
    }
  }, [historyData])
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  const formatCurrency = useCallback((amount: number) => `$${amount.toFixed(2)}`, [])
  
  const formatDate = useCallback((dateString: string) => new Date(dateString).toLocaleDateString(), [])

  const getStatusConfig = useCallback((status: HistoryItem["status"]) => {
    const configs = {
      draft: {
        label: "Draft",
        className: "bg-muted text-muted-foreground border-muted",
        description: "Analysis saved but not reviewed",
      },
      reviewed: {
        label: "Reviewed",
        className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
        description: "Analysis completed, ready for action",
      },
      pending: {
        label: "Pending",
        className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
        description: "Negotiation sent, awaiting response",
      },
      negotiated: {
        label: "Negotiated",
        className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
        description: "Provider responded, partial savings achieved",
      },
      resolved: {
        label: "Resolved",
        className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
        description: "Full resolution achieved",
      },
    }
    return configs[status]
  }, [])
  
  // ============================================================================
  // HISTORY/Analysis ACTIONS
  // ============================================================================
  
  const loadAnalysis = useCallback(async (analysisId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const analysis = historyData.find(item => item.id === analysisId)
      if (analysis) {
        setSelectedAnalysisId(analysisId)
        // In a real app, this would fetch the full analysis data
        setCurrentAnalysis(mockAnalysisData)
      }
    } catch (error) {
      console.error('Failed to load analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }, [historyData])

  const deleteAnalysis = useCallback(async (itemId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setHistoryData(prev => prev.filter(item => item.id !== itemId))
      setSelectedHistoryItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    } catch (error) {
      console.error('Failed to delete analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const duplicateAnalysis = useCallback(async (itemId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const originalItem = historyData.find(item => item.id === itemId)
      if (originalItem) {
        const newItem: HistoryItem = {
          ...originalItem,
          id: `analysis-${Date.now()}`,
          fileName: `${originalItem.fileName} (Copy)`,
          status: "draft",
          uploadDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          actualSavings: 0,
          negotiationSent: false,
        }
        setHistoryData(prev => [newItem, ...prev])
      }
    } catch (error) {
      console.error('Failed to duplicate analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }, [historyData])

  const downloadReport = useCallback(async (itemId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Downloading report for:', itemId)
    } catch (error) {
      console.error('Failed to download report:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // ============================================================================
  // FILE UPLOAD ACTIONS
  // ============================================================================
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      const newUploadedFiles: UploadedFile[] = droppedFiles.map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        status: "pending",
        progress: 0,
      }))
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const newUploadedFiles: UploadedFile[] = selectedFiles.map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        status: "pending",
        progress: 0,
      }))
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    }
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const analyzeFiles = useCallback(async () => {
    setIsAnalyzing(true)
    
    try {
      // Simulate file upload and analysis
      for (const uploadedFile of uploadedFiles.filter(file => file.status === "pending")) {
        setUploadedFiles(prev => prev.map(file => 
          file.id === uploadedFile.id 
            ? { ...file, status: "uploading" as const }
            : file
        ))

        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadedFiles(prev => prev.map(file => 
            file.id === uploadedFile.id 
              ? { ...file, progress }
              : file
          ))
        }

        setUploadedFiles(prev => prev.map(file => 
          file.id === uploadedFile.id 
            ? { ...file, status: "completed" as const, progress: 100 }
            : file
        ))
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create new analysis
      const newAnalysis: HistoryItem = {
        id: `analysis-${Date.now()}`,
        fileName: uploadedFiles[0]?.file.name || "New Analysis",
        provider: "Unknown Provider",
        uploadDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        status: "draft",
        totalBilled: 0,
        potentialSavings: 0,
        actualSavings: 0,
        flaggedCount: 0,
        itemCount: 0,
        negotiationSent: false,
        tags: [],
      }
      
      setHistoryData(prev => [newAnalysis, ...prev])
      router.push(`/results?id=${newAnalysis.id}`)
      
      return true
    } catch (error) {
      console.error('Analysis failed:', error)
      return false
    } finally {
      setIsAnalyzing(false)
    }
  }, [uploadedFiles, router])
  
  // ============================================================================
  // NEGOTIATION ACTIONS
  // ============================================================================
  
  const generateNegotiationMessage = useCallback(async () => {
    setIsGeneratingMessage(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedMessage = `Dear Billing Department,

I am writing regarding my recent medical bill. After conducting thorough research on fair market rates for the services provided, I have identified several discrepancies that I would like to bring to your attention.

The following charges appear to be significantly above typical market rates:

${negotiationItems.map(item => `
• ${item.description} (Code: ${item.code})
  - Current charge: $${item.billedAmount.toFixed(2)}
  - Market range: $${item.typicalRange.min.toFixed(2)} - $${item.typicalRange.max.toFixed(2)}
  - Recommended fair price: $${item.allowedAmount.toFixed(2)}
  - ${item.evidence}
`).join('')}

I am requesting a review of these charges and would appreciate consideration for adjustment to fair market rates. I am prepared to work with you to reach a mutually agreeable resolution and am open to discussing payment arrangements.

I value the care provided and am committed to fulfilling my financial obligations fairly. Please contact me to discuss this matter further.

Thank you for your time and consideration.

Sincerely,
[Your Name]`

      setNegotiationMessage(generatedMessage)
    } catch (error) {
      console.error('Failed to generate message:', error)
    } finally {
      setIsGeneratingMessage(false)
    }
  }, [negotiationItems])

  const sendNegotiation = useCallback(async () => {
    setIsSendingNegotiation(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Negotiation sent:', negotiationMessage)
      
      // Update analysis status
      if (selectedAnalysisId) {
        setHistoryData(prev => prev.map(item => 
          item.id === selectedAnalysisId 
            ? { ...item, status: "pending", negotiationSent: true }
            : item
        ))
      }
    } catch (error) {
      console.error('Failed to send negotiation:', error)
    } finally {
      setIsSendingNegotiation(false)
    }
  }, [negotiationMessage, selectedAnalysisId])
  
  // ============================================================================
  // CODE VERIFICATION ACTIONS
  // ============================================================================
  
  const searchCodes = useCallback(async (query: string) => {
    setIsSearchingCodes(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const filteredResults = mockAlternativeCodes.filter(code => 
        code.value.toLowerCase().includes(query.toLowerCase()) ||
        code.label.toLowerCase().includes(query.toLowerCase())
      )
      
      setCodeSearchResults(filteredResults)
    } catch (error) {
      console.error('Code search failed:', error)
      setCodeSearchResults([])
    } finally {
      setIsSearchingCodes(false)
    }
  }, [])

  const getFileIcon = useCallback((file: File) => {
    if (file.type.includes("image")) return "image"
    if (file.type.includes("pdf")) return "pdf"
    if (file.type.includes("spreadsheet") || file.name.endsWith(".csv")) return "spreadsheet"
    return "document"
  }, [])

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  const hasValidContent = useCallback(() => {
    return uploadedFiles.length > 0 || textInput.trim().length > 0
  }, [uploadedFiles.length, textInput])

  // ============================================================================
  // NEGOTIATION COMPOSER FUNCTIONS
  // ============================================================================
  
  const getNegotiationTotals = useCallback((items: NegotiationItem[]) => {
    const totalBilled = items.reduce((sum, item) => sum + item.billedAmount, 0)
    const totalFair = items.reduce((sum, item) => sum + item.allowedAmount, 0)
    const potentialSavings = totalBilled - totalFair
    
    return { totalBilled, totalFair, potentialSavings }
  }, [])

  const generateNegotiationText = useCallback((items: NegotiationItem[]) => {
    const totals = getNegotiationTotals(items)
    
    const templates = {
      email: {
        concise: generateConciseEmail(items, totals),
        empathetic: generateEmpatheticEmail(items, totals),
        firm: generateFirmEmail(items, totals),
      },
      letter: {
        concise: generateConciseLetter(items, totals),
        empathetic: generateEmpatheticLetter(items, totals),
        firm: generateFirmLetter(items, totals),
      },
      portal: {
        concise: generateConcisePortal(items, totals),
        empathetic: generateEmpatheticPortal(items, totals),
        firm: generateFirmPortal(items, totals),
      },
    }

    return templates[templateType][voiceTone]
  }, [templateType, voiceTone, getNegotiationTotals])

  const generateConciseEmail = useCallback((items: NegotiationItem[], totals: any) => `Subject: Request for Bill Review - Account [Account Number]

Dear Billing Department,

I am writing to request a review of the following charges on my recent medical bill:

${items
  .map(
    (item) => `
• ${item.description} (${item.code}): ${formatCurrency(item.billedAmount)}
  Typical range: ${formatCurrency(item.typicalRange.min)} - ${formatCurrency(item.typicalRange.max)}
  Evidence: ${item.evidence}
`,
  )
  .join("")}

Total billed: ${formatCurrency(totals.totalBilled)}
Fair market value: ${formatCurrency(totals.totalFair)}
Requested adjustment: ${formatCurrency(totals.potentialSavings)}

Please review these charges and provide an adjusted bill reflecting fair market rates.

Thank you for your prompt attention to this matter.

Best regards,
[Your Name]
[Contact Information]`, [formatCurrency])

  const generateEmpatheticEmail = useCallback((items: NegotiationItem[], totals: any) => `Subject: Request for Billing Review and Assistance

Dear Billing Team,

I hope this message finds you well. I am reaching out regarding my recent medical bill and would greatly appreciate your assistance in reviewing some charges that appear to be above typical market rates.

As a patient committed to paying fair and reasonable charges for medical services, I have conducted research on the following items:

${items
  .map(
    (item) => `
• ${item.description} (${item.code}): ${formatCurrency(item.billedAmount)}
  Typical range: ${formatCurrency(item.typicalRange.min)} - ${formatCurrency(item.typicalRange.max)}
  Evidence: ${item.evidence}
`,
  )
  .join("")}

I understand that medical billing can be complex, and I value the care provided by your facility. However, I believe these charges may warrant review given the significant variance from typical market rates.

Total billed: ${formatCurrency(totals.totalBilled)}
Fair market value: ${formatCurrency(totals.totalFair)}
Requested adjustment: ${formatCurrency(totals.potentialSavings)}

I would be grateful for your consideration of an adjustment to reflect fair market rates. I am open to discussing payment arrangements and would appreciate the opportunity to resolve this matter amicably.

Thank you for your time and understanding.

Warm regards,
[Your Name]
[Contact Information]`, [formatCurrency])

  const generateFirmEmail = useCallback((items: NegotiationItem[], totals: any) => `Subject: Formal Request for Bill Review and Adjustment

Dear Billing Department,

I am writing to formally request a review and adjustment of the charges on my recent medical bill. After conducting thorough research on fair market rates for the services provided, I have identified significant discrepancies that require immediate attention.

The following charges appear to be substantially above typical market rates:

${items
  .map(
    (item) => `
• ${item.description} (${item.code}): ${formatCurrency(item.billedAmount)}
  Typical range: ${formatCurrency(item.typicalRange.min)} - ${formatCurrency(item.typicalRange.max)}
  Evidence: ${item.evidence}
`,
  )
  .join("")}

Total billed: ${formatCurrency(totals.totalBilled)}
Fair market value: ${formatCurrency(totals.totalFair)}
Requested adjustment: ${formatCurrency(totals.potentialSavings)}

I expect a prompt review of these charges and an adjusted bill reflecting fair market rates. I am prepared to escalate this matter if necessary and will consider all available options to ensure fair treatment.

Please respond within 10 business days with your proposed resolution.

Sincerely,
[Your Name]
[Contact Information]`, [formatCurrency])

  const generateConciseLetter = useCallback((items: NegotiationItem[], totals: any) => {
    return generateConciseEmail(items, totals).replace("Subject: Request for Bill Review - Account [Account Number]\n\n", "")
  }, [generateConciseEmail])

  const generateEmpatheticLetter = useCallback((items: NegotiationItem[], totals: any) => {
    return generateEmpatheticEmail(items, totals).replace("Subject: Request for Billing Review and Assistance\n\n", "")
  }, [generateEmpatheticEmail])

  const generateFirmLetter = useCallback((items: NegotiationItem[], totals: any) => {
    return generateFirmEmail(items, totals).replace("Subject: Formal Request for Bill Review and Adjustment\n\n", "")
  }, [generateFirmEmail])

  const generateConcisePortal = useCallback((items: NegotiationItem[], totals: any) => `Bill Review Request

I am requesting a review of the following charges that appear to be above typical market rates:

${items
  .map(
    (item) => `
• ${item.description} (${item.code}): ${formatCurrency(item.billedAmount)}
  Typical range: ${formatCurrency(item.typicalRange.min)} - ${formatCurrency(item.typicalRange.max)}
  Evidence: ${item.evidence}
`,
  )
  .join("")}

Total billed: ${formatCurrency(totals.totalBilled)}
Fair market value: ${formatCurrency(totals.totalFair)}
Requested adjustment: ${formatCurrency(totals.potentialSavings)}

Please review and provide an adjusted bill reflecting fair market rates.`, [formatCurrency])

  const generateEmpatheticPortal = useCallback((items: NegotiationItem[], totals: any) => `Bill Review Request

I would appreciate your assistance in reviewing some charges on my recent medical bill that appear to be above typical market rates. I value the care provided and am committed to paying fair charges.

The following items may warrant review:

${items
  .map(
    (item) => `
• ${item.description} (${item.code}): ${formatCurrency(item.billedAmount)}
  Typical range: ${formatCurrency(item.typicalRange.min)} - ${formatCurrency(item.typicalRange.max)}
  Evidence: ${item.evidence}
`,
  )
  .join("")}

Total billed: ${formatCurrency(totals.totalBilled)}
Fair market value: ${formatCurrency(totals.totalFair)}
Requested adjustment: ${formatCurrency(totals.potentialSavings)}

I am open to discussing payment arrangements and would appreciate consideration for an adjustment to reflect fair market rates.`, [formatCurrency])

  const generateFirmPortal = useCallback((items: NegotiationItem[], totals: any) => `Bill Review Request

I am formally requesting a review and adjustment of the charges on my recent medical bill. After researching fair market rates, I have identified significant discrepancies that require immediate attention.

The following charges appear to be substantially above typical market rates:

${items
  .map(
    (item) => `
• ${item.description} (${item.code}): ${formatCurrency(item.billedAmount)}
  Typical range: ${formatCurrency(item.typicalRange.min)} - ${formatCurrency(item.typicalRange.max)}
  Evidence: ${item.evidence}
`,
  )
  .join("")}

Total billed: ${formatCurrency(totals.totalBilled)}
Fair market value: ${formatCurrency(totals.totalFair)}
Requested adjustment: ${formatCurrency(totals.potentialSavings)}

I expect a prompt review and adjusted bill reflecting fair market rates.`, [formatCurrency])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }, [])

  const downloadAsText = useCallback((text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])
  
  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================
  
  const toggleHistoryItemSelection = useCallback((itemId: string) => {
    setSelectedHistoryItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }, [])

  const selectAllHistoryItems = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedHistoryItems(new Set(filteredHistory.map(item => item.id)))
    } else {
      setSelectedHistoryItems(new Set())
    }
  }, [filteredHistory])

  const toggleLineItemSelection = useCallback((itemId: string) => {
    setSelectedLineItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }, [])

  const selectAllLineItems = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedLineItems(new Set(currentAnalysis.lineItems.map(item => item.id)))
    } else {
      setSelectedLineItems(new Set())
    }
  }, [currentAnalysis.lineItems])

  const getFlagsForItem = useCallback((itemId: string) => {
    return currentAnalysis.flags.filter(flag => flag.itemId === itemId)
  }, [currentAnalysis.flags])
  
  // ============================================================================
  // NAVIGATION ACTIONS
  // ============================================================================
  
  const viewAnalysis = useCallback((item: HistoryItem) => {
    router.push(`/results?id=${item.id}`)
  }, [router])

  const createNegotiation = useCallback((item: HistoryItem) => {
    router.push(`/negotiate?analysis=${item.id}`)
  }, [router])
  
  // ============================================================================
  // RETURN OBJECT
  // ============================================================================
  
  return {
    // Data
    historyData,
    filteredHistory,
    currentAnalysis,
    selectedAnalysisId,
    uniqueProviders,
    summaryStats,
    uploadedFiles,
    textInput,
    negotiationItems,
    negotiationMessage,
    mockCodeDetails,
    mockRegionalData,
    mockAlternativeCodes,
    
         // UI State
     searchQuery,
     statusFilter,
     providerFilter,
     selectedHistoryItems,
     selectedLineItems,
     dragActive,
     isAnalyzing,
     isGeneratingMessage,
     isSendingNegotiation,
     selectedRegion,
     flaggedItems,
     codeSearchQuery,
     isSearchingCodes,
     codeSearchResults,
     isLoading,
     templateType,
     voiceTone,
     customMessage,
    
    // Setters
    setSearchQuery,
    setStatusFilter,
    setProviderFilter,
         setTextInput,
     setNegotiationItems,
     setNegotiationMessage,
     setSelectedRegion,
     setCodeSearchQuery,
     setTemplateType,
     setVoiceTone,
     setCustomMessage,
    
    // Utility Functions
    formatCurrency,
    formatDate,
    getStatusConfig,
    
    // Actions
    loadAnalysis,
    deleteAnalysis,
    duplicateAnalysis,
    downloadReport,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
    analyzeFiles,
    generateNegotiationMessage,
    sendNegotiation,
         searchCodes,
     getFileIcon,
     formatFileSize,
     hasValidContent,
     getNegotiationTotals,
     generateNegotiationText,
     copyToClipboard,
     downloadAsText,
     toggleHistoryItemSelection,
     selectAllHistoryItems,
     toggleLineItemSelection,
     selectAllLineItems,
     getFlagsForItem,
     viewAnalysis,
     createNegotiation,
  }
}
