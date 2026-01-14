// services/industryInsights.js
/**
 * Industry Insights Service
 * 
 * This module implements explainable analytics logic for:
 * 1. Sector-specific skill gap analysis
 * 2. Education program and course recommendations
 * 3. Industry demand trends analysis
 * 4. Employer strategy suggestions
 * 5. Exportable report generation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Analyze Sector Skill Gaps
 * 
 * Compares user skills with sector requirements
 * 
 * Methodology:
 * - Extract user skills from resume/profile
 * - Get sector-required skills from job postings/industry data
 * - Calculate skill gaps (required - current)
 * - Prioritize gaps by frequency and importance
 * - Identify strengths
 * 
 * @param {Array} userSkills - User's current skills
 * @param {String} sector - Industry sector
 * @param {Array} sectorJobs - Job postings in the sector
 * @returns {Object} Skill gap analysis
 */
function analyzeSkillGaps(userSkills, sector, sectorJobs = []) {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  
  // Extract required skills from sector jobs
  const skillFrequency = {};
  sectorJobs.forEach(job => {
    job.requiredSkills?.forEach(skill => {
      const skillLower = skill.toLowerCase();
      skillFrequency[skillLower] = (skillFrequency[skillLower] || 0) + 1;
    });
  });
  
  // Calculate importance based on frequency
  const totalJobs = sectorJobs.length || 1;
  const sectorRequiredSkills = Object.entries(skillFrequency)
    .map(([skill, count]) => ({
      skill: skill.charAt(0).toUpperCase() + skill.slice(1),
      frequency: Math.round((count / totalJobs) * 100),
      importance: count > totalJobs * 0.5 ? 'critical' :
                  count > totalJobs * 0.3 ? 'important' : 'nice-to-have'
    }))
    .sort((a, b) => b.frequency - a.frequency);
  
  // Identify gaps
  const gaps = [];
  sectorRequiredSkills.forEach(sectorSkill => {
    const skillLower = sectorSkill.skill.toLowerCase();
    const hasSkill = userSkillsLower.some(us => 
      us.includes(skillLower) || skillLower.includes(us)
    );
    
    if (!hasSkill) {
      const gapSize = sectorSkill.frequency; // Gap size = how often skill is required
      gaps.push({
        skill: sectorSkill.skill,
        currentLevel: 0,
        requiredLevel: sectorSkill.frequency,
        gapSize,
        priority: sectorSkill.importance === 'critical' ? 'critical' :
                  sectorSkill.importance === 'important' ? 'high' :
                  gapSize > 50 ? 'medium' : 'low',
        impact: gapSize > 70 ? 'high' :
                gapSize > 40 ? 'medium' : 'low'
      });
    }
  });
  
  // Identify strengths (skills user has that are in demand)
  const strengths = [];
  userSkills.forEach(userSkill => {
    const userSkillLower = userSkill.toLowerCase();
    const sectorSkill = sectorRequiredSkills.find(ss => 
      ss.skill.toLowerCase().includes(userSkillLower) ||
      userSkillLower.includes(ss.skill.toLowerCase())
    );
    
    if (sectorSkill) {
      strengths.push({
        skill: userSkill,
        level: sectorSkill.frequency,
        advantage: `High demand in ${sector} sector (${sectorSkill.frequency}% of jobs)`
      });
    }
  });
  
  // Calculate overall gap score (0-100, lower is better)
  const totalGapSize = gaps.reduce((sum, gap) => sum + gap.gapSize, 0);
  const maxPossibleGap = sectorRequiredSkills.length * 100;
  const overallGapScore = maxPossibleGap > 0 
    ? Math.round((totalGapSize / maxPossibleGap) * 100) 
    : 0;
  
  // Generate recommendations
  const recommendations = [];
  if (gaps.length > 0) {
    const criticalGaps = gaps.filter(g => g.priority === 'critical');
    if (criticalGaps.length > 0) {
      recommendations.push(`Focus on developing ${criticalGaps[0].skill} - it's critical for ${sector} roles`);
    }
    recommendations.push(`Consider upskilling in ${gaps.slice(0, 3).map(g => g.skill).join(', ')}`);
  }
  if (strengths.length > 0) {
    recommendations.push(`Leverage your strengths in ${strengths.slice(0, 2).map(s => s.skill).join(' and ')}`);
  }
  
  return {
    userSkills,
    sectorRequiredSkills,
    gaps: gaps.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    strengths,
    overallGapScore,
    recommendations
  };
}

