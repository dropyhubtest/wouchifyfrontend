const mongoose = require('mongoose');

const staffMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['executive', 'operational_manager', 'manager'], 
    default: 'executive' 
  },
  domain: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['Online', 'Away', 'Offline'], 
    default: 'Offline' 
  },
  submissionsToday: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  approvalRate: { type: String, default: '100%' },
  rejectionsCount: { type: Number, default: 0 },
  avgTurnaround: { type: String, default: '15m' }
}, { timestamps: true });

module.exports = mongoose.model('StaffMember', staffMemberSchema);
