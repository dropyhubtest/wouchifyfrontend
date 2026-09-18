const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  description: { type: String, default: '' },
  store: { type: String, required: true },
  category: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  couponType: { type: String, default: 'percent' },
  discount: { type: String, required: true },
  discountValue: { type: Number, default: 0 },
  minOrder: { type: String, default: '' },
  maxDiscount: { type: String, default: '' },
  affiliateLink: { type: String, default: '' },
  status: { type: String, default: 'active' },
  submissionStatus: { type: String, default: 'approved' },
  opsManagerApproval: { type: String, default: 'Approved' },
  managerApproval: { type: String, default: 'Approved' },
  submittedBy: { type: String, default: '' },
  isExclusive: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  telegramAlert: { type: Boolean, default: false },
  startDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  expiry: { type: String, default: '' },
  usageCount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 5000 },
  totalUses: { type: Number, default: 5000 },
  publishAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

couponSchema.index({ status: 1, publishAt: 1, expiresAt: 1 });
couponSchema.index({ store: 1, code: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
