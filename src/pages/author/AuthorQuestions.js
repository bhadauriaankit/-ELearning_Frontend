import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthorQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/questions/my-questions');
      setQuestions(response.data);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const deleteQuestion = async (id) => {
    if (window.confirm('Delete this question?')) {
      try {
        await axios.delete(`http://localhost:8080/api/questions/${id}`);
        toast.success('Question deleted');
        fetchQuestions();
      } catch (error) { toast.error('Failed to delete'); }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
          <Link to="/author/create-question" className="btn-primary flex items-center"><Plus className="h-5 w-5 mr-2" />Create Question</Link>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left py-4 px-6">Question</th><th className="text-left py-4 px-6">Correct Answer</th><th className="text-left py-4 px-6">Actions</th></tr></thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{q.questionText}</td>
                  <td className="py-4 px-6">{q.correctAnswer}</td>
                  <td className="py-4 px-6"><button onClick={() => deleteQuestion(q.id)} className="text-red-600"><Trash2 className="h-5 w-5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthorQuestions;