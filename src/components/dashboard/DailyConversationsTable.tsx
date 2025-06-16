import React, { useState } from 'react'
import type { DailyConversationCount } from '../../types'
import { formatDateForDisplay, getDayOfWeek } from '../../utils/conversationStats'

interface DailyConversationsTableProps {
  data: DailyConversationCount[]
}

export const DailyConversationsTable = ({ data }: DailyConversationsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (date: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedRows(newExpanded)
  }

  // Calculate totals
  const totalConversations = data.reduce((sum, d) => sum + d.count, 0)
  const avgPerDay = totalConversations / data.length

  // Sort data by date (most recent first)
  const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Daily Conversation Summary
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Detailed breakdown of conversations by date
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Conversations
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Candidates
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((item) => {
              const isExpanded = expandedRows.has(item.date)
              return (
                <React.Fragment key={item.date}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => toggleRow(item.date)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDateForDisplay(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getDayOfWeek(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {item.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-400">
                      <button
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleRow(item.date)
                        }}
                      >
                        {item.candidates.length}
                        <svg
                          className={`ml-1 h-4 w-4 transform transition-transform ${
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
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Candidates interviewed:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {item.candidates.map((candidate, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                              >
                                <span className="mr-2">•</span>
                                {candidate}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <td
                colSpan={2}
                className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Total
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {totalConversations}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg: {avgPerDay.toFixed(1)}/day
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
