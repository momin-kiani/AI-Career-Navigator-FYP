// services/jobManagement.js
/**
 * Job Application Management Service
 * 
 * This module implements explainable AI logic for:
 * 1. Job description summarization
 * 2. Skill-job matching
 * 3. Application autofill
 * 4. Job metadata extraction
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Summarize Job Description
 * 
 * Extracts key information from job descriptions using pattern matching
 * 
 * Methodology:
 * - Extract key skills using keyword patterns
 * - Extract responsibilities from bullet points
 * - Extract requirements from structured sections
 * - Generate concise summary text
 * 
 * @param {String} jobDescription - Full job description text
 * @returns {Object} Summarized job information
 */
function summarizeJobDescription(jobDescription) {
  const lowerDesc = jobDescription.toLowerCase();
  
  // Extract key skills
  const skillPatterns = [
    /(?:required|must have|skills?)[\s\S]*?(?=preferred|qualifications|requirements|$)/i,
    /(?:proficient|experienced|skilled)\s+in\s+([^.,]+)/gi,
    /(?:knowledge|expertise)\s+(?:in|of)\s+([^.,]+)/gi
  ];
  
  const keySkills = new Set();
  skillPatterns.forEach(pattern => {
    const matches = jobDescription.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const skills = match[1].split(/[,\s]+and\s+/i).map(s => s.trim());
        skills.forEach(skill => {
          if (skill.length > 2 && skill.length < 50) {
            keySkills.add(skill);
          }
        });
      }
    }
  });
  
  // Common technical skills to look for
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'mongodb',
    'postgresql', 'machine learning', 'data analysis', 'project management',
    'leadership', 'communication', 'teamwork', 'problem solving'
  ];
  
  commonSkills.forEach(skill => {
    if (lowerDesc.includes(skill)) {
      keySkills.add(skill);
    }
  });
  
  // Extract responsibilities
  const responsibilities = [];
  const responsibilityPatterns = [
    /(?:responsibilities|duties|what you'll do)[\s\S]*?(?=requirements|qualifications|$)/i,
    /•\s*([^\n]+)/g,
    /-\s*([^\n]+)/g,
    /\d+\.\s*([^\n]+)/g
  ];
  
  responsibilityPatterns.forEach(pattern => {
    const matches = jobDescription.matchAll(pattern);
    for (const match of matches) {
      const text = match[1] || match[0];
      if (text && text.length > 20 && text.length < 200) {
        responsibilities.push(text.trim());
      }
    }
  });
  
  // Extract requirements
  const requirements = [];
  const requirementPatterns = [
    /(?:requirements|qualifications|must have)[\s\S]*?(?=preferred|nice to have|$)/i,
    /(?:bachelor|master|phd|degree)[\s\S]*?[.!]/gi,
    /(?:years?|yrs?)\s+of\s+experience/gi
  ];
  
  requirementPatterns.forEach(pattern => {
    const matches = jobDescription.matchAll(pattern);
    for (const match of matches) {
      const text = match[0] || match[1];
      if (text && text.length > 10 && text.length < 200) {
        requirements.push(text.trim());
      }
    }
  });
  
  // Generate summary text
  const summaryText = generateSummaryText(jobDescription, Array.from(keySkills).slice(0, 10), responsibilities.slice(0, 5));
  
  return {
    keySkills: Array.from(keySkills).slice(0, 15),
    responsibilities: responsibilities.slice(0, 10),
    requirements: requirements.slice(0, 10),
    summaryText
  };
}

/**
 * Generate summary text from extracted information
 */
function generateSummaryText(description, skills, responsibilities) {
  const wordCount = description.split(/\s+/).length;
  const hasExperience = /(\d+)\s*(?:years?|yrs?)/i.test(description);
  const experienceMatch = description.match(/(\d+)\s*(?:years?|yrs?)/i);
  const years = experienceMatch ? experienceMatch[1] : 'several';
  
  let summary = `This position requires ${years} years of experience and focuses on `;
  
  if (skills.length > 0) {
    summary += skills.slice(0, 3).join(', ') + '. ';
  }
  
  if (responsibilities.length > 0) {
    summary += `Key responsibilities include ${responsibilities[0].toLowerCase()}`;
    if (responsibilities.length > 1) {
      summary += ` and ${responsibilities.length - 1} other key areas`;
    }
    summary += '.';
  }
  
  return summary;
}

/**
 * Match User Skills with Job Requirements
 * 
 * Compares user's skills (from resume or profile) with job requirements
 * 
 * Methodology:
 * - Extract skills from user profile/resume
 * - Compare with job required skills
 * - Calculate match percentage
 * - Identify skill gaps
 * 
 * @param {String} userSkillsText - User's skills (from resume or profile)
 * @param {String} jobDescription - Job description text
 * @returns {Object} Skill match analysis
 */
function matchSkillsWithJob(userSkillsText, jobDescription) {
  const userSkillsLower = userSkillsText.toLowerCase();
  const jobDescLower = jobDescription.toLowerCase();
  
  // Extract job skills
  const jobSummary = summarizeJobDescription(jobDescription);
  const jobSkills = jobSummary.keySkills.map(s => s.toLowerCase());
  
  // Extract user skills (simple pattern matching)
  const userSkills = extractUserSkills(userSkillsText);
  
  // Calculate matches
  const matchedSkills = [];
  const missingSkills = [];
  
  jobSkills.forEach(jobSkill => {
    // Check for exact match or partial match
    const found = userSkills.some(userSkill => {
      const userLower = userSkill.toLowerCase();
      return userLower.includes(jobSkill) || jobSkill.includes(userLower) || 
             userLower === jobSkill || areSimilar(userLower, jobSkill);
    });
    
    if (found) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });
  
  // Calculate match score
  const matchScore = jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;
  
  // Generate recommendations
  const recommendations = [];
  if (missingSkills.length > 0) {
    recommendations.push(`Consider highlighting these skills: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (matchScore < 60) {
    recommendations.push('Your skill match is below average. Consider upskilling in key areas.');
  } else if (matchScore >= 80) {
    recommendations.push(`Excellent skill match! You're well-qualified for this position.`);
  }
  
  return {
    matchScore,
    matchedSkills: matchedSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 10),
    userSkills: userSkills.slice(0, 15),
    jobSkills: jobSkills.slice(0, 15),
    recommendations,
    grade: matchScore >= 80 ? 'Excellent Match' : matchScore >= 60 ? 'Good Match' : matchScore >= 40 ? 'Fair Match' : 'Needs Improvement'
  };
}

