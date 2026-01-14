// models/IndustryMomentum.js
const mongoose = require('mongoose');

const industryMomentumSchema = new mongoose.Schema({
  industry: {
    type: String,
    required: true
  },
  period: {
    startDate: Date,
    endDate: Date,
    type: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly']
    }
  },
  momentum: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    direction: {
      type: String,
      enum: ['accelerating', 'decelerating', 'stable']
    },
    changeRate: Number, // Percentage change
    hiringVelocity: Number, // Jobs per day/week
    growthTrend: {
      type: String,
      enum: ['rapid-growth', 'steady-growth', 'declining', 'stable']
    }
  },
  metrics: {
    totalPostings: Number,
    newPostings: Number,
    averageTimeToFill: Number, // Days
    skillDemand: [{
      skill: String,
      demandScore: Number,
      trend: {
        type: String,
        enum: ['rising', 'falling', 'stable']
      }
    }],
    salaryTrends: {
      average: Number,
      growth: Number,
      percentile25: Number,
      percentile75: Number
    }
  },
  insights: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
industryMomentumSchema.index({ industry: 1, 'period.endDate': -1 });

module.exports = mongoose.model('IndustryMomentum', industryMomentumSchema);
