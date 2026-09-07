import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import './StaticPage.css'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="static-page">
      <Navbar />
      <main className="static-page__content">
        <h1 className="static-page__title">Privacy Policy</h1>
        <div className="static-page__body">
          <h3>1. Information We Collect</h3>
          <p>
            When you visit Wouchify, we may collect personal information such as your name, email address,
            and browsing behavior to improve your experience and provide you with relevant deals.
          </p>
          
          <h3>2. How We Use Your Information</h3>
          <p>
            The information we collect is used to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services.</li>
            <li>Send you notifications about new deals and exclusive offers.</li>
            <li>Understand and analyze how you use our platform.</li>
          </ul>

          <h3>3. Sharing Your Information</h3>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties 
            except when necessary to provide you with a requested service or comply with the law.
          </p>

          <h3>4. Security</h3>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information.
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}

export default PrivacyPolicyPage
