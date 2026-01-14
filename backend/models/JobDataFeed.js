// models/JobDataFeed.js
const mongoose = require('mongoose');

const jobDataFeedSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  company: String,
  location: {
    city: String,
    state: String,
    country: String,
    region: String
  },
  industry: String,
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
  },
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  description: String,
  requiredSkills: [String],
  postedDate: Date,
  source: {
    type: String,
    enum: ['api', 'scraper', 'manual']
  },
  sourceUrl: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
jobDataFeedSchema.index({ industry: 1, 'location.country': 1, fetchedAt: -1 });
jobDataFeedSchema.index({ postedDate: -1 });

module.exports = mongoose.model('JobDataFeed', jobDataFeedSchema);
