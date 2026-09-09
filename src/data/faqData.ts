export interface FAQItem {
  id: string
  question: string
  answer: string
  theme: 'red' | 'navy'
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'q1',
    question: 'How Wouchify works?',
    answer:
      'Find deals on Wouchify, shop through our partner stores, and earn cashback on eligible purchases. Once your cashback is confirmed, you can withdraw your rewards.',
    theme: 'red'
  },
  {
    id: 'q2',
    question: 'Your Cashback or Rewards',
    answer:
      "Earn cashback or rewards on eligible purchases made through Wouchify's partner stores.",
    theme: 'navy'
  },
  {
    id: 'q3',
    question: 'Payment Related Issues',
    answer:
      'For payment or withdrawal issues, contact Wouchify support with your transaction details for assistance.',
    theme: 'red'
  },
  {
    id: 'q4',
    question: 'Other Quires',
    answer:
      "For any other questions or concerns, reach out to Wouchify's support team for help.",
    theme: 'navy'
  }
]
