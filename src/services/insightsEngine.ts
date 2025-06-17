import type { DashboardData, CandidateAnalysis } from '../types'

export interface Insight {
  id: string
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  impact: string
  actions?: string[]
  data?: any
  color?: string
}

export class InsightsEngine {
  generateInsights(data: DashboardData): Insight[] {
    const insights: Insight[] = []

    // Analyze approval rate trends
    const approvalRate = (data.statusDistribution.approved / data.totalUsers) * 100
    if (approvalRate < 30) {
      insights.push({
        id: 'low-approval-rate',
        type: 'anomaly',
        title: 'Low Approval Rate Detected',
        description: `Only ${approvalRate.toFixed(1)}% of candidates are being approved, which is below industry average.`,
        priority: 'high',
        impact: 'This could indicate overly strict criteria or misaligned job requirements.',
        actions: [
          'Review rejection reasons for patterns',
          'Consider adjusting screening criteria',
          'Validate job requirements with hiring team'
        ]
      })
    }

    // Analyze response patterns
    const responseRate = ((data.statusDistribution.approved + data.statusDistribution.rejected) / data.totalUsers) * 100
    if (responseRate < 70) {
      insights.push({
        id: 'low-response-rate',
        type: 'anomaly',
        title: 'High No-Response Rate',
        description: `${(100 - responseRate).toFixed(1)}% of candidates are not responding to interviews.`,
        priority: 'medium',
        impact: 'Missing potential qualified candidates due to engagement issues.',
        actions: [
          'Review interview scheduling process',
          'Send reminder notifications',
          'Consider alternative communication channels'
        ]
      })
    }

    // Analyze conversation duration patterns
    const avgDuration = this.calculateAverageDuration(data.candidates)
    if (avgDuration < 5) {
      insights.push({
        id: 'short-conversations',
        type: 'trend',
        title: 'Short Interview Durations',
        description: 'Average conversation duration is under 5 minutes.',
        priority: 'medium',
        impact: 'May not be gathering enough information to make informed decisions.',
        actions: [
          'Review interview questions',
          'Train AI on follow-up questioning',
          'Consider adding screening questions'
        ]
      })
    }

    // Analyze daily patterns
    const dailyInsights = this.analyzeDailyPatterns(data.dailyConversations)
    insights.push(...dailyInsights)

    // Analyze sentiment correlation
    const sentimentInsights = this.analyzeSentimentCorrelation(data.candidates)
    insights.push(...sentimentInsights)

    // Generate predictions
    const predictions = this.generatePredictions(data)
    insights.push(...predictions)

    return insights
  }

  private calculateAverageDuration(candidates: CandidateAnalysis[]): number {
    const durations = candidates.map(c => c.conversationMetrics.duration)
    return durations.reduce((sum, d) => sum + d, 0) / durations.length
  }

  private analyzeDailyPatterns(dailyData: any[]): Insight[] {
    const insights: Insight[] = []
    
    // Find peak days
    const sortedDays = [...dailyData].sort((a, b) => b.count - a.count)
    if (sortedDays.length > 0 && sortedDays[0].count > sortedDays[sortedDays.length - 1].count * 3) {
      insights.push({
        id: 'uneven-distribution',
        type: 'trend',
        title: 'Uneven Interview Distribution',
        description: 'Some days have significantly more interviews than others.',
        priority: 'low',
        impact: 'May lead to interviewer fatigue and inconsistent evaluations.',
        actions: [
          'Consider load balancing interviews',
          'Set daily interview limits',
          'Automate scheduling distribution'
        ]
      })
    }

    return insights
  }

  private analyzeSentimentCorrelation(candidates: CandidateAnalysis[]): Insight[] {
    const insights: Insight[] = []
    
    const sentimentStats = {
      positive: { total: 0, approved: 0 },
      negative: { total: 0, approved: 0 },
      neutral: { total: 0, approved: 0 }
    }

    candidates.forEach(candidate => {
      const sentiment = candidate.sentiment?.toLowerCase() || 'neutral'
      const key = sentiment as keyof typeof sentimentStats
      sentimentStats[key].total++
      if (candidate.status === 'PASS') {
        sentimentStats[key].approved++
      }
    })

    // Check if negative sentiment candidates are being approved
    if (sentimentStats.negative.total > 0 && sentimentStats.negative.approved > 0) {
      const negativeApprovalRate = (sentimentStats.negative.approved / sentimentStats.negative.total) * 100
      if (negativeApprovalRate > 20) {
        insights.push({
          id: 'negative-sentiment-approvals',
          type: 'anomaly',
          title: 'Negative Sentiment Approvals',
          description: `${negativeApprovalRate.toFixed(1)}% of candidates with negative sentiment are being approved.`,
          priority: 'high',
          impact: 'May indicate sentiment analysis issues or evaluation criteria mismatch.',
          actions: [
            'Review negative sentiment cases',
            'Calibrate sentiment analysis',
            'Align evaluation criteria'
          ]
        })
      }
    }

    return insights
  }

  private generatePredictions(data: DashboardData): Insight[] {
    const insights: Insight[] = []
    
    // Predict future hiring needs
    const currentRate = data.statusDistribution.approved / data.totalUsers
    const weeklyAverage = data.dailyConversations.length > 0 
      ? data.dailyConversations.reduce((sum, d) => sum + d.count, 0) / Math.ceil(data.dailyConversations.length / 7)
      : 0

    if (weeklyAverage > 0) {
      const predictedApprovals = Math.round(weeklyAverage * currentRate)
      insights.push({
        id: 'weekly-prediction',
        type: 'prediction',
        title: 'Weekly Hiring Forecast',
        description: `Based on current trends, expect approximately ${predictedApprovals} approved candidates per week.`,
        priority: 'medium',
        impact: 'Helps with resource planning and team preparation.',
        actions: [
          'Prepare onboarding resources',
          'Schedule team availability',
          'Review capacity constraints'
        ],
        data: {
          weeklyAverage,
          approvalRate: currentRate,
          predictedApprovals
        }
      })
    }

    return insights
  }

  // Get contextual suggestions based on current view
  getContextualSuggestions(context: string, data: any): string[] {
    const suggestions: string[] = []

    switch (context) {
      case 'candidate-list':
        suggestions.push('Click on a candidate to view detailed conversation')
        suggestions.push('Use filters to focus on specific status groups')
        suggestions.push('Export filtered results for further analysis')
        break
      
      case 'low-approval':
        suggestions.push('Review common rejection reasons')
        suggestions.push('Consider adjusting screening criteria')
        suggestions.push('Analyze successful candidate patterns')
        break
      
      case 'high-duration':
        suggestions.push('Identify lengthy conversation patterns')
        suggestions.push('Optimize interview questions')
        suggestions.push('Set time limits for interviews')
        break
    }

    return suggestions
  }
}