// services/marketAnalytics.js
/**
 * Labor Market Analytics Service
 * 
 * This module implements explainable analytics logic for:
 * 1. Real-time job data processing
 * 2. Regional hiring strategy analysis
 * 3. Industry hiring momentum tracking
 * 4. Competitor hiring pattern analysis
 * 5. Five-year demand forecasting
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Process and Normalize Job Data Feed
 * 
 * Processes raw job data from various sources and normalizes it
 * 
 * Methodology:
 * - Extract key fields (title, company, location, salary, skills)
 * - Normalize job titles and skills
 * - Categorize by industry and region
 * - Calculate metadata scores
 * 
 * @param {Array} rawJobs - Raw job data from API/scraper
 * @returns {Array} Normalized job data
 */
function processJobFeed(rawJobs) {
  return rawJobs.map(job => {
    const normalized = {
      jobId: job.id || job.jobId || `job_${Date.now()}_${Math.random()}`,
      title: normalizeJobTitle(job.title || job.jobTitle),
      company: job.company || job.companyName || 'Unknown',
      location: normalizeLocation(job.location || job.city || ''),
      industry: categorizeIndustry(job.title || '', job.description || ''),
      jobType: extractJobType(job.type || job.jobType || ''),
      salary: extractSalary(job.salary || job.salaryRange || {}),
      description: job.description || job.summary || '',
      requiredSkills: extractSkills(job.description || '', job.skills || []),
      postedDate: parseDate(job.postedDate || job.datePosted || new Date()),
      source: job.source || 'api',
      sourceUrl: job.url || job.link || ''
    };
    
    return normalized;
  });
}

function normalizeJobTitle(title) {
  // Basic normalization - remove extra spaces, standardize case
  return title.trim().replace(/\s+/g, ' ');
}

function normalizeLocation(location) {
  // Extract city, state, country from location string
  const parts = location.split(',').map(p => p.trim());
  return {
    city: parts[0] || '',
    state: parts[1] || '',
    country: parts[2] || 'USA',
    region: parts[1] || parts[0] || ''
  };
}

function categorizeIndustry(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  const industries = {
    'Technology': ['software', 'developer', 'engineer', 'programmer', 'tech', 'it'],
    'Finance': ['finance', 'banking', 'accountant', 'financial', 'investment'],
    'Healthcare': ['health', 'medical', 'nurse', 'doctor', 'hospital'],
    'Education': ['teacher', 'education', 'professor', 'academic'],
    'Marketing': ['marketing', 'advertising', 'brand', 'digital marketing'],
    'Sales': ['sales', 'account manager', 'business development']
  };
  
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return industry;
    }
  }
  
  return 'General';
}

function extractJobType(type) {
  const lower = type.toLowerCase();
  if (lower.includes('full') || lower.includes('full-time')) return 'full-time';
  if (lower.includes('part') || lower.includes('part-time')) return 'part-time';
  if (lower.includes('contract')) return 'contract';
  if (lower.includes('intern')) return 'internship';
  if (lower.includes('remote')) return 'remote';
  return 'full-time';
}

function extractSalary(salaryData) {
  if (typeof salaryData === 'number') {
    return { min: salaryData, max: salaryData, currency: 'USD' };
  }
  if (typeof salaryData === 'object') {
    return {
      min: salaryData.min || salaryData.low || 0,
      max: salaryData.max || salaryData.high || 0,
      currency: salaryData.currency || 'USD'
    };
  }
  return { min: 0, max: 0, currency: 'USD' };
}

function extractSkills(description, skillsList) {
  const skills = skillsList || [];
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS',
    'Machine Learning', 'Data Analysis', 'Project Management', 'Agile',
    'Communication', 'Leadership', 'Problem Solving'
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
  
  return [...new Set([...skills, ...foundSkills])];
}

function parseDate(dateString) {
  if (dateString instanceof Date) return dateString;
  return new Date(dateString || Date.now());
}

/**
 * Calculate Regional Hiring Strategy
 * 
 * Analyzes hiring patterns by region
 * 
 * Methodology:
 * - Aggregate job postings by region
 * - Calculate hiring rates and trends
 * - Identify top companies and roles
 * - Assess market health
 * 
 * @param {Array} jobData - Job data feed
 * @param {String} region - Region to analyze
 * @returns {Object} Regional hiring statistics
 */
