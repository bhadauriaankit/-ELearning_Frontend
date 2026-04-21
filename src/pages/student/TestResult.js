import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Award, CheckCircle, XCircle } from 'lucide-react';

const TestResult = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/attempts/${attemptId}/result`);
        setResult(response.data);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!result) return <div className="text-center py-12"><p>Result not found</p></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-4 mb-4"><Award className="h-12 w-12 text-white" /></div>
            <h1 className="text-2xl font-bold mb-2">Test Completed! 🎉</h1>
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
              <div className="text-6xl font-bold mb-2">{result.percentage}%</div>
              <div className="text-xl">Score: {result.score}/{result.totalQuestions}</div>
            </div>
            <div className="flex justify-center space-x-4">
              <Link to="/tests" className="btn-primary">Take Another Test</Link>
              <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Detailed Analysis</h2>
            <div className="space-y-4">
              {result.answers?.map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-start">
                    {answer.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-semibold mb-2">{answer.questionText}</p>
                      <p className="text-sm text-gray-600">Your answer: {answer.selectedOption}</p>
                      {!answer.isCorrect && <p className="text-sm text-green-600 mt-1">Correct: {answer.correctOption}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResult;