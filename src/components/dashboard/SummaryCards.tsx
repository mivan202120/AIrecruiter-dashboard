import type { DashboardData } from '../../types'
import { formatPercentage } from '../../utils/formatters'

interface SummaryCardsProps {
  data: DashboardData
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  const { totalUsers, statusDistribution } = data
  const approvalRate = (statusDistribution.approved / totalUsers) * 100
  const responseRate =
    ((statusDistribution.approved + statusDistribution.rejected) / totalUsers) * 100

  const cards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Approved Candidates',
      value: statusDistribution.approved,
      subtitle: formatPercentage(approvalRate),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: 'bg-green-50 dark:bg-green-950',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Rejected Candidates',
      value: statusDistribution.rejected,
      subtitle: formatPercentage((statusDistribution.rejected / totalUsers) * 100),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: 'bg-red-50 dark:bg-red-950',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'No Response',
      value: statusDistribution.noResponse,
      subtitle: formatPercentage((statusDistribution.noResponse / totalUsers) * 100),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {card.value}
              </p>
              {card.subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{card.subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <div className={card.textColor}>{card.icon}</div>
            </div>
          </div>
          {index === 0 && (
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Response Rate: {formatPercentage(responseRate)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
