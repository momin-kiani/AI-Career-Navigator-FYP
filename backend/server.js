// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
// CORS configuration - explicitly allow frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload dependencies
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Email service (optional - requires nodemailer)
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.log('Nodemailer not installed. Email functionality will be limited.');
}

// Email transporter setup
let transporter;
if (nodemailer && process.env.EMAIL_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Email helper function
const sendPasswordResetEmail = async (email, resetUrl) => {
  if (!transporter) {
    console.log('Email service not configured. Reset URL:', resetUrl);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@careernavigator.com',
      to: email,
      subject: 'Password Reset Request - AI Career Navigator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

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
const AssessmentQuestion = require('./models/AssessmentQuestion');
const CareerRole = require('./models/CareerRole');
const SkillRoleMapping = require('./models/SkillRoleMapping');
const JobDescription = require('./models/JobDescription');
const SavedJob = require('./models/SavedJob');
const Contact = require('./models/Contact');
const Opportunity = require('./models/Opportunity');
const LinkedInReminder = require('./models/LinkedInReminder');
const ProfileBadge = require('./models/ProfileBadge');
const Progress = require('./models/Progress');
const Document = require('./models/Document');
const ActivityTimeline = require('./models/ActivityTimeline');
const ResourceLibrary = require('./models/ResourceLibrary');
const ResumeFeedback = require('./models/ResumeFeedback');
const JobSearchHistory = require('./models/JobSearchHistory');
const CareerTip = require('./models/CareerTip');
const SmartAlert = require('./models/SmartAlert');
const Mentor = require('./models/Mentor');
const MentorshipRelationship = require('./models/MentorshipRelationship');
const CareerTransition = require('./models/CareerTransition');
const GrowthRoadmap = require('./models/GrowthRoadmap');
const MentorProgress = require('./models/MentorProgress');
const LaborMarketData = require('./models/LaborMarketData');
const JobDataFeed = require('./models/JobDataFeed');
const RegionalHiring = require('./models/RegionalHiring');
const IndustryMomentum = require('./models/IndustryMomentum');
const CompetitorHiring = require('./models/CompetitorHiring');
const DemandForecast = require('./models/DemandForecast');
const Industry = require('./models/Industry');
const SkillGap = require('./models/SkillGap');
const EducationRecommendation = require('./models/EducationRecommendation');
const EmployerStrategy = require('./models/EmployerStrategy');
const ExportReport = require('./models/ExportReport');
const LocalSkillShortage = require('./models/LocalSkillShortage');
const SalaryBenchmark = require('./models/SalaryBenchmark');
const EmploymentOutcome = require('./models/EmploymentOutcome');
const RegionalTrainingProgram = require('./models/RegionalTrainingProgram');
const Test = require('./models/Test');
const Question = require('./models/Question');
const StudentAttempt = require('./models/StudentAttempt');
const TestAnalytics = require('./models/TestAnalytics');
const AIQuestionTemplate = require('./models/AIQuestionTemplate');
const ChatHistory = require('./models/ChatHistory');

// Import Services
const assessmentLogic = require('./services/assessmentLogic');
const resumeOptimization = require('./services/resumeOptimization');
const jobManagement = require('./services/jobManagement');
const communicationAI = require('./services/communicationAI');
const profileOptimization = require('./services/profileOptimization');
const careerResources = require('./services/careerResources');
const careerAssistant = require('./services/careerAssistant');
const mentorshipAI = require('./services/mentorshipAI');
const marketAnalytics = require('./services/marketAnalytics');
const industryInsights = require('./services/industryInsights');
const regionalInsights = require('./services/regionalInsights');
const testService = require('./services/testService');

// Multer setup for file uploads
const resumeStorage = multer.diskStorage({
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

const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'api/documents/upload');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: resumeStorage });
const documentUpload = multer({ storage: documentStorage });

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

// Validation Helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// =====================
// USER AUTHENTICATION
// =====================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Input Validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    if (!firstName || !validateName(firstName)) {
      return res.status(400).json({ error: 'First name must be at least 2 characters long' });
    }
    if (!lastName || !validateName(lastName)) {
      return res.status(400).json({ error: 'Last name must be at least 2 characters long' });
    }

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
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check if user has a password (not social login only)
    if (!user.password) {
      return res.status(401).json({ error: 'Please sign in using your social account' });
    }

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

// Social Login - Google
app.post('/api/auth/social-login', async (req, res) => {
  try {
    const { provider, accessToken, email, firstName, lastName, profileImage } = req.body;

    // Input Validation
    if (!provider || !['google', 'linkedin'].includes(provider.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid provider. Use "google" or "linkedin"' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!firstName || !validateName(firstName)) {
      return res.status(400).json({ error: 'First name is required' });
    }
    if (!lastName || !validateName(lastName)) {
      return res.status(400).json({ error: 'Last name is required' });
    }

    const providerField = provider.toLowerCase() === 'google' ? 'googleId' : 'linkedInId';
    const providerId = accessToken; // In production, verify token and extract ID

    // Find user by email or provider ID
    let user = await User.findOne({ 
      $or: [
        { email },
        { [providerField]: providerId }
      ]
    });

    if (user) {
      // Update provider ID if not set
      if (!user[providerField]) {
        user[providerField] = providerId;
        if (profileImage) user.profileImage = profileImage;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        email,
        firstName,
        lastName,
        [providerField]: providerId,
        profileImage: profileImage || '',
        isEmailVerified: true
      });
      await user.save();
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered with different provider' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Input Validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If that email exists, a password reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ message: 'If that email exists, a password reset link has been sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Input Validation
    if (!token) {
      return res.status(400).json({ error: 'Reset token is required' });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
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
// PROFILE OPTIMIZATION
// =====================

// Get Profile Completeness Score
app.get('/api/profile/score', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const linkedInProfile = await LinkedInProfile.findOne({ userId: req.user.userId });
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    
    const completeness = profileOptimization.calculateProfileCompleteness(user, linkedInProfile, resume);
    res.json(completeness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate AI Headline
app.post('/api/profile/ai-headline', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    
    const userProfile = {
      firstName: user.firstName,
      currentRole: user.currentRole || 'Professional'
    };
    
    const headline = profileOptimization.generateHeadline(userProfile, resume);
    res.json(headline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate AI Summary
app.post('/api/profile/ai-summary', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    
    const userProfile = {
      firstName: user.firstName,
      currentRole: user.currentRole || 'Professional',
      location: user.location
    };
    
    const summary = profileOptimization.generateSummary(userProfile, resume);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate AI LinkedIn Post
app.post('/api/profile/ai-linkedin-post', authenticateToken, async (req, res) => {
  try {
    const { topic, tone } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const userProfile = {
      firstName: user.firstName,
      currentRole: user.currentRole || 'Professional'
    };
    
    const post = profileOptimization.generateLinkedInPost(userProfile, topic, tone || 'professional');
    
    // Save to LinkedIn profile if exists
    let linkedInProfile = await LinkedInProfile.findOne({ userId: req.user.userId });
    if (linkedInProfile) {
      linkedInProfile.posts.push({
        content: post.content,
        generatedAt: new Date(),
        used: false
      });
      await linkedInProfile.save();
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Badges
app.get('/api/profile/badges', authenticateToken, async (req, res) => {
  try {
    const badges = await ProfileBadge.find({ userId: req.user.userId, isActive: true }).sort({ issuedAt: -1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Issue Badge
app.post('/api/profile/badge', authenticateToken, async (req, res) => {
  try {
    const { badgeType } = req.body;
    
    // Check if badge already exists
    const existingBadge = await ProfileBadge.findOne({ 
      userId: req.user.userId, 
      badgeType,
      isActive: true 
    });
    
    if (existingBadge) {
      return res.json(existingBadge);
    }
    
    // Get user data for badge criteria
    const user = await User.findById(req.user.userId);
    const linkedInProfile = await LinkedInProfile.findOne({ userId: req.user.userId });
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const completeness = profileOptimization.calculateProfileCompleteness(user, linkedInProfile, resume);
    
    // Check eligibility
    const eligibleBadges = profileOptimization.checkBadgeEligibility(completeness, linkedInProfile, resume);
    const requestedBadge = eligibleBadges.find(b => b.badgeType === badgeType);
    
    if (!requestedBadge) {
      return res.status(400).json({ error: 'Badge criteria not met' });
    }
    
    // Create badge
    const badge = new ProfileBadge({
      userId: req.user.userId,
      ...requestedBadge
    });
    
    await badge.save();
    res.status(201).json(badge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and Issue Eligible Badges (Auto)
app.post('/api/profile/check-badges', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const linkedInProfile = await LinkedInProfile.findOne({ userId: req.user.userId });
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const completeness = profileOptimization.calculateProfileCompleteness(user, linkedInProfile, resume);
    
    // Check eligibility
    const eligibleBadges = profileOptimization.checkBadgeEligibility(completeness, linkedInProfile, resume);
    
    // Issue new badges
    const issuedBadges = [];
    for (const eligibleBadge of eligibleBadges) {
      const existing = await ProfileBadge.findOne({ 
        userId: req.user.userId, 
        badgeType: eligibleBadge.badgeType,
        isActive: true 
      });
      
      if (!existing) {
        const badge = new ProfileBadge({
          userId: req.user.userId,
          ...eligibleBadge
        });
        await badge.save();
        issuedBadges.push(badge);
      }
    }
    
    res.json({ 
      eligibleBadges: eligibleBadges.length,
      issuedBadges: issuedBadges.length,
      badges: issuedBadges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// CAREER RESOURCES
// =====================

// PROGRESS TRACKING

// Get User Progress
app.get('/api/career/progress', authenticateToken, async (req, res) => {
  try {
    const progressRecords = await Progress.find({ userId: req.user.userId });
    const overallData = careerResources.calculateOverallProgress(progressRecords);
    
    // Return format expected by ProgressDashboard component
    // Check if request is from Dashboard (expects array) or Resources page (expects object)
    const userAgent = req.headers['user-agent'] || '';
    const isDashboardRequest = req.query.format === 'array' || req.query.dashboard === 'true';
    
    if (isDashboardRequest) {
      // Dashboard expects array format
      if (progressRecords.length === 0) {
        const defaultModules = [
          { module: 'resume', moduleName: 'Resume Optimization', progress: 0 },
          { module: 'jobs', moduleName: 'Job Applications', progress: 0 },
          { module: 'network', moduleName: 'Networking', progress: 0 },
          { module: 'profile', moduleName: 'Profile Optimization', progress: 0 },
          { module: 'assessment', moduleName: 'Career Assessment', progress: 0 }
        ];
        return res.json(defaultModules);
      }
      return res.json(progressRecords);
    }
    
    // Resources page expects object format with overall and modules
    if (progressRecords.length === 0) {
      return res.json({
        overall: {
          overallProgress: 0,
          completedModules: 0,
          moduleCount: 0,
          averageProgress: 0
        },
        modules: [
          { module: 'resume', moduleName: 'Resume Optimization', progress: 0 },
          { module: 'jobs', moduleName: 'Job Applications', progress: 0 },
          { module: 'network', moduleName: 'Networking', progress: 0 },
          { module: 'profile', moduleName: 'Profile Optimization', progress: 0 },
          { module: 'assessment', moduleName: 'Career Assessment', progress: 0 }
        ]
      });
    }
    
    // Return object format for Resources page
    res.json({
      overall: {
        overallProgress: overallData.overallProgress || 0,
        completedModules: overallData.completedModules || 0,
        moduleCount: overallData.moduleCount || progressRecords.length,
        averageProgress: overallData.averageProgress || 0
      },
      modules: progressRecords
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Progress
app.post('/api/career/progress', authenticateToken, async (req, res) => {
  try {
    const { module, moduleName, progress, completedTask, milestone } = req.body;
    
    if (!module || !moduleName) {
      return res.status(400).json({ error: 'Module and moduleName are required' });
    }

    let progressRecord = await Progress.findOne({ userId: req.user.userId, module });
    
    if (!progressRecord) {
      progressRecord = new Progress({
        userId: req.user.userId,
        module,
        moduleName,
        progress: progress || 0
      });
    } else {
      if (progress !== undefined) progressRecord.progress = Math.min(Math.max(progress, 0), 100);
      if (moduleName) progressRecord.moduleName = moduleName;
    }

    if (completedTask) {
      progressRecord.completedTasks.push({
        taskId: completedTask.taskId || Date.now().toString(),
        taskName: completedTask.taskName,
        completedAt: new Date()
      });
    }

    if (milestone) {
      progressRecord.milestones.push({
        milestoneId: milestone.milestoneId || Date.now().toString(),
        milestoneName: milestone.milestoneName,
        achievedAt: new Date()
      });
    }

    progressRecord.lastUpdated = new Date();
    await progressRecord.save();

    // Log activity
    await ActivityTimeline.create({
      userId: req.user.userId,
      activityType: 'other',
      activityName: `Progress updated: ${moduleName}`,
      description: `Progress: ${progressRecord.progress}%`,
      metadata: { module, progress: progressRecord.progress }
    });

    res.json(progressRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DOCUMENT MANAGEMENT

// Get User Documents
app.get('/api/career/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Document
app.post('/api/career/documents', authenticateToken, documentUpload.single('documentFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { category, description, tags } = req.body;
    
    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
    else if (req.file.mimetype.includes('word')) fileType = 'docx';
    else if (req.file.mimetype.includes('text')) fileType = 'txt';
    else if (req.file.mimetype.includes('image')) fileType = 'image';

    const document = new Document({
      userId: req.user.userId,
      fileName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      fileUrl: req.file.path,
      category: category || 'other',
      description,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    await document.save();

    // Log activity
    await ActivityTimeline.create({
      userId: req.user.userId,
      activityType: 'document-upload',
      activityName: `Document uploaded: ${req.file.originalname}`,
      description: `Category: ${category || 'other'}`,
      metadata: { documentId: document._id, fileName: req.file.originalname }
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Document
app.delete('/api/career/documents/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!document) return res.status(404).json({ error: 'Document not found' });
    
    // Delete file from filesystem
    if (fs.existsSync(document.fileUrl)) {
      fs.unlinkSync(document.fileUrl);
    }
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RESOURCE LIBRARY

// Get Resources
app.get('/api/career/resources', authenticateToken, async (req, res) => {
  try {
    const { category, resourceType } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (resourceType) query.resourceType = resourceType;
    
    const resources = await ResourceLibrary.find(query).sort({ publishedAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Resource
app.get('/api/career/resources/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await ResourceLibrary.findById(req.params.id);
    if (!resource || !resource.isActive) return res.status(404).json({ error: 'Resource not found' });
    
    // Increment views
    resource.views += 1;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACTIVITY TIMELINE

// Get Activity Timeline
app.get('/api/career/activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, activityType } = req.query;
    const query = { userId: req.user.userId };
    if (activityType) query.activityType = activityType;
    
    const activities = await ActivityTimeline.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VISUAL REPORTS

// Get Visual Report Data
app.get('/api/career/visual-report', authenticateToken, async (req, res) => {
  try {
    const progressRecords = await Progress.find({ userId: req.user.userId });
    const activities = await ActivityTimeline.find({ userId: req.user.userId });
    
    // Get user statistics
    const resumes = await Resume.countDocuments({ userId: req.user.userId });
    const jobApplications = await JobApplication.countDocuments({ userId: req.user.userId });
    const contacts = await Contact.countDocuments({ userId: req.user.userId });
    const assessments = await CareerAssessment.countDocuments({ userId: req.user.userId });
    const badges = await ProfileBadge.countDocuments({ userId: req.user.userId, isActive: true });
    const documents = await Document.countDocuments({ userId: req.user.userId });
    
    const userStats = {
      resumes,
      jobApplications,
      contacts,
      assessments,
      badges,
      documents
    };
    
    const reportData = careerResources.generateVisualReportData(progressRecords, activities, userStats);
    res.json(reportData);
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

    // Use enhanced ATS scoring
    const atsAnalysis = resumeOptimization.calculateATSScore(textContent);
    const atsScore = atsAnalysis.score;

    const resume = new Resume({
      userId: req.user.userId,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      content: { rawText: textContent },
      atsScore,
      analysis: {
        keywords: atsAnalysis.breakdown.keywords.details.found || [],
        missingKeywords: atsAnalysis.breakdown.keywords.details.missing || [],
        suggestions: [
          ...atsAnalysis.breakdown.sections.details.missing.map(s => `Add ${s} section`),
          ...atsAnalysis.breakdown.keywords.details.missing.slice(0, 3).map(k => `Include keyword: ${k}`),
          ...(atsAnalysis.breakdown.achievements.score < 10 ? ['Add more quantifiable achievements with numbers'] : [])
        ],
        strengths: [
          ...atsAnalysis.breakdown.sections.details.found.map(s => `Has ${s} section`),
          ...(atsAnalysis.breakdown.achievements.score >= 10 ? ['Includes quantifiable achievements'] : [])
        ],
        weaknesses: [
          ...atsAnalysis.breakdown.sections.details.missing.map(s => `Missing ${s} section`),
          ...(atsAnalysis.breakdown.achievements.score < 5 ? ['Limited quantifiable achievements'] : [])
        ],
        atsBreakdown: atsAnalysis.breakdown
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

// Optimize Resume
app.post('/api/resume/optimize', authenticateToken, async (req, res) => {
  try {
    const { resumeId } = req.body;
    
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    
    const content = resume.content.rawText || '';
    
    // Generate optimized content
    const bulletPoints = resumeOptimization.generateBulletPoints(content);
    const summary = resumeOptimization.generateSummary(content);
    
    // Recalculate ATS score with optimizations
    const optimizedContent = summary + '\n\n' + bulletPoints.map(bp => bp.optimized).join('\n');
    const atsAnalysis = resumeOptimization.calculateATSScore(optimizedContent);
    
    res.json({
      originalScore: resume.atsScore,
      optimizedScore: atsAnalysis.score,
      improvement: atsAnalysis.score - resume.atsScore,
      bulletPoints,
      summary,
      atsBreakdown: atsAnalysis.breakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Align Resume with Job Description
app.post('/api/resume/align-job', authenticateToken, async (req, res) => {
  try {
    const { resumeId, jobDescription, jobTitle, company } = req.body;
    
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Job description is required and must be at least 50 characters' });
    }
    
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    
    const resumeContent = resume.content.rawText || '';
    const alignment = resumeOptimization.alignResumeWithJob(resumeContent, jobDescription);
    
    // Save job description for future reference
    const jobDesc = new JobDescription({
      userId: req.user.userId,
      title: jobTitle || 'Job Position',
      company: company || '',
      description: jobDescription,
      requiredSkills: alignment.missingSkills,
      keywords: alignment.missingKeywords
    });
    await jobDesc.save();
    
    res.json({
      alignment,
      resumeId: resume._id,
      jobDescriptionId: jobDesc._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Resume Templates
app.get('/api/resume/templates', authenticateToken, async (req, res) => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean, contemporary design with emphasis on skills and achievements',
        preview: 'Modern layout with color accents and clear section separation',
        sections: ['Summary', 'Experience', 'Education', 'Skills', 'Certifications']
      },
      {
        id: 'classic',
        name: 'Classic Traditional',
        description: 'Traditional format preferred by conservative industries',
        preview: 'Timeless design with professional typography',
        sections: ['Objective', 'Experience', 'Education', 'Skills', 'References']
      },
      {
        id: 'creative',
        name: 'Creative Portfolio',
        description: 'Bold design for creative professionals and designers',
        preview: 'Eye-catching layout with visual elements',
        sections: ['About', 'Experience', 'Projects', 'Skills', 'Education']
      },
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'Leadership-focused format for senior professionals',
        preview: 'Emphasizes achievements and strategic impact',
        sections: ['Executive Summary', 'Career Highlights', 'Experience', 'Education', 'Board Positions']
      },
      {
        id: 'technical',
        name: 'Technical Professional',
        description: 'Optimized for technical roles with project emphasis',
        preview: 'Highlights technical skills and project experience',
        sections: ['Summary', 'Technical Skills', 'Projects', 'Experience', 'Education']
      }
    ];
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate ATS Score (standalone endpoint)
app.post('/api/resume/ats-score', authenticateToken, async (req, res) => {
  try {
    const { content, resumeId } = req.body;
    
    let resumeContent = content;
    if (resumeId && !content) {
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });
      if (!resume) return res.status(404).json({ error: 'Resume not found' });
      resumeContent = resume.content.rawText || '';
    }
    
    if (!resumeContent || resumeContent.trim().length < 50) {
      return res.status(400).json({ error: 'Resume content is required' });
    }
    
    const atsAnalysis = resumeOptimization.calculateATSScore(resumeContent);
    res.json(atsAnalysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// JOB APPLICATIONS
// =====================

// Get All Job Applications
app.get('/api/jobs/applications', authenticateToken, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Job Application
app.post('/api/jobs/applications', authenticateToken, async (req, res) => {
  try {
    const application = new JobApplication({
      userId: req.user.userId,
      ...req.body
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Job Application
app.put('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Job Application
app.delete('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Job Application
app.get('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Summarize Job Description
app.post('/api/jobs/summarize', authenticateToken, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Job description is required and must be at least 50 characters' });
    }
    
    const summary = jobManagement.summarizeJobDescription(jobDescription);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Autofill Application
app.post('/api/jobs/autofill', authenticateToken, async (req, res) => {
  try {
    const { jobDescription, jobUrl } = req.body;
    
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Job description is required' });
    }
    
    const autofill = jobManagement.autofillApplication(jobDescription, jobUrl || '');
    res.json(autofill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match Skills with Job
app.post('/api/jobs/match-skills', authenticateToken, async (req, res) => {
  try {
    const { jobDescription, resumeId } = req.body;
    
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Job description is required' });
    }
    
    // Get user's resume to extract skills
    let userSkillsText = '';
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });
      if (resume) {
        userSkillsText = resume.content.rawText || '';
        if (resume.content.sections && resume.content.sections.skills) {
          userSkillsText += ' ' + resume.content.sections.skills.join(' ');
        }
      }
    }
    
    // If no resume, try to get from user profile (if available)
    if (!userSkillsText) {
      const user = await User.findById(req.user.userId);
      // Could add skills to user profile in future
      userSkillsText = user?.email || '';
    }
    
    const match = jobManagement.matchSkillsWithJob(userSkillsText, jobDescription);
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save External Job
app.post('/api/jobs/save-external', authenticateToken, async (req, res) => {
  try {
    const { jobTitle, company, jobUrl, jobDescription, source, location, salary } = req.body;
    
    if (!jobUrl || !jobTitle) {
      return res.status(400).json({ error: 'Job URL and title are required' });
    }
    
    // Summarize job description if provided
    let summary = null;
    if (jobDescription && jobDescription.trim().length > 50) {
      summary = jobManagement.summarizeJobDescription(jobDescription);
    }
    
    const savedJob = new SavedJob({
      userId: req.user.userId,
      jobTitle,
      company: company || '',
      jobUrl,
      source: source || 'other',
      jobDescription: jobDescription || '',
      location: location || '',
      salary: salary || null,
      metadata: {
        scrapedAt: new Date(),
        originalUrl: jobUrl,
        platform: source || 'other'
      },
      summary: summary || {
        keySkills: [],
        responsibilities: [],
        requirements: [],
        summaryText: ''
      }
    });
    
    await savedJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Saved External Jobs
app.get('/api/jobs/saved', authenticateToken, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert Saved Job to Application
app.post('/api/jobs/saved/:id/convert', authenticateToken, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!savedJob) return res.status(404).json({ error: 'Saved job not found' });
    
    // Create application from saved job
    const application = new JobApplication({
      userId: req.user.userId,
      jobTitle: savedJob.jobTitle,
      company: savedJob.company,
      jobUrl: savedJob.jobUrl,
      jobDescription: savedJob.jobDescription,
      location: savedJob.location,
      salary: savedJob.salary,
      status: 'saved'
    });
    
    // Calculate skill match if job description exists
    if (savedJob.jobDescription) {
      const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
      if (resume) {
        const userSkillsText = resume.content.rawText || '';
        const match = jobManagement.matchSkillsWithJob(userSkillsText, savedJob.jobDescription);
        application.skillMatch = {
          score: match.matchScore,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills
        };
      }
    }
    
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// NETWORK & COMMUNICATION
// =====================

// CONTACTS

// Get All Contacts
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.userId }).sort({ lastContactDate: -1, createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Contact
app.get('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Contact
app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contact = new Contact({
      userId: req.user.userId,
      ...req.body
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Contact
app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Contact
app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Communication Log
app.post('/api/contacts/:id/log', authenticateToken, async (req, res) => {
  try {
    const { type, subject, notes, followUpDate } = req.body;
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    
    contact.communicationLog.push({
      type,
      subject,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : null
    });
    contact.lastContactDate = new Date();
    if (followUpDate) contact.nextFollowUpDate = new Date(followUpDate);
    contact.updatedAt = new Date();
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OPPORTUNITIES

// Get All Opportunities
app.get('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ userId: req.user.userId })
      .populate('contacts')
      .sort({ deadline: 1, createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Opportunity
app.get('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('contacts');
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Opportunity
app.post('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const opportunity = new Opportunity({
      userId: req.user.userId,
      ...req.body
    });
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Opportunity
app.put('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Opportunity
app.delete('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI COMMUNICATION

// Generate Elevator Pitch
app.post('/api/ai/elevator-pitch', authenticateToken, async (req, res) => {
  try {
    const { context, targetRole } = req.body;
    
    // Get user profile
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Get user's resume for skills
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const skills = resume?.content?.sections?.skills || [];
    
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      currentRole: user.currentRole || 'Professional',
      skills,
      experience: 'professional',
      goals: 'career growth'
    };
    
    const pitch = communicationAI.generateElevatorPitch(userProfile, context || 'networking', targetRole);
    res.json(pitch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Email
app.post('/api/ai/email', authenticateToken, async (req, res) => {
  try {
    const { purpose, recipientName, recipientRole, recipientCompany, context } = req.body;
    
    if (!purpose) {
      return res.status(400).json({ error: 'Email purpose is required' });
    }
    
    // Get user profile
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const senderProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      currentRole: user.currentRole || 'Professional',
      currentCompany: user.currentCompany || '',
      email: user.email
    };
    
    const email = communicationAI.generateEmail({
      purpose,
      recipientName,
      recipientRole,
      recipientCompany,
      context,
      senderProfile
    });
    
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LINKEDIN REMINDERS

// Get All Reminders
app.get('/api/linkedin/reminders', authenticateToken, async (req, res) => {
  try {
    const reminders = await LinkedInReminder.find({ userId: req.user.userId })
      .populate('contactId')
      .sort({ scheduledDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Reminder
app.post('/api/linkedin/reminders', authenticateToken, async (req, res) => {
  try {
    const { contactId, type, message, scheduledDate, linkedInUrl, notes } = req.body;
    
    if (!scheduledDate) {
      return res.status(400).json({ error: 'Scheduled date is required' });
    }
    
    const reminder = new LinkedInReminder({
      userId: req.user.userId,
      contactId,
      type: type || 'follow-up',
      message,
      scheduledDate: new Date(scheduledDate),
      linkedInUrl,
      notes
    });
    
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Reminder
app.put('/api/linkedin/reminders/:id', authenticateToken, async (req, res) => {
  try {
    const reminder = await LinkedInReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Reminder as Completed
app.post('/api/linkedin/reminders/:id/complete', authenticateToken, async (req, res) => {
  try {
    const reminder = await LinkedInReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { 
        $set: { 
          completed: true, 
          completedAt: new Date() 
        } 
      },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Reminder
app.delete('/api/linkedin/reminders/:id', authenticateToken, async (req, res) => {
  try {
    const reminder = await LinkedInReminder.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// NETWORK & COMMUNICATION
// =====================

// CONTACTS

// Get All Contacts
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.userId }).sort({ lastContactDate: -1, createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Contact
app.get('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Contact
app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contact = new Contact({
      userId: req.user.userId,
      ...req.body
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Contact
app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Contact
app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Communication Log
app.post('/api/contacts/:id/log', authenticateToken, async (req, res) => {
  try {
    const { type, subject, notes, followUpDate } = req.body;
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    
    contact.communicationLog.push({
      type,
      subject,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : null
    });
    contact.lastContactDate = new Date();
    if (followUpDate) contact.nextFollowUpDate = new Date(followUpDate);
    contact.updatedAt = new Date();
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OPPORTUNITIES

// Get All Opportunities
app.get('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ userId: req.user.userId })
      .populate('contacts')
      .sort({ deadline: 1, createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Opportunity
app.get('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('contacts');
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Opportunity
app.post('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const opportunity = new Opportunity({
      userId: req.user.userId,
      ...req.body
    });
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Opportunity
app.put('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Opportunity
app.delete('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI COMMUNICATION

// Generate Elevator Pitch
app.post('/api/ai/elevator-pitch', authenticateToken, async (req, res) => {
  try {
    const { context, targetRole } = req.body;
    
    // Get user profile
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Get user's resume for skills
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const skills = resume?.content?.sections?.skills || [];
    
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      currentRole: user.currentRole || 'Professional',
      skills,
      experience: 'professional',
      goals: 'career growth'
    };
    
    const pitch = communicationAI.generateElevatorPitch(userProfile, context || 'networking', targetRole);
    res.json(pitch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Email
app.post('/api/ai/email', authenticateToken, async (req, res) => {
  try {
    const { purpose, recipientName, recipientRole, recipientCompany, context } = req.body;
    
    if (!purpose) {
      return res.status(400).json({ error: 'Email purpose is required' });
    }
    
    // Get user profile
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const senderProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      currentRole: user.currentRole || 'Professional',
      currentCompany: user.currentCompany || '',
      email: user.email
    };
    
    const email = communicationAI.generateEmail({
      purpose,
      recipientName,
      recipientRole,
      recipientCompany,
      context,
      senderProfile
    });
    
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LINKEDIN REMINDERS

// Get All Reminders
app.get('/api/linkedin/reminders', authenticateToken, async (req, res) => {
  try {
    const reminders = await LinkedInReminder.find({ userId: req.user.userId })
      .populate('contactId')
      .sort({ scheduledDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Reminder
app.post('/api/linkedin/reminders', authenticateToken, async (req, res) => {
  try {
    const { contactId, type, message, scheduledDate, linkedInUrl, notes } = req.body;
    
    if (!scheduledDate) {
      return res.status(400).json({ error: 'Scheduled date is required' });
    }
    
    const reminder = new LinkedInReminder({
      userId: req.user.userId,
      contactId,
      type: type || 'follow-up',
      message,
      scheduledDate: new Date(scheduledDate),
      linkedInUrl,
      notes
    });
    
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Reminder
app.put('/api/linkedin/reminders/:id', authenticateToken, async (req, res) => {
  try {
    const reminder = await LinkedInReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Reminder as Completed
app.post('/api/linkedin/reminders/:id/complete', authenticateToken, async (req, res) => {
  try {
    const reminder = await LinkedInReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { 
        $set: { 
          completed: true, 
          completedAt: new Date() 
        } 
      },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Reminder
app.delete('/api/linkedin/reminders/:id', authenticateToken, async (req, res) => {
  try {
    const reminder = await LinkedInReminder.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// LINKEDIN PROFILE
// =====================

// Get LinkedIn Profile
app.get('/api/linkedin/profile', authenticateToken, async (req, res) => {
  try {
    let profile = await LinkedInProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      // Create default profile if doesn't exist
      profile = new LinkedInProfile({
        userId: req.user.userId,
        completenessScore: 0,
        suggestions: [
          { category: 'Profile', suggestion: 'Add a professional headline', priority: 'high', completed: false },
          { category: 'Profile', suggestion: 'Write a compelling summary', priority: 'high', completed: false },
          { category: 'Profile', suggestion: 'Add your LinkedIn profile URL', priority: 'medium', completed: false }
        ]
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update LinkedIn Profile
app.put('/api/linkedin/profile', authenticateToken, async (req, res) => {
  try {
    const { headline, summary, profileUrl } = req.body;
    
    let profile = await LinkedInProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      profile = new LinkedInProfile({ userId: req.user.userId });
    }
    
    if (headline) profile.headline = headline;
    if (summary) profile.summary = summary;
    if (profileUrl) profile.profileUrl = profileUrl;
    
    // Calculate completeness score
    let score = 0;
    if (profile.headline) score += 30;
    if (profile.summary) score += 40;
    if (profile.profileUrl) score += 30;
    profile.completenessScore = score;
    
    profile.lastAnalyzed = new Date();
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate LinkedIn Post
app.post('/api/linkedin/generate-post', authenticateToken, async (req, res) => {
  try {
    const { topic, tone } = req.body;
    
    // Simple post generation (in production, this would use AI/LLM)
    const samplePosts = {
      professional: `Excited to share insights about ${topic || 'career development'}! Continuous learning and growth are key to professional success. What strategies have worked best for your career journey? #CareerDevelopment #ProfessionalGrowth`,
      casual: `Just thinking about ${topic || 'career growth'} today. It's amazing how much we can achieve when we stay curious and keep pushing forward. What's your latest career win? 🚀`,
      inspirational: `Every step forward in your career journey matters. Today, let's focus on ${topic || 'growth and development'}. Remember: progress, not perfection. What are you working on? 💪`
    };
    
    const post = samplePosts[tone] || samplePosts.professional;
    
    // Save to profile
    const profile = await LinkedInProfile.findOne({ userId: req.user.userId });
    if (profile) {
      profile.posts.push({
        content: post,
        generatedAt: new Date(),
        used: false
      });
      await profile.save();
    }
    
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// CAREER ASSESSMENT
// =====================

// Get Assessment Questions
app.get('/api/assessment/questions', authenticateToken, async (req, res) => {
  try {
    let questions = await AssessmentQuestion.find({ isActive: true }).sort({ order: 1, category: 1 });
    
    // If no questions exist, seed default questions
    if (questions.length === 0) {
      const defaultQuestions = [
        { questionText: 'I enjoy working with data and numbers', category: 'personality', trait: 'analytical', weight: 1.2, order: 1 },
        { questionText: 'I prefer leading teams rather than working alone', category: 'personality', trait: 'leadership', weight: 1.5, order: 2 },
        { questionText: 'I am creative and enjoy innovative solutions', category: 'personality', trait: 'creative', weight: 1.2, order: 3 },
        { questionText: 'I pay close attention to details', category: 'personality', trait: 'detail-oriented', weight: 1.3, order: 4 },
        { questionText: 'I enjoy public speaking and presentations', category: 'personality', trait: 'communicative', weight: 1.2, order: 5 },
        { questionText: 'I work best in collaborative team environments', category: 'workstyle', trait: 'collaborative', weight: 1.1, order: 6 },
        { questionText: 'I prefer working independently on projects', category: 'workstyle', trait: 'independent', weight: 1.1, order: 7 },
        { questionText: 'I like structured processes and clear guidelines', category: 'workstyle', trait: 'structured', weight: 1.2, order: 8 },
        { questionText: 'I enjoy solving complex problems', category: 'personality', trait: 'analytical', weight: 1.3, order: 9 },
        { questionText: 'I am comfortable making decisions under uncertainty', category: 'personality', trait: 'leadership', weight: 1.4, order: 10 },
        { questionText: 'I value creative freedom in my work', category: 'values', trait: 'creative', weight: 1.2, order: 11 },
        { questionText: 'I prefer tasks that require precision and accuracy', category: 'personality', trait: 'detail-oriented', weight: 1.3, order: 12 },
        { questionText: 'I enjoy networking and building professional relationships', category: 'personality', trait: 'communicative', weight: 1.2, order: 13 },
        { questionText: 'I thrive in fast-paced, dynamic environments', category: 'workstyle', trait: 'creative', weight: 1.1, order: 14 },
        { questionText: 'I prefer well-defined roles and responsibilities', category: 'workstyle', trait: 'structured', weight: 1.2, order: 15 }
      ];
      
      await AssessmentQuestion.insertMany(defaultQuestions);
      questions = await AssessmentQuestion.find({ isActive: true }).sort({ order: 1 });
    }
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Assessment Results
app.get('/api/assessment/results', authenticateToken, async (req, res) => {
  try {
    const assessments = await CareerAssessment.find({ userId: req.user.userId }).sort({ completedAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Career Recommendations (for a specific assessment)
app.get('/api/assessment/recommendations/:assessmentId', authenticateToken, async (req, res) => {
  try {
    const assessment = await CareerAssessment.findOne({ 
      _id: req.params.assessmentId, 
      userId: req.user.userId 
    });
    
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    res.json(assessment.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Assessment
app.post('/api/assessment/submit', authenticateToken, async (req, res) => {
  try {
    const { assessmentType, responses } = req.body;
    
    // Validate input
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Responses are required' });
    }
    
    // Fetch questions and roles
    const questions = await AssessmentQuestion.find({ isActive: true });
    const allRoles = await CareerRole.find();
    
    // If no roles exist, seed default roles
    if (allRoles.length === 0) {
      const defaultRoles = [
        {
          title: 'Software Engineer',
          description: 'Design and develop software applications',
          cluster: 'Technology',
          requiredTraits: [
            { trait: 'analytical', minScore: 70, weight: 1.5 },
            { trait: 'detail-oriented', minScore: 65, weight: 1.3 },
            { trait: 'structured', minScore: 60, weight: 1.0 }
          ],
          requiredSkills: [
            { skill: 'Programming', importance: 'essential' },
            { skill: 'Problem Solving', importance: 'essential' }
          ],
          growthProjection: 22,
          demandScore: 92
        },
        {
          title: 'Data Analyst',
          description: 'Analyze data to help organizations make decisions',
          cluster: 'Technology',
          requiredTraits: [
            { trait: 'analytical', minScore: 75, weight: 1.5 },
            { trait: 'detail-oriented', minScore: 70, weight: 1.4 },
            { trait: 'structured', minScore: 65, weight: 1.2 }
          ],
          requiredSkills: [
            { skill: 'Data Analysis', importance: 'essential' },
            { skill: 'Statistics', importance: 'important' }
          ],
          growthProjection: 25,
          demandScore: 88
        },
        {
          title: 'Product Manager',
          description: 'Lead product development and strategy',
          cluster: 'Business',
          requiredTraits: [
            { trait: 'leadership', minScore: 70, weight: 1.5 },
            { trait: 'communicative', minScore: 70, weight: 1.4 },
            { trait: 'analytical', minScore: 65, weight: 1.2 }
          ],
          requiredSkills: [
            { skill: 'Strategic Thinking', importance: 'essential' },
            { skill: 'Communication', importance: 'essential' }
          ],
          growthProjection: 18,
          demandScore: 85
        },
        {
          title: 'UX Designer',
          description: 'Design user experiences for digital products',
          cluster: 'Creative',
          requiredTraits: [
            { trait: 'creative', minScore: 75, weight: 1.5 },
            { trait: 'collaborative', minScore: 70, weight: 1.3 },
            { trait: 'communicative', minScore: 65, weight: 1.2 }
          ],
          requiredSkills: [
            { skill: 'Design Thinking', importance: 'essential' },
            { skill: 'User Research', importance: 'important' }
          ],
          growthProjection: 15,
          demandScore: 82
        },
        {
          title: 'Marketing Manager',
          description: 'Develop and execute marketing strategies',
          cluster: 'Business',
          requiredTraits: [
            { trait: 'communicative', minScore: 75, weight: 1.5 },
            { trait: 'creative', minScore: 70, weight: 1.3 },
            { trait: 'collaborative', minScore: 70, weight: 1.2 }
          ],
          requiredSkills: [
            { skill: 'Communication', importance: 'essential' },
            { skill: 'Strategic Planning', importance: 'important' }
          ],
          growthProjection: 12,
          demandScore: 78
        },
        {
          title: 'Project Manager',
          description: 'Oversee projects from conception to completion',
          cluster: 'Business',
          requiredTraits: [
            { trait: 'leadership', minScore: 70, weight: 1.5 },
            { trait: 'structured', minScore: 75, weight: 1.4 },
            { trait: 'communicative', minScore: 70, weight: 1.3 }
          ],
          requiredSkills: [
            { skill: 'Project Management', importance: 'essential' },
            { skill: 'Organization', importance: 'essential' }
          ],
          growthProjection: 10,
          demandScore: 80
        },
        {
          title: 'Research Scientist',
          description: 'Conduct research and experiments',
          cluster: 'Technology',
          requiredTraits: [
            { trait: 'analytical', minScore: 80, weight: 1.6 },
            { trait: 'detail-oriented', minScore: 75, weight: 1.4 },
            { trait: 'independent', minScore: 70, weight: 1.2 }
          ],
          requiredSkills: [
            { skill: 'Research Methodology', importance: 'essential' },
            { skill: 'Data Analysis', importance: 'essential' }
          ],
          growthProjection: 20,
          demandScore: 75
        },
        {
          title: 'Business Analyst',
          description: 'Analyze business processes and requirements',
          cluster: 'Business',
          requiredTraits: [
            { trait: 'analytical', minScore: 70, weight: 1.4 },
            { trait: 'communicative', minScore: 70, weight: 1.3 },
            { trait: 'structured', minScore: 65, weight: 1.2 }
          ],
          requiredSkills: [
            { skill: 'Business Analysis', importance: 'essential' },
            { skill: 'Documentation', importance: 'important' }
          ],
          growthProjection: 14,
          demandScore: 77
        }
      ];
      
      await CareerRole.insertMany(defaultRoles);
      const updatedRoles = await CareerRole.find();
      
      // Generate AI-powered recommendations
      const results = assessmentLogic.generateRecommendations(responses, questions, updatedRoles);
      
      const assessment = new CareerAssessment({
        userId: req.user.userId,
        assessmentType: assessmentType || 'personality',
        responses,
        results: {
          personalityType: results.personalityType,
          personalityDescription: results.personalityDescription,
          confidence: results.confidence,
          traits: results.traits,
          recommendedCareers: results.recommendedCareers,
          careerClusters: results.careerClusters,
          skillGaps: results.skillGaps
        },
        completedAt: new Date()
      });
      
      await assessment.save();
      return res.status(201).json(assessment);
    }
    
    // Generate AI-powered recommendations using assessment logic
    const results = assessmentLogic.generateRecommendations(responses, questions, allRoles);
    
    const assessment = new CareerAssessment({
      userId: req.user.userId,
      assessmentType: assessmentType || 'personality',
      responses,
      results: {
        personalityType: results.personalityType,
        personalityDescription: results.personalityDescription,
        confidence: results.confidence,
        traits: results.traits,
        recommendedCareers: results.recommendedCareers,
        careerClusters: results.careerClusters,
        skillGaps: results.skillGaps
      },
      completedAt: new Date()
    });
    
    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================
// MENTORSHIP AND DEVELOPMENT
// =====================

// Get All Mentors
app.get('/api/mentors', authenticateToken, async (req, res) => {
  try {
    const mentors = await Mentor.find({ availableForMentorship: true })
      .populate('userId', 'firstName lastName email')
      .limit(20);
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI-Based Mentor Matching
app.post('/api/mentors/match', authenticateToken, async (req, res) => {
  try {
    const { targetRole, industry, goals } = req.body;
    
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    
    const userProfile = {
      skills: resume?.content?.sections?.skills || [],
      industry: industry || user.industry || '',
      currentRole: user.currentRole || 'Professional',
      yearsOfExperience: user.yearsOfExperience || 0
    };
    
    const userGoals = {
      targetRole: targetRole || user.currentRole || '',
      industry: industry || ''
    };
    
    const mentors = await Mentor.find({ availableForMentorship: true })
      .populate('userId', 'firstName lastName email');
    
    const matchedMentors = mentorshipAI.matchMentors(userProfile, mentors, userGoals);
    
    res.json({
      matches: matchedMentors.slice(0, 10),
      totalMatches: matchedMentors.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI Mentor Recommendations
app.get('/api/mentorship/ai-recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const assessments = await CareerAssessment.find({ userId: req.user.userId }).sort({ completedAt: -1 });
    
    const userProfile = {
      skills: resume?.content?.sections?.skills || [],
      industry: user.industry || '',
      currentRole: user.currentRole || 'Professional',
      yearsOfExperience: user.yearsOfExperience || 0
    };
    
    let targetRole = user.currentRole;
    if (assessments.length > 0 && assessments[0].results?.recommendedCareers?.length > 0) {
      targetRole = assessments[0].results.recommendedCareers[0].title;
    }
    
    const userGoals = { targetRole };
    
    const mentors = await Mentor.find({ availableForMentorship: true })
      .populate('userId', 'firstName lastName email');
    
    const matchedMentors = mentorshipAI.matchMentors(userProfile, mentors, userGoals);
    
    res.json({
      recommendations: matchedMentors.slice(0, 5),
      reasoning: 'Mentors matched based on skill overlap, industry alignment, role compatibility, and experience level'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request Mentorship
app.post('/api/mentors/:id/request', authenticateToken, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    
    const existingRelationship = await MentorshipRelationship.findOne({
      menteeId: req.user.userId,
      mentorId: req.params.id
    });
    
    if (existingRelationship) {
      return res.status(400).json({ error: 'Mentorship request already exists' });
    }
    
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const userProfile = {
      skills: resume?.content?.sections?.skills || [],
      industry: user.industry || '',
      currentRole: user.currentRole || 'Professional',
      yearsOfExperience: user.yearsOfExperience || 0
    };
    
    const matchResult = mentorshipAI.matchMentors(userProfile, [mentor], {});
    const matchScore = matchResult[0]?.matchScore || 0;
    const matchReasons = matchResult[0]?.reasons || [];
    
    const relationship = new MentorshipRelationship({
      menteeId: req.user.userId,
      mentorId: req.params.id,
      status: 'pending',
      matchScore,
      matchReasons
    });
    await relationship.save();
    
    mentor.mentees.push({
      userId: req.user.userId,
      startDate: new Date(),
      status: 'pending'
    });
    await mentor.save();
    
    res.json({ message: 'Mentorship request sent successfully', relationship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Transition Guidance
app.get('/api/mentorship/transition-guidance', authenticateToken, async (req, res) => {
  try {
    const { currentRole, targetRole, transitionType } = req.query;
    
    if (!currentRole || !targetRole || !transitionType) {
      return res.status(400).json({ error: 'currentRole, targetRole, and transitionType are required' });
    }
    
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    
    const userProfile = {
      skills: resume?.content?.sections?.skills || [],
      industry: user.industry || '',
      currentRole: user.currentRole || 'Professional'
    };
    
    const guidance = mentorshipAI.generateCareerTransitionGuidance(
      userProfile,
      currentRole,
      targetRole,
      transitionType
    );
    
    let transition = await CareerTransition.findOne({ userId: req.user.userId });
    if (!transition) {
      transition = new CareerTransition({
        userId: req.user.userId,
        currentRole,
        targetRole,
        currentIndustry: user.industry || '',
        targetIndustry: user.industry || '',
        transitionType,
        guidance
      });
    } else {
      transition.currentRole = currentRole;
      transition.targetRole = targetRole;
      transition.transitionType = transitionType;
      transition.guidance = guidance;
      transition.updatedAt = new Date();
    }
    await transition.save();
    
    res.json(transition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Career Transition
app.get('/api/mentorship/transition', authenticateToken, async (req, res) => {
  try {
    const transition = await CareerTransition.findOne({ userId: req.user.userId });
    if (!transition) {
      return res.status(404).json({ error: 'No career transition plan found' });
    }
    res.json(transition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Growth Roadmap
app.post('/api/mentorship/growth-roadmap', authenticateToken, async (req, res) => {
  try {
    const { title, goal, timeframe } = req.body;
    
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    
    const userProfile = {
      skills: resume?.content?.sections?.skills || [],
      industry: user.industry || '',
      currentRole: user.currentRole || 'Professional'
    };
    
    const userGoals = { title, goal };
    
    const roadmap = mentorshipAI.generateGrowthRoadmap(userProfile, userGoals, timeframe || '1-year');
    
    const growthRoadmap = new GrowthRoadmap({
      userId: req.user.userId,
      ...roadmap
    });
    await growthRoadmap.save();
    
    res.status(201).json(growthRoadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Growth Roadmap
app.get('/api/mentorship/growth-roadmap', authenticateToken, async (req, res) => {
  try {
    const roadmap = await GrowthRoadmap.findOne({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    if (!roadmap) {
      return res.status(404).json({ error: 'No growth roadmap found' });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Roadmap Milestone
app.put('/api/mentorship/growth-roadmap/milestone/:milestoneId', authenticateToken, async (req, res) => {
  try {
    const { status, progress } = req.body;
    const roadmap = await GrowthRoadmap.findOne({ userId: req.user.userId });
    
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    
    const milestone = roadmap.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    
    if (status) milestone.status = status;
    if (progress !== undefined) milestone.progress = Math.min(Math.max(progress, 0), 100);
    
    roadmap.updatedAt = new Date();
    await roadmap.save();
    
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log Progress with Mentor Support
app.post('/api/mentorship/progress', authenticateToken, async (req, res) => {
  try {
    const { mentorId, relationshipId, entryType, title, description, progress, tags } = req.body;
    
    const progressEntry = new MentorProgress({
      userId: req.user.userId,
      mentorId,
      relationshipId,
      entryType: entryType || 'milestone',
      title,
      description,
      progress: progress || 0,
      tags: tags || []
    });
    
    await progressEntry.save();
    
    const roadmap = await GrowthRoadmap.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
    const mentor = mentorId ? await Mentor.findById(mentorId).populate('userId') : null;
    const progressEntries = await MentorProgress.find({ userId: req.user.userId });
    
    const analysis = mentorshipAI.analyzeProgressWithMentor(progressEntries, roadmap, mentor);
    
    res.status(201).json({
      progress: progressEntry,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Progress with Analysis
app.get('/api/mentorship/progress', authenticateToken, async (req, res) => {
  try {
    const progressEntries = await MentorProgress.find({ userId: req.user.userId })
      .populate('mentorId')
      .sort({ createdAt: -1 });
    
    const roadmap = await GrowthRoadmap.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
    const relationships = await MentorshipRelationship.find({ menteeId: req.user.userId })
      .populate('mentorId');
    
    const activeMentor = relationships.find(r => r.status === 'active')?.mentorId;
    const mentor = activeMentor ? await Mentor.findById(activeMentor).populate('userId') : null;
    
    const analysis = mentorshipAI.analyzeProgressWithMentor(progressEntries, roadmap, mentor);
    
    res.json({
      entries: progressEntries,
      analysis,
      roadmap
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Mentor Feedback to Progress
app.post('/api/mentorship/progress/:id/feedback', authenticateToken, async (req, res) => {
  try {
    const { feedback, mentorId } = req.body;
    
    const progressEntry = await MentorProgress.findById(req.params.id);
    if (!progressEntry || progressEntry.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }
    
    progressEntry.mentorFeedback = {
      feedback,
      providedAt: new Date(),
      mentorId
    };
    
    await progressEntry.save();
    res.json(progressEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// LABOR MARKET ANALYTICS
// =====================

// Real-Time Job Data Feed
app.get('/api/analytics/job-feed', authenticateToken, async (req, res) => {
  try {
    const { industry, region, limit = 50 } = req.query;
    
    let query = {};
    if (industry) query.industry = industry;
    if (region) {
      query.$or = [
        { 'location.country': region },
        { 'location.city': region },
        { 'location.state': region }
      ];
    }
    
    let jobs = await JobDataFeed.find(query)
      .sort({ postedDate: -1 })
      .limit(parseInt(limit));
    
    // If no jobs, generate sample data
    if (jobs.length === 0) {
      const sampleJobs = generateSampleJobData(20);
      const processedJobs = marketAnalytics.processJobFeed(sampleJobs);
      
      for (const job of processedJobs) {
        const existing = await JobDataFeed.findOne({ jobId: job.jobId });
        if (!existing) {
          await JobDataFeed.create(job);
        }
      }
      
      jobs = await JobDataFeed.find(query)
        .sort({ postedDate: -1 })
        .limit(parseInt(limit));
    }
    
    res.json({
      jobs,
      total: jobs.length,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process and Store Job Feed
app.post('/api/analytics/job-feed', authenticateToken, async (req, res) => {
  try {
    const { jobs } = req.body;
    
    if (!Array.isArray(jobs)) {
      return res.status(400).json({ error: 'Jobs must be an array' });
    }
    
    const processedJobs = marketAnalytics.processJobFeed(jobs);
    
    const savedJobs = [];
    for (const job of processedJobs) {
      const existing = await JobDataFeed.findOne({ jobId: job.jobId });
      if (existing) {
        await JobDataFeed.updateOne({ jobId: job.jobId }, job);
        savedJobs.push(existing);
      } else {
        const newJob = await JobDataFeed.create(job);
        savedJobs.push(newJob);
      }
    }
    
    res.json({
      message: `Processed and saved ${savedJobs.length} jobs`,
      jobs: savedJobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Regional Hiring Statistics
app.get('/api/analytics/regional', authenticateToken, async (req, res) => {
  try {
    const { region, industry } = req.query;
    
    let query = {};
    if (region && region !== 'all') {
      query.$or = [
        { 'location.country': region },
        { 'location.city': region },
        { 'location.state': region }
      ];
    }
    if (industry) query.industry = industry;
    
    const jobs = await JobDataFeed.find(query);
    
    const statistics = marketAnalytics.calculateRegionalHiring(jobs, region || 'all');
    
    const period = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      type: 'monthly'
    };
    
    let regionalRecord = await RegionalHiring.findOne({
      'region.country': region || 'all',
      industry: industry || { $exists: false },
      'period.endDate': { $gte: period.startDate }
    });
    
    if (!regionalRecord) {
      regionalRecord = new RegionalHiring({
        region: {
          country: region || 'all',
          city: region || '',
          regionCode: region || 'all'
        },
        industry: industry || 'all',
        period,
        statistics,
        trends: {
          growthDirection: statistics.growthDirection,
          growthRate: statistics.growthRate,
          marketHealth: statistics.marketHealth
        }
      });
    } else {
      regionalRecord.statistics = statistics;
      regionalRecord.trends = {
        growthDirection: statistics.growthDirection,
        growthRate: statistics.growthRate,
        marketHealth: statistics.marketHealth
      };
      regionalRecord.lastUpdated = new Date();
    }
    
    await regionalRecord.save();
    res.json(regionalRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Industry Hiring Momentum
app.get('/api/analytics/industry-momentum', authenticateToken, async (req, res) => {
  try {
    const { industry } = req.query;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry parameter is required' });
    }
    
    const jobs = await JobDataFeed.find({ industry });
    
    const momentum = marketAnalytics.calculateIndustryMomentum(jobs, industry);
    
    const period = {
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      type: 'weekly'
    };
    
    let momentumRecord = await IndustryMomentum.findOne({
      industry,
      'period.endDate': { $gte: period.startDate }
    });
    
    if (!momentumRecord) {
      momentumRecord = new IndustryMomentum({
        industry,
        period,
        momentum,
        metrics: {
          totalPostings: momentum.totalPostings,
          newPostings: momentum.newPostings,
          averageTimeToFill: momentum.averageTimeToFill,
          skillDemand: momentum.skillDemand,
          salaryTrends: momentum.salaryTrends
        },
        insights: momentum.insights
      });
    } else {
      momentumRecord.momentum = momentum;
      momentumRecord.metrics = {
        totalPostings: momentum.totalPostings,
        newPostings: momentum.newPostings,
        averageTimeToFill: momentum.averageTimeToFill,
        skillDemand: momentum.skillDemand,
        salaryTrends: momentum.salaryTrends
      };
      momentumRecord.insights = momentum.insights;
      momentumRecord.lastUpdated = new Date();
    }
    
    await momentumRecord.save();
    res.json(momentumRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Competitor Hiring Insights
app.get('/api/analytics/competitor', authenticateToken, async (req, res) => {
  try {
    const { company } = req.query;
    
    if (!company) {
      return res.status(400).json({ error: 'Company parameter is required' });
    }
    
    const jobs = await JobDataFeed.find({
      company: { $regex: company, $options: 'i' }
    });
    
    const insights = marketAnalytics.analyzeCompetitorHiring(jobs, company);
    
    if (!insights) {
      return res.status(404).json({ error: 'No hiring data found for this company' });
    }
    
    const period = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    };
    
    let competitorRecord = await CompetitorHiring.findOne({
      targetCompany: company,
      'period.endDate': { $gte: period.startDate }
    });
    
    if (!competitorRecord) {
      competitorRecord = new CompetitorHiring({
        targetCompany: company,
        industry: jobs[0]?.industry || 'Unknown',
        region: jobs[0]?.location || {},
        period,
        hiringActivity: {
          totalOpenings: insights.totalOpenings,
          newPostings: insights.newPostings,
          roles: insights.roles,
          departments: insights.departments,
          hiringVelocity: insights.hiringVelocity,
          averageTimeToFill: insights.averageTimeToFill
        },
        salaryInsights: {
          averageSalary: insights.averageSalary,
          salaryRange: insights.salaryRange,
          competitivePosition: insights.competitivePosition
        },
        skillRequirements: insights.skillRequirements,
        trends: {
          hiringTrend: insights.hiringTrend,
          focusAreas: insights.focusAreas,
          growthAreas: insights.growthAreas
        }
      });
    } else {
      competitorRecord.hiringActivity = {
        totalOpenings: insights.totalOpenings,
        newPostings: insights.newPostings,
        roles: insights.roles,
        departments: insights.departments,
        hiringVelocity: insights.hiringVelocity,
        averageTimeToFill: insights.averageTimeToFill
      };
      competitorRecord.salaryInsights = {
        averageSalary: insights.averageSalary,
        salaryRange: insights.salaryRange,
        competitivePosition: insights.competitivePosition
      };
      competitorRecord.skillRequirements = insights.skillRequirements;
      competitorRecord.trends = {
        hiringTrend: insights.hiringTrend,
        focusAreas: insights.focusAreas,
        growthAreas: insights.growthAreas
      };
      competitorRecord.lastUpdated = new Date();
    }
    
    await competitorRecord.save();
    res.json(competitorRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Five-Year Demand Forecast
app.get('/api/analytics/forecast', authenticateToken, async (req, res) => {
  try {
    const { jobTitle, industry, region } = req.query;
    
    if (!jobTitle || !industry) {
      return res.status(400).json({ error: 'jobTitle and industry parameters are required' });
    }
    
    let query = { industry };
    if (jobTitle) {
      query.title = { $regex: jobTitle, $options: 'i' };
    }
    if (region) {
      query.$or = [
        { 'location.country': region },
        { 'location.city': region }
      ];
    }
    
    const historicalJobs = await JobDataFeed.find(query);
    
    const forecast = marketAnalytics.generateDemandForecast(jobTitle, industry, {
      jobCount: historicalJobs.length,
      averageSalary: historicalJobs.reduce((sum, job) => {
        const avg = (job.salary?.min + job.salary?.max) / 2;
        return sum + (avg || 0);
      }, 0) / Math.max(historicalJobs.length, 1)
    });
    
    const currentYear = new Date().getFullYear();
    let forecastRecord = await DemandForecast.findOne({
      jobTitle,
      industry,
      'forecastPeriod.startYear': currentYear
    });
    
    if (!forecastRecord) {
      forecastRecord = new DemandForecast({
        jobTitle,
        industry,
        region: region ? { country: region, city: region } : {},
        forecastPeriod: {
          startYear: currentYear,
          endYear: currentYear + 5
        },
        projections: forecast.projections,
        methodology: forecast.methodology,
        trends: {
          overallTrend: forecast.overallTrend,
          keyDrivers: forecast.keyDrivers,
          risks: forecast.risks,
          opportunities: forecast.opportunities
        }
      });
    } else {
      forecastRecord.projections = forecast.projections;
      forecastRecord.methodology = forecast.methodology;
      forecastRecord.trends = {
        overallTrend: forecast.overallTrend,
        keyDrivers: forecast.keyDrivers,
        risks: forecast.risks,
        opportunities: forecast.opportunities
      };
      forecastRecord.lastUpdated = new Date();
    }
    
    await forecastRecord.save();
    res.json(forecastRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate sample job data
function generateSampleJobData(count = 20) {
  const titles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Manager'];
  const companies = ['Tech Corp', 'Innovation Labs', 'Digital Solutions', 'Cloud Systems', 'Data Analytics Inc'];
  const cities = ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing'];
  
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const title = titles[Math.floor(Math.random() * titles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const salary = 60000 + Math.random() * 100000;
    
    jobs.push({
      id: `job_${Date.now()}_${i}`,
      title,
      company,
      location: `${city}, CA, USA`,
      industry,
      type: 'full-time',
      salary: {
        min: Math.round(salary * 0.8),
        max: Math.round(salary * 1.2),
        currency: 'USD'
      },
      description: `We are looking for a ${title} to join our team.`,
      skills: ['JavaScript', 'Python', 'React'],
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      source: 'api',
      url: `https://example.com/jobs/${i}`
    });
  }
  
  return jobs;
}

// =====================
// MARKET INSIGHTS (Legacy - for backward compatibility)
// =====================

// Get Market Insights
app.get('/api/market/insights', authenticateToken, async (req, res) => {
  try {
    let insights = await LaborMarketData.find().limit(10).sort({ lastUpdated: -1 });
    
    // If no data exists, create sample data
    if (insights.length === 0) {
      const sampleInsights = [
        {
          jobTitle: 'Software Engineer',
          industry: 'Technology',
          region: { country: 'USA', city: 'San Francisco' },
          demandScore: 92,
          hiringMomentum: 'high',
          salaryRange: { min: 90000, max: 150000, median: 120000, currency: 'USD' },
          requiredSkills: [
            { skill: 'JavaScript', frequency: 85, trending: true },
            { skill: 'React', frequency: 78, trending: true },
            { skill: 'Node.js', frequency: 72, trending: false },
            { skill: 'Python', frequency: 68, trending: true }
          ],
          growthProjection: { oneYear: 8, threeYear: 22, fiveYear: 35 }
        },
        {
          jobTitle: 'Data Scientist',
          industry: 'Technology',
          region: { country: 'USA', city: 'New York' },
          demandScore: 88,
          hiringMomentum: 'high',
          salaryRange: { min: 100000, max: 160000, median: 130000, currency: 'USD' },
          requiredSkills: [
            { skill: 'Python', frequency: 90, trending: true },
            { skill: 'Machine Learning', frequency: 82, trending: true },
            { skill: 'SQL', frequency: 75, trending: false },
            { skill: 'Statistics', frequency: 70, trending: false }
          ],
          growthProjection: { oneYear: 12, threeYear: 28, fiveYear: 42 }
        }
      ];
      
      await LaborMarketData.insertMany(sampleInsights);
      insights = await LaborMarketData.find().limit(10).sort({ lastUpdated: -1 });
    }
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// INDUSTRY INSIGHTS
// =====================

// Sector Skill Gap Analysis
app.get('/api/industry/skills-gap', authenticateToken, async (req, res) => {
  try {
    const { sector } = req.query;
    
    if (!sector) {
      return res.status(400).json({ error: 'Sector parameter is required' });
    }
    
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const userSkills = resume?.content?.sections?.skills || [];
    
    const sectorJobs = await JobDataFeed.find({ industry: sector });
    
    const analysis = industryInsights.analyzeSkillGaps(userSkills, sector, sectorJobs);
    
    let skillGap = await SkillGap.findOne({ userId: req.user.userId, sector });
    if (!skillGap) {
      skillGap = new SkillGap({
        userId: req.user.userId,
        sector,
        analysis
      });
    } else {
      skillGap.analysis = analysis;
    }
    await skillGap.save();
    
    res.json(skillGap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Education & Course Recommendations
app.get('/api/industry/education', authenticateToken, async (req, res) => {
  try {
    const { sector } = req.query;
    
    if (!sector) {
      return res.status(400).json({ error: 'Sector parameter is required' });
    }
    
    const skillGap = await SkillGap.findOne({ userId: req.user.userId, sector });
    if (!skillGap) {
      return res.status(404).json({ error: 'Please run skill gap analysis first' });
    }
    
    const recommendations = industryInsights.generateEducationRecommendations(
      skillGap.analysis.gaps,
      sector,
      {}
    );
    
    let educationRec = await EducationRecommendation.findOne({ userId: req.user.userId, sector });
    if (!educationRec) {
      educationRec = new EducationRecommendation({
        userId: req.user.userId,
        sector,
        recommendations
      });
    } else {
      educationRec.recommendations = recommendations;
    }
    await educationRec.save();
    
    res.json(educationRec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Industry Demand Trends
app.get('/api/industry/demand-trends', authenticateToken, async (req, res) => {
  try {
    const { sector } = req.query;
    
    if (!sector) {
      return res.status(400).json({ error: 'Sector parameter is required' });
    }
    
    const sectorJobs = await JobDataFeed.find({ industry: sector });
    const momentum = await IndustryMomentum.findOne({ industry: sector })
      .sort({ 'period.endDate': -1 });
    
    const trends = industryInsights.analyzeDemandTrends(sectorJobs, sector);
    
    const combinedTrends = {
      ...trends,
      momentum: momentum?.momentum || {},
      metrics: momentum?.metrics || {}
    };
    
    res.json(combinedTrends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employer Strategy Suggestions
app.get('/api/industry/employer-strategy', authenticateToken, async (req, res) => {
  try {
    const { sector, region } = req.query;
    
    if (!sector) {
      return res.status(400).json({ error: 'Sector parameter is required' });
    }
    
    const sectorJobs = await JobDataFeed.find({ industry: sector });
    const momentum = await IndustryMomentum.findOne({ industry: sector })
      .sort({ 'period.endDate': -1 });
    
    const marketData = {
      averageTimeToFill: momentum?.metrics?.averageTimeToFill || 35,
      skillDemand: momentum?.metrics?.skillDemand || [],
      salaryTrends: momentum?.metrics?.salaryTrends || {}
    };
    
    const strategies = industryInsights.generateEmployerStrategies(sector, sectorJobs, marketData);
    
    let strategyRecord = await EmployerStrategy.findOne({ sector });
    if (!strategyRecord) {
      strategyRecord = new EmployerStrategy({
        sector,
        region: region ? { country: region, city: region } : {},
        strategies,
        insights: [
          `Based on analysis of ${sectorJobs.length} job postings in ${sector} sector`,
          `Key focus areas: ${strategies.filter(s => s.priority === 'high').map(s => s.category).join(', ')}`
        ]
      });
    } else {
      strategyRecord.strategies = strategies;
      strategyRecord.insights = [
        `Based on analysis of ${sectorJobs.length} job postings in ${sector} sector`,
        `Key focus areas: ${strategies.filter(s => s.priority === 'high').map(s => s.category).join(', ')}`
      ];
      strategyRecord.lastUpdated = new Date();
    }
    await strategyRecord.save();
    
    res.json(strategyRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export Report
app.get('/api/industry/export-report', authenticateToken, async (req, res) => {
  try {
    const { sector, format = 'json' } = req.query;
    
    if (!sector) {
      return res.status(400).json({ error: 'Sector parameter is required' });
    }
    
    const skillGap = await SkillGap.findOne({ userId: req.user.userId, sector });
    const educationRec = await EducationRecommendation.findOne({ userId: req.user.userId, sector });
    const sectorJobs = await JobDataFeed.find({ industry: sector });
    const trends = industryInsights.analyzeDemandTrends(sectorJobs, sector);
    const momentum = await IndustryMomentum.findOne({ industry: sector })
      .sort({ 'period.endDate': -1 });
    const marketData = {
      averageTimeToFill: momentum?.metrics?.averageTimeToFill || 35,
      skillDemand: momentum?.metrics?.skillDemand || [],
      salaryTrends: momentum?.metrics?.salaryTrends || {}
    };
    const strategies = industryInsights.generateEmployerStrategies(sector, sectorJobs, marketData);
    
    const reportData = industryInsights.generateReportData(
      skillGap?.analysis || { gaps: [], strengths: [], overallGapScore: 0, recommendations: [] },
      educationRec?.recommendations || [],
      trends,
      strategies,
      sector
    );
    
    const exportReport = new ExportReport({
      userId: req.user.userId,
      reportType: 'comprehensive',
      sector,
      format,
      status: 'completed',
      metadata: reportData.metadata
    });
    await exportReport.save();
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="industry-report-${sector}.csv"`);
      res.send(generateCSV(reportData));
    } else {
      res.json({
        report: reportData,
        exportId: exportReport._id,
        downloadUrl: `/api/industry/export-report/${exportReport._id}/download`
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate CSV
function generateCSV(reportData) {
  let csv = 'Section,Title,Content\n';
  
  if (reportData.sections.skillGapAnalysis.gaps) {
    reportData.sections.skillGapAnalysis.gaps.forEach(gap => {
      csv += `Skill Gap,${gap.skill},Priority: ${gap.priority}, Gap: ${gap.gapSize}%\n`;
    });
  }
  
  if (reportData.sections.educationRecommendations.topRecommendations) {
    reportData.sections.educationRecommendations.topRecommendations.forEach(rec => {
      csv += `Education,${rec.title},Provider: ${rec.provider}, Relevance: ${rec.relevanceScore}%\n`;
    });
  }
  
  return csv;
}

// Download Export Report
app.get('/api/industry/export-report/:id/download', authenticateToken, async (req, res) => {
  try {
    const exportReport = await ExportReport.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!exportReport) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({
      message: 'Report ready for download',
      report: exportReport,
      note: 'In production, this would return the actual PDF/CSV file'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// REGIONAL INSIGHTS
// =====================

// Regional Hiring Data
app.get('/api/regional/hiring', authenticateToken, async (req, res) => {
  try {
    const { city, region, country, industry } = req.query;
    
    if (!city && !region && !country) {
      return res.status(400).json({ error: 'At least one location parameter (city, region, or country) is required' });
    }
    
    const jobs = await JobDataFeed.find({});
    const hiringData = regionalInsights.aggregateRegionalHiring(jobs, city, region, country);
    
    if (industry) {
      hiringData.industries = hiringData.industries.filter(ind => ind.industry === industry);
    }
    
    res.json(hiringData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Local Skill Shortage Detection
app.get('/api/regional/skill-shortage', authenticateToken, async (req, res) => {
  try {
    const { city, industry } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const jobs = await JobDataFeed.find({});
    const shortageAnalysis = regionalInsights.detectLocalSkillShortages(jobs, city, industry);
    
    const period = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    };
    
    let shortageRecord = await LocalSkillShortage.findOne({
      'region.city': city,
      industry: industry || { $exists: false },
      'period.endDate': { $gte: period.startDate }
    });
    
    if (!shortageRecord) {
      shortageRecord = new LocalSkillShortage({
        region: { city, country: 'USA' },
        industry: industry || 'all',
        period,
        shortages: shortageAnalysis.shortages,
        insights: shortageAnalysis.insights,
        recommendations: shortageAnalysis.recommendations
      });
    } else {
      shortageRecord.shortages = shortageAnalysis.shortages;
      shortageRecord.insights = shortageAnalysis.insights;
      shortageRecord.recommendations = shortageAnalysis.recommendations;
      shortageRecord.lastUpdated = new Date();
    }
    
    await shortageRecord.save();
    res.json(shortageRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Salary Benchmarking
app.get('/api/regional/salary', authenticateToken, async (req, res) => {
  try {
    const { city, role, industry, experienceLevel } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const jobs = await JobDataFeed.find({});
    const benchmarks = regionalInsights.calculateSalaryBenchmarks(jobs, city, role, industry);
    
    if (!benchmarks) {
      return res.status(404).json({ error: 'Insufficient salary data for this region/role' });
    }
    
    if (experienceLevel) {
      benchmarks.experienceLevel = experienceLevel;
    }
    
    let benchmarkRecord = await SalaryBenchmark.findOne({
      'region.city': city,
      role: role || 'all',
      industry: industry || 'all',
      experienceLevel: experienceLevel || benchmarks.experienceLevel
    });
    
    if (!benchmarkRecord) {
      benchmarkRecord = new SalaryBenchmark({
        region: { city, country: 'USA' },
        role: role || 'all',
        industry: industry || 'all',
        experienceLevel: experienceLevel || benchmarks.experienceLevel,
        benchmarks: {
          percentile25: benchmarks.percentile25,
          percentile50: benchmarks.percentile50,
          percentile75: benchmarks.percentile75,
          percentile90: benchmarks.percentile90,
          average: benchmarks.average,
          min: benchmarks.min,
          max: benchmarks.max
        },
        currency: benchmarks.currency,
        sampleSize: benchmarks.sampleSize,
        dataQuality: benchmarks.dataQuality,
        trends: benchmarks.trends,
        costOfLiving: benchmarks.costOfLiving
      });
    } else {
      benchmarkRecord.benchmarks = {
        percentile25: benchmarks.percentile25,
        percentile50: benchmarks.percentile50,
        percentile75: benchmarks.percentile75,
        percentile90: benchmarks.percentile90,
        average: benchmarks.average,
        min: benchmarks.min,
        max: benchmarks.max
      };
      benchmarkRecord.trends = benchmarks.trends;
      benchmarkRecord.costOfLiving = benchmarks.costOfLiving;
      benchmarkRecord.sampleSize = benchmarks.sampleSize;
      benchmarkRecord.dataQuality = benchmarks.dataQuality;
      benchmarkRecord.lastUpdated = new Date();
    }
    
    await benchmarkRecord.save();
    res.json(benchmarkRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employment Outcome Tracking
app.get('/api/regional/employment-outcome', authenticateToken, async (req, res) => {
  try {
    const { city, industry } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const applications = await JobApplication.find({});
    const jobs = await JobDataFeed.find({});
    const outcomes = regionalInsights.trackEmploymentOutcomes(applications, jobs, city, industry);
    
    const period = {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      type: 'quarterly'
    };
    
    let outcomeRecord = await EmploymentOutcome.findOne({
      'region.city': city,
      industry: industry || { $exists: false },
      'period.endDate': { $gte: period.startDate }
    });
    
    if (!outcomeRecord) {
      outcomeRecord = new EmploymentOutcome({
        region: { city, country: 'USA' },
        industry: industry || 'all',
        period,
        outcomes: {
          employmentRate: outcomes.employmentRate,
          unemploymentRate: outcomes.unemploymentRate,
          underemploymentRate: outcomes.underemploymentRate,
          averageTimeToEmployment: outcomes.averageTimeToEmployment,
          jobGrowthRate: outcomes.jobGrowthRate,
          retentionRate: outcomes.retentionRate,
          careerProgressionRate: outcomes.careerProgressionRate
        },
        byRole: outcomes.byRole,
        byExperience: outcomes.byExperience,
        trends: outcomes.trends,
        insights: outcomes.insights
      });
    } else {
      outcomeRecord.outcomes = {
        employmentRate: outcomes.employmentRate,
        unemploymentRate: outcomes.unemploymentRate,
        underemploymentRate: outcomes.underemploymentRate,
        averageTimeToEmployment: outcomes.averageTimeToEmployment,
        jobGrowthRate: outcomes.jobGrowthRate,
        retentionRate: outcomes.retentionRate,
        careerProgressionRate: outcomes.careerProgressionRate
      };
      outcomeRecord.byRole = outcomes.byRole;
      outcomeRecord.byExperience = outcomes.byExperience;
      outcomeRecord.trends = outcomes.trends;
      outcomeRecord.insights = outcomes.insights;
      outcomeRecord.lastUpdated = new Date();
    }
    
    await outcomeRecord.save();
    res.json(outcomeRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Regional Training Program Recommendations
app.get('/api/regional/training', authenticateToken, async (req, res) => {
  try {
    const { city, industry } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const shortageRecord = await LocalSkillShortage.findOne({
      'region.city': city,
      industry: industry || { $exists: false }
    }).sort({ 'period.endDate': -1 });
    
    if (!shortageRecord || !shortageRecord.shortages || shortageRecord.shortages.length === 0) {
      return res.status(404).json({ error: 'Please run skill shortage analysis first for this city' });
    }
    
    const recommendations = regionalInsights.recommendRegionalTraining(
      shortageRecord.shortages,
      city,
      industry
    );
    
    const trainingPrograms = recommendations.map(rec => ({
      region: { city, country: 'USA' },
      program: {
        title: rec.title,
        provider: rec.provider,
        type: rec.type,
        duration: rec.duration,
        format: rec.format,
        cost: rec.cost,
        skillsCovered: rec.skillsCovered,
        industryFocus: rec.industryFocus,
        jobPlacementRate: rec.jobPlacementRate,
        averageSalaryAfter: rec.averageSalaryAfter,
        prerequisites: rec.prerequisites,
        url: rec.url,
        contact: rec.contact
      },
      demandAlignment: rec.demandAlignment,
      successMetrics: rec.successMetrics
    }));
    
    for (const program of trainingPrograms) {
      let existingProgram = await RegionalTrainingProgram.findOne({
        'region.city': city,
        'program.title': program.program.title,
        'program.provider': program.program.provider
      });
      
      if (!existingProgram) {
        existingProgram = new RegionalTrainingProgram(program);
        await existingProgram.save();
      } else {
        existingProgram.demandAlignment = program.demandAlignment;
        existingProgram.successMetrics = program.successMetrics;
        existingProgram.lastUpdated = new Date();
        await existingProgram.save();
      }
    }
    
    res.json({
      city,
      industry: industry || 'all',
      recommendations: trainingPrograms,
      totalPrograms: trainingPrograms.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// STUDENT TEST MODULE
// =====================

// Get Available Fields
app.get('/api/test/fields', authenticateToken, async (req, res) => {
  try {
    const fields = ['Frontend', 'Backend', 'Web3', 'DevOps', 'Full-Stack', 'Mobile', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud'];
    res.json({ fields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Test (Manual or AI)
app.post('/api/test/create', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!['admin', 'teacher'].includes(user.role)) {
      return res.status(403).json({ error: 'Only admins and teachers can create tests' });
    }
    
    const { title, description, field, questions, useAI, aiConfig, duration, passingScore, difficulty, instructions } = req.body;
    
    if (!title || !field) {
      return res.status(400).json({ error: 'Title and field are required' });
    }
    
    let questionIds = [];
    
    if (useAI && aiConfig) {
      const aiQuestions = testService.generateAIQuestions(
        field,
        aiConfig.topic || field,
        aiConfig.difficulty || 'medium',
        aiConfig.count || 10
      );
      
      const savedQuestions = await Question.insertMany(aiQuestions);
      questionIds = savedQuestions.map(q => q._id);
    } else if (questions && questions.length > 0) {
      const savedQuestions = await Question.insertMany(questions.map(q => ({
        ...q,
        field,
        questionType: q.questionType || 'multiple-choice'
      })));
      questionIds = savedQuestions.map(q => q._id);
    } else {
      return res.status(400).json({ error: 'Either provide questions or use AI generation' });
    }
    
    const questionDocs = await Question.find({ _id: { $in: questionIds } });
    const totalMarks = questionDocs.reduce((sum, q) => sum + (q.marks || 1), 0);
    
    const test = new Test({
      title,
      description,
      field,
      createdBy: req.user.userId,
      questions: questionIds,
      totalQuestions: questionIds.length,
      totalMarks,
      passingScore: passingScore || 60,
      duration: duration || null,
      difficulty: difficulty || 'intermediate',
      instructions
    });
    
    await test.save();
    await test.populate('questions');
    
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Tests
app.get('/api/test/list', authenticateToken, async (req, res) => {
  try {
    const { field, difficulty, isActive } = req.query;
    let query = {};
    
    if (field) query.field = field;
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const tests = await Test.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Test Details
app.get('/api/test/:id', authenticateToken, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('questions')
      .populate('createdBy', 'firstName lastName');
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Test Attempt
app.post('/api/test/:id/attempt', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can attempt tests' });
    }
    
    const test = await Test.findById(req.params.id).populate('questions');
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    if (!test.isActive) {
      return res.status(400).json({ error: 'Test is not active' });
    }
    
    const existingAttempt = await StudentAttempt.findOne({
      studentId: req.user.userId,
      testId: req.params.id,
      status: 'in-progress'
    });
    
    if (existingAttempt) {
      return res.json(existingAttempt);
    }
    
    const attempt = new StudentAttempt({
      studentId: req.user.userId,
      testId: req.params.id,
      status: 'in-progress',
      timeRemaining: test.duration ? test.duration * 60 : null
    });
    
    await attempt.save();
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Test Answers
app.post('/api/test/attempt/:attemptId/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const attempt = await StudentAttempt.findById(req.params.attemptId)
      .populate('testId');
    
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    
    if (attempt.studentId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    if (attempt.status === 'submitted' || attempt.status === 'completed') {
      return res.status(400).json({ error: 'Test already submitted' });
    }
    
    const test = await Test.findById(attempt.testId._id).populate('questions');
    
    const scoreResult = testService.calculateScore(answers, test.questions);
    
    attempt.answers = answers.map(ans => {
      const question = test.questions.find(q => q._id.toString() === ans.questionId);
      const result = scoreResult.detailedResults.find(r => 
        r.questionId.toString() === ans.questionId
      );
      return {
        questionId: ans.questionId,
        answer: ans.answer,
        isCorrect: result?.isCorrect || false,
        marksObtained: result?.marksObtained || 0,
        timeSpent: ans.timeSpent || 0
      };
    });
    
    attempt.score = {
      obtained: scoreResult.obtained,
      total: scoreResult.total,
      percentage: scoreResult.percentage
    };
    
    attempt.isPassed = scoreResult.percentage >= (test.passingScore || 60);
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    
    await attempt.save();
    
    await updateTestAnalytics(test._id);
    
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Test Result
app.get('/api/test/result/:attemptId', authenticateToken, async (req, res) => {
  try {
    const attempt = await StudentAttempt.findById(req.params.attemptId)
      .populate('testId')
      .populate('answers.questionId');
    
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    
    if (attempt.studentId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Student Attempts
app.get('/api/test/student/attempts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can view their attempts' });
    }
    
    const attempts = await StudentAttempt.find({ studentId: req.user.userId })
      .populate('testId', 'title field difficulty')
      .sort({ createdAt: -1 });
    
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Test Analytics
app.get('/api/test/analytics/:testId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!['admin', 'teacher'].includes(user.role)) {
      return res.status(403).json({ error: 'Only admins and teachers can view analytics' });
    }
    
    const test = await Test.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    const attempts = await StudentAttempt.find({ testId: req.params.testId });
    const analytics = testService.generateAnalytics(attempts, test);
    
    let analyticsRecord = await TestAnalytics.findOne({ testId: req.params.testId });
    if (!analyticsRecord) {
      analyticsRecord = new TestAnalytics({
        testId: req.params.testId,
        ...analytics,
        fieldPerformance: {
          field: test.field,
          averageScore: analytics.averageScore,
          totalAttempts: analytics.totalAttempts
        }
      });
    } else {
      Object.assign(analyticsRecord, analytics);
      analyticsRecord.lastUpdated = new Date();
    }
    
    await analyticsRecord.save();
    res.json(analyticsRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update test analytics
async function updateTestAnalytics(testId) {
  try {
    const test = await Test.findById(testId);
    const attempts = await StudentAttempt.find({ testId });
    const analytics = testService.generateAnalytics(attempts, test);
    
    let analyticsRecord = await TestAnalytics.findOne({ testId });
    if (!analyticsRecord) {
      analyticsRecord = new TestAnalytics({
        testId,
        ...analytics,
        fieldPerformance: {
          field: test.field,
          averageScore: analytics.averageScore,
          totalAttempts: analytics.totalAttempts
        }
      });
    } else {
      Object.assign(analyticsRecord, analytics);
      analyticsRecord.lastUpdated = new Date();
    }
    
    await analyticsRecord.save();
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

// =====================
// INTELLIGENT CAREER ASSISTANT
// =====================

// Enhanced Chatbot - Send Message
app.post('/api/assistant/chat', authenticateToken, async (req, res) => {
  try {
    console.log('Chat endpoint hit - User ID:', req.user.userId);
    const { message, category } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('Processing chat message:', message.substring(0, 50));
    
    // Get user context
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const applications = await JobApplication.find({ userId: req.user.userId });
    const contacts = await Contact.find({ userId: req.user.userId });
    
    const userContext = {
      resumeCount: await Resume.countDocuments({ userId: req.user.userId }),
      atsScore: resume?.atsScore || 0,
      applicationCount: applications.length,
      contactCount: contacts.length,
      skills: resume?.content?.sections?.skills || [],
      currentRole: user.currentRole || 'Professional'
    };
    
    // Generate enhanced response
    const result = careerAssistant.generateChatbotResponse(message, category, userContext);
    
    // Save to chat history
    let chatHistory = await ChatHistory.findOne({ userId: req.user.userId, category: category || 'career-guidance' });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.user.userId,
        category: category || 'career-guidance',
        messages: []
      });
    }
    
    chatHistory.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: result.response }
    );
    await chatHistory.save();
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Real-Time Resume Feedback
app.post('/api/assistant/resume-feedback', authenticateToken, async (req, res) => {
  try {
    const { resumeId } = req.body;
    
    let resume;
    if (resumeId) {
      resume = await Resume.findOne({ 
        _id: resumeId, 
        userId: req.user.userId 
      });
    } else {
      // Get latest resume if no ID provided
      resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    }
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found. Please upload a resume first.' });
    }
    
    const user = await User.findById(req.user.userId);
    
    const feedback = careerAssistant.generateResumeFeedback(resume, user);
    
    // Save feedback
    const resumeFeedback = new ResumeFeedback({
      userId: req.user.userId,
      resumeId: resume._id,
      feedback
    });
    await resumeFeedback.save();
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Personalized Job Search Suggestions
app.get('/api/assistant/job-search', authenticateToken, async (req, res) => {
  try {
    const { keywords, location, jobType, experienceLevel } = req.query;
    
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const applications = await JobApplication.find({ userId: req.user.userId });
    
    const userProfile = {
      skills: resume?.content?.sections?.skills || [],
      currentRole: user.currentRole || 'Professional',
      location: user.location
    };
    
    const query = {
      keywords: keywords ? keywords.split(',') : [],
      location,
      jobType,
      experienceLevel
    };
    
    const suggestions = careerAssistant.generateJobSuggestions(userProfile, query, applications);
    
    // Save search history
    const searchHistory = new JobSearchHistory({
      userId: req.user.userId,
      query,
      suggestions
    });
    await searchHistory.save();
    
    res.json({ suggestions, query });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Growth Tips
app.get('/api/assistant/career-tips', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const progress = await Progress.find({ userId: req.user.userId });
    const assessments = await CareerAssessment.find({ userId: req.user.userId });
    
    const userProfile = {
      skills: [],
      currentRole: user.currentRole || 'Professional'
    };
    
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    if (resume?.content?.sections?.skills) {
      userProfile.skills = resume.content.sections.skills;
    }
    
    const progressData = {};
    progress.forEach(p => {
      progressData[p.module] = p.progress;
    });
    
    const tips = careerAssistant.generateCareerTips(userProfile, progressData, assessments);
    
    // Save tips
    for (const tip of tips) {
      const existingTip = await CareerTip.findOne({
        userId: req.user.userId,
        tipType: tip.tipType,
        title: tip.title,
        isCompleted: false
      });
      
      if (!existingTip) {
        const careerTip = new CareerTip({
          userId: req.user.userId,
          ...tip
        });
        await careerTip.save();
      }
    }
    
    const savedTips = await CareerTip.find({ userId: req.user.userId, isCompleted: false })
      .sort({ priority: -1, generatedAt: -1 })
      .limit(10);
    
    res.json(savedTips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Smart Alerts
app.get('/api/assistant/alerts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const applications = await JobApplication.find({ userId: req.user.userId });
    const contacts = await Contact.find({ userId: req.user.userId });
    
    const alerts = careerAssistant.generateSmartAlerts(user, applications, contacts);
    
    // Save new alerts
    for (const alert of alerts) {
      const existingAlert = await SmartAlert.findOne({
        userId: req.user.userId,
        alertType: alert.alertType,
        title: alert.title,
        isDismissed: false
      });
      
      if (!existingAlert) {
        const smartAlert = new SmartAlert({
          userId: req.user.userId,
          ...alert
        });
        await smartAlert.save();
      }
    }
    
    // Get all active alerts
    const activeAlerts = await SmartAlert.find({
      userId: req.user.userId,
      isDismissed: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ priority: -1, createdAt: -1 });
    
    res.json(activeAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Alert as Read
app.post('/api/assistant/alerts/:id/read', authenticateToken, async (req, res) => {
  try {
    const alert = await SmartAlert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dismiss Alert
app.post('/api/assistant/alerts/:id/dismiss', authenticateToken, async (req, res) => {
  try {
    const alert = await SmartAlert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isDismissed: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Career Tip as Completed
app.post('/api/assistant/career-tips/:id/complete', authenticateToken, async (req, res) => {
  try {
    const tip = await CareerTip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isCompleted: true },
      { new: true }
    );
    if (!tip) return res.status(404).json({ error: 'Tip not found' });
    res.json(tip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// AI CHAT ASSISTANT (Legacy - for backward compatibility)
// =====================

// Send Chat Message
app.post('/api/chat/message', authenticateToken, async (req, res) => {
  try {
    const { message, category } = req.body;
    
    // Simple response generation (in production, this would use OpenAI/Claude/etc.)
    const responses = {
      'career-guidance': `Based on your question about "${message}", I'd recommend focusing on building relevant skills, networking with professionals in your field, and seeking mentorship opportunities. What specific area of career development would you like to explore further?`,
      'resume-feedback': `For your resume, I suggest highlighting quantifiable achievements, using action verbs, and tailoring your content to match job descriptions. Would you like me to review a specific section of your resume?`,
      'job-search': `In your job search, focus on optimizing your LinkedIn profile, applying to positions that match your skills, and preparing for interviews. What stage of the job search process are you currently in?`,
      'skill-development': `For skill development, I recommend identifying in-demand skills in your industry, taking online courses, and working on practical projects. What skills are you looking to develop?`
    };
    
    // Get user context for enhanced response
    const user = await User.findById(req.user.userId);
    const resume = await Resume.findOne({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    const applications = await JobApplication.find({ userId: req.user.userId });
    const contacts = await Contact.find({ userId: req.user.userId });
    
    const userContext = {
      resumeCount: await Resume.countDocuments({ userId: req.user.userId }),
      atsScore: resume?.atsScore || 0,
      applicationCount: applications.length,
      contactCount: contacts.length,
      skills: resume?.content?.sections?.skills || [],
      currentRole: user.currentRole || 'Professional'
    };
    
    // Use enhanced assistant
    const result = careerAssistant.generateChatbotResponse(message, category, userContext);
    
    // Save to chat history
    let chatHistory = await ChatHistory.findOne({ userId: req.user.userId, category: category || 'career-guidance' });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.user.userId,
        category: category || 'career-guidance',
        messages: []
      });
    }
    
    chatHistory.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: result.response }
    );
    
    await chatHistory.save();
    
    res.json({ response: result.response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Chat History
app.get('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const chatHistory = await ChatHistory.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check Endpoint (for testing)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Test Assistant Endpoint (for debugging)
app.get('/api/assistant/test', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Assistant endpoint is accessible',
    userId: req.user.userId,
    timestamp: new Date().toISOString()
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Assistant chat: POST http://localhost:${PORT}/api/assistant/chat\n`);
});
