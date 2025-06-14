import { useState } from 'react'
import type { CandidateAnalysis } from '../../types'
import { CandidateCard } from './CandidateCard'

interface CandidateListProps {
  candidates: CandidateAnalysis[]
  selectedId: string | null
  onSelectCandidate: (id: string | null) => void
}

export const CandidateList = ({
  candidates,
  selectedId,
  onSelectCandidate,
}: CandidateListProps) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'PASS' | 'FAIL' | 'NO_RESP'>('all')

  const filteredCandidates = candidates.filter(
    (candidate) => filterStatus === 'all' || candidate.status === filterStatus
  )

  const groupedCandidates = {
    PASS: filteredCandidates.filter((c) => c.status === 'PASS'),
    FAIL: filteredCandidates.filter((c) => c.status === 'FAIL'),
    NO_RESP: filteredCandidates.filter((c) => c.status === 'NO_RESP'),
  }

  const statusLabels = {
    PASS: 'Approved',
    FAIL: 'Rejected',
    NO_RESP: 'No Response',
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button
          onClick={() => setFilterStatus('all')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          All ({candidates.length})
        </button>
        {Object.entries(groupedCandidates).map(([status, items]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as 'PASS' | 'FAIL' | 'NO_RESP')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {statusLabels[status as keyof typeof statusLabels]} ({items.length})
          </button>
        ))}
      </div>

      {/* Candidate Cards */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filterStatus === 'all' ? (
          Object.entries(groupedCandidates).map(([status, candidates]) => (
            <div key={status}>
              {candidates.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.candidateId}
                        candidate={candidate}
                        isExpanded={selectedId === candidate.candidateId}
                        onToggle={() =>
                          onSelectCandidate(
                            selectedId === candidate.candidateId ? null : candidate.candidateId
                          )
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="space-y-2">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.candidateId}
                candidate={candidate}
                isExpanded={selectedId === candidate.candidateId}
                onToggle={() =>
                  onSelectCandidate(
                    selectedId === candidate.candidateId ? null : candidate.candidateId
                  )
                }
              />
            ))}
          </div>
        )}

        {filteredCandidates.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No candidates found with the selected filter.
          </p>
        )}
      </div>
    </div>
  )
}
