// services/testService.js
/**
 * Test Service
 * 
 * This module implements explainable logic for:
 * 1. AI-generated question creation
 * 2. Test scoring and evaluation
 * 3. Performance analytics
 * 4. Test result generation
 * 
 * All algorithms are transparent and suitable for academic explanation.
 */

/**
 * Generate AI Questions
 * 
 * Generates questions based on field, topic, and difficulty
 * 
 * Methodology:
 * - Use templates based on field and topic
 * - Generate question text with variations
 * - Create multiple choice options with one correct answer
 * - Generate explanations
 * - Ensure questions are appropriate for difficulty level
 * 
 * @param {String} field - Technical field (Frontend, Backend, etc.)
 * @param {String} topic - Specific topic within field
 * @param {String} difficulty - easy, medium, hard
 * @param {Number} count - Number of questions to generate
 * @returns {Array} Generated questions
 */
function generateAIQuestions(field, topic, difficulty, count = 5) {
  const questions = [];
  
  // Question templates by field
  const templates = {
    'Frontend': {
      'React': [
        {
          question: 'What is the purpose of React hooks?',
          options: [
            { text: 'To manage component state and side effects', isCorrect: true },
            { text: 'To style React components', isCorrect: false },
            { text: 'To handle routing in React', isCorrect: false },
            { text: 'To optimize React performance', isCorrect: false }
          ],
          explanation: 'React hooks allow functional components to use state and lifecycle features that were previously only available in class components.'
        },
        {
          question: 'Which hook is used to manage state in functional components?',
          options: [
            { text: 'useState', isCorrect: true },
            { text: 'useEffect', isCorrect: false },
            { text: 'useContext', isCorrect: false },
            { text: 'useReducer', isCorrect: false }
          ],
          explanation: 'useState is the primary hook for managing component state in functional components.'
        }
      ],
      'JavaScript': [
        {
          question: 'What is the difference between let and var in JavaScript?',
          options: [
            { text: 'let has block scope, var has function scope', isCorrect: true },
            { text: 'let is faster than var', isCorrect: false },
            { text: 'var is deprecated in ES6', isCorrect: false },
            { text: 'There is no difference', isCorrect: false }
          ],
          explanation: 'let has block scope (limited to the block where it is declared), while var has function scope.'
        }
      ]
    },
    'Backend': {
      'Node.js': [
        {
          question: 'What is the event loop in Node.js?',
          options: [
            { text: 'A mechanism that handles asynchronous operations', isCorrect: true },
            { text: 'A loop that processes HTTP requests', isCorrect: false },
            { text: 'A debugging tool', isCorrect: false },
            { text: 'A performance optimization technique', isCorrect: false }
          ],
          explanation: 'The event loop is Node.js\'s mechanism for handling asynchronous operations, allowing non-blocking I/O.'
        }
      ],
      'API': [
        {
          question: 'What is RESTful API?',
          options: [
            { text: 'An architectural style for designing web services', isCorrect: true },
            { text: 'A programming language', isCorrect: false },
            { text: 'A database management system', isCorrect: false },
            { text: 'A frontend framework', isCorrect: false }
          ],
          explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications.'
        }
      ]
    },
    'Web3': {
      'Blockchain': [
        {
          question: 'What is a smart contract?',
          options: [
            { text: 'Self-executing code stored on blockchain', isCorrect: true },
            { text: 'A legal document', isCorrect: false },
            { text: 'A cryptocurrency wallet', isCorrect: false },
            { text: 'A blockchain node', isCorrect: false }
          ],
          explanation: 'Smart contracts are self-executing contracts with terms directly written into code and stored on blockchain.'
        }
      ]
    },
    'DevOps': {
      'CI/CD': [
        {
          question: 'What does CI/CD stand for?',
          options: [
            { text: 'Continuous Integration / Continuous Deployment', isCorrect: true },
            { text: 'Code Integration / Code Deployment', isCorrect: false },
            { text: 'Computer Integration / Computer Deployment', isCorrect: false },
            { text: 'Cloud Integration / Cloud Deployment', isCorrect: false }
          ],
          explanation: 'CI/CD automates the integration and deployment of code changes.'
        }
      ]
    }
  };
  
  // Get field-specific templates
  const fieldTemplates = templates[field] || templates['Frontend'];
  const topicTemplates = fieldTemplates[topic] || fieldTemplates[Object.keys(fieldTemplates)[0]];
  
  // Generate questions
  for (let i = 0; i < count && i < topicTemplates.length; i++) {
    const template = topicTemplates[i];
    questions.push({
      questionText: template.question,
      questionType: 'multiple-choice',
      options: template.options,
      correctAnswer: template.options.find(opt => opt.isCorrect)?.text,
      explanation: template.explanation,
      marks: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      difficulty,
      topic,
      field,
      isAIGenerated: true
    });
  }
  
  // If not enough templates, generate variations
  while (questions.length < count) {
    const baseQuestion = questions[questions.length % topicTemplates.length] || topicTemplates[0];
    questions.push({
      questionText: `${baseQuestion.question} (Variation ${questions.length + 1})`,
      questionType: 'multiple-choice',
      options: baseQuestion.options.map(opt => ({ ...opt })),
      correctAnswer: baseQuestion.options.find(opt => opt.isCorrect)?.text,
      explanation: baseQuestion.explanation,
      marks: baseQuestion.marks || 1,
      difficulty,
      topic,
      field,
      isAIGenerated: true
    });
  }
  
  return questions.slice(0, count);
}

