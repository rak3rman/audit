"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Search } from "lucide-react"
import type { CodeInfo, SuggestedCode } from "@/hooks/use-app-data"
import { useAppData } from "@/hooks/use-app-data"

interface CodeVerificationPanelProps {
  code: CodeInfo
  suggestedCode?: SuggestedCode
}

export function CodeVerificationPanel({ code, suggestedCode }: CodeVerificationPanelProps) {
  const {
    codeSearchQuery,
    setCodeSearchQuery,
    isSearchingCodes,
    searchCodes,
    codeSearchResults,
    mockAlternativeCodes,
  } = useAppData()

  const alternativeCodes = codeSearchQuery.trim() ? codeSearchResults : mockAlternativeCodes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {code.status === "verified" ? (
            <CheckCircle className="w-5 h-5 text-chart-1" />
          ) : (
            <AlertCircle className="w-5 h-5 text-chart-2" />
          )}
          Code Verification
        </CardTitle>
        <CardDescription>Verify or search for alternative medical codes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="font-medium">
              {code.system} {code.value}
            </p>
            <p className="text-sm text-muted-foreground">Confidence: {Math.round(code.confidence * 100)}%</p>
          </div>
          <Badge
            variant="outline"
            className={
              code.status === "verified"
                ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                : "bg-chart-2/10 text-chart-2 border-chart-2/20"
            }
          >
            {code.status}
          </Badge>
        </div>

        {suggestedCode && (
          <div className="p-3 border border-chart-5/20 bg-chart-5/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-chart-5">
                Suggested: {suggestedCode.system} {suggestedCode.value}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
            <p className="text-sm">{suggestedCode.rationale}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="code-search">Search Alternative Codes</Label>
          <div className="flex gap-2">
            <Input
              id="code-search"
              placeholder="Search by description or code..."
              value={codeSearchQuery}
              onChange={(e) => setCodeSearchQuery(e.target.value)}
            />
            <Button onClick={() => searchCodes(codeSearchQuery)} disabled={isSearchingCodes || !codeSearchQuery.trim()}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {alternativeCodes.length > 0 && (
          <div className="space-y-2">
            <Label>Alternative Codes</Label>
            <div className="space-y-2">
              {alternativeCodes.map((altCode) => (
                <div key={altCode.value} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{altCode.value}</p>
                    <p className="text-xs text-muted-foreground">{altCode.label}</p>
                    <p className="text-xs text-muted-foreground">Confidence: {Math.round(altCode.confidence * 100)}%</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
