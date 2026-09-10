import indusindLogo from '../assets/creditcardpage/indusind_bank.png'
import iciciLogo from '../assets/creditcardpage/ICICI_bank.png'
import idfcLogo from '../assets/creditcardpage/IDFC_back.png'
import tataNeuLogo from '../assets/creditcardpage/Tata_neu.svg'
import axisLogo from '../assets/creditcardpage/Axis_Bank.png'
import bajajLogo from '../assets/creditcardpage/Bajaj-Finsery.png'

export interface CreditCardItem {
  id: string
  name: string
  logo: string
  section: 'premium' | 'lifetime-free'
  cardTheme: 'white-blue' | 'white-red' | 'red-card' | 'navy-card'
  tagText: string
  keyBenefitLabel: string
  keyBenefitValue: string
  rewardsLabel: string
  rewardsValue: string
  suitedFor: string[]
  userCount: string
  applyHref: string
}

export const CREDIT_CARDS: CreditCardItem[] = [
  // ── 1. Premium Shopping Cards ──
  {
    id: 'indusind-bank',
    name: 'IndusInd Bank Credit Card',
    logo: indusindLogo,
    section: 'premium',
    cardTheme: 'white-blue',
    tagText: 'IndusInd Bank',
    keyBenefitLabel: 'TOP BENIFIT',
    keyBenefitValue: 'Upto 5% Cashback',
    rewardsLabel: 'REWARDS',
    rewardsValue: 'Exclusive Rewards',
    suitedFor: ['Shopping', 'Travel', 'Dining'],
    userCount: '+2.4k',
    applyHref: '#',
  },
  {
    id: 'icici-bank',
    name: 'ICICI Credit Card',
    logo: iciciLogo,
    section: 'premium',
    cardTheme: 'white-red',
    tagText: 'ICICI Bank',
    keyBenefitLabel: 'TOP BENIFIT',
    keyBenefitValue: 'Upto 5% Cashback',
    rewardsLabel: 'REWARDS',
    rewardsValue: 'Earn Reward Points',
    suitedFor: ['Amazon', 'Flipkart', 'Swiggy'],
    userCount: '+2.4k',
    applyHref: '#',
  },
  {
    id: 'idfc-bank',
    name: 'IDFC Credit Card',
    logo: idfcLogo,
    section: 'premium',
    cardTheme: 'white-red',
    tagText: 'IDFC First Bank',
    keyBenefitLabel: 'TOP BENIFIT',
    keyBenefitValue: 'Never Expiring Rewards',
    rewardsLabel: 'REWARDS',
    rewardsValue: 'Lifetime Free',
    suitedFor: ['All Round Spends'],
    userCount: '+2.4k',
    applyHref: '#',
  },

  // ── 2. Unlimited Lifetime Free ──
  {
    id: 'tata-neu-1',
    name: 'Tata Neu Card',
    logo: tataNeuLogo,
    section: 'lifetime-free',
    cardTheme: 'red-card',
    tagText: 'TataNeu',
    keyBenefitLabel: 'TOP BENIFIT',
    keyBenefitValue: 'Up to 10% NeuCoins',
    rewardsLabel: 'REWARDS',
    rewardsValue: 'Lifetime Free Offers',
    suitedFor: ['Shopping', 'Travel', 'Dining'],
    userCount: '+2.4k',
    applyHref: '#',
  },
  {
    id: 'axis-bank',
    name: 'Axis Credit Card',
    logo: axisLogo,
    section: 'lifetime-free',
    cardTheme: 'navy-card',
    tagText: 'Axis Bank',
    keyBenefitLabel: 'TOP BENIFIT',
    keyBenefitValue: 'Up to 7.5% Cashback',
    rewardsLabel: 'REWARDS',
    rewardsValue: 'Flat ₹1,400 Rewards',
    suitedFor: ['Amazon', 'Flipkart', 'Swiggy'],
    userCount: '+2.4k',
    applyHref: '#',
  },
  {
    id: 'tata-neu-2',
    name: 'Tata Neu Card',
    logo: bajajLogo,
    section: 'lifetime-free',
    cardTheme: 'navy-card',
    tagText: 'TataNeu',
    keyBenefitLabel: 'TOP BENIFIT',
    keyBenefitValue: 'Up to 10% NeuCoins',
    rewardsLabel: 'REWARDS',
    rewardsValue: 'Lifetime Free Offers',
    suitedFor: ['Shopping', 'Travel', 'Dining'],
    userCount: '+2.4k',
    applyHref: '#',
  },
]

export const PREMIUM_CARDS = CREDIT_CARDS.filter((c) => c.section === 'premium')
export const LIFETIME_FREE_CARDS = CREDIT_CARDS.filter((c) => c.section === 'lifetime-free')
