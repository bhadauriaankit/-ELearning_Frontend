import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import { ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle, Clock, Lock } from 'lucide-react';

const CoursePlayer = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [completedModuleIds, setCompletedModuleIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testTaken, setTestTaken] = useState(false);

  // Get current user ID
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const storageKey = `course_${testId}_progress_${userId}`;

  // Load completed modules from user‑specific localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setCompletedModuleIds(JSON.parse(saved));
  }, [storageKey]);

  // Fetch course data and check if test already taken
  const fetchCourse = useCallback(async () => {
    try {
      const [courseRes, modulesRes, attemptsRes] = await Promise.all([
        axios.get('`${process.env.REACT_APP_API_URL}`/api/tests/${testId}'),
        axios.get('`${process.env.REACT_APP_API_URL}`/api/modules/test/${testId}'),
        axios.get('`${process.env.REACT_APP_API_URL}`/api/attempts/my-attempts')
      ]);
      setCourse(courseRes.data);
      setModules(modulesRes.data);
      // Check if test already completed for this course
      const completed = attemptsRes.data.find(
        a => a.testTitle === courseRes.data.title && a.status === 'COMPLETED'
      );
      setTestTaken(!!completed);

      // Find first uncompleted module
      const firstUncompleted = modulesRes.data.find(m => !completedModuleIds.includes(m.id));
      setCurrentModule(firstUncompleted || modulesRes.data[0]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [testId, completedModuleIds]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const markComplete = async (moduleId) => {
    if (completedModuleIds.includes(moduleId)) return;
    const newCompleted = [...completedModuleIds, moduleId];
    setCompletedModuleIds(newCompleted);
    localStorage.setItem(storageKey, JSON.stringify(newCompleted));
    toast.success('Module completed! 🎉');

    const idx = modules.findIndex(m => m.id === moduleId);
    if (idx < modules.length - 1) {
      setCurrentModule(modules[idx + 1]);
    } else if (newCompleted.length === modules.length) {
      toast.success('All modules completed! You can now take the final test.');
    }
  };

  const isCompleted = (id) => completedModuleIds.includes(id);
  const progress = modules.length ? (completedModuleIds.length / modules.length) * 100 : 0;
  const allCompleted = modules.length && completedModuleIds.length === modules.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/dashboard" className="text-white opacity-80 hover:opacity-100 inline-flex items-center mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <div className="flex items-center mt-2 text-sm opacity-80">
            <span>{modules.length} modules</span>
            <span className="mx-2">•</span>
            <span>{completedModuleIds.length} completed</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-96' : 'w-16'} bg-white shadow-xl transition-all duration-300 min-h-screen`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-4 bg-gray-100 flex justify-between items-center border-b"
          >
            {sidebarOpen ? (
              <>
                <span className="font-semibold">Course Content</span>
                <ChevronLeft className="h-5 w-5" />
              </>
            ) : (
              <ChevronRight className="h-5 w-5 mx-auto" />
            )}
          </button>
          {sidebarOpen && (
            <div className="p-4 space-y-2">
              {modules.map((m, idx) => {
                const completed = isCompleted(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setCurrentModule(m)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      currentModule?.id === m.id
                        ? 'bg-indigo-50 border-l-4 border-indigo-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      ) : m.type === 'VIDEO' ? (
                        <Play className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${completed ? 'text-gray-500' : 'text-gray-900'}`}>
                          {idx + 1}. {m.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {m.duration} min • {m.type === 'VIDEO' ? 'Video' : 'Reading'}
                          {completed && <span className="ml-2 text-green-600">✓ Completed</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              <div className="mt-6 pt-6 border-t">
                {testTaken ? (
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Test Already Taken</h3>
                    <p className="text-sm text-gray-600">You have already completed the final test.</p>
                    <Link to={`/result/${testId}`} className="mt-3 inline-block text-blue-600 text-sm">
                      View your result →
                    </Link>
                  </div>
                ) : allCompleted ? (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Ready for Test!</h3>
                    <Link
                      to={`/test/${testId}`}
                      className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Take Final Test →
                    </Link>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <Lock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Test Locked</h3>
                    <p className="text-sm text-gray-600">Complete all {modules.length} modules first.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8">
          {currentModule ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {currentModule.type === 'VIDEO' && currentModule.videoUrl && (
                <div className="aspect-video bg-black">
                  <iframe
                    src={currentModule.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={currentModule.title}
                  />
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">{currentModule.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{currentModule.content}</p>
                {!testTaken && !isCompleted(currentModule.id) && (
                  <div className="mt-8 pt-6 border-t">
                    <button
                      onClick={() => markComplete(currentModule.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" /> Mark as Complete
                    </button>
                  </div>
                )}
                <div className="flex justify-between mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      const idx = modules.findIndex(m => m.id === currentModule.id);
                      if (idx > 0) setCurrentModule(modules[idx - 1]);
                    }}
                    disabled={modules.findIndex(m => m.id === currentModule.id) === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {!testTaken && isCompleted(currentModule.id) && (
                    <button
                      onClick={() => {
                        const idx = modules.findIndex(m => m.id === currentModule.id);
                        if (idx < modules.length - 1) {
                          setCurrentModule(modules[idx + 1]);
                        } else if (allCompleted) {
                          navigate(`/test/${testId}`);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {modules.findIndex(m => m.id === currentModule.id) === modules.length - 1
                        ? 'Take Test →'
                        : 'Next →'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p>No modules yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;