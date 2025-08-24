"use client"

import { ResultsHeader } from "@/components/results-header"
import { LineItemsTable } from "@/components/line-items-table"
import { BatchActions } from "@/components/batch-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppData } from "@/hooks/use-app-data"

export default function ResultsPage() {
  const router = useRouter()
  const {
    currentAnalysis: analysisData,
    selectedLineItems: selectedItems,
    selectAllLineItems: selectAll,
    toggleLineItemSelection: toggleItemSelection,
    getFlagsForItem,
  } = useAppData()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/history")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Bill Analysis Results
          </h1>
          <p className="text-muted-foreground">Review your medical bill analysis and take action on flagged items</p>
        </div>

        <div className="space-y-6">
          <ResultsHeader summary={analysisData.summary} />

          <div className="space-y-4">
            <BatchActions 
              selectedItems={selectedItems}
              totalItems={analysisData.lineItems.length}
              onSelectAll={selectAll}
            />
            <LineItemsTable 
              items={analysisData.lineItems} 
              flags={analysisData.flags}
              selectedItems={selectedItems}
              onSelectionChange={(newSelection) => {
                // Convert the Set to individual toggle calls
                const currentSet = new Set(selectedItems)
                const newSet = new Set(newSelection)
                
                // Find items that were added
                for (const itemId of newSet) {
                  if (!currentSet.has(itemId)) {
                    toggleItemSelection(itemId)
                  }
                }
                
                // Find items that were removed
                for (const itemId of currentSet) {
                  if (!newSet.has(itemId)) {
                    toggleItemSelection(itemId)
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
