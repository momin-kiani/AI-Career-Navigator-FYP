// models/LocalSkillShortage.js
const mongoose = require('mongoose');

const localSkillShortageSchema = new mongoose.Schema({
  region: {
    city: String,
    state: String,
    country: String,
    regionCode: String
  },
  industry: String,
  period: {
    startDate: Date,
    endDate: Date
  },
  shortages: [{
    skill: String,
    demandLevel: {
      type: Number,
      min: 0,
      max: 100
    },
    supplyLevel: {
      type: Number,
      min: 0,
      max: 100
    },
    shortageScore: {
      type: Number,
      min: 0,
      max: 100
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low']
    },
    jobPostings: Number,
    availableCandidates: Number,
    timeToFill: Number, // Days
    salaryPremium: Number, // Percentage above market average
    impact: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  insights: [String],
  recommendations: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
localSkillShortageSchema.index({ 'region.city': 1, 'region.country': 1, industry: 1, 'period.endDate': -1 });

module.exports = mongoose.model('LocalSkillShortage', localSkillShortageSchema);
