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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update through this endpoint

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

// Upload Resume
app.post('/api/resume/upload', authenticateToken, async (req, res) => {
  try {
    const { fileName, content } = req.body;

    // Simple ATS scoring algorithm (you can enhance this)
    const calculateATSScore = (content) => {
      let score = 0;
      
      // Check for key sections
      if (content.toLowerCase().includes('experience')) score += 20;
      if (content.toLowerCase().includes('education')) score += 20;
      if (content.toLowerCase().includes('skills')) score += 20;
      
      // Check for keywords
      const keywords = ['project', 'manage', 'develop', 'team', 'achieve'];
      keywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword)) score += 4;
      });
      
      // Length check
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
        suggestions: [
          'Add more quantifiable achievements',
          'Include relevant certifications',
          'Optimize keywords for ATS'
        ],
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
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Resume by ID
app.get('/api/resume/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate AI Bullet Points
app.post('/api/resume/generate-bullets', authenticateToken, async (req, res) => {
  try {
    const { role, experience } = req.body;
    
    // Simulated AI-generated bullet points
    const bulletPoints = [
      `Led cross-functional team of 5 members to deliver ${role} project, resulting in 30% efficiency improvement`,
      `Implemented innovative solutions that reduced operational costs by $50,000 annually`,
      `Collaborated with stakeholders to define requirements and ensure 100% on-time delivery`
    ];

    res.json({ bulletPoints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// JOB APPLICATION MANAGEMENT
// =====================

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

// Get All Applications
app.get('/api/jobs/applications', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user.userId };
    
    if (status) {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Application Status
app.put('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Application
app.delete('/api/jobs/applications/:id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze Skill Match
app.post('/api/jobs/analyze-match', authenticateToken, async (req, res) => {
  try {
    const { jobDescription, userSkills } = req.body;
    
    // Simple skill matching algorithm
    const jobSkills = jobDescription.toLowerCase()
      .match(/\b(?:python|javascript|react|node|mongodb|sql|leadership|management)\b/g) || [];
    
    const matched = userSkills.filter(skill => 
      jobSkills.includes(skill.toLowerCase())
    );
    
    const missing = jobSkills.filter(skill => 
      !userSkills.some(userSkill => userSkill.toLowerCase() === skill)
    );

    const score = matched.length / Math.max(jobSkills.length, 1) * 100;

    res.json({
      score: Math.round(score),
      matchedSkills: matched,
      missingSkills: [...new Set(missing)]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// LINKEDIN PROFILE OPTIMIZATION
// =====================

// Get LinkedIn Profile
app.get('/api/linkedin/profile', authenticateToken, async (req, res) => {
  try {
    let profile = await LinkedInProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      // Create initial profile
      profile = new LinkedInProfile({
        userId: req.user.userId,
        completenessScore: 0,
        suggestions: [
          { category: 'headline', suggestion: 'Add a compelling headline', priority: 'high', completed: false },
          { category: 'summary', suggestion: 'Write a detailed summary', priority: 'high', completed: false },
          { category: 'skills', suggestion: 'Add relevant skills', priority: 'medium', completed: false }
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
    
    // Calculate completeness score
    let score = 0;
    if (headline) score += 30;
    if (summary && summary.length > 100) score += 40;
    if (profileUrl) score += 30;

    const profile = await LinkedInProfile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        $set: {
          headline,
          summary,
          profileUrl,
          completenessScore: score,
          lastAnalyzed: new Date()
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate LinkedIn Post
app.post('/api/linkedin/generate-post', authenticateToken, async (req, res) => {
  try {
    const { topic, tone } = req.body;
    
    // Simulated AI post generation
    const post = `Excited to share my thoughts on ${topic}! 🚀

In today's rapidly evolving landscape, ${topic} has become more important than ever. Here are 3 key insights:

1️⃣ Innovation drives progress
2️⃣ Continuous learning is essential
3️⃣ Collaboration creates opportunities

What's your take on ${topic}? Let's discuss in the comments! 💬

#${topic.replace(/\s+/g, '')} #CareerGrowth #ProfessionalDevelopment`;

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// CAREER ASSESSMENT
// =====================

// Submit Career Assessment
app.post('/api/assessment/submit', authenticateToken, async (req, res) => {
  try {
    const { assessmentType, responses } = req.body;

    // Simulated career matching algorithm
    const careers = [
      { title: 'Software Engineer', matchScore: 85, reasons: ['Strong analytical skills', 'Technical aptitude'] },
      { title: 'Product Manager', matchScore: 78, reasons: ['Leadership qualities', 'Strategic thinking'] },
      { title: 'Data Scientist', matchScore: 72, reasons: ['Problem-solving ability', 'Quantitative skills'] }
    ];

    const assessment = new CareerAssessment({
      userId: req.user.userId,
      assessmentType,
      responses,
      results: {
        personalityType: 'INTJ',
        traits: [
          { name: 'Analytical', score: 85 },
          { name: 'Creative', score: 72 },
          { name: 'Leadership', score: 68 }
        ],
        recommendedCareers: careers,
        skillGaps: [
          { skill: 'Public Speaking', currentLevel: 3, requiredLevel: 7, priority: 'medium' },
          { skill: 'Data Analysis', currentLevel: 5, requiredLevel: 8, priority: 'high' }
        ]
      },
      completedAt: new Date()
    });

    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Assessment Results
app.get('/api/assessment/results', authenticateToken, async (req, res) => {
  try {
    const assessments = await CareerAssessment.find({ userId: req.user.userId })
      .sort({ completedAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// MENTORSHIP
// =====================

// Get Available Mentors
app.get('/api/mentors', authenticateToken, async (req, res) => {
  try {
    const { industry, expertise } = req.query;
    const query = { availableForMentorship: true };
    
    if (industry) query.industry = industry;
    if (expertise) query.expertise = expertise;

    const mentors = await Mentor.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ rating: -1 });
    
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request Mentorship
app.post('/api/mentors/:id/request', authenticateToken, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    mentor.mentees.push({
      userId: req.user.userId,
      startDate: new Date(),
      status: 'pending'
    });

    await mentor.save();
    res.json({ message: 'Mentorship request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// LABOR MARKET ANALYTICS
// =====================

// Get Market Insights
app.get('/api/market/insights', authenticateToken, async (req, res) => {
  try {
    const { industry, region } = req.query;
    const query = {};
    
    if (industry) query.industry = industry;
    if (region) query['region.city'] = region;

    const data = await LaborMarketData.find(query)
      .sort({ demandScore: -1 })
      .limit(20);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Salary Benchmarks
app.get('/api/market/salary/:jobTitle', authenticateToken, async (req, res) => {
  try {
    const data = await LaborMarketData.findOne({
      jobTitle: new RegExp(req.params.jobTitle, 'i')
    });

    if (!data) {
      return res.status(404).json({ error: 'Salary data not found' });
    }

    res.json(data.salaryRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// CHAT ASSISTANT
// =====================

// Send Message to Assistant
app.post('/api/chat/message', authenticateToken, async (req, res) => {
  try {
    const { message, category } = req.body;

    // Find or create chat history
    let chat = await ChatHistory.findOne({
      userId: req.user.userId,
      category
    });

    if (!chat) {
      chat = new ChatHistory({
        userId: req.user.userId,
        category,
        messages: []
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message
    });

    // Simulated AI response
    const aiResponse = `Thank you for your question about "${message}". Based on your profile and current market trends, here's my recommendation: Focus on developing your key skills and networking with professionals in your target industry. Would you like specific resources or guidance?`;

    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await chat.save();
    res.json({ response: aiResponse, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Chat History
app.get('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const chats = await ChatHistory.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});