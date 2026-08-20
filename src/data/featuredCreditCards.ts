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
]
