import iciciBankMarkImg from '../assets/credit-cards/icici-bank-mark.png'
import iciciPlatinumCardImg from '../assets/credit-cards/icici-platinum-card.png'

export interface MobileCreditCardItem {
  id: string
  bank: string
  bankMark: string
  cardImage: string
  description: string
  href: string
  alt: string
}

export const MOBILE_FEATURED_CREDIT_CARDS: MobileCreditCardItem[] = [
  {
    id: 'mobile-icici-platinum',
    bank: 'ICICI BANK',
    bankMark: iciciBankMarkImg,
    cardImage: iciciPlatinumCardImg,
    description:
      '5% Cashback on Amazon. Earn Reward Points.\nPartners: Amazon • Flipkart • Swiggy.',
    href: '/credit-cards/icici-platinum',
    alt: 'ICICI Platinum Credit Card',
  },
]
