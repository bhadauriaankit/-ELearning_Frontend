import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save } from 'lucide-react';

const CreateTest = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState({ title: '', description: '', duration: 30 });
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/tests', { ...testData, questionIds: selectedQuestions.map(q => q.id) });
      navigate('/admin');
    } catch (error) {
      console.error('Error creating test:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (question) => {
    if (selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Test</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Test Title</label>
              <input type="text" required value={testData.title} onChange={(e) => setTestData({...testData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea rows="3" value={testData.description} onChange={(e) => setTestData({...testData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input type="number" required value={testData.duration} onChange={(e) => setTestData({...testData, duration: parseInt(e.target.value)})} className="w-32 px-4 py-2 border rounded-lg" min="1" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Questions ({selectedQuestions.length} selected)</label>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {questions.map(question => (
                  <label key={question.id} className="flex items-center p-4 border-b hover:bg-gray-50">
                    <input type="checkbox" checked={selectedQuestions.some(q => q.id === question.id)} onChange={() => toggleQuestion(question)} className="h-4 w-4 text-indigo-600" />
                    <div className="ml-3"><p className="text-sm font-medium">{question.questionText}</p></div>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading || selectedQuestions.length === 0} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold">
              <Save className="inline h-5 w-5 mr-2" /> {loading ? 'Creating...' : 'Create Test'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;