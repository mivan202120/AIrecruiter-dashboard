import { useState } from 'react'
import type { FunnelStageMetrics } from '../../types/funnel'
import { formatDuration } from '../../utils/dateUtils'

interface ConversationFunnelProps {
  stages: FunnelStageMetrics[]
  totalCandidates: number
  avgTimeToDecision: number
}

const stageColors = {
  ai_engagement: '#8B5CF6',
  interview_questions: '#3B82F6',
  hr_interview_scheduling: '#10B981',
  completed: '#F59E0B',
}

export const ConversationFunnel = ({
  stages,
  totalCandidates,
  avgTimeToDecision,
}: ConversationFunnelProps) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null)

  console.log('🎨 ConversationFunnel rendering with:', {
    stages,
    totalCandidates,
    avgTimeToDecision,
    stagesLength: stages?.length || 0,
  })

  // If no stages, show empty state
  if (!stages || stages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Conversation Funnel Analysis
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No funnel data available</p>
          <p className="text-sm mt-2">Upload conversation data to see the funnel analysis</p>
        </div>
      </div>
    )
  }

  // Calculate maximum candidates for width scaling
  const maxCandidates = Math.max(...stages.map((s) => s.candidatesEntered), totalCandidates)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Conversation Funnel Analysis
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Total Candidates</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {totalCandidates}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Avg Time to Decision</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {formatDuration(avgTimeToDecision)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Completion Rate</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {stages.length > 0 && stages[stages.length - 1]?.candidatesCompleted
                ? ((stages[stages.length - 1].candidatesCompleted / totalCandidates) * 100).toFixed(
                    1
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const widthPercent =
            stage.candidatesEntered > 0 ? (stage.candidatesEntered / maxCandidates) * 100 : 0

          const color = stageColors[stage.stageId as keyof typeof stageColors] || '#6B7280'
          const isExpanded = expandedStage === stage.stageId

          // Calculate drop-off from previous stage
          const dropOffCount =
            index > 0 ? stages[index - 1].candidatesEntered - stage.candidatesEntered : 0
          const dropOffPercent =
            index > 0 && stages[index - 1].candidatesEntered > 0
              ? (dropOffCount / stages[index - 1].candidatesEntered) * 100
              : 0

          return (
            <div key={stage.stageId} className="relative">
              {/* Drop-off indicator between stages */}
              {index > 0 && dropOffCount > 0 && (
                <div className="flex items-center justify-center py-2">
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-1 rounded-full">
                    ↓ {dropOffCount} dropped ({dropOffPercent.toFixed(1)}%)
                  </div>
                </div>
              )}

              {/* Main Stage */}
              <div className="relative">
                {/* Stage bar */}
                <div
                  className="relative h-20 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setExpandedStage(isExpanded ? null : stage.stageId)}
                >
                  {/* Colored progress bar */}
                  <div
                    className="absolute inset-y-0 left-0 flex items-center justify-between px-4 text-white rounded-lg transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: color,
                      minWidth: '200px', // Ensure minimum width for text
                    }}
                  >
                    <div>
                      <p className="font-semibold">{stage.stageName}</p>
                      <p className="text-sm opacity-90">{stage.candidatesEntered} candidates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stage.conversionRate.toFixed(1)}%</p>
                      <p className="text-xs opacity-90">completed</p>
                    </div>
                  </div>

                  {/* Stage info on the right for better visibility */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stage.candidatesCompleted} completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Avg: {formatDuration(stage.avgTimeInStage)}
                    </p>
                  </div>

                  {/* Expand/collapse indicator */}
                  {stage.subStages && stage.subStages.length > 0 && (
                    <div className="absolute right-4 top-2">
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Substages (Interview Questions) */}
                {isExpanded && stage.subStages && (
                  <div className="mt-2 ml-4 space-y-2">
                    {stage.subStages.map((subStage) => (
                      <div
                        key={subStage.stageId}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4"
                        style={{ borderLeftColor: color }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {subStage.stageName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subStage.candidatesEntered} started • {subStage.candidatesCompleted}{' '}
                              completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {subStage.conversionRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDuration(subStage.avgTimeInStage)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Funnel Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalCandidates}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Started</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stages[stages.length - 1]?.candidatesCompleted || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {totalCandidates - (stages[stages.length - 1]?.candidatesCompleted || 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dropped</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stages[stages.length - 1]?.candidatesCompleted && totalCandidates > 0
                ? ((stages[stages.length - 1].candidatesCompleted / totalCandidates) * 100).toFixed(
                    1
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
