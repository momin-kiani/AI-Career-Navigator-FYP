// services/mentorshipAI.js
/**
 * Mentorship AI Service
 * 
 * This module implements explainable AI logic for:
 * 1. AI-based mentor matching
 * 2. Career transition guidance
 * 3. Growth roadmap generation
 * 4. Progress analysis with mentor support
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Match Mentors with User
 * 
 * Calculates compatibility score between user and mentors
 * 
 * Methodology:
 * - Skill overlap analysis
 * - Industry alignment
 * - Experience level matching
 * - Career goal alignment
 * - Availability and rating consideration
 * 
 * @param {Object} userProfile - User profile data
 * @param {Array} mentors - Available mentors
 * @param {Object} userGoals - User career goals
 * @returns {Array} Matched mentors with scores and reasons
 */
function matchMentors(userProfile, mentors, userGoals = {}) {
  const userSkills = userProfile.skills || [];
  const userIndustry = userProfile.industry || userProfile.currentRole || '';
  const userExperience = userProfile.yearsOfExperience || 0;
  const targetRole = userGoals.targetRole || userProfile.currentRole || '';
  
  const matchedMentors = mentors.map(mentor => {
    let matchScore = 0;
    const reasons = [];
    
    // 1. Skill Overlap (40 points)
    const mentorSkills = mentor.expertise || [];
    const skillOverlap = userSkills.filter(skill => 
      mentorSkills.some(ms => ms.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ms.toLowerCase()))
    );
    const skillScore = (skillOverlap.length / Math.max(userSkills.length, mentorSkills.length, 1)) * 40;
    matchScore += skillScore;
    if (skillOverlap.length > 0) {
      reasons.push(`Shared expertise in: ${skillOverlap.slice(0, 3).join(', ')}`);
    }
    
    // 2. Industry Alignment (25 points)
    if (mentor.industry && userIndustry) {
      const industryMatch = mentor.industry.toLowerCase() === userIndustry.toLowerCase() ||
                           mentor.industry.toLowerCase().includes(userIndustry.toLowerCase()) ||
                           userIndustry.toLowerCase().includes(mentor.industry.toLowerCase());
      if (industryMatch) {
        matchScore += 25;
        reasons.push(`Same industry: ${mentor.industry}`);
      } else {
        matchScore += 10; // Partial match
        reasons.push(`Related industry experience`);
      }
    }
    
    // 3. Role Alignment (20 points)
    if (mentor.currentRole && targetRole) {
      const roleMatch = mentor.currentRole.toLowerCase().includes(targetRole.toLowerCase()) ||
                       targetRole.toLowerCase().includes(mentor.currentRole.toLowerCase());
      if (roleMatch) {
        matchScore += 20;
        reasons.push(`Target role alignment: ${mentor.currentRole}`);
      }
    }
    
    // 4. Experience Level (10 points)
    if (mentor.yearsOfExperience) {
      const expDiff = Math.abs(mentor.yearsOfExperience - userExperience);
      if (expDiff <= 2) {
        matchScore += 10;
        reasons.push('Similar experience level');
      } else if (expDiff <= 5) {
        matchScore += 5;
        reasons.push('Relevant experience level');
      }
    }
    
    // 5. Rating Bonus (5 points)
    if (mentor.rating && mentor.rating >= 4) {
      matchScore += 5;
      reasons.push(`Highly rated mentor (${mentor.rating}/5)`);
    }
    
    matchScore = Math.min(Math.round(matchScore), 100);
    
    return {
      mentor,
      matchScore,
      reasons,
      skillOverlap: skillOverlap.length
    };
  });
  
  // Sort by match score
  matchedMentors.sort((a, b) => b.matchScore - a.matchScore);
  
  return matchedMentors;
}

/**
 * Generate Career Transition Guidance
 * 
 * Creates step-by-step guidance for career transitions
 * 
 * @param {Object} userProfile - User profile
 * @param {String} currentRole - Current role
 * @param {String} targetRole - Target role
 * @param {String} transitionType - Type of transition
 * @returns {Object} Transition guidance with steps and timeline
 */
