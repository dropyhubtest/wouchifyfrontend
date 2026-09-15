const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetPage: { type: String, default: 'home' },
  badgeText: { type: String, default: '' },
  headingLine1: { type: String, default: '' },
  headingLine2: { type: String, default: '' },
  headingLine3: { type: String, default: '' },
  description: { type: String, default: '' },
  ctaText: { type: String, default: 'Explore Deals' },
  targetLink: { type: String, default: '' },
  primaryImage: { type: String, default: '' },
  secondaryImage: { type: String, default: '' },
  backgroundImage: { type: String, default: '' },
  dealChip1: { type: String, default: '' },
  dealChip2: { type: String, default: '' },
  themeColor: { type: String, default: '#6366F1' },
  priority: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'scheduled'], 
    default: 'active' 
  },
  expiryDate: { type: String, default: '' },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  submittedBy: { type: String, default: '' },
  submissionStatus: { 
    type: String, 
    enum: ['draft', 'pending_approval', 'approved', 'rejected'], 
    default: 'approved' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
