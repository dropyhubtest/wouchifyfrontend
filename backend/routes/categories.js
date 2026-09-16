const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// Get all categories (Public & Executive)
router.get('/', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    if (mongoose.connection.readyState !== 1) {
      let list = store.getCategories();
      if (status && status !== 'all') {
        list = list.filter(c => (c.status || 'active').toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
      }
      return res.json(list);
    }

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });
    if (categories.length === 0 && !search && (!status || status === 'all')) {
      const defaultCats = store.getCategories();
      try {
        await Category.insertMany(defaultCats);
        categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });
      } catch {
        return res.json(defaultCats);
      }
    }
    if (categories.length === 0) {
      return res.json(store.getCategories());
    }
    res.json(categories);
  } catch (err) { next(err); }
});

// Get category by ID or slug
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const cat = store.getCategoryById(id);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      return res.json(cat);
    }

    let cat = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cat = await Category.findById(id);
    }
    if (!cat) {
      cat = await Category.findOne({ slug: id });
    }
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) { next(err); }
});

// Protected mutation routes
router.use(auth);

// Create category
router.post('/', async (req, res, next) => {
  try {
    const categoryData = {
      ...req.body,
      count: req.body.count || req.body.dealsCount || 0,
      dealsCount: req.body.dealsCount || req.body.count || 0
    };

    if (mongoose.connection.readyState !== 1) {
      const created = store.addCategory(categoryData);
      return res.status(201).json(created);
    }
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json(category);
  } catch (err) { next(err); }
});

// Update category
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateCategory(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Category not found' });
      return res.json(updated);
    }

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }
    if (!updated) {
      updated = await Category.findOneAndUpdate({ slug: id }, req.body, { new: true, runValidators: true });
    }

    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// Toggle category status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const cat = store.getCategoryById(id);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      const newStatus = cat.status === 'active' ? 'inactive' : 'active';
      const updated = store.updateCategory(id, { status: newStatus });
      return res.json(updated);
    }

    let cat = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cat = await Category.findById(id);
    }
    if (!cat) {
      cat = await Category.findOne({ slug: id });
    }
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    cat.status = cat.status === 'active' ? 'inactive' : 'active';
    await cat.save();
    res.json(cat);
  } catch (err) { next(err); }
});

// Delete category
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteCategory(id);
      if (!ok) return res.status(404).json({ message: 'Category not found' });
      return res.json({ message: 'Category deleted' });
    }

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Category.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Category.findOneAndDelete({ slug: id });
    }

    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