/**
 * Calculate Test Score
 * 
 * Calculates score based on student answers
 * 
 * Methodology:
 * - Compare each answer with correct answer
 * - Award marks for correct answers
 * - Calculate percentage score
 * - Determine pass/fail status
 * 
 * @param {Array} answers - Student answers
 * @param {Array} questions - Test questions with correct answers
 * @returns {Object} Score calculation results
 */
function calculateScore(answers, questions) {
  let obtainedMarks = 0;
  let totalMarks = 0;
  const detailedResults = [];
  
  questions.forEach(question => {
    const answer = answers.find(a => 
      a.questionId.toString() === question._id.toString()
    );
    
    totalMarks += question.marks || 1;
    
    if (answer) {
      let isCorrect = false;
      
      // Check answer based on question type
      if (question.questionType === 'multiple-choice') {
        isCorrect = answer.answer === question.correctAnswer ||
                    question.options?.find(opt => opt.text === answer.answer && opt.isCorrect);
      } else if (question.questionType === 'true-false') {
        isCorrect = answer.answer === question.correctAnswer;
      } else {
        // For coding/short-answer, use simple string matching (in production, would use more sophisticated checking)
        isCorrect = String(answer.answer).toLowerCase().trim() === 
                   String(question.correctAnswer).toLowerCase().trim();
      }
      
      if (isCorrect) {
        obtainedMarks += question.marks || 1;
      }
      
      detailedResults.push({
        questionId: question._id,
        isCorrect,
        marksObtained: isCorrect ? (question.marks || 1) : 0,
        timeSpent: answer.timeSpent || 0
      });
    } else {
      detailedResults.push({
        questionId: question._id,
        isCorrect: false,
        marksObtained: 0,
        timeSpent: 0
      });
    }
  });
  
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  
  return {
    obtained: obtainedMarks,
    total: totalMarks,
    percentage: Math.round(percentage * 100) / 100,
    detailedResults
  };
}

/**
 * Generate Test Analytics
 * 
 * Analyzes test performance across all attempts
 * 
 * Methodology:
 * - Aggregate all attempts for a test
 * - Calculate average scores, pass rates
 * - Analyze question-level performance
 * - Track trends over time
 * 
 * @param {Array} attempts - All student attempts for the test
 * @param {Object} test - Test details
 * @returns {Object} Analytics data
 */
function generateAnalytics(attempts, test) {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      totalStudents: 0,
      averageScore: 0,
      passRate: 0,
      averageTimeSpent: 0,
      scoreDistribution: {
        excellent: 0,
        good: 0,
        average: 0,
        belowAverage: 0,
        fail: 0
      }
    };
  }
  
  const totalAttempts = attempts.length;
  const uniqueStudents = new Set(attempts.map(a => a.studentId.toString())).size;
  
  const scores = attempts
    .filter(a => a.status === 'completed' || a.status === 'submitted')
    .map(a => a.score?.percentage || 0);
  
  const averageScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
  
  const passed = attempts.filter(a => 
    a.isPassed || (a.score?.percentage || 0) >= (test.passingScore || 60)
  ).length;
  
  const passRate = totalAttempts > 0 ? (passed / totalAttempts) * 100 : 0;
  
  // Calculate average time spent
  const times = attempts
    .filter(a => a.startedAt && a.submittedAt)
    .map(a => {
      const diff = new Date(a.submittedAt) - new Date(a.startedAt);
      return diff / (1000 * 60); // Convert to minutes
    });
  
  const averageTimeSpent = times.length > 0
    ? times.reduce((a, b) => a + b, 0) / times.length
    : 0;
  
  // Score distribution
  const distribution = {
    excellent: scores.filter(s => s >= 90).length,
    good: scores.filter(s => s >= 80 && s < 90).length,
    average: scores.filter(s => s >= 70 && s < 80).length,
    belowAverage: scores.filter(s => s >= 60 && s < 70).length,
    fail: scores.filter(s => s < 60).length
  };
  
  return {
    totalAttempts,
    totalStudents: uniqueStudents,
    averageScore: Math.round(averageScore * 100) / 100,
    passRate: Math.round(passRate * 100) / 100,
    averageTimeSpent: Math.round(averageTimeSpent * 100) / 100,
    scoreDistribution: distribution
  };
}

module.exports = {
  generateAIQuestions,
  calculateScore,
  generateAnalytics
};
