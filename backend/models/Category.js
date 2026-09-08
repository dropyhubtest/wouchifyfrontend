const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  description: String,
  color: String,
  subcategories: [{ name: String, slug: String }],
  dealsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
