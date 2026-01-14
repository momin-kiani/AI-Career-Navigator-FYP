// models/AssessmentQuestion.js
const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['personality', 'skills', 'interests', 'values', 'workstyle'],
    required: true
  },
  trait: {
    type: String,
    required: true
    // Maps to personality traits: analytical, creative, leadership, detail-oriented, communicative, etc.
  },
  weight: {
    type: Number,
    default: 1,
    min: 0.5,
    max: 2
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);
