const mongoose = require('mongoose');

const linkedInProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileUrl: String,
  headline: String,
  summary: String,
  completenessScore: {
    type: Number,
    min: 0,
    max: 100
  },
  suggestions: [{
    category: String,
    suggestion: String,
    priority: String,
    completed: Boolean
  }],
  keywords: [String],
  lastAnalyzed: Date,
  posts: [{
    content: String,
    generatedAt: Date,
    used: Boolean
  }]
});

module.exports = mongoose.model('LinkedInProfile', linkedInProfileSchema);