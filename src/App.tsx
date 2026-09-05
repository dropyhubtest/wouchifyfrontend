import { useState, useEffect } from 'react'
import { useMediaQuery } from './hooks/useMediaQuery'
import { DesktopHomePage } from './components/desktop/DesktopHomePage'
import {
  MobileHomePage,
  MobileStoresPage,
  MobileDealsPage,
  MobileLootDealsPage,
  MobileCouponsPage,
  MobileSignUpPage,
  MobileTermsPage,
  MobileCategoriesPage,
  MobileSubCategoriesPage,
  MobileStoresDirectoryPage,
  MobileBrandsDirectoryPage,
  MobileFestivalsDirectoryPage,
  MobileTravellingDirectoryPage,
  MobileBanksDirectoryPage,
  MobileCitiesDealsDirectoryPage,
} from './components/mobile'
import { StoresPage } from './pages/StoresPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryDetailPage } from './pages/CategoryDetailPage'
import { SubCategoriesPage } from './pages/SubCategoriesPage'
import { StoresDirectoryPage } from './pages/StoresDirectoryPage'
import { BrandsDirectoryPage } from './pages/BrandsDirectoryPage'
import { BanksDirectoryPage } from './pages/BanksDirectoryPage'
import { FestivalsDirectoryPage } from './pages/FestivalsDirectoryPage'
import { TravellingDirectoryPage } from './pages/TravellingDirectoryPage'
import { CitiesDealsDirectoryPage } from './pages/CitiesDealsDirectoryPage'
import { DealsPage } from './pages/DealsPage'
import { LootDealsPage } from './pages/LootDealsPage'
import { CouponsPage } from './pages/CouponsPage'
import { SignUpPage } from './pages/SignUpPage'
import { TermsPage } from './pages/TermsPage'
import { WalletPage } from './pages/WalletPage'

function resolveCurrentPath(): string {
  if (typeof window === 'undefined') return '/'

  const pathname = window.location.pathname
  const searchParams = new URLSearchParams(window.location.search)
  const page = searchParams.get('page')
  const cat = searchParams.get('category')
  const type = searchParams.get('type')

  // Top priority 1: Cities Deals directory (/categories/cities-deals)
  if (
    pathname === '/categories/cities-deals' ||
    page === 'categories-cities-deals' ||
    (page === 'categories' && cat === 'cities-deals')
  ) {
    return '/categories/cities-deals'
  }

  // Top priority 2: Travelling directory (/categories/travelling)
  if (
    pathname === '/categories/travelling' ||
    page === 'categories-travelling' ||
    (page === 'categories' && cat === 'travelling')
  ) {
    return '/categories/travelling'
  }

  // Top priority 3: Festivals directory (/categories/festivals)
  if (
    pathname === '/categories/festivals' ||
    page === 'categories-festivals' ||
    (page === 'categories' && cat === 'festivals')
  ) {
    return '/categories/festivals'
  }

  // Top priority 4: Banks directory (/categories/banks)
  if (
    pathname === '/categories/banks' ||
    page === 'categories-banks' ||
    (page === 'categories' && cat === 'banks')
  ) {
    return '/categories/banks'
  }

  // Top priority 5: Brands directory (/categories/brands)
  if (
    pathname === '/categories/brands' ||
    page === 'categories-brands' ||
    (page === 'categories' && cat === 'brands')
  ) {
    return '/categories/brands'
  }

  // Top priority 6: Stores directory (/categories/stores)
  if (
    pathname === '/categories/stores' ||
    page === 'categories-stores' ||
    (page === 'categories' && cat === 'stores')
  ) {
    return '/categories/stores'
  }

  // Top priority 7: Subcategories directory (/categories/subcategories)
  if (
    pathname === '/categories/subcategories' ||
    pathname === '/subcategories' ||
    page === 'subcategories' ||
    cat === 'subcategories'
  ) {
    return '/categories/subcategories'
  }

  // Top priority 8: Loot Deals hero/landing page (/loot-deals or /deals?type=flash)
  if (
    pathname === '/loot-deals' ||
    pathname.startsWith('/loot-deals/') ||
    page === 'loot-deals' ||
    page === 'loot' ||
    (pathname === '/deals' && (type === 'flash' || type === 'flash-style' || type === 'loot'))
  ) {
    return '/loot-deals'
  }

  // Sign Up / Login page (/signup or /login)
  if (
    pathname === '/signup' ||
    pathname === '/sign-up' ||
    pathname === '/login' ||
    page === 'signup' ||
    page === 'sign-up' ||
    page === 'login'
  ) {
    return '/signup'
  }

  // Terms & Conditions page (/terms or /terms-of-use)
  if (
    pathname === '/terms' ||
    pathname === '/terms-and-conditions' ||
    pathname === '/terms-of-use' ||
    pathname === '/terms-of-service' ||
    page === 'terms' ||
    page === 'terms-and-conditions' ||
    page === 'terms-of-use' ||
    page === 'terms-of-service'
  ) {
    return '/terms'
  }

  // Coupons landing page (/coupons)
  if (
    pathname === '/coupons' ||
    pathname.startsWith('/coupons/') ||
    page === 'coupons'
  ) {
    return '/coupons'
  }

  // Stores hero/landing page (/stores)
  if (page === 'stores' || pathname === '/stores' || pathname.startsWith('/stores/')) {
    return '/stores'
  }

  // Wallet page (/wallet)
  if (pathname === '/wallet' || page === 'wallet') {
    return '/wallet'
  }

  // Deals hero/landing page (/deals)
  if (page === 'deals' || pathname === '/deals' || pathname.startsWith('/deals/')) {
    return '/deals'
  }

  // Categories landing/detail
  if (page === 'categories') {
    return cat ? `/categories/${cat}` : '/categories'
  }

  if (pathname && pathname !== '/') {
    return pathname
  }

  return '/'
}

