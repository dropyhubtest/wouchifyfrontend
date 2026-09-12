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
  submittedBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
