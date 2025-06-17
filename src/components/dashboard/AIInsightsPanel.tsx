import { useState, useEffect } from 'react'
import { InsightsEngine, type Insight } from '../../services/insightsEngine'
import type { DashboardData } from '../../types'
import { LiveRegion } from '../common/LiveRegion'

interface AIInsightsPanelProps {
  data: DashboardData
}

const InsightIcon = ({ type }: { type: Insight['type'] }) => {
  switch (type) {
    case 'trend':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    case 'anomaly':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'recommendation':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    case 'prediction':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
  }
}

const PriorityBadge = ({ priority }: { priority: Insight['priority'] }) => {
  const colors = {
    high: 'bg-red-50 text-red-600 border-red-200',
    medium: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    low: 'bg-blue-50 text-blue-600 border-blue-200'
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[priority]}`}>
      {priority.toUpperCase()}
    </span>
  )
}

export const AIInsightsPanel = ({ data }: AIInsightsPanelProps) => {
  const [insights, setInsights] = useState<Insight[]>([])
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const generateInsights = async () => {
      setIsGenerating(true)
      setAnnouncement('Generating AI insights...')
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const engine = new InsightsEngine()
      const generatedInsights = engine.generateInsights(data)
      setInsights(generatedInsights)
      setIsGenerating(false)
      setAnnouncement(`Generated ${generatedInsights.length} insights`)
    }

    generateInsights()
  }, [data])

  const toggleInsight = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId)
  }

  if (isGenerating) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-pulse">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            AI-Powered Insights
          </h2>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            AI-Powered Insights
          </h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {insights.length} insights found
        </span>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            Everything looks good! No critical insights at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggleInsight(insight.id)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                aria-expanded={expandedInsight === insight.id}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'anomaly' ? 'bg-red-50 text-red-600' :
                    insight.type === 'trend' ? 'bg-blue-50 text-blue-600' :
                    insight.type === 'recommendation' ? 'bg-green-50 text-green-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    <InsightIcon type={insight.type} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {insight.title}
                      </h3>
                      <PriorityBadge priority={insight.priority} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                  </div>
                  
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedInsight === insight.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {expandedInsight === insight.id && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <div className="pt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Impact
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insight.impact}
                      </p>
                    </div>
                    
                    {insight.actions && insight.actions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1">
                          {insight.actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {insight.data && (
                      <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                        <pre className="text-xs text-gray-600 dark:text-gray-400">
                          {JSON.stringify(insight.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <LiveRegion message={announcement} politeness="polite" />
    </div>
  )
}