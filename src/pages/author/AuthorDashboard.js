import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, PlusCircle, BookOpen, Layers, Video, HelpCircle } from 'lucide-react';

const AuthorDashboard = () => {
  const [stats, setStats] = useState({ tests: 0, questions: 0, modules: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const testsRes = await axios.get('http://localhost:8080/api/tests/my-tests');
      const questionsRes = await axios.get('http://localhost:8080/api/questions/my-questions');
      
      let totalModules = 0;
      for (const test of testsRes.data) {
        try {
          const modulesRes = await axios.get(`http://localhost:8080/api/modules/test/${test.id}`);
          totalModules += modulesRes.data.length;
        } catch (error) {}
      }
      
      setStats({ 
        tests: testsRes.data.length, 
        questions: questionsRes.data.length,
        modules: totalModules
      });
    } catch (error) { 
      console.error('Error:', error); 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Author Dashboard</h1>
        
        {/* Workflow Steps */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Course Creation Workflow</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">1</div>
              <Layers className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-semibold">Create Modules</h3>
              <p className="text-sm text-gray-600">Add video lessons & reading material</p>
              <Link to="/author/tests" className="mt-2 inline-block text-indigo-600 text-sm">Go →</Link>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">2</div>
              <HelpCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Create Questions</h3>
              <p className="text-sm text-gray-600">Create assessment questions</p>
              <Link to="/author/create-question" className="mt-2 inline-block text-green-600 text-sm">Go →</Link>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">3</div>
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Create Test</h3>
              <p className="text-sm text-gray-600">Combine questions into final test</p>
              <Link to="/author/create-test" className="mt-2 inline-block text-purple-600 text-sm">Go →</Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Modules</p>
                <p className="text-3xl font-bold">{stats.modules}</p>
              </div>
              <Layers className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Questions</p>
                <p className="text-3xl font-bold">{stats.questions}</p>
              </div>
              <HelpCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Tests</p>
                <p className="text-3xl font-bold">{stats.tests}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Create Content</h3>
            <div className="space-y-3">
              <Link to="/author/create-module" className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg text-center hover:bg-indigo-700">
                <Video className="inline h-5 w-5 mr-2" /> Create New Module
              </Link>
              <Link to="/author/create-question" className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg text-center hover:bg-green-700">
                <PlusCircle className="inline h-5 w-5 mr-2" /> Create Question
              </Link>
              <Link to="/author/create-test" className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg text-center hover:bg-purple-700">
                <FileText className="inline h-5 w-5 mr-2" /> Create Test
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Manage Content</h3>
            <div className="space-y-3">
              <Link to="/author/tests" className="block w-full btn-secondary text-center">Manage Courses & Modules</Link>
              <Link to="/author/questions" className="block w-full btn-secondary text-center">Manage Questions</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;