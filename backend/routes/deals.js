const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deal = require('../models/Deal');
const Submission = require('../models/Submission');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');
const { fastQuery, safeBackground } = require('../utils/mongoFastQuery');

// Public read access for storefront & catalog consumers
router.get('/', async (req, res, next) => {
  const { category, status, submissionStatus, all } = req.query;
  const getFallback = () => store.getDeals(req.query);

  try {
    let query = {};
    if (category && category !== 'All') query.category = category;
    // Default public filtering: Only approved active deals where publishAt <= now and not expired
    if (all === 'true') {
      if (status && status !== 'All') query.status = status;
      if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    } else {
      query.status = { $nin: ['inactive', 'rejected', 'expired'] };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $nin: ['pending_approval', 'rejected'] };
    }

    const mongoQueryFn = () => Deal.find(query).sort({ createdAt: -1 }).lean().then(deals => {
      if (all !== 'true') {
        const now = Date.now();
        return deals.filter(d => {
          if (d.publishAt) {
            const pubTime = new Date(d.publishAt).getTime();
            if (!isNaN(pubTime) && pubTime > now + 60000) return false;
          }
          if (d.expiresAt) {
            const expTime = new Date(d.expiresAt).getTime();
            if (!isNaN(expTime) && expTime < now) return false;
          }
          return true;
        });
      }
      return deals;
    });

    const deals = await fastQuery(mongoQueryFn, getFallback, 200);
    res.json(deals);
  } catch (err) {
    return res.json(getFallback());
  }
});

// Public click tracking for storefront engagements
router.post('/:id/click', async (req, res, next) => {
  try {
    const memoryDeal = store.incrementDealClicks(req.params.id);
    if (mongoose.connection.readyState !== 1) {
      if (!memoryDeal) return res.status(404).json({ message: 'Deal not found' });
      return res.json({ success: true, clicks: memoryDeal.clicks });
    }

    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { _id: req.params.id }
      : { $or: [{ id: req.params.id }, { name: new RegExp(`^${req.params.id}$`, 'i') }] };

    const deal = await Deal.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!deal) {
      if (memoryDeal) return res.json({ success: true, clicks: memoryDeal.clicks });
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json({ success: true, clicks: deal.clicks || 1 });
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// Create deal
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'deal',
      title: req.body.name || req.body.title || 'New Deal',
      store: req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Normal',
      data: req.body,
      user: req.user,
      Model: Deal,
      storeAddMethod: store.addDeal
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// Update deal
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'deal',
      title: req.body.name || req.body.title,
      store: req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Normal',
      updates: req.body,
      user: req.user,
      Model: Deal,
      storeUpdateMethod: store.updateDeal,
      storeGetMethod: store.getDealById
    });
    res.json(result.entity || result);
  } catch (err) { next(err); }
});

// Delete deal
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'deal',
      title: req.body?.name || req.body?.title,
      store: req.body?.store,
      user: req.user,
      Model: Deal,
      storeDeleteMethod: store.deleteDeal,
      storeGetMethod: store.getDealById
    });
    res.json(result);
  } catch (err) { next(err); }
});

// Toggle status
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const toggled = store.toggleDealStatus(req.params.id);
      if (!toggled) return res.status(404).json({ message: 'Deal not found' });
      return res.json(toggled);
    }
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    deal.status = deal.status === 'active' ? 'pending' : 'active';
    await deal.save();
    res.json(deal);
  } catch (err) { next(err); }
});

// Bulk Create Deals (Excel / CSV batch insert with scheduled publishing)
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

      return {
        ...item,
        name: item.name || item.title || `Bulk Deal #${idx + 1}`,
        title: item.title || item.name || `Bulk Deal #${idx + 1}`,
        store: item.store || 'Amazon',
        category: item.category || 'Electronics',
        price: item.price ? (String(item.price).startsWith('₹') ? String(item.price) : `₹${item.price}`) : '₹999',
        originalPrice: item.originalPrice ? (String(item.originalPrice).startsWith('₹') ? String(item.originalPrice) : `₹${item.originalPrice}`) : '',
        discount: item.discount || 'Special Offer',
        status: isExecutive ? 'pending' : (item.status || 'active'),
        submissionStatus,
        opsManagerApproval,
        managerApproval,
        submittedBy: req.user?.email || 'executive@wouchify.com',
        submittedByName: req.user?.name || 'Content Executive',
        publishAt: publishDate,
        expiresAt: expireDate,
        ctaText: item.ctaText || 'GRAB DEAL',
        ctaHref: item.ctaHref || item.link || 'https://amazon.in',
        productImage: item.productImage || item.image || '',
        dealTag: item.dealTag || item.badge || 'Trending',
        isBestSelling: item.isBestSelling === true || item.isBestSelling === 'true' || false,
        sectionPlacement: item.sectionPlacement || 'favourite'
      };
    });

    // 1. Always record in in-memory store immediately (<1ms)
    processedItems.forEach(item => {
      const createdDeal = store.addDeal(item);
      const entityId = String(createdDeal._id || createdDeal.id || item._id || item.id);
      item._id = entityId;
      item.id = entityId;
      if (isExecutive) {
        store.addSubmission({
          entityType: 'deal',
          entityId,
          action: 'create',
          title: item.title || item.name,
          store: item.store,
          category: item.category,
          priority: item.priority || 'Normal',
          submittedBy: req.user?.email || 'executive@wouchify.com',
          submittedByName: req.user?.name || 'Content Executive',
          status: 'Pending Approval',
          notes: 'Bulk imported deal submitted for Manager approval.',
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
        const mongoDocs = processedItems.map(item => {
          const doc = { ...item };
          if (doc._id && !mongoose.Types.ObjectId.isValid(doc._id)) {
            delete doc._id;
          }
          return doc;
        });
        const inserted = await Deal.insertMany(mongoDocs, { ordered: false });
        if (isExecutive && inserted && inserted.length > 0) {
          const submissions = inserted.map(doc => ({
            entityType: 'deal',
            entityId: String(doc._id || doc.id),
            action: 'create',
            title: doc.title || doc.name,
            store: doc.store || '',
            category: doc.category || '',
            priority: doc.priority || 'Normal',
            submittedBy: req.user?.email || 'executive@wouchify.com',
            submittedByName: req.user?.name || 'Content Executive',
            status: 'Pending Approval',
            notes: 'Bulk imported deal submitted for Manager approval.',
            dataSnapshot: doc.toObject ? doc.toObject() : doc
          }));
          await Submission.insertMany(submissions, { ordered: false });
        }
      }
    }, 'Deals Bulk Mongo Insert');
  } catch (err) { next(err); }
});

module.exports = router;
