const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StaffMember = require('../models/StaffMember');
const inMemoryStore = require('../services/inMemoryStore');

// @route   GET /api/staff
// @desc    Get all staff members (Executives, Operational Managers, Managers)
router.get('/', async (req, res, next) => {
  try {
    const { role, status, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let results = inMemoryStore.getStaffMembers ? inMemoryStore.getStaffMembers() : [];
      if (role && role !== 'all') {
        results = results.filter(s => s.role === role);
      }
      if (status && status !== 'all') {
        results = results.filter(s => s.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) || 
          (s.email && s.email.toLowerCase().includes(q)) ||
          (s.domain && s.domain.toLowerCase().includes(q))
        );
      }
      return res.json(results);
    }

    const query = {};
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }

    const staff = await StaffMember.find(query).sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    console.warn('Staff route fallback to in-memory store:', err.message);
    let results = inMemoryStore.getStaffMembers ? inMemoryStore.getStaffMembers() : [];
    return res.json(results);
  }
});

// @route   POST /api/staff
// @desc    Manager creates a new Operational Manager or Executive
router.post('/', async (req, res, next) => {
  try {
    const { name, email, role, domain, password, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const staffData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || 'staff123',
      role: role || 'executive',
      domain: domain || (role === 'operational_manager' ? 'Approvals & QA' : 'Deals & Content'),
      status: status || 'Online',
      submissionsToday: 0,
      totalSubmissions: 0,
      approvalRate: '100%',
      rejectionsCount: 0,
      avgTurnaround: '15m'
    };

    if (mongoose.connection.readyState !== 1) {
      const created = inMemoryStore.createStaffMember(staffData);
      return res.status(201).json(created);
    }

    // Check if email already exists
    const existing = await StaffMember.findOne({ email: staffData.email });
    if (existing) {
      return res.status(400).json({ message: 'A staff member with this email already exists.' });
    }

    const newStaff = new StaffMember(staffData);
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    next(err);
  }
});

const getStaffQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { $or: [{ email: id }, { id: id }] };
};

// @route   GET /api/staff/:id
// @desc    Get single staff member by ID
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const staff = inMemoryStore.getStaffMemberById(req.params.id);
      if (!staff) return res.status(404).json({ message: 'Staff member not found' });
      return res.json(staff);
    }

    const staff = await StaffMember.findOne(getStaffQuery(req.params.id));
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(staff);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/staff/:id
// @desc    Update a staff member
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = inMemoryStore.updateStaffMember(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Staff member not found' });
      return res.json(updated);
    }

    const staff = await StaffMember.findOneAndUpdate(
      getStaffQuery(req.params.id),
      { $set: req.body },
      { new: true }
    );
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(staff);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/staff/:id
// @desc    Delete a staff member
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const deleted = inMemoryStore.deleteStaffMember(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Staff member not found' });
      return res.json({ message: 'Staff member deleted successfully' });
    }

    const staff = await StaffMember.findOneAndDelete(getStaffQuery(req.params.id));
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/staff/:id/status
// @desc    Update staff member online/away/offline status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    if (mongoose.connection.readyState !== 1) {
      const updated = inMemoryStore.updateStaffMember(req.params.id, { status });
      if (!updated) return res.status(404).json({ message: 'Staff member not found' });
      return res.json(updated);
    }

    const staff = await StaffMember.findOneAndUpdate(
      getStaffQuery(req.params.id),
      { $set: { status } },
      { new: true }
    );
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(staff);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