function generateCareerTransitionGuidance(userProfile, currentRole, targetRole, transitionType) {
  const steps = [];
  const skillGaps = [];
  const recommendations = [];
  
  // Common transition steps
  steps.push({
    stepNumber: 1,
    title: 'Assess Current Skills',
    description: 'Evaluate your current skill set and identify strengths and gaps',
    estimatedTime: '1-2 weeks',
    resources: ['Skill assessment tools', 'Self-reflection exercises'],
    completed: false
  });
  
  steps.push({
    stepNumber: 2,
    title: 'Identify Skill Gaps',
    description: `Compare your skills with requirements for ${targetRole}`,
    estimatedTime: '1 week',
    resources: ['Job descriptions', 'Industry reports'],
    completed: false
  });
  
  steps.push({
    stepNumber: 3,
    title: 'Develop Missing Skills',
    description: 'Create a learning plan to acquire necessary skills',
    estimatedTime: '2-6 months',
    resources: ['Online courses', 'Certifications', 'Projects'],
    completed: false
  });
  
  steps.push({
    stepNumber: 4,
    title: 'Build Portfolio/Experience',
    description: 'Gain practical experience through projects or internships',
    estimatedTime: '3-6 months',
    resources: ['Personal projects', 'Volunteer work', 'Freelance'],
    completed: false
  });
  
  steps.push({
    stepNumber: 5,
    title: 'Network in Target Industry',
    description: 'Connect with professionals in your target field',
    estimatedTime: 'Ongoing',
    resources: ['LinkedIn', 'Industry events', 'Professional groups'],
    completed: false
  });
  
  steps.push({
    stepNumber: 6,
    title: 'Apply and Interview',
    description: 'Start applying to positions and prepare for interviews',
    estimatedTime: '1-3 months',
    resources: ['Job boards', 'Interview prep', 'Resume optimization'],
    completed: false
  });
  
  // Generate skill gaps based on transition type
  if (transitionType === 'role-change') {
    skillGaps.push({
      skill: 'Target Role Skills',
      currentLevel: 50,
      requiredLevel: 80,
      priority: 'high'
    });
  }
  
  // Generate recommendations
  recommendations.push(`Focus on building ${targetRole}-specific skills`);
  recommendations.push(`Seek mentorship from professionals in ${targetRole}`);
  recommendations.push('Update your resume and LinkedIn profile');
  recommendations.push('Consider relevant certifications or courses');
  
  // Estimate timeline
  let estimatedMonths = 6;
  if (transitionType === 'career-pivot') estimatedMonths = 12;
  if (transitionType === 'promotion') estimatedMonths = 3;
  
  const milestones = [
    {
      milestone: 'Complete skill assessment',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      completed: false
    },
    {
      milestone: 'Start skill development',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
      completed: false
    },
    {
      milestone: 'Build portfolio',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
      completed: false
    },
    {
      milestone: 'Begin job applications',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      completed: false
    }
  ];
  
  return {
    steps,
    skillGaps,
    recommendations,
    timeline: {
      estimatedMonths,
      milestones
    }
  };
}

/**
 * Generate Growth Roadmap
 * 
 * Creates a personalized growth roadmap based on user goals
 * 
 * @param {Object} userProfile - User profile
 * @param {Object} userGoals - User career goals
 * @param {String} timeframe - Roadmap timeframe
 * @returns {Object} Growth roadmap with milestones
 */
