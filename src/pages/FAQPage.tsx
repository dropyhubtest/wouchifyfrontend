import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import './StaticPage.css'

export const FAQPage: React.FC = () => {
  return (
    <div className="static-page">
      <Navbar />
      <main className="static-page__content">
        <h1 className="static-page__title">Frequently Asked Questions</h1>
        <div className="static-page__body">
          <h3>What is a Loot Deal?</h3>
          <p>
            A Loot Deal is a highly discounted, limited-time offer. These are often flash sales or 
            pricing errors that provide incredible value. They disappear quickly, so act fast!
          </p>
          
          <h3>How do I use a coupon code?</h3>
          <p>
            Simply click on "Get Code" or "Copy Code" next to the deal you want. The code will be 
            copied to your clipboard, and you will be redirected to the store's website. Paste the 
            code at checkout to apply your discount.
          </p>

          <h3>Are the deals verified?</h3>
          <p>
            Yes! Look for the green "Verified" badge next to our deals. Our team and community 
            test these codes to ensure they are active and working.
          </p>

          <h3>Is Wouchify free to use?</h3>
          <p>
            Absolutely. Wouchify is completely free for all users. We make our money through 
            affiliate partnerships when you make a purchase using our links.
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}

export default FAQPage
