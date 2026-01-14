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
    required: function() {
      return !this.googleId && !this.linkedInId;
    }
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  googleId: String,
  linkedInId: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
  },
  role: {
    type: String,
    enum: ['user', 'student', 'teacher', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);