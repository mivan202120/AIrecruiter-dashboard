import { useState, useEffect } from 'react'
import { CommentsService, type Comment } from '../../services/commentsService'
import { Button } from '../common/Button'
import { formatDate } from '../../utils/dateUtils'

interface CommentsPanelProps {
  candidateId: string
  candidateName: string
  onClose: () => void
}

const CommentTypeIcon = ({ type }: { type: Comment['type'] }) => {
  switch (type) {
    case 'comment':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'annotation':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    case 'decision':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

export const CommentsPanel = ({ candidateId, candidateName, onClose }: CommentsPanelProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<Comment['type']>('comment')
  const [currentUser] = useState('Current User') // In real app, get from auth
  const [isSubmitting, setIsSubmitting] = useState(false)

  const commentsService = new CommentsService()

  useEffect(() => {
    loadComments()
  }, [candidateId])

  const loadComments = () => {
    const candidateComments = commentsService.getCommentsForCandidate(candidateId)
    setComments(candidateComments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    
    const comment = commentsService.addComment(candidateId, {
      candidateId,
      author: currentUser,
      content: newComment.trim(),
      type: commentType
    })

    setComments([comment, ...comments])
    setNewComment('')
    setIsSubmitting(false)
  }

  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      commentsService.deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-neutral-800 shadow-elevation-4 z-40 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Comments & Notes
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            aria-label="Close comments"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {candidateName}
        </p>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-neutral-500 dark:text-neutral-400">
              No comments yet. Be the first to add one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    comment.type === 'decision' ? 'bg-success/10 text-success' :
                    comment.type === 'annotation' ? 'bg-warning/10 text-warning' :
                    'bg-primary-50 text-primary-600'
                  }`}>
                    <CommentTypeIcon type={comment.type} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                        {comment.author}
                      </span>
                      {comment.author === currentUser && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                          aria-label="Delete comment"
                        >
                          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{formatDate(comment.timestamp)}</span>
                      <span className="capitalize">{comment.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-neutral-200 dark:border-neutral-700">
        <div className="mb-3">
          <div className="flex gap-2 mb-3">
            {(['comment', 'annotation', 'decision'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCommentType(type)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                  commentType === type
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Add a ${commentType}...`}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={isSubmitting}
          disabled={!newComment.trim()}
        >
          Add {commentType}
        </Button>
      </form>
    </div>
  )
}