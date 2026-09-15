const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true },
  store: { type: String, required: true },
  discount: { type: String, required: true },
  category: { type: String, required: true },
  usageCount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 1000 },
  status: { type: String, enum: ['active', 'expired', 'pending', 'rejected'], default: 'pending' },
  opsManagerApproval: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  managerApproval: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedBy: { type: String, default: '' },
  expiry: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
