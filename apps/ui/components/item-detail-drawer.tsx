"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeVerificationPanel } from "@/components/code-verification-panel"
import { PriceHistogram } from "@/components/price-histogram"
import { ExternalLink, AlertCircle, Flag as FlagIcon } from "lucide-react"
import type { LineItem, Flag } from "@/hooks/use-app-data"
import { useAppData } from "@/hooks/use-app-data"

interface ItemDetailDrawerProps {
  item: LineItem | null
  flags: Flag[]
  onClose: () => void
}

export function ItemDetailDrawer({ item, flags, onClose }: ItemDetailDrawerProps) {
  const {
    selectedRegion,
    setSelectedRegion,
    flaggedItems,
    mockCodeDetails,
    mockRegionalData,
  } = useAppData()

  const getCodeDetails = (codeValue: string) => {
    return mockCodeDetails[codeValue] || null
  }

  const getCurrentRegionalData = () => {
    return mockRegionalData.priceData.find((d) => d.region === selectedRegion) || mockRegionalData.priceData[0]
  }

  const getAllRegions = () => {
    return mockRegionalData.regions
  }

  const toggleFlagged = () => {
    // This would need to be implemented in the consolidated hook
    console.log('Toggle flagged for item:', item?.id)
  }

  if (!item) return null

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const codeDetails = item.code ? getCodeDetails(item.code.value) : null
  const regionalData = getCurrentRegionalData()

  return (
    <Sheet open={!!item} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-6">
        <SheetHeader className="space-y-4">
          <div>
            <SheetTitle className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
              {item.normalizedDescription}
            </SheetTitle>
            <SheetDescription className="text-sm">{item.rawDescription}</SheetDescription>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.code && (
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                  {item.code.system} {item.code.value}
                </Badge>
              )}
              {flags.map((flag) => (
                <Badge key={flag.type} variant={flag.severity === "high" ? "destructive" : "secondary"}>
                  {flag.type}
                </Badge>
              ))}
            </div>

            <Button variant={flaggedItems.has(item.id) ? "default" : "outline"} size="sm" onClick={toggleFlagged}>
                              <FlagIcon className="w-4 h-4 mr-2" />
              {flaggedItems.has(item.id) ? "Flagged" : "Flag Item"}
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="codes">Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Billed Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(item.billedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Typical Range</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(item.typicalCost.min)} - {formatCurrency(item.typicalCost.max)}
                    </p>
                    <p className="text-sm text-muted-foreground">Median: {formatCurrency(item.typicalCost.median)}</p>
                  </div>
                </div>

                {flags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Issues Identified:</h4>
                    {flags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        <AlertCircle className="w-4 h-4 text-chart-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm capitalize">{flag.type.replace(/([A-Z])/g, " $1")}</p>
                          <p className="text-sm text-muted-foreground">{flag.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {item.suggestedCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-chart-5" />
                    Suggested Code Correction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {item.suggestedCode.system} {item.suggestedCode.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round(item.suggestedCode.confidence * 100)}%
                        </p>
                      </div>
                      <Button size="sm">Accept Suggestion</Button>
                    </div>
                    <p className="text-sm">{item.suggestedCode.rationale}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Price Analysis</CardTitle>
                <CardDescription>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllRegions().map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PriceHistogram billedAmount={item.billedAmount} regionalData={regionalData} />

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Minimum</p>
                    <p className="font-semibold">{formatCurrency(regionalData.min)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Median</p>
                    <p className="font-semibold">{formatCurrency(regionalData.median)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">90th Percentile</p>
                    <p className="font-semibold">{formatCurrency(regionalData.percentile90)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Maximum</p>
                    <p className="font-semibold">{formatCurrency(regionalData.max)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CMS Medicare Fee Schedule</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Healthcare Bluebook</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">FAIR Health Database</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Insurance Coverage Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.insurer.allowedAmount && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Allowed Amount</p>
                      <p className="text-xl font-bold text-chart-1">{formatCurrency(item.insurer.allowedAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Coverage Percentage</p>
                      <p className="text-xl font-bold">
                        {item.insurer.allowedAmount && item.billedAmount 
                          ? Math.round((item.insurer.allowedAmount / item.billedAmount) * 100) 
                          : 0}%
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Billed Amount</span>
                    <span className="font-semibold">{formatCurrency(item.billedAmount)}</span>
                  </div>
                  {item.insurer.coveredAmount && (
                    <div className="flex justify-between">
                      <span>Insurance Covered</span>
                      <span className="font-semibold text-chart-1">-{formatCurrency(item.insurer.coveredAmount)}</span>
                    </div>
                  )}
                  {item.insurer.patientResponsibility && (
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Your Responsibility</span>
                      <span className="font-bold">{formatCurrency(item.insurer.patientResponsibility)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Actual coverage may vary based on your specific plan, deductible status, and
                    network participation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes" className="space-y-4">
            {codeDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Code Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm">{codeDetails.name}</p>
                  </div>

                  {codeDetails.synonyms.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Also Known As</h4>
                      <div className="flex flex-wrap gap-2">
                        {codeDetails.synonyms.map((synonym, index) => (
                          <Badge key={index} variant="outline">
                            {synonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {codeDetails.modifiers.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Common Modifiers</h4>
                      <div className="space-y-1">
                        {codeDetails.modifiers.map((modifier, index) => (
                          <p key={index} className="text-sm">
                            {modifier}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {typeof codeDetails.bundling === "string" ? (
                    <div>
                      <h4 className="font-medium mb-2">Bundling Information</h4>
                      <p className="text-sm">{codeDetails.bundling}</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium mb-2">Bundling Rules</h4>
                      <div className="space-y-1">
                        {codeDetails.bundling.map((rule, index) => (
                          <p key={index} className="text-sm">
                            {rule}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Official Documentation
                  </Button>
                </CardContent>
              </Card>
            )}

            {item.code && <CodeVerificationPanel code={item.code} suggestedCode={item.suggestedCode} />}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
