const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Store = require('../models/Store');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

router.use(auth);

// Get pending stores (Ops Manager queue)
router.get('/pending', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getStores().filter(s => s.opsManagerApproval === 'Pending'));
    }
    const stores = await Store.find({ opsManagerApproval: 'Pending' }).sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) { next(err); }
});

// Get manager pending stores (Manager queue)
router.get('/manager-pending', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getStores().filter(s => s.opsManagerApproval === 'Approved' && s.managerApproval === 'Pending'));
    }
    const stores = await Store.find({ opsManagerApproval: 'Approved', managerApproval: 'Pending' }).sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) { next(err); }
});

// Get all stores (with optional status filter)
router.get('/', async (req, res, next) => {
  const { status, public: isPublic } = req.query;
  try {
    if (mongoose.connection.readyState !== 1) {
      let memoryStores = store.getStores();
      if (status) {
        memoryStores = memoryStores.filter(s => s.status === status);
      }
      if (isPublic === 'true') {
        memoryStores = memoryStores.filter(s => s.opsManagerApproval === 'Approved' && s.managerApproval === 'Approved');
      }
      return res.json(memoryStores);
    }
    const query = status ? { status } : {};
    if (isPublic === 'true') {
      query.opsManagerApproval = 'Approved';
      query.managerApproval = 'Approved';
    }
    const stores = await Store.find(query).sort({ name: 1 });
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
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A store with this exact name already exists. Please edit the existing store instead.' });
    }
    next(err);
  }
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

// Approve store
router.patch('/:id/approve/:role', async (req, res, next) => {
  const { role } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const approved = store.approveStore(req.params.id, role);
      if (!approved) return res.status(404).json({ message: 'Store not found' });
      return res.json(approved);
    }
    const storeDoc = await Store.findById(req.params.id);
    if (!storeDoc) return res.status(404).json({ message: 'Store not found' });
    
    if (role === 'opsManager') storeDoc.opsManagerApproval = 'Approved';
    if (role === 'manager') storeDoc.managerApproval = 'Approved';
    
    if (storeDoc.opsManagerApproval === 'Approved' && storeDoc.managerApproval === 'Approved') {
      storeDoc.status = 'active';
    }
    
    await storeDoc.save();
    res.json(storeDoc);
  } catch (err) { next(err); }
});

// Reject store
router.patch('/:id/reject/:role', async (req, res, next) => {
  const { role } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const rejected = store.rejectStore(req.params.id, role);
      if (!rejected) return res.status(404).json({ message: 'Store not found' });
      return res.json(rejected);
    }
    const storeDoc = await Store.findById(req.params.id);
    if (!storeDoc) return res.status(404).json({ message: 'Store not found' });
    
    if (role === 'opsManager') storeDoc.opsManagerApproval = 'Rejected';
    if (role === 'manager') storeDoc.managerApproval = 'Rejected';
    
    storeDoc.status = 'rejected';
    
    await storeDoc.save();
    res.json(storeDoc);
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
