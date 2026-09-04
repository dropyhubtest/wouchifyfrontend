import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import ajioLogo from '../assets/brand-logos/ajio-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import pepperfryLogo from '../assets/brand-logos/pepperfry-logo.png'
import bigbasketLogo from '../assets/brand-logos/bigbasket-logo.png'
import firstcryLogo from '../assets/brand-logos/firstcry-logo.png'
import snapdealLogo from '../assets/brand-logos/snapdeal-logo.png'
import jiomartLogo from '../assets/brand-logos/jiomart-logo.png'
import zivameLogo from '../assets/brand-logos/zivame-logo.png'
import nykaaLogo from '../assets/brand-logos/nykaa-logo.png'
import myntraLogo from '../assets/brand-logos/myntra-logo.png'
import swiggyLogo from '../assets/brand-logos/swiggy-logo.png'
import zomatoLogo from '../assets/brand-logos/zomato-logo.png'
import zeptoLogo from '../assets/brand-logos/zepto-logo.png'
import relianceDigitalLogo from '../assets/brand-logos/reliance-digital-logo.png'
import quikrjobsLogo from '../assets/brand-logos/quikrjobs-logo.png'
import meeshoLogo from '../assets/brand-logos/meesho-logo.png'

export interface MobileBrandItem {
  id: string
  name: string
  slug: string
  logoSrc: string
  discount: number
  mobileLogoScale?: number
  cardBgColor?: string
}

export const MOBILE_POPULAR_BRANDS_ROW_1: MobileBrandItem[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    slug: 'amazon',
    logoSrc: amazonLogo,
    discount: 80,
    mobileLogoScale: 1.05,
  },
  {
    id: 'ajio',
    name: 'AJIO',
    slug: 'ajio',
    logoSrc: ajioLogo,
    discount: 30,
    mobileLogoScale: 1.12,
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    logoSrc: flipkartLogo,
    discount: 15,
    mobileLogoScale: 1.18,
  },
  {
    id: 'pepperfry',
    name: 'Pepperfry',
    slug: 'pepperfry',
    logoSrc: pepperfryLogo,
    discount: 20,
    mobileLogoScale: 1.14,
  },
  {
    id: 'bigbasket',
    name: 'BigBasket',
    slug: 'bigbasket',
    logoSrc: bigbasketLogo,
    discount: 25,
    mobileLogoScale: 1.0,
  },
  {
    id: 'firstcry',
    name: 'FirstCry',
    slug: 'firstcry',
    logoSrc: firstcryLogo,
    discount: 20,
    mobileLogoScale: 1.15,
  },
  {
    id: 'snapdeal',
    name: 'Snapdeal',
    slug: 'snapdeal',
    logoSrc: snapdealLogo,
    discount: 25,
    mobileLogoScale: 1.16,
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    slug: 'jiomart',
    logoSrc: jiomartLogo,
    discount: 30,
    mobileLogoScale: 0.95,
  },
  {
    id: 'zivame',
    name: 'Zivame',
    slug: 'zivame',
    logoSrc: zivameLogo,
    discount: 55,
    mobileLogoScale: 1.15,
  },
]

export const MOBILE_POPULAR_BRANDS_ROW_2: MobileBrandItem[] = [
  {
    id: 'nykaa',
    name: 'Nykaa',
    slug: 'nykaa',
    logoSrc: nykaaLogo,
    discount: 10,
    mobileLogoScale: 1.0,
  },
  {
    id: 'myntra',
    name: 'Myntra',
    slug: 'myntra',
    logoSrc: myntraLogo,
    discount: 20,
    mobileLogoScale: 1.15,
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logoSrc: swiggyLogo,
    discount: 10,
    mobileLogoScale: 1.17,
  },
  {
    id: 'zomato',
    name: 'Zomato',
    slug: 'zomato',
    logoSrc: zomatoLogo,
    discount: 25,
    mobileLogoScale: 1.18,
  },
  {
    id: 'zepto',
    name: 'Zepto',
    slug: 'zepto',
    logoSrc: zeptoLogo,
    discount: 25,
    mobileLogoScale: 1.16,
  },
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    logoSrc: relianceDigitalLogo,
    discount: 20,
    mobileLogoScale: 1.14,
  },
  {
    id: 'quikrjobs',
    name: 'QuikrJobs',
    slug: 'quikrjobs',
    logoSrc: quikrjobsLogo,
    discount: 30,
    mobileLogoScale: 1.15,
  },
  {
    id: 'meesho',
    name: 'Meesho',
    slug: 'meesho',
    logoSrc: meeshoLogo,
    discount: 70,
    mobileLogoScale: 1.18,
    cardBgColor: '#51004C',
  },
]
