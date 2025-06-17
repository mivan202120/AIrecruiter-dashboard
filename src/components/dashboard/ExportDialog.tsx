import { FC, useState } from 'react'
import { Button } from '../common/Button'
import type { DashboardData } from '../../types'
import { PDFReportGenerator } from '../../services/pdfReportGenerator'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  data: DashboardData
}

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json'

interface ExportOption {
  format: ExportFormat
  label: string
  description: string
  icon: JSX.Element
}

const exportOptions: ExportOption[] = [
  {
    format: 'pdf',
    label: 'PDF Report',
    description: 'Complete formatted report with charts',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    format: 'excel',
    label: 'Excel Spreadsheet',
    description: 'Data tables in XLSX format',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    format: 'csv',
    label: 'CSV File',
    description: 'Raw data in comma-separated format',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    format: 'json',
    label: 'JSON Data',
    description: 'Complete data in JSON format',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
]

export const ExportDialog: FC<ExportDialogProps> = ({ isOpen, onClose, data }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)

    try {
      switch (selectedFormat) {
        case 'pdf':
          const generator = new PDFReportGenerator()
          await generator.generateReport(data)
          break
        
        case 'csv':
          exportToCSV(data)
          break
        
        case 'json':
          exportToJSON(data)
          break
        
        case 'excel':
          // Excel export would require a library like xlsx
          alert('Excel export coming soon!')
          break
      }
      
      onClose()
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = (data: DashboardData) => {
    const rows = [
      ['Candidate Name', 'Status', 'Duration', 'Message Count', 'Sentiment', 'Start Time'],
      ...data.candidates.map(c => [
        c.candidateName,
        c.status,
        c.conversationMetrics.duration,
        c.conversationMetrics.messageCount,
        c.sentiment || 'N/A',
        new Date(c.conversationMetrics.startTime).toISOString()
      ])
    ]

    const csvContent = rows.map(row => row.join(',')).join('\n')
    downloadFile(csvContent, 'recruitment-report.csv', 'text/csv')
  }

  const exportToJSON = (data: DashboardData) => {
    const jsonContent = JSON.stringify(data, null, 2)
    downloadFile(jsonContent, 'recruitment-report.json', 'application/json')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Export options"
    >
      <div
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-elevation-4 p-6 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Export Report
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => setSelectedFormat(option.format)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-elevation-2 ${
                selectedFormat === option.format
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
              }`}
            >
              <div className={`mb-2 ${selectedFormat === option.format ? 'text-primary-600' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {option.icon}
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                {option.label}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            Export as {exportOptions.find(o => o.format === selectedFormat)?.label}
          </Button>
        </div>
      </div>
    </div>
  )
}