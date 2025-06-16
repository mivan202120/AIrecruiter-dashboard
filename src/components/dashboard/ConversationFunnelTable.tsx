import { useState } from 'react'
import type { FunnelStageMetrics } from '../../types/funnel'
import { formatDuration } from '../../utils/dateUtils'

interface ConversationFunnelTableProps {
  stages: FunnelStageMetrics[]
  totalCandidates: number
  avgTimeToDecision: number
}

const stageIcons = {
  ai_engagement: '👋',
  interview_questions: '💬',
  hr_interview_scheduling: '📅',
  completed: '✅',
}

export const ConversationFunnelTable = ({
  stages,
  totalCandidates,
  avgTimeToDecision,
}: ConversationFunnelTableProps) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null)

  if (!stages || stages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Conversation Funnel Analysis
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No funnel data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Conversation Funnel Analysis
        </h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Candidates</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCandidates}</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Process</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stages[stages.length - 1]?.candidatesCompleted || 0}
            </p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Time to Decision</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(avgTimeToDecision)}
            </p>
          </div>
        </div>
      </div>

      {/* Funnel Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Stage
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Entered
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Completed
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Conversion Rate
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Drop-off
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                Avg Time
              </th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, index) => {
              const icon = stageIcons[stage.stageId as keyof typeof stageIcons] || '📊'
              const dropOff =
                index > 0 ? stages[index - 1].candidatesEntered - stage.candidatesEntered : 0
              const dropOffPercent =
                index > 0 && stages[index - 1].candidatesEntered > 0
                  ? (dropOff / stages[index - 1].candidatesEntered) * 100
                  : 0
              const isExpanded = expandedStage === stage.stageId

              return (
                <>
                  <tr
                    key={stage.stageId}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 ${
                      stage.subStages && stage.subStages.length > 0 ? 'cursor-pointer' : ''
                    }`}
                    onClick={() =>
                      stage.subStages &&
                      stage.subStages.length > 0 &&
                      setExpandedStage(isExpanded ? null : stage.stageId)
                    }
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {stage.stageName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Stage {index + 1}
                          </p>
                        </div>
                        {stage.subStages && stage.subStages.length > 0 && (
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ml-auto ${
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
                        )}
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {stage.candidatesEntered}
                      </p>
                    </td>
                    <td className="text-center py-4 px-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {stage.candidatesCompleted}
                      </p>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${stage.conversionRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {stage.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      {dropOff > 0 ? (
                        <p className="text-red-600 dark:text-red-400 font-medium">
                          -{dropOff} ({dropOffPercent.toFixed(1)}%)
                        </p>
                      ) : (
                        <p className="text-gray-400">—</p>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      <p className="text-gray-900 dark:text-gray-100">
                        {formatDuration(stage.avgTimeInStage)}
                      </p>
                    </td>
                  </tr>

                  {/* Substages */}
                  {isExpanded &&
                    stage.subStages &&
                    stage.subStages.map((subStage) => (
                      <tr
                        key={subStage.stageId}
                        className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-3 px-4 pl-16">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ↳ {subStage.stageName}
                          </p>
                        </td>
                        <td className="text-center py-3 px-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {subStage.candidatesEntered}
                          </p>
                        </td>
                        <td className="text-center py-3 px-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {subStage.candidatesCompleted}
                          </p>
                        </td>
                        <td className="text-center py-3 px-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {subStage.conversionRate.toFixed(1)}%
                          </p>
                        </td>
                        <td className="text-center py-3 px-4">
                          <p className="text-sm text-gray-400">—</p>
                        </td>
                        <td className="text-center py-3 px-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {formatDuration(subStage.avgTimeInStage)}
                          </p>
                        </td>
                      </tr>
                    ))}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Row */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Conversion</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stages[stages.length - 1]?.candidatesCompleted && totalCandidates > 0
                ? ((stages[stages.length - 1].candidatesCompleted / totalCandidates) * 100).toFixed(
                    1
                  )
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Drop-off</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalCandidates - (stages[stages.length - 1]?.candidatesCompleted || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Process Completion</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stages.find((s) => s.stageId === 'completed')?.candidatesEntered || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Completion Time</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(avgTimeToDecision)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
