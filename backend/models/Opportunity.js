// models/Opportunity.js
const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: String,
  type: {
    type: String,
    enum: ['job', 'project', 'collaboration', 'referral', 'other'],
    default: 'job'
  },
  description: String,
  status: {
    type: String,
    enum: ['exploring', 'applied', 'in-progress', 'closed', 'lost'],
    default: 'exploring'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  deadline: Date,
  value: {
    amount: Number,
    currency: String
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }],
  notes: String,
  reminders: [{
    date: Date,
    message: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
