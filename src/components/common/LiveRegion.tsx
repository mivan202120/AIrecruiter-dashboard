import { FC, useEffect, useState } from 'react'

interface LiveRegionProps {
  message: string
  politeness?: 'polite' | 'assertive'
  clearAfter?: number
}

export const LiveRegion: FC<LiveRegionProps> = ({ 
  message, 
  politeness = 'polite',
  clearAfter = 5000 
}) => {
  const [announcement, setAnnouncement] = useState(message)

  useEffect(() => {
    setAnnouncement(message)
    
    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setAnnouncement('')
      }, clearAfter)
      
      return () => clearTimeout(timer)
    }
  }, [message, clearAfter])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

// Hook for using live regions
export const useLiveAnnouncer = () => {
  const [message, setMessage] = useState('')

  const announce = (text: string, politeness: 'polite' | 'assertive' = 'polite') => {
    // Clear and re-set to ensure announcement is made
    setMessage('')
    setTimeout(() => setMessage(text), 100)
  }

  return { message, announce }
}