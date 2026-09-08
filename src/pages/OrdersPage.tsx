import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './OrdersPage.css'

interface OrderItem {
  id: string
  store: string
  storeLogo: string
  productName: string
  productDesc: string
  category: string
  qty: number
  price: number
  originalPrice: number
  cashback: number
  cashbackStatus: 'CONFIRMED' | 'PENDING' | 'PAID_OUT' | 'CANCELLED'
  orderStatus: 'ORDERED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  orderDate: string
  deliveryDate?: string
  orderId: string
  trackingId?: string
}

const orders: OrderItem[] = [
  {
    id: '1', store: 'Amazon India', storeLogo: '🛒',
    productName: 'Apple iPhone 15 (128GB, Black)',
    productDesc: 'A16 Bionic chip · 6.1" Super Retina XDR · 48MP Camera · iOS 17',
    category: 'Electronics', qty: 1, price: 72999, originalPrice: 79999,
    cashback: 800, cashbackStatus: 'CONFIRMED', orderStatus: 'DELIVERED',
    orderDate: '2023-10-12', deliveryDate: '2023-10-15', orderId: 'ORD-001',
    trackingId: 'AMZIN4829301K',
  },
  {
    id: '2', store: 'Myntra', storeLogo: '👗',
    productName: "H&M Men's Oversized T-Shirt (L, Navy Blue)",
    productDesc: '100% Cotton · Relaxed Fit · Machine Washable · Pack of 1',
    category: 'Fashion', qty: 2, price: 1299, originalPrice: 1999,
    cashback: 65, cashbackStatus: 'PENDING', orderStatus: 'SHIPPED',
    orderDate: '2023-10-11', orderId: 'ORD-002', trackingId: 'DTDC9283847',
  },
  {
    id: '3', store: 'Flipkart', storeLogo: '🏪',
    productName: 'boAt Airdopes 141 v2 Wireless Earbuds',
    productDesc: '42H Playtime · BEAST™ Mode · ENx™ Technology · IPX4 Water Resistant',
    category: 'Electronics', qty: 1, price: 999, originalPrice: 2490,
    cashback: 50, cashbackStatus: 'PENDING', orderStatus: 'PROCESSING',
    orderDate: '2023-10-10', orderId: 'ORD-003',
  },
  {
    id: '4', store: 'Ajio', storeLogo: '✨',
    productName: 'Levis 511 Slim Fit Jeans (32W × 30L, Dark Blue)',
    productDesc: "Slim through hip & thigh · Levi's Flex Technology · 99% Cotton 1% Elastane",
    category: 'Fashion', qty: 1, price: 2499, originalPrice: 4999,
    cashback: 180, cashbackStatus: 'PAID_OUT', orderStatus: 'DELIVERED',
    orderDate: '2023-09-25', deliveryDate: '2023-09-28', orderId: 'ORD-004',
  },
  {
    id: '5', store: 'Nykaa', storeLogo: '💄',
    productName: "L'Oreal Paris Revitalift 1.5% Pure Hyaluronic Acid Serum (30ml)",
    productDesc: '7 Day Visible Plumping Effect · Dermatologist Tested · Paraben Free',
    category: 'Beauty', qty: 1, price: 699, originalPrice: 999,
    cashback: 35, cashbackStatus: 'CANCELLED', orderStatus: 'CANCELLED',
    orderDate: '2023-09-20', orderId: 'ORD-005',
  },
]

const STATUS_STEPS: Record<string, { label: string; steps: string[]; current: number }> = {
  ORDERED:    { label: 'Order Placed',  steps: ['Ordered', 'Processing', 'Shipped', 'Delivered'], current: 0 },
  PROCESSING: { label: 'Processing',    steps: ['Ordered', 'Processing', 'Shipped', 'Delivered'], current: 1 },
  SHIPPED:    { label: 'Shipped',       steps: ['Ordered', 'Processing', 'Shipped', 'Delivered'], current: 2 },
  DELIVERED:  { label: 'Delivered',     steps: ['Ordered', 'Processing', 'Shipped', 'Delivered'], current: 3 },
  CANCELLED:  { label: 'Cancelled',     steps: ['Ordered', 'Cancelled'],                          current: 1 },
}

const CASHBACK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  CONFIRMED:  { label: '✅ Cashback Confirmed', color: '#065f46', bg: '#ecfdf5' },
  PENDING:    { label: '⏳ Cashback Pending',   color: '#92400e', bg: '#fffbeb' },
  PAID_OUT:   { label: '💰 Cashback Paid Out',  color: '#1e40af', bg: '#eff6ff' },
  CANCELLED:  { label: '❌ Cashback Cancelled', color: '#991b1b', bg: '#fef2f2' },
}

const FILTER_TABS = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled']

