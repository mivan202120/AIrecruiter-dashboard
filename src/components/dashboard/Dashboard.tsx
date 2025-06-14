import { useState } from 'react'
import type { DashboardData } from '../../types'
import { SummaryCards } from './SummaryCards'
import { ResultsDistribution } from './ResultsDistribution'
import { KeyInsights } from './KeyInsights'
import { CandidateList } from './CandidateList'
import { ProcessMetrics } from './ProcessMetrics'
import { Recommendations } from './Recommendations'
import { DurationAnalysis } from './DurationAnalysis'
import { DetailedMetricsTable } from './DetailedMetricsTable'

interface DashboardProps {
  data: DashboardData
  isDark: boolean
  onThemeToggle: () => void
  onNewUpload: () => void
}

export const Dashboard = ({ data, isDark, onThemeToggle, onNewUpload }: DashboardProps) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-purple bg-clip-text text-transparent">
                AI Recruiter Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Processed {data.totalMessages} messages from {data.totalUsers} candidates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={onNewUpload}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Upload New File
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <SummaryCards data={data} />

        {/* Results Distribution */}
        <div className="mt-8">
          <ResultsDistribution data={data} />
        </div>

        {/* Key Insights */}
        <div className="mt-8">
          <KeyInsights insights={data.aggregateAnalysis.keyInsights} />
        </div>

        {/* Two Column Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Candidate Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Candidate Details
            </h2>
            <CandidateList
              candidates={data.candidates}
              selectedId={selectedCandidateId}
              onSelectCandidate={setSelectedCandidateId}
            />
          </div>

          {/* Right Column - Process Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Process Metrics
            </h2>
            <ProcessMetrics data={data} />
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-8">
          <Recommendations recommendations={data.aggregateAnalysis.recommendations} />
        </div>

        {/* Duration Analysis */}
        <div className="mt-8">
          <DurationAnalysis
            candidates={data.candidates}
            keyFinding={data.aggregateAnalysis.durationKeyFinding}
          />
        </div>

        {/* Detailed Metrics Table */}
        <div className="mt-8">
          <DetailedMetricsTable candidates={data.candidates} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Analysis generated on {new Date(data.processedAt).toLocaleString()}</p>
            <p className="mt-2">
              Powered by OpenAI • Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
