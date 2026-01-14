// models/SmartAlert.js
const mongoose = require('mongoose');

const smartAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alertType: {
    type: String,
    enum: ['job-match', 'deadline-approaching', 'market-change', 'skill-demand', 'opportunity', 'reminder'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDismissed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

module.exports = mongoose.model('SmartAlert', smartAlertSchema);
