export const useApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const isConfigured = apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.length > 0

  return {
    isConfigured,
    apiKey,
  }
}
