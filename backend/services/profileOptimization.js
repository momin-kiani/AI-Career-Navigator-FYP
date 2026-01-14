// services/profileOptimization.js
/**
 * Profile Optimization Service
 * 
 * This module implements explainable AI logic for:
 * 1. Profile completeness scoring
 * 2. AI-generated headlines
 * 3. AI-generated summaries
 * 4. LinkedIn post generation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Calculate Profile Completeness Score
 * 
 * Evaluates how complete a user's profile is across multiple dimensions
 * 
 * Methodology:
 * - Check required fields (name, email, location, etc.)
 * - Check optional but valuable fields (skills, experience, URLs)
 * - Check profile sections (summary, headline, etc.)
 * - Weight different sections by importance
 * 
 * @param {Object} user - User profile data
 * @param {Object} linkedInProfile - LinkedIn profile data (optional)
 * @param {Object} resume - Resume data (optional)
 * @returns {Object} Completeness score breakdown
 */
function calculateProfileCompleteness(user, linkedInProfile = null, resume = null) {
  let score = 0;
  const maxScore = 100;
  const breakdown = {
    basicInfo: { score: 0, max: 25, details: {} },
    contactInfo: { score: 0, max: 15, details: {} },
    professionalLinks: { score: 0, max: 20, details: {} },
    profileContent: { score: 0, max: 25, details: {} },
    additionalInfo: { score: 0, max: 15, details: {} }
  };

  // 1. Basic Information (25 points)
  let basicScore = 0;
  if (user.firstName && user.lastName) basicScore += 10;
  if (user.email) basicScore += 10;
  if (user.location && (user.location.city || user.location.country)) basicScore += 5;
  
  breakdown.basicInfo.score = basicScore;
  breakdown.basicInfo.details = {
    hasName: !!(user.firstName && user.lastName),
    hasEmail: !!user.email,
    hasLocation: !!(user.location && (user.location.city || user.location.country))
  };

  // 2. Contact Information (15 points)
  let contactScore = 0;
  if (user.phoneNumber) contactScore += 8;
  if (user.profileImage) contactScore += 7;
  
  breakdown.contactInfo.score = contactScore;
  breakdown.contactInfo.details = {
    hasPhone: !!user.phoneNumber,
    hasProfileImage: !!user.profileImage
  };

  // 3. Professional Links (20 points)
  let linksScore = 0;
  if (user.linkedInUrl) linksScore += 8;
  if (user.githubUrl) linksScore += 6;
  if (user.portfolioUrl) linksScore += 6;
  
  breakdown.professionalLinks.score = linksScore;
  breakdown.professionalLinks.details = {
    hasLinkedIn: !!user.linkedInUrl,
    hasGithub: !!user.githubUrl,
    hasPortfolio: !!user.portfolioUrl
  };

  // 4. Profile Content (25 points)
  let contentScore = 0;
  if (linkedInProfile) {
    if (linkedInProfile.headline && linkedInProfile.headline.length > 20) contentScore += 10;
    if (linkedInProfile.summary && linkedInProfile.summary.length > 100) contentScore += 15;
  }
  if (resume && resume.content && resume.content.rawText && resume.content.rawText.length > 200) {
    contentScore += 10;
  }
  
  breakdown.profileContent.score = Math.min(contentScore, 25);
  breakdown.profileContent.details = {
    hasHeadline: !!(linkedInProfile && linkedInProfile.headline && linkedInProfile.headline.length > 20),
    hasSummary: !!(linkedInProfile && linkedInProfile.summary && linkedInProfile.summary.length > 100),
    hasResume: !!(resume && resume.content && resume.content.rawText && resume.content.rawText.length > 200)
  };

  // 5. Additional Information (15 points)
  let additionalScore = 0;
  if (user.isEmailVerified) additionalScore += 5;
  if (resume && resume.atsScore && resume.atsScore >= 70) additionalScore += 5;
  if (linkedInProfile && linkedInProfile.completenessScore && linkedInProfile.completenessScore >= 70) additionalScore += 5;
  
  breakdown.additionalInfo.score = additionalScore;
  breakdown.additionalInfo.details = {
    emailVerified: !!user.isEmailVerified,
    resumeOptimized: !!(resume && resume.atsScore && resume.atsScore >= 70),
    linkedInOptimized: !!(linkedInProfile && linkedInProfile.completenessScore && linkedInProfile.completenessScore >= 70)
  };

  // Calculate total score
  score = Object.values(breakdown).reduce((sum, section) => sum + section.score, 0);
  score = Math.min(Math.round(score), maxScore);

  // Generate suggestions
  const suggestions = [];
  if (!breakdown.basicInfo.details.hasLocation) {
    suggestions.push({ category: 'Basic Info', suggestion: 'Add your location', priority: 'high' });
  }
  if (!breakdown.contactInfo.details.hasPhone) {
    suggestions.push({ category: 'Contact', suggestion: 'Add your phone number', priority: 'medium' });
  }
  if (!breakdown.professionalLinks.details.hasLinkedIn) {
    suggestions.push({ category: 'Links', suggestion: 'Add your LinkedIn profile URL', priority: 'high' });
  }
  if (!breakdown.profileContent.details.hasHeadline) {
    suggestions.push({ category: 'Content', suggestion: 'Create a professional headline', priority: 'high' });
  }
  if (!breakdown.profileContent.details.hasSummary) {
    suggestions.push({ category: 'Content', suggestion: 'Write a compelling profile summary', priority: 'high' });
  }
  if (!breakdown.profileContent.details.hasResume) {
    suggestions.push({ category: 'Content', suggestion: 'Upload your resume', priority: 'medium' });
  }

  return {
    score,
    maxScore,
    breakdown,
    suggestions,
    grade: score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Improvement'
  };
}

