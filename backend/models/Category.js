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
  lootCount: { type: Number, default: 0 },
  couponsCount: { type: Number, default: 0 },
  storesCount: { type: Number, default: 0 },
  subcategories: [subcategorySchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  pillar: {
    type: String,
    enum: ['subcategories', 'stores', 'brands', 'banks', 'festivals', 'travelling', 'cities-deals', 'general'],
    default: 'general'
  },
  pillarLabel: { type: String, default: '' },
  pillarColor: { type: String, default: '#6366F1' },
  letter: { type: String, default: '' },
  logo: String,
  image: String,
  heroImage: String,
  href: String,
  destinationHref: String,
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  showOnHome: { type: Boolean, default: true },
  tags: [String],
  sortOrder: { type: Number, default: 0 },
  submissionStatus: { type: String, enum: ['draft', 'pending_approval', 'approved', 'rejected'], default: 'approved' },
  opsManagerApproval: { type: String, default: 'Approved' },
  submittedBy: { type: String, default: 'admin' }
}, { timestamps: true });

categorySchema.index({ pillar: 1, status: 1 });
categorySchema.index({ letter: 1 });

module.exports = mongoose.model('Category', categorySchema);
