// pages/AssessmentModule.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../services/api';
import { fadeIn, slideUp, pageTransition } from '../utils/animations';
import AssessmentResults from '../components/assessment/AssessmentResults';

function AssessmentModule() {
  const [assessments, setAssessments] = useState([]);
  const [showTest, setShowTest] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  useEffect(() => {
    if (showTest) {
      fetchQuestions();
    }
  }, [showTest]);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const response = await axios.get('/assessment/questions');
      setQuestions(response.data);
      setCurrentQuestion(0);
      setResponses([]);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load assessment questions');
      setShowTest(false);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await axios.get('/assessment/results');
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];
    const newResponse = {
      questionId: question._id || question.id,
      question: question.questionText,
      answer: answer
    };
    
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment(newResponses);
    }
  };

  const submitAssessment = async (finalResponses) => {
    setLoading(true);
    try {
      const response = await axios.post('/assessment/submit', {
        assessmentType: 'personality',
        responses: finalResponses
      });
      
      setCurrentAssessment(response.data);
      setShowTest(false);
      setCurrentQuestion(0);
      setResponses([]);
      fetchAssessments();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setShowTest(true);
    setCurrentAssessment(null);
  };

  const handleViewResults = (assessment) => {
    setCurrentAssessment(assessment);
    setShowTest(false);
  };

  if (currentAssessment) {
    return (
      <AssessmentResults 
        assessment={currentAssessment}
        onBack={() => {
          setCurrentAssessment(null);
          fetchAssessments();
        }}
        onRetake={handleStartAssessment}
      />
    );
  }

  if (showTest) {
    if (loadingQuestions) {
      return (
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assessment questions...</p>
          </div>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No questions available</p>
            <button
              onClick={() => setShowTest(false)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">{questions[currentQuestion].questionText}</h2>

          <div className="space-y-3">
            {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                disabled={loading}
                className="w-full py-4 px-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left font-medium disabled:opacity-50"
              >
                {option}
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Processing your assessment...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Career Fit Assessment</h1>
          <p className="text-gray-600 mt-2">Discover your ideal career path through AI-powered analysis</p>
        </div>
        <button
          onClick={handleStartAssessment}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Take Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
          <p className="text-purple-100 text-sm">Our algorithm analyzes your personality traits, skills, and preferences to match you with ideal careers.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Comprehensive Results</h3>
          <p className="text-blue-100 text-sm">Get detailed insights including personality profile, career recommendations, and skill gap analysis.</p>
        </div>
      </div>

      <div className="space-y-6">
        {assessments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg mb-4">No assessments completed yet</p>
            <p className="text-gray-400 mb-6">Take your first career assessment to discover your strengths and ideal career paths!</p>
            <button
              onClick={handleStartAssessment}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Start Assessment
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Previous Assessments</h2>
            {assessments.map((assessment) => (
              <div key={assessment._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Career Assessment Results</h3>
                    <p className="text-gray-600">Completed {new Date(assessment.completedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold">
                      {assessment.results?.personalityType || 'N/A'}
                    </span>
                    <button
                      onClick={() => handleViewResults(assessment)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {assessment.results?.recommendedCareers && assessment.results.recommendedCareers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Top Recommendations</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessment.results.recommendedCareers.slice(0, 3).map((career, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {career.title} ({career.matchScore}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default AssessmentModule;
