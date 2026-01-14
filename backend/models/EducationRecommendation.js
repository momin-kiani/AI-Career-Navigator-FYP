// models/EducationRecommendation.js
const mongoose = require('mongoose');

const educationRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sector: String,
  recommendations: [{
    type: {
      type: String,
      enum: ['course', 'certification', 'degree', 'bootcamp', 'workshop']
    },
    title: String,
    provider: String,
    duration: String,
    cost: {
      amount: Number,
      currency: String
    },
    format: {
      type: String,
      enum: ['online', 'in-person', 'hybrid', 'self-paced']
    },
    skillsCovered: [String],
    relevanceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    reason: String,
    url: String,
    rating: Number,
    completionRate: Number
  }],
  prioritizedBy: {
    type: String,
    enum: ['relevance', 'cost', 'duration', 'rating'],
    default: 'relevance'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
educationRecommendationSchema.index({ userId: 1, sector: 1 });

module.exports = mongoose.model('EducationRecommendation', educationRecommendationSchema);
