import { useEffect, useState } from 'react'

const screenSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
type ScreenSize = (typeof screenSizes)[number]

const breakpoints: Record<Exclude<ScreenSize, 'xs'>, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const atLeast = (screenSize: ScreenSize, compareTo: ScreenSize) =>
  screenSizes.indexOf(screenSize) >= screenSizes.indexOf(compareTo)

const getBreakpoint = (width: number): ScreenSize => {
  if (width < breakpoints.sm) return 'xs'
  if (width < breakpoints.md) return 'sm'
  if (width < breakpoints.lg) return 'md'
  if (width < breakpoints.xl) return 'lg'
  if (width < breakpoints['2xl']) return 'xl'
  return '2xl'
}

export const useScreenSize = () => {
  const [breakpoint, setBreakpoint] = useState(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'md',
  )

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth)
      setBreakpoint(newBreakpoint)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
