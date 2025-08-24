import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { CodeInfo, SuggestedCode } from "@/hooks/use-app-data"

interface CodeStatusPillProps {
  code: CodeInfo
  suggestedCode?: SuggestedCode
}

export function CodeStatusPill({ code, suggestedCode }: CodeStatusPillProps) {
  const statusConfig = {
    verified: {
      className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
      label: "Verified",
    },
    suggested: {
      className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
      label: "Suggested",
    },
    uncertain: {
      className: "bg-muted text-muted-foreground border-border",
      label: "Uncertain",
    },
  }

  const { className, label } = statusConfig[code.status]

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={className}>
        {code.system} {code.value} • {label}
      </Badge>

      {suggestedCode && (
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-chart-5" />
          <Button variant="link" className="h-auto p-0 text-xs text-chart-5">
            Suggest {suggestedCode.system} {suggestedCode.value}
          </Button>
        </div>
      )}
    </div>
  )
}
