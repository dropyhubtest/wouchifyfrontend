const mongoose = require('mongoose');

const cashbackClaimSchema = new mongoose.Schema({
  claimId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  store: { type: String, required: true },
  orderId: { type: String, required: true },
  orderAmount: { type: String, required: true },
  cashbackAmount: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Processed', 'Rejected'], 
    default: 'Pending' 
  },
  payoutMethod: { 
    type: String, 
    enum: ['UPI', 'Bank Transfer'], 
    default: 'UPI' 
  },
  payoutDetails: { type: String, default: '' },
  receiptUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  reviewedBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CashbackClaim', cashbackClaimSchema);