/**
 * Generate Education Recommendations
 * 
 * Suggests courses and programs based on skill gaps
 * 
 * Methodology:
 * - Match skill gaps to available courses
 * - Score courses by relevance
 * - Consider cost, duration, format
 * - Prioritize by impact and feasibility
 * 
 * @param {Array} skillGaps - Identified skill gaps
 * @param {String} sector - Industry sector
 * @param {Object} userPreferences - User preferences (budget, format, etc.)
 * @returns {Array} Education recommendations
 */
function generateEducationRecommendations(skillGaps, sector, userPreferences = {}) {
  const recommendations = [];
  
  // Course database (in production, this would be from a database)
  const courseDatabase = {
    'JavaScript': [
      {
        type: 'course',
        title: 'Complete JavaScript Course',
        provider: 'Udemy',
        duration: '40 hours',
        cost: { amount: 49, currency: 'USD' },
        format: 'online',
        skillsCovered: ['JavaScript', 'ES6', 'DOM', 'Async Programming'],
        url: 'https://udemy.com/javascript-course',
        rating: 4.5,
        completionRate: 85
      },
      {
        type: 'certification',
        title: 'JavaScript Developer Certification',
        provider: 'FreeCodeCamp',
        duration: '300 hours',
        cost: { amount: 0, currency: 'USD' },
        format: 'online',
        skillsCovered: ['JavaScript', 'React', 'Node.js'],
        url: 'https://freecodecamp.org',
        rating: 4.8,
        completionRate: 70
      }
    ],
    'Python': [
      {
        type: 'course',
        title: 'Python for Data Science',
        provider: 'Coursera',
        duration: '8 weeks',
        cost: { amount: 49, currency: 'USD' },
        format: 'online',
        skillsCovered: ['Python', 'Data Analysis', 'Pandas', 'NumPy'],
        url: 'https://coursera.org/python',
        rating: 4.6,
        completionRate: 80
      }
    ],
    'Machine Learning': [
      {
        type: 'course',
        title: 'Machine Learning Specialization',
        provider: 'Coursera',
        duration: '6 months',
        cost: { amount: 49, currency: 'USD' },
        format: 'online',
        skillsCovered: ['Machine Learning', 'Deep Learning', 'TensorFlow'],
        url: 'https://coursera.org/ml',
        rating: 4.7,
        completionRate: 75
      }
    ],
    'React': [
      {
        type: 'course',
        title: 'React - The Complete Guide',
        provider: 'Udemy',
        duration: '50 hours',
        cost: { amount: 49, currency: 'USD' },
        format: 'online',
        skillsCovered: ['React', 'Hooks', 'Redux', 'Next.js'],
        url: 'https://udemy.com/react',
        rating: 4.6,
        completionRate: 82
      }
    ],
    'Project Management': [
      {
        type: 'certification',
        title: 'PMP Certification Prep',
        provider: 'PMI',
        duration: '3 months',
        cost: { amount: 500, currency: 'USD' },
        format: 'hybrid',
        skillsCovered: ['Project Management', 'Agile', 'Scrum'],
        url: 'https://pmi.org',
        rating: 4.5,
        completionRate: 65
      }
    ]
  };
  
  // Generate recommendations for top skill gaps
  skillGaps.slice(0, 5).forEach(gap => {
    const courses = courseDatabase[gap.skill] || [];
    
    courses.forEach(course => {
      // Calculate relevance score
      const skillMatch = course.skillsCovered.some(skill => 
        skill.toLowerCase().includes(gap.skill.toLowerCase())
      ) ? 30 : 0;
      
      const priorityScore = gap.priority === 'critical' ? 30 :
                           gap.priority === 'high' ? 20 :
                           gap.priority === 'medium' ? 10 : 5;
      
      const ratingScore = (course.rating / 5) * 20;
      const completionScore = (course.completionRate / 100) * 20;
      
      const relevanceScore = skillMatch + priorityScore + ratingScore + completionScore;
      
      recommendations.push({
        ...course,
        relevanceScore: Math.round(relevanceScore),
        reason: `Addresses ${gap.skill} gap (${gap.priority} priority)`
      });
    });
  });
  
  // Sort by relevance
  recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Add generic sector recommendations if needed
  if (recommendations.length < 3) {
    recommendations.push({
      type: 'course',
      title: `${sector} Fundamentals`,
      provider: 'Various',
      duration: 'Varies',
      cost: { amount: 0, currency: 'USD' },
      format: 'online',
      skillsCovered: [`${sector} basics`],
      relevanceScore: 50,
      reason: `General ${sector} sector knowledge`
    });
  }
  
  return recommendations.slice(0, 10);
}

