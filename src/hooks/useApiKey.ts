import { useState, useEffect } from 'react'
import { validateOpenAIApiKey } from '../services/apiKeyValidator'

export const useApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const [isConfigured, setIsConfigured] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    const checkApiKey = async () => {
      setIsValidating(true)
      const validation = await validateOpenAIApiKey(apiKey)
      setIsConfigured(validation.isValid)
      setValidationError(validation.error || null)
      setIsValidating(false)
    }

    checkApiKey()
  }, [apiKey])

  return {
    isConfigured,
    isValidating,
    validationError,
    apiKey,
  }
}