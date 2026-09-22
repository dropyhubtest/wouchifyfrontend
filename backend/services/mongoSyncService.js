const mongoose = require('mongoose');
const store = require('./inMemoryStore');

/**
 * Hydrates inMemoryStore with live records from MongoDB Atlas.
 * Runs non-blocking so the server starts serving requests immediately.
 */
async function hydrateStoreFromMongo() {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const Submission = require('../models/Submission');
    const Deal = require('../models/Deal');
    const LootDeal = require('../models/LootDeal');
    const Coupon = require('../models/Coupon');
    const Store = require('../models/Store');
    const CreditCard = require('../models/CreditCard');

    const [mongoSubmissions, mongoDeals, mongoLoots, mongoCoupons, mongoStores, mongoCards] = await Promise.all([
      Submission.find({}).sort({ createdAt: -1 }).limit(200).lean().catch(() => []),
      Deal.find({}).sort({ createdAt: -1 }).limit(200).lean().catch(() => []),
      LootDeal.find({}).sort({ createdAt: -1 }).limit(200).lean().catch(() => []),
      Coupon.find({}).sort({ createdAt: -1 }).limit(200).lean().catch(() => []),
      Store.find({}).sort({ createdAt: -1 }).limit(200).lean().catch(() => []),
      CreditCard.find({}).sort({ createdAt: -1 }).limit(200).lean().catch(() => [])
    ]);

    let updatedCount = 0;

    // 1. Sync Submissions
    if (mongoSubmissions && mongoSubmissions.length > 0) {
      const memSubs = store.getSubmissions({ status: 'all' });
      for (const mSub of mongoSubmissions) {
        const strId = String(mSub._id);
        const existingIdx = memSubs.findIndex(s => String(s._id) === strId || String(s.id) === strId || String(s.id) === String(mSub.id));
        if (existingIdx === -1) {
          memSubs.unshift({
            ...mSub,
            id: mSub.id || strId,
            _id: strId
          });
          updatedCount++;
        } else {
          // If mongo has newer review status, update it
          memSubs[existingIdx] = {
            ...memSubs[existingIdx],
            ...mSub,
            id: memSubs[existingIdx].id || strId,
            _id: strId
          };
        }
      }
    }

    // 2. Sync Deals
    if (mongoDeals && mongoDeals.length > 0) {
      const memDeals = store.getDeals({ all: 'true' });
      for (const mDeal of mongoDeals) {
        const strId = String(mDeal._id);
        const existingIdx = memDeals.findIndex(d => String(d._id) === strId || String(d.id) === strId || (mDeal.name && d.name && d.name.toLowerCase() === mDeal.name.toLowerCase()));
        if (existingIdx === -1) {
          memDeals.unshift({
            ...mDeal,
            id: mDeal.id || strId,
            _id: strId
          });
        } else {
          memDeals[existingIdx] = {
            ...memDeals[existingIdx],
            ...mDeal,
            id: memDeals[existingIdx].id || strId,
            _id: strId
          };
        }
      }
    }

    // 3. Sync Loot Deals
    if (mongoLoots && mongoLoots.length > 0) {
      const memLoots = store.getLootDeals({ all: 'true' });
      for (const mLoot of mongoLoots) {
        const strId = String(mLoot._id);
        const existingIdx = memLoots.findIndex(l => String(l._id) === strId || String(l.id) === strId || (mLoot.title && l.title && l.title.toLowerCase() === mLoot.title.toLowerCase()));
        if (existingIdx === -1) {
          memLoots.unshift({
            ...mLoot,
            id: mLoot.id || strId,
            _id: strId
          });
        } else {
          memLoots[existingIdx] = {
            ...memLoots[existingIdx],
            ...mLoot,
            id: memLoots[existingIdx].id || strId,
            _id: strId
          };
        }
      }
    }

    // 4. Sync Coupons
    if (mongoCoupons && mongoCoupons.length > 0) {
      const memCoupons = store.getCoupons();
      for (const mCoup of mongoCoupons) {
        const strId = String(mCoup._id);
        const existingIdx = memCoupons.findIndex(c => String(c._id) === strId || String(c.id) === strId || (mCoup.code && c.code && c.code.toUpperCase() === mCoup.code.toUpperCase()));
        if (existingIdx === -1) {
          memCoupons.unshift({
            ...mCoup,
            id: mCoup.id || strId,
            _id: strId
          });
        } else {
          memCoupons[existingIdx] = {
            ...memCoupons[existingIdx],
            ...mCoup,
            id: memCoupons[existingIdx].id || strId,
            _id: strId
          };
        }
      }
    }

    // 5. Sync Stores
    if (mongoStores && mongoStores.length > 0) {
      const memStores = store.getStores();
      for (const mStore of mongoStores) {
        const strId = String(mStore._id);
        const existingIdx = memStores.findIndex(s => String(s._id) === strId || String(s.id) === strId || (mStore.slug && s.slug && s.slug.toLowerCase() === mStore.slug.toLowerCase()));
        if (existingIdx === -1) {
          memStores.push({
            ...mStore,
            id: mStore.id || strId,
            _id: strId
          });
        }
      }
    }

    // Persist to dev_store.json
    store.seed();
    console.log(`[MongoSync] Complete: synced ${mongoSubmissions.length} submissions, ${mongoDeals.length} deals, ${mongoLoots.length} loots, ${mongoCoupons.length} coupons, ${mongoStores.length} stores.`);
  } catch (err) {
    console.warn('[MongoSync] Note during hydration:', err.message);
  }
}

module.exports = {
  hydrateStoreFromMongo
};