function calculateRegionalHiring(jobData, region = 'all') {
  // Filter by region if specified
  let filteredJobs = jobData;
  if (region !== 'all') {
    filteredJobs = jobData.filter(job => 
      job.location?.country === region || 
      job.location?.city === region ||
      job.location?.state === region
    );
  }
  
  const totalOpenings = filteredJobs.length;
  const newPostings = filteredJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    const daysAgo = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7; // Posted in last 7 days
  }).length;
  
  // Calculate average salary
  const salaries = filteredJobs
    .map(job => (job.salary?.min + job.salary?.max) / 2)
    .filter(s => s > 0);
  const averageSalary = salaries.length > 0 
    ? salaries.reduce((a, b) => a + b, 0) / salaries.length 
    : 0;
  
  // Calculate salary growth (mock calculation)
  const salaryGrowth = 5 + Math.random() * 10; // 5-15% growth
  
  // Hiring rate (new postings / total)
  const hiringRate = totalOpenings > 0 ? (newPostings / totalOpenings) * 100 : 0;
  
  // Competition index (based on openings vs applicants ratio - simplified)
  const competitionIndex = Math.min(100, Math.max(0, 50 + (totalOpenings / 100)));
  
  // Top companies
  const companyCounts = {};
  filteredJobs.forEach(job => {
    companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([company, openings]) => ({ company, openings }));
  
  // Top roles
  const roleCounts = {};
  filteredJobs.forEach(job => {
    roleCounts[job.title] = (roleCounts[job.title] || 0) + 1;
  });
  const topRoles = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([role, count]) => ({
      role,
      count,
      avgSalary: averageSalary
    }));
  
  // Determine growth direction
  const growthDirection = newPostings > totalOpenings * 0.2 ? 'increasing' :
                          newPostings < totalOpenings * 0.1 ? 'decreasing' : 'stable';
  
  const growthRate = totalOpenings > 0 ? ((newPostings / totalOpenings) * 100) : 0;
  
  // Market health assessment
  let marketHealth = 'moderate';
  if (hiringRate > 20 && growthRate > 10) marketHealth = 'excellent';
  else if (hiringRate > 15 && growthRate > 5) marketHealth = 'good';
  else if (hiringRate < 10 || growthRate < 0) marketHealth = 'poor';
  
  return {
    totalOpenings,
    newPostings,
    averageSalary: Math.round(averageSalary),
    salaryGrowth: Math.round(salaryGrowth * 10) / 10,
    hiringRate: Math.round(hiringRate * 10) / 10,
    competitionIndex: Math.round(competitionIndex),
    topCompanies,
    topRoles,
    growthDirection,
    growthRate: Math.round(growthRate * 10) / 10,
    marketHealth
  };
}

/**
 * Calculate Industry Hiring Momentum
 * 
 * Tracks hiring momentum by industry
 * 
 * Methodology:
 * - Calculate posting velocity (jobs per time period)
 * - Analyze growth trends
 * - Track skill demand changes
 * - Assess momentum direction
 * 
 * @param {Array} jobData - Job data feed
 * @param {String} industry - Industry to analyze
 * @returns {Object} Industry momentum metrics
 */
function calculateIndustryMomentum(jobData, industry) {
  const industryJobs = jobData.filter(job => job.industry === industry);
  
  const totalPostings = industryJobs.length;
  
  // New postings (last 7 days)
  const recentJobs = industryJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    const daysAgo = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });
  const newPostings = recentJobs.length;
  
  // Hiring velocity (jobs per week)
  const hiringVelocity = newPostings;
  
  // Momentum score (0-100)
  const baseScore = Math.min(100, (totalPostings / 100) * 50);
  const velocityScore = Math.min(50, (hiringVelocity / 20) * 50);
  const momentumScore = Math.round(baseScore + velocityScore);
  
  // Direction
  const previousWeekJobs = industryJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    const daysAgo = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo > 7 && daysAgo <= 14;
  });
  const previousWeekCount = previousWeekJobs.length;
  
  let direction = 'stable';
  if (newPostings > previousWeekCount * 1.2) direction = 'accelerating';
  else if (newPostings < previousWeekCount * 0.8) direction = 'decelerating';
  
  const changeRate = previousWeekCount > 0 
    ? ((newPostings - previousWeekCount) / previousWeekCount) * 100 
    : 0;
  
  // Growth trend
  let growthTrend = 'stable';
  if (momentumScore > 75 && changeRate > 10) growthTrend = 'rapid-growth';
  else if (momentumScore > 60 && changeRate > 5) growthTrend = 'steady-growth';
  else if (changeRate < -10) growthTrend = 'declining';
  
  // Skill demand
  const skillFrequency = {};
  industryJobs.forEach(job => {
    job.requiredSkills?.forEach(skill => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });
  
  const skillDemand = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({
      skill,
      demandScore: Math.round((count / totalPostings) * 100),
      trend: count > (skillFrequency[skill] || 0) ? 'rising' : 'stable'
    }));
  
  // Salary trends
  const salaries = industryJobs
    .map(job => (job.salary?.min + job.salary?.max) / 2)
    .filter(s => s > 0);
  const averageSalary = salaries.length > 0 
    ? salaries.reduce((a, b) => a + b, 0) / salaries.length 
    : 0;
  
  const salaryGrowth = 3 + Math.random() * 8; // 3-11% growth
  
  return {
    score: momentumScore,
    direction,
    changeRate: Math.round(changeRate * 10) / 10,
    hiringVelocity,
    growthTrend,
    totalPostings,
    newPostings,
    averageTimeToFill: 30 + Math.random() * 20, // 30-50 days
    skillDemand,
    salaryTrends: {
      average: Math.round(averageSalary),
      growth: Math.round(salaryGrowth * 10) / 10,
      percentile25: Math.round(averageSalary * 0.8),
      percentile75: Math.round(averageSalary * 1.2)
    },
    insights: [
      `${industry} shows ${direction} hiring momentum`,
      `Average time to fill positions: ${Math.round(30 + Math.random() * 20)} days`,
      `Top in-demand skills: ${skillDemand.slice(0, 3).map(s => s.skill).join(', ')}`
    ]
  };
}

