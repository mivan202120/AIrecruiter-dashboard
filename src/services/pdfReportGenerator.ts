import jsPDF from 'jspdf'
import type { DashboardData } from '../types'

interface PDFTheme {
  primary: string
  secondary: string
  text: {
    primary: string
    secondary: string
    light: string
  }
  status: {
    approved: string
    notApproved: string
    pending: string
  }
}

const theme: PDFTheme = {
  primary: '#2563eb',
  secondary: '#9333ea',
  text: {
    primary: '#111827',
    secondary: '#374151',
    light: '#6b7280',
  },
  status: {
    approved: '#16a34a',
    notApproved: '#dc2626',
    pending: '#f59e0b',
  },
}

export class PDFReportGenerator {
  private pdf: jsPDF
  private currentY: number
  private pageNumber: number
  private readonly margin = 20
  private readonly pageWidth = 210
  private readonly pageHeight = 297
  private readonly contentWidth: number

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })
    this.currentY = this.margin
    this.pageNumber = 1
    this.contentWidth = this.pageWidth - 2 * this.margin
  }

  async generateReport(data: DashboardData): Promise<void> {
    try {
      // Add header
      this.addHeader(data)

      // Add summary section
      this.addSummarySection(data)

      // Add status distribution chart
      this.addStatusDistribution(data)

      // Add key insights
      this.addKeyInsights(data)

      // Add sentiment analysis
      this.addSentimentAnalysis(data)

      // Add recommendations
      this.addRecommendations(data)

      // Add footer to all pages
      this.addFooterToAllPages()

      // Save the PDF
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      this.pdf.save(`AI-Recruitment-Report_${timestamp}.pdf`)
    } catch (error) {
      console.error('Error generating PDF report:', error)
      throw error
    }
  }

  private addHeader(_data: DashboardData): void {
    // Background gradient effect
    this.pdf.setFillColor(37, 99, 235)
    this.pdf.rect(0, 0, this.pageWidth, 60, 'F')

    // Title
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(24)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('AI Recruitment Analytics Report', this.pageWidth / 2, 25, { align: 'center' })

    // Subtitle
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text('Comprehensive Analysis of Candidate Interviews', this.pageWidth / 2, 35, {
      align: 'center',
    })

    // Date
    this.pdf.setFontSize(10)
    this.pdf.text(
      `Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      this.pageWidth / 2,
      45,
      { align: 'center' }
    )

    this.currentY = 70
    this.pdf.setTextColor(0, 0, 0)
  }

  private addSummarySection(data: DashboardData): void {
    this.addSectionTitle('Executive Summary')

    // Create summary cards
    const summaryData = [
      { label: 'Total Candidates', value: data.totalUsers.toString(), color: theme.primary },
      { label: 'Total Messages', value: data.totalMessages.toString(), color: theme.secondary },
      {
        label: 'Success Rate',
        value: `${((data.statusDistribution.approved / data.totalUsers) * 100).toFixed(1)}%`,
        color: theme.status.approved,
      },
      {
        label: 'Avg Messages/Candidate',
        value: Math.round(data.totalMessages / data.totalUsers).toString(),
        color: theme.primary,
      },
    ]

    const cardWidth = (this.contentWidth - 30) / 4
    const cardHeight = 25
    let x = this.margin

    summaryData.forEach((item) => {
      // Card background
      this.pdf.setFillColor(245, 247, 250)
      this.pdf.roundedRect(x, this.currentY, cardWidth, cardHeight, 3, 3, 'F')

      // Label
      this.pdf.setFontSize(9)
      this.pdf.setTextColor(...this.hexToRgb(theme.text.light))
      this.pdf.text(item.label, x + cardWidth / 2, this.currentY + 8, { align: 'center' })

      // Value
      this.pdf.setFontSize(16)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.setTextColor(...this.hexToRgb(item.color))
      this.pdf.text(item.value, x + cardWidth / 2, this.currentY + 18, { align: 'center' })

      x += cardWidth + 10
    })

    this.currentY += cardHeight + 15
    this.pdf.setFont('helvetica', 'normal')
  }

  private addStatusDistribution(data: DashboardData): void {
    this.checkPageBreak(60)
    this.addSectionTitle('Status Distribution')

    const total = data.totalUsers
    const statuses = [
      { label: 'Approved', value: data.statusDistribution.approved, color: theme.status.approved },
      {
        label: 'Not Approved',
        value: data.statusDistribution.not_approved,
        color: theme.status.notApproved,
      },
      { label: 'Pending', value: data.statusDistribution.pending, color: theme.status.pending },
    ]

    // Draw horizontal bar chart instead of pie chart
    const barHeight = 8
    const maxBarWidth = 100
    const startX = this.margin
    let barY = this.currentY + 10

    statuses.forEach((status) => {
      const percentage = (status.value / total) * 100
      const barWidth = (percentage / 100) * maxBarWidth

      // Draw background bar
      this.pdf.setFillColor(229, 231, 235)
      this.pdf.rect(startX + 60, barY, maxBarWidth, barHeight, 'F')

      // Draw filled bar
      this.pdf.setFillColor(...this.hexToRgb(status.color))
      this.pdf.rect(startX + 60, barY, barWidth, barHeight, 'F')

      // Label
      this.pdf.setFontSize(10)
      this.pdf.setTextColor(...this.hexToRgb(theme.text.secondary))
      this.pdf.text(status.label, startX, barY + 6)

      // Value and percentage
      this.pdf.text(
        `${status.value} (${percentage.toFixed(1)}%)`,
        startX + 65 + maxBarWidth,
        barY + 6
      )

      barY += barHeight + 8
    })

    this.currentY = barY + 10
  }

  private addKeyInsights(data: DashboardData): void {
    this.checkPageBreak(80)
    this.addSectionTitle('Key Insights')

    this.pdf.setFontSize(10)
    this.pdf.setTextColor(...this.hexToRgb(theme.text.secondary))

    data.aggregateAnalysis.keyInsights.forEach((insight) => {
      this.checkPageBreak(20)

      // Bullet point
      this.pdf.setFillColor(...this.hexToRgb(theme.primary))
      this.pdf.circle(this.margin + 3, this.currentY - 2, 1.5, 'F')

      // Insight text
      const lines = this.pdf.splitTextToSize(insight, this.contentWidth - 10)
      this.pdf.text(lines, this.margin + 10, this.currentY)

      this.currentY += lines.length * 5 + 5
    })

    this.currentY += 10
  }

  private addSentimentAnalysis(data: DashboardData): void {
    this.checkPageBreak(80)
    this.addSectionTitle('Sentiment Analysis Overview')

    // Calculate average sentiment
    const sentiments = data.candidates.map((c) => c.sentimentScore).filter((s) => s > 0)
    const avgSentiment =
      sentiments.length > 0 ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length : 0

    // Draw sentiment gauge
    const centerX = this.pageWidth / 2
    const gaugeY = this.currentY + 20
    const gaugeWidth = 120
    const gaugeHeight = 10

    // Background
    this.pdf.setFillColor(229, 231, 235)
    this.pdf.roundedRect(centerX - gaugeWidth / 2, gaugeY, gaugeWidth, gaugeHeight, 5, 5, 'F')

    // Fill based on sentiment
    const fillWidth = (avgSentiment / 5) * gaugeWidth
    const sentimentColor =
      avgSentiment >= 4
        ? theme.status.approved
        : avgSentiment >= 3
          ? theme.status.pending
          : theme.status.notApproved

    this.pdf.setFillColor(...this.hexToRgb(sentimentColor))
    this.pdf.roundedRect(centerX - gaugeWidth / 2, gaugeY, fillWidth, gaugeHeight, 5, 5, 'F')

    // Labels
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(...this.hexToRgb(theme.text.secondary))
    this.pdf.text('Negative', centerX - gaugeWidth / 2 - 5, gaugeY + 7, { align: 'right' })
    this.pdf.text('Positive', centerX + gaugeWidth / 2 + 5, gaugeY + 7)

    // Score
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(`${avgSentiment.toFixed(2)}/5.0`, centerX, gaugeY + 25, { align: 'center' })

    this.currentY = gaugeY + 35
    this.pdf.setFont('helvetica', 'normal')
  }

  private addRecommendations(data: DashboardData): void {
    this.checkPageBreak(80)
    this.addSectionTitle('Strategic Recommendations')

    this.pdf.setFontSize(10)
    this.pdf.setTextColor(...this.hexToRgb(theme.text.secondary))

    data.aggregateAnalysis.recommendations.forEach((recommendation, index) => {
      this.checkPageBreak(25)

      // Recommendation box
      this.pdf.setFillColor(239, 246, 255)
      const lines = this.pdf.splitTextToSize(recommendation, this.contentWidth - 20)
      const boxHeight = lines.length * 5 + 10

      this.pdf.roundedRect(this.margin, this.currentY - 5, this.contentWidth, boxHeight, 3, 3, 'F')

      // Number
      this.pdf.setFillColor(...this.hexToRgb(theme.primary))
      this.pdf.circle(this.margin + 10, this.currentY + boxHeight / 2 - 5, 8, 'F')
      this.pdf.setTextColor(255, 255, 255)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text((index + 1).toString(), this.margin + 10, this.currentY + boxHeight / 2 - 2, {
        align: 'center',
      })

      // Text
      this.pdf.setTextColor(...this.hexToRgb(theme.text.primary))
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(lines, this.margin + 25, this.currentY + 2)

      this.currentY += boxHeight + 8
    })
  }

  private addSectionTitle(title: string): void {
    this.checkPageBreak(20)
    this.pdf.setFontSize(16)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(...this.hexToRgb(theme.text.primary))
    this.pdf.text(title, this.margin, this.currentY)
    this.currentY += 10

    // Underline
    this.pdf.setDrawColor(...this.hexToRgb(theme.primary))
    this.pdf.setLineWidth(0.5)
    this.pdf.line(this.margin, this.currentY - 5, this.margin + 40, this.currentY - 5)

    this.currentY += 5
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.pdf.addPage()
      this.currentY = this.margin
      this.pageNumber++
    }
  }

  private addFooterToAllPages(): void {
    const totalPages = this.pdf.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i)

      // Footer line
      this.pdf.setDrawColor(229, 231, 235)
      this.pdf.setLineWidth(0.5)
      this.pdf.line(
        this.margin,
        this.pageHeight - 15,
        this.pageWidth - this.margin,
        this.pageHeight - 15
      )

      // Page number
      this.pdf.setFontSize(9)
      this.pdf.setTextColor(...this.hexToRgb(theme.text.light))
      this.pdf.text(`Page ${i} of ${totalPages}`, this.pageWidth / 2, this.pageHeight - 8, {
        align: 'center',
      })

      // Timestamp
      this.pdf.setFontSize(8)
      this.pdf.text(`Generated on ${new Date().toLocaleString()}`, this.margin, this.pageHeight - 8)
    }
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0]
  }
}
