import { OpenAI } from 'openai'

export interface ApiKeyValidation {
  isValid: boolean
  error?: string
}

// Cache validation results to avoid repeated API calls
const validationCache = new Map<string, { result: ApiKeyValidation; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const clearValidationCache = () => {
  validationCache.clear()
}

export const validateOpenAIApiKey = async (apiKey: string | undefined): Promise<ApiKeyValidation> => {
  console.log('Validating OpenAI API key...')
  
  // Check cache first
  if (apiKey) {
    const cached = validationCache.get(apiKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached validation result:', cached.result)
      return cached.result
    }
  }
  // Check if API key exists and has proper format
  if (!apiKey || apiKey.trim() === '') {
    return {
      isValid: false,
      error: 'API key is not configured',
    }
  }

  // Check for placeholder value
  if (apiKey === 'your_openai_api_key_here') {
    return {
      isValid: false,
      error: 'Please replace the placeholder with your actual API key',
    }
  }

  // Check basic format (OpenAI keys start with 'sk-')
  if (!apiKey.startsWith('sk-')) {
    console.log('API key does not start with "sk-"')
    return {
      isValid: false,
      error: 'Invalid API key format (must start with "sk-")',
    }
  }
  
  // Check key length (OpenAI keys are typically around 51 characters)
  if (apiKey.length < 40 || apiKey.length > 200) {
    console.log('API key has unusual length:', apiKey.length)
    return {
      isValid: false,
      error: 'Invalid API key format (unusual length)',
    }
  }

  // Test the API key with a minimal request
  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })

    // Make a minimal API call to verify the key works
    console.log('Testing API key with models.list()...')
    await openai.models.list()
    
    console.log('API key is valid!')
    const result = { isValid: true }
    
    // Cache the successful validation
    if (apiKey) {
      validationCache.set(apiKey, { result, timestamp: Date.now() })
    }
    
    return result
  } catch (error) {
    let result: ApiKeyValidation
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        result = {
          isValid: false,
          error: 'Invalid API key - authentication failed',
        }
      } else if (error.message.includes('429')) {
        // Rate limit hit means the key is valid but quota exceeded
        result = {
          isValid: true,
        }
      } else if (error.message.includes('network')) {
        result = {
          isValid: false,
          error: 'Network error - please check your connection',
        }
      } else {
        result = {
          isValid: false,
          error: 'Failed to validate API key',
        }
      }
    } else {
      result = {
        isValid: false,
        error: 'Failed to validate API key',
      }
    }
    
    // Cache failed validations too (with shorter duration)
    if (apiKey && !result.isValid) {
      validationCache.set(apiKey, { 
        result, 
        timestamp: Date.now() - (CACHE_DURATION - 60000) // Only cache for 1 minute
      })
    }
    
    return result
  }
}