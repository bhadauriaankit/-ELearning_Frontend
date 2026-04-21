import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, role, name, email: userEmail, id } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      const userData = { email: userEmail, name, role, id };
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(userData);
      toast.success(`Welcome ${name || userEmail}!`);
      return { success: true, role };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      toast.error(errorMsg);
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      toast.error(errorMsg);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const userRole = localStorage.getItem('userRole');

  return (
    <AuthContext.Provider value={{
      user, login, register, logout,
      isAuthenticated: !!token,
      isAdmin: userRole === 'ADMIN',
      isAuthor: userRole === 'AUTHOR',
      isStudent: userRole === 'STUDENT',
      userRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};