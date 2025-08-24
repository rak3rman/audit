import { Badge } from "@/components/ui/badge"

interface VarianceBadgeProps {
  variance: "below" | "within" | "above"
}

export function VarianceBadge({ variance }: VarianceBadgeProps) {
  const config = {
    below: {
      label: "Below Range",
      className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    },
    within: {
      label: "Within Range",
      className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    },
    above: {
      label: "Above Range",
      className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    },
  }

  const { label, className } = config[variance]

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
