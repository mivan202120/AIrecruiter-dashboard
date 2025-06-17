import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { validateFileType, validateFileSize } from '../../utils/validators'
import { LiveRegion } from '../common/LiveRegion'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setAnnouncement('File detected. Drop to upload.')
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const validateFile = (file: File): boolean => {
    setError(null)

    if (!validateFileType(file)) {
      setError('Please upload a CSV file')
      return false
    }

    if (!validateFileSize(file)) {
      setError('File size must be less than 50MB')
      return false
    }

    return true
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0])
      setAnnouncement(`File ${files[0].name} uploaded successfully.`)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0])
      setAnnouncement(`File ${files[0].name} uploaded successfully.`)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file"
        aria-describedby="upload-helper-text"
        aria-disabled={isProcessing}
        className={`
          relative overflow-hidden border-2 border-dashed rounded-xl p-12 text-center 
          transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-primary-500/25
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 scale-[1.02] shadow-elevation-3'
              : isHovered
              ? 'border-primary-400 dark:border-primary-600 bg-neutral-50 dark:bg-neutral-800 shadow-elevation-2'
              : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-600'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isProcessing) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-6">
          {/* Animated icon container */}
          <div className="flex justify-center">
            <div className={`relative transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <svg
                className={`w-20 h-20 transition-colors duration-300 ${
                  isDragging 
                    ? 'text-primary-500 animate-bounce' 
                    : isHovered 
                    ? 'text-primary-400' 
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {isDragging && (
                <div className="absolute inset-0 animate-ping">
                  <svg
                    className="w-20 h-20 text-primary-500 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {isDragging ? 'Drop your CSV file here' : 'Upload recruitment data'}
            </p>
            <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
              Drag and drop or{' '}
              <span className="text-primary-700 hover:text-primary-800 font-semibold cursor-pointer hover:underline">
                browse files
              </span>
            </p>
          </div>

          <div id="upload-helper-text" className="flex items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV format
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Max 50MB
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}

      <LiveRegion message={announcement} politeness="polite" />
    </div>
  )
}
