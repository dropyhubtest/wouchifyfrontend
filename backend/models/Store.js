const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  logo: String,
  reward: String,
  href: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
