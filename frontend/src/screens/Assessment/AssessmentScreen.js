import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

function AssessmentScreen() {
    const [assessments, setAssessments] = useState([]);
    const [showTest, setShowTest] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    const questions = [
        { id: 1, question: "I enjoy working with data and numbers", type: "analytical" },
        { id: 2, question: "I prefer leading teams rather than working alone", type: "leadership" },
        { id: 3, question: "I am creative and enjoy innovative solutions", type: "creative" },
        { id: 4, question: "I pay close attention to details", type: "detail" },
        { id: 5, question: "I enjoy public speaking and presentations", type: "communication" }
    ];

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get('/assessment/results');
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer) => {
        const newResponses = [...responses, { questionId: questions[currentQuestion].id, answer }];
        setResponses(newResponses);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            submitAssessment(newResponses);
        }
    };

    const submitAssessment = async (finalResponses) => {
        try {
            await api.post('/assessment/submit', {
                assessmentType: 'personality',
                responses: finalResponses
            });
            setShowTest(false);
            setCurrentQuestion(0);
            setResponses([]);
            fetchAssessments();
            alert('Assessment completed successfully!');
        } catch (error) {
            alert('Failed to submit assessment');
        }
    };

    if (loading && !showTest) {
        return <LoadingSpinner message="Loading assessments..." />;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Career Assessment</h1>
                {!showTest && (
                    <button
                        onClick={() => setShowTest(true)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        Take Assessment
                    </button>
                )}
            </div>

            {showTest ? (
                <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all"
                                style={{ width: ${((currentQuestion + 1) / questions.length) * 100}% }}
              />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-8">{questions[currentQuestion].question}</h2>

                    <div className="space-y-3">
                        {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index + 1)}
                                className="w-full py-4 px-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left font-medium"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {assessments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-500 text-lg mb-4">No assessments completed yet</p>
                            <p className="text-gray-400">Take your first career assessment to discover your strengths!</p>
                        </div>
                    ) : (
                        assessments.map((assessment) => (
                            <div key={assessment._id} className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Career Assessment Results</h3>
                                        <p className="text-gray-600">Completed {new Date(assessment.completedAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold">
                                        {assessment.results.personalityType}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 mb-3">Recommended Careers</h4>
                                    <div className="space-y-2">
                                        {assessment.results.recommendedCareers?.slice(0, 3).map((career, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium text-gray-800">{career.title}</span>
                                                <span className="text-purple-600 font-semibold">{career.matchScore}% Match</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3">Skill Gaps</h4>
                                    <div className="space-y-2">
                                        {assessment.results.skillGaps?.slice(0, 3).map((gap, i) => (
                                            <div key={i} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-gray-800">{gap.skill}</span>
                                                    <span className="text-sm text-gray-600">Priority: {gap.priority}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-500 h-2 rounded-full"
                                                        style={{ width: ${(gap.currentLevel / gap.requiredLevel) * 100}% }}
                          />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default AssessmentScreen;