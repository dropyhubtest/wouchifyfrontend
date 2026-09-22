const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Store = require('../models/Store');
const Submission = require('../models/Submission');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');
const { fastQuery, safeBackground } = require('../utils/mongoFastQuery');

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
    let query = {};
    if (status && status !== 'all') query.status = status;

    if (all !== 'true') {
      query.status = { $nin: ['rejected', 'pending', 'inactive'] };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $nin: ['pending_approval', 'rejected'] };
    }

    const mongoQueryFn = () => Store.find(query).sort({ name: 1 }).lean().then(stores => {
      if (all !== 'true') {
        const now = Date.now();
        return stores.filter(s => {
          if (s.publishAt) {
            const pubTime = new Date(s.publishAt).getTime();
            if (!isNaN(pubTime) && pubTime > now + 60000) return false;
          }
          return true;
        });
      }
      return stores;
    });

    const stores = await fastQuery(mongoQueryFn, getFallback, 200);
    res.json(stores || []);
  } catch (err) {
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

    const isExecutive = req.user?.role === 'executive' || autoApprove === false;
    const submissionStatus = isExecutive ? 'pending_approval' : 'approved';
    const status = isExecutive ? 'pending' : 'active';
    const opsManagerApproval = isExecutive ? 'Pending' : 'Approved';
    const managerApproval = isExecutive ? 'Pending' : 'Approved';

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
        status: isExecutive ? 'pending' : (item.status || 'active'),
        submissionStatus,
        opsManagerApproval,
        managerApproval,
        submittedBy: req.user?.email || 'executive@wouchify.com',
        submittedByName: req.user?.name || 'Content Executive',
        publishAt: publishDate,
        expiresAt: expireDate
      };
    });

    // 1. Always record in in-memory store immediately (<1ms)
    processedItems.forEach(item => {
      const createdStore = store.addStore(item);
      const entityId = String(createdStore._id || createdStore.id || item._id || item.id);
      item._id = entityId;
      item.id = entityId;
      if (isExecutive) {
        store.addSubmission({
          entityType: 'store',
          entityId,
          action: 'create',
          title: item.name,
          store: item.name,
          category: item.category,
          priority: item.priority || 'Normal',
          submittedBy: req.user?.email || 'executive@wouchify.com',
          submittedByName: req.user?.name || 'Content Executive',
          status: 'Pending Approval',
          notes: 'Bulk imported store submitted for Manager approval.',
          dataSnapshot: { ...item, _id: entityId, id: entityId }
        });
      }
    });

    // 2. Respond immediately to user so UI never hangs
    res.status(201).json({
      success: true,
      staged: isExecutive,
      count: processedItems.length,
      items: processedItems
    });

    // 3. Persist to MongoDB in background
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1) {
        const results = [];
        for (const item of processedItems) {
          try {
            const mongoItem = { ...item };
            if (mongoItem._id && !mongoose.Types.ObjectId.isValid(mongoItem._id)) {
              delete mongoItem._id;
            }
            const storeDoc = await Store.findOneAndUpdate(
              { name: new RegExp(`^${item.name}$`, 'i') },
              { $set: mongoItem },
              { upsert: true, new: true }
            );
            results.push(storeDoc);
          } catch (e) {}
        }
        if (isExecutive && results.length > 0) {
          const submissions = results.map(doc => ({
            entityType: 'store',
            entityId: String(doc._id || doc.id),
            action: 'create',
            title: doc.name,
            store: doc.name || '',
            category: doc.category || '',
            priority: doc.priority || 'Normal',
            submittedBy: req.user?.email || 'executive@wouchify.com',
            submittedByName: req.user?.name || 'Content Executive',
            status: 'Pending Approval',
            notes: 'Bulk imported store submitted for Manager approval.',
            dataSnapshot: doc.toObject ? doc.toObject() : doc
          }));
          await Submission.insertMany(submissions, { ordered: false });
        }
      }
    }, 'Stores Bulk Mongo Upsert');
  } catch (err) { next(err); }
});

module.exports = router;
