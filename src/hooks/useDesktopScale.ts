import { useState, useEffect } from 'react'

/**
 * Hook to compute proportional desktop scale relative to 1920px reference canvas.
 * For viewports >= 1920px, returns 1.
 * For viewports < 1920px, returns window.innerWidth / 1920.
 */
export function useDesktopScale(): number {
  const [scale, setScale] = useState<number>(() => {
    if (typeof window === 'undefined') return 1
    const width = window.innerWidth
    return width >= 1920 ? 1 : width / 1920
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScale(width >= 1920 ? 1 : width / 1920)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return scale
}

export default useDesktopScale
