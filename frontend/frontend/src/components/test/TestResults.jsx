// components/test/TestResults.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function TestResults({ attempt, onBack, onRetake }) {
  const [detailedAttempt, setDetailedAttempt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetailedResults();
  }, []);

  const fetchDetailedResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/test/result/${attempt._id}`);
      setDetailedAttempt(response.data);
    } catch (error) {
      alert('Failed to load results: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading || !detailedAttempt) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  const test = detailedAttempt.testId;
  const score = detailedAttempt.score;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Test Results</h2>
        <h3 className="text-xl mb-6">{test.title}</h3>
        <div className="text-6xl font-bold mb-2">{score.percentage.toFixed(1)}%</div>
        <p className="text-lg opacity-90">
          {score.obtained} out of {score.total} marks
        </p>
        <div className="mt-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            detailedAttempt.isPassed
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {detailedAttempt.isPassed ? 'PASSED' : 'FAILED'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Question Review</h3>
        <div className="space-y-4">
          {detailedAttempt.answers.map((answer, index) => {
            const question = answer.questionId;
            return (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-4 ${
                  answer.isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Question {index + 1}: {question.questionText}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your Answer: <span className="font-semibold">{answer.answer}</span>
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-sm text-green-700 mt-1">
                        Correct Answer: {question.correctAnswer || question.options?.find(o => o.isCorrect)?.text}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      answer.isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      {answer.marksObtained}/{question.marks || 1} marks
                    </p>
                  </div>
                </div>
                {question.explanation && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => onRetake(test)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Retake Test
        </button>
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Back to Tests
        </button>
      </div>
    </div>
  );
}

export default TestResults;
