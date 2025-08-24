import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalysisSummary } from "@/hooks/use-app-data"

interface ResultsHeaderProps {
  summary: AnalysisSummary
}

export function ResultsHeader({ summary }: ResultsHeaderProps) {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const savingsPercentage = ((summary.potentialSavings / summary.billedTotal) * 100).toFixed(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: "var(--font-heading)" }}>Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Billed</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(summary.billedTotal)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Estimated Fair Total</p>
            <p className="text-2xl font-bold text-chart-1">{formatCurrency(summary.estimatedFairTotal)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Insurance Coverage</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(summary.estimatedInsuranceCovered)}</p>
            <p className="text-xs text-muted-foreground">
              Your responsibility: {formatCurrency(summary.patientResponsibility)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Potential Savings</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-chart-3">{formatCurrency(summary.potentialSavings)}</p>
              <Badge variant="destructive" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                {savingsPercentage}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