export default function App() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [currentPath, setCurrentPath] = useState<string>(resolveCurrentPath)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(resolveCurrentPath())
    }

    // Intercept internal link clicks for seamless client-side SPA navigation
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (
        href &&
        (href.startsWith('/') || href.startsWith('?')) &&
        !target.hasAttribute('download') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault()
        window.history.pushState({}, '', href)
        setCurrentPath(resolveCurrentPath())
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    document.addEventListener('click', handleDocumentClick)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  const isCitiesDealsDirectoryRoute = currentPath === '/categories/cities-deals'
  const isTravellingDirectoryRoute = currentPath === '/categories/travelling'
  const isFestivalsDirectoryRoute = currentPath === '/categories/festivals'
  const isBanksDirectoryRoute = currentPath === '/categories/banks'
  const isBrandsDirectoryRoute = currentPath === '/categories/brands'
  const isStoresDirectoryRoute = currentPath === '/categories/stores'
  const isSubcategoriesRoute = currentPath === '/categories/subcategories'
  const isSignUpRoute = currentPath === '/signup' || currentPath === '/sign-up' || currentPath === '/login'
  const isTermsRoute =
    currentPath === '/terms' ||
    currentPath === '/terms-and-conditions' ||
    currentPath === '/terms-of-use' ||
    currentPath === '/terms-of-service'
  const isCouponsRoute = currentPath === '/coupons' || currentPath.startsWith('/coupons/')
  const isLootDealsRoute = currentPath === '/loot-deals' || currentPath.startsWith('/loot-deals/')
  const isStoresRoute = currentPath === '/stores' || currentPath.startsWith('/stores/')
  const isDealsRoute = currentPath === '/deals' || currentPath.startsWith('/deals/')
  const isCategoriesRoute = currentPath === '/categories' || currentPath.startsWith('/categories/')
  const isWalletRoute = currentPath === '/wallet'

  const renderContent = () => {
    if (isMobile) {
      if (isCitiesDealsDirectoryRoute) {
        return <MobileCitiesDealsDirectoryPage />
      }
      if (isTravellingDirectoryRoute) {
        return <MobileTravellingDirectoryPage />
      }
      if (isFestivalsDirectoryRoute) {
        return <MobileFestivalsDirectoryPage />
      }
      if (isBanksDirectoryRoute) {
        return <MobileBanksDirectoryPage />
      }
      if (isBrandsDirectoryRoute) {
        return <MobileBrandsDirectoryPage />
      }
      if (isStoresDirectoryRoute) {
        return <MobileStoresDirectoryPage />
      }
      if (isSubcategoriesRoute) {
        return <MobileSubCategoriesPage />
      }
      if (isLootDealsRoute) {
        return <MobileLootDealsPage />
      }
      if (isCouponsRoute) {
        return <MobileCouponsPage />
      }
      if (isSignUpRoute) {
        return <MobileSignUpPage />
      }
      if (isTermsRoute) {
        return <MobileTermsPage />
      }
      if (isStoresRoute) {
        return <MobileStoresPage />
      }
      if (isDealsRoute) {
        return <MobileDealsPage />
      }
      if (isCategoriesRoute) {
        return <MobileCategoriesPage />
      }
      if (isWalletRoute) {
        // Fallback to desktop WalletPage for mobile temporarily
        return <WalletPage />
      }
      return <MobileHomePage />
    }

    if (isCitiesDealsDirectoryRoute) {
      return <CitiesDealsDirectoryPage />
    }

    if (isTravellingDirectoryRoute) {
      return <TravellingDirectoryPage />
    }

    if (isFestivalsDirectoryRoute) {
      return <FestivalsDirectoryPage />
    }

    if (isBanksDirectoryRoute) {
      return <BanksDirectoryPage />
    }

    if (isBrandsDirectoryRoute) {
      return <BrandsDirectoryPage />
    }

    if (isStoresDirectoryRoute) {
      return <StoresDirectoryPage />
    }

    if (isSignUpRoute) {
      return <SignUpPage />
    }

    if (isTermsRoute) {
      return <TermsPage />
    }

    if (isCouponsRoute) {
      return <CouponsPage />
    }

    if (isLootDealsRoute) {
      return <LootDealsPage />
    }

    if (isStoresRoute) {
      return <StoresPage />
    }

    if (isDealsRoute) {
      return <DealsPage />
    }

    if (isWalletRoute) {
      return <WalletPage />
    }

    if (isSubcategoriesRoute) {
      return <SubCategoriesPage />
    }

    if (isCategoriesRoute) {
      const categorySlug = currentPath
        .replace('/categories/', '')
        .replace('/categories', '')
      if (
        categorySlug &&
        categorySlug !== 'subcategories' &&
        categorySlug !== 'stores' &&
        categorySlug !== 'brands' &&
        categorySlug !== 'banks' &&
        categorySlug !== 'festivals' &&
        categorySlug !== 'travelling' &&
        categorySlug !== 'cities-deals'
      ) {
        return <CategoryDetailPage categorySlug={categorySlug} />
      }
      return <CategoriesPage />
    }

    return <DesktopHomePage />
  }

  return (
    <div key={currentPath} className="page-transition-wrapper">
      {renderContent()}
    </div>
  )
}
