import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye } from 'lucide-react';
import { API_URL } from '../config';

const MyAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/attempts/my-attempts');
        setAttempts(response.data);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchAttempts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Test Attempts</h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left py-4 px-6">Test Title</th><th className="text-left py-4 px-6">Date</th><th className="text-left py-4 px-6">Score</th><th className="text-left py-4 px-6">Action</th></tr></thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.attemptId} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{attempt.testTitle}</td>
                  <td className="py-4 px-6">{new Date(attempt.startedAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">{attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)</td>
                  <td className="py-4 px-6"><Link to={`/result/${attempt.attemptId}`} className="flex items-center text-indigo-600"><Eye className="h-4 w-4 mr-1" />View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {attempts.length === 0 && <div className="text-center py-12"><p className="text-gray-500">No attempts yet.</p><Link to="/tests" className="inline-block mt-4 btn-primary">Browse Tests</Link></div>}
        </div>
      </div>
    </div>
  );
};

export default MyAttempts;