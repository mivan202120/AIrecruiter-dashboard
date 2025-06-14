interface ProgressIndicatorProps {
  progress: number
  status: string
  estimatedTime?: string
}

export const ProgressIndicator = ({ progress, status, estimatedTime }: ProgressIndicatorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Processing Your Data
            </h3>
            <span className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">{status}</p>
            {estimatedTime && (
              <p className="text-gray-500 dark:text-gray-500">Estimated time: {estimatedTime}</p>
            )}
          </div>

          <div className="flex items-center justify-center pt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
