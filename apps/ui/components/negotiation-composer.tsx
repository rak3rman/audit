"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, Send, FileText, Mail, MessageSquare } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"
import type { NegotiationItem } from "@/hooks/use-app-data"
import { useToast } from "@/hooks/use-toast"

interface NegotiationComposerProps {
  items: NegotiationItem[]
}

export function NegotiationComposer({ items }: NegotiationComposerProps) {
  const { toast } = useToast()
  const {
    templateType,
    setTemplateType,
    voiceTone,
    setVoiceTone,
    customMessage,
    setCustomMessage,
    formatCurrency,
    getNegotiationTotals,
    generateNegotiationText,
    copyToClipboard,
    downloadAsText,
  } = useAppData()

  const totals = getNegotiationTotals(items)

  const handleCopyToClipboard = async () => {
    try {
      const success = await copyToClipboard(generateNegotiationText(items))
      if (!success) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard. Please select and copy manually.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Copied to clipboard",
          description: "The negotiation text has been copied to your clipboard.",
        })
      }
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    downloadAsText(generateNegotiationText(items), "negotiation-letter.txt")
  }

  const handleSendMessage = () => {
    // In a real app, this would integrate with email/portal systems
    toast({
      title: "Message Prepared",
      description: "Your negotiation message is ready to send through your preferred method.",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Settings</CardTitle>
            <CardDescription>Choose your negotiation format and tone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Type</label>
              <Select value={templateType} onValueChange={(value: "email" | "letter" | "portal") => setTemplateType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="letter">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Formal Letter
                    </div>
                  </SelectItem>
                  <SelectItem value="portal">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Portal Message
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Voice & Tone</label>
              <Select value={voiceTone} onValueChange={(value: "concise" | "empathetic" | "firm") => setVoiceTone(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise & Direct</SelectItem>
                  <SelectItem value="empathetic">Empathetic & Collaborative</SelectItem>
                  <SelectItem value="firm">Firm & Assertive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Items Selected</span>
                <Badge variant="outline">{items.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Billed</span>
                <span className="font-semibold">{formatCurrency(totals.totalBilled)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fair Market Value</span>
                <span className="font-semibold text-chart-1">{formatCurrency(totals.totalFair)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Potential Savings</span>
                <span className="font-bold text-chart-3">{formatCurrency(totals.potentialSavings)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disputed Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{item.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.code}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Billed: {formatCurrency(item.billedAmount)}</p>
                    <p>Fair: {formatCurrency(item.typicalRange.median)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Preview */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Negotiation Message Preview</CardTitle>
            <CardDescription>
              Review and customize your {templateType} with {voiceTone} tone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div className="bg-muted p-4 rounded-lg min-h-[400px] font-mono text-sm whitespace-pre-wrap">
                  {generateNegotiationText(items)}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleCopyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={handleSendMessage}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4">
                <Textarea
                  placeholder="Customize your message here..."
                  value={customMessage || generateNegotiationText(items)}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />

                <div className="flex gap-2">
                  <Button onClick={() => setCustomMessage("")}>Reset to Template</Button>
                  <Button onClick={handleCopyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Custom Message
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
