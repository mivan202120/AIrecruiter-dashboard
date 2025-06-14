import type { Recommendation } from '../../types'
import { PRIORITY_COLORS } from '../../constants'

interface RecommendationsProps {
  recommendations: Recommendation[]
}

export const Recommendations = ({ recommendations }: RecommendationsProps) => {
  const priorityIcons = {
    High: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    Medium: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    Low: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Strategic Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRecommendations.map((recommendation, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-4 ${
              PRIORITY_COLORS[recommendation.priority]
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  recommendation.priority === 'High'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    : recommendation.priority === 'Medium'
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                }`}
              >
                {priorityIcons[recommendation.priority]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {recommendation.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      recommendation.priority === 'High'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : recommendation.priority === 'Medium'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {recommendation.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
