import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import { Save, Video, BookOpen } from 'lucide-react';

const CreateModule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [module, setModule] = useState({
    title: '',
    type: 'VIDEO',
    videoUrl: '',
    content: '',
    duration: 30,
    testId: '',
    orderIndex: 0
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/tests/my-tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!module.testId) {
      toast.error('Please select a course');
      return;
    }
    setLoading(true);
    try {
      await axios.post('`${process.env.REACT_APP_API_URL}`/api/modules/test/${module.testId}', module);
      toast.success('Module created successfully!');
      navigate('/author/tests');
    } catch (error) {
      toast.error('Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Course Module</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Course</label>
              <select
                required
                value={module.testId}
                onChange={(e) => setModule({...module, testId: e.target.value})}
                className="input-field"
              >
                <option value="">Select a course...</option>
                {tests.map(test => (
                  <option key={test.id} value={test.id}>{test.title}</option>
                ))}
              </select>
              {tests.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No courses found. Create a course first.
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Module Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${module.type === 'VIDEO' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                  <input type="radio" value="VIDEO" checked={module.type === 'VIDEO'} onChange={(e) => setModule({...module, type: e.target.value})} className="mr-2" />
                  <Video className="h-5 w-5 mr-2" /> Video Lesson
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${module.type === 'READING' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                  <input type="radio" value="READING" checked={module.type === 'READING'} onChange={(e) => setModule({...module, type: e.target.value})} className="mr-2" />
                  <BookOpen className="h-5 w-5 mr-2" /> Reading Material
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Module Title</label>
              <input
                type="text"
                required
                value={module.title}
                onChange={(e) => setModule({...module, title: e.target.value})}
                className="input-field"
                placeholder="e.g., Introduction to Java"
              />
            </div>

            {module.type === 'VIDEO' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Video URL (YouTube)</label>
                <input
                  type="text"
                  value={module.videoUrl}
                  onChange={(e) => setModule({...module, videoUrl: e.target.value})}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Content / Description</label>
              <textarea
                rows="8"
                required
                value={module.content}
                onChange={(e) => setModule({...module, content: e.target.value})}
                className="input-field"
                placeholder="Write the module content here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={module.duration}
                  onChange={(e) => setModule({...module, duration: parseInt(e.target.value)})}
                  className="input-field"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order Index</label>
                <input
                  type="number"
                  value={module.orderIndex}
                  onChange={(e) => setModule({...module, orderIndex: parseInt(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || tests.length === 0}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              <Save className="inline h-5 w-5 mr-2" />
              {loading ? 'Creating...' : 'Create Module'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModule;