"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HistoryList } from "@/components/history-list"
import { ArrowLeft, Search, Filter, Building2 } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"

export default function HistoryPage() {
  const router = useRouter()
  const {
    filteredHistory,
    uniqueProviders,
    summaryStats,
    searchQuery,
    statusFilter,
    providerFilter,
    setSearchQuery,
    setStatusFilter,
    setProviderFilter,
  } = useAppData()

  return (
    <div className="min-h-screen bg-background my-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Bill Analysis History
          </h1>
          <p className="text-muted-foreground">Track your medical bill analyses, negotiations, and savings over time</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Bills Analyzed</p>
            <p className="text-2xl font-bold">{summaryStats.totalAnalyzed}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Negotiations Sent</p>
            <p className="text-2xl font-bold text-chart-2">{summaryStats.totalNegotiated}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Savings Realized</p>
            <p className="text-2xl font-bold text-chart-1">${summaryStats.totalSavings.toFixed(2)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Average Savings</p>
            <p className="text-2xl font-bold text-chart-1">
              ${summaryStats.averageSavings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by file name, provider, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border border-gray-200"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card border border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="negotiated">Negotiated</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card border border-gray-200">
              <Building2 className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {uniqueProviders.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredHistory.length} of {filteredHistory.length} analyses
          </p>
        </div>

        <HistoryList items={filteredHistory} />
      </div>
    </div>
  )
}
