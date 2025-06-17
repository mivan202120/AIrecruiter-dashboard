import { useState } from 'react'
import type { CandidateAnalysis } from '../../types'
import type { ParsedMessage } from '../../types'
import { CandidateCard } from './CandidateCard'
import { ConversationViewer } from './ConversationViewer'

interface CandidateListProps {
  candidates: CandidateAnalysis[]
  selectedId: string | null
  onSelectCandidate: (id: string | null) => void
  conversations?: Map<string, ParsedMessage[]>
}

export const CandidateList = ({
  candidates,
  selectedId,
  onSelectCandidate,
  conversations,
}: CandidateListProps) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'PASS' | 'FAIL' | 'NO_RESP'>('all')
  const [viewingCandidate, setViewingCandidate] = useState<CandidateAnalysis | null>(null)

  console.log('CandidateList - conversations prop:', conversations)
  console.log('CandidateList - conversations size:', conversations?.size)

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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header with Filter Tabs */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Candidate Analysis Results
        </h2>
        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-transparent'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-600'
            }`}
          >
            All ({candidates.length})
          </button>
          {Object.entries(groupedCandidates).map(([status, items]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as 'PASS' | 'FAIL' | 'NO_RESP')}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-transparent'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-600'
              }`}
            >
              {statusLabels[status as keyof typeof statusLabels]} ({items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards Container */}
      <div className="p-6 bg-gray-50 dark:bg-slate-900">
        <div className="space-y-4">
          {filterStatus === 'all' ? (
            <>
              {Object.entries(groupedCandidates).map(
                ([status, statusCandidates]) =>
                  statusCandidates.length > 0 && (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {statusLabels[status as keyof typeof statusLabels]}
                        </h3>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
                      </div>
                      <div className="grid gap-3">
                        {statusCandidates.map((candidate) => (
                          <CandidateCard
                            key={candidate.candidateId}
                            candidate={candidate}
                            isExpanded={selectedId === candidate.candidateId}
                            onToggle={() =>
                              onSelectCandidate(
                                selectedId === candidate.candidateId ? null : candidate.candidateId
                              )
                            }
                            onViewConversation={
                              conversations ? () => setViewingCandidate(candidate) : undefined
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </>
          ) : (
            <div className="grid gap-3">
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
                  onViewConversation={
                    conversations ? () => setViewingCandidate(candidate) : undefined
                  }
                />
              ))}
            </div>
          )}

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No candidates found with the selected filter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Viewer Modal */}
      {viewingCandidate && conversations && (
        <ConversationViewer
          candidate={viewingCandidate}
          conversations={conversations}
          isOpen={!!viewingCandidate}
          onClose={() => setViewingCandidate(null)}
        />
      )}
    </div>
  )
}
