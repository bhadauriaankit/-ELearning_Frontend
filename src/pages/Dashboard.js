
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { BookOpen, Award, TrendingUp, Clock, PlusCircle, FileText, Users, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthor, isAdmin, userRole } = useAuth();
  const [stats, setStats] = useState({ totalTests: 0, completedTests: 0, avgScore: 0 });
  const [recentTests, setRecentTests] = useState([]);
  const [myTests, setMyTests] = useState([]);

  useEffect(() => {
    if (isAdmin || isAuthor) {
      fetchAuthorTests();
    } else {
      fetchStudentData();
    }
  }, [isAdmin, isAuthor]);

  const fetchStudentData = async () => {
    try {
      const testsRes = await axios.get('${process.env.react_app_api_url}/api/tests');
      setStats({ ...stats, totalTests: testsRes.data.length });
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchAuthorTests = async () => {
    try {
      const response = await axios.get('${process.env.react_app_api_url}/api/tests/my-tests');
      setMyTests(response.data);
      setStats({ ...stats, totalTests: response.data.length });
    } catch (error) {
      console.error('Error fetching author tests:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin && 'Manage users, tests, and platform settings'}
            {isAuthor && 'Create and manage your tests and questions'}
            {!isAdmin && !isAuthor && 'Continue your learning journey'}
          </p>
        </div>

        {/* Admin Dashboard */}
        {isAdmin && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-3xl font-bold">-</p></div>
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Total Tests</p><p className="text-3xl font-bold">{myTests.length}</p></div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Pending Approval</p><p className="text-3xl font-bold">-</p></div>
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Admin Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/admin" className="btn-primary text-center">Manage Users & Tests</Link>
                <Link to="/author/create-test" className="btn-secondary text-center">Create Test</Link>
              </div>
            </div>
          </div>
        )}

        {/* Author Dashboard */}
        {isAuthor && !isAdmin && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">My Tests</p><p className="text-3xl font-bold">{myTests.length}</p></div>
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Questions</p><p className="text-3xl font-bold">-</p></div>
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Total Attempts</p><p className="text-3xl font-bold">-</p></div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">My Tests</h3>
                <div className="space-y-3">
                  {myTests.slice(0, 3).map((test) => (
                    <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{test.title}</p>
                        <p className="text-sm text-gray-600">{test.duration} min • {test.published ? 'Published' : 'Draft'}</p>
                      </div>
                      <Link to={`/test/${test.id}`} className="text-indigo-600 text-sm">View →</Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/author/create-question" className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg text-center hover:bg-green-700">
                    <PlusCircle className="inline h-5 w-5 mr-2" /> Create New Question
                  </Link>
                  <Link to="/author/create-test" className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg text-center hover:bg-purple-700">
                    <FileText className="inline h-5 w-5 mr-2" /> Create New Test
                  </Link>
                  <Link to="/author/tests" className="block w-full btn-secondary text-center">
                    View All My Tests
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Dashboard */}
        {!isAdmin && !isAuthor && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Available Tests</p><p className="text-3xl font-bold">{stats.totalTests}</p></div>
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Completed</p><p className="text-3xl font-bold">0</p></div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div><p className="text-gray-500 text-sm">Avg. Score</p><p className="text-3xl font-bold">0%</p></div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Available Tests</h3>
              <div className="space-y-3">
                <Link to="/tests" className="block w-full btn-primary text-center">Browse All Tests</Link>
                <Link to="/attempts" className="block w-full btn-secondary text-center">View My Attempts</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
