import { useState, useMemo } from 'react'
import type { DashboardData, ParsedMessage } from '../../types'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal'
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
import { ConversationFunnelTable } from './ConversationFunnelTable'
import { AIInsightsPanel } from './AIInsightsPanel'
import { normalizeDashboardData } from '../../utils/dataHelpers'

interface DashboardProps {
  data: DashboardData
  conversations?: Map<string, ParsedMessage[]>
  isDark: boolean
  onThemeToggle: () => void
  onNewUpload: () => void
}

export const Dashboard = ({
  data,
  conversations,
  isDark,
  onThemeToggle,
  onNewUpload,
}: DashboardProps) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  // Normalize the data to ensure dates are Date objects
  const normalizedData = useMemo(() => normalizeDashboardData(data), [data])

  // Setup keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      action: onNewUpload,
      description: 'New upload'
    },
    {
      key: 't',
      ctrlKey: true,
      action: onThemeToggle,
      description: 'Toggle theme'
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => setShowExportDialog(true),
      description: 'Export data'
    },
    {
      key: '?',
      action: () => setShowShortcuts(true),
      description: 'Show keyboard shortcuts'
    },
    {
      key: 'Escape',
      action: () => {
        setShowShortcuts(false)
        setShowExportDialog(false)
      },
      description: 'Close dialogs'
    }
  ])

  console.log('Dashboard received data:', data)
  console.log('Dashboard conversations prop:', conversations)
  console.log('Dashboard conversations size:', conversations?.size)
  console.log('Normalized data:', normalizedData)
  console.log('Total users:', normalizedData.totalUsers)
  console.log('Status distribution:', normalizedData.statusDistribution)
  console.log('Funnel data:', normalizedData.funnelData)
  console.log('Funnel stages:', normalizedData.funnelData?.stages)

  return (
    <div
      id="dashboard-content"
      className="min-h-screen bg-white dark:bg-slate-900 transition-colors"
    >
      {/* Professional Report Header */}
      <ReportHeader
        data={normalizedData}
        onNewUpload={onNewUpload}
        onThemeToggle={onThemeToggle}
        isDark={isDark}
      />

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <SummaryCards data={normalizedData} />

        {/* AI-Powered Insights */}
        <div className="mt-8">
          <AIInsightsPanel data={normalizedData} />
        </div>

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

        {/* Conversation Funnel */}
        {normalizedData.funnelData && (
          <div className="mt-8">
            <ConversationFunnelTable
              stages={normalizedData.funnelData.stages}
              totalCandidates={normalizedData.funnelData.totalCandidates}
              avgTimeToDecision={normalizedData.funnelData.avgTimeToDecision}
            />
          </div>
        )}

        {/* Candidate Details */}
        <div className="mt-8">
          <CandidateList
            candidates={normalizedData.candidates}
            selectedId={selectedCandidateId}
            onSelectCandidate={setSelectedCandidateId}
            conversations={conversations}
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
          <DailyConversationsChart data={normalizedData.dailyConversations} isDark={isDark} />
          <DailyConversationsTable data={normalizedData.dailyConversations} />
        </div>

        {/* Detailed Metrics Table */}
        <div className="mt-8">
          <DetailedMetricsTable candidates={normalizedData.candidates} />
        </div>

      </main>

      {/* Footer */}
      <footer id="footer" role="contentinfo" className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 container mx-auto px-4">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Analysis generated on {new Date(normalizedData.processedAt).toLocaleString()}</p>
          <p className="mt-2">
            Powered by OpenAI • Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </p>
        </div>
      </footer>

      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  )
}
