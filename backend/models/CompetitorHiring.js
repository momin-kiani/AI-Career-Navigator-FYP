// models/CompetitorHiring.js
const mongoose = require('mongoose');

const competitorHiringSchema = new mongoose.Schema({
  targetCompany: String,
  industry: String,
  region: {
    country: String,
    city: String
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  hiringActivity: {
    totalOpenings: Number,
    newPostings: Number,
    roles: [{
      title: String,
      count: Number,
      level: String,
      department: String
    }],
    departments: [{
      department: String,
      openings: Number,
      growth: Number
    }],
    hiringVelocity: Number,
    averageTimeToFill: Number
  },
  salaryInsights: {
    averageSalary: Number,
    salaryRange: {
      min: Number,
      max: Number
    },
    competitivePosition: {
      type: String,
      enum: ['above-market', 'at-market', 'below-market']
    }
  },
  skillRequirements: [{
    skill: String,
    frequency: Number,
    priority: String
  }],
  trends: {
    hiringTrend: {
      type: String,
      enum: ['expanding', 'contracting', 'stable']
    },
    focusAreas: [String],
    growthAreas: [String]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
competitorHiringSchema.index({ targetCompany: 1, industry: 1, 'period.endDate': -1 });

module.exports = mongoose.model('CompetitorHiring', competitorHiringSchema);
