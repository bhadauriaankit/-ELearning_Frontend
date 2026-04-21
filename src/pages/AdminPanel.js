import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchTests();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('${process.env.react_app_api_url}/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await axios.get('${process.env.react_app_api_url}/api/admin/tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      await axios.put(`${process.env.react_app_api_url}/api/admin/users/${userId}/role?role=${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const publishTest = async (testId) => {
    try {
      await axios.put(`${process.env.react_app_api_url}/api/admin/tests/${testId}/publish`);
      fetchTests();
    } catch (error) {
      console.error('Error publishing test:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <Users className="inline h-4 w-4 mr-2" /> Users
          </button>
          <button 
            onClick={() => setActiveTab('tests')} 
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'tests' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <FileText className="inline h-4 w-4 mr-2" /> Tests
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Role</th>
                  <th className="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        user.role === 'AUTHOR' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select 
                        onChange={(e) => changeUserRole(user.id, e.target.value)} 
                        value={user.role} 
                        className="px-3 py-1 border rounded-lg text-sm"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="AUTHOR">Author</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-6 text-left">Title</th>
                  <th className="py-4 px-6 text-left">Duration</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr key={test.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{test.title}</td>
                    <td className="py-4 px-6">{test.duration} min</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        test.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {test.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {!test.published && (
                        <button 
                          onClick={() => publishTest(test.id)} 
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          <CheckCircle className="inline h-4 w-4 mr-1" /> Publish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;