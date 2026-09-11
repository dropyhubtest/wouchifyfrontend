import contactUsImg from '../assets/help/contactus.png'
import feedbackImg from '../assets/help/feedback.png'
import faqImg from '../assets/help/faq.png'
import cashbackImg from '../assets/help/cashback.png'
import trackCashbackImg from '../assets/help/track_cashback.png'

export interface HelpCardItem {
  id: string
  title: string
  image: string
  bg: string
  border: string
  href: string
}

export const HELP_ROW_1_CARDS: HelpCardItem[] = [
  {
    id: 'contact-us',
    title: 'Contact Us',
    image: contactUsImg,
    bg: '#EBF3FF',
    border: '#D0E2FF',
    href: '/contact',
  },
  {
    id: 'give-feedback',
    title: 'Give us Feedback',
    image: feedbackImg,
    bg: '#FCEEE3',
    border: '#F5D7C2',
    href: '/contact',
  },
  {
    id: 'faq',
    title: 'Frequently asked Questions',
    image: faqImg,
    bg: '#EFFBD7',
    border: '#DDF2B5',
    href: '/faq',
  },
]

export const HELP_ROW_2_CARDS: HelpCardItem[] = [
  {
    id: 'about-cashback',
    title: 'About Cashback',
    image: cashbackImg,
    bg: '#FCF8D5',
    border: '#F6EDB0',
    href: '/faq',
  },
  {
    id: 'track-cashback',
    title: 'Track your Cashback',
    image: trackCashbackImg,
    bg: '#FCE7F3',
    border: '#F9CCE4',
    href: '/wallet',
  },
]
