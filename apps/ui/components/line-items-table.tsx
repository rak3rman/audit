"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CostBar } from "@/components/cost-bar"
import { VarianceBadge } from "@/components/variance-badge"
import { CodeStatusPill } from "@/components/code-status-pill"
import { ItemDetailDrawer } from "@/components/item-detail-drawer"
import { Info } from "lucide-react"
import type { LineItem, Flag } from "@/hooks/use-app-data"

interface LineItemsTableProps {
  items: LineItem[]
  flags: Flag[]
  selectedItems: Set<string>
  onSelectionChange: (selectedItems: Set<string>) => void
}

export function LineItemsTable({ items, flags, selectedItems, onSelectionChange }: LineItemsTableProps) {
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<LineItem | null>(null)

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  const toggleSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId)
    } else {
      newSelection.add(itemId)
    }
    onSelectionChange(newSelection)
  }

  const getItemFlags = (itemId: string) => flags.filter((flag) => flag.itemId === itemId)

  const openItemDetails = (item: LineItem) => {
    setSelectedItemForDetail(item)
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto -mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 w-10">
                  <span className="sr-only">Select</span>
                </th>
                <th className="text-left p-3 min-w-[280px] lg:min-w-[320px]">
                  <span className="text-sm font-medium">Description & Code</span>
                </th>
                <th className="text-left p-3 w-16 lg:w-20">
                  <span className="text-sm font-medium">Units</span>
                </th>
                <th className="text-left p-3 w-28 lg:w-32">
                  <span className="text-sm font-medium">Billed</span>
                </th>
                <th className="text-left p-3 min-w-[180px] lg:min-w-[220px]">
                  <span className="text-sm font-medium">Cost Analysis</span>
                </th>
                <th className="text-left p-3 w-20 lg:w-24">
                  <span className="text-sm font-medium">Variance</span>
                </th>
                <th className="text-left p-3 w-16">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const itemFlags = getItemFlags(item.id)
                return (
                  <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center justify-center">
                        <Checkbox 
                          checked={selectedItems.has(item.id)} 
                          onCheckedChange={() => toggleSelection(item.id)}
                          className="border-2 border-gray-300 bg-white data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-2">
                        <div>
                          <button
                            onClick={() => openItemDetails(item)}
                            className="text-left hover:text-primary transition-colors"
                          >
                            <p className="font-medium hover:underline text-sm lg:text-base">{item.normalizedDescription}</p>
                            <p className="text-xs lg:text-sm text-muted-foreground">{item.rawDescription}</p>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {item.code && <CodeStatusPill code={item.code} suggestedCode={item.suggestedCode} />}
                          {itemFlags.map((flag) => (
                            <Badge
                              key={flag.type}
                              variant={flag.severity === "high" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {flag.type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <span className="text-sm lg:text-base">{item.units}</span>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-sm lg:text-base">{formatCurrency(item.billedAmount)}</p>
                      {item.insurer.allowedAmount && (
                        <p className="text-xs text-muted-foreground">
                          Allowed: {formatCurrency(item.insurer.allowedAmount)}
                        </p>
                      )}
                    </td>

                    <td className="p-3">
                      <CostBar
                        billedAmount={item.billedAmount}
                        typicalCost={item.typicalCost}
                        insuranceMaxAmount={item.insurer.allowedAmount}
                      />
                    </td>

                    <td className="p-3">
                      <VarianceBadge variance={item.variance} />
                    </td>

                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => openItemDetails(item)}>
                        <Info className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ItemDetailDrawer
        item={selectedItemForDetail}
        flags={selectedItemForDetail ? getItemFlags(selectedItemForDetail.id) : []}
        onClose={() => setSelectedItemForDetail(null)}
      />
    </>
  )
}
