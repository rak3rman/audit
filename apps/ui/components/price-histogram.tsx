interface PriceHistogramProps {
  billedAmount: number
  regionalData: {
    min: number
    median: number
    max: number
    percentile90: number
  }
}

export function PriceHistogram({ billedAmount, regionalData }: PriceHistogramProps) {
  const maxValue = Math.max(billedAmount, regionalData.max) * 1.1

  const getPosition = (value: number) => (value / maxValue) * 100

  return (
    <div className="space-y-4">
      <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
        {/* Price distribution bars */}
        <div className="absolute inset-0 flex items-end">
          {/* Simulated histogram bars */}
          {Array.from({ length: 20 }, (_, i) => {
            const height = Math.random() * 60 + 20
            const isInRange = i >= 6 && i <= 14
            return (
              <div
                key={i}
                className={`flex-1 mx-px ${isInRange ? "bg-chart-1/40" : "bg-muted-foreground/20"}`}
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>

        {/* Markers */}
        <div className="absolute inset-0">
          {/* Median line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-chart-1"
            style={{ left: `${getPosition(regionalData.median)}%` }}
          />

          {/* Billed amount marker */}
          <div
            className={`absolute top-0 bottom-0 w-1 ${
              billedAmount > regionalData.max
                ? "bg-chart-3"
                : billedAmount < regionalData.min
                  ? "bg-chart-1"
                  : "bg-chart-2"
            }`}
            style={{ left: `${getPosition(billedAmount)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>${regionalData.min}</span>
        <span>Median: ${regionalData.median}</span>
        <span>${regionalData.max}</span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-chart-1 rounded-sm" />
          <span>Typical Range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-chart-2 rounded-sm" />
          <span>Your Bill</span>
        </div>
      </div>
    </div>
  )
}
