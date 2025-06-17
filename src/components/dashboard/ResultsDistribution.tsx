import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts'
import type { DashboardData } from '../../types'

interface ResultsDistributionProps {
  data: DashboardData
}

const COLORS = {
  approved: '#22c55e',
  rejected: '#ef4444',
  noResponse: '#6b7280',
}

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  count: number
}

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  count,
}: CustomLabelProps) => {
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

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-2xl font-bold">
        {value}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#374151" className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#6b7280" className="text-xs">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  )
}

export const ResultsDistribution = ({ data }: ResultsDistributionProps) => {
  const { statusDistribution, totalUsers } = data
  const [activeIndex, setActiveIndex] = useState(0)

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
  ].filter((item) => item.value > 0) // Only show segments with data

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
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
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number, name: string) => [`${value} candidates`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          {pieData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-900 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => setActiveIndex(pieData.indexOf(item))}
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.value} {item.value === 1 ? 'candidate' : 'candidates'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}

          {/* Key Metrics */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {((statusDistribution.approved / totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {(
                    ((statusDistribution.approved + statusDistribution.rejected) / totalUsers) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
