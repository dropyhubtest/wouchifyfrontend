const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true },
  store: { type: String, required: true },
  discount: { type: String, required: true },
  category: { type: String, required: true },
  usageCount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 1000 },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  expiry: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
