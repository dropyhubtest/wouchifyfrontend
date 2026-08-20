import telegramIcon from '../assets/footer/telegram.png'
import instagramIcon from '../assets/footer/instagram.png'
import whatsappIcon from '../assets/footer/whatsapp.png'
import mailIcon from '../assets/footer/mail.svg'
import locationIcon from '../assets/footer/location.svg'

export interface FooterLink {
  label: string
  href: string
}

export interface SocialLink {
  id: string
  name: string
  icon: string
  href: string
}

export interface ContactDetail {
  id: string
  type: 'email' | 'location'
  text: string
  icon: string
  href?: string
}

export const EXPLORE_LINKS: FooterLink[] = [
  { label: 'All Deals', href: '/deals' },
  { label: 'Loot Deals', href: '/deals?type=loot' },
  { label: 'Coupon Codes', href: '/coupons' },
  { label: 'Top Stores', href: '/stores' },
  { label: 'Credit Card', href: '/credit-cards' },
  { label: 'Help & FAQ', href: '/help' },
]

export const COMPANY_LINKS: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Advertise With Us', href: '/advertise' },
  { label: 'Customer Feedback', href: '/feedback' },
]

export const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: telegramIcon,
    href: 'https://t.me/wouchify',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: instagramIcon,
    href: 'https://instagram.com/wouchify',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: whatsappIcon,
    href: 'https://whatsapp.com/channel/wouchify',
  },
]

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    id: 'email',
    type: 'email',
    text: 'hello@wouchify.com',
    icon: mailIcon,
    href: 'mailto:hello@wouchify.com',
  },
  {
    id: 'location',
    type: 'location',
    text: 'India',
    icon: locationIcon,
  },
]

export const BOTTOM_LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Contact', href: '/contact' },
]
