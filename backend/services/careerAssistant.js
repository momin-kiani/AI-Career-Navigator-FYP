// services/careerAssistant.js
/**
 * Intelligent Career Assistant Service
 * 
 * This module implements explainable AI logic for:
 * 1. Enhanced chatbot responses
 * 2. Real-time resume feedback
 * 3. Personalized job search suggestions
 * 4. Career growth tips
 * 5. Smart alerts generation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Generate Enhanced Chatbot Response
 * 
 * Creates context-aware responses based on user query and profile
 * 
 * Methodology:
 * - Analyze query intent (keyword matching)
 * - Extract user context (profile, resume, job applications)
 * - Select appropriate response template
 * - Personalize with user-specific information
 * 
 * @param {String} message - User message
 * @param {String} category - Query category
 * @param {Object} userContext - User profile, resume, applications data
 * @returns {Object} Response with message and suggestions
 */
function generateChatbotResponse(message, category, userContext = {}) {
  const lowerMessage = message.toLowerCase();
  let response = '';
  let suggestions = [];
  
  // Intent detection based on keywords
  const intents = {
    resume: ['resume', 'cv', 'curriculum vitae', 'resume feedback', 'ats'],
    jobSearch: ['job', 'position', 'opportunity', 'apply', 'hiring', 'career'],
    interview: ['interview', 'prepare', 'questions', 'answers', 'meeting'],
    skills: ['skill', 'learn', 'develop', 'training', 'course', 'certification'],
    networking: ['network', 'connect', 'linkedin', 'contact', 'professional'],
    salary: ['salary', 'compensation', 'pay', 'income', 'earn']
  };
  
  // Detect primary intent
  let detectedIntent = category || 'career-guidance';
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedIntent = intent;
      break;
    }
  }
  
  // Generate response based on intent and context
  switch (detectedIntent) {
    case 'resume':
      response = generateResumeGuidance(message, userContext);
      suggestions = [
        'Upload your resume for AI feedback',
        'Check your ATS score',
        'Get resume optimization suggestions'
      ];
      break;
      
    case 'jobSearch':
      response = generateJobSearchGuidance(message, userContext);
      suggestions = [
        'Browse personalized job suggestions',
        'Track your applications',
        'Get skill-job match analysis'
      ];
      break;
      
    case 'interview':
      response = generateInterviewGuidance(message, userContext);
      suggestions = [
        'Practice common interview questions',
        'Prepare for behavioral interviews',
        'Research the company'
      ];
      break;
      
    case 'skills':
      response = generateSkillDevelopmentGuidance(message, userContext);
      suggestions = [
        'Explore career growth tips',
        'Find learning resources',
        'Identify skill gaps'
      ];
      break;
      
    case 'networking':
      response = generateNetworkingGuidance(message, userContext);
      suggestions = [
        'Build your professional network',
        'Optimize your LinkedIn profile',
        'Generate elevator pitches'
      ];
      break;
      
    default:
      response = generateGeneralGuidance(message, userContext);
      suggestions = [
        'Explore all career modules',
        'Complete your profile',
        'Take a career assessment'
      ];
  }
  
  return {
    response,
    suggestions,
    intent: detectedIntent,
    confidence: 0.85 // Explainable confidence score
  };
}

function generateResumeGuidance(message, userContext) {
  const resumeCount = userContext.resumeCount || 0;
  const atsScore = userContext.atsScore || 0;
  
  let guidance = 'For your resume, I recommend:\n\n';
  
  if (resumeCount === 0) {
    guidance += '1. Upload your resume to get started with AI-powered feedback\n';
    guidance += '2. Ensure all key sections are present (Experience, Education, Skills, Summary)\n';
    guidance += '3. Use action verbs and quantify achievements\n';
  } else {
    guidance += `1. Your current ATS score is ${atsScore}% - ${atsScore >= 70 ? 'Great job!' : 'There\'s room for improvement'}\n`;
    guidance += '2. Tailor your resume to match job descriptions\n';
    guidance += '3. Highlight quantifiable achievements with numbers\n';
  }
  
  guidance += '\nWould you like me to analyze your resume in detail?';
  return guidance;
}

function generateJobSearchGuidance(message, userContext) {
  const applicationCount = userContext.applicationCount || 0;
  
  let guidance = 'For your job search, I suggest:\n\n';
  guidance += '1. Use personalized job search to find roles matching your skills\n';
  guidance += '2. Optimize your LinkedIn profile for better visibility\n';
  guidance += '3. Network with professionals in your target industry\n';
  
  if (applicationCount > 0) {
    guidance += `\nYou've applied to ${applicationCount} position(s). Keep track of your applications and follow up!`;
  }
  
  return guidance;
}

