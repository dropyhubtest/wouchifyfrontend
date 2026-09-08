const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String },
  mobile: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  role: { type: String, default: "user" },
  walletBalance: { type: String, default: '₹0' },
  totalCashback: { type: String, default: '₹0' },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['active', 'verified', 'suspended'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
