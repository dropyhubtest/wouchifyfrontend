const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['Cashback', 'Redemption', 'Referral'], required: true },
  amount: { type: String, required: true },
  status: { type: String, enum: ['Completed', 'Pending', 'Processing'], default: 'Pending' },
  time: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
