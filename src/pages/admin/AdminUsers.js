import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/admin/users');
      setUsers(response.data);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await axios.put('`${process.env.REACT_APP_API_URL}`/api/admin/users/${userId}/role?role=${newRole}');
      toast.success('Role updated');
      fetchUsers();
    } catch (error) { toast.error('Failed to update role'); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left py-4 px-6">Name</th><th className="text-left py-4 px-6">Email</th><th className="text-left py-4 px-6">Role</th><th className="text-left py-4 px-6">Actions</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : user.role === 'AUTHOR' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{user.role}</span></td>
                  <td className="py-4 px-6"><select onChange={(e) => changeRole(user.id, e.target.value)} value={user.role} className="px-3 py-1 border rounded-lg text-sm"><option value="STUDENT">Student</option><option value="AUTHOR">Author</option><option value="ADMIN">Admin</option></select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;