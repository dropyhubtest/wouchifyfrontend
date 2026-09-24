const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  slug: { type: String },
  category: { type: String, required: true },
  logo: { type: String, default: '' },
  reward: { type: String, default: '' },
  description: { type: String, default: '' },
  cardBg: { type: String, default: '#ffffff' },
  badgeBg: { type: String, default: '#f1f5f9' },
  href: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  showOnHome: { type: Boolean, default: true },
  status: { type: String, default: 'active' },
  submissionStatus: { type: String, default: 'approved' },
  opsManagerApproval: { type: String, default: 'Approved' },
  managerApproval: { type: String, default: 'Approved' },
  publishAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  submittedBy: { type: String, default: '' },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

storeSchema.index({ status: 1, publishAt: 1 });

module.exports = mongoose.model('Store', storeSchema);
