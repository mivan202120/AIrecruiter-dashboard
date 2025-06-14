import { useState, useMemo } from 'react'
import type { DashboardData } from '../../types'
import { ReportHeader } from './ReportHeader'
import { SummaryCards } from './SummaryCards'
import { ResultsDistribution } from './ResultsDistribution'
import { KeyInsights } from './KeyInsights'
import { CandidateList } from './CandidateList'
import { Recommendations } from './Recommendations'
import { DurationAnalysis } from './DurationAnalysis'
import { DetailedMetricsTable } from './DetailedMetricsTable'
import { DailyConversationsChart } from './DailyConversationsChart'
import { DailyConversationsTable } from './DailyConversationsTable'
import { SentimentAnalysis } from './SentimentAnalysis'
import { normalizeDashboardData } from '../../utils/dataHelpers'

interface DashboardProps {
  data: DashboardData
  isDark: boolean
  onThemeToggle: () => void
  onNewUpload: () => void
}

export const Dashboard = ({ data, isDark, onThemeToggle, onNewUpload }: DashboardProps) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  
  // Normalize the data to ensure dates are Date objects
  const normalizedData = useMemo(() => normalizeDashboardData(data), [data])
  
  console.log('Dashboard received data:', data)
  console.log('Normalized data:', normalizedData)
  console.log('Total users:', normalizedData.totalUsers)
  console.log('Status distribution:', normalizedData.statusDistribution)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Professional Report Header */}
      <ReportHeader 
        data={normalizedData} 
        onNewUpload={onNewUpload}
        onThemeToggle={onThemeToggle}
        isDark={isDark}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <SummaryCards data={normalizedData} />

        {/* Results Distribution */}
        <div className="mt-8">
          <ResultsDistribution data={normalizedData} />
        </div>

        {/* Key Insights */}
        <div className="mt-8">
          <KeyInsights insights={normalizedData.aggregateAnalysis.keyInsights} />
        </div>

        {/* Sentiment Analysis */}
        <div className="mt-8">
          <SentimentAnalysis candidates={normalizedData.candidates} />
        </div>

        {/* Candidate Details */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Candidate Details
          </h2>
          <CandidateList
            candidates={normalizedData.candidates}
            selectedId={selectedCandidateId}
            onSelectCandidate={setSelectedCandidateId}
          />
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-8">
          <Recommendations recommendations={normalizedData.aggregateAnalysis.recommendations} />
        </div>

        {/* Duration Analysis */}
        <div className="mt-8">
          <DurationAnalysis
            candidates={normalizedData.candidates}
            keyFinding={normalizedData.aggregateAnalysis.durationKeyFinding}
          />
        </div>

        {/* Daily Conversations Analysis */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyConversationsChart 
            data={normalizedData.dailyConversations} 
            isDark={isDark} 
          />
          <DailyConversationsTable 
            data={normalizedData.dailyConversations} 
          />
        </div>

        {/* Detailed Metrics Table */}
        <div className="mt-8">
          <DetailedMetricsTable candidates={normalizedData.candidates} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Analysis generated on {new Date(normalizedData.processedAt).toLocaleString()}</p>
            <p className="mt-2">
              Powered by OpenAI • Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
