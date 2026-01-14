// models/JobSearchHistory.js
const mongoose = require('mongoose');

const jobSearchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    keywords: [String],
    location: String,
    jobType: String,
    experienceLevel: String,
    salaryRange: {
      min: Number,
      max: Number
    }
  },
  suggestions: [{
    jobTitle: String,
    company: String,
    location: String,
    matchScore: Number,
    reasons: [String],
    jobUrl: String
  }],
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobSearchHistory', jobSearchHistorySchema);