/**
 * Generate AI Headline
 * 
 * Creates an optimized professional headline based on user profile
 * 
 * Methodology:
 * - Extract key information (role, skills, experience)
 * - Use proven headline formulas
 * - Include relevant keywords
 * - Keep within optimal length (120 characters for LinkedIn)
 * 
 * @param {Object} userProfile - User profile data
 * @param {Object} resume - Resume data (optional)
 * @returns {String} Generated headline
 */
function generateHeadline(userProfile, resume = null) {
  const firstName = userProfile.firstName || '';
  const currentRole = userProfile.currentRole || 'Professional';
  
  // Extract skills from resume if available
  let skills = [];
  if (resume && resume.content && resume.content.sections && resume.content.sections.skills) {
    skills = resume.content.sections.skills.slice(0, 3);
  }
  
  const skillText = skills.length > 0 ? skills.join(' • ') : 'Technical & Professional Skills';
  
  // Generate headline variations
  const templates = [
    `${currentRole} | ${skillText}`,
    `${currentRole} Specializing in ${skills[0] || 'Innovation'}`,
    `Experienced ${currentRole} | ${skillText}`,
    `${currentRole} | Passionate about ${skills[0] || 'Excellence'}`,
    `Results-Driven ${currentRole} | ${skillText}`
  ];
  
  let headline = templates[Math.floor(Math.random() * templates.length)];
  
  // Ensure headline is within LinkedIn's 120 character limit
  if (headline.length > 120) {
    headline = headline.substring(0, 117) + '...';
  }
  
  return {
    headline,
    length: headline.length,
    suggestions: [
      'Keep it concise and keyword-rich',
      'Include your current role or expertise',
      'Use industry-relevant keywords',
      'Highlight your unique value proposition'
    ]
  };
}

/**
 * Generate AI Summary
 * 
 * Creates a professional profile summary based on user data
 * 
 * Methodology:
 * - Extract key information (experience, skills, goals)
 * - Structure using proven summary frameworks
 * - Include relevant keywords naturally
 * - Maintain professional tone
 * 
 * @param {Object} userProfile - User profile data
 * @param {Object} resume - Resume data (optional)
 * @returns {String} Generated summary
 */
function generateSummary(userProfile, resume = null) {
  const firstName = userProfile.firstName || '';
  const currentRole = userProfile.currentRole || 'Professional';
  const location = userProfile.location ? `${userProfile.location.city || ''} ${userProfile.location.country || ''}`.trim() : '';
  
  // Extract experience and skills from resume
  let experienceText = '';
  let skillsText = '';
  
  if (resume && resume.content) {
    if (resume.content.sections && resume.content.sections.experience) {
      const experiences = resume.content.sections.experience;
      if (experiences.length > 0) {
        experienceText = `with ${experiences.length} ${experiences.length === 1 ? 'year' : 'years'} of experience`;
      }
    }
    if (resume.content.sections && resume.content.sections.skills) {
      const skills = resume.content.sections.skills;
      skillsText = skills.slice(0, 5).join(', ');
    }
  }
  
  // Generate summary
  let summary = '';
  
  // Opening
  summary += `I'm ${firstName}, a ${currentRole}${experienceText ? ` ${experienceText}` : ''}`;
  if (location) summary += ` based in ${location}`;
  summary += '. ';
  
  // Skills/Expertise
  if (skillsText) {
    summary += `I specialize in ${skillsText}. `;
  } else {
    summary += `I bring expertise in technical and professional skills. `;
  }
  
  // Value proposition
  summary += `I'm passionate about delivering high-quality results and driving innovation. `;
  
  // Closing
  summary += `I'm always open to connecting with professionals in my field and exploring new opportunities.`;
  
  return {
    summary,
    wordCount: summary.split(/\s+/).length,
    suggestions: [
      'Keep it between 200-300 words for optimal engagement',
      'Use first-person narrative',
      'Include relevant keywords naturally',
      'Highlight your unique value proposition',
      'End with a call-to-action for networking'
    ]
  };
}

/**
 * Generate LinkedIn Post
 * 
 * Creates engaging LinkedIn post content based on profile and context
 * 
 * Methodology:
 * - Select topic based on user profile and interests
 * - Use proven LinkedIn post structures (hook, value, CTA)
 * - Include relevant hashtags
 * - Maintain professional yet engaging tone
 * 
 * @param {Object} userProfile - User profile data
 * @param {String} topic - Post topic (optional)
 * @param {String} tone - Post tone (professional, casual, inspirational)
 * @returns {Object} Generated post content
 */
function generateLinkedInPost(userProfile, topic = null, tone = 'professional') {
  const firstName = userProfile.firstName || 'there';
  const currentRole = userProfile.currentRole || 'Professional';
  
  // Select topic if not provided
  const topics = [
    'Career Development',
    'Professional Growth',
    'Industry Insights',
    'Skill Building',
    'Networking',
    'Innovation',
    'Leadership',
    'Technology Trends'
  ];
  
  const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];
  
  // Generate post based on tone
  let post = '';
  const hashtags = [];
  
  if (tone === 'professional') {
    post = `As a ${currentRole}, I've learned that ${selectedTopic.toLowerCase()} is crucial for career success.\n\n`;
    post += `Here are three key insights I've gathered:\n\n`;
    post += `1. Continuous learning keeps you relevant in today's fast-paced industry\n`;
    post += `2. Building meaningful connections opens doors to opportunities\n`;
    post += `3. Staying adaptable helps navigate career transitions\n\n`;
    post += `What's your perspective on ${selectedTopic.toLowerCase()}? I'd love to hear your thoughts in the comments below. 👇\n\n`;
    hashtags.push('#CareerDevelopment', '#ProfessionalGrowth', '#Networking');
  } else if (tone === 'inspirational') {
    post = `🌟 ${selectedTopic} isn't just about reaching goals—it's about the journey.\n\n`;
    post += `Every step forward, every challenge overcome, shapes who we become as professionals.\n\n`;
    post += `Remember: Your career path is unique. Embrace the learning, celebrate the wins, and grow from the setbacks.\n\n`;
    post += `What's one lesson you've learned on your career journey? Share it below! 💪\n\n`;
    hashtags.push('#CareerJourney', '#Motivation', '#ProfessionalGrowth');
  } else {
    post = `Hey LinkedIn! 👋\n\n`;
    post += `Quick thought on ${selectedTopic.toLowerCase()}: It's amazing how much we can learn when we stay curious and open to new ideas.\n\n`;
    post += `What's something new you've learned recently? Drop it in the comments! 🚀\n\n`;
    hashtags.push('#Learning', '#CareerTips', '#ProfessionalDevelopment');
  }
  
  // Add topic-specific hashtags
  if (selectedTopic.includes('Technology')) {
    hashtags.push('#Tech', '#Innovation');
  } else if (selectedTopic.includes('Leadership')) {
    hashtags.push('#Leadership', '#Management');
  }
  
  return {
    content: post,
    hashtags: hashtags.join(' '),
    wordCount: post.split(/\s+/).length,
    estimatedReadTime: Math.ceil(post.split(/\s+/).length / 200), // 200 words per minute
    topic: selectedTopic,
    tone,
    tips: [
      'Post at optimal times (Tuesday-Thursday, 8-10 AM)',
      'Engage with comments within the first hour',
      'Use relevant hashtags (3-5 is optimal)',
      'Include a call-to-action to encourage engagement',
      'Keep posts between 150-300 words for best engagement'
    ]
  };
}

/**
 * Check Badge Eligibility
 * 
 * Determines if user qualifies for profile optimization badges
 * 
 * @param {Object} completeness - Profile completeness data
 * @param {Object} linkedInProfile - LinkedIn profile data
 * @param {Object} resume - Resume data
 * @returns {Array} Eligible badges
 */
function checkBadgeEligibility(completeness, linkedInProfile = null, resume = null) {
  const eligibleBadges = [];
  
  // Profile Optimized Badge
  if (completeness.score >= 90) {
    eligibleBadges.push({
      badgeType: 'profile-optimized',
      badgeName: 'Profile Optimized',
      description: 'Your profile is 90%+ complete and optimized',
      criteria: { profileCompleteness: completeness.score }
    });
  }
  
  // LinkedIn Complete Badge
  if (linkedInProfile && linkedInProfile.completenessScore >= 80) {
    eligibleBadges.push({
      badgeType: 'linkedin-complete',
      badgeName: 'LinkedIn Complete',
      description: 'Your LinkedIn profile is fully optimized',
      criteria: { linkedInScore: linkedInProfile.completenessScore }
    });
  }
  
  // Resume Optimized Badge
  if (resume && resume.atsScore >= 80) {
    eligibleBadges.push({
      badgeType: 'resume-optimized',
      badgeName: 'Resume Optimized',
      description: 'Your resume has an excellent ATS score',
      criteria: { resumeATSScore: resume.atsScore }
    });
  }
  
  return eligibleBadges;
}

module.exports = {
  calculateProfileCompleteness,
  generateHeadline,
  generateSummary,
  generateLinkedInPost,
  checkBadgeEligibility
};
