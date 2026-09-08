const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  store: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  originalPrice: { type: String, default: '' },
  discount: { type: String, default: '' },
  status: { type: String, enum: ['active', 'pending', 'expired'], default: 'active' },
  expiry: { type: String, default: '' },
  productImage: { type: String, default: '' },
  storeLogo: { type: String, default: '' },
  ctaText: { type: String, default: 'GRAB DEAL' },
  ctaHref: { type: String, default: '' },
  dealTag: { type: String, default: 'Deal' },
  rating: { type: String, default: '4.8' },
  verified: { type: Boolean, default: true },
  isBestSelling: { type: Boolean, default: false },
  sectionPlacement: { type: String, enum: ['favourite', 'best_selling', 'both'], default: 'favourite' }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