/**
 * Analyze Industry Demand Trends
 * 
 * Analyzes demand trends for a sector
 * 
 * Methodology:
 * - Aggregate job postings by time period
 * - Calculate growth rates
 * - Identify emerging skills
 * - Track salary trends
 * 
 * @param {Array} sectorJobs - Job postings in the sector
 * @param {String} sector - Industry sector
 * @returns {Object} Demand trends analysis
 */
function analyzeDemandTrends(sectorJobs, sector) {
  const totalJobs = sectorJobs.length;
  
  // Time-based analysis (last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  
  const recentJobs = sectorJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    return postedDate >= thirtyDaysAgo;
  });
  
  const previousJobs = sectorJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    return postedDate >= sixtyDaysAgo && postedDate < thirtyDaysAgo;
  });
  
  const growthRate = previousJobs.length > 0
    ? ((recentJobs.length - previousJobs.length) / previousJobs.length) * 100
    : 0;
  
  // Skill trends
  const recentSkills = {};
  recentJobs.forEach(job => {
    job.requiredSkills?.forEach(skill => {
      recentSkills[skill] = (recentSkills[skill] || 0) + 1;
    });
  });
  
  const previousSkills = {};
  previousJobs.forEach(job => {
    job.requiredSkills?.forEach(skill => {
      previousSkills[skill] = (previousSkills[skill] || 0) + 1;
    });
  });
  
  const emergingSkills = Object.entries(recentSkills)
    .filter(([skill, count]) => {
      const prevCount = previousSkills[skill] || 0;
      return count > prevCount * 1.2; // 20%+ growth
    })
    .map(([skill, count]) => ({
      skill,
      growth: previousSkills[skill] > 0
        ? ((count - previousSkills[skill]) / previousSkills[skill]) * 100
        : 100,
      frequency: count
    }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 5);
  
  // Salary trends
  const recentSalaries = recentJobs
    .map(job => (job.salary?.min + job.salary?.max) / 2)
    .filter(s => s > 0);
  
  const previousSalaries = previousJobs
    .map(job => (job.salary?.min + job.salary?.max) / 2)
    .filter(s => s > 0);
  
  const avgRecentSalary = recentSalaries.length > 0
    ? recentSalaries.reduce((a, b) => a + b, 0) / recentSalaries.length
    : 0;
  
  const avgPreviousSalary = previousSalaries.length > 0
    ? previousSalaries.reduce((a, b) => a + b, 0) / previousSalaries.length
    : 0;
  
  const salaryGrowth = avgPreviousSalary > 0
    ? ((avgRecentSalary - avgPreviousSalary) / avgPreviousSalary) * 100
    : 0;
  
  // Demand forecast
  let demandForecast = 'stable';
  if (growthRate > 15) demandForecast = 'strong-growth';
  else if (growthRate > 5) demandForecast = 'moderate-growth';
  else if (growthRate < -10) demandForecast = 'declining';
  
  return {
    totalJobs,
    recentJobs: recentJobs.length,
    previousJobs: previousJobs.length,
    growthRate: Math.round(growthRate * 10) / 10,
    emergingSkills,
    salaryTrends: {
      current: Math.round(avgRecentSalary),
      previous: Math.round(avgPreviousSalary),
      growth: Math.round(salaryGrowth * 10) / 10
    },
    demandForecast,
    insights: [
      `${sector} sector shows ${growthRate > 0 ? 'positive' : 'negative'} growth (${Math.round(growthRate)}%)`,
      `Average salary ${salaryGrowth > 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(salaryGrowth))}%`,
      emergingSkills.length > 0 
        ? `Emerging skills: ${emergingSkills.slice(0, 3).map(s => s.skill).join(', ')}`
        : 'No significant emerging skills detected'
    ]
  };
}

