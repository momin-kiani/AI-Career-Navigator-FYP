// models/CareerTip.js
const mongoose = require('mongoose');

const careerTipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipType: {
    type: String,
    enum: ['skill-development', 'networking', 'interview-prep', 'career-growth', 'industry-trends', 'learning-resource'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  content: String,
  actionItems: [String],
  resources: [{
    type: String,
    title: String,
    url: String
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('CareerTip', careerTipSchema);
