import wouchifyMobileLogo from '../assets/mobile/wouchify-mobile-cropped-v2.png'
import mailIcon from '../assets/footer/mail.svg'
import locationIcon from '../assets/footer/location.svg'
import telegramIcon from '../assets/footer/telegram.png'
import whatsappIcon from '../assets/footer/whatsapp.png'
import instagramIcon from '../assets/footer/instagram.png'

export interface FooterLinkItem {
  label: string
  href: string
}

export interface FooterAccordionSection {
  id: string
  title: string
  links: FooterLinkItem[]
}

export interface SocialLinkItem {
  id: string
  platform: string
  href: string
  icon: string
  ariaLabel: string
}

export const MOBILE_FOOTER_LOGO = {
  src: wouchifyMobileLogo,
  alt: 'Wouchify Logo',
  description:
    "India's #1 free deal discovery platform. Verified coupons, loot deals, and rewards – all in one place, zero cost.",
}

export const MOBILE_FOOTER_ACCORDIONS: FooterAccordionSection[] = [
  {
    id: 'explore',
    title: 'Explore',
    links: [
      { label: 'All Deals', href: '/deals' },
      { label: 'Loot Deals', href: '/loot-deals' },
      { label: 'Coupon Codes', href: '/coupons' },
      { label: 'Top Stores', href: '/stores' },
      { label: 'Credit Card', href: '/credit-cards' },
      { label: 'Help & FAQ', href: '/help-faq' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Advertise With Us', href: '/advertise' },
      { label: 'Customer Feedback', href: '/feedback' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
]

export const MOBILE_FOOTER_CONTACT = {
  email: 'hello@wouchify.com',
  emailIcon: mailIcon,
  location: 'India',
  locationIcon: locationIcon,
}

export const MOBILE_FOOTER_SOCIALS: SocialLinkItem[] = [
  {
    id: 'telegram',
    platform: 'Telegram',
    href: 'https://t.me/wouchify',
    icon: telegramIcon,
    ariaLabel: 'Follow Wouchify on Telegram',
  },
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    href: 'https://whatsapp.com/channel/wouchify',
    icon: whatsappIcon,
    ariaLabel: 'Join Wouchify on WhatsApp',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    href: 'https://instagram.com/wouchify',
    icon: instagramIcon,
    ariaLabel: 'Follow Wouchify on Instagram',
  },
]

export const MOBILE_BOTTOM_LEGAL_LINKS: FooterLinkItem[] = [
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Cookie policy', href: '/cookie-policy' },
  { label: 'Terms of use', href: '/terms-of-use' },
  { label: 'Contact', href: '/contact' },
]
