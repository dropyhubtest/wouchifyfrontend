import React, { useState } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import './StaticPage.css'

export const ContactUsPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="static-page">
      <Navbar />
      <main className="static-page__content">
        <h1 className="static-page__title">Contact Us</h1>
        <div className="static-page__body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h3 style={{ color: '#1e8a3a' }}>Thank you!</h3>
              <p>Your message has been sent successfully. We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name</label>
                <input 
                  type="text" 
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D5D5DF', boxSizing: 'border-box' }} 
                  placeholder="Your Name" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email</label>
                <input 
                  type="email" 
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D5D5DF', boxSizing: 'border-box' }} 
                  placeholder="Your Email Address" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Message</label>
                <textarea 
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D5D5DF', minHeight: '120px', boxSizing: 'border-box', fontFamily: 'inherit' }} 
                  placeholder="How can we help you?" 
                />
              </div>
              <button 
                type="submit" 
                style={{ background: '#E31E25', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '16px', marginTop: '8px' }}
              >
                Send Message
              </button>
            </form>
          )}

          <div style={{ marginTop: '48px', borderTop: '1px solid #E5E7FF', paddingTop: '24px' }}>
            <h3>Other ways to reach us</h3>
            <p><strong>Email:</strong> support@wouchify.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}

export default ContactUsPage
