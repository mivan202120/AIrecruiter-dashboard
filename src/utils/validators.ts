import { REQUIRED_CSV_COLUMNS } from '../constants'

export const validateCSVHeaders = (
  headers: string[]
): { isValid: boolean; missingColumns: string[] } => {
  const missingColumns = REQUIRED_CSV_COLUMNS.filter((required) => !headers.includes(required))

  return {
    isValid: missingColumns.length === 0,
    missingColumns,
  }
}

export const validateFileType = (file: File): boolean => {
  return file.type === 'text/csv' || file.name.endsWith('.csv')
}

export const validateFileSize = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
