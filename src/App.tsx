import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useMediaQuery } from './hooks/useMediaQuery'
import { DesktopHomePage } from './components/desktop/DesktopHomePage'
import {
  MobileHomePage,
  MobileStoresPage,
  MobileDealsPage,
  MobileLootDealsPage,
  MobileCouponsPage,
  MobileSignUpPage,
  MobileLoginPage,
  MobileTermsPage,
  MobileCategoriesPage,
  MobileSubCategoriesPage,
  MobileStoresDirectoryPage,
  MobileBrandsDirectoryPage,
  MobileFestivalsDirectoryPage,
  MobileTravellingDirectoryPage,
  MobileBanksDirectoryPage,
  MobileCitiesDealsDirectoryPage,
  MobileBrandPage,
  MobileCreditCardsPage,
  MobileContactUsPage,
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
import { LoginPage } from './pages/LoginPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { MobilePrivacyPolicyPage } from './pages/MobilePrivacyPolicyPage'
import { AdvertisePage } from './pages/AdvertisePage'
import { MobileAdvertisePage } from './pages/MobileAdvertisePage'
import { AboutUsPage } from './pages/AboutUsPage'
import { FAQPage } from './pages/FAQPage'
import { MobileFAQPage } from './pages/MobileFAQPage'
import { ContactUsPage } from './pages/ContactUsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { WalletPage } from './pages/WalletPage'
import { ProfilePage } from './pages/ProfilePage'
import { OrdersPage } from './pages/OrdersPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ReferPage } from './pages/ReferPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { BrandPage } from './pages/BrandPage'
import { CreditCardsPage } from './pages/CreditCardsPage'
import { StaffLoginPage } from './pages/admin/StaffLoginPage'
import { ExecutiveDashboardPage } from './pages/admin/executive/ExecutiveDashboardPage'
import { ExecutiveDealsPage } from './pages/admin/executive/ExecutiveDealsPage'
import { ExecutiveLootDealsPage } from './pages/admin/executive/ExecutiveLootDealsPage'
import { ExecutiveStoresPage } from './pages/admin/executive/ExecutiveStoresPage'
import { ExecutiveCouponsPage } from './pages/admin/executive/ExecutiveCouponsPage'
import { ExecutiveCreditCardsPage } from './pages/admin/executive/ExecutiveCreditCardsPage'
import { ExecutiveBannersPage } from './pages/admin/executive/ExecutiveBannersPage'
import { ExecutiveAdvertisementsPage } from './pages/admin/executive/ExecutiveAdvertisementsPage'
import { OperationsDashboardPage } from './pages/admin/operations/OperationsDashboardPage'
import { OperationsApprovalsPage } from './pages/admin/operations/OperationsApprovalsPage'
import { OperationsCashbacksPage } from './pages/admin/operations/OperationsCashbacksPage'
import { OperationsSupportPage } from './pages/admin/operations/OperationsSupportPage'
import { OperationsStaffActivityPage } from './pages/admin/operations/OperationsStaffActivityPage'
import { OperationsMerchantsPage } from './pages/admin/operations/OperationsMerchantsPage'
import { WelcomeToast } from './components/auth/WelcomeToast'

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

  // Admin and Staff pages
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/dashboard' ||
    pathname === '/operational-manager/login' ||
    pathname === '/operational-manager' ||
    pathname.startsWith('/operational-manager/') ||
    pathname.startsWith('/executive/')
  ) {
    return pathname === '/operational-manager' ? '/operational-manager/dashboard' : pathname
  }

  // Sign Up page
  if (
    pathname === '/signup' ||
    pathname === '/sign-up' ||
    page === 'signup' ||
    page === 'sign-up'
  ) {
    return '/signup'
  }

  // Login page
  if (
    pathname === '/login' ||
    page === 'login'
  ) {
    return '/login'
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

  // Static Pages (/privacy, /about, /faq, /contact, /advertise)
  if (pathname === '/privacy' || page === 'privacy' || page === 'privacy-policy') return '/privacy'
  if (
    pathname === '/advertise' ||
    pathname === '/advertise-with-us' ||
    page === 'advertise' ||
    page === 'advertise-with-us'
  ) {
    return '/advertise'
  }
  if (pathname === '/about' || page === 'about' || page === 'about-us') return '/about'
  if (
    pathname === '/faq' ||
    pathname === '/help' ||
    pathname === '/help-faq' ||
    pathname === '/questions' ||
    page === 'faq' ||
    page === 'help' ||
    page === 'questions'
  ) {
    return '/faq'
  }
  if (pathname === '/contact' || pathname === '/contact-us' || page === 'contact' || page === 'contact-us') return '/contact'

  // Coupons landing page (/coupons)
  if (
    pathname === '/coupons' ||
    pathname.startsWith('/coupons/') ||
    page === 'coupons'
  ) {
    return '/coupons'
  }

  // Credit Cards page (/credit-cards)
  if (
    pathname === '/credit-cards' ||
    pathname.startsWith('/credit-cards/') ||
    page === 'credit-cards'
  ) {
    return '/credit-cards'
  }

  // Brand pages (/brands/:slug or /amazon or /stores/amazon)
  if (pathname === '/amazon' || page === 'amazon') {
    return '/brands/amazon'
  }
  if (pathname === '/stores/amazon' || (page === 'stores' && searchParams.get('store') === 'amazon')) {
    return '/brands/amazon'
  }
  if (pathname.startsWith('/brands/')) {
    return pathname
  }

  // Stores hero/landing page (/stores)
  if (page === 'stores' || pathname === '/stores' || pathname.startsWith('/stores/')) {
    return '/stores'
  }

  // Wallet page (/wallet)
  if (pathname === '/wallet' || page === 'wallet') return '/wallet'
  // Profile page
  if (pathname === '/profile' || page === 'profile') return '/profile'
  // Orders page
  if (pathname === '/orders' || page === 'orders') return '/orders'
  // Cart redirected to Favorites / Wishlist
  if (pathname === '/cart' || page === 'cart') return '/favorites'
  // Favorites page
  if (pathname === '/favorites' || pathname === '/wishlist' || page === 'favorites') return '/favorites'
  // Notifications page
  if (pathname === '/notifications' || page === 'notifications') return '/notifications'
  // Refer page
  if (pathname === '/refer' || pathname === '/refer-earn' || page === 'refer') return '/refer'

  // Admin login (/admin/login or /admin)
  if (pathname === '/admin' || pathname === '/admin/login' || page === 'admin-login') {
    return '/admin/login'
  }

  // Admin dashboard
  if (pathname === '/admin/dashboard' || page === 'admin-dashboard') {
    return '/admin/dashboard'
  }

  // Deals hero/landing page (/deals)
  if (page === 'deals' || pathname === '/deals' || pathname.startsWith('/deals/')) {
    return '/deals'
  }

  // Categories landing/detail (/categories or /categories/:slug)
  if (
    pathname === '/categories' ||
    pathname.startsWith('/categories/') ||
    page === 'categories'
  ) {
    if (page === 'categories') {
      return cat ? `/categories/${cat}` : '/categories'
    }
    return pathname
  }

  // If it's a known root path, or explicitly '/'
  if (pathname === '/') {
    return '/'
  }

  // If nothing matched, it's a 404
  return '/404'
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
        
        // Handle hash navigation
        const url = new URL(href, window.location.origin)
        if (url.hash) {
          setTimeout(() => {
            const element = document.getElementById(url.hash.substring(1))
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            } else {
              window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
            }
          }, 100)
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        }
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
  const isSignUpRoute = currentPath === '/signup' || currentPath === '/sign-up'
  const isLoginRoute = currentPath === '/login'
  const isTermsRoute =
    currentPath === '/terms' ||
    currentPath === '/terms-and-conditions' ||
    currentPath === '/terms-of-use' ||
    currentPath === '/terms-of-service'
  const isPrivacyRoute = currentPath === '/privacy'
  const isAdvertiseRoute = currentPath === '/advertise'
  const isAboutRoute = currentPath === '/about'
  const isFaqRoute = currentPath === '/faq'
  const isContactRoute = currentPath === '/contact'
  const isCouponsRoute = currentPath === '/coupons' || currentPath.startsWith('/coupons/')
  const isCreditCardsRoute = currentPath === '/credit-cards' || currentPath.startsWith('/credit-cards/')
  const isLootDealsRoute = currentPath === '/loot-deals' || currentPath.startsWith('/loot-deals/')
  const isStoresRoute = currentPath === '/stores' || currentPath.startsWith('/stores/')
  const isDealsRoute = currentPath === '/deals' || currentPath.startsWith('/deals/')
  const isCategoriesRoute = currentPath === '/categories' || currentPath.startsWith('/categories/')
  const isWalletRoute = currentPath === '/wallet'
  const isProfileRoute = currentPath === '/profile'
  const isOrdersRoute = currentPath === '/orders'
  const isCartRoute = currentPath === '/cart'
  const isFavoritesRoute = currentPath === '/favorites'
  const isNotificationsRoute = currentPath === '/notifications'
  const isReferRoute = currentPath === '/refer'
  const isAdminLoginRoute = currentPath === '/admin/login'
  const isAdminDashboardRoute = currentPath === '/admin/dashboard'
  const isStaffLoginRoute = 
    currentPath === '/operational-manager/login' || 
    currentPath === '/executive/login'
  const isOperationsRoute = 
    (currentPath.startsWith('/operational-manager/') || currentPath === '/operational-manager') && 
    currentPath !== '/operational-manager/login'
  const isExecutiveRoute = currentPath.startsWith('/executive/') && currentPath !== '/executive/login'
  const isBrandRoute = currentPath.startsWith('/brands/')
  const isNotFoundRoute = currentPath === '/404'
  const brandSlug = isBrandRoute ? currentPath.replace('/brands/', '') : ''

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
      if (isCreditCardsRoute) {
        return <MobileCreditCardsPage />
      }
      if (isCouponsRoute) {
        return <MobileCouponsPage />
      }
      if (isSignUpRoute) {
        return <MobileSignUpPage />
      }
      if (isLoginRoute) {
        return <MobileLoginPage />
      }
      if (isTermsRoute) {
        return <MobileTermsPage />
      }
      if (isPrivacyRoute) {
        return <MobilePrivacyPolicyPage />
      }
      if (isAdvertiseRoute) {
        return <MobileAdvertisePage />
      }
      if (isFaqRoute) {
        return <MobileFAQPage />
      }
      if (isContactRoute) {
        return <MobileContactUsPage />
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
      if (isWalletRoute) return <WalletPage />
      if (isProfileRoute) return <ProfilePage />
      if (isOrdersRoute) return <OrdersPage />
      if (isCartRoute) return <FavoritesPage />
      if (isFavoritesRoute) return <FavoritesPage />
      if (isNotificationsRoute) return <NotificationsPage />
      if (isReferRoute) return <ReferPage />
      if (isAdminLoginRoute) {
        return <AdminLoginPage />
      }
      if (isAdminDashboardRoute) {
        return <AdminDashboardPage />
      }
      if (isStaffLoginRoute) {
        return <StaffLoginPage />
      }
      if (isOperationsRoute) {
        if (currentPath === '/operational-manager/approvals') return <OperationsApprovalsPage />
        if (currentPath === '/operational-manager/cashbacks') return <OperationsCashbacksPage />
        if (currentPath === '/operational-manager/support') return <OperationsSupportPage />
        if (currentPath === '/operational-manager/staff-activity') return <OperationsStaffActivityPage />
        if (currentPath === '/operational-manager/merchants') return <OperationsMerchantsPage />
        return <OperationsDashboardPage />
      }
      if (isExecutiveRoute) {
        if (currentPath === '/executive/deals') return <ExecutiveDealsPage />
        if (currentPath === '/executive/loot-deals') return <ExecutiveLootDealsPage />
        if (currentPath === '/executive/stores') return <ExecutiveStoresPage />
        if (currentPath === '/executive/coupons') return <ExecutiveCouponsPage />
        if (currentPath === '/executive/credit-cards') return <ExecutiveCreditCardsPage />
        if (currentPath === '/executive/banners') return <ExecutiveBannersPage />
        if (currentPath === '/executive/advertisements') return <ExecutiveAdvertisementsPage />
        return <ExecutiveDashboardPage />
      }
      if (isBrandRoute) {
        return <MobileBrandPage brandSlug={brandSlug} />
      }
      if (isNotFoundRoute) {
        return <NotFoundPage />
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

    if (isLoginRoute) {
      return <LoginPage />
    }

    if (isTermsRoute) {
      return <TermsPage />
    }
    if (isPrivacyRoute) {
      return <PrivacyPolicyPage />
    }
    if (isAdvertiseRoute) {
      return <AdvertisePage />
    }
    if (isAboutRoute) {
      return <AboutUsPage />
    }
    if (isFaqRoute) {
      return <FAQPage />
    }
    if (isContactRoute) {
      return <ContactUsPage />
    }

    if (isCouponsRoute) {
      return <CouponsPage />
    }

    if (isCreditCardsRoute) {
      return <CreditCardsPage />
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

    if (isWalletRoute) return <WalletPage />
    if (isProfileRoute) return <ProfilePage />
    if (isOrdersRoute) return <OrdersPage />
    if (isCartRoute) return <FavoritesPage />
    if (isFavoritesRoute) return <FavoritesPage />
    if (isNotificationsRoute) return <NotificationsPage />
    if (isReferRoute) return <ReferPage />

    if (isAdminLoginRoute) {
      return <AdminLoginPage />
    }

    if (isStaffLoginRoute) {
      return <StaffLoginPage />
    }

    if (isOperationsRoute) {
      if (currentPath === '/operational-manager/approvals') return <OperationsApprovalsPage />
      if (currentPath === '/operational-manager/cashbacks') return <OperationsCashbacksPage />
      if (currentPath === '/operational-manager/support') return <OperationsSupportPage />
      if (currentPath === '/operational-manager/staff-activity') return <OperationsStaffActivityPage />
      if (currentPath === '/operational-manager/merchants') return <OperationsMerchantsPage />
      return <OperationsDashboardPage />
    }

    if (isExecutiveRoute) {
      if (currentPath === '/executive/deals') return <ExecutiveDealsPage />
      if (currentPath === '/executive/loot-deals') return <ExecutiveLootDealsPage />
      if (currentPath === '/executive/stores') return <ExecutiveStoresPage />
      if (currentPath === '/executive/coupons') return <ExecutiveCouponsPage />
      if (currentPath === '/executive/credit-cards') return <ExecutiveCreditCardsPage />
      if (currentPath === '/executive/banners') return <ExecutiveBannersPage />
      if (currentPath === '/executive/advertisements') return <ExecutiveAdvertisementsPage />
      return <ExecutiveDashboardPage />
    }

    if (isAdminDashboardRoute) {
      return <AdminDashboardPage />
    }

    if (isBrandRoute) {
      return <BrandPage brandSlug={brandSlug} />
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

    if (isNotFoundRoute) {
      return <NotFoundPage />
    }

    return <DesktopHomePage />
  }

  return (
    <GoogleOAuthProvider clientId="938902651101-d98pjaqlcnpel7b3ig2du9s63glbsoh9.apps.googleusercontent.com">
      <WelcomeToast />
      <div className="page-transition-wrapper">
        {renderContent()}
      </div>
    </GoogleOAuthProvider>
  )
}
