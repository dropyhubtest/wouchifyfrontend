const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Store = require('../models/Store');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

router.use(auth);

// Get all stores
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getStores());
    }
    const stores = await Store.find().sort({ name: 1 });
    res.json(stores);
  } catch (err) { next(err); }
});

// Create store
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addStore(req.body);
      return res.status(201).json(created);
    }
    const newStore = new Store(req.body);
    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) { next(err); }
});

// Update store
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateStore(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Store not found' });
      return res.json(updated);
    }
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Store not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete store
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteStore(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Store not found' });
      return res.json({ message: 'Store deleted' });
    }
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Store not found' });
    res.json({ message: 'Store deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
