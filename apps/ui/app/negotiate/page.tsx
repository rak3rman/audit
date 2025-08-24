"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { NegotiationComposer } from "@/components/negotiation-composer"
import { useAppData } from "@/hooks/use-app-data"

export default function NegotiatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemIds = searchParams.get("items")?.split(",") || []
  const { negotiationItems } = useAppData()

  // Filter items based on selected IDs
  const selectedItems = negotiationItems.filter((item) => itemIds.includes(item.id))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/results")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Generate Negotiation
          </h1>
          <p className="text-muted-foreground">
            Create a professional negotiation message with evidence and fair pricing data
          </p>
        </div>

        <NegotiationComposer items={selectedItems} />
      </div>
    </div>
  )
}
