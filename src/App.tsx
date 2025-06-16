import { useState } from 'react'
import { DataProvider } from './contexts/DataProvider'
import { useData } from './hooks/useData'
import { UploadPage } from './components/upload/UploadPage'
import { AnalysisProgress } from './components/analysis/AnalysisProgress'
import { Dashboard } from './components/dashboard/Dashboard'
import { useApiKey } from './hooks/useApiKey'
import { processWithoutAI } from './services/basicAnalysisProcessor'
import { normalizeDashboardData } from './utils/dataHelpers'
import type { CandidateConversation, DashboardData, ParsedMessage } from './types'

// Helper function to create conversations map
function createConversationsMap(
  conversations: CandidateConversation[]
): Map<string, ParsedMessage[]> {
  console.log('Creating conversations map from:', conversations.length, 'conversations')
  const map = new Map<string, ParsedMessage[]>()
  conversations.forEach((conv) => {
    console.log(`  Adding conversation: candidateId="${conv.candidateId}", messages=${conv.messages.length}`)
    map.set(conv.candidateId, conv.messages)
  })
  console.log('Created map with', map.size, 'entries')
  console.log('Map keys:', Array.from(map.keys()))
  return map
}

function AppContent() {
  const [isDark, setIsDark] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { rawData, dashboardData, setRawData, setDashboardData, clearData } = useData()
  const { isConfigured } = useApiKey()

  const handleDataProcessed = async (data: CandidateConversation[]) => {
    setRawData(data)
    if (isConfigured) {
      setIsAnalyzing(true)
    } else {
      // Process without AI when API key is not configured
      const dashboardData = await processWithoutAI(data)
      setDashboardData(normalizeDashboardData(dashboardData))
    }
  }

  const handleAnalysisComplete = (data: DashboardData) => {
    setDashboardData(normalizeDashboardData(data))
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
          conversations={createConversationsMap(rawData)}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          onNewUpload={handleNewUpload}
        />
      ) : null}
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
