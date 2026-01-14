// models/LinkedInReminder.js
const mongoose = require('mongoose');

const linkedInReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  type: {
    type: String,
    enum: ['connection-request', 'follow-up', 'thank-you', 'check-in', 'custom'],
    required: true
  },
  message: String,
  scheduledDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  linkedInUrl: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LinkedInReminder', linkedInReminderSchema);