function generateInterviewGuidance(message, userContext) {
  return `For interview preparation:\n\n1. Research the company and role thoroughly\n2. Prepare STAR method answers for behavioral questions\n3. Practice common questions related to your field\n4. Prepare thoughtful questions to ask the interviewer\n5. Dress professionally and arrive early\n\nWould you like specific interview tips for your industry?`;
}

function generateSkillDevelopmentGuidance(message, userContext) {
  return `For skill development:\n\n1. Identify in-demand skills in your target industry\n2. Take online courses or certifications\n3. Work on practical projects to build experience\n4. Join professional communities and forums\n5. Seek mentorship opportunities\n\nI can provide personalized learning recommendations based on your career goals.`;
}

function generateNetworkingGuidance(message, userContext) {
  const contactCount = userContext.contactCount || 0;
  
  let guidance = 'For networking:\n\n';
  guidance += '1. Optimize your LinkedIn profile with a professional headline\n';
  guidance += '2. Engage with industry content and share insights\n';
  guidance += '3. Attend virtual or in-person networking events\n';
  
  if (contactCount > 0) {
    guidance += `\nYou have ${contactCount} contact(s) in your network. Consider reaching out for informational interviews!`;
  }
  
  return guidance;
}

function generateGeneralGuidance(message, userContext) {
  return `I'm here to help with your career journey! I can assist with:\n\n• Resume optimization and feedback\n• Job search strategies\n• Interview preparation\n• Skill development\n• Networking tips\n• Career planning\n\nWhat specific area would you like to explore?`;
}

/**
 * Generate Real-Time Resume Feedback
 * 
 * Analyzes resume and provides actionable feedback
 * 
 * @param {Object} resume - Resume data
 * @param {Object} userProfile - User profile data
 * @returns {Object} Detailed feedback
 */
function generateResumeFeedback(resume, userProfile = {}) {
  const content = resume.content?.rawText || '';
  const lowerContent = content.toLowerCase();
  
  const feedback = {
    overallScore: resume.atsScore || 0,
    strengths: [],
    weaknesses: [],
    suggestions: [],
    improvements: [],
    keywordAnalysis: {
      found: [],
      missing: [],
      recommendations: []
    }
  };
  
  // Analyze strengths
  if (content.length > 200) feedback.strengths.push('Good content length');
  if (lowerContent.includes('experience') || lowerContent.includes('work')) {
    feedback.strengths.push('Experience section present');
  }
  if (lowerContent.includes('education') || lowerContent.includes('degree')) {
    feedback.strengths.push('Education section present');
  }
  
  // Analyze weaknesses
  if (content.length < 200) feedback.weaknesses.push('Content is too short - aim for 200-800 words');
  if (!lowerContent.match(/\d+/)) {
    feedback.weaknesses.push('Missing quantifiable achievements - add numbers and metrics');
  }
  
  // Keyword analysis
  const importantKeywords = ['leadership', 'management', 'project', 'develop', 'team', 'achieve', 'results'];
  importantKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      feedback.keywordAnalysis.found.push(keyword);
    } else {
      feedback.keywordAnalysis.missing.push(keyword);
    }
  });
  
  // Generate suggestions
  if (feedback.overallScore < 70) {
    feedback.suggestions.push({
      category: 'Content',
      suggestion: 'Add more quantifiable achievements with specific numbers',
      priority: 'high'
    });
  }
  
  if (feedback.keywordAnalysis.missing.length > 0) {
    feedback.suggestions.push({
      category: 'Keywords',
      suggestion: `Include relevant keywords: ${feedback.keywordAnalysis.missing.slice(0, 3).join(', ')}`,
      priority: 'medium'
    });
  }
  
  feedback.improvements = [
    'Use action verbs (led, developed, implemented)',
    'Quantify achievements (increased sales by 20%)',
    'Tailor content to match job descriptions',
    'Keep formatting clean and ATS-friendly'
  ];
  
  return feedback;
}

/**
 * Generate Personalized Job Search Suggestions
 * 
 * Creates job recommendations based on user profile and preferences
 * 
 * @param {Object} userProfile - User profile data
 * @param {Object} query - Search query parameters
 * @param {Array} userApplications - User's existing applications
 * @returns {Array} Job suggestions with match scores
 */
