const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

router.use(auth);

// Get all transactions
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getTransactions());
    }
    const { type } = req.query;
    let query = {};
    if (type && type !== 'All') query.type = type;
    const txns = await Transaction.find(query).sort({ createdAt: -1 });
    res.json(txns);
  } catch (err) { next(err); }
});

// Create transaction
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addTransaction(req.body);
      return res.status(201).json(created);
    }
    const num = Math.floor(Math.random() * 9000 + 1000);
    const txnId = `TXN-${num}`;
    const newTxn = new Transaction({ transactionId: txnId, status: 'Pending', time: 'Just now', ...req.body });
    await newTxn.save();
    res.status(201).json(newTxn);
  } catch (err) { next(err); }
});

// Approve transaction
router.patch('/:id/approve', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const approved = store.approveTransaction(req.params.id);
      if (!approved) return res.status(404).json({ message: 'Transaction not found' });
      return res.json(approved);
    }
    const txn = await Transaction.findOne({ $or: [{ _id: req.params.id }, { transactionId: req.params.id }] });
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    txn.status = 'Completed';
    await txn.save();
    res.json(txn);
  } catch (err) { next(err); }
});

module.exports = router;
