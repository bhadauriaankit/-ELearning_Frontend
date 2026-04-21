import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/admin/tests');
      setTests(response.data);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const publishTest = async (testId) => {
    try {
      await axios.put('`${process.env.REACT_APP_API_URL}`/api/admin/tests/${testId}/publish');
      toast.success('Test published');
      fetchTests();
    } catch (error) { toast.error('Failed to publish'); }
  };

  const deleteTest = async (testId) => {
    if (window.confirm('Delete this test?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/tests/${testId}`);
        toast.success('Test deleted');
        fetchTests();
      } catch (error) { toast.error('Failed to delete'); }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Tests</h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left py-4 px-6">Title</th><th className="text-left py-4 px-6">Author</th><th className="text-left py-4 px-6">Duration</th><th className="text-left py-4 px-6">Status</th><th className="text-left py-4 px-6">Actions</th></tr></thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{test.title}</td>
                  <td className="py-4 px-6">{test.author?.name || 'Unknown'}</td>
                  <td className="py-4 px-6">{test.duration} min</td>
                  <td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${test.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{test.published ? 'Published' : 'Draft'}</span></td>
                  <td className="py-4 px-6"><div className="flex space-x-2">{!test.published && <button onClick={() => publishTest(test.id)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"><CheckCircle className="inline h-4 w-4 mr-1" />Publish</button>}<button onClick={() => deleteTest(test.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"><Trash2 className="inline h-4 w-4 mr-1" />Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTests;