// services/assessmentLogic.js
/**
 * AI-Powered Career Assessment Logic
 * 
 * This module implements explainable, rule-based algorithms for:
 * 1. Personality trait scoring
 * 2. Skill-role matching
 * 3. Career clustering
 * 4. Recommendation generation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Personality Trait Scoring Algorithm
 * 
 * Methodology:
 * - Each question maps to one or more personality traits
 * - Answers are scored on a 1-5 scale (Strongly Disagree to Strongly Agree)
 * - Trait scores are calculated as weighted averages of relevant question responses
 * - Final scores normalized to 0-100 scale
 * 
 * @param {Array} responses - User responses with questionId and answer (1-5)
 * @param {Array} questions - Question metadata with trait mappings
 * @returns {Object} Personality trait scores
 */
function calculatePersonalityTraits(responses, questions) {
  const traitScores = {};
  const traitWeights = {};
  
  // Initialize trait accumulators
  const traits = ['analytical', 'creative', 'leadership', 'detail-oriented', 'communicative', 'collaborative', 'independent', 'structured'];
  traits.forEach(trait => {
    traitScores[trait] = 0;
    traitWeights[trait] = 0;
  });
  
  // Process each response
  responses.forEach(response => {
    const question = questions.find(q => q._id.toString() === response.questionId || q.id === response.questionId);
    if (!question) return;
    
    const answer = response.answer; // 1-5 scale
    const trait = question.trait || question.type;
    const weight = question.weight || 1;
    
    if (traitScores.hasOwnProperty(trait)) {
      traitScores[trait] += answer * weight;
      traitWeights[trait] += weight;
    }
  });
  
  // Normalize scores to 0-100
  const normalizedTraits = {};
  traits.forEach(trait => {
    if (traitWeights[trait] > 0) {
      // Convert 1-5 scale to 0-100: ((score/weight - 1) / 4) * 100
      normalizedTraits[trait] = Math.round(((traitScores[trait] / traitWeights[trait] - 1) / 4) * 100);
    } else {
      normalizedTraits[trait] = 50; // Default neutral score
    }
  });
  
  return normalizedTraits;
}

/**
 * Determine Primary Personality Type
 * 
 * Based on trait scores, classify user into primary personality archetype
 * 
 * @param {Object} traitScores - Normalized trait scores (0-100)
 * @returns {Object} Personality type and description
 */
function determinePersonalityType(traitScores) {
  const types = {
    'Analytical Thinker': {
      traits: ['analytical', 'detail-oriented', 'structured'],
      description: 'You excel at data-driven decision making and systematic problem-solving.'
    },
    'Creative Innovator': {
      traits: ['creative', 'independent'],
      description: 'You thrive in environments that value innovation and original thinking.'
    },
    'Natural Leader': {
      traits: ['leadership', 'communicative', 'collaborative'],
      description: 'You are skilled at guiding teams and inspiring others to achieve goals.'
    },
    'Detail Specialist': {
      traits: ['detail-oriented', 'structured', 'analytical'],
      description: 'You excel at precision work and maintaining high quality standards.'
    },
    'Team Collaborator': {
      traits: ['collaborative', 'communicative'],
      description: 'You work best in team environments and value interpersonal connections.'
    },
    'Independent Professional': {
      traits: ['independent', 'structured'],
      description: 'You prefer autonomous work and self-directed projects.'
    }
  };
  
  let bestMatch = null;
  let bestScore = 0;
  
  // Calculate match score for each type
  Object.keys(types).forEach(typeName => {
    const type = types[typeName];
    let matchScore = 0;
    let totalWeight = 0;
    
    type.traits.forEach(trait => {
      const score = traitScores[trait] || 50;
      matchScore += score;
      totalWeight += 1;
    });
    
    const avgScore = matchScore / totalWeight;
    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestMatch = {
        type: typeName,
        description: type.description,
        confidence: Math.round(avgScore)
      };
    }
  });
  
  return bestMatch || { type: 'Balanced Professional', description: 'You have a well-rounded professional profile.', confidence: 50 };
}

/**
 * Skill-Role Matching Algorithm
 * 
 * Calculates how well user's assessed skills match required skills for each role
 * 
 * Methodology:
 * - Compare user's trait scores to role's required traits
 * - Weight matches by importance (essential > important > preferred)
 * - Calculate match percentage
 * 
 * @param {Object} userTraits - User's personality trait scores
 * @param {Array} roles - Career roles with required traits
 * @returns {Array} Sorted roles by match score
 */
