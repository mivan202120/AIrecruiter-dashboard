import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { DashboardData } from '../../types'

interface ResultsDistributionProps {
  data: DashboardData
}

const COLORS = {
  approved: '#10b981',
  rejected: '#ef4444',
  noResponse: '#6b7280',
}

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  count,
}: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null // Don't show label for very small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      {count}
    </text>
  )
}

export const ResultsDistribution = ({ data }: ResultsDistributionProps) => {
  const { statusDistribution, totalUsers } = data

  const pieData = [
    {
      name: 'Approved',
      value: statusDistribution.approved,
      percentage: (statusDistribution.approved / totalUsers) * 100,
      color: COLORS.approved,
    },
    {
      name: 'Rejected',
      value: statusDistribution.rejected,
      percentage: (statusDistribution.rejected / totalUsers) * 100,
      color: COLORS.rejected,
    },
    {
      name: 'No Response',
      value: statusDistribution.noResponse,
      percentage: (statusDistribution.noResponse / totalUsers) * 100,
      color: COLORS.noResponse,
    },
  ].filter(item => item.value > 0) // Only show segments with data

  const renderCustomizedLabel = (props: any) => {
    const item = pieData.find(d => d.name === props.name)
    return <CustomLabel {...props} count={item?.value || 0} />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Candidate Status Distribution
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Overall recruitment outcomes from AI interviews
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px 12px',
                }}
                formatter={(value: number, name: string) => [
                  `${value} candidates`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          {pieData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.value} {item.value === 1 ? 'candidate' : 'candidates'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}

          {/* Key Metrics */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {((statusDistribution.approved / totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Response Rate
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {(((statusDistribution.approved + statusDistribution.rejected) / totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}