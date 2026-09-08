const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  walletBalance: { type: String, default: '₹0' },
  totalCashback: { type: String, default: '₹0' },
  joinedDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'verified', 'suspended'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
