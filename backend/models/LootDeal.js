const mongoose = require('mongoose');

const lootDealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  storeName: { type: String, required: true },
  category: { type: String, required: true },
  discount: { type: String, required: true },
  currentPrice: { type: String, required: true },
  originalPrice: { type: String, required: true },
  dealType: { type: String, enum: ['flash', 'exclusive'], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  href: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LootDeal', lootDealSchema);