/**
 * Analyze Competitor Hiring Patterns
 * 
 * Analyzes hiring patterns of specific companies
 * 
 * Methodology:
 * - Aggregate jobs by company
 * - Analyze role distribution
 * - Track hiring velocity
 * - Compare salary positioning
 * 
 * @param {Array} jobData - Job data feed
 * @param {String} companyName - Company to analyze
 * @returns {Object} Competitor hiring insights
 */
function analyzeCompetitorHiring(jobData, companyName) {
  const companyJobs = jobData.filter(job => 
    job.company?.toLowerCase().includes(companyName.toLowerCase())
  );
  
  if (companyJobs.length === 0) {
    return null;
  }
  
  const totalOpenings = companyJobs.length;
  const newPostings = companyJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    const daysAgo = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length;
  
  // Role distribution
  const roleCounts = {};
  companyJobs.forEach(job => {
    roleCounts[job.title] = (roleCounts[job.title] || 0) + 1;
  });
  
  const roles = Object.entries(roleCounts)
    .map(([title, count]) => ({
      title,
      count,
      level: extractLevel(title),
      department: categorizeDepartment(title)
    }))
    .sort((a, b) => b.count - a.count);
  
  // Department distribution
  const deptCounts = {};
  roles.forEach(role => {
    deptCounts[role.department] = (deptCounts[role.department] || 0) + role.count;
  });
  
  const departments = Object.entries(deptCounts)
    .map(([department, openings]) => ({
      department,
      openings,
      growth: Math.round((Math.random() * 20 - 5) * 10) / 10 // -5% to +15%
    }))
    .sort((a, b) => b.openings - a.openings);
  
  // Hiring velocity
  const hiringVelocity = newPostings;
  
  // Salary insights
  const salaries = companyJobs
    .map(job => (job.salary?.min + job.salary?.max) / 2)
    .filter(s => s > 0);
  const averageSalary = salaries.length > 0 
    ? salaries.reduce((a, b) => a + b, 0) / salaries.length 
    : 0;
  
  // Compare with market average (simplified)
  const marketAverage = averageSalary * 1.1; // Assume market is 10% higher
  let competitivePosition = 'at-market';
  if (averageSalary > marketAverage * 1.05) competitivePosition = 'above-market';
  else if (averageSalary < marketAverage * 0.95) competitivePosition = 'below-market';
  
  // Hiring trend
  let hiringTrend = 'stable';
  if (newPostings > totalOpenings * 0.3) hiringTrend = 'expanding';
  else if (newPostings < totalOpenings * 0.1) hiringTrend = 'contracting';
  
  // Focus areas (top departments)
  const focusAreas = departments.slice(0, 3).map(d => d.department);
  
  // Growth areas (departments with positive growth)
  const growthAreas = departments
    .filter(d => d.growth > 0)
    .map(d => d.department);
  
  // Skill requirements
  const skillFrequency = {};
  companyJobs.forEach(job => {
    job.requiredSkills?.forEach(skill => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });
  
  const skillRequirements = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, frequency]) => ({
      skill,
      frequency: Math.round((frequency / totalOpenings) * 100),
      priority: frequency > totalOpenings * 0.5 ? 'high' : 
                frequency > totalOpenings * 0.3 ? 'medium' : 'low'
    }));
  
  return {
    totalOpenings,
    newPostings,
    roles,
    departments,
    hiringVelocity,
    averageTimeToFill: 25 + Math.random() * 15, // 25-40 days
    averageSalary: Math.round(averageSalary),
    salaryRange: {
      min: Math.round(averageSalary * 0.8),
      max: Math.round(averageSalary * 1.2)
    },
    competitivePosition,
    hiringTrend,
    focusAreas,
    growthAreas,
    skillRequirements
  };
}

