const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  title: { type: String, required: true },
  advertiser: { type: String, required: true },
  placement: { type: String, default: 'sidebar' },
  imageUrl: { type: String, default: '' },
  targetLink: { type: String, default: '' },
  ctaText: { type: String, default: 'Learn More' },
  badgeText: { type: String, default: 'Sponsored' },
  pricingModel: { 
    type: String, 
    enum: ['CPM', 'CPC', 'Flat Monthly', 'Affiliate'], 
    default: 'CPC' 
  },
  budgetOrRate: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'paused', 'scheduled', 'pending'], 
    default: 'active' 
  },
  expiryDate: { type: String, default: '' },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  submittedBy: { type: String, default: '' },
  submissionStatus: { 
    type: String, 
    enum: ['draft', 'pending_approval', 'approved', 'rejected'], 
    default: 'approved' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', advertisementSchema);
