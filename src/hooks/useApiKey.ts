export const useApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const isConfigured = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 0

  return {
    isConfigured,
    apiKey,
  }
}