function generateGrowthRoadmap(userProfile, userGoals = {}, timeframe = '1-year') {
  const title = userGoals.title || `Career Growth Roadmap - ${timeframe}`;
  const goal = userGoals.goal || 'Professional development and career advancement';
  
  const milestones = [];
  const skillsToDevelop = [];
  
  // Generate milestones based on timeframe
  const monthMultipliers = {
    '3-months': 1,
    '6-months': 2,
    '1-year': 4,
    '2-years': 8,
    '5-years': 20
  };
  
  const months = monthMultipliers[timeframe] || 4;
  
  milestones.push({
    milestoneId: 'm1',
    title: 'Skill Assessment & Goal Setting',
    description: 'Assess current skills and set clear career goals',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
    status: 'not-started',
    progress: 0,
    tasks: [
      { taskId: 't1', title: 'Complete skill assessment', completed: false, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      { taskId: 't2', title: 'Define career goals', completed: false, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    ],
    mentorFeedback: []
  });
  
  milestones.push({
    milestoneId: 'm2',
    title: 'Skill Development Phase',
    description: 'Focus on developing key skills for career growth',
    targetDate: new Date(Date.now() + (months * 30 / 2) * 24 * 60 * 60 * 1000), // Mid-point
    status: 'not-started',
    progress: 0,
    tasks: [
      { taskId: 't3', title: 'Enroll in relevant courses', completed: false, dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { taskId: 't4', title: 'Complete skill-building projects', completed: false, dueDate: new Date(Date.now() + (months * 30 / 2) * 24 * 60 * 60 * 1000) }
    ],
    mentorFeedback: []
  });
  
  milestones.push({
    milestoneId: 'm3',
    title: 'Application & Networking',
    description: 'Apply new skills and expand professional network',
    targetDate: new Date(Date.now() + (months * 30 * 3 / 4) * 24 * 60 * 60 * 1000), // 3/4 point
    status: 'not-started',
    progress: 0,
    tasks: [
      { taskId: 't5', title: 'Update resume and LinkedIn', completed: false, dueDate: new Date(Date.now() + (months * 30 / 2) * 24 * 60 * 60 * 1000) },
      { taskId: 't6', title: 'Attend networking events', completed: false, dueDate: new Date(Date.now() + (months * 30 * 3 / 4) * 24 * 60 * 60 * 1000) }
    ],
    mentorFeedback: []
  });
  
  milestones.push({
    milestoneId: 'm4',
    title: 'Achieve Career Milestone',
    description: 'Reach primary career goal or milestone',
    targetDate: new Date(Date.now() + (months * 30) * 24 * 60 * 60 * 1000), // End
    status: 'not-started',
    progress: 0,
    tasks: [
      { taskId: 't7', title: 'Apply to target positions', completed: false, dueDate: new Date(Date.now() + (months * 30 * 3 / 4) * 24 * 60 * 60 * 1000) },
      { taskId: 't8', title: 'Complete career milestone', completed: false, dueDate: new Date(Date.now() + (months * 30) * 24 * 60 * 60 * 1000) }
    ],
    mentorFeedback: []
  });
  
  // Generate skills to develop
  const userSkills = userProfile.skills || [];
  const targetSkills = ['Leadership', 'Communication', 'Problem Solving', 'Project Management'];
  
  targetSkills.forEach(skill => {
    if (!userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()))) {
      skillsToDevelop.push({
        skill,
        priority: 'high',
        currentLevel: 50,
        targetLevel: 80,
        learningResources: [`${skill} courses`, `${skill} books`, `${skill} workshops`]
      });
    }
  });
  
  return {
    title,
    goal,
    timeframe,
    milestones,
    skillsToDevelop
  };
}

/**
 * Analyze Progress with Mentor Support
 * 
 * Analyzes user progress and provides mentor-guided insights
 * 
 * @param {Array} progressEntries - User progress entries
 * @param {Object} roadmap - Growth roadmap
 * @param {Object} mentor - Mentor information
 * @returns {Object} Progress analysis with recommendations
 */
function analyzeProgressWithMentor(progressEntries, roadmap, mentor = null) {
  const analysis = {
    overallProgress: 0,
    completedMilestones: 0,
    inProgressMilestones: 0,
    blockedMilestones: 0,
    recommendations: [],
    mentorInsights: []
  };
  
  if (!roadmap || !roadmap.milestones) {
    return analysis;
  }
  
  const totalMilestones = roadmap.milestones.length;
  let completedCount = 0;
  let inProgressCount = 0;
  let blockedCount = 0;
  let totalProgress = 0;
  
  roadmap.milestones.forEach(milestone => {
    if (milestone.status === 'completed') {
      completedCount++;
      totalProgress += 100;
    } else if (milestone.status === 'in-progress') {
      inProgressCount++;
      totalProgress += milestone.progress || 0;
    } else if (milestone.status === 'blocked') {
      blockedCount++;
    } else {
      totalProgress += milestone.progress || 0;
    }
  });
  
  analysis.overallProgress = totalMilestones > 0 ? Math.round(totalProgress / totalMilestones) : 0;
  analysis.completedMilestones = completedCount;
  analysis.inProgressMilestones = inProgressCount;
  analysis.blockedMilestones = blockedCount;
  
  // Generate recommendations
  if (analysis.overallProgress < 30) {
    analysis.recommendations.push('Start working on your first milestone to build momentum');
  }
  
  if (blockedCount > 0) {
    analysis.recommendations.push('Address blocked milestones - consider breaking them into smaller tasks');
  }
  
  if (inProgressCount > 2) {
    analysis.recommendations.push('Focus on completing one milestone at a time for better results');
  }
  
  // Mentor insights
  if (mentor) {
    analysis.mentorInsights.push({
      mentorName: `${mentor.userId?.firstName || ''} ${mentor.userId?.lastName || ''}`,
      insight: `Based on your progress, I recommend focusing on skill development milestones first.`,
      date: new Date()
    });
  }
  
  return analysis;
}

module.exports = {
  matchMentors,
  generateCareerTransitionGuidance,
  generateGrowthRoadmap,
  analyzeProgressWithMentor
};
