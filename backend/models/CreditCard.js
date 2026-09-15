const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  cardName: { type: String, required: true },
  bank: { type: String, required: true },
  network: { 
    type: String, 
    enum: ['Visa', 'Mastercard', 'Rupay', 'Amex', 'Diners'], 
    default: 'Visa' 
  },
  tier: { 
    type: String, 
    enum: ['Entry', 'Classic', 'Premium', 'Super Premium', 'Infinite'], 
    default: 'Classic' 
  },
  imageUrl: { type: String, default: '' },
  bankLogoUrl: { type: String, default: '' },
  welcomeOffer: { type: String, default: '' },
  rewardRate: { type: String, default: '' },
  keyBenefits: [{ type: String }],
  partnerBrands: [{ type: String }],
  affiliateLink: { type: String, default: '' },
  annualFee: { type: String, default: '₹0' },
  joiningFee: { type: String, default: '₹0' },
  feeWaiver: { type: String, default: '' },
  offerStartDate: { type: String, default: '' },
  offerExpiryDate: { type: String, default: '' },
  lastUpdated: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'featured', 'discontinued'], 
    default: 'active' 
  },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  applyCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  submittedBy: { type: String, default: '' },
  submissionStatus: { 
    type: String, 
    enum: ['draft', 'pending_approval', 'approved', 'rejected'], 
    default: 'approved' 
  }
}, { timestamps: true });

module.exports = mongoose.model('CreditCard', creditCardSchema);
