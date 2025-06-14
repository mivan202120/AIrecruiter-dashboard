import { useState } from 'react'
import { DataProvider } from './contexts/DataProvider'
import { useData } from './hooks/useData'
import { UploadPage } from './components/upload/UploadPage'
import { AnalysisProgress } from './components/analysis/AnalysisProgress'
import { Dashboard } from './components/dashboard/Dashboard'
import { useApiKey } from './hooks/useApiKey'
import type { CandidateConversation, DashboardData } from './types'

function AppContent() {
  const [isDark, setIsDark] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { rawData, dashboardData, setRawData, setDashboardData, clearData } = useData()
  const { isConfigured } = useApiKey()

  const handleDataProcessed = (data: CandidateConversation[]) => {
    setRawData(data)
    if (isConfigured) {
      setIsAnalyzing(true)
    }
  }

  const handleAnalysisComplete = (data: DashboardData) => {
    setDashboardData(data)
    setIsAnalyzing(false)
  }

  const handleNewUpload = () => {
    clearData()
    setIsAnalyzing(false)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {!rawData ? (
        <UploadPage onDataProcessed={handleDataProcessed} />
      ) : isAnalyzing ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-purple bg-clip-text text-transparent">
                AI Recruiter Analytics Dashboard
              </h1>
            </header>
            <AnalysisProgress conversations={rawData} onComplete={handleAnalysisComplete} />
          </div>
        </div>
      ) : dashboardData ? (
        <Dashboard
          data={dashboardData}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          onNewUpload={handleNewUpload}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-purple bg-clip-text text-transparent">
                AI Recruiter Analytics Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <button
                  onClick={handleNewUpload}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Upload New File
                </button>
              </div>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Data Processed Successfully
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {rawData.length}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {rawData.reduce((sum, conv) => sum + conv.messageCount, 0)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAnalyzing(true)}
                className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Start AI Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}

export default App
