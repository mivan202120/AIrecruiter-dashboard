import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { DashboardData } from '../../types'

interface ResultsDistributionProps {
  data: DashboardData
}

export const ResultsDistribution = ({ data }: ResultsDistributionProps) => {
  const { statusDistribution, totalUsers } = data

  const distributionData = [
    {
      status: 'Approved',
      count: statusDistribution.approved,
      percentage: (statusDistribution.approved / totalUsers) * 100,
      color: '#22c55e',
    },
    {
      status: 'Rejected',
      count: statusDistribution.rejected,
      percentage: (statusDistribution.rejected / totalUsers) * 100,
      color: '#ef4444',
    },
    {
      status: 'No Response',
      count: statusDistribution.noResponse,
      percentage: (statusDistribution.noResponse / totalUsers) * 100,
      color: '#9ca3af',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Results Distribution
      </h2>

      {/* Horizontal Stacked Bar */}
      <div className="mb-6">
        <div className="flex h-12 rounded-lg overflow-hidden">
          {distributionData.map((item) => (
            <div
              key={item.status}
              className="relative group"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {distributionData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.status} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="status"
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-gray-600 dark:text-gray-400" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
              formatter={(value: number) => [`${value} candidates`, 'Count']}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