/**
 * Generate Employer Strategy Suggestions
 * 
 * Provides strategic recommendations for employers in a sector
 * 
 * Methodology:
 * - Analyze hiring challenges
 * - Identify skill shortages
 * - Suggest retention strategies
 * - Recommend compensation approaches
 * 
 * @param {String} sector - Industry sector
 * @param {Array} sectorJobs - Job postings
 * @param {Object} marketData - Market analytics data
 * @returns {Array} Employer strategy recommendations
 */
function generateEmployerStrategies(sector, sectorJobs, marketData = {}) {
  const strategies = [];
  
  // Hiring strategies
  const avgTimeToFill = marketData.averageTimeToFill || 35;
  if (avgTimeToFill > 40) {
    strategies.push({
      category: 'hiring',
      title: 'Reduce Time-to-Fill',
      description: `Average time to fill positions is ${avgTimeToFill} days. Streamline hiring process to attract top talent faster.`,
      priority: 'high',
      impact: 'high',
      implementation: {
        steps: [
          'Simplify application process',
          'Implement automated screening',
          'Offer competitive compensation packages',
          'Build employer brand presence'
        ],
        timeline: '2-3 months',
        resources: ['HR team', 'Recruitment tools', 'Budget for advertising'],
        estimatedCost: { amount: 10000, currency: 'USD' }
      },
      successMetrics: ['Time-to-fill reduced by 20%', 'Quality of candidates improved'],
      examples: ['Tech companies using AI screening', 'Fast-track interview processes']
    });
  }
  
  // Skill development strategies
  const topSkills = marketData.skillDemand?.slice(0, 5) || [];
  if (topSkills.length > 0) {
    strategies.push({
      category: 'skill-development',
      title: 'Invest in Employee Upskilling',
      description: `Top in-demand skills: ${topSkills.map(s => s.skill).join(', ')}. Develop internal talent to meet demand.`,
      priority: 'high',
      impact: 'high',
      implementation: {
        steps: [
          'Identify skill gaps in current workforce',
          'Partner with training providers',
          'Create internal learning programs',
          'Offer certification incentives'
        ],
        timeline: '6-12 months',
        resources: ['Learning & Development budget', 'Training platforms', 'Mentors'],
        estimatedCost: { amount: 50000, currency: 'USD' }
      },
      successMetrics: ['80% of employees upskilled', 'Reduced external hiring needs'],
      examples: ['Google\'s internal training programs', 'Amazon\'s Career Choice']
    });
  }
  
  // Compensation strategies
  const salaryGrowth = marketData.salaryTrends?.growth || 0;
  if (salaryGrowth > 5) {
    strategies.push({
      category: 'compensation',
      title: 'Review Compensation Packages',
      description: `Market salaries are growing at ${salaryGrowth}%. Ensure competitive compensation to retain talent.`,
      priority: 'medium',
      impact: 'high',
      implementation: {
        steps: [
          'Conduct market salary research',
          'Benchmark against competitors',
          'Adjust salary bands',
          'Consider equity/benefits packages'
        ],
        timeline: '3-6 months',
        resources: ['Compensation team', 'Market data', 'Budget allocation'],
        estimatedCost: { amount: 200000, currency: 'USD' }
      },
      successMetrics: ['Retention rate improved', 'Competitive positioning in market'],
      examples: ['Tech companies offering RSUs', 'Flexible compensation structures']
    });
  }
  
  // Retention strategies
  strategies.push({
    category: 'retention',
    title: 'Enhance Workplace Culture',
    description: 'Focus on employee engagement and retention through culture improvements.',
    priority: 'medium',
    impact: 'medium',
    implementation: {
      steps: [
        'Conduct employee satisfaction surveys',
        'Implement flexible work arrangements',
        'Create career development paths',
        'Improve work-life balance'
      ],
      timeline: '6-12 months',
      resources: ['HR team', 'Management support', 'Employee feedback'],
      estimatedCost: { amount: 30000, currency: 'USD' }
    },
    successMetrics: ['Employee satisfaction score > 80%', 'Reduced turnover rate'],
    examples: ['Remote work policies', 'Wellness programs']
  });
  
  // Workplace culture
  strategies.push({
    category: 'workplace-culture',
    title: 'Foster Innovation and Growth',
    description: 'Create an environment that encourages innovation and professional growth.',
    priority: 'low',
    impact: 'medium',
    implementation: {
      steps: [
        'Establish innovation labs or programs',
        'Encourage cross-functional collaboration',
        'Provide learning and development opportunities',
        'Recognize and reward innovation'
      ],
      timeline: 'Ongoing',
      resources: ['Innovation budget', 'Leadership support', 'Time allocation'],
      estimatedCost: { amount: 25000, currency: 'USD' }
    },
    successMetrics: ['Number of innovations implemented', 'Employee engagement scores'],
    examples: ['3M\'s 15% time rule', 'Google\'s 20% time']
  });
  
  return strategies;
}

