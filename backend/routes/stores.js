const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Store = require('../models/Store');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// 1. PUBLIC: Get all stores (with optional status filter)
router.get('/', async (req, res, next) => {
  const { status, public: isPublic, all } = req.query;
  const getFallback = () => {
    let memoryStores = store.getStores();
    if (status && status !== 'all') {
      memoryStores = memoryStores.filter(s => s.status === status);
    }
    if (all !== 'true') {
      memoryStores = memoryStores.filter(s => s.submissionStatus !== 'pending_approval' && s.opsManagerApproval !== 'Rejected');
    }
    return memoryStores;
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(getFallback());
    }

    let query = {};
    if (status && status !== 'all') query.status = status;

    if (all !== 'true') {
      query.status = { $nin: ['rejected', 'pending', 'inactive'] };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $nin: ['pending_approval', 'rejected'] };
    }

    let stores = await Store.find(query).sort({ name: 1 });

    if (all !== 'true') {
      const now = Date.now();
      stores = stores.filter(s => {
        if (s.publishAt) {
          const pubTime = new Date(s.publishAt).getTime();
          if (!isNaN(pubTime) && pubTime > now + 60000) return false;
        }
        return true;
      });
    }

    if (!stores || stores.length === 0) {
      return res.json(getFallback());
    }
    res.json(stores);
  } catch (err) {
    console.warn('Stores route fallback to in-memory store:', err.message);
    return res.json(getFallback());
  }
});

// 2. PUBLIC: Track Store Click
router.post('/:id/click', async (req, res, next) => {
  try {
    const target = req.params.id;
    if (mongoose.connection.readyState !== 1) {
      const updated = store.incrementStoreClicks(target);
      return res.json({ success: true, clicks: updated?.clicks || 1 });
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(target);
    const query = isObjectId 
      ? { $or: [{ _id: target }, { id: target }, { slug: target }, { name: new RegExp(`^${target}$`, 'i') }] }
      : { $or: [{ id: target }, { slug: target }, { name: new RegExp(`^${target}$`, 'i') }] };
    
    const updatedStore = await Store.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    res.json({ success: true, clicks: updatedStore?.clicks || 1 });
  } catch (err) { next(err); }
});

// 3. PROTECTED: Administrative queues & mutations
router.use(auth);

// Get pending stores (Ops Manager queue)
router.get('/pending', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getStores().filter(s => s.opsManagerApproval === 'Pending' || s.submissionStatus === 'pending_approval'));
    }
    const stores = await Store.find({ $or: [{ opsManagerApproval: 'Pending' }, { submissionStatus: 'pending_approval' }] }).sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) { next(err); }
});

// Create store
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'store',
      title: req.body.name || 'New Store',
      store: req.body.name,
      category: req.body.category,
      priority: req.body.priority || 'Normal',
      data: req.body,
      user: req.user,
      Model: Store,
      storeAddMethod: store.addStore
    });
    res.status(201).json(result.entity || result);
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
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'store',
      title: req.body.name,
      store: req.body.name,
      category: req.body.category,
      priority: req.body.priority || 'Normal',
      updates: req.body,
      user: req.user,
      Model: Store,
      storeUpdateMethod: store.updateStore,
      storeGetMethod: store.getStoreById
    });
    res.json(result.entity || result);
  } catch (err) { next(err); }
});

// Delete store
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'store',
      title: req.body?.name,
      store: req.body?.name,
      user: req.user,
      Model: Store,
      storeDeleteMethod: store.deleteStore,
      storeGetMethod: store.getStoreById
    });
    res.json(result);
  } catch (err) { next(err); }
});

// Bulk Create Stores (Excel / CSV batch insert with scheduled publishing)
router.post('/bulk', async (req, res, next) => {
  try {
    const { items, autoApprove } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }

    const processedItems = items.map((item, idx) => {
      const now = new Date();
      let publishDate = item.publishAt ? new Date(item.publishAt) : now;
      if (isNaN(publishDate.getTime())) publishDate = now;

      let expireDate = item.expiresAt ? new Date(item.expiresAt) : null;
      if (expireDate && isNaN(expireDate.getTime())) expireDate = null;

      const storeName = (item.name || item.storeName || `Store ${idx + 1}`).trim();

      return {
        ...item,
        name: storeName,
        category: item.category || 'Shopping',
        reward: item.reward || item.cashbackRate || 'Up to 5% Cashback',
        logo: item.logo || '',
        href: item.href || item.affiliateUrl || `/stores#${storeName.toLowerCase().replace(/\s+/g, '-')}`,
        status: item.status || 'active',
        opsManagerApproval: (autoApprove !== false) ? 'Approved' : 'Pending',
        managerApproval: (autoApprove !== false) ? 'Approved' : 'Pending',
        publishAt: publishDate,
        expiresAt: expireDate
      };
    });

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        count: processedItems.length,
        items: processedItems
      });
    }

    const results = [];
    for (const item of processedItems) {
      try {
        const storeDoc = await Store.findOneAndUpdate(
          { name: new RegExp(`^${item.name}$`, 'i') },
          { $set: item },
          { upsert: true, new: true }
        );
        results.push(storeDoc);
      } catch (e) {
        console.warn('Store bulk upsert error for', item.name, e.message);
      }
    }

    res.status(201).json({
      success: true,
      count: results.length,
      items: results
    });
  } catch (err) { next(err); }
});

module.exports = router;
