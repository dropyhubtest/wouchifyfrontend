export interface TrustStatistic {
  id: string
  value: string
  label: string
  valueLeft: number
  valueTop: number
  labelLeft: number
  labelTop: number
}

export const TRUST_STATISTICS: TrustStatistic[] = [
  {
    id: 'users',
    value: '50k+',
    label: 'Trusted Users',
    valueLeft: 244,
    valueTop: 796,
    labelLeft: 272,
    labelTop: 901,
  },
  {
    id: 'deals',
    value: '5k+',
    label: 'Active Deals',
    valueLeft: 695,
    valueTop: 796,
    labelLeft: 701,
    labelTop: 901,
  },
  {
    id: 'charges',
    value: '0',
    label: 'Hidden Charges',
    valueLeft: 1094,
    valueTop: 796,
    labelLeft: 1041,
    labelTop: 901,
  },
  {
    id: 'verified',
    value: '100%',
    label: 'Verified Deals',
    valueLeft: 1444,
    valueTop: 796,
    labelLeft: 1476,
    labelTop: 901,
  },
]
