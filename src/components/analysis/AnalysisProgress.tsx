import { useEffect, useState } from 'react'
import { processConversations } from '../../services/analysisProcessor'
import type { CandidateConversation, DashboardData } from '../../types'
import type { ProcessingProgress } from '../../services/analysisProcessor'

interface AnalysisProgressProps {
  conversations: CandidateConversation[]
  onComplete: (data: DashboardData) => void
}

export const AnalysisProgress = ({ conversations, onComplete }: AnalysisProgressProps) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const result = await processConversations(
          conversations,
          (progressUpdate: ProcessingProgress) => {
            if (progressUpdate.stage === 'analyzing') {
              const percentage = (progressUpdate.current / progressUpdate.total) * 80
              setProgress(percentage)
              setStatus(progressUpdate.message)
            } else if (progressUpdate.stage === 'aggregating') {
              setProgress(90)
              setStatus(progressUpdate.message)
            } else if (progressUpdate.stage === 'complete') {
              setProgress(100)
              setStatus(progressUpdate.message)
            }
          }
        )

        // Small delay for UX
        setTimeout(() => {
          onComplete(result)
        }, 500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed')
      }
    }

    runAnalysis()
  }, [conversations, onComplete])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Analysis Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Tip: Make sure your OpenAI API key is set in the .env file
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        {/* Animated Logo/Icon */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-2xl">
              <svg
                className="w-16 h-16 text-white animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Analysis in Progress
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Analyzing {conversations.length} candidate conversations with OpenAI
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              </div>
              {/* Animated stripes */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-stripes animate-slide"></div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur animate-pulse"></div>
              <div className="relative w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">{status}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {conversations.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Candidates</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor((progress * conversations.length) / 100)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Analyzed</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {conversations.length - Math.floor((progress * conversations.length) / 100)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-xl">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="font-semibold">AI-Powered Analysis:</strong> Each conversation is
                being analyzed across multiple dimensions including technical skills, communication,
                and cultural fit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
