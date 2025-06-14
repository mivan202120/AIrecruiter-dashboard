import { useState } from 'react'
import { FileUpload } from './FileUpload'
import { CSVFormatHelper } from './CSVFormatHelper'
import { ProgressIndicator } from '../common/ProgressIndicator'
import { parseCSVFile } from '../../services/csvParser'
import type { CandidateConversation } from '../../types'

interface UploadPageProps {
  onDataProcessed: (data: CandidateConversation[]) => void
}

export const UploadPage = ({ onDataProcessed }: UploadPageProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setStatus('Reading CSV file...')

    try {
      // Parse CSV
      setProgress(20)
      const parseResult = await parseCSVFile(file)

      if (!parseResult.success || !parseResult.data) {
        throw new Error(parseResult.error || 'Failed to parse CSV file')
      }

      setProgress(40)
      setStatus(`Processed ${parseResult.data.length} candidates...`)

      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProgress(60)
      setStatus('Organizing conversation data...')

      // Calculate metrics
      const totalMessages = parseResult.data.reduce((sum, conv) => sum + conv.messageCount, 0)
      setProgress(80)
      setStatus(`Analyzed ${totalMessages} messages...`)

      await new Promise((resolve) => setTimeout(resolve, 500))

      setProgress(100)
      setStatus('Complete!')

      // Pass data to parent
      setTimeout(() => {
        onDataProcessed(parseResult.data!)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-purple bg-clip-text text-transparent mb-4">
            AI Recruiter Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your CSV file to analyze recruitment conversations
          </p>
        </header>

        {!isProcessing ? (
          <>
            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            {error && (
              <div className="max-w-2xl mx-auto mt-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}
            <CSVFormatHelper />
          </>
        ) : (
          <ProgressIndicator
            progress={progress}
            status={status}
            estimatedTime={progress < 100 ? '10 seconds' : undefined}
          />
        )}
      </div>
    </div>
  )
}
