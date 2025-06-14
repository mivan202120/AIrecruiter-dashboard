import { createContext } from 'react'
import type { CandidateConversation, DashboardData } from '../types'

export interface DataContextType {
  rawData: CandidateConversation[] | null
  dashboardData: DashboardData | null
  setRawData: (data: CandidateConversation[] | null) => void
  setDashboardData: (data: DashboardData) => void
  clearData: () => void
}

export const DataContext = createContext<DataContextType | undefined>(undefined)
