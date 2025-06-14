import { useState } from 'react'
import { FileUpload } from './FileUpload'
import { CSVFormatHelper } from './CSVFormatHelper'
import { ProgressIndicator } from '../common/ProgressIndicator'
import { parseCSVFile } from '../../services/csvParser'
import { parseSummaryCSVFile } from '../../services/csvParserSummary'
import { useApiKey } from '../../hooks/useApiKey'
import type { CandidateConversation } from '../../types'

interface UploadPageProps {
  onDataProcessed: (data: CandidateConversation[]) => void
}

export const UploadPage = ({ onDataProcessed }: UploadPageProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { isConfigured, isValidating, validationError } = useApiKey()

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setStatus('Reading CSV file...')

    try {
      // Read file to detect format
      const text = await file.text()
      const firstLine = text.split('\n')[0]
      
      // Detect CSV format based on headers
      const isSummaryFormat = firstLine.includes('candidateId') && firstLine.includes('messages')
      console.log('CSV Format detected:', isSummaryFormat ? 'Summary' : 'Standard')
      console.log('First line:', firstLine)
      
      // Parse CSV using appropriate parser
      setProgress(20)
      const parseResult = isSummaryFormat 
        ? await parseSummaryCSVFile(file)
        : await parseCSVFile(file)
      
      console.log('Parse result:', parseResult)

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
            {!isValidating && !isConfigured && validationError && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        OpenAI API Key Issue
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        {validationError}. AI analysis features will be unavailable until a valid API key is configured.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isValidating && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-blue-800 dark:text-blue-200">Validating OpenAI API key...</p>
                  </div>
                </div>
              </div>
            )}
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
