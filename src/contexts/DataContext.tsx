import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { CandidateConversation, DashboardData } from '../types'

export interface DataContextType {
  rawData: CandidateConversation[] | null
  dashboardData: DashboardData | null
  setRawData: (data: CandidateConversation[] | null) => void
  setDashboardData: (data: DashboardData) => void
  clearData: () => void
}

export const DataContext = createContext<DataContextType | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [rawData, setRawData] = useState<CandidateConversation[] | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const clearData = () => {
    setRawData(null)
    setDashboardData(null)
  }

  return (
    <DataContext.Provider
      value={{
        rawData,
        dashboardData,
        setRawData,
        setDashboardData,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
