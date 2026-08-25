import { useState, useEffect } from 'react'
import { useMediaQuery } from './hooks/useMediaQuery'
import { DesktopHomePage } from './components/desktop/DesktopHomePage'
import { MobileHomePage, MobileStoresPage } from './components/mobile'
import { StoresPage } from './pages/StoresPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryDetailPage } from './pages/CategoryDetailPage'

export default function App() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get('page') === 'stores') {
        return '/stores'
      }
      if (searchParams.get('page') === 'categories') {
        const cat = searchParams.get('category')
        return cat ? `/categories/${cat}` : '/categories'
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
      } else if (searchParams.get('page') === 'categories') {
        const cat = searchParams.get('category')
        setCurrentPath(cat ? `/categories/${cat}` : '/categories')
      } else {
        setCurrentPath(window.location.pathname)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const isStoresRoute = currentPath === '/stores' || currentPath.startsWith('/stores/')
  const isCategoriesRoute = currentPath === '/categories' || currentPath.startsWith('/categories/')

  if (isMobile) {
    if (isStoresRoute) {
      return <MobileStoresPage />
    }
    return <MobileHomePage />
  }

  if (isStoresRoute) {
    return <StoresPage />
  }

  if (isCategoriesRoute) {
    const categorySlug = currentPath.replace('/categories/', '').replace('/categories', '')
    if (categorySlug) {
      return <CategoryDetailPage categorySlug={categorySlug} />
    }
    return <CategoriesPage />
  }

  return <DesktopHomePage />
}
