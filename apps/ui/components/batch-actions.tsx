"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface BatchActionsProps {
  selectedItems: Set<string>
  totalItems: number
  onSelectAll: (checked: boolean) => void
}

export function BatchActions({ selectedItems, totalItems, onSelectAll }: BatchActionsProps) {
  const router = useRouter()
  const selectedCount = selectedItems.size
  const allSelected = selectedCount === totalItems

  const handleGenerateNegotiation = () => {
    if (selectedCount === 0) return
    const selectedItemIds = Array.from(selectedItems)
    router.push(`/negotiate?items=${selectedItemIds.join(",")}`)
  }

  const handleExport = () => {
    if (selectedCount === 0) return
    // Mock export - in real app would generate CSV/PDF
    console.log("Exporting:", Array.from(selectedItems))
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Checkbox 
            id="select-all" 
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className="border-2 border-gray-300 bg-white data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All
          </label>
          <span className="text-sm text-muted-foreground">
            {selectedCount} of {totalItems} items selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={selectedCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </Button>
          <Button 
            size="sm" 
            onClick={handleGenerateNegotiation}
            disabled={selectedCount === 0}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Generate Negotiation
          </Button>
        </div>
      </div>
    </Card>
  )
}
