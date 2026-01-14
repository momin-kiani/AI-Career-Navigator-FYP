// models/RegionalHiring.js
const mongoose = require('mongoose');

const regionalHiringSchema = new mongoose.Schema({
  region: {
    country: String,
    state: String,
    city: String,
    regionCode: String
  },
  industry: String,
  period: {
    startDate: Date,
    endDate: Date,
    type: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    }
  },
  statistics: {
    totalOpenings: Number,
    newPostings: Number,
    averageSalary: Number,
    salaryGrowth: Number, // Percentage
    hiringRate: Number, // Percentage
    competitionIndex: Number, // 0-100
    topCompanies: [{
      company: String,
      openings: Number
    }],
    topRoles: [{
      role: String,
      count: Number,
      avgSalary: Number
    }]
  },
  trends: {
    growthDirection: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable']
    },
    growthRate: Number,
    marketHealth: {
      type: String,
      enum: ['excellent', 'good', 'moderate', 'poor']
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
regionalHiringSchema.index({ 'region.country': 1, 'region.city': 1, industry: 1, 'period.endDate': -1 });

module.exports = mongoose.model('RegionalHiring', regionalHiringSchema);
