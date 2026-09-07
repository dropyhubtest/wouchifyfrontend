import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import './StaticPage.css'

export const AboutUsPage: React.FC = () => {
  return (
    <div className="static-page">
      <Navbar />
      <main className="static-page__content">
        <h1 className="static-page__title">About Us</h1>
        <div className="static-page__body">
          <h3>Our Mission</h3>
          <p>
            At Wouchify, our mission is to bring you the best deals, discounts, and cashback offers 
            from your favorite stores and brands. We believe that everyone deserves to save money 
            while shopping for the things they love.
          </p>
          
          <h3>What We Do</h3>
          <p>
            We curate and verify thousands of coupons daily so you don't have to. Whether you're 
            looking for fashion, electronics, travel, or food delivery deals, our platform connects 
            you instantly with the best savings available.
          </p>

          <h3>Why Choose Wouchify?</h3>
          <ul>
            <li><strong>Verified Deals:</strong> We test our codes to ensure they actually work.</li>
            <li><strong>Instant Updates:</strong> Real-time alerts for flash sales and loot deals.</li>
            <li><strong>Exclusive Offers:</strong> Access to discounts you won't find anywhere else.</li>
          </ul>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}

export default AboutUsPage
