const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  slug: { type: String, required: true },
  itemCount: { type: Number, default: 0 }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#FF6B6B' },
  bgColor: { type: String, default: '#FFE3E3' },
  textColor: { type: String, default: '#D92626' },
  count: { type: Number, default: 0 },
  dealsCount: { type: Number, default: 0 },
  subcategories: [subcategorySchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  image: String,
  heroImage: String,
  href: String,
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
