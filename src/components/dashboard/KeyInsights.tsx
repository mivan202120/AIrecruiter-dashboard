interface KeyInsightsProps {
  insights: string[]
}

export const KeyInsights = ({ insights }: KeyInsightsProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500 rounded-lg flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Key Insights
          </h2>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                <span className="text-blue-800 dark:text-blue-200">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
