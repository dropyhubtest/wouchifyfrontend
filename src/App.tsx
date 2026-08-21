import { useState, useEffect } from 'react'
import { useMediaQuery } from './hooks/useMediaQuery'
import { DesktopHomePage } from './components/desktop/DesktopHomePage'
import { MobileHomePage } from './components/mobile'
import { StoresPage } from './pages/StoresPage'

export default function App() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get('page') === 'stores') {
        return '/stores'
      }
      return window.location.pathname
    }
    return '/'
  })

  useEffect(() => {
    const handleLocationChange = () => {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get('page') === 'stores') {
        setCurrentPath('/stores')
      } else {
        setCurrentPath(window.location.pathname)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  if (isMobile) {
    return <MobileHomePage />
  }

  if (currentPath === '/stores' || currentPath.startsWith('/stores/')) {
    return <StoresPage />
  }

  return <DesktopHomePage />
}
