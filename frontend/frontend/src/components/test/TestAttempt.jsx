// components/test/TestAttempt.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../services/api';
import TestEnvironment3D from '../3d/TestEnvironment3D';
import { fadeIn, slideUp } from '../../utils/animations';

function TestAttempt({ test, onComplete, onBack }) {
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startAttempt();
    fetchTestDetails();
  }, []);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const startAttempt = async () => {
    try {
      const response = await axios.post(`/test/${test._id}/attempt`);
      setAttempt(response.data);
      setTimeRemaining(response.data.timeRemaining);
    } catch (error) {
      alert('Failed to start test: ' + (error.response?.data?.error || error.message));
      onBack();
    }
  };

  const fetchTestDetails = async () => {
    try {
      const response = await axios.get(`/test/${test._id}`);
      setQuestions(response.data.questions || []);
    } catch (error) {
      alert('Failed to load test: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];
    setAnswers({
      ...answers,
      [question._id]: {
        questionId: question._id,
        answer,
        timeSpent: 0 // Could track time per question
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit the test?')) {
      return;
    }

    setLoading(true);
    try {
      const answerArray = Object.values(answers);
      const response = await axios.post(`/test/attempt/${attempt._id}/submit`, {
        answers: answerArray
      });
      onComplete(response.data);
    } catch (error) {
      alert('Failed to submit test: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading test...</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers[question._id]?.answer;

  return (
    <motion.div
      {...fadeIn}
      className="space-y-6"
    >
      {/* 3D Test Environment */}
      <TestEnvironment3D
        questions={questions}
        currentQuestion={currentQuestion}
        timeRemaining={timeRemaining}
      />

      <motion.div
        {...slideUp}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{test.title}</h2>
            <p className="text-sm text-gray-600">{test.field} • {test.difficulty}</p>
          </div>
          {timeRemaining !== null && (
            <motion.div
              animate={{
                scale: timeRemaining < 300 ? [1, 1.1, 1] : 1,
                color: timeRemaining < 300 ? '#EF4444' : '#1F2937'
              }}
              transition={{ repeat: timeRemaining < 300 ? Infinity : 0, duration: 1 }}
              className="text-2xl font-bold"
            >
              {formatTime(timeRemaining)}
            </motion.div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">{question.questionText}</h3>
            
            {question.questionType === 'multiple-choice' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.text)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 border-2 rounded-lg text-left font-medium transition ${
                      currentAnswer === option.text
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            )}

            {question.questionType === 'true-false' && (
              <div className="space-y-3">
                <motion.button
                  onClick={() => handleAnswer('True')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 border-2 rounded-lg font-medium transition ${
                    currentAnswer === 'True'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  True
                </motion.button>
                <motion.button
                  onClick={() => handleAnswer('False')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 border-2 rounded-lg font-medium transition ${
                    currentAnswer === 'False'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  False
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <motion.button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              whileHover={{ scale: currentQuestion === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentQuestion === 0 ? 1 : 0.95 }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50"
            >
              Previous
            </motion.button>
            {currentQuestion < questions.length - 1 ? (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ repeat: loading ? Infinity : 0, duration: 1 }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Test'}
              </motion.button>
            )}
          </div>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TestAttempt;
