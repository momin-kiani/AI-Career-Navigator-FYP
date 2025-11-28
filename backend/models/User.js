const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profileImage: String,
  phoneNumber: String,
  location: {
    city: String,
    country: String
  },
  linkedInUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  isEmailVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);