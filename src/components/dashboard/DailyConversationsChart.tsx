import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import type { DailyConversationCount } from '../../types'
import { formatDateForDisplay } from '../../utils/conversationStats'

interface DailyConversationsChartProps {
  data: DailyConversationCount[]
  isDark: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: DailyConversationCount
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {formatDateForDisplay(data.date)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Conversations: <span className="font-semibold">{data.count}</span>
        </p>
        {data.candidates.length <= 5 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium">Candidates:</p>
            {data.candidates.map((name, i) => (
              <p key={i}>• {name}</p>
            ))}
          </div>
        )}
      </div>
    )
  }
  return null
}

export const DailyConversationsChart = ({ data, isDark }: DailyConversationsChartProps) => {
  const [activeBar, setActiveBar] = useState<number | null>(null)
  
  // Prepare data for the chart
  const chartData = data.map((item) => ({
    ...item,
    displayDate: formatDateForDisplay(item.date),
    shortDate: new Date(item.date).getDate().toString(),
  }))

  const maxCount = Math.max(...data.map((d) => d.count))
  const yAxisMax = Math.ceil(maxCount * 1.2) // Add 20% padding

  const getBarColor = (index: number) => {
    if (activeBar === null) return '#6200ee'
    return activeBar === index ? '#6200ee' : '#e0e0e0'
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-elevation-1 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Daily Conversation Activity
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Number of recruitment conversations per day
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#374151' : '#E5E7EB'}
              vertical={false}
            />
            <XAxis
              dataKey="shortDate"
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
            />
            <YAxis
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
              domain={[0, yAxisMax]}
              ticks={Array.from({ length: yAxisMax + 1 }, (_, i) => i)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar 
              dataKey="count" 
              radius={[8, 8, 0, 0]} 
              maxBarSize={60}
              onMouseEnter={(_, index) => setActiveBar(index)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Total days</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{data.length}</p>
        </div>
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Average per day</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {(data.reduce((sum, d) => sum + d.count, 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Peak activity</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{maxCount}</p>
        </div>
      </div>
    </div>
  )
}
