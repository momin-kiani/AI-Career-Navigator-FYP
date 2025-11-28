const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expertise: [String],
  industry: String,
  yearsOfExperience: Number,
  currentRole: String,
  company: String,
  bio: String,
  availableForMentorship: {
    type: Boolean,
    default: true
  },
  mentees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startDate: Date,
    status: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: Date
  }]
});

module.exports = mongoose.model('Mentor', mentorSchema);