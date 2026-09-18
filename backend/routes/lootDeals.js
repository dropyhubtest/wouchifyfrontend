const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LootDeal = require('../models/LootDeal');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// Public read access for storefront & catalog consumers
router.get('/', async (req, res, next) => {
  const { dealType, status, submissionStatus, all } = req.query;
  const getFallback = () => {
    let memoryLoot = store.getLootDeals(req.query);
    if (all !== 'true') {
      memoryLoot = memoryLoot.filter(l => l.submissionStatus !== 'pending_approval' && (l.status || 'active') === 'active');
    }
    return memoryLoot;
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(getFallback());
    }
    
    let query = {};
    if (dealType && dealType !== 'All') query.dealType = dealType;

    if (all === 'true') {
      if (status && status !== 'All') query.status = status;
      if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    } else {
      query.status = { $nin: ['inactive', 'rejected', 'expired'] };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $nin: ['pending_approval', 'rejected'] };
    }

    let lootDeals = await LootDeal.find(query).sort({ createdAt: -1 });

    if (all !== 'true') {
      const now = Date.now();
      lootDeals = lootDeals.filter(l => {
        if (l.publishAt) {
          const pubTime = new Date(l.publishAt).getTime();
          if (!isNaN(pubTime) && pubTime > now + 60000) return false;
        }
        if (l.expiresAt) {
          const expTime = new Date(l.expiresAt).getTime();
          if (!isNaN(expTime) && expTime < now) return false;
        }
        return true;
      });
    }

    if (!lootDeals || lootDeals.length === 0) {
      return res.json(getFallback());
    }
    res.json(lootDeals);
  } catch (err) {
    console.warn('Loot deals route fallback to in-memory store:', err.message);
    return res.json(getFallback());
  }
});

// Public click tracking for storefront engagements
router.post('/:id/click', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.incrementLootClicks(req.params.id);
      return res.json({ success: true, clicks: updated?.clicks || 1 });
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ _id: req.params.id }, { id: req.params.id }] } : { id: req.params.id };
    const loot = await LootDeal.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!loot) return res.status(404).json({ message: 'Loot deal not found' });
    res.json({ success: true, clicks: loot.clicks || 1 });
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// Create loot deal
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'loot_deal',
      title: req.body.title || 'New Loot Deal',
      store: req.body.storeName || req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Critical',
      data: req.body,
      user: req.user,
      Model: LootDeal,
      storeAddMethod: store.addLootDeal
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// Update loot deal
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'loot_deal',
      title: req.body.title,
      store: req.body.storeName || req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Critical',
      updates: req.body,
      user: req.user,
      Model: LootDeal,
      storeUpdateMethod: store.updateLootDeal,
      storeGetMethod: store.getLootDealById
    });
    res.json(result.entity || result);
  } catch (err) { next(err); }
});

// Delete loot deal
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'loot_deal',
      title: req.body?.title,
      store: req.body?.storeName || req.body?.store,
      user: req.user,
      Model: LootDeal,
      storeDeleteMethod: store.deleteLootDeal,
      storeGetMethod: store.getLootDealById
    });
    res.json(result);
  } catch (err) { next(err); }
});

// Toggle status
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const toggled = store.toggleLootDealStatus(req.params.id);
      if (!toggled) return res.status(404).json({ message: 'Loot deal not found' });
      return res.json(toggled);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ _id: req.params.id }, { id: req.params.id }] } : { id: req.params.id };
    const lootDeal = await LootDeal.findOne(query);
    if (!lootDeal) return res.status(404).json({ message: 'Loot deal not found' });
    lootDeal.status = lootDeal.status === 'active' ? 'inactive' : 'active';
    await lootDeal.save();
    res.json(lootDeal);
  } catch (err) { next(err); }
});

// Bulk Create Loot Deals (Excel / CSV batch insert with scheduled publishing)
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
        title: item.title || item.name || `Loot Drop #${idx + 1}`,
        name: item.name || item.title || `Loot Drop #${idx + 1}`,
        store: item.store || item.storeName || 'Amazon',
        storeName: item.storeName || item.store || 'Amazon',
        category: item.category || 'Electronics',
        dealType: item.dealType || item.lootType || 'flash',
        lootType: item.lootType || item.dealType || 'flash',
        price: item.price ? (String(item.price).startsWith('₹') ? String(item.price) : `₹${item.price}`) : '₹499',
        originalPrice: item.originalPrice ? (String(item.originalPrice).startsWith('₹') ? String(item.originalPrice) : `₹${item.originalPrice}`) : '',
        discount: item.discount || '80% OFF',
        badge: item.badge || '⚡ HOT DROP',
        status: item.status || 'active',
        submissionStatus: (autoApprove !== false) ? 'approved' : 'pending',
        publishAt: publishDate,
        expiresAt: expireDate,
        link: item.link || item.href || '/deals',
        href: item.href || item.link || '/deals',
        image: item.image || item.productImage || '',
        stockClaimedPercent: Number(item.stockClaimedPercent) || 85,
        rating: item.rating || '4.5 ★'
      };
    });

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        count: processedItems.length,
        items: processedItems
      });
    }

    const inserted = await LootDeal.insertMany(processedItems, { ordered: false });
    res.status(201).json({
      success: true,
      count: inserted.length,
      items: inserted
    });
  } catch (err) { next(err); }
});

module.exports = router;