function generateJobSuggestions(userProfile, query, userApplications = []) {
  const suggestions = [];
  
  // Extract user skills from resume/profile
  const userSkills = userProfile.skills || [];
  const currentRole = userProfile.currentRole || 'Professional';
  const location = query.location || userProfile.location?.city || '';
  
  // Generate mock suggestions (in production, would query job database)
  const mockJobs = [
    {
      jobTitle: `${currentRole} - Senior Level`,
      company: 'Tech Corp',
      location: location || 'Remote',
      matchScore: 85,
      reasons: [
        'Matches your current role',
        'Skills alignment: ' + userSkills.slice(0, 2).join(', '),
        'Location preference match'
      ]
    },
    {
      jobTitle: `${currentRole} - Mid Level`,
      company: 'Innovation Labs',
      location: location || 'Hybrid',
      matchScore: 78,
      reasons: [
        'Good skill match',
        'Growth opportunities',
        'Competitive benefits'
      ]
    }
  ];
  
  // Filter out jobs user already applied to
  const appliedJobTitles = userApplications.map(app => app.jobTitle?.toLowerCase() || '');
  const filteredJobs = mockJobs.filter(job => 
    !appliedJobTitles.includes(job.jobTitle.toLowerCase())
  );
  
  return filteredJobs.map(job => ({
    ...job,
    jobUrl: `#/jobs/${job.jobTitle.replace(/\s+/g, '-').toLowerCase()}`
  }));
}

/**
 * Generate Career Growth Tips
 * 
 * Provides personalized career development recommendations
 * 
 * @param {Object} userProfile - User profile data
 * @param {Object} userProgress - User progress data
 * @param {Array} userAssessments - User assessment results
 * @returns {Array} Career tips
 */
function generateCareerTips(userProfile, userProgress = {}, userAssessments = []) {
  const tips = [];
  
  // Skill development tip
  if (userProfile.skills && userProfile.skills.length < 5) {
    tips.push({
      tipType: 'skill-development',
      title: 'Expand Your Skill Set',
      description: 'Consider learning new skills relevant to your career goals',
      content: 'Based on your profile, I recommend focusing on in-demand skills in your industry. Take online courses, work on projects, and build a portfolio.',
      actionItems: [
        'Identify 2-3 skills to develop',
        'Enroll in relevant courses',
        'Practice through projects'
      ],
      priority: 'high'
    });
  }
  
  // Networking tip
  tips.push({
    tipType: 'networking',
    title: 'Build Your Professional Network',
    description: 'Expand your network to discover opportunities',
    content: 'Networking is crucial for career growth. Connect with professionals in your field, attend events, and engage on LinkedIn.',
    actionItems: [
      'Optimize your LinkedIn profile',
      'Connect with 5 new professionals this week',
      'Join industry groups and forums'
    ],
    priority: 'medium'
  });
  
  // Interview prep tip
  tips.push({
    tipType: 'interview-prep',
    title: 'Prepare for Interviews',
    description: 'Practice common interview questions',
    content: 'Prepare STAR method answers for behavioral questions. Research companies before interviews and prepare thoughtful questions.',
    actionItems: [
      'Practice common interview questions',
      'Prepare your elevator pitch',
      'Research target companies'
    ],
    priority: 'medium'
  });
  
  return tips;
}

/**
 * Generate Smart Alerts
 * 
 * Creates alerts for jobs, deadlines, and market changes
 * 
 * @param {Object} userProfile - User profile data
 * @param {Array} userApplications - User's job applications
 * @param {Array} userContacts - User's contacts
 * @returns {Array} Smart alerts
 */
function generateSmartAlerts(userProfile, userApplications = [], userContacts = []) {
  const alerts = [];
  
  // Check for approaching deadlines
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  userApplications.forEach(app => {
    if (app.deadline && new Date(app.deadline) <= nextWeek && new Date(app.deadline) > now) {
      alerts.push({
        alertType: 'deadline-approaching',
        title: `Application Deadline Approaching: ${app.jobTitle}`,
        message: `The deadline for ${app.company} is on ${new Date(app.deadline).toLocaleDateString()}. Don't forget to follow up!`,
        priority: 'high',
        metadata: { applicationId: app._id }
      });
    }
  });
  
  // Job match alert (if user has skills but no recent applications)
  if (userProfile.skills && userProfile.skills.length > 0 && userApplications.length === 0) {
    alerts.push({
      alertType: 'job-match',
      title: 'New Job Opportunities Available',
      message: 'Based on your skills, there are new job opportunities that might interest you. Check your personalized job suggestions!',
      priority: 'medium',
      metadata: {}
    });
  }
  
  // Market change alert
  alerts.push({
    alertType: 'market-change',
    title: 'Industry Trends Update',
    message: 'Stay updated with the latest trends in your industry. Check market insights for growth projections and skill demands.',
    priority: 'low',
    metadata: {}
  });
  
  return alerts;
}

module.exports = {
  generateChatbotResponse,
  generateResumeFeedback,
  generateJobSuggestions,
  generateCareerTips,
  generateSmartAlerts
};