/**
 * Generate Exportable Report Data
 * 
 * Prepares data for export in various formats
 * 
 * @param {Object} skillGapAnalysis - Skill gap analysis results
 * @param {Array} educationRecommendations - Education recommendations
 * @param {Object} demandTrends - Demand trends data
 * @param {Array} employerStrategies - Employer strategies
 * @param {String} sector - Industry sector
 * @returns {Object} Formatted report data
 */
function generateReportData(skillGapAnalysis, educationRecommendations, demandTrends, employerStrategies, sector) {
  return {
    reportType: 'comprehensive',
    sector,
    generatedAt: new Date(),
    sections: {
      executiveSummary: {
        title: 'Executive Summary',
        content: `Industry Insights Report for ${sector} sector. This report provides comprehensive analysis of skill gaps, education opportunities, demand trends, and strategic recommendations.`
      },
      skillGapAnalysis: {
        title: 'Skill Gap Analysis',
        overallGapScore: skillGapAnalysis.overallGapScore,
        criticalGaps: skillGapAnalysis.gaps.filter(g => g.priority === 'critical'),
        strengths: skillGapAnalysis.strengths,
        recommendations: skillGapAnalysis.recommendations
      },
      educationRecommendations: {
        title: 'Education & Course Recommendations',
        topRecommendations: educationRecommendations.slice(0, 5),
        totalRecommendations: educationRecommendations.length
      },
      demandTrends: {
        title: 'Industry Demand Trends',
        growthRate: demandTrends.growthRate,
        emergingSkills: demandTrends.emergingSkills,
        salaryTrends: demandTrends.salaryTrends,
        forecast: demandTrends.demandForecast
      },
      employerStrategies: {
        title: 'Employer Strategy Recommendations',
        strategies: employerStrategies,
        priorityActions: employerStrategies.filter(s => s.priority === 'high')
      }
    },
    metadata: {
      dataRange: {
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      },
      sections: ['Skill Gap Analysis', 'Education Recommendations', 'Demand Trends', 'Employer Strategies']
    }
  };
}

module.exports = {
  analyzeSkillGaps,
  generateEducationRecommendations,
  analyzeDemandTrends,
  generateEmployerStrategies,
  generateReportData
};
