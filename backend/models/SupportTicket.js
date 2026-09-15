const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    enum: ['user', 'support', 'system'], 
    default: 'user' 
  },
  senderName: { type: String, default: '' },
  time: { type: String, default: () => new Date().toISOString() },
  text: { type: String, required: true }
}, { _id: false });

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  category: { type: String, default: 'General' },
  subject: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Urgent', 'High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  orderId: { type: String, default: '' },
  disputeAmount: { type: String, default: '' },
  assignedTo: { type: String, default: '' },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
