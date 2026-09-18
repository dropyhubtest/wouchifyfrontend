const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// Protected routes for support ticketing
router.use(auth);

// GET /api/support-tickets - List tickets with filtering
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getSupportTickets(req.query));
    }

    const { status, priority, category, userEmail, assignedTo } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;
    if (userEmail) query.userEmail = { $regex: userEmail, $options: 'i' };
    if (assignedTo && assignedTo !== 'All') query.assignedTo = { $regex: assignedTo, $options: 'i' };

    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) { 
    console.warn('Support tickets route fallback to in-memory store:', err.message);
    return res.json(store.getSupportTickets(req.query));
  }
});

// GET /api/support-tickets/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ticket = store.getSupportTicketById(req.params.id);
      if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });
      return res.json(ticket);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const ticket = isObjectId 
      ? await SupportTicket.findById(req.params.id) 
      : await SupportTicket.findOne({ ticketId: req.params.id });

    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });
    res.json(ticket);
  } catch (err) { next(err); }
});

// POST /api/support-tickets - Create new ticket
router.post('/', async (req, res, next) => {
  try {
    const num = Math.floor(Math.random() * 900 + 100);
    const ticketId = req.body.ticketId || `TICK-${num}`;
    const payload = {
      ticketId,
      ...req.body
    };

    if (mongoose.connection.readyState !== 1) {
      const created = store.addSupportTicket(payload);
      return res.status(201).json(created);
    }

    const ticket = new SupportTicket(payload);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) { next(err); }
});

// POST /api/support-tickets/:id/reply - Post reply message to thread
router.post('/:id/reply', async (req, res, next) => {
  try {
    const { sender = 'support', senderName = 'Support Agent', text, time } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const newMsg = {
      sender,
      senderName,
      time: time || new Date().toISOString(),
      text
    };

    if (mongoose.connection.readyState !== 1) {
      const updated = store.replySupportTicket(req.params.id, newMsg);
      if (!updated) return res.status(404).json({ message: 'Support ticket not found' });
      return res.json(updated);
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const ticket = isObjectId 
      ? await SupportTicket.findById(req.params.id) 
      : await SupportTicket.findOne({ ticketId: req.params.id });

    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });

    ticket.messages.push(newMsg);
    if (sender === 'support' && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }
    await ticket.save();
    res.json(ticket);
  } catch (err) { next(err); }
});

// PATCH /api/support-tickets/:id/status - Update ticket status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateSupportTicketStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: 'Support ticket not found' });
      return res.json(updated);
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const ticket = isObjectId 
      ? await SupportTicket.findById(req.params.id) 
      : await SupportTicket.findOne({ ticketId: req.params.id });

    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });

    ticket.status = status;
    await ticket.save();
    res.json(ticket);
  } catch (err) { next(err); }
});

// PUT /api/support-tickets/:id - Update ticket
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateSupportTicket(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Support ticket not found' });
      return res.json(updated);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const updated = isObjectId
      ? await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      : await SupportTicket.findOneAndUpdate({ ticketId: req.params.id }, req.body, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ message: 'Support ticket not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/support-tickets/:id - Delete ticket
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteSupportTicket(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Support ticket not found' });
      return res.json({ message: 'Support ticket deleted' });
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const deleted = isObjectId
      ? await SupportTicket.findByIdAndDelete(req.params.id)
      : await SupportTicket.findOneAndDelete({ ticketId: req.params.id });

    if (!deleted) return res.status(404).json({ message: 'Support ticket not found' });
    res.json({ message: 'Support ticket deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
