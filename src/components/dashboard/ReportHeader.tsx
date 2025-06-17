import { useState } from 'react'
import type { DashboardData } from '../../types'
import { formatDate } from '../../utils/dateUtils'
import { useResponsive } from '../../hooks/useResponsive'
import { ExportDialog } from './ExportDialog'

interface ReportHeaderProps {
  data: DashboardData
  onNewUpload: () => void
  onThemeToggle: () => void
  isDark: boolean
}

export const ReportHeader = ({ data, onNewUpload, onThemeToggle, isDark }: ReportHeaderProps) => {
  const { isMobile, isTablet } = useResponsive()
  const [showExportDialog, setShowExportDialog] = useState(false)
  
  const processingTime = data.processingMetrics?.processingTimeMs
    ? (data.processingMetrics.processingTimeMs / 1000).toFixed(1)
    : null

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between'} items-center mb-6`}>
          <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : 'gap-4'}`}>
            <button
              onClick={onNewUpload}
              className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'} bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all duration-200 font-medium`}
            >
              <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {!isMobile && 'New Upload'}
            </button>
            <button
              onClick={() => setShowExportDialog(true)}
              className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'} border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium`}
            >
              <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {!isMobile && 'Export'}
            </button>
            <button
              onClick={onThemeToggle}
              className={`${isMobile ? 'p-2' : 'p-2.5'} border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          {!isMobile && <div className="text-sm text-gray-600 dark:text-gray-400">Generated: {formatDate(data.processedAt)}</div>}
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold mb-2 text-gray-900 dark:text-white`}>
            AI Recruitment Analytics Report
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-gray-600 dark:text-gray-400`}>
            Comprehensive Analysis of Candidate Interviews
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Candidates</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(data.totalUsers)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Messages Processed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(data.totalMessages)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {((data.statusDistribution.approved / data.totalUsers) * 100).toFixed(1)}%
            </p>
          </div>
          {data.processingMetrics?.tokensUsed && (
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tokens Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.processingMetrics.tokensUsed)}
              </p>
            </div>
          )}
          {processingTime && (
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Processing Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{processingTime}s</p>
            </div>
          )}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Report Date</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        data={data}
      />
    </header>
  )
}
