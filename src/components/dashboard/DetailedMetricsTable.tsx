import { useState } from 'react'
import type { CandidateAnalysis } from '../../types'
import { formatDuration, formatDate } from '../../utils/dateUtils'
import { STATUS_COLORS } from '../../constants'

interface DetailedMetricsTableProps {
  candidates: CandidateAnalysis[]
}

type SortField = 'name' | 'status' | 'messages' | 'duration' | 'startTime'
type SortDirection = 'asc' | 'desc'

export const DetailedMetricsTable = ({ candidates }: DetailedMetricsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date

    switch (sortField) {
      case 'name':
        aValue = a.candidateName.toLowerCase()
        bValue = b.candidateName.toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'messages':
        aValue = a.conversationMetrics.messageCount
        bValue = b.conversationMetrics.messageCount
        break
      case 'duration':
        aValue = a.conversationMetrics.duration
        bValue = b.conversationMetrics.duration
        break
      case 'startTime':
        aValue = a.conversationMetrics.startTime.getTime()
        bValue = b.conversationMetrics.startTime.getTime()
        break
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const statusLabels = {
    PASS: 'Approved',
    FAIL: 'Rejected',
    NO_RESP: 'No Response',
  }

  const SortIcon = ({ field }: { field: SortField }) => (
    <svg
      className={`w-4 h-4 inline-block ml-1 ${
        sortField === field ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {sortField === field && sortDirection === 'desc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      )}
    </svg>
  )

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Comprehensive Process Metrics
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  Candidate Name
                  <SortIcon field="name" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <SortIcon field="status" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('messages')}
                >
                  Messages
                  <SortIcon field="messages" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('duration')}
                >
                  Duration
                  <SortIcon field="duration" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('startTime')}
                >
                  Start Time
                  <SortIcon field="startTime" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sentiment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedCandidates.map((candidate) => (
                <tr
                  key={candidate.candidateId}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-750 ${
                    candidate.status === 'PASS'
                      ? 'bg-green-50/20 dark:bg-green-950/20'
                      : candidate.status === 'FAIL'
                        ? 'bg-red-50/20 dark:bg-red-950/20'
                        : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {candidate.candidateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${
                        STATUS_COLORS[candidate.status]
                      }`}
                    >
                      {statusLabels[candidate.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {candidate.conversationMetrics.messageCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDuration(candidate.conversationMetrics.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(candidate.conversationMetrics.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {candidate.sentiment || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