function matchSkillsToRoles(userTraits, roles) {
  const roleMatches = [];
  
  roles.forEach(role => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const matchedTraits = [];
    const missingTraits = [];
    
    role.requiredTraits.forEach(requiredTrait => {
      const userScore = userTraits[requiredTrait.trait] || 50;
      const minRequired = requiredTrait.minScore || 50;
      const weight = requiredTrait.weight || 1;
      
      maxPossibleScore += 100 * weight;
      
      if (userScore >= minRequired) {
        // User meets requirement - score based on how much they exceed it
        const excess = Math.min(userScore - minRequired, 50); // Cap bonus at 50 points
        totalScore += (minRequired + excess) * weight;
        matchedTraits.push({
          trait: requiredTrait.trait,
          userScore,
          required: minRequired,
          status: 'met'
        });
      } else {
        // User doesn't meet requirement - partial credit
        const gap = minRequired - userScore;
        const penalty = Math.min(gap, 50); // Max penalty of 50 points
        totalScore += (minRequired - penalty) * weight;
        missingTraits.push({
          trait: requiredTrait.trait,
          userScore,
          required: minRequired,
          gap: gap,
          status: 'gap'
        });
      }
    });
    
    const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    // Generate reasons for match
    const reasons = [];
    if (matchedTraits.length > 0) {
      const topMatch = matchedTraits.sort((a, b) => (b.userScore - b.required) - (a.userScore - a.required))[0];
      reasons.push(`Strong ${topMatch.trait} alignment (${topMatch.userScore}% vs ${topMatch.required}% required)`);
    }
    if (matchedTraits.length >= role.requiredTraits.length * 0.7) {
      reasons.push('Meets majority of required traits');
    }
    if (role.growthProjection > 10) {
      reasons.push(`High growth field (${role.growthProjection}% projected growth)`);
    }
    
    roleMatches.push({
      roleId: role._id,
      title: role.title,
      description: role.description,
      cluster: role.cluster,
      matchScore: matchPercentage,
      reasons,
      matchedTraits: matchedTraits.length,
      totalTraits: role.requiredTraits.length,
      skillGaps: missingTraits.slice(0, 3).map(gap => ({
        skill: gap.trait,
        currentLevel: gap.userScore,
        requiredLevel: gap.required,
        gap: gap.gap,
        priority: gap.gap > 30 ? 'high' : gap.gap > 15 ? 'medium' : 'low'
      }))
    });
  });
  
  // Sort by match score (descending)
  return roleMatches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Career Clustering Algorithm
 * 
 * Groups recommended careers into clusters based on similarity
 * Uses simple distance-based clustering (explainable)
 * 
 * Methodology:
 * - Calculate trait similarity between roles
 * - Group roles with high similarity (>70% trait overlap)
 * - Assign cluster labels based on dominant traits
 * 
 * @param {Array} recommendedRoles - Roles sorted by match score
 * @returns {Array} Clustered career recommendations
 */
function clusterCareers(recommendedRoles) {
  if (recommendedRoles.length === 0) return [];
  
  const clusters = [];
  const processed = new Set();
  
  recommendedRoles.forEach(role => {
    if (processed.has(role.roleId)) return;
    
    const cluster = {
      clusterName: role.cluster || 'General',
      careers: [role],
      avgMatchScore: role.matchScore,
      dominantTraits: []
    };
    
    // Find similar roles (same cluster or high match score)
    recommendedRoles.forEach(otherRole => {
      if (otherRole.roleId === role.roleId || processed.has(otherRole.roleId)) return;
      
      // Simple similarity: same cluster or within 10% match score
      if (otherRole.cluster === role.cluster || Math.abs(otherRole.matchScore - role.matchScore) < 10) {
        cluster.careers.push(otherRole);
        processed.add(otherRole.roleId);
        cluster.avgMatchScore = Math.round(
          cluster.careers.reduce((sum, r) => sum + r.matchScore, 0) / cluster.careers.length
        );
      }
    });
    
    processed.add(role.roleId);
    clusters.push(cluster);
  });
  
  // Sort clusters by average match score
  return clusters.sort((a, b) => b.avgMatchScore - a.avgMatchScore);
}

/**
 * Generate Career Recommendations
 * 
 * Main function that orchestrates the assessment pipeline
 * 
 * @param {Array} responses - User assessment responses
 * @param {Array} questions - Assessment questions
 * @param {Array} allRoles - All available career roles
 * @returns {Object} Complete assessment results
 */
function generateRecommendations(responses, questions, allRoles) {
  // Step 1: Calculate personality traits
  const traitScores = calculatePersonalityTraits(responses, questions);
  
  // Step 2: Determine personality type
  const personalityType = determinePersonalityType(traitScores);
  
  // Step 3: Match skills to roles
  const roleMatches = matchSkillsToRoles(traitScores, allRoles);
  
  // Step 4: Get top recommendations
  const topRecommendations = roleMatches.slice(0, 10);
  
  // Step 5: Cluster careers
  const careerClusters = clusterCareers(topRecommendations);
  
  // Step 6: Aggregate skill gaps from top recommendations
  const allSkillGaps = {};
  topRecommendations.forEach(role => {
    role.skillGaps.forEach(gap => {
      if (!allSkillGaps[gap.skill] || gap.gap > allSkillGaps[gap.skill].gap) {
        allSkillGaps[gap.skill] = gap;
      }
    });
  });
  
  const skillGaps = Object.values(allSkillGaps)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 5);
  
  return {
    personalityType: personalityType.type,
    personalityDescription: personalityType.description,
    confidence: personalityType.confidence,
    traits: Object.keys(traitScores).map(trait => ({
      name: trait,
      score: traitScores[trait]
    })),
    recommendedCareers: topRecommendations.map(role => ({
      title: role.title,
      description: role.description,
      cluster: role.cluster,
      matchScore: role.matchScore,
      reasons: role.reasons
    })),
    careerClusters: careerClusters.map(cluster => ({
      clusterName: cluster.clusterName,
      careers: cluster.careers.map(c => c.title),
      avgMatchScore: cluster.avgMatchScore
    })),
    skillGaps
  };
}

module.exports = {
  calculatePersonalityTraits,
  determinePersonalityType,
  matchSkillsToRoles,
  clusterCareers,
  generateRecommendations
};
