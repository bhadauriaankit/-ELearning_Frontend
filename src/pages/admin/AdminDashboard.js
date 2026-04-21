import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { Users, FileText } from 'lucide-react';   // removed Shield, TrendingUp

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, tests: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('`${process.env.REACT_APP_API_URL}`/api/admin/users');
      const testsRes = await axios.get('`${process.env.REACT_APP_API_URL}`/api/admin/tests');
      setStats({ users: usersRes.data.length, tests: testsRes.data.length });
    } catch (error) { console.error('Error:', error); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-3xl font-bold">{stats.users}</p></div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div><p className="text-gray-500 text-sm">Total Tests</p><p className="text-3xl font-bold">{stats.tests}</p></div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/admin/users" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage user roles</p>
          </Link>
          <Link to="/admin/tests" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FileText className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Manage Tests</h3>
            <p className="text-gray-600">Review and publish tests</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
