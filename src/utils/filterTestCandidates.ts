import type { CandidateConversation } from '../types'

/**
 * Filters out candidates that have "test" in their name (case-insensitive)
 * @param conversations - Array of candidate conversations
 * @returns Filtered array without test candidates
 */
export const filterTestCandidates = (
  conversations: CandidateConversation[]
): CandidateConversation[] => {
  const originalCount = conversations.length

  // Filter out any candidate with "test" in their name (case-insensitive)
  const filtered = conversations.filter((conversation) => {
    const nameContainsTest = conversation.candidateName.toLowerCase().includes('test')

    if (nameContainsTest) {
      console.log(`Filtering out test candidate: ${conversation.candidateName}`)
    }

    return !nameContainsTest
  })

  const filteredCount = originalCount - filtered.length

  if (filteredCount > 0) {
    console.log(
      `🧹 Filtered out ${filteredCount} test candidate(s) from ${originalCount} total candidates`
    )
  }

  return filtered
}

/**
 * Gets statistics about filtered candidates
 * @param originalConversations - Original array before filtering
 * @param filteredConversations - Array after filtering
 * @returns Object with filtering statistics
 */
export const getFilteringStats = (
  originalConversations: CandidateConversation[],
  filteredConversations: CandidateConversation[]
) => {
  const testCandidates = originalConversations.filter((conv) =>
    conv.candidateName.toLowerCase().includes('test')
  )

  return {
    originalCount: originalConversations.length,
    filteredCount: filteredConversations.length,
    removedCount: originalConversations.length - filteredConversations.length,
    removedCandidates: testCandidates.map((c) => ({
      id: c.candidateId,
      name: c.candidateName,
      messages: c.messageCount,
    })),
  }
}
