// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'txt', 'image', 'other'],
    required: true
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['resume', 'cover-letter', 'certificate', 'portfolio', 'reference', 'other'],
    default: 'other'
  },
  description: String,
  tags: [String],
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: Date
});

module.exports = mongoose.model('Document', documentSchema);
