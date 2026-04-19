import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [modulesInfo, setModulesInfo] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    checkAccessAndStartTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitting]);

  const checkAccessAndStartTest = async () => {
    try {
      setCheckingAccess(true);
      
      // Fetch test details
      const testRes = await axios.get(`http://localhost:8080/api/tests/${testId}`);
      const testData = testRes.data;
      setTest(testData);
      
      // Fetch all modules for this test
      const modulesRes = await axios.get(`http://localhost:8080/api/modules/test/${testId}`);
      const modules = modulesRes.data;
      
      // Get completed modules from localStorage
      const savedProgress = localStorage.getItem(`course_${testId}_progress`);
      const completedModules = savedProgress ? JSON.parse(savedProgress) : [];
      
      const totalModules = modules.length;
      const completedCount = completedModules.length;
      
      setModulesInfo({ total: totalModules, completed: completedCount });
      
      // Check if all modules are completed
      if (totalModules > 0 && completedCount !== totalModules) {
        setAccessDenied(true);
        toast.error(`Please complete all ${totalModules} modules before taking the test. You have completed ${completedCount}/${totalModules}.`, {
          duration: 5000
        });
        setCheckingAccess(false);
        return;
      }
      
      // If no modules or all modules completed, start the test
      await startTest();
      
    } catch (error) {
      console.error('Error checking access:', error);
      toast.error('Failed to load test');
      setCheckingAccess(false);
    }
  };

  const startTest = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/attempts/start?testId=${testId}`);
      setAttempt(response.data);
      setTimeLeft(response.data.duration * 60);
      
      // Initialize answers
      const initialAnswers = {};
      if (response.data.questions && response.data.questions.length > 0) {
        response.data.questions.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
      }
      
      setCheckingAccess(false);
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error(error.response?.data?.error || 'Failed to start test');
      navigate('/dashboard');
    }
  };

  const saveAnswer = async (questionId, option) => {
    try {
      await axios.post(`http://localhost:8080/api/attempts/${attempt.attemptId}/answer?questionId=${questionId}&option=${option}`);
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  const handleAnswer = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    saveAnswer(questionId, option);
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your test? You cannot change your answers after submission.')) {
      setSubmitting(true);
      try {
        const response = await axios.post(`http://localhost:8080/api/attempts/${attempt.attemptId}/submit`);
        toast.success('Test submitted successfully!');
        
        // Clear course progress after test completion (optional)
        // localStorage.removeItem(`course_${testId}_progress`);
        
        navigate(`/result/${response.data.attemptId}`);
      } catch (error) {
        toast.error('Failed to submit test. Please try again.');
        console.error('Submit error:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleAutoSubmit = async () => {
    toast.error('Time is up! Submitting your test automatically...');
    setSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:8080/api/attempts/${attempt.attemptId}/submit`);
      navigate(`/result/${response.data.attemptId}`);
    } catch (error) {
      toast.error('Failed to auto-submit test');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 60) return 'text-red-600';
    if (timeLeft < 300) return 'text-yellow-600';
    return 'text-indigo-600';
  };

  // Loading state
  if (checkingAccess) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  // Access denied - show modules progress
  if (accessDenied) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-red-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Locked</h1>
              <p className="text-gray-600 mb-6">
                You need to complete all course modules before you can take the final test.
              </p>
              
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">Your Progress</span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {modulesInfo.completed}/{modulesInfo.total} Modules
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(modulesInfo.completed / modulesInfo.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Complete {modulesInfo.total - modulesInfo.completed} more module(s) to unlock the test
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(`/course/${testId}`)}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Continue Learning
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No questions in test
  if (test && (!test.questions || test.questions.length === 0)) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Not Available</h1>
              <p className="text-gray-600 mb-6">
                This test doesn't have any questions yet. Please check back later.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!test || !attempt) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const totalQuestions = test.questions?.length || 0;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Header - Sticky with progress */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 sticky top-0 z-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600 text-sm mt-1">
                Question {answeredCount} of {totalQuestions}
              </p>
            </div>
            
            <div className="text-right">
              <div className={`flex items-center text-2xl font-bold ${getTimeColor()}`}>
                <Clock className="h-6 w-6 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Test Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {test.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="text-indigo-600 mr-2">Q{index + 1}.</span>
                {question.questionText}
              </h3>
              
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map(option => (
                  <label 
                    key={option} 
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${answers[question.id] === option 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswer(question.id, option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-700">
                      <span className="font-semibold mr-3 text-indigo-600">{option}.</span>
                      {question[`option${option}`]}
                    </span>
                  </label>
                ))}
              </div>
              
              {answers[question.id] && (
                <div className="mt-3 text-right">
                  <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Answered</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button Bottom */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount !== totalQuestions}
            className="px-12 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? (
              'Submitting...'
            ) : answeredCount !== totalQuestions ? (
              `Answer all questions (${answeredCount}/${totalQuestions} answered)`
            ) : (
              'Submit Test'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestTaking;