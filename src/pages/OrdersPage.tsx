import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { OrdersHero } from '../components/orders/OrdersHero'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'

import appleLogo from '../assets/my_orders/apple.png'
import boatLogo from '../assets/my_orders/boat.png'
import iphoneImg from '../assets/my_orders/iphone.png'
import twsImg from '../assets/my_orders/tws.png'

import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import myntraLogo from '../assets/brand-logos/myntra-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import ajioLogo from '../assets/brand-logos/ajio-logo.png'
import nykaaLogo from '../assets/brand-logos/nykaa-logo.png'

import './OrdersPage.css'

export type OrderFilterType = 'ALL' | 'DELIVERED' | 'PROCESSING' | 'SHIPPING' | 'CANCELLED'

export interface OrderStepperStep {
  label: string
  isDone: boolean
  isCurrent?: boolean
  isPendingRed?: boolean
  isCancelled?: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  store: string
  storeLogo: string
  brandLogo?: string
  productTitle: string
  variant?: string
  specs: string
  productImage: string
  theme: 'blue' | 'peach'
  cashbackStatusText: string
  cashbackAmountText: string
  cashbackType: 'confirmed' | 'pending' | 'cancelled'
  orderStatus: 'DELIVERED' | 'PROCESSING' | 'SHIPPING' | 'CANCELLED'
  orderDate: string
  deliveryDate?: string
  trackingId?: string
  steps: OrderStepperStep[]
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    orderId: '1211345145',
    store: 'Amazon',
    storeLogo: amazonLogo,
    brandLogo: appleLogo,
    productTitle: 'iPhone 15',
    variant: '128GB | Black',
    specs: 'A16 Bionic Chip  |  6.1" Super Retina XDR  |  48MP Camera  |  iOS 17',
    productImage: iphoneImg,
    theme: 'blue',
    cashbackStatusText: 'Cashback Confirmed',
    cashbackAmountText: '+₹800',
    cashbackType: 'confirmed',
    orderStatus: 'DELIVERED',
    orderDate: '2023-10-12',
    deliveryDate: '2023-10-15',
    trackingId: 'AMZIN4829301K',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Received', isDone: true },
    ],
  },
  {
    id: 'ord-2',
    orderId: '1217375145',
    store: 'Amazon',
    storeLogo: amazonLogo,
    brandLogo: boatLogo,
    productTitle: 'boAt Airdopes 141 v2 Wireless Earbuds',
    specs: '42H Playtime  |  IPX4 Water Resistant  |  ENx™ Technology  |  iOS 17',
    productImage: twsImg,
    theme: 'peach',
    cashbackStatusText: 'Cashback Pending',
    cashbackAmountText: '₹100',
    cashbackType: 'pending',
    orderStatus: 'PROCESSING',
    orderDate: '2023-10-10',
    trackingId: 'AMZIN9918234B',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Pending', isDone: false, isPendingRed: true },
    ],
  },
  {
    id: 'ord-3',
    orderId: '1211345145',
    store: 'Myntra',
    storeLogo: myntraLogo,
    brandLogo: appleLogo,
    productTitle: 'iPhone 15',
    variant: '128GB | Black',
    specs: 'A16 Bionic Chip  |  6.1" Super Retina XDR  |  48MP Camera  |  iOS 17',
    productImage: iphoneImg,
    theme: 'blue',
    cashbackStatusText: 'Cashback Confirmed',
    cashbackAmountText: '+₹800',
    cashbackType: 'confirmed',
    orderStatus: 'DELIVERED',
    orderDate: '2023-09-28',
    deliveryDate: '2023-10-02',
    trackingId: 'MYNTRA771239X',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Received', isDone: true },
    ],
  },
  {
    id: 'ord-4',
    orderId: '1217890123',
    store: 'Flipkart',
    storeLogo: flipkartLogo,
    brandLogo: boatLogo,
    productTitle: 'boAt Airdopes 141 ANC Earbuds',
    specs: '42H Playtime  |  32dB Active Noise Cancellation  |  Fast Charge 10min=150min',
    productImage: twsImg,
    theme: 'blue',
    cashbackStatusText: 'Cashback Confirmed',
    cashbackAmountText: '+₹150',
    cashbackType: 'confirmed',
    orderStatus: 'DELIVERED',
    orderDate: '2023-09-20',
    deliveryDate: '2023-09-24',
    trackingId: 'EKART88291039',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Received', isDone: true },
    ],
  },
  {
    id: 'ord-5',
    orderId: '1218002931',
    store: 'Amazon',
    storeLogo: amazonLogo,
    brandLogo: appleLogo,
    productTitle: 'iPhone 15 Pro Max',
    variant: '256GB | Natural Titanium',
    specs: 'A17 Pro Chip  |  6.7" Super Retina XDR  |  5x Optical Telephoto  |  USB-C 3',
    productImage: iphoneImg,
    theme: 'blue',
    cashbackStatusText: 'Cashback Confirmed',
    cashbackAmountText: '+₹1,200',
    cashbackType: 'confirmed',
    orderStatus: 'DELIVERED',
    orderDate: '2023-09-15',
    deliveryDate: '2023-09-18',
    trackingId: 'AMZIN11092837',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Received', isDone: true },
    ],
  },
  {
    id: 'ord-6',
    orderId: '1218129038',
    store: 'Ajio',
    storeLogo: ajioLogo,
    brandLogo: appleLogo,
    productTitle: 'iPhone 15 Plus',
    variant: '128GB | Blue',
    specs: 'A16 Bionic Chip  |  6.7" Super Retina XDR  |  All-day Battery  |  Dynamic Island',
    productImage: iphoneImg,
    theme: 'blue',
    cashbackStatusText: 'Cashback Confirmed',
    cashbackAmountText: '+₹950',
    cashbackType: 'confirmed',
    orderStatus: 'DELIVERED',
    orderDate: '2023-09-10',
    deliveryDate: '2023-09-14',
    trackingId: 'AJIO99182374',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Received', isDone: true },
    ],
  },
  {
    id: 'ord-7',
    orderId: '1218290391',
    store: 'Amazon',
    storeLogo: amazonLogo,
    brandLogo: boatLogo,
    productTitle: 'boAt Nirvana Ion TWS Earbuds',
    specs: '120H Massive Playtime  |  Crystal Bionic Sound with Dual EQ  |  Quad Mics ENx',
    productImage: twsImg,
    theme: 'peach',
    cashbackStatusText: 'Cashback Pending',
    cashbackAmountText: '₹120',
    cashbackType: 'pending',
    orderStatus: 'PROCESSING',
    orderDate: '2023-10-14',
    trackingId: 'AMZIN66128392',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: false },
      { label: 'Cashback Pending', isDone: false, isPendingRed: true },
    ],
  },
  {
    id: 'ord-8',
    orderId: '1218391029',
    store: 'Myntra',
    storeLogo: myntraLogo,
    brandLogo: boatLogo,
    productTitle: 'boAt Airdopes 131 Pro True Wireless',
    specs: '45H Playtime  |  11mm Drivers  |  Insta Wake N’ Pair  |  Type C Charging',
    productImage: twsImg,
    theme: 'peach',
    cashbackStatusText: 'Cashback Pending',
    cashbackAmountText: '₹80',
    cashbackType: 'pending',
    orderStatus: 'SHIPPING',
    orderDate: '2023-10-13',
    trackingId: 'DTDC991823901',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Processing', isDone: true },
      { label: 'Shipped', isDone: true },
      { label: 'Cashback Pending', isDone: false, isPendingRed: true },
    ],
  },
  {
    id: 'ord-9',
    orderId: '1218492019',
    store: 'Nykaa',
    storeLogo: nykaaLogo,
    brandLogo: boatLogo,
    productTitle: 'boAt Rockerz 255 Pro+ Neckband',
    specs: '40H Playtime  |  ASAP Charge 10min=10h  |  IPX7 Water & Sweat Resistance',
    productImage: twsImg,
    theme: 'peach',
    cashbackStatusText: 'Cashback Cancelled',
    cashbackAmountText: '₹0',
    cashbackType: 'cancelled',
    orderStatus: 'CANCELLED',
    orderDate: '2023-09-05',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Cancelled', isDone: false, isCancelled: true },
    ],
  },
  {
    id: 'ord-10',
    orderId: '1218593021',
    store: 'Flipkart',
    storeLogo: flipkartLogo,
    brandLogo: appleLogo,
    productTitle: 'iPhone 14 (128GB, Midnight)',
    specs: 'A15 Bionic Chip  |  Photonic Engine  |  Crash Detection  |  Ceramic Shield',
    productImage: iphoneImg,
    theme: 'peach',
    cashbackStatusText: 'Cashback Cancelled',
    cashbackAmountText: '₹0',
    cashbackType: 'cancelled',
    orderStatus: 'CANCELLED',
    orderDate: '2023-09-02',
    steps: [
      { label: 'Ordered', isDone: true },
      { label: 'Cancelled', isDone: false, isCancelled: true },
    ],
  },
]

export const OrdersPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [activeFilter, setActiveFilter] = useState<OrderFilterType>('ALL')
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  const filterCounts = {
    ALL: INITIAL_ORDERS.length,
    DELIVERED: INITIAL_ORDERS.filter((o) => o.orderStatus === 'DELIVERED').length,
    PROCESSING: INITIAL_ORDERS.filter((o) => o.orderStatus === 'PROCESSING').length,
    SHIPPING: INITIAL_ORDERS.filter((o) => o.orderStatus === 'SHIPPING').length,
    CANCELLED: INITIAL_ORDERS.filter((o) => o.orderStatus === 'CANCELLED').length,
  }

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    if (activeFilter === 'ALL') return true
    return order.orderStatus === activeFilter
  })

  const toggleDetails = (id: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="orders-page">
      {/* 1. Top Navbar */}
      {isMobile ? <MobileHeader /> : <Navbar activeNav="orders" />}

      {/* 2. Red Montage Hero Banner (Full Background Image Height) */}
      <OrdersHero />

      {/* 3. Main Body Container (Balanced gap matching Figma) */}
      <main className="orders-main">
        <div className="orders-main__wrapper">
          {/* Left Column: Stack of Pill Navigation Buttons Flush with Left Viewport */}
          <ProfileSidebar activeTab="orders" showQuickAccess={false} />

          {/* Right Column: Orders Content Column */}
          <section className="orders-content" aria-label="Orders List">
            {/* Filter Tabs Row matching exact Figma media_1789724098956.png */}
            <div className="orders-filter-row" role="tablist" aria-label="Filter orders">
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'ALL'}
                className={`orders-filter-pill orders-filter-pill--all ${
                  activeFilter === 'ALL' ? 'orders-filter-pill--active' : ''
                }`}
                onClick={() => setActiveFilter('ALL')}
              >
                <span className="orders-filter-pill__label">All</span>
                <span className="orders-filter-pill__count">{filterCounts.ALL}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'DELIVERED'}
                className={`orders-filter-pill orders-filter-pill--delivered ${
                  activeFilter === 'DELIVERED' ? 'orders-filter-pill--active' : ''
                }`}
                onClick={() => setActiveFilter('DELIVERED')}
              >
                <span className="orders-filter-pill__label">Delivered</span>
                <span className="orders-filter-pill__count">{filterCounts.DELIVERED}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'PROCESSING'}
                className={`orders-filter-pill orders-filter-pill--processing ${
                  activeFilter === 'PROCESSING' ? 'orders-filter-pill--active' : ''
                }`}
                onClick={() => setActiveFilter('PROCESSING')}
              >
                <span className="orders-filter-pill__label">Processing</span>
                <span className="orders-filter-pill__count">{filterCounts.PROCESSING}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'SHIPPING'}
                className={`orders-filter-pill orders-filter-pill--shipping ${
                  activeFilter === 'SHIPPING' ? 'orders-filter-pill--active' : ''
                }`}
                onClick={() => setActiveFilter('SHIPPING')}
              >
                <span className="orders-filter-pill__label">Shipping</span>
                <span className="orders-filter-pill__count">{filterCounts.SHIPPING}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'CANCELLED'}
                className={`orders-filter-pill orders-filter-pill--cancelled ${
                  activeFilter === 'CANCELLED' ? 'orders-filter-pill--active' : ''
                }`}
                onClick={() => setActiveFilter('CANCELLED')}
              >
                <span className="orders-filter-pill__label">Cancelled</span>
                <span className="orders-filter-pill__count">{filterCounts.CANCELLED}</span>
              </button>
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="orders-empty-state">
                <div className="orders-empty-state__icon">📦</div>
                <h3 className="orders-empty-state__title">No {activeFilter.toLowerCase()} orders found</h3>
                <p className="orders-empty-state__text">
                  Shop deals and grab cashback directly into your Wouchify wallet!
                </p>
                <a href="/deals" className="orders-empty-state__btn">
                  Browse Deals
                </a>
              </div>
            ) : (
              <div className="orders-cards-list">
                {filteredOrders.map((order) => {
                  const isExpanded = !!expandedOrders[order.id]
                  const cardThemeClass =
                    order.theme === 'peach'
                      ? 'orders-card--peach'
                      : 'orders-card--blue'

                  return (
                    <article
                      key={order.id}
                      className={`orders-card ${cardThemeClass}`}
                      aria-label={`Order ${order.orderId} from ${order.store}`}
                    >
                      {/* Top Header Row: Store Logo & Order ID (Larger Width Store Logo) */}
                      <div className="orders-card__header">
                        <div className="orders-card__store">
                          <img
                            src={order.storeLogo}
                            alt={order.store}
                            className="orders-card__store-logo"
                          />
                        </div>
                        <span className="orders-card__order-id">
                          Order Id: #{order.orderId}
                        </span>
                      </div>

                      {/* Card Body: Left Details & Right 3D Product Render */}
                      <div className="orders-card__body">
                        {/* Left Content Column */}
                        <div className="orders-card__info-col">
                          {/* Title & Brand Row */}
                          <div className="orders-card__title-row">
                            {order.brandLogo && (
                              <img
                                src={order.brandLogo}
                                alt=""
                                className="orders-card__brand-logo"
                              />
                            )}
                            <h3 className="orders-card__title">{order.productTitle}</h3>
                            {order.variant && (
                              <span className="orders-card__variant-tag">
                                {order.variant}
                              </span>
                            )}
                          </div>

                          {/* Product Specs Line */}
                          <p className="orders-card__specs">{order.specs}</p>

                          {/* Cashback Bar Stand / Base Backing Layer with Appropriate Background Tint */}
                          <div className="orders-card__cashback-wrapper">
                            <div
                              className={`orders-card__cashback-bar orders-card__cashback-bar--${order.cashbackType}`}
                            >
                              <span className="orders-card__cashback-status">
                                {order.cashbackStatusText}
                              </span>
                              <span className="orders-card__cashback-amount">
                                {order.cashbackAmountText}
                              </span>
                            </div>
                          </div>

                          {/* Stepper Tracker Row */}
                          <div className="orders-card__stepper">
                            {order.steps.map((step, idx) => {
                              const isLast = idx === order.steps.length - 1
                              return (
                                <div key={idx} className="orders-card__stepper-step">
                                  <div className="orders-card__stepper-circle-wrap">
                                    <div
                                      className={`orders-card__stepper-circle ${
                                        step.isDone
                                          ? isLast && order.cashbackType === 'confirmed'
                                            ? 'orders-card__stepper-circle--green'
                                            : 'orders-card__stepper-circle--done'
                                          : step.isPendingRed
                                          ? 'orders-card__stepper-circle--pending-red'
                                          : step.isCancelled
                                          ? 'orders-card__stepper-circle--cancelled'
                                          : 'orders-card__stepper-circle--pending'
                                      }`}
                                    >
                                      {step.isDone && '✓'}
                                      {step.isCancelled && '✕'}
                                    </div>
                                    {!isLast && (
                                      <div
                                        className={`orders-card__stepper-line ${
                                          step.isDone
                                            ? 'orders-card__stepper-line--done'
                                            : 'orders-card__stepper-line--pending'
                                        }`}
                                      />
                                    )}
                                  </div>
                                  <span className="orders-card__stepper-label">
                                    {step.label}
                                  </span>
                                </div>
                              )
                            })}
                          </div>

                          {/* Cashback Details Button (Dropdown Trigger) */}
                          <div className="orders-card__actions">
                            <button
                              type="button"
                              className="orders-card__details-btn"
                              onClick={() => toggleDetails(order.id)}
                              aria-expanded={isExpanded}
                            >
                              Cashback Details&gt;&gt;
                            </button>
                          </div>
                        </div>

                        {/* Right 3D Product Image Render */}
                        <div className="orders-card__image-col">
                          <img
                            src={order.productImage}
                            alt={order.productTitle}
                            className="orders-card__product-img"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Expandable Cashback Details Drawer with Dual Shadows */}
                      {isExpanded && (
                        <div
                          className={`orders-card__drawer ${
                            order.theme === 'peach'
                              ? 'orders-card__drawer--peach'
                              : 'orders-card__drawer--blue'
                          }`}
                        >
                          <div className="orders-card__drawer-grid">
                            <div className="orders-card__drawer-item">
                              <span className="orders-card__drawer-label">Store:</span>
                              <span className="orders-card__drawer-val">{order.store}</span>
                            </div>
                            <div className="orders-card__drawer-item">
                              <span className="orders-card__drawer-label">Order Placed:</span>
                              <span className="orders-card__drawer-val">{order.orderDate}</span>
                            </div>
                            {order.deliveryDate && (
                              <div className="orders-card__drawer-item">
                                <span className="orders-card__drawer-label">Delivered Date:</span>
                                <span className="orders-card__drawer-val">{order.deliveryDate}</span>
                              </div>
                            )}
                            {order.trackingId && (
                              <div className="orders-card__drawer-item">
                                <span className="orders-card__drawer-label">Tracking ID:</span>
                                <span className="orders-card__drawer-val">{order.trackingId}</span>
                              </div>
                            )}
                            <div className="orders-card__drawer-item">
                              <span className="orders-card__drawer-label">Cashback Rate:</span>
                              <span className="orders-card__drawer-val">Standard Guaranteed Partner Rate</span>
                            </div>
                            <div className="orders-card__drawer-item">
                              <span className="orders-card__drawer-label">Wallet Status:</span>
                              <span className="orders-card__drawer-val" style={{ fontWeight: 700 }}>
                                {order.cashbackStatusText} ({order.cashbackAmountText})
                              </span>
                            </div>
                          </div>
                          <div className="orders-card__drawer-actions">
                            <a
                              href="/wallet"
                              className="orders-card__drawer-link"
                            >
                              View in My Wallet →
                            </a>
                            <a
                              href="/help"
                              className="orders-card__drawer-link orders-card__drawer-link--help"
                            >
                              Report Issue / Need Help
                            </a>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 4. Global Desktop Footer */}
      <FooterSection />
    </div>
  )
}

export default OrdersPage
