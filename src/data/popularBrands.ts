import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import ajioLogo from '../assets/brand-logos/ajio-logo.png'
import firstcryLogo from '../assets/brand-logos/firstcry-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import myntraLogo from '../assets/brand-logos/myntra-logo.png'
import quikrjobsLogo from '../assets/brand-logos/quikrjobs-logo.png'
import relianceDigitalLogo from '../assets/brand-logos/reliance-digital-logo.png'
import snapdealLogo from '../assets/brand-logos/snapdeal-logo.png'
import nykaaLogo from '../assets/brand-logos/nykaa-logo.png'
import swiggyLogo from '../assets/brand-logos/swiggy-logo.png'
import bigbasketLogo from '../assets/brand-logos/bigbasket-logo.png'
import zomatoLogo from '../assets/brand-logos/zomato-logo.png'
import meeshoLogo from '../assets/brand-logos/meesho-logo.png'
import zeptoLogo from '../assets/brand-logos/zepto-logo.png'
import jiomartLogo from '../assets/brand-logos/jiomart-logo.png'
import pepperfryLogo from '../assets/brand-logos/pepperfry-logo.png'
import zivameLogo from '../assets/brand-logos/zivame-logo.png'

export interface LogoFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface BrandRewardItem {
  id: string
  name: string
  slug: string
  href: string
  logoSrc: string
  discount: number
  rewardValue: string
  rewardLabel: 'REWARDS' | 'CASHBACK'
  percentageX?: number
  rewardLabelX?: number
  logoFrame?: LogoFrame
  logoBgColor?: string
}

/**
 * 24 Popular Brand Cards arranged for a 2-row x 12-column grid layout (grid-auto-flow: column).
 *
 * Column 1: Row 1 = Amazon, Row 2 = Myntra
 * Column 2: Row 1 = AJIO, Row 2 = QuikrJobs
 * Column 3: Row 1 = FirstCry, Row 2 = Reliance Digital
 * Column 4: Row 1 = Flipkart, Row 2 = Snapdeal
 * Columns 5-12: Remaining brand carousel cards
 */
