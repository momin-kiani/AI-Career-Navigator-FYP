const mongoose = require('mongoose');

const laborMarketDataSchema = new mongoose.Schema({
  jobTitle: String,
  industry: String,
  region: {
    country: String,
    city: String
  },
  demandScore: {
    type: Number,
    min: 0,
    max: 100
  },
  hiringMomentum: String,
  salaryRange: {
    min: Number,
    max: Number,
    median: Number,
    currency: String
  },
  requiredSkills: [{
    skill: String,
    frequency: Number,
    trending: Boolean
  }],
  growthProjection: {
    oneYear: Number,
    threeYear: Number,
    fiveYear: Number
  },
  competitorData: [{
    company: String,
    openings: Number,
    hiringRate: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LaborMarketData', laborMarketDataSchema);