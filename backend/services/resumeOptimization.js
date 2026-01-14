// services/resumeOptimization.js
/**
 * Resume Optimization Service
 * 
 * This module implements explainable AI logic for:
 * 1. ATS score calculation
 * 2. Resume optimization suggestions
 * 3. AI-generated bullet points and summaries
 * 4. Resume-job description alignment
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Enhanced ATS Score Calculation
 * 
 * Methodology:
 * - Section completeness (Experience, Education, Skills, Summary)
 * - Keyword density and relevance
 * - Formatting compliance (length, structure)
 * - Action verb usage
 * - Quantifiable achievements
 * 
 * @param {String} content - Resume text content
 * @returns {Object} ATS score breakdown and detailed metrics
 */
function calculateATSScore(content) {
  const lowerContent = content.toLowerCase();
  let score = 0;
  const maxScore = 100;
  const metrics = {
    sections: { score: 0, max: 25, details: {} },
    keywords: { score: 0, max: 30, details: {} },
    formatting: { score: 0, max: 20, details: {} },
    achievements: { score: 0, max: 15, details: {} },
    actionVerbs: { score: 0, max: 10, details: {} }
  };

  // 1. Section Completeness (25 points)
  const requiredSections = ['experience', 'education', 'skills', 'summary'];
  const foundSections = requiredSections.filter(section => 
    lowerContent.includes(section) || lowerContent.includes(section.slice(0, -1))
  );
  metrics.sections.score = (foundSections.length / requiredSections.length) * 25;
  metrics.sections.details = {
    found: foundSections,
    missing: requiredSections.filter(s => !foundSections.includes(s))
  };

  // 2. Keyword Analysis (30 points)
  const commonKeywords = [
    'leadership', 'management', 'team', 'project', 'develop', 'design', 'implement',
    'analyze', 'strategic', 'communication', 'collaboration', 'problem-solving',
    'innovation', 'results', 'achievement', 'improve', 'optimize', 'execute'
  ];
  const foundKeywords = commonKeywords.filter(keyword => lowerContent.includes(keyword));
  const keywordDensity = foundKeywords.length / commonKeywords.length;
  metrics.keywords.score = Math.min(keywordDensity * 30, 30);
  metrics.keywords.details = {
    found: foundKeywords,
    missing: commonKeywords.filter(k => !foundKeywords.includes(k)).slice(0, 5),
    density: Math.round(keywordDensity * 100)
  };

  // 3. Formatting Compliance (20 points)
  const wordCount = content.split(/\s+/).length;
  let formattingScore = 0;
  if (wordCount >= 200 && wordCount <= 800) {
    formattingScore = 10; // Optimal length
  } else if (wordCount >= 150 && wordCount < 200) {
    formattingScore = 7; // Slightly short
  } else if (wordCount > 800 && wordCount <= 1200) {
    formattingScore = 7; // Slightly long
  } else {
    formattingScore = 3; // Too short or too long
  }
  
  // Check for bullet points
  const bulletPoints = (content.match(/[•\-\*]/g) || []).length;
  formattingScore += Math.min((bulletPoints / 10) * 10, 10);
  
  metrics.formatting.score = formattingScore;
  metrics.formatting.details = {
    wordCount,
    bulletPoints,
    status: wordCount >= 200 && wordCount <= 800 ? 'optimal' : wordCount < 200 ? 'too-short' : 'too-long'
  };

  // 4. Quantifiable Achievements (15 points)
  const numberPattern = /\d+%/g; // Percentages
  const numbers = content.match(/\d+/g) || [];
  const percentages = content.match(numberPattern) || [];
  const achievementIndicators = ['increased', 'decreased', 'improved', 'reduced', 'achieved', 'exceeded'];
  const hasAchievements = achievementIndicators.some(indicator => lowerContent.includes(indicator));
  const hasNumbers = numbers.length >= 3;
  const hasPercentages = percentages.length >= 1;
  
  let achievementScore = 0;
  if (hasAchievements && hasNumbers && hasPercentages) achievementScore = 15;
  else if (hasAchievements && (hasNumbers || hasPercentages)) achievementScore = 10;
  else if (hasAchievements || hasNumbers) achievementScore = 5;
  
  metrics.achievements.score = achievementScore;
  metrics.achievements.details = {
    hasAchievements,
    numberCount: numbers.length,
    percentageCount: percentages.length,
    indicators: achievementIndicators.filter(i => lowerContent.includes(i))
  };

  // 5. Action Verbs (10 points)
  const actionVerbs = [
    'led', 'managed', 'developed', 'designed', 'implemented', 'created', 'improved',
    'increased', 'achieved', 'delivered', 'executed', 'optimized', 'analyzed',
    'collaborated', 'coordinated', 'established', 'launched', 'transformed'
  ];
  const foundVerbs = actionVerbs.filter(verb => lowerContent.includes(verb));
  metrics.actionVerbs.score = Math.min((foundVerbs.length / actionVerbs.length) * 10, 10);
  metrics.actionVerbs.details = {
    found: foundVerbs,
    missing: actionVerbs.filter(v => !foundVerbs.includes(v)).slice(0, 5)
  };

  // Calculate total score
  score = Object.values(metrics).reduce((sum, metric) => sum + metric.score, 0);
  score = Math.min(Math.round(score), maxScore);

  return {
    score,
    maxScore,
    breakdown: metrics,
    grade: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement'
  };
}

/**
 * Generate AI Bullet Points
 * 
 * Transforms existing experience descriptions into optimized, ATS-friendly bullet points
 * 
 * Methodology:
 * - Extract experience entries
 * - Identify missing action verbs
 * - Add quantifiable metrics where possible
 * - Ensure keyword alignment
 * 
 * @param {String} content - Resume content
 * @param {Array} experiences - Extracted experience entries
 * @returns {Array} Optimized bullet points
 */
function generateBulletPoints(content, experiences = []) {
  const bulletPoints = [];
  const actionVerbs = ['Led', 'Managed', 'Developed', 'Designed', 'Implemented', 'Created', 'Improved', 'Increased', 'Achieved'];
  
  // Extract experience descriptions
  const experiencePattern = /(?:experience|work|employment)[\s\S]*?(?=education|skills|$)/i;
  const experienceMatch = content.match(experiencePattern);
  
  if (experienceMatch) {
    const experienceText = experienceMatch[0];
    const sentences = experienceText.split(/[.!?]\s+/).filter(s => s.trim().length > 20);
    
    sentences.slice(0, 5).forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length < 10) return;
      
      // Check if already starts with action verb
      const startsWithVerb = actionVerbs.some(verb => trimmed.toLowerCase().startsWith(verb.toLowerCase()));
      
      let optimized = trimmed;
      if (!startsWithVerb) {
        // Add action verb
        const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
        optimized = `${randomVerb} ${trimmed.toLowerCase()}`;
      }
      
      // Add quantifier if missing numbers
      if (!/\d+/.test(optimized)) {
        optimized += ' resulting in measurable improvements';
      }
      
      bulletPoints.push({
        original: trimmed,
        optimized: optimized.charAt(0).toUpperCase() + optimized.slice(1),
        improvement: !startsWithVerb ? 'Added action verb' : 'Enhanced with metrics'
      });
    });
  }
  
  // Generate additional suggestions
  if (bulletPoints.length < 3) {
    const suggestions = [
      'Led cross-functional teams to deliver projects on time and within budget',
      'Developed and implemented strategies that increased efficiency by 25%',
      'Managed multiple projects simultaneously while maintaining high quality standards',
      'Created innovative solutions that improved user satisfaction',
      'Analyzed data to identify trends and make data-driven decisions'
    ];
    
    suggestions.slice(0, 3 - bulletPoints.length).forEach(suggestion => {
      bulletPoints.push({
        original: null,
        optimized: suggestion,
        improvement: 'AI-generated suggestion'
      });
    });
  }
  
  return bulletPoints;
}

/**
 * Generate Professional Summary
 * 
 * Creates an optimized resume summary based on content analysis
 * 
 * @param {String} content - Resume content
 * @returns {String} Generated summary
 */