export const POPULAR_BRANDS_CAROUSEL: BrandRewardItem[] = [
  // Column 1
  {
    id: 'amazon-1',
    name: 'Amazon',
    slug: 'amazon',
    href: '/brands/amazon',
    logoSrc: amazonLogo,
    discount: 80,
    rewardValue: '10%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 32,
      y: 107,
      width: 333,
      height: 147,
    },
  },
  {
    id: 'myntra-1',
    name: 'Myntra',
    slug: 'myntra',
    href: '/brands/myntra',
    logoSrc: myntraLogo,
    discount: 50,
    rewardValue: '12%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 46,
      y: 97.5,
      width: 282,
      height: 159,
    },
  },

  // Column 2
  {
    id: 'ajio-1',
    name: 'AJIO',
    slug: 'ajio',
    href: '/brands/ajio',
    logoSrc: ajioLogo,
    discount: 30,
    rewardValue: '5%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 72,
      y: 102,
      width: 256,
      height: 144,
    },
  },
  {
    id: 'quikrjobs-1',
    name: 'QuikrJobs',
    slug: 'quikrjobs',
    href: '/brands/quikrjobs',
    logoSrc: quikrjobsLogo,
    discount: 30,
    rewardValue: '8%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 47,
      y: 142,
      width: 306,
      height: 77,
    },
  },

  // Column 3
  {
    id: 'firstcry-1',
    name: 'FirstCry',
    slug: 'firstcry',
    href: '/brands/firstcry',
    logoSrc: firstcryLogo,
    discount: 20,
    rewardValue: '15%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 62,
      y: 131,
      width: 273,
      height: 99,
    },
  },
  {
    id: 'reliance-digital-1',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    href: '/brands/reliance-digital',
    logoSrc: relianceDigitalLogo,
    discount: 20,
    rewardValue: '15%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 34,
      y: 126,
      width: 330,
      height: 93,
    },
  },

  // Column 4
  {
    id: 'flipkart-1',
    name: 'Flipkart',
    slug: 'flipkart',
    href: '/brands/flipkart',
    logoSrc: flipkartLogo,
    discount: 25,
    rewardValue: '6.2%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 237,
    logoFrame: {
      x: 64,
      y: 97,
      width: 287,
      height: 162,
    },
  },
  {
    id: 'snapdeal-1',
    name: 'Snapdeal',
    slug: 'snapdeal',
    href: '/brands/snapdeal',
    logoSrc: snapdealLogo,
    discount: 25,
    rewardValue: '6.2%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 237,
    logoFrame: {
      x: 37.5,
      y: 137,
      width: 325,
      height: 82,
    },
  },

  // Column 5
  {
    id: 'nykaa-1',
    name: 'Nykaa',
    slug: 'nykaa',
    href: '/brands/nykaa',
    logoSrc: nykaaLogo,
    discount: 40,
    rewardValue: '8%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 70,
      y: 100,
      width: 256,
      height: 145,
    },
  },
  {
    id: 'swiggy-1',
    name: 'Swiggy',
    slug: 'swiggy',
    href: '/brands/swiggy',
    logoSrc: swiggyLogo,
    discount: 60,
    rewardValue: '12%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 35,
      y: 120,
      width: 325,
      height: 105,
    },
  },

  // Column 6
  {
    id: 'bigbasket-1',
    name: 'BigBasket',
    slug: 'bigbasket',
    href: '/brands/bigbasket',
    logoSrc: bigbasketLogo,
    discount: 25,
    rewardValue: '5%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 48,
      y: 100,
      width: 300,
      height: 145,
    },
  },
  {
    id: 'zomato-1',
    name: 'Zomato',
    slug: 'zomato',
    href: '/brands/zomato',
    logoSrc: zomatoLogo,
    discount: 50,
    rewardValue: '10%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 55,
      y: 105,
      width: 288,
      height: 135,
    },
  },

  // Column 7
  {
    id: 'meesho-1',
    name: 'Meesho',
    slug: 'meesho',
    href: '/brands/meesho',
    logoSrc: meeshoLogo,
    discount: 70,
    rewardValue: '15%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoBgColor: '#51004C',
    logoFrame: {
      x: 55,
      y: 105,
      width: 288,
      height: 135,
    },
  },
  {
    id: 'zepto-1',
    name: 'Zepto',
    slug: 'zepto',
    href: '/brands/zepto',
    logoSrc: zeptoLogo,
    discount: 35,
    rewardValue: '8%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 65,
      y: 125,
      width: 269,
      height: 90,
    },
  },

  // Column 8
  {
    id: 'jiomart-1',
    name: 'JioMart',
    slug: 'jiomart',
    href: '/brands/jiomart',
    logoSrc: jiomartLogo,
    discount: 30,
    rewardValue: '7%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 48,
      y: 100,
      width: 300,
      height: 145,
    },
  },
  {
    id: 'pepperfry-1',
    name: 'Pepperfry',
    slug: 'pepperfry',
    href: '/brands/pepperfry',
    logoSrc: pepperfryLogo,
    discount: 45,
    rewardValue: '10%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 45,
      y: 140,
      width: 308,
      height: 66,
    },
  },

  // Column 9
  {
    id: 'zivame-1',
    name: 'Zivame',
    slug: 'zivame',
    href: '/brands/zivame',
    logoSrc: zivameLogo,
    discount: 55,
    rewardValue: '12%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 39,
      y: 120,
      width: 320,
      height: 107,
    },
  },
  {
    id: 'amazon-2',
    name: 'Amazon',
    slug: 'amazon',
    href: '/brands/amazon',
    logoSrc: amazonLogo,
    discount: 80,
    rewardValue: '10%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 32,
      y: 107,
      width: 333,
      height: 147,
    },
  },

  // Column 10
  {
    id: 'ajio-2',
    name: 'AJIO',
    slug: 'ajio',
    href: '/brands/ajio',
    logoSrc: ajioLogo,
    discount: 30,
    rewardValue: '5%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 72,
      y: 102,
      width: 256,
      height: 144,
    },
  },
  {
    id: 'myntra-2',
    name: 'Myntra',
    slug: 'myntra',
    href: '/brands/myntra',
    logoSrc: myntraLogo,
    discount: 50,
    rewardValue: '12%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 46,
      y: 97.5,
      width: 282,
      height: 159,
    },
  },

  // Column 11
  {
    id: 'flipkart-2',
    name: 'Flipkart',
    slug: 'flipkart',
    href: '/brands/flipkart',
    logoSrc: flipkartLogo,
    discount: 25,
    rewardValue: '6.2%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 237,
    logoFrame: {
      x: 64,
      y: 97,
      width: 287,
      height: 162,
    },
  },
  {
    id: 'quikrjobs-2',
    name: 'QuikrJobs',
    slug: 'quikrjobs',
    href: '/brands/quikrjobs',
    logoSrc: quikrjobsLogo,
    discount: 30,
    rewardValue: '8%',
    rewardLabel: 'CASHBACK',
    percentageX: 138,
    rewardLabelX: 206,
    logoFrame: {
      x: 47,
      y: 142,
      width: 306,
      height: 77,
    },
  },

  // Column 12
  {
    id: 'reliance-digital-2',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    href: '/brands/reliance-digital',
    logoSrc: relianceDigitalLogo,
    discount: 20,
    rewardValue: '15%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 227,
    logoFrame: {
      x: 34,
      y: 126,
      width: 330,
      height: 93,
    },
  },
  {
    id: 'snapdeal-2',
    name: 'Snapdeal',
    slug: 'snapdeal',
    href: '/brands/snapdeal',
    logoSrc: snapdealLogo,
    discount: 25,
    rewardValue: '6.2%',
    rewardLabel: 'REWARDS',
    percentageX: 138,
    rewardLabelX: 237,
    logoFrame: {
      x: 37.5,
      y: 137,
      width: 325,
      height: 82,
    },
  },
]
