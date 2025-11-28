const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  category: {
    type: String,
    enum: ['career-guidance', 'resume-feedback', 'job-search', 'skill-development']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});