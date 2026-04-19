import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle, Clock, Lock } from 'lucide-react';

const CoursePlayer = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [testId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/tests/${testId}`),
        axios.get(`http://localhost:8080/api/modules/test/${testId}`)
      ]);
      setCourse(courseRes.data);
      setModules(modulesRes.data);
      
      // Load completed modules from localStorage (in real app, from backend)
      const savedProgress = localStorage.getItem(`course_${testId}_progress`);
      if (savedProgress) {
        setCompletedModules(JSON.parse(savedProgress));
      }
      
      if (modulesRes.data.length > 0) {
        // Find first uncompleted module
        const firstUncompleted = modulesRes.data.find(m => 
          !JSON.parse(localStorage.getItem(`course_${testId}_progress`) || '[]').includes(m.id)
        );
        setCurrentModule(firstUncompleted || modulesRes.data[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);
      localStorage.setItem(`course_${testId}_progress`, JSON.stringify(newCompleted));
      toast.success('Module completed! 🎉');
      
      // Check if all modules are completed
      if (newCompleted.length === modules.length) {
        toast.success('Congratulations! You completed all modules. You can now take the final test!', {
          duration: 5000
        });
      }
      
      // Move to next module
      const currentIndex = modules.findIndex(m => m.id === moduleId);
      if (currentIndex < modules.length - 1) {
        setCurrentModule(modules[currentIndex + 1]);
      }
    }
  };

  const isModuleCompleted = (moduleId) => {
    return completedModules.includes(moduleId);
  };

  const getProgress = () => {
    return modules.length > 0 ? (completedModules.length / modules.length) * 100 : 0;
  };

  const canTakeTest = () => {
    return completedModules.length === modules.length && modules.length > 0;
  };

  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const progress = getProgress();
  const testAvailable = canTakeTest();

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/dashboard" className="text-white opacity-80 hover:opacity-100 inline-flex items-center mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <div className="flex items-center mt-2 text-sm opacity-80">
            <span>{modules.length} modules</span>
            <span className="mx-2">•</span>
            <span>{completedModules.length} completed</span>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Content */}
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
              {modules.map((module, index) => {
                const completed = isModuleCompleted(module.id);
                return (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModule(module)}
                    className={`w-full text-left p-3 rounded-lg transition ${currentModule?.id === module.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start">
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      ) : module.type === 'VIDEO' ? (
                        <Play className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${completed ? 'text-gray-500' : 'text-gray-900'}`}>
                          {index + 1}. {module.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.duration} min
                          <span className="mx-2">•</span>
                          {module.type === 'VIDEO' ? 'Video' : 'Reading'}
                          {completed && <span className="ml-2 text-green-600">✓ Completed</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Test Section - Only show if all modules completed */}
              <div className="mt-6 pt-6 border-t">
                {testAvailable ? (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-center mb-2">Ready for Test!</h3>
                    <p className="text-sm text-gray-600 text-center mb-3">
                      You've completed all modules. Take the final test to earn your certificate.
                    </p>
                    <Link
                      to={`/test/${testId}`}
                      className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Take Final Test →
                    </Link>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <Lock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-center mb-2">Test Locked</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Complete all {modules.length} modules to unlock the final test.
                    </p>
                    <div className="mt-2 text-center text-sm">
                      Progress: {completedModules.length}/{modules.length} modules
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {currentModule ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {currentModule.type === 'VIDEO' && currentModule.videoUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(currentModule.videoUrl)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentModule.title}
                  ></iframe>
                </div>
              ) : null}

              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">{currentModule.title}</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {currentModule.content}
                  </p>
                </div>

                {/* Mark Complete Button */}
                {!isModuleCompleted(currentModule.id) && (
                  <div className="mt-8 pt-6 border-t">
                    <button
                      onClick={() => markModuleComplete(currentModule.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Complete
                    </button>
                  </div>
                )}

                {/* Navigation between modules */}
                <div className="flex justify-between mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      const currentIndex = modules.findIndex(m => m.id === currentModule.id);
                      if (currentIndex > 0) setCurrentModule(modules[currentIndex - 1]);
                    }}
                    disabled={modules.findIndex(m => m.id === currentModule.id) === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                  >
                    Previous Module
                  </button>
                  
                  {isModuleCompleted(currentModule.id) && (
                    <button
                      onClick={() => {
                        const currentIndex = modules.findIndex(m => m.id === currentModule.id);
                        if (currentIndex < modules.length - 1) {
                          setCurrentModule(modules[currentIndex + 1]);
                        } else if (testAvailable) {
                          navigate(`/test/${testId}`);
                        }
                      }}
                      disabled={modules.findIndex(m => m.id === currentModule.id) === modules.length - 1 && !testAvailable}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition"
                    >
                      {modules.findIndex(m => m.id === currentModule.id) === modules.length - 1 ? 'Take Test →' : 'Next Module →'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Modules Yet</h2>
              <p className="text-gray-600">This course doesn't have any modules yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;