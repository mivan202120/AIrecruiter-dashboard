import type { DashboardData } from '../../types'
import { formatDate } from '../../utils/dateUtils'

interface ReportHeaderProps {
  data: DashboardData
  onNewUpload: () => void
  onThemeToggle: () => void
  isDark: boolean
}

export const ReportHeader = ({ data, onNewUpload, onThemeToggle, isDark }: ReportHeaderProps) => {
  const processingTime = data.processingMetrics?.processingTimeMs
    ? (data.processingMetrics.processingTimeMs / 1000).toFixed(1)
    : null

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <header className="bg-gradient-to-r from-primary-600 to-accent-purple text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onNewUpload}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              New Upload
            </button>
            <button
              onClick={onThemeToggle}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="text-sm opacity-90">
            Generated: {formatDate(data.processedAt)}
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Recruitment Analytics Report</h1>
          <p className="text-xl opacity-90">Comprehensive Analysis of Candidate Interviews</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-75 mb-1">Total Candidates</p>
            <p className="text-2xl font-bold">{formatNumber(data.totalUsers)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-75 mb-1">Messages Processed</p>
            <p className="text-2xl font-bold">{formatNumber(data.totalMessages)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-75 mb-1">Success Rate</p>
            <p className="text-2xl font-bold">
              {((data.statusDistribution.approved / data.totalUsers) * 100).toFixed(1)}%
            </p>
          </div>
          {data.processingMetrics?.tokensUsed && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-75 mb-1">Tokens Used</p>
              <p className="text-2xl font-bold">
                {formatNumber(data.processingMetrics.tokensUsed)}
              </p>
            </div>
          )}
          {processingTime && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-75 mb-1">Processing Time</p>
              <p className="text-2xl font-bold">{processingTime}s</p>
            </div>
          )}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-75 mb-1">Report Date</p>
            <p className="text-2xl font-bold">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}