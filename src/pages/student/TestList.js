import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, Layers } from 'lucide-react';
import { API_URL } from '../../config';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tests`);
      const testsData = Array.isArray(response.data) ? response.data : [];
      setTests(testsData);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Tests</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-100 rounded-lg p-3"><BookOpen className="h-6 w-6 text-indigo-600" /></div>
                <span className="text-sm text-gray-500 flex items-center"><Clock className="h-4 w-4 mr-1" />{test.duration} min</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <div className="flex justify-between items-center mt-4">
                <Link to={`/modules/${test.id}`} className="flex items-center text-purple-600 font-semibold hover:text-purple-700">
                  <Layers className="h-4 w-4 mr-1" /> View Modules
                </Link>
                <Link to={`/test/${test.id}`} className="flex items-center text-indigo-600 font-semibold hover:text-indigo-700">
                  Start Test <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        {tests.length === 0 && <div className="text-center py-12"><p className="text-gray-500">No tests available at the moment.</p></div>}
      </div>
    </div>
  );
};

export default TestList;