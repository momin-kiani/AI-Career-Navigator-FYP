// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  module: {
    type: String,
    enum: ['resume', 'jobs', 'network', 'profile', 'linkedin', 'assessment', 'mentorship', 'market', 'chat'],
    required: true
  },
  moduleName: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completedTasks: [{
    taskId: String,
    taskName: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  milestones: [{
    milestoneId: String,
    milestoneName: String,
    achievedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
