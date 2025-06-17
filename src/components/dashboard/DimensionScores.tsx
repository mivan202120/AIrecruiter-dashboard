import type { CandidateAnalysis } from '../../types'

interface DimensionScoresProps {
  dimensions: NonNullable<CandidateAnalysis['dimensions']>
}

export const DimensionScores = ({ dimensions }: DimensionScoresProps) => {
  const dimensionLabels = {
    technicalExperience: 'Technical Experience',
    logicalReasoning: 'Logical Reasoning',
    aiAdoption: 'AI Adoption',
    culturalFit: 'Cultural Fit',
    communicationClarity: 'Communication',
    engagement: 'Engagement',
    professionalism: 'Professionalism',
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500 dark:bg-green-400'
    if (score >= 6) return 'bg-yellow-500 dark:bg-yellow-400'
    if (score >= 4) return 'bg-orange-500 dark:bg-orange-400'
    return 'bg-red-500 dark:bg-red-400'
  }

  return (
    <div className="space-y-2">
      {Object.entries(dimensions).map(([key, value]) => (
        <div key={key} className="group">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {dimensionLabels[key as keyof typeof dimensionLabels]}
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {value.score}/10
            </span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getScoreColor(
                  value.score
                )}`}
                style={{ width: `${value.score * 10}%` }}
              />
            </div>
            {/* Tooltip on hover */}
            <div className="absolute left-0 right-0 -top-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg border border-gray-700 dark:border-slate-600">
                {value.feedback}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
