import React from 'react'
import ordersHeroBg from '../../assets/my_orders/orders_herobg.png'
import './OrdersHero.css'

interface OrdersHeroProps {
  onBrowseClick?: () => void
}

export const OrdersHero: React.FC<OrdersHeroProps> = ({ onBrowseClick }) => {
  return (
    <section
      className="orders-hero"
      style={{ backgroundImage: `url(${ordersHeroBg})` }}
      aria-label="Orders Hero Banner"
    >
      <div className="orders-hero__overlay" />
      <div className="orders-hero__content">
        <h1 className="orders-hero__title">My Orders</h1>
        <h2 className="orders-hero__subtitle">Check all your order status here</h2>
        <p className="orders-hero__tagline">
          Track your order status and cashback realtime for you with order history
        </p>
        <a
          href="/deals"
          className="orders-hero__btn"
          onClick={(e) => {
            if (onBrowseClick) {
              e.preventDefault()
              onBrowseClick()
            }
          }}
        >
          Browse items&gt;&gt;
        </a>
      </div>
    </section>
  )
}

export default OrdersHero
