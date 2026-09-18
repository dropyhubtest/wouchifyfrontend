const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  title: { type: String },
  store: { type: String, required: true },
  brand: { type: String, default: '' },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  asinOrSku: { type: String, default: '' },
  type: { type: String, default: 'deal' },
  price: { type: String, required: true },
  originalPrice: { type: String, default: '' },
  discount: { type: String, default: '' },
  discountLabel: { type: String, default: '' },
  discountValue: { type: Number, default: 0 },
  bankOffer: { type: String, default: '' },
  effectivePrice: { type: String, default: '' },
  code: { type: String, default: '' },
  cashback: { type: String, default: '' },
  stockStatus: { type: String, default: 'In Stock' },
  rating: { type: String, default: '4.8' },
  deliveryInfo: { type: String, default: 'Free Express Delivery' },
  warranty: { type: String, default: '1 Year Brand Warranty' },
  variantNote: { type: String, default: '' },
  howToClaim: { type: String, default: '' },
  highlights: { type: [String], default: [] },
  status: { type: String, default: 'active' },
  submissionStatus: { type: String, default: 'approved' },
  priority: { type: String, default: 'Normal' },
  expiry: { type: String, default: '' },
  postedAt: { type: String, default: '' },
  productImage: { type: String, default: '' },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  storeLogo: { type: String, default: '' },
  ctaText: { type: String, default: 'GRAB DEAL' },
  ctaHref: { type: String, default: '' },
  link: { type: String, default: '' },
  badge: { type: String, default: 'Deal' },
  dealTag: { type: String, default: 'Deal' },
  verified: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isBestSelling: { type: Boolean, default: false },
  sectionPlacement: { type: String, enum: ['favourite', 'best_selling', 'both'], default: 'favourite' },
  publishAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  description: { type: String, default: '' },
  terms: { type: String, default: '' },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

dealSchema.index({ status: 1, publishAt: 1, expiresAt: 1 });
dealSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Deal', dealSchema);

