interface CostBarProps {
  billedAmount: number
  typicalCost: { min: number; median: number; max: number }
  insuranceMaxAmount?: number
}

export function CostBar({ billedAmount, typicalCost, insuranceMaxAmount }: CostBarProps) {
  const maxValue = Math.max(billedAmount, typicalCost.max, insuranceMaxAmount || 0) * 1.1
  const billedPosition = (billedAmount / maxValue) * 100
  const minPosition = (typicalCost.min / maxValue) * 100
  const medianPosition = (typicalCost.median / maxValue) * 100
  const maxPosition = (typicalCost.max / maxValue) * 100
  const insurancePosition = insuranceMaxAmount ? (insuranceMaxAmount / maxValue) * 100 : null

  return (
    <div className="space-y-2">
      <div className="relative h-4 bg-chart-1/10 rounded">
        {/* Typical range bar */}
        <div
          className="absolute h-full bg-chart-1/30 rounded"
          style={{
            left: `${minPosition}%`,
            width: `${maxPosition - minPosition}%`,
          }}
        />

        {/* Median line */}
        <div className="absolute h-full w-[3px] bg-gray-500" style={{ left: `${medianPosition}%` }} />

        {/* Billed amount marker */}
        <div
          className={`absolute h-full w-[3px] ${
            billedAmount > typicalCost.max ? "bg-red-500" : "bg-green-600"
          }`}
          style={{ left: `${billedPosition}%` }}
        />

        {/* Insurance max line marker */}
        {insurancePosition && (
          <div 
            className="absolute h-full w-[3px] bg-blue-500 border-l border-dashed border-blue-500" 
            style={{ left: `${insurancePosition}%` }} 
          />
        )}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>${typicalCost.min}</span>
        <span>${typicalCost.median}</span>
        <span>${typicalCost.max}</span>
      </div>
    </div>
  )
}
