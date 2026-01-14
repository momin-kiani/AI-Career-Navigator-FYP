// models/MentorProgress.js
const mongoose = require('mongoose');

const mentorProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  },
  relationshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipRelationship'
  },
  entryType: {
    type: String,
    enum: ['milestone', 'goal', 'skill-development', 'feedback', 'meeting', 'reflection'],
    required: true
  },
  title: String,
  description: String,
  progress: {
    type: Number,
    min: 0,
    max: 100
  },
  mentorFeedback: {
    feedback: String,
    providedAt: Date,
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor'
    }
  },
  attachments: [{
    type: String,
    url: String
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MentorProgress', mentorProgressSchema);
