import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './CartPage.css'

interface CartItem {
  id: number
  store: string
  deal: string
  originalPrice: number
  discountedPrice: number
  cashback: number
  image: string
}

const initialCart: CartItem[] = [
  { id: 1, store: 'Amazon India', deal: 'Apple iPhone 15 (128GB, Black)', originalPrice: 79999, discountedPrice: 72999, cashback: 730, image: '📱' },
  { id: 2, store: 'Myntra', deal: 'H&M Premium Oversized Tee', originalPrice: 1999, discountedPrice: 1299, cashback: 65, image: '👕' },
  { id: 3, store: 'Flipkart', deal: 'boAt Airdopes 141 v2', originalPrice: 2490, discountedPrice: 999, cashback: 50, image: '🎧' },
]

export const CartPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [cart, setCart] = useState<CartItem[]>(initialCart)

  const remove = (id: number) => setCart(prev => prev.filter(i => i.id !== id))
  const total = cart.reduce((s, i) => s + i.discountedPrice, 0)
  const totalCashback = cart.reduce((s, i) => s + i.cashback, 0)

  return (
    <main className="cart-page">
      <div className="cart-page__header-bg" />
      <div className="cart-page__navbar-wrapper">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      <div className="cart-container">
        <div className="cart-page-header">
          <h1>Shopping Cart</h1>
          <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Browse our top deals and add items to your cart!</p>
            <a href="/deals" className="cart-empty__cta">Explore Deals</a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">{item.image}</div>
                  <div className="cart-item__info">
                    <p className="cart-item__store">{item.store}</p>
                    <p className="cart-item__name">{item.deal}</p>
                    <div className="cart-item__pricing">
                      <span className="cart-item__price">₹{item.discountedPrice.toLocaleString('en-IN')}</span>
                      <span className="cart-item__original">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="cart-item__cashback">🎉 Earn ₹{item.cashback} cashback</p>
                  </div>
                  <button className="cart-item__remove" onClick={() => remove(item.id)} aria-label="Remove item">✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="cart-summary__title">Order Summary</h2>
              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Estimated Delivery</span>
                  <span className="cart-summary__free">FREE</span>
                </div>
                <div className="cart-summary__row cart-summary__cashback-row">
                  <span>💰 Cashback You'll Earn</span>
                  <span>+₹{totalCashback}</span>
                </div>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <button className="cart-checkout-btn">Proceed to Checkout →</button>
              <a href="/deals" className="cart-continue-link">← Continue Shopping</a>
            </div>
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  )
}

export default CartPage
