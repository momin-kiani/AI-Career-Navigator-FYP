// models/CareerTransition.js
const mongoose = require('mongoose');

const careerTransitionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentRole: String,
  targetRole: String,
  currentIndustry: String,
  targetIndustry: String,
  transitionType: {
    type: String,
    enum: ['role-change', 'industry-change', 'career-pivot', 'promotion', 'entrepreneurship'],
    required: true
  },
  guidance: {
    steps: [{
      stepNumber: Number,
      title: String,
      description: String,
      estimatedTime: String,
      resources: [String],
      completed: {
        type: Boolean,
        default: false
      }
    }],
    skillGaps: [{
      skill: String,
      currentLevel: Number,
      requiredLevel: Number,
      priority: String
    }],
    recommendations: [String],
    timeline: {
      estimatedMonths: Number,
      milestones: [{
        milestone: String,
        targetDate: Date,
        completed: Boolean
      }]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('CareerTransition', careerTransitionSchema);