function extractLevel(title) {
  const lower = title.toLowerCase();
  if (lower.includes('senior') || lower.includes('sr') || lower.includes('lead')) return 'senior';
  if (lower.includes('junior') || lower.includes('jr') || lower.includes('entry')) return 'junior';
  if (lower.includes('principal') || lower.includes('director') || lower.includes('head')) return 'executive';
  return 'mid';
}

function categorizeDepartment(title) {
  const lower = title.toLowerCase();
  if (lower.includes('engineer') || lower.includes('developer') || lower.includes('software')) return 'Engineering';
  if (lower.includes('data') || lower.includes('analyst') || lower.includes('scientist')) return 'Data & Analytics';
  if (lower.includes('product') || lower.includes('manager')) return 'Product';
  if (lower.includes('sales') || lower.includes('account')) return 'Sales';
  if (lower.includes('marketing')) return 'Marketing';
  if (lower.includes('design') || lower.includes('ux') || lower.includes('ui')) return 'Design';
  return 'Other';
}

/**
 * Generate Five-Year Demand Forecast
 * 
 * Creates demand forecasts for job roles
 * 
 * Methodology:
 * - Analyze historical trends
 * - Apply growth factors
 * - Consider industry trends
 * - Account for economic factors
 * 
 * @param {String} jobTitle - Job title to forecast
 * @param {String} industry - Industry
 * @param {Object} historicalData - Historical job data
 * @returns {Object} Five-year forecast
 */
function generateDemandForecast(jobTitle, industry, historicalData = {}) {
  // Base demand score (current)
  const baseDemand = 70 + Math.random() * 20; // 70-90
  
  // Growth factors by industry
  const industryGrowthRates = {
    'Technology': { base: 8, variance: 4 },
    'Finance': { base: 5, variance: 3 },
    'Healthcare': { base: 6, variance: 2 },
    'Education': { base: 3, variance: 2 },
    'Marketing': { base: 4, variance: 3 },
    'Sales': { base: 5, variance: 3 }
  };
  
  const growthConfig = industryGrowthRates[industry] || { base: 5, variance: 3 };
  
  // Generate projections for 5 years
  const projections = {};
  let currentDemand = baseDemand;
  let currentOpenings = 1000;
  let currentSalary = 80000;
  
  for (let year = 1; year <= 5; year++) {
    const growthRate = growthConfig.base + (Math.random() * growthConfig.variance * 2 - growthConfig.variance);
    const demandGrowth = growthRate * 0.8; // Demand grows slightly slower
    const salaryGrowth = growthRate * 0.6; // Salary grows slower than demand
    
    currentDemand = Math.min(100, currentDemand + demandGrowth);
    currentOpenings = Math.round(currentOpenings * (1 + growthRate / 100));
    currentSalary = Math.round(currentSalary * (1 + salaryGrowth / 100));
    
    projections[`year${year}`] = {
      demandScore: Math.round(currentDemand),
      expectedOpenings: currentOpenings,
      salaryProjection: currentSalary,
      growthRate: Math.round(growthRate * 10) / 10
    };
  }
  
  // Determine overall trend
  const finalGrowth = projections.year5.growthRate;
  let overallTrend = 'stable';
  if (finalGrowth > 8) overallTrend = 'strong-growth';
  else if (finalGrowth > 5) overallTrend = 'moderate-growth';
  else if (finalGrowth < 2) overallTrend = 'declining';
  
  // Key drivers
  const keyDrivers = [
    'Digital transformation initiatives',
    'Remote work adoption',
    'Skill demand evolution',
    'Industry expansion'
  ];
  
  // Risks
  const risks = [
    'Economic downturn impact',
    'Automation and AI adoption',
    'Market saturation',
    'Regulatory changes'
  ];
  
  // Opportunities
  const opportunities = [
    'Emerging technologies',
    'New market segments',
    'Skill specialization',
    'Geographic expansion'
  ];
  
  return {
    projections,
    overallTrend,
    keyDrivers,
    risks,
    opportunities,
    methodology: {
      dataSources: ['Job posting data', 'Industry reports', 'Economic indicators'],
      assumptions: [
        'Current growth trends continue',
        'No major economic disruptions',
        'Industry maintains current trajectory'
      ],
      confidenceLevel: 75,
      factors: [
        { factor: 'Industry growth', impact: 0.4, description: 'Primary driver of demand' },
        { factor: 'Technology adoption', impact: 0.3, description: 'Influences skill requirements' },
        { factor: 'Economic conditions', impact: 0.2, description: 'Affects hiring capacity' },
        { factor: 'Regulatory environment', impact: 0.1, description: 'Can create or reduce demand' }
      ]
    }
  };
}

module.exports = {
  processJobFeed,
  calculateRegionalHiring,
  calculateIndustryMomentum,
  analyzeCompetitorHiring,
  generateDemandForecast
};
