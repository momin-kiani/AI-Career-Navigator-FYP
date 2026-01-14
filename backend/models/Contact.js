// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: String,
  company: String,
  email: String,
  phone: String,
  linkedInUrl: String,
  location: String,
  tags: [String], // recruiter, hiring-manager, mentor, colleague, etc.
  notes: String,
  communicationLog: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['email', 'call', 'meeting', 'linkedin', 'other']
    },
    subject: String,
    notes: String,
    followUpDate: Date
  }],
  lastContactDate: Date,
  nextFollowUpDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Contact', contactSchema);
