const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deal = require('../models/Deal');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// Public read access for storefront & catalog consumers
router.get('/', async (req, res, next) => {
  const { category, status, submissionStatus, all } = req.query;
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getDeals(req.query));
    }

    let query = {};
    if (category && category !== 'All') query.category = category;
    // Default public filtering: Only approved active deals where publishAt <= now and not expired
    if (all === 'true') {
      if (status && status !== 'All') query.status = status;
      if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    } else {
      query.status = status || 'active';
      query.submissionStatus = submissionStatus ? submissionStatus : { $in: ['approved', undefined] };
      query.publishAt = { $lte: new Date() };
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } }
      ];
    }

    const deals = await Deal.find(query).sort({ createdAt: -1 });
    if (!deals || deals.length === 0) {
      return res.json(store.getDeals(req.query));
    }
    res.json(deals);
  } catch (err) {
    console.warn('Deals route fallback to in-memory store:', err.message);
    return res.json(store.getDeals(req.query));
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
        status: item.status || 'active',
        submissionStatus: (autoApprove !== false) ? 'approved' : 'pending',
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

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        count: processedItems.length,
        items: processedItems
      });
    }

    const inserted = await Deal.insertMany(processedItems, { ordered: false });
    res.status(201).json({
      success: true,
      count: inserted.length,
      items: inserted
    });
  } catch (err) { next(err); }
});

module.exports = router;
