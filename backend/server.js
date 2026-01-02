// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload dependencies
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-career-navigator')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Import Models
const User = require('./models/User');
const Resume = require('./models/Resume');
const JobApplication = require('./models/JobApplication');
const LinkedInProfile = require('./models/LinkedInProfile');
const CareerAssessment = require('./models/CareerAssessment');
const Mentor = require('./models/Mentor');
const LaborMarketData = require('./models/LaborMarketData');
const ChatHistory = require('./models/ChatHistory');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'api/resume/upload');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// =====================
// USER AUTHENTICATION
// =====================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, firstName, lastName });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// RESUME OPTIMIZATION
// =====================

// Upload Resume (text)
app.post('/api/resume/upload', authenticateToken, async (req, res) => {
  try {
    const { fileName, content } = req.body;

    const calculateATSScore = (content) => {
      let score = 0;
      if (content.toLowerCase().includes('experience')) score += 20;
      if (content.toLowerCase().includes('education')) score += 20;
      if (content.toLowerCase().includes('skills')) score += 20;
      const keywords = ['project', 'manage', 'develop', 'team', 'achieve'];
      keywords.forEach(keyword => { if (content.toLowerCase().includes(keyword)) score += 4; });
      const wordCount = content.split(/\s+/).length;
      if (wordCount >= 200 && wordCount <= 800) score += 20;
      return Math.min(score, 100);
    };

    const atsScore = calculateATSScore(content);

    const resume = new Resume({
      userId: req.user.userId,
      fileName,
      content: { rawText: content },
      atsScore,
      analysis: {
        keywords: ['project management', 'leadership', 'communication'],
        missingKeywords: ['data analysis', 'strategic planning'],
        suggestions: ['Add more quantifiable achievements', 'Include relevant certifications', 'Optimize keywords for ATS'],
        strengths: ['Clear structure', 'Relevant experience'],
        weaknesses: ['Missing metrics', 'Limited skills section']
      }
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Resume (PDF/Word)
app.post('/api/resume/upload-file', authenticateToken, upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    let textContent = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await mammoth.extractRawText({ path: filePath });
      textContent = data.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const calculateATSScore = (content) => {
      let score = 0;
      if (content.toLowerCase().includes('experience')) score += 20;
      if (content.toLowerCase().includes('education')) score += 20;
      if (content.toLowerCase().includes('skills')) score += 20;
      const keywords = ['project', 'manage', 'develop', 'team', 'achieve'];
      keywords.forEach(keyword => { if (content.toLowerCase().includes(keyword)) score += 4; });
      const wordCount = content.split(/\s+/).length;
      if (wordCount >= 200 && wordCount <= 800) score += 20;
      return Math.min(score, 100);
    };

    const atsScore = calculateATSScore(textContent);

    const resume = new Resume({
      userId: req.user.userId,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      content: { rawText: textContent },
      atsScore,
      analysis: {
        keywords: ['project management', 'leadership', 'communication'],
        missingKeywords: ['data analysis', 'strategic planning'],
        suggestions: ['Add more quantifiable achievements', 'Include relevant certifications', 'Optimize keywords for ATS'],
        strengths: ['Clear structure', 'Relevant experience'],
        weaknesses: ['Missing metrics', 'Limited skills section']
      }
    });

    await resume.save();
    res.status(201).json(resume);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Resumes
app.get('/api/resume/list', authenticateToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Resume by ID
app.get('/api/resume/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ... (rest of your server.js routes for bullets, jobs, LinkedIn, assessments, mentorship, market data, chat)
// Keep all previous routes exactly as they were in your original file

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
