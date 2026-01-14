// models/Industry.js
const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  sector: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  jobCount: Number,
  averageSalary: Number,
  growthRate: Number,
  skillRequirements: [{
    skill: String,
    frequency: Number,
    importance: {
      type: String,
      enum: ['critical', 'important', 'nice-to-have']
    },
    trend: {
      type: String,
      enum: ['rising', 'stable', 'declining']
    }
  }],
  topRoles: [{
    role: String,
    count: Number,
    avgSalary: Number
  }],
  regions: [{
    region: String,
    jobCount: Number,
    avgSalary: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Industry', industrySchema);
