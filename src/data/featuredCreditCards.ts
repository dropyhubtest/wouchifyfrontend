import iciciBankMark from '../assets/credit-cards/icici-bank-mark.png'
import iciciPlatinumCard from '../assets/credit-cards/icici-platinum-card.png'

export interface FeaturedCreditCard {
  id: string
  bank: string
  bankMark: string
  cardImage: string
  heading: string
  description: string
  href: string
}

export const FEATURED_CREDIT_CARDS: FeaturedCreditCard[] = [
  {
    id: 'icici-platinum',
    bank: 'ICICI BANK',
    bankMark: iciciBankMark,
    cardImage: iciciPlatinumCard,
    heading: 'ICICI BANK',
    description:
      '5% Cashback on Amazon. Earn Reward Points. Partners: Amazon • Flipkart • Swiggy.',
    href: '/credit-cards/icici-platinum',
  },
  {
    id: 'hdfc-regalia',
    bank: 'HDFC BANK',
    bankMark: iciciBankMark, // Placeholder
    cardImage: iciciPlatinumCard, // Placeholder
    heading: 'HDFC BANK',
    description:
      'Complimentary Airport Lounge Access. Earn 4 Reward Points on Rs. 150 spent.',
    href: '/credit-cards/hdfc-regalia',
  },
  {
    id: 'sbi-simplyclick',
    bank: 'SBI CARD',
    bankMark: iciciBankMark, // Placeholder
    cardImage: iciciPlatinumCard, // Placeholder
    heading: 'SBI CARD',
    description:
      '10X Reward Points on exclusive partners. Amazon gift card on joining.',
    href: '/credit-cards/sbi-simplyclick',
  },
  {
    id: 'axis-ace',
    bank: 'AXIS BANK',
    bankMark: iciciBankMark, // Placeholder
    cardImage: iciciPlatinumCard, // Placeholder
    heading: 'AXIS BANK',
    description:
      'Flat 2% Cashback on all spends. Unlimited cashback on utility bills via GPay.',
    href: '/credit-cards/axis-ace',
  },
  {
    id: 'kotak-zen',
    bank: 'KOTAK MAHINDRA',
    bankMark: iciciBankMark, // Placeholder
    cardImage: iciciPlatinumCard, // Placeholder
    heading: 'KOTAK MAHINDRA',
    description:
      'Get Zen Points on every spend. 100% waiver on fuel surcharge.',
    href: '/credit-cards/kotak-zen',
  },
]
