import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'

interface BreakpointConfig {
  mobile: number
  tablet: number
  desktop: number
  largeDesktop: number
}

const breakpoints: BreakpointConfig = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
  largeDesktop: Infinity,
}

export const useResponsive = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('desktop')
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowSize({ width, height: window.innerHeight })

      if (width < breakpoints.mobile) {
        setCurrentBreakpoint('mobile')
      } else if (width < breakpoints.tablet) {
        setCurrentBreakpoint('tablet')
      } else if (width < breakpoints.desktop) {
        setCurrentBreakpoint('desktop')
      } else {
        setCurrentBreakpoint('largeDesktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    breakpoint: currentBreakpoint,
    isMobile: currentBreakpoint === 'mobile',
    isTablet: currentBreakpoint === 'tablet',
    isDesktop: currentBreakpoint === 'desktop' || currentBreakpoint === 'largeDesktop',
    windowSize,
  }
}