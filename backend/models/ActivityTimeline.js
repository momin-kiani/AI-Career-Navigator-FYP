// models/ActivityTimeline.js
const mongoose = require('mongoose');

const activityTimelineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['resume-upload', 'job-application', 'assessment-completed', 'profile-update', 'contact-added', 'badge-earned', 'document-upload', 'linkedin-post', 'other'],
    required: true
  },
  activityName: {
    type: String,
    required: true
  },
  description: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient timeline queries
activityTimelineSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityTimeline', activityTimelineSchema);
