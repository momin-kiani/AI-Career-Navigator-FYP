// models/ProfileBadge.js
const mongoose = require('mongoose');

const profileBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeType: {
    type: String,
    enum: ['profile-optimized', 'linkedin-complete', 'resume-optimized', 'network-active', 'career-ready'],
    required: true
  },
  badgeName: {
    type: String,
    required: true
  },
  description: String,
  criteria: {
    profileCompleteness: Number,
    linkedInScore: Number,
    resumeATSScore: Number,
    networkContacts: Number,
    other: Object
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('ProfileBadge', profileBadgeSchema);
