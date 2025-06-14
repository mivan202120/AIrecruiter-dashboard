import { useEffect, useState } from 'react'
import { ProgressIndicator } from '../common/ProgressIndicator'
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          AI Analysis in Progress
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Using Google Gemini to analyze candidate conversations
        </p>
      </div>

      <ProgressIndicator
        progress={progress}
        status={status}
        estimatedTime={progress < 100 ? 'Depends on number of candidates' : undefined}
      />

      <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Analysis time varies based on the number of candidates and API
          response times. Each candidate is individually analyzed for multiple dimensions.
        </p>
      </div>
    </div>
  )
}
