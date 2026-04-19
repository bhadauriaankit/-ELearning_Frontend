import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', marks: 1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/questions', question);
      toast.success('Question created!');
      navigate('/author/questions');
    } catch (error) { toast.error('Failed to create'); } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Question</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6"><label className="block text-sm font-medium mb-2">Question Text</label><textarea rows="3" required value={question.questionText} onChange={(e) => setQuestion({...question, questionText: e.target.value})} className="input-field" /></div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div><label className="block text-sm font-medium mb-2">Option A</label><input type="text" required value={question.optionA} onChange={(e) => setQuestion({...question, optionA: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-2">Option B</label><input type="text" required value={question.optionB} onChange={(e) => setQuestion({...question, optionB: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-2">Option C</label><input type="text" required value={question.optionC} onChange={(e) => setQuestion({...question, optionC: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-2">Option D</label><input type="text" required value={question.optionD} onChange={(e) => setQuestion({...question, optionD: e.target.value})} className="input-field" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div><label className="block text-sm font-medium mb-2">Correct Answer</label><select value={question.correctAnswer} onChange={(e) => setQuestion({...question, correctAnswer: e.target.value})} className="input-field"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
              <div><label className="block text-sm font-medium mb-2">Marks</label><input type="number" value={question.marks} onChange={(e) => setQuestion({...question, marks: parseInt(e.target.value)})} className="input-field" min="1" /></div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3"><Save className="inline h-5 w-5 mr-2" />{loading ? 'Creating...' : 'Create Question'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;