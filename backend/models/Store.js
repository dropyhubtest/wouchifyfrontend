const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  logo: String,
  reward: String,
  href: String,
  status: { type: String, enum: ['active', 'inactive', 'pending', 'rejected'], default: 'pending' },
  opsManagerApproval: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  managerApproval: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  publishAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  submittedBy: { type: String, default: '' }
}, { timestamps: true });

storeSchema.index({ status: 1, publishAt: 1 });

module.exports = mongoose.model('Store', storeSchema);
