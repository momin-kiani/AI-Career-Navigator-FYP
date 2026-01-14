// services/communicationAI.js
/**
 * Communication AI Service
 * 
 * This module implements explainable AI logic for:
 * 1. Elevator pitch generation
 * 2. Professional email writing
 * 3. Cover letter generation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Generate Elevator Pitch
 * 
 * Creates a personalized 30-60 second elevator pitch based on user profile
 * 
 * Methodology:
 * - Extract key information from user profile (skills, experience, goals)
 * - Structure pitch using proven frameworks (Problem-Solution-Benefit)
 * - Personalize based on context (networking, interview, job fair)
 * 
 * @param {Object} userProfile - User profile data
 * @param {String} context - Context for pitch (networking, interview, job-fair)
 * @param {String} targetRole - Target role or industry (optional)
 * @returns {String} Generated elevator pitch
 */
function generateElevatorPitch(userProfile, context = 'networking', targetRole = null) {
  const firstName = userProfile.firstName || 'there';
  const experience = userProfile.experience || 'professional';
  const skills = userProfile.skills || [];
  const currentRole = userProfile.currentRole || 'professional';
  const goals = userProfile.goals || 'career growth';
  
  // Extract key skills (top 3-5)
  const keySkills = skills.slice(0, 5).join(', ') || 'technical and professional skills';
  
  // Context-specific openings
  const openings = {
    networking: `Hi, I'm ${firstName}. I'm a ${currentRole} with expertise in ${keySkills}.`,
    interview: `I'm ${firstName}, and I'm excited about this opportunity because my background in ${keySkills} aligns perfectly with what you're looking for.`,
    'job-fair': `Hello! I'm ${firstName}, a ${currentRole} seeking opportunities where I can leverage my experience in ${keySkills}.`,
    elevator: `Hi, I'm ${firstName}. I help companies solve problems through my expertise in ${keySkills}.`
  };
  
  const opening = openings[context] || openings.networking;
  
  // Middle section - value proposition
  const valueProps = [
    `I specialize in ${keySkills} and have a track record of delivering results.`,
    `My experience spans ${keySkills}, and I'm passionate about ${goals}.`,
    `I bring expertise in ${keySkills} and a commitment to excellence.`,
    `With my background in ${keySkills}, I'm looking to make an impact in ${targetRole || 'my next role'}.`
  ];
  
  const valueProp = valueProps[Math.floor(Math.random() * valueProps.length)];
  
  // Closing - call to action
  const closings = {
    networking: `I'd love to connect and learn more about your work. Would you be open to a brief conversation?`,
    interview: `I'm excited about the possibility of contributing to your team and would welcome the opportunity to discuss how my skills can benefit your organization.`,
    'job-fair': `I'd appreciate the chance to learn more about opportunities at your company.`,
    elevator: `I'd love to explore how we might work together.`
  };
  
  const closing = closings[context] || closings.networking;
  
  // Combine into full pitch
  const pitch = `${opening} ${valueProp} ${closing}`;
  
  return {
    pitch,
    wordCount: pitch.split(/\s+/).length,
    estimatedDuration: Math.ceil(pitch.split(/\s+/).length / 2.5), // Average speaking rate: 2.5 words/second
    context,
    tips: [
      'Practice delivering this pitch naturally',
      'Adjust based on your audience',
      'Keep eye contact and maintain enthusiasm',
      'Be ready to answer follow-up questions'
    ]
  };
}

/**
 * Generate Professional Email
 * 
 * Creates professional email drafts for various networking scenarios
 * 
 * Methodology:
 * - Use email templates based on purpose (networking, follow-up, thank-you)
 * - Personalize with recipient name and context
 * - Include clear subject line and call-to-action
 * 
 * @param {Object} params - Email parameters
 * @param {String} params.purpose - Email purpose (networking, follow-up, thank-you, introduction)
 * @param {String} params.recipientName - Recipient's name
 * @param {String} params.recipientRole - Recipient's role
 * @param {String} params.recipientCompany - Recipient's company
 * @param {String} params.context - Additional context or reason for email
 * @param {Object} params.senderProfile - Sender's profile information
 * @returns {Object} Generated email with subject and body
 */
function generateEmail(params) {
  const {
    purpose = 'networking',
    recipientName = 'there',
    recipientRole = '',
    recipientCompany = '',
    context = '',
    senderProfile = {}
  } = params;
  
  const senderName = senderProfile.firstName || 'Professional';
  const senderRole = senderProfile.currentRole || 'Professional';
  const senderCompany = senderProfile.currentCompany || '';
  const senderEmail = senderProfile.email || 'your.email@example.com';
  
  let subject = '';
  let body = '';
  
  // Generate subject line
  const subjects = {
    networking: `Connecting: ${senderName} - ${senderRole}`,
    'follow-up': `Following up: ${context || 'Our conversation'}`,
    'thank-you': `Thank you - ${context || 'Our conversation'}`,
    introduction: `Introduction: ${senderName} - ${senderRole}`,
    'connection-request': `Let's connect - ${senderName}`
  };
  
  subject = subjects[purpose] || subjects.networking;
  
  // Generate email body based on purpose
  switch (purpose) {
    case 'networking':
      body = generateNetworkingEmail(recipientName, recipientRole, recipientCompany, senderName, senderRole, context);
      break;
    case 'follow-up':
      body = generateFollowUpEmail(recipientName, context, senderName);
      break;
    case 'thank-you':
      body = generateThankYouEmail(recipientName, context, senderName);
      break;
    case 'introduction':
      body = generateIntroductionEmail(recipientName, recipientRole, recipientCompany, senderName, senderRole, context);
      break;
    case 'connection-request':
      body = generateConnectionRequestEmail(recipientName, recipientRole, senderName, senderRole, context);
      break;
    default:
      body = generateNetworkingEmail(recipientName, recipientRole, recipientCompany, senderName, senderRole, context);
  }
  
  return {
    subject,
    body,
    purpose,
    wordCount: body.split(/\s+/).length,
    estimatedReadTime: Math.ceil(body.split(/\s+/).length / 200), // Average reading speed: 200 words/minute
    tips: [
      'Personalize the email before sending',
      'Proofread for grammar and spelling',
      'Keep it concise and focused',
      'Include a clear call-to-action'
    ]
  };
}

/**
 * Generate Networking Email
 */
function generateNetworkingEmail(recipientName, recipientRole, recipientCompany, senderName, senderRole, context) {
  return `Dear ${recipientName || 'there'},

${context ? `I came across your profile while ${context}. ` : ''}I'm ${senderName}, a ${senderRole}${recipientCompany ? ` interested in learning more about ${recipientCompany}` : ''}.

${recipientRole ? `I noticed your role as ${recipientRole} and would love to connect with professionals in this space. ` : ''}I'm particularly interested in ${context || 'exploring opportunities and learning from experienced professionals'}.

Would you be open to a brief conversation? I'd appreciate any insights you might share.

Best regards,
${senderName}`;
}

/**
 * Generate Follow-Up Email
 */
function generateFollowUpEmail(recipientName, context, senderName) {
  return `Dear ${recipientName || 'there'},

I wanted to follow up on ${context || 'our recent conversation'}. ${context.includes('application') ? "I'm still very interested in the opportunity and wanted to check on the status." : 'I wanted to see if you had any additional thoughts or questions.'}

I'm happy to provide any additional information you might need. Please let me know if there's anything else I can help with.

Best regards,
${senderName}`;
}

/**
 * Generate Thank You Email
 */
function generateThankYouEmail(recipientName, context, senderName) {
  return `Dear ${recipientName || 'there'},

Thank you for ${context || 'taking the time to speak with me'}. I truly appreciate ${context.includes('interview') ? 'the opportunity to discuss the position' : 'your insights and advice'}.

${context.includes('interview') ? "I'm very excited about the possibility of joining your team and contributing to your organization." : 'Your guidance has been invaluable, and I look forward to staying in touch.'}

Thank you again for your time and consideration.

Best regards,
${senderName}`;
}

/**
 * Generate Introduction Email
 */
function generateIntroductionEmail(recipientName, recipientRole, recipientCompany, senderName, senderRole, context) {
  return `Dear ${recipientName || 'there'},

I hope this email finds you well. My name is ${senderName}, and I'm a ${senderRole}${context ? ` ${context}` : ''}.

${recipientCompany ? `I'm reaching out because I'm interested in learning more about ${recipientCompany} and the work you do as ${recipientRole}. ` : ''}I'd love to connect and learn from your experience.

Would you be available for a brief conversation in the coming weeks? I'd appreciate any insights you might share.

Best regards,
${senderName}`;
}

/**
 * Generate Connection Request Email
 */
function generateConnectionRequestEmail(recipientName, recipientRole, senderName, senderRole, context) {
  return `Dear ${recipientName || 'there'},

I'd like to connect with you on LinkedIn. ${recipientRole ? `I noticed your role as ${recipientRole} and ` : ''}I'm ${senderName}, a ${senderRole}${context ? ` ${context}` : ''}.

I'd love to stay connected and learn from your professional journey.

Best regards,
${senderName}`;
}

/**
 * Generate Cover Letter
 * 
 * Creates a professional cover letter tailored to a specific job application
 * 
 * Methodology:
 * - Extract key information from user profile and resume
 * - Analyze job description for requirements and keywords
 * - Structure using proven cover letter format (Header, Opening, Body, Closing)
 * - Align user skills/experience with job requirements
 * - Include relevant keywords naturally
 * 
 * @param {Object} params - Cover letter parameters
 * @param {Object} params.userProfile - User profile data
 * @param {Object} params.resume - Resume data (optional)
 * @param {String} params.jobTitle - Target job title
 * @param {String} params.companyName - Company name
 * @param {String} params.jobDescription - Job description text (optional)
 * @param {String} params.hiringManagerName - Hiring manager name (optional)
 * @param {String} params.tone - Letter tone (professional, enthusiastic, formal)
 * @returns {Object} Generated cover letter with metadata
 */
function generateCoverLetter(params) {
  const {
    userProfile = {},
    resume = null,
    jobTitle = 'Position',
    companyName = 'Company',
    jobDescription = '',
    hiringManagerName = '',
    tone = 'professional'
  } = params;

  const senderName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Your Name';
  const senderEmail = userProfile.email || 'your.email@example.com';
  const senderPhone = userProfile.phoneNumber || '';
  const senderLocation = userProfile.location 
    ? `${userProfile.location.city || ''}, ${userProfile.location.country || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
    : '';
  const currentRole = userProfile.currentRole || 'Professional';
  const skills = userProfile.skills || [];
  const experience = resume?.content?.sections?.experience || [];

  // Extract key skills from resume or profile
  let keySkills = skills.slice(0, 5);
  if (resume && resume.content && resume.content.sections && resume.content.sections.skills) {
    keySkills = resume.content.sections.skills.slice(0, 5);
  }
  const skillsText = keySkills.length > 0 ? keySkills.join(', ') : 'technical and professional skills';

  // Extract relevant experience
  let experienceText = '';
  if (experience.length > 0) {
    const latestExp = experience[0];
    experienceText = latestExp.title || currentRole;
    if (latestExp.company) {
      experienceText += ` at ${latestExp.company}`;
    }
  } else {
    experienceText = currentRole;
  }

  // Analyze job description for keywords and requirements
  const lowerJobDesc = jobDescription.toLowerCase();
  const jobKeywords = [];
  const commonKeywords = ['leadership', 'team', 'project', 'develop', 'manage', 'analyze', 'implement', 'collaborate', 'innovate', 'strategic'];
  commonKeywords.forEach(keyword => {
    if (lowerJobDesc.includes(keyword)) {
      jobKeywords.push(keyword);
    }
  });

  // Generate cover letter sections
  const greeting = hiringManagerName 
    ? `Dear ${hiringManagerName},`
    : `Dear Hiring Manager,`;

  // Opening paragraph - express interest and introduce yourself
  const openings = {
    professional: `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${skillsText} and experience as ${experienceText}, I am excited about the opportunity to contribute to your team.`,
    enthusiastic: `I am thrilled to apply for the ${jobTitle} role at ${companyName}! As a ${currentRole} with expertise in ${skillsText}, I am eager to bring my passion and skills to your organization.`,
    formal: `I am writing to apply for the ${jobTitle} position at ${companyName}. My professional experience in ${skillsText} and background as ${experienceText} align well with the requirements of this role.`
  };
  const opening = openings[tone] || openings.professional;

  // Body paragraph - highlight relevant skills and experience
  let bodyParagraph = '';
  if (jobDescription) {
    // Match user skills with job requirements
    const matchedSkills = keySkills.filter(skill => 
      lowerJobDesc.includes(skill.toLowerCase())
    );
    
    if (matchedSkills.length > 0) {
      bodyParagraph = `My experience with ${matchedSkills.slice(0, 3).join(', ')} directly aligns with the requirements for this position. `;
    } else {
      bodyParagraph = `My expertise in ${skillsText} positions me well for this role. `;
    }
    
    // Add experience highlights
    if (experience.length > 0) {
      const latestExp = experience[0];
      if (latestExp.description) {
        const expDesc = latestExp.description.substring(0, 150);
        bodyParagraph += `In my current role as ${latestExp.title || currentRole}, I have ${expDesc}. `;
      }
    }
    
    bodyParagraph += `I am confident that my skills and experience make me a strong candidate for this position.`;
  } else {
    bodyParagraph = `My background in ${skillsText} and experience as ${experienceText} have prepared me well for this opportunity. I am particularly drawn to ${companyName} because of ${jobKeywords.length > 0 ? `the focus on ${jobKeywords.slice(0, 2).join(' and ')}` : 'the innovative work you do'}. I am excited about the possibility of contributing to your team's success.`;
  }

  // Closing paragraph - express enthusiasm and call to action
  const closings = {
    professional: `I would welcome the opportunity to discuss how my skills and experience can contribute to ${companyName}. Thank you for considering my application. I look forward to hearing from you.`,
    enthusiastic: `I am excited about the possibility of joining your team and would love to discuss how I can contribute to ${companyName}'s continued success. Thank you for your time and consideration!`,
    formal: `I would appreciate the opportunity to discuss my qualifications further and learn more about this position. Thank you for your consideration.`
  };
  const closing = closings[tone] || closings.professional;

  // Compile full cover letter
  const coverLetter = `${greeting}

${opening}

${bodyParagraph}

${closing}

Sincerely,
${senderName}
${senderEmail}${senderPhone ? `\n${senderPhone}` : ''}${senderLocation ? `\n${senderLocation}` : ''}`;

  return {
    coverLetter,
    wordCount: coverLetter.split(/\s+/).length,
    estimatedReadTime: Math.ceil(coverLetter.split(/\s+/).length / 200),
    tone,
    jobTitle,
    companyName,
    suggestions: [
      'Customize the content based on the specific job requirements',
      'Include specific examples from your experience',
      'Keep it between 250-400 words for optimal length',
      'Proofread carefully for grammar and spelling',
      'Ensure the tone matches the company culture',
      'Highlight quantifiable achievements when possible'
    ],
    keywords: jobKeywords.length > 0 ? jobKeywords : ['Include relevant keywords from the job description'],
    atsScore: calculateCoverLetterATS(coverLetter, jobDescription)
  };
}

