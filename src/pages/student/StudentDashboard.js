import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Award, TrendingUp, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedModules: 0,
    totalModules: 0,
    completedTests: 0,
    avgScore: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const coursesRes = await axios.get('http://localhost:8080/api/tests');
      const attemptsRes = await axios.get('http://localhost:8080/api/attempts/my-attempts');
      const completedTests = attemptsRes.data.filter(a => a.status === 'COMPLETED');
      const avgScore = completedTests.length
        ? completedTests.reduce((sum, a) => sum + a.percentage, 0) / completedTests.length
        : 0;

      let totalModulesAll = 0;
      let completedModulesAll = 0;

      const enrichedCourses = await Promise.all(
        coursesRes.data.map(async (course) => {
          const modulesRes = await axios.get(`http://localhost:8080/api/modules/test/${course.id}`);
          const modules = modulesRes.data;
          totalModulesAll += modules.length;

          // User-specific localStorage key
          const storageKey = `course_${course.id}_progress_${userId}`;
          const saved = localStorage.getItem(storageKey);
          const completedIds = saved ? JSON.parse(saved) : [];
          const completedCount = modules.filter(m => completedIds.includes(m.id)).length;
          completedModulesAll += completedCount;

          const progress = modules.length ? (completedCount / modules.length) * 100 : 0;
          const allCompleted = modules.length > 0 && completedCount === modules.length;

          // Check if test already taken (from backend attempts)
          const takenTest = completedTests.find(t => t.testTitle === course.title);
          const testTaken = !!takenTest;
          const testScore = takenTest ? takenTest.percentage : null;

          return {
            ...course,
            modules,
            completedCount,
            progress: Math.round(progress),
            allCompleted,
            testTaken,
            testScore
          };
        })
      );

      setCourses(enrichedCourses);
      setStats({
        totalCourses: coursesRes.data.length,
        completedModules: completedModulesAll,
        totalModules: totalModulesAll,
        completedTests: completedTests.length,
        avgScore: Math.round(avgScore)
      });
    } catch (error) {
      console.error('Dashboard error:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500">Enrolled Courses</p><p className="text-3xl font-bold">{stats.totalCourses}</p></div>
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500">Modules Completed</p><p className="text-3xl font-bold">{stats.completedModules}/{stats.totalModules}</p></div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500">Tests Completed</p><p className="text-3xl font-bold">{stats.completedTests}</p></div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500">Avg. Score</p><p className="text-3xl font-bold">{stats.avgScore}%</p></div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* My Courses */}
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
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
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>📚 {course.modules.length} modules</span>
                  <span>✅ {course.completedCount} completed</span>
                </div>

                {course.testTaken ? (
                  <div className="text-center text-green-600 font-semibold">
                    ✅ Test Completed – Score: {course.testScore}%
                  </div>
                ) : course.allCompleted ? (
                  <Link to={`/test/${course.id}`} className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700">
                    Take Final Test →
                  </Link>
                ) : (
                  <Link to={`/course/${course.id}`} className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700">
                    Continue Learning →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No courses available yet.</p>
            <Link to="/tests" className="btn-primary inline-block mt-4">Browse Courses</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;