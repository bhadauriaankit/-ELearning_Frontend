import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Award, TrendingUp, Clock, PlayCircle, CheckCircle, Lock } from 'lucide-react';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedModules: 0,
    totalModules: 0,
    completedTests: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get all published tests (courses)
      const coursesRes = await axios.get('http://localhost:8080/api/tests');
      const courses = coursesRes.data;
      
      // For each course, get modules and progress
      const coursesWithProgress = [];
      let totalCompletedModules = 0;
      let totalModulesCount = 0;
      
      for (const course of courses) {
        const modulesRes = await axios.get(`http://localhost:8080/api/modules/test/${course.id}`);
        const modules = modulesRes.data;
        
        // Get progress for each module (in real app, fetch from backend)
        const modulesWithProgress = modules.map(module => ({
          ...module,
          completed: false // This would come from backend
        }));
        
        const completedCount = modulesWithProgress.filter(m => m.completed).length;
        totalCompletedModules += completedCount;
        totalModulesCount += modules.length;
        
        coursesWithProgress.push({
          ...course,
          modules: modulesWithProgress,
          progress: modules.length > 0 ? (completedCount / modules.length) * 100 : 0,
          testAvailable: completedCount === modules.length && modules.length > 0
        });
      }
      
      setEnrolledCourses(coursesWithProgress);
      setStats({
        totalCourses: courses.length,
        completedModules: totalCompletedModules,
        totalModules: totalModulesCount,
        completedTests: 0,
        averageScore: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-600';
    if (progress >= 70) return 'bg-blue-600';
    if (progress >= 40) return 'bg-yellow-600';
    return 'bg-gray-600';
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue learning</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Enrolled Courses</p>
                <p className="text-3xl font-bold">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Modules Completed</p>
                <p className="text-3xl font-bold">{stats.completedModules}/{stats.totalModules}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Tests Completed</p>
                <p className="text-3xl font-bold">{stats.completedTests}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Avg. Score</p>
                <p className="text-3xl font-bold">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{Math.round(course.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressColor(course.progress)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Module Stats */}
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>📚 {course.modules?.length || 0} modules</span>
                    <span>✅ {course.modules?.filter(m => m.completed).length || 0} completed</span>
                  </div>
                  
                  {/* Action Button */}
                  {course.progress === 100 ? (
                    <Link 
                      to={`/test/${course.id}`}
                      className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Take Final Test →
                    </Link>
                  ) : course.progress > 0 ? (
                    <Link 
                      to={`/course/${course.id}`}
                      className="block w-full bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Continue Learning →
                    </Link>
                  ) : (
                    <Link 
                      to={`/course/${course.id}`}
                      className="block w-full bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Start Course →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {enrolledCourses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
              <Link to="/tests" className="btn-primary inline-block">Browse Courses</Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <PlayCircle className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium">You started "Complete Web Development" course</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium">Completed "JavaScript Basics" module</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;