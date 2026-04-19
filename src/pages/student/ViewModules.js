import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, ChevronLeft } from 'lucide-react';

const ViewModules = () => {
  const { testId } = useParams();
  const [modules, setModules] = useState([]);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, [testId]);

  const fetchModules = async () => {
    try {
      const [modulesRes, testRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/modules/test/${testId}`),
        axios.get(`http://localhost:8080/api/tests/${testId}`)
      ]);
      setModules(modulesRes.data);
      setTest(testRes.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <Link to="/tests" className="inline-flex items-center text-indigo-600 mb-6 hover:text-indigo-700">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Tests
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{test?.title}</h1>
            <p className="text-gray-600">{test?.description}</p>
            <div className="flex items-center mt-4 text-gray-500">
              <Clock className="h-5 w-5 mr-2" />
              <span>Duration: {test?.duration} minutes</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Course Modules</h2>
            {modules.map((module, index) => (
              <div key={module.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                  <h3 className="text-xl font-bold text-white">
                    Module {index + 1}: {module.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {module.content}
                  </p>
                </div>
              </div>
            ))}

            {modules.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No modules available for this test yet.</p>
              </div>
            )}

            {modules.length > 0 && (
              <div className="text-center pt-4">
                <Link to={`/test/${testId}`} className="btn-primary inline-block">
                  Take Test Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModules;