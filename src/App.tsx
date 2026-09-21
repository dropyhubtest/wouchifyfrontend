import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useMediaQuery } from './hooks/useMediaQuery'
import React, { Suspense } from 'react'

const DesktopHomePage = React.lazy(() => import('./components/desktop/DesktopHomePage').then(module => ({ default: module.DesktopHomePage })))
const MobileHomePage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileHomePage })))
const MobileStoresPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileStoresPage })))
const MobileDealsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileDealsPage })))
const MobileLootDealsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileLootDealsPage })))
const MobileCouponsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileCouponsPage })))
const MobileSignUpPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileSignUpPage })))
const MobileLoginPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileLoginPage })))
const MobileTermsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileTermsPage })))
const MobileCategoriesPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileCategoriesPage })))
const MobileSubCategoriesPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileSubCategoriesPage })))
const MobileStoresDirectoryPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileStoresDirectoryPage })))
const MobileBrandsDirectoryPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileBrandsDirectoryPage })))
const MobileFestivalsDirectoryPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileFestivalsDirectoryPage })))
const MobileTravellingDirectoryPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileTravellingDirectoryPage })))
const MobileBanksDirectoryPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileBanksDirectoryPage })))
const MobileCitiesDealsDirectoryPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileCitiesDealsDirectoryPage })))
const MobileBrandPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileBrandPage })))
const MobileCreditCardsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileCreditCardsPage })))
const MobileContactUsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileContactUsPage })))
const MobileWishlistPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileWishlistPage })))
const MobileWalletPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileWalletPage })))
const MobileReferPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileReferPage })))
const MobileProductPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileProductPage })))
const MobileNotificationsPage = React.lazy(() => import('./components/mobile').then(module => ({ default: module.MobileNotificationsPage })))

const StoresPage = React.lazy(() => import('./pages/StoresPage').then(module => ({ default: module.StoresPage })))
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage').then(module => ({ default: module.CategoriesPage })))
const CategoryDetailPage = React.lazy(() => import('./pages/CategoryDetailPage').then(module => ({ default: module.CategoryDetailPage })))
const SubCategoriesPage = React.lazy(() => import('./pages/SubCategoriesPage').then(module => ({ default: module.SubCategoriesPage })))
const StoresDirectoryPage = React.lazy(() => import('./pages/StoresDirectoryPage').then(module => ({ default: module.StoresDirectoryPage })))
const BrandsDirectoryPage = React.lazy(() => import('./pages/BrandsDirectoryPage').then(module => ({ default: module.BrandsDirectoryPage })))
const BanksDirectoryPage = React.lazy(() => import('./pages/BanksDirectoryPage').then(module => ({ default: module.BanksDirectoryPage })))
const FestivalsDirectoryPage = React.lazy(() => import('./pages/FestivalsDirectoryPage').then(module => ({ default: module.FestivalsDirectoryPage })))
const TravellingDirectoryPage = React.lazy(() => import('./pages/TravellingDirectoryPage').then(module => ({ default: module.TravellingDirectoryPage })))
const CitiesDealsDirectoryPage = React.lazy(() => import('./pages/CitiesDealsDirectoryPage').then(module => ({ default: module.CitiesDealsDirectoryPage })))
const DealsPage = React.lazy(() => import('./pages/DealsPage').then(module => ({ default: module.DealsPage })))
const LootDealsPage = React.lazy(() => import('./pages/LootDealsPage').then(module => ({ default: module.LootDealsPage })))
const CouponsPage = React.lazy(() => import('./pages/CouponsPage').then(module => ({ default: module.CouponsPage })))
const SignUpPage = React.lazy(() => import('./pages/SignUpPage').then(module => ({ default: module.SignUpPage })))
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const TermsPage = React.lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })))
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })))
const MobilePrivacyPolicyPage = React.lazy(() => import('./pages/MobilePrivacyPolicyPage').then(module => ({ default: module.MobilePrivacyPolicyPage })))
const CookiePolicyPage = React.lazy(() => import('./pages/CookiePolicyPage').then(module => ({ default: module.CookiePolicyPage })))
const AdvertisePage = React.lazy(() => import('./pages/AdvertisePage').then(module => ({ default: module.AdvertisePage })))
const MobileAdvertisePage = React.lazy(() => import('./pages/MobileAdvertisePage').then(module => ({ default: module.MobileAdvertisePage })))
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage').then(module => ({ default: module.AboutUsPage })))
const FAQPage = React.lazy(() => import('./pages/FAQPage').then(module => ({ default: module.FAQPage })))
const MobileFAQPage = React.lazy(() => import('./pages/MobileFAQPage').then(module => ({ default: module.MobileFAQPage })))
const HelpPage = React.lazy(() => import('./pages/HelpPage').then(module => ({ default: module.HelpPage })))
const ContactUsPage = React.lazy(() => import('./pages/ContactUsPage').then(module => ({ default: module.ContactUsPage })))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))
const WalletPage = React.lazy(() => import('./pages/WalletPage').then(module => ({ default: module.WalletPage })))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })))
const OrdersPage = React.lazy(() => import('./pages/OrdersPage').then(module => ({ default: module.OrdersPage })))
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage').then(module => ({ default: module.FavoritesPage })))
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage').then(module => ({ default: module.NotificationsPage })))
const ReferPage = React.lazy(() => import('./pages/ReferPage').then(module => ({ default: module.ReferPage })))
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage').then(module => ({ default: module.AdminLoginPage })))
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })))
const ManagerApprovalsPage = React.lazy(() => import('./pages/admin/manager/ManagerApprovalsPage').then(module => ({ default: module.ManagerApprovalsPage })))
const BrandPage = React.lazy(() => import('./pages/BrandPage').then(module => ({ default: module.BrandPage })))
const CreditCardsPage = React.lazy(() => import('./pages/CreditCardsPage').then(module => ({ default: module.CreditCardsPage })))
const ProductDisplayPage = React.lazy(() => import('./pages/ProductDisplayPage').then(module => ({ default: module.ProductDisplayPage })))
const StaffLoginPage = React.lazy(() => import('./pages/admin/StaffLoginPage').then(module => ({ default: module.StaffLoginPage })))

const ExecutiveDashboardPage = React.lazy(() => import('./pages/admin/executive/ExecutiveDashboardPage').then(module => ({ default: module.ExecutiveDashboardPage })))
const ExecutiveBulkUploadPage = React.lazy(() => import('./pages/admin/executive/ExecutiveBulkUploadPage').then(module => ({ default: module.ExecutiveBulkUploadPage })))
const ExecutiveDealsPage = React.lazy(() => import('./pages/admin/executive/ExecutiveDealsPage').then(module => ({ default: module.ExecutiveDealsPage })))
const ExecutiveLootDealsPage = React.lazy(() => import('./pages/admin/executive/ExecutiveLootDealsPage').then(module => ({ default: module.ExecutiveLootDealsPage })))
const ExecutiveStoresPage = React.lazy(() => import('./pages/admin/executive/ExecutiveStoresPage').then(module => ({ default: module.ExecutiveStoresPage })))
const ExecutiveCouponsPage = React.lazy(() => import('./pages/admin/executive/ExecutiveCouponsPage').then(module => ({ default: module.ExecutiveCouponsPage })))
const ExecutiveCreditCardsPage = React.lazy(() => import('./pages/admin/executive/ExecutiveCreditCardsPage').then(module => ({ default: module.ExecutiveCreditCardsPage })))
const ExecutiveCategoriesPage = React.lazy(() => import('./pages/admin/executive/ExecutiveCategoriesPage').then(module => ({ default: module.ExecutiveCategoriesPage })))
const ExecutiveAdvertisementsPage = React.lazy(() => import('./pages/admin/executive/ExecutiveAdvertisementsPage').then(module => ({ default: module.ExecutiveAdvertisementsPage })))
const ExecutiveVerificationPage = React.lazy(() => import('./pages/admin/executive/ExecutiveVerificationPage').then(module => ({ default: module.ExecutiveVerificationPage })))
const ExecutiveTicketsPage = React.lazy(() => import('./pages/admin/executive/ExecutiveTicketsPage').then(module => ({ default: module.ExecutiveTicketsPage })))

const OperationsDashboardPage = React.lazy(() => import('./pages/admin/operations/OperationsDashboardPage').then(module => ({ default: module.OperationsDashboardPage })))
const OperationsApprovalsPage = React.lazy(() => import('./pages/admin/operations/OperationsApprovalsPage').then(module => ({ default: module.OperationsApprovalsPage })))
const OperationsCashbacksPage = React.lazy(() => import('./pages/admin/operations/OperationsCashbacksPage').then(module => ({ default: module.OperationsCashbacksPage })))
const OperationsSupportPage = React.lazy(() => import('./pages/admin/operations/OperationsSupportPage').then(module => ({ default: module.OperationsSupportPage })))
const OperationsStaffActivityPage = React.lazy(() => import('./pages/admin/operations/OperationsStaffActivityPage').then(module => ({ default: module.OperationsStaffActivityPage })))
const OperationsMerchantsPage = React.lazy(() => import('./pages/admin/operations/OperationsMerchantsPage').then(module => ({ default: module.OperationsMerchantsPage })))

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

  // Manager and Staff pages
  if (
    pathname === '/manager/login' ||
    pathname === '/manager/dashboard' ||
    pathname === '/manager' ||
    pathname.startsWith('/manager/') ||
    pathname === '/operational-manager/login' ||
    pathname === '/operational-manager' ||
    pathname.startsWith('/operational-manager/') ||
    pathname.startsWith('/executive/')
  ) {
    if (pathname === '/operational-manager') return '/operational-manager/dashboard'
    if (pathname === '/manager') return '/manager/dashboard'
    return pathname
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

  // Static Pages (/privacy, /cookies, /about, /faq, /contact, /advertise)
  if (pathname === '/privacy' || page === 'privacy' || page === 'privacy-policy') return '/privacy'
  if (
    pathname === '/cookies' ||
    pathname === '/cookie-policy' ||
    pathname === '/cookie' ||
    page === 'cookies' ||
    page === 'cookie-policy' ||
    page === 'cookie'
  ) {
    return '/cookie-policy'
  }
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
    pathname === '/help' ||
    pathname === '/help-faq' ||
    page === 'help' ||
    page === 'help-faq'
  ) {
    return '/help'
  }
  if (
    pathname === '/faq' ||
    pathname === '/questions' ||
    page === 'faq' ||
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

  // Brand pages (/brands/:slug or /amazon or /stores/amazon or /categories/amazon)
  if (
    pathname === '/amazon' ||
    page === 'amazon' ||
    pathname === '/categories/amazon' ||
    pathname === '/stores/amazon' ||
    pathname === '/directory/amazon' ||
    (page === 'stores' && searchParams.get('store') === 'amazon') ||
    (page === 'categories' && searchParams.get('category') === 'amazon')
  ) {
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

  // Product display internal page (/product, /products, /deal/:id, /product-display)
  if (
    pathname === '/product' ||
    pathname.startsWith('/product/') ||
    pathname === '/products' ||
    pathname.startsWith('/products/') ||
    pathname.startsWith('/deal/') ||
    page === 'product' ||
    page === 'product-display' ||
    searchParams.has('product')
  ) {
    return '/product'
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
  const isCookieRoute = currentPath === '/cookies' || currentPath === '/cookie-policy'
  const isAdvertiseRoute = currentPath === '/advertise'
  const isAboutRoute = currentPath === '/about'
  const isHelpRoute = currentPath === '/help' || currentPath === '/help-faq'
  const isFaqRoute = currentPath === '/faq'
  const isContactRoute = currentPath === '/contact'
  const isCouponsRoute = currentPath === '/coupons' || currentPath.startsWith('/coupons/')
  const isCreditCardsRoute = currentPath === '/credit-cards' || currentPath.startsWith('/credit-cards/')
  const isLootDealsRoute = currentPath === '/loot-deals' || currentPath.startsWith('/loot-deals/')
  const isStoresRoute = currentPath === '/stores' || currentPath.startsWith('/stores/')
  const isDealsRoute = currentPath === '/deals' || currentPath.startsWith('/deals/')
  const isCategoriesRoute = currentPath === '/categories' || currentPath.startsWith('/categories/')
  const isProductRoute = currentPath === '/product' || currentPath.startsWith('/product') || currentPath.startsWith('/deal/')
  const isWalletRoute = currentPath === '/wallet'
  const isProfileRoute = currentPath === '/profile'
  const isOrdersRoute = currentPath === '/orders'
  const isCartRoute = currentPath === '/cart'
  const isFavoritesRoute = currentPath === '/favorites' || currentPath === '/wishlist'
  const isNotificationsRoute = currentPath === '/notifications'
  const isReferRoute = currentPath === '/refer'
  const isAdminLoginRoute = currentPath === '/manager/login'
  const isAdminDashboardRoute = 
    currentPath === '/manager/dashboard' || 
    currentPath === '/manager' ||
    currentPath.startsWith('/manager/')
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
      if (isCookieRoute) {
        return <CookiePolicyPage />
      }
      if (isAdvertiseRoute) {
        return <MobileAdvertisePage />
      }
      if (isAboutRoute) {
        return <AboutUsPage />
      }
      if (isHelpRoute) {
        return <HelpPage />
      }
      if (isFaqRoute) {
        return <MobileFAQPage />
      }
      if (isContactRoute) {
        return <MobileContactUsPage />
      }
      if (isProductRoute) {
        return <MobileProductPage />
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
      if (isWalletRoute) return <MobileWalletPage />
      if (isProfileRoute) return <ProfilePage />
      if (isOrdersRoute) return <OrdersPage />
      if (isCartRoute) return <MobileWishlistPage />
      if (isFavoritesRoute) return <MobileWishlistPage />
      if (isNotificationsRoute) return <MobileNotificationsPage />
      if (isReferRoute) return <MobileReferPage />
      if (isAdminLoginRoute) {
        return <AdminLoginPage />
      }
      if (isAdminDashboardRoute) {
        if (currentPath === '/manager/approvals') return <ManagerApprovalsPage />
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
        if (currentPath === '/executive/bulk-upload') return <ExecutiveBulkUploadPage />
        if (currentPath === '/executive/deals') return <ExecutiveDealsPage />
        if (currentPath === '/executive/loot-deals') return <ExecutiveLootDealsPage />
        if (currentPath === '/executive/stores') return <ExecutiveStoresPage />
        if (currentPath === '/executive/coupons') return <ExecutiveCouponsPage />
        if (currentPath === '/executive/credit-cards') return <ExecutiveCreditCardsPage />
        if (currentPath === '/executive/categories') return <ExecutiveCategoriesPage />
        if (currentPath === '/executive/advertisements') return <ExecutiveAdvertisementsPage />
        if (currentPath === '/executive/verification') return <ExecutiveVerificationPage />
        if (currentPath === '/executive/tickets') return <ExecutiveTicketsPage />
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
    if (isCookieRoute) {
      return <CookiePolicyPage />
    }
    if (isAdvertiseRoute) {
      return <AdvertisePage />
    }
    if (isAboutRoute) {
      return <AboutUsPage />
    }
    if (isHelpRoute) {
      return <HelpPage />
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

    if (isProductRoute) {
      return <ProductDisplayPage />
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
      if (currentPath === '/executive/bulk-upload') return <ExecutiveBulkUploadPage />
      if (currentPath === '/executive/deals') return <ExecutiveDealsPage />
      if (currentPath === '/executive/loot-deals') return <ExecutiveLootDealsPage />
      if (currentPath === '/executive/stores') return <ExecutiveStoresPage />
      if (currentPath === '/executive/coupons') return <ExecutiveCouponsPage />
      if (currentPath === '/executive/credit-cards') return <ExecutiveCreditCardsPage />
      if (currentPath === '/executive/categories') return <ExecutiveCategoriesPage />
      if (currentPath === '/executive/advertisements') return <ExecutiveAdvertisementsPage />
      if (currentPath === '/executive/verification') return <ExecutiveVerificationPage />
      if (currentPath === '/executive/tickets') return <ExecutiveTicketsPage />
      return <ExecutiveDashboardPage />
    }

    if (isAdminDashboardRoute) {
      if (currentPath === '/manager/approvals') return <ManagerApprovalsPage />
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
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9FA' }}><div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div></div>}>
          {renderContent()}
        </Suspense>
      </div>
    </GoogleOAuthProvider>
  )
}
