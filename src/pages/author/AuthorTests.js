import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, BookOpen, Layers, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

const AuthorTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState({});

  useEffect(() => { 
    fetchTests(); 
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/tests/my-tests');
      setTests(response.data);
      
      // Fetch modules for each test
      const modulesData = {};
      for (const test of response.data) {
        try {
          const modulesRes = await axios.get('`${process.env.REACT_APP_API_URL}`/api/modules/test/${test.id}');
          modulesData[test.id] = modulesRes.data;
        } catch (error) {
          modulesData[test.id] = [];
        }
      }
      setModules(modulesData);
    } catch (error) { 
      console.error('Error:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const deleteTest = async (id) => {
    if (window.confirm('Delete this test? This will also delete all modules.')) {
      try {
        await axios.delete('`${process.env.REACT_APP_API_URL}`/api/tests/${id}');
        toast.success('Test deleted');
        fetchTests();
      } catch (error) { 
        toast.error('Failed to delete'); 
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tests & Modules</h1>
          <Link to="/author/create-test" className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" /> Create Test
          </Link>
        </div>

        <div className="space-y-8">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Test Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{test.title}</h2>
                    <p className="opacity-90">{test.description}</p>
                    <div className="flex space-x-4 mt-3 text-sm">
                      <span>Duration: {test.duration} min</span>
                      <span className={test.published ? 'text-green-300' : 'text-yellow-300'}>
                        {test.published ? '✓ Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTest(test.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Test
                  </button>
                </div>
              </div>

              {/* Modules Section */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-indigo-600" />
                    Modules
                  </h3>
                  <Link 
                    to={`/author/create-module/${test.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Module
                  </Link>
                </div>

                {modules[test.id]?.length > 0 ? (
                  <div className="space-y-3">
                    {modules[test.id].map((module, index) => (
                      <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                              Module {index + 1}: {module.title}
                            </h4>
                            <p className="text-gray-600 mt-1 line-clamp-2">{module.content}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button 
                              onClick={() => window.open(`/modules/${test.id}`, '_blank')}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No modules yet. Click "Add Module" to create one.</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {tests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No tests created yet.</p>
              <Link to="/author/create-test" className="btn-primary inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" /> Create Your First Test
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorTests;