const mongoose = require('mongoose');

const lootDealSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  name: { type: String },
  store: { type: String },
  storeName: { type: String },
  brand: { type: String, default: '' },
  category: { type: String, required: true },
  lootType: { type: String, default: 'flash' },
  dealType: { type: String, default: 'flash' },
  badge: { type: String, default: '⚡ HOT DROP' },
  status: { type: String, default: 'active' },
  submissionStatus: { type: String, default: 'approved' },
  priority: { type: String, default: 'High' },
  code: { type: String, default: '' },
  link: { type: String, default: '/deals' },
  href: { type: String, default: '/deals' },
  originalPrice: { type: String, default: '' },
  price: { type: String, default: '' },
  currentPrice: { type: String, default: '' },
  discount: { type: String, default: '' },
  discountLabel: { type: String, default: '' },
  discountValue: { type: Number, default: 0 },
  effectivePrice: { type: String, default: '' },
  cashback: { type: String, default: '' },
  stockClaimedPercent: { type: Number, default: 85 },
  quantityAlert: { type: String, default: '' },
  proofNote: { type: String, default: '' },
  trickSteps: { type: String, default: '' },
  terms: { type: String, default: '' },
  asinOrSku: { type: String, default: '' },
  deliveryInfo: { type: String, default: 'Fast Delivery' },
  rating: { type: String, default: '4.5 ★' },
  postedAt: { type: String, default: 'Today' },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  telegramAlert: { type: Boolean, default: false },
  pushNotification: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  showOnHome: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  isBestSelling: { type: Boolean, default: false },
  sectionPlacement: { type: String, enum: ['favourite', 'best_selling', 'both', 'none'], default: 'favourite' },
  publishAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

lootDealSchema.index({ status: 1, publishAt: 1, expiresAt: 1 });
lootDealSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('LootDeal', lootDealSchema);
