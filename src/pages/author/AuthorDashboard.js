import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, BookOpen, Layers, CheckCircle, Lock } from 'lucide-react';

const AuthorDashboard = () => {
  const [hasTest, setHasTest] = useState(false);
  const [hasModules, setHasModules] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(false);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const testsRes = await axios.get('`${process.env.REACT_APP_API_URL}`/api/tests/my-tests');
      setTests(testsRes.data);
      setHasTest(testsRes.data.length > 0);
      
      if (testsRes.data.length > 0) {
        let modulesExist = false;
        let questionsExist = false;
        for (const test of testsRes.data) {
          const modulesRes = await axios.get('`${process.env.REACT_APP_API_URL}`/api/modules/test/${test.id}');
          if (modulesRes.data.length > 0) modulesExist = true;
          if (test.questions && test.questions.length > 0) questionsExist = true;
        }
        setHasModules(modulesExist);
        setHasQuestions(questionsExist);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Author Dashboard</h1>

        {/* Workflow Steps */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Course Creation Workflow (Follow this order)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1: Create Test */}
            <div className={`text-center p-4 rounded-lg ${hasTest ? 'bg-green-50' : 'bg-indigo-50'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${hasTest ? 'bg-green-600' : 'bg-indigo-600'} text-white`}>1</div>
              <FileText className={`h-8 w-8 mx-auto mb-2 ${hasTest ? 'text-green-600' : 'text-indigo-600'}`} />
              <h3 className="font-semibold">Create Test</h3>
              <p className="text-sm text-gray-600">First, create the course/test</p>
              {hasTest ? (
                <span className="inline-block mt-2 text-green-600 text-sm"><CheckCircle className="inline h-4 w-4 mr-1" /> Done</span>
              ) : (
                <Link to="/author/create-test" className="mt-2 inline-block text-indigo-600 text-sm font-semibold">Create →</Link>
              )}
            </div>

            {/* Step 2: Add Modules */}
            <div className={`text-center p-4 rounded-lg ${hasModules ? 'bg-green-50' : hasTest ? 'bg-yellow-50' : 'bg-gray-100'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${hasModules ? 'bg-green-600' : hasTest ? 'bg-yellow-600' : 'bg-gray-400'} text-white`}>2</div>
              <Layers className={`h-8 w-8 mx-auto mb-2 ${hasModules ? 'text-green-600' : hasTest ? 'text-yellow-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold">Add Modules</h3>
              <p className="text-sm text-gray-600">Add learning content</p>
              {hasModules ? (
                <span className="inline-block mt-2 text-green-600 text-sm"><CheckCircle className="inline h-4 w-4 mr-1" /> Done</span>
              ) : hasTest ? (
                <Link to="/author/tests" className="mt-2 inline-block text-yellow-600 text-sm font-semibold">Add Modules →</Link>
              ) : (
                <span className="inline-block mt-2 text-gray-400 text-sm"><Lock className="inline h-3 w-3 mr-1" /> Create test first</span>
              )}
            </div>

            {/* Step 3: Create Questions */}
            <div className={`text-center p-4 rounded-lg ${hasQuestions ? 'bg-green-50' : hasModules ? 'bg-yellow-50' : 'bg-gray-100'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${hasQuestions ? 'bg-green-600' : hasModules ? 'bg-yellow-600' : 'bg-gray-400'} text-white`}>3</div>
              <BookOpen className={`h-8 w-8 mx-auto mb-2 ${hasQuestions ? 'text-green-600' : hasModules ? 'text-yellow-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold">Create Questions</h3>
              <p className="text-sm text-gray-600">Create assessment questions</p>
              {hasQuestions ? (
                <span className="inline-block mt-2 text-green-600 text-sm"><CheckCircle className="inline h-4 w-4 mr-1" /> Done</span>
              ) : hasModules ? (
                <Link to="/author/create-question" className="mt-2 inline-block text-yellow-600 text-sm font-semibold">Create →</Link>
              ) : (
                <span className="inline-block mt-2 text-gray-400 text-sm"><Lock className="inline h-3 w-3 mr-1" /> Add modules first</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Your Courses</h3>
            {tests.length > 0 ? (
              <div className="space-y-3">
                {tests.map(test => (
                  <div key={test.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">{test.title}</p>
                    <p className="text-sm text-gray-500">{test.published ? 'Published' : 'Draft'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses yet. Create your first course!</p>
            )}
            <Link to="/author/create-test" className="mt-4 block w-full btn-primary text-center">Create New Course</Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
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