function generateSummary(content) {
  const lowerContent = content.toLowerCase();
  
  // Extract key information
  const hasExperience = lowerContent.includes('experience') || lowerContent.includes('worked');
  const hasSkills = lowerContent.includes('skills') || lowerContent.includes('proficient');
  const yearsPattern = /(\d+)\s*(?:years?|yrs?)/i;
  const yearsMatch = content.match(yearsPattern);
  const years = yearsMatch ? yearsMatch[1] : 'several';
  
  // Identify key skills/roles
  const roleKeywords = ['engineer', 'manager', 'developer', 'analyst', 'designer', 'specialist'];
  const identifiedRole = roleKeywords.find(role => lowerContent.includes(role)) || 'professional';
  
  const templates = [
    `Experienced ${identifiedRole} with ${years} years of expertise in delivering high-quality results. Proven track record of success in collaborative environments.`,
    `Results-driven ${identifiedRole} with ${years} years of experience. Skilled in problem-solving and strategic thinking with a focus on achieving measurable outcomes.`,
    `Dynamic ${identifiedRole} with ${years} years of professional experience. Strong background in leadership, innovation, and driving organizational success.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Align Resume with Job Description
 * 
 * Compares resume content with job description and provides alignment score
 * 
 * Methodology:
 * - Extract keywords from job description
 * - Match keywords in resume
 * - Calculate alignment percentage
 * - Identify missing skills/requirements
 * 
 * @param {String} resumeContent - Resume text
 * @param {String} jobDescription - Job description text
 * @returns {Object} Alignment analysis
 */
function alignResumeWithJob(resumeContent, jobDescription) {
  const resumeLower = resumeContent.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeContent);
  
  // Calculate matches
  const matchedKeywords = jobKeywords.filter(keyword => resumeKeywords.includes(keyword));
  const missingKeywords = jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));
  
  // Calculate alignment score
  const alignmentScore = jobKeywords.length > 0 
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 0;
  
  // Extract required skills from job description
  const skillPattern = /(?:required|must have|skills?)[\s\S]*?(?=preferred|qualifications|$)/i;
  const skillMatch = jobDescription.match(skillPattern);
  const requiredSkills = skillMatch ? extractSkills(skillMatch[0]) : [];
  
  // Check resume for these skills
  const foundSkills = requiredSkills.filter(skill => resumeLower.includes(skill.toLowerCase()));
  const missingSkills = requiredSkills.filter(skill => !resumeLower.includes(skill.toLowerCase()));
  
  // Generate suggestions
  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  if (missingSkills.length > 0) {
    suggestions.push(`Highlight these skills: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (alignmentScore < 70) {
    suggestions.push('Consider tailoring your resume to better match the job requirements');
  }
  
  return {
    alignmentScore,
    matchedKeywords: matchedKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 10),
    foundSkills,
    missingSkills,
    suggestions,
    grade: alignmentScore >= 80 ? 'Excellent Match' : alignmentScore >= 60 ? 'Good Match' : alignmentScore >= 40 ? 'Fair Match' : 'Needs Improvement'
  };
}

/**
 * Extract keywords from text
 */
function extractKeywords(text) {
  const lowerText = text.toLowerCase();
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = lowerText.match(/\b[a-z]{4,}\b/g) || [];
  const keywords = words
    .filter(word => !commonWords.includes(word))
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .slice(0, 30);
  return keywords;
}

/**
 * Extract skills from text
 */
function extractSkills(text) {
  const skillPatterns = [
    /(?:proficient|skilled|experienced)\s+in\s+([^.,]+)/gi,
    /(?:knowledge|expertise)\s+(?:in|of)\s+([^.,]+)/gi
  ];
  const skills = [];
  skillPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const skillText = match[1].trim();
      const skillList = skillText.split(/[,\s]+and\s+/i).map(s => s.trim());
      skills.push(...skillList);
    }
  });
  return skills.filter(s => s.length > 2).slice(0, 15);
}

module.exports = {
  calculateATSScore,
  generateBulletPoints,
  generateSummary,
  alignResumeWithJob
};