/**
 * Calculate Cover Letter ATS Score
 * 
 * Evaluates how well the cover letter aligns with job description
 * 
 * @param {String} coverLetter - Generated cover letter text
 * @param {String} jobDescription - Job description text
 * @returns {Number} ATS compatibility score (0-100)
 */
function calculateCoverLetterATS(coverLetter, jobDescription) {
  if (!jobDescription || jobDescription.trim().length === 0) {
    return 75; // Default score if no job description provided
  }

  const lowerLetter = coverLetter.toLowerCase();
  const lowerJob = jobDescription.toLowerCase();
  
  let score = 0;
  const maxScore = 100;

  // Keyword matching (40 points)
  const jobWords = lowerJob.split(/\s+/).filter(word => word.length > 4);
  const uniqueJobWords = [...new Set(jobWords)];
  const matchedWords = uniqueJobWords.filter(word => lowerLetter.includes(word));
  score += (matchedWords.length / uniqueJobWords.length) * 40;

  // Length check (20 points) - optimal: 250-400 words
  const wordCount = coverLetter.split(/\s+/).length;
  if (wordCount >= 250 && wordCount <= 400) {
    score += 20;
  } else if (wordCount >= 200 && wordCount < 250) {
    score += 15;
  } else if (wordCount > 400 && wordCount <= 500) {
    score += 15;
  } else {
    score += 10;
  }

  // Structure check (20 points) - greeting, body, closing
  if (lowerLetter.includes('dear') && lowerLetter.includes('sincerely')) {
    score += 20;
  } else if (lowerLetter.includes('dear') || lowerLetter.includes('sincerely')) {
    score += 10;
  }

  // Professional tone (20 points) - check for professional language
  const professionalIndicators = ['experience', 'skills', 'contribute', 'opportunity', 'excited', 'confident'];
  const foundIndicators = professionalIndicators.filter(indicator => lowerLetter.includes(indicator));
  score += (foundIndicators.length / professionalIndicators.length) * 20;

  return Math.min(Math.round(score), 100);
}

module.exports = {
  generateElevatorPitch,
  generateEmail,
  generateCoverLetter
};
