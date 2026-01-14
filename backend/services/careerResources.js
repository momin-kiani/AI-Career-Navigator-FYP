// services/careerResources.js
/**
 * Career Resources Service
 * 
 * This module implements logic for:
 * 1. Progress tracking calculations
 * 2. Visual report data generation
 * 3. Activity aggregation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Calculate Overall Progress
 * 
 * Aggregates progress across all modules
 * 
 * @param {Array} progressRecords - Array of progress records per module
 * @returns {Object} Overall progress summary
 */
function calculateOverallProgress(progressRecords) {
  if (!progressRecords || progressRecords.length === 0) {
    return {
      overallProgress: 0,
      moduleCount: 0,
      completedModules: 0,
      averageProgress: 0
    };
  }

  const totalProgress = progressRecords.reduce((sum, record) => sum + (record.progress || 0), 0);
  const averageProgress = Math.round(totalProgress / progressRecords.length);
  const completedModules = progressRecords.filter(r => r.progress >= 100).length;

  return {
    overallProgress: averageProgress,
    moduleCount: progressRecords.length,
    completedModules,
    averageProgress,
    moduleProgress: progressRecords.map(r => ({
      module: r.module,
      moduleName: r.moduleName,
      progress: r.progress
    }))
  };
}

/**
 * Generate Visual Report Data
 * 
 * Prepares data for charts and visualizations
 * 
 * @param {Array} progressRecords - Progress records
 * @param {Array} activities - Activity timeline records
 * @param {Object} userStats - User statistics (resumes, jobs, contacts, etc.)
 * @returns {Object} Formatted data for visualizations
 */
function generateVisualReportData(progressRecords, activities, userStats) {
  // Progress by Module (for bar chart)
  const progressByModule = progressRecords.map(r => ({
    module: r.moduleName,
    progress: r.progress
  }));

  // Activity Timeline (for line chart)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const recentActivities = activities.filter(a => new Date(a.timestamp) >= last30Days);
  const activitiesByDate = {};
  
  recentActivities.forEach(activity => {
    const date = new Date(activity.timestamp).toISOString().split('T')[0];
    activitiesByDate[date] = (activitiesByDate[date] || 0) + 1;
  });

  const activityTimeline = Object.entries(activitiesByDate).map(([date, count]) => ({
    date,
    count
  })).sort((a, b) => a.date.localeCompare(b.date));

  // Activity by Type (for pie chart)
  const activityByType = {};
  activities.forEach(activity => {
    activityByType[activity.activityType] = (activityByType[activity.activityType] || 0) + 1;
  });

  const activityDistribution = Object.entries(activityByType).map(([type, count]) => ({
    type: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count
  }));

  // User Statistics Summary
  const stats = {
    resumes: userStats.resumes || 0,
    jobApplications: userStats.jobApplications || 0,
    contacts: userStats.contacts || 0,
    assessments: userStats.assessments || 0,
    badges: userStats.badges || 0,
    documents: userStats.documents || 0
  };

  // Progress Trend (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const recentProgressUpdates = progressRecords
    .filter(r => r.lastUpdated && new Date(r.lastUpdated) >= last7Days)
    .map(r => ({
      module: r.moduleName,
      date: new Date(r.lastUpdated).toISOString().split('T')[0],
      progress: r.progress
    }));

  return {
    progressByModule,
    activityTimeline,
    activityDistribution,
    stats,
    recentProgressUpdates,
    insights: generateInsights(progressRecords, activities, stats)
  };
}

/**
 * Generate Insights
 * 
 * Provides actionable insights based on user data
 * 
 * @param {Array} progressRecords - Progress records
 * @param {Array} activities - Activity timeline
 * @param {Object} stats - User statistics
 * @returns {Array} Insight messages
 */
function generateInsights(progressRecords, activities, stats) {
  const insights = [];

  // Progress insights
  const lowProgressModules = progressRecords.filter(r => r.progress < 50);
  if (lowProgressModules.length > 0) {
    insights.push({
      type: 'warning',
      message: `You have ${lowProgressModules.length} module(s) with less than 50% progress. Consider focusing on: ${lowProgressModules.map(m => m.moduleName).join(', ')}`
    });
  }

  // Activity insights
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentActivities = activities.filter(a => new Date(a.timestamp) >= last7Days);
  
  if (recentActivities.length === 0) {
    insights.push({
      type: 'info',
      message: 'No activity in the last 7 days. Start engaging with the platform to track your career progress!'
    });
  } else if (recentActivities.length < 3) {
    insights.push({
      type: 'info',
      message: 'Low activity this week. Consider uploading a resume, applying to jobs, or completing an assessment.'
    });
  } else {
    insights.push({
      type: 'success',
      message: `Great activity! You've completed ${recentActivities.length} activities in the last 7 days. Keep it up!`
    });
  }

  // Stats insights
  if (stats.resumes === 0) {
    insights.push({
      type: 'warning',
      message: 'Upload your resume to get started with resume optimization and ATS scoring.'
    });
  }

  if (stats.jobApplications === 0) {
    insights.push({
      type: 'info',
      message: 'Start tracking your job applications to manage your job search effectively.'
    });
  }

  if (stats.contacts === 0) {
    insights.push({
      type: 'info',
      message: 'Build your professional network by adding contacts and tracking opportunities.'
    });
  }

  return insights;
}

module.exports = {
  calculateOverallProgress,
  generateVisualReportData,
  generateInsights
};
