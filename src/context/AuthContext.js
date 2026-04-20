import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else setLoading(false);
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('`${process.env.REACT_APP_API_URL}`/api/auth/me');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) { logout(); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('`${process.env.REACT_APP_API_URL}`/api/auth/login', { email, password });
      const { token, role, name, email: userEmail, id } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      const userObj = { email: userEmail, name, role, id };
      localStorage.setItem('user', JSON.stringify(userObj));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(userObj);
      toast.success(`Welcome ${name}!`);
      return { success: true, role };
    } catch (err) {
      toast.error('Login failed');
      return { success: false };
    }
  };

  const register = async (data) => {
    try {
      await axios.post('`${process.env.REACT_APP_API_URL}`/api/auth/register', data);
      toast.success('Registered! Please login.');
      return true;
    } catch (err) { toast.error('Registration failed'); return false; }
  };

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  const role = localStorage.getItem('userRole');
  return (
    <AuthContext.Provider value={{
      user, login, register, logout,
      isAuthenticated: !!token,
      isAdmin: role === 'ADMIN',
      isAuthor: role === 'AUTHOR',
      isStudent: role === 'STUDENT',
      loading
    }}>{children}</AuthContext.Provider>
  );
};