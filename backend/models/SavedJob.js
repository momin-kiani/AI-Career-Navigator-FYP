// models/SavedJob.js
const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: String,
  jobUrl: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['linkedin', 'indeed', 'glassdoor', 'company-website', 'other'],
    default: 'other'
  },
  jobDescription: String,
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  metadata: {
    scrapedAt: Date,
    originalUrl: String,
    platform: String
  },
  summary: {
    keySkills: [String],
    responsibilities: [String],
    requirements: [String],
    summaryText: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedJob', savedJobSchema);
