import { useState } from 'react'
import { PDFReportGenerator } from '../../services/pdfReportGenerator'
import type { DashboardData } from '../../types'
import { useResponsive } from '../../hooks/useResponsive'

interface PDFDownloadProps {
  data: DashboardData
}

export const PDFDownload = ({ data }: PDFDownloadProps) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { isMobile } = useResponsive()

  const handleDownload = async () => {
    setIsGenerating(true)

    try {
      const generator = new PDFReportGenerator()
      await generator.generateReport(data)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Ha ocurrido un error al generar el PDF. Por favor, inténtelo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'} bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:shadow-elevation-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label="Descargar reporte PDF"
    >
      {isGenerating ? (
        <>
          <svg className={`animate-spin ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {!isMobile && <span>Generando PDF...</span>}
        </>
      ) : (
        <>
          <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {!isMobile && <span>Descargar PDF</span>}
        </>
      )}
    </button>
  )
}
