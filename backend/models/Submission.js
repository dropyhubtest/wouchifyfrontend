const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  entityType: { 
    type: String, 
    enum: ['deal', 'loot_deal', 'coupon', 'store', 'credit_card', 'banner', 'advertisement'], 
    required: true 
  },
  entityId: { type: String, default: '' },
  action: { 
    type: String, 
    enum: ['create', 'update', 'delete'], 
    default: 'create' 
  },
  title: { type: String, required: true },
  store: { type: String, default: '' },
  category: { type: String, default: '' },
  priority: { 
    type: String, 
    enum: ['Critical', 'High', 'Normal'], 
    default: 'Normal' 
  },
  submittedBy: { type: String, default: '' },
  submittedByName: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending Approval', 'Approved', 'Rejected'], 
    default: 'Pending Approval' 
  },
  rejectionReason: { type: String, default: '' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: Date },
  notes: { type: String, default: '' },
  dataSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
