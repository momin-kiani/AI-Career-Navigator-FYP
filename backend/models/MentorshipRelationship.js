// models/MentorshipRelationship.js
const mongoose = require('mongoose');

const mentorshipRelationshipSchema = new mongoose.Schema({
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  matchReasons: [String],
  startDate: Date,
  endDate: Date,
  goals: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
mentorshipRelationshipSchema.index({ menteeId: 1, mentorId: 1 }, { unique: true });

module.exports = mongoose.model('MentorshipRelationship', mentorshipRelationshipSchema);