/**
 * Extract user skills from text
 */
function extractUserSkills(text) {
  const skills = new Set();
  const lowerText = text.toLowerCase();
  
  // Common skill patterns
  const skillPatterns = [
    /(?:skills?|proficient|experienced|expertise)[\s\S]*?(?=experience|education|$)/i,
    /(?:technologies?|tools?|languages?)[\s\S]*?(?=experience|education|$)/i
  ];
  
  skillPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      const skillText = match[0];
      // Extract comma-separated or bullet-pointed skills
      const extracted = skillText.split(/[,•\-\n]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 50);
      extracted.forEach(skill => skills.add(skill));
    }
  });
  
  // Common technical skills
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'mongodb',
    'postgresql', 'machine learning', 'data analysis', 'project management'
  ];
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      skills.add(skill);
    }
  });
  
  return Array.from(skills);
}

/**
 * Check if two skills are similar
 */
function areSimilar(skill1, skill2) {
  // Simple similarity check (can be enhanced)
  if (skill1 === skill2) return true;
  if (skill1.includes(skill2) || skill2.includes(skill1)) return true;
  
  // Common variations
  const variations = {
    'js': 'javascript',
    'node': 'node.js',
    'ml': 'machine learning',
    'ai': 'artificial intelligence'
  };
  
  for (const [short, full] of Object.entries(variations)) {
    if ((skill1 === short && skill2 === full) || (skill1 === full && skill2 === short)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Autofill Application Form
 * 
 * Extracts information from job description to pre-fill application form
 * 
 * Methodology:
 * - Extract job title, company, location from description
 * - Extract salary information if available
 * - Extract application deadline
 * - Extract contact information
 * 
 * @param {String} jobDescription - Job description text
 * @param {String} jobUrl - Job posting URL
 * @returns {Object} Pre-filled application data
 */
function autofillApplication(jobDescription, jobUrl) {
  const autofill = {
    jobTitle: '',
    company: '',
    location: '',
    salary: null,
    deadline: null,
    jobDescription: jobDescription
  };
  
  // Extract job title (usually at the beginning or in headers)
  const titlePatterns = [
    /(?:position|role|title)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|@|for)/i,
    /<h[12]>([^<]+)<\/h[12]>/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      autofill.jobTitle = match[1].trim();
      break;
    }
  }
  
  // Extract company name
  const companyPatterns = [
    /(?:at|@|for)\s+([A-Z][a-zA-Z\s&]+)/i,
    /company[:\s]+([A-Z][a-zA-Z\s&]+)/i,
    /([A-Z][a-zA-Z\s&]+)\s+(?:is|seeks|looking)/i
  ];
  
  for (const pattern of companyPatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      autofill.company = match[1].trim().split(/\s+/).slice(0, 3).join(' ');
      break;
    }
  }
  
  // Extract location
  const locationPatterns = [
    /(?:location|based in|office)[:\s]+([A-Z][a-zA-Z\s,]+)/i,
    /([A-Z][a-zA-Z]+,\s*[A-Z]{2})/,
    /(?:remote|hybrid|onsite)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      autofill.location = match[1].trim();
      break;
    }
  }
  
  if (!autofill.location) {
    // Check for remote/hybrid
    if (/remote/i.test(jobDescription)) autofill.location = 'Remote';
    else if (/hybrid/i.test(jobDescription)) autofill.location = 'Hybrid';
  }
  
  // Extract salary
  const salaryPatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*-\s*\$(\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /(?:salary|compensation)[:\s]+\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/i
  ];
  
  for (const pattern of salaryPatterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      const min = parseSalary(match[1]);
      const max = match[2] ? parseSalary(match[2]) : min * 1.2;
      autofill.salary = {
        min,
        max,
        currency: 'USD'
      };
      break;
    }
  }
  
  // Extract deadline
  const deadlinePatterns = [
    /(?:deadline|apply by|closing)[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/
  ];
  
  for (const pattern of deadlinePatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      autofill.deadline = new Date(match[1]);
      break;
    }
  }
  
  // Extract source from URL
  if (jobUrl) {
    if (jobUrl.includes('linkedin.com')) autofill.source = 'linkedin';
    else if (jobUrl.includes('indeed.com')) autofill.source = 'indeed';
    else if (jobUrl.includes('glassdoor.com')) autofill.source = 'glassdoor';
    else autofill.source = 'company-website';
  }
  
  return autofill;
}

/**
 * Parse salary string to number
 */
function parseSalary(salaryStr) {
  const cleaned = salaryStr.replace(/[,$]/g, '').toLowerCase();
  if (cleaned.includes('k')) {
    return parseInt(cleaned.replace('k', '')) * 1000;
  }
  return parseInt(cleaned) || 0;
}

module.exports = {
  summarizeJobDescription,
  matchSkillsWithJob,
  autofillApplication
};