export const OrdersPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [activeFilter, setActiveFilter] = useState('All')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filtered = activeFilter === 'All'
    ? orders
    : orders.filter(o => o.orderStatus === activeFilter.toUpperCase())

  const toggle = (id: string) => setExpandedOrder(prev => prev === id ? null : id)

  return (
    <main className="orders-page">
      <div className="orders-page__header-bg" />
      <div className="orders-page__navbar-wrapper">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      <div className="orders-container">
        {/* Page header */}
        <div className="orders-page-header">
          <div>
            <h1>My Orders</h1>
            <p>{orders.length} orders placed · {orders.filter(o => o.orderStatus === 'DELIVERED').length} delivered</p>
          </div>
          <a href="/profile" className="orders-back-link">← Back to Profile</a>
        </div>

        {/* Filter Tabs */}
        <div className="orders-filter-tabs">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              className={`orders-filter-tab ${activeFilter === tab ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
              {tab !== 'All' && (
                <span className="orders-filter-tab__count">
                  {orders.filter(o => o.orderStatus === tab.toUpperCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty__icon">📦</div>
            <h2>No {activeFilter.toLowerCase()} orders</h2>
            <p>Shop your favourite deals and earn cashback on every order!</p>
            <a href="/deals" className="orders-empty__cta">Browse Deals</a>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map(order => {
              const st = STATUS_STEPS[order.status] || STATUS_STEPS[order.orderStatus]
              const stepInfo = STATUS_STEPS[order.orderStatus]
              const cb = CASHBACK_CONFIG[order.cashbackStatus]
              const isExpanded = expandedOrder === order.id
              const isCancelled = order.orderStatus === 'CANCELLED'

              return (
                <div key={order.id} className={`order-card ${isCancelled ? 'cancelled' : ''}`}>
                  {/* Order card top bar */}
                  <div className="order-card__topbar">
                    <div className="order-card__topbar-left">
                      <span className="order-card__store-tag">{order.storeLogo} {order.store}</span>
                      <span className="order-card__id">Order #{order.orderId}</span>
                    </div>
                    <div className="order-card__topbar-right">
                      <span className="order-card__date">
                        Placed: {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Product row */}
                  <div className="order-card__product-row">
                    <div className="order-card__product-emoji">{order.storeLogo}</div>
                    <div className="order-card__product-info">
                      <p className="order-card__product-name">{order.productName}</p>
                      <p className="order-card__product-desc">{order.productDesc}</p>
                      <div className="order-card__product-meta">
                        <span className="order-card__category-tag">{order.category}</span>
                        <span className="order-card__qty">Qty: {order.qty}</span>
                      </div>
                    </div>
                    <div className="order-card__pricing">
                      <p className="order-card__price">₹{(order.price * order.qty).toLocaleString('en-IN')}</p>
                      {order.originalPrice > order.price && (
                        <p className="order-card__original">₹{(order.originalPrice * order.qty).toLocaleString('en-IN')}</p>
                      )}
                      {order.originalPrice > order.price && (
                        <p className="order-card__savings">
                          Saved ₹{((order.originalPrice - order.price) * order.qty).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cashback banner */}
                  <div className="order-card__cashback-banner" style={{ color: cb.color, background: cb.bg }}>
                    <span>{cb.label}</span>
                    <strong>₹{order.cashback}</strong>
                  </div>

                  {/* Status Tracker */}
                  {!isCancelled && (
                    <div className="order-card__tracker">
                      {stepInfo.steps.map((step, idx) => (
                        <React.Fragment key={step}>
                          <div className={`tracker-step ${idx <= stepInfo.current ? 'done' : ''} ${idx === stepInfo.current ? 'current' : ''}`}>
                            <div className="tracker-step__dot">
                              {idx < stepInfo.current ? '✓' : idx === stepInfo.current ? '●' : ''}
                            </div>
                            <p className="tracker-step__label">{step}</p>
                            {idx === stepInfo.current && order.deliveryDate && step === 'Delivered' && (
                              <p className="tracker-step__date">
                                {new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </p>
                            )}
                          </div>
                          {idx < stepInfo.steps.length - 1 && (
                            <div className={`tracker-line ${idx < stepInfo.current ? 'done' : ''}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {isCancelled && (
                    <div className="order-card__cancelled-bar">
                      ❌ This order was cancelled
                    </div>
                  )}

                  {/* Actions */}
                  <div className="order-card__actions">
                    {order.orderStatus === 'SHIPPED' && order.trackingId && (
                      <button className="order-action-btn order-action-btn--primary">
                        📦 Track Package
                      </button>
                    )}
                    {order.orderStatus === 'DELIVERED' && (
                      <>
                        <button className="order-action-btn order-action-btn--primary">⭐ Rate & Review</button>
                        <button className="order-action-btn order-action-btn--outline">🔄 Buy Again</button>
                      </>
                    )}
                    {(order.orderStatus === 'ORDERED' || order.orderStatus === 'PROCESSING') && (
                      <button className="order-action-btn order-action-btn--danger">✕ Cancel Order</button>
                    )}
                    <button className="order-action-btn order-action-btn--outline" onClick={() => toggle(order.id)}>
                      {isExpanded ? '▲ Less Info' : '▼ More Info'}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="order-card__details">
                      <div className="order-detail-grid">
                        <div className="order-detail-item">
                          <span className="order-detail-label">Order ID</span>
                          <span className="order-detail-value">{order.orderId}</span>
                        </div>
                        {order.trackingId && (
                          <div className="order-detail-item">
                            <span className="order-detail-label">Tracking ID</span>
                            <span className="order-detail-value">{order.trackingId}</span>
                          </div>
                        )}
                        <div className="order-detail-item">
                          <span className="order-detail-label">Store</span>
                          <span className="order-detail-value">{order.store}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="order-detail-label">Category</span>
                          <span className="order-detail-value">{order.category}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="order-detail-label">Quantity</span>
                          <span className="order-detail-value">{order.qty}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="order-detail-label">Price Paid</span>
                          <span className="order-detail-value">₹{(order.price * order.qty).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="order-detail-label">Cashback Earned</span>
                          <span className="order-detail-value" style={{ color: '#10b981', fontWeight: 700 }}>₹{order.cashback}</span>
                        </div>
                        {order.deliveryDate && (
                          <div className="order-detail-item">
                            <span className="order-detail-label">Delivered On</span>
                            <span className="order-detail-value">
                              {new Date(order.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="order-card__invoice-actions">
                        <button className="order-action-btn order-action-btn--outline">🧾 Download Invoice</button>
                        <button className="order-action-btn order-action-btn--outline">💬 Need Help?</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  )
}

export default OrdersPage
