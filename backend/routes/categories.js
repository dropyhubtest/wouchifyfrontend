const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

router.use(auth);

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCategories());
    }
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) { next(err); }
});

// Create category
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addCategory(req.body);
      return res.status(201).json(created);
    }
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) { next(err); }
});

// Update category
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateCategory(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Category not found' });
      return res.json(updated);
    }
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete category
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteCategory(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Category not found' });
      return res.json({ message: 'Category deleted' });
    }
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
