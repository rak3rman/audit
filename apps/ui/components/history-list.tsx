"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal, FileText, Calendar, Flag, Download, Eye, MessageSquare, Trash2, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppData } from "@/hooks/use-app-data"
import type { HistoryItem } from "@/hooks/use-app-data"
import { useRouter } from "next/navigation"

interface HistoryListProps {
  items: HistoryItem[]
}

export function HistoryList({ items }: HistoryListProps) {
  const router = useRouter()
  const {
    selectedHistoryItems,
    formatCurrency,
    formatDate,
    getStatusConfig,
    viewAnalysis,
    createNegotiation,
    duplicateAnalysis,
    deleteAnalysis,
    downloadReport,
  } = useAppData()

  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analyses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or upload a new medical bill to get started.
          </p>
          <Button onClick={() => router.push("/")}>Upload New Bill</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const statusConfig = getStatusConfig(item.status)
        const savingsRate = item.potentialSavings > 0 ? (item.actualSavings / item.potentialSavings) * 100 : 0

        return (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{item.fileName}</CardTitle>
                    <Badge variant="outline" className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span>{item.provider}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.uploadDate)}
                    </span>
                    {item.lastUpdated !== item.uploadDate && (
                      <span className="text-xs">Updated {formatDate(item.lastUpdated)}</span>
                    )}
                  </CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => viewAnalysis(item)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Analysis
                    </DropdownMenuItem>
                    {item.flaggedCount > 0 && !item.negotiationSent && (
                      <DropdownMenuItem onClick={() => createNegotiation(item)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Create Negotiation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => downloadReport(item.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateAnalysis(item.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate Analysis
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteAnalysis(item.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Total Billed</p>
                  <p className="font-semibold">{formatCurrency(item.totalBilled)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Potential Savings</p>
                  <p className="font-semibold text-chart-2">{formatCurrency(item.potentialSavings)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Actual Savings</p>
                  <p className="font-semibold text-chart-1">{formatCurrency(item.actualSavings)}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="font-semibold">{item.actualSavings > 0 ? `${savingsRate.toFixed(0)}%` : "0%"}</p>
                </div>
              </div>

              <Separator />

              {/* Details and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {item.itemCount} items
                  </span>
                  {item.flaggedCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      {item.flaggedCount} flagged
                    </span>
                  )}
                  {item.negotiationSent && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Negotiation sent
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => viewAnalysis(item)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>

                {item.flaggedCount > 0 && !item.negotiationSent && (
                  <Button size="sm" onClick={() => createNegotiation(item)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Negotiate
                  </Button>
                )}

                {item.status === "resolved" && (
                  <Button variant="outline" size="sm" onClick={() => downloadReport(item.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                )}
              </div>

              {/* Status Description */}
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{statusConfig.description}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
