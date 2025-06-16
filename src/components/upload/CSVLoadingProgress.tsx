import { useEffect, useState } from 'react'

interface CSVLoadingProgressProps {
  fileName: string
  fileSize: number
}

export const CSVLoadingProgress = ({ fileName, fileSize }: CSVLoadingProgressProps) => {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'reading' | 'parsing' | 'validating' | 'complete'>('reading')

  useEffect(() => {
    // Simulate progress
    const stages = [
      { stage: 'reading' as const, duration: 800, progress: 33 },
      { stage: 'parsing' as const, duration: 1000, progress: 66 },
      { stage: 'validating' as const, duration: 700, progress: 90 },
      { stage: 'complete' as const, duration: 300, progress: 100 },
    ]

    let currentStageIndex = 0
    
    const advanceStage = () => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex]
        setStage(currentStage.stage)
        setProgress(currentStage.progress)
        
        if (currentStageIndex < stages.length - 1) {
          setTimeout(() => {
            currentStageIndex++
            advanceStage()
          }, currentStage.duration)
        }
      }
    }

    advanceStage()
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const stageMessages = {
    reading: 'Reading CSV file...',
    parsing: 'Parsing conversation data...',
    validating: 'Validating data format...',
    complete: 'Processing complete!'
  }

  const stageIcons = {
    reading: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    parsing: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    validating: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    complete: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* File Icon with Animation */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-6 shadow-xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{fileName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(fileSize)}</p>
        </div>

        {/* Progress Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Current Stage */}
          <div className="flex items-center justify-center space-x-3 py-4">
            <div className={`text-blue-500 ${stage !== 'complete' ? 'animate-pulse' : ''}`}>
              {stageIcons[stage]}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {stageMessages[stage]}
            </p>
          </div>

          {/* Stage Steps */}
          <div className="flex justify-between items-center">
            {Object.entries(stageMessages).map(([key, label], index) => {
              const isActive = key === stage
              const isComplete = ['reading', 'parsing', 'validating', 'complete'].indexOf(key) <= 
                               ['reading', 'parsing', 'validating', 'complete'].indexOf(stage)
              
              return (
                <div key={key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        transition-all duration-300
                        ${isComplete 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }
                        ${isActive ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}
                      `}
                    >
                      {isComplete ? '✓' : index + 1}
                    </div>
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {label.split(' ')[0]}
                    </span>
                  </div>
                  {index < Object.entries(stageMessages).length - 1 && (
                    <div 
                      className={`
                        w-12 h-0.5 mx-1 transition-all duration-300
                        ${isComplete ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                      `}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Loading Animation */}
        {stage !== 'complete' && (
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full loading-dot"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full loading-dot"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full loading-dot"></div>
          </div>
        )}
      </div>
    </div>
  )
}