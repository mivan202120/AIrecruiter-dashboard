export interface Comment {
  id: string
  candidateId: string
  author: string
  content: string
  timestamp: Date
  type: 'comment' | 'annotation' | 'decision'
  metadata?: {
    position?: { x: number; y: number }
    color?: string
    resolved?: boolean
  }
}

export interface CommentThread {
  id: string
  candidateId: string
  comments: Comment[]
  status: 'open' | 'resolved'
  participants: string[]
}

export class CommentsService {
  private comments: Map<string, Comment[]> = new Map()
  private threads: Map<string, CommentThread> = new Map()

  // In a real app, this would sync with a backend
  constructor() {
    this.loadFromLocalStorage()
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('recruitment-comments')
    if (stored) {
      const data = JSON.parse(stored)
      this.comments = new Map(data.comments)
      this.threads = new Map(data.threads)
    }
  }

  private saveToLocalStorage() {
    const data = {
      comments: Array.from(this.comments.entries()),
      threads: Array.from(this.threads.entries())
    }
    localStorage.setItem('recruitment-comments', JSON.stringify(data))
  }

  addComment(candidateId: string, comment: Omit<Comment, 'id' | 'timestamp'>): Comment {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    const candidateComments = this.comments.get(candidateId) || []
    candidateComments.push(newComment)
    this.comments.set(candidateId, candidateComments)
    
    this.saveToLocalStorage()
    return newComment
  }

  getCommentsForCandidate(candidateId: string): Comment[] {
    return this.comments.get(candidateId) || []
  }

  updateComment(commentId: string, updates: Partial<Comment>): Comment | null {
    for (const [candidateId, comments] of this.comments.entries()) {
      const index = comments.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments[index] = { ...comments[index], ...updates }
        this.comments.set(candidateId, comments)
        this.saveToLocalStorage()
        return comments[index]
      }
    }
    return null
  }

  deleteComment(commentId: string): boolean {
    for (const [candidateId, comments] of this.comments.entries()) {
      const index = comments.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.splice(index, 1)
        this.comments.set(candidateId, comments)
        this.saveToLocalStorage()
        return true
      }
    }
    return false
  }

  // Thread management
  createThread(candidateId: string, initialComment: Comment): CommentThread {
    const thread: CommentThread = {
      id: `thread-${Date.now()}`,
      candidateId,
      comments: [initialComment],
      status: 'open',
      participants: [initialComment.author]
    }

    this.threads.set(thread.id, thread)
    this.saveToLocalStorage()
    return thread
  }

  addToThread(threadId: string, comment: Comment): CommentThread | null {
    const thread = this.threads.get(threadId)
    if (thread) {
      thread.comments.push(comment)
      if (!thread.participants.includes(comment.author)) {
        thread.participants.push(comment.author)
      }
      this.threads.set(threadId, thread)
      this.saveToLocalStorage()
      return thread
    }
    return null
  }

  resolveThread(threadId: string): boolean {
    const thread = this.threads.get(threadId)
    if (thread) {
      thread.status = 'resolved'
      this.threads.set(threadId, thread)
      this.saveToLocalStorage()
      return true
    }
    return false
  }

  getThreadsForCandidate(candidateId: string): CommentThread[] {
    return Array.from(this.threads.values()).filter(
      thread => thread.candidateId === candidateId
    )
  }

  // Analytics
  getCommentStats() {
    const stats = {
      totalComments: 0,
      totalThreads: this.threads.size,
      openThreads: 0,
      resolvedThreads: 0,
      commentsByType: {
        comment: 0,
        annotation: 0,
        decision: 0
      }
    }

    for (const comments of this.comments.values()) {
      stats.totalComments += comments.length
      comments.forEach(comment => {
        stats.commentsByType[comment.type]++
      })
    }

    for (const thread of this.threads.values()) {
      if (thread.status === 'open') {
        stats.openThreads++
      } else {
        stats.resolvedThreads++
      }
    }

    return stats
  }
}