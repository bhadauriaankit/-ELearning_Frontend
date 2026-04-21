import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { API_URL } from '../../config';

const CreateTest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [testData, setTestData] = useState({ title: '', description: '', duration: 30, questionIds: [] });

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/questions/my-questions');
      setQuestions(response.data);
    } catch (error) { console.error('Error:', error); }
  };

  const toggleQuestion = (questionId) => {
    setTestData(prev => ({ ...prev, questionIds: prev.questionIds.includes(questionId) ? prev.questionIds.filter(id => id !== questionId) : [...prev.questionIds, questionId] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (testData.questionIds.length === 0) { toast.error('Select at least one question'); return; }
    setLoading(true);
    try {
      await axios.post('`${process.env.REACT_APP_API_URL}`/api/tests', testData);
      toast.success('Test created!');
      navigate('/author/tests');
    } catch (error) { toast.error('Failed to create'); } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Test</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6"><label className="block text-sm font-medium mb-2">Test Title</label><input type="text" required value={testData.title} onChange={(e) => setTestData({...testData, title: e.target.value})} className="input-field" /></div>
            <div className="mb-6"><label className="block text-sm font-medium mb-2">Description</label><textarea rows="3" value={testData.description} onChange={(e) => setTestData({...testData, description: e.target.value})} className="input-field" /></div>
            <div className="mb-6"><label className="block text-sm font-medium mb-2">Duration (minutes)</label><input type="number" required value={testData.duration} onChange={(e) => setTestData({...testData, duration: parseInt(e.target.value)})} className="w-32 input-field" min="1" max="180" /></div>
            <div className="mb-6"><label className="block text-sm font-medium mb-2">Select Questions ({testData.questionIds.length} selected)</label>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {questions.map((q) => (<label key={q.id} className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={testData.questionIds.includes(q.id)} onChange={() => toggleQuestion(q.id)} className="h-4 w-4 text-indigo-600" /><div className="ml-3"><p className="text-sm font-medium">{q.questionText}</p><p className="text-xs text-gray-500">Correct: {q.correctAnswer}</p></div></label>))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3"><Save className="inline h-5 w-5 mr-2" />{loading ? 'Creating...' : 'Create Test'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;