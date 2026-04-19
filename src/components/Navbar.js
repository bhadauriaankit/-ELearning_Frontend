import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Menu, X, User, Shield, PenTool } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin, isAuthor, isStudent, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DBP Learning</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {isStudent && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                    <Link to="/tests" className="text-gray-700 hover:text-indigo-600">Take Test</Link>
                    <Link to="/attempts" className="text-gray-700 hover:text-indigo-600">My Attempts</Link>
                  </>
                )}
                
                {isAuthor && (
                  <>
                    <Link to="/author/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                    <Link to="/author/questions" className="text-gray-700 hover:text-indigo-600">My Questions</Link>
                    <Link to="/author/tests" className="text-gray-700 hover:text-indigo-600">My Tests</Link>
                    <Link to="/author/create-test" className="btn-primary text-sm">+ Create Test</Link>
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-indigo-600">Users</Link>
                    <Link to="/admin/tests" className="text-gray-700 hover:text-indigo-600">Tests</Link>
                  </>
                )}
                
                <div className="flex items-center space-x-3 border-l pl-6">
                  <div className="bg-indigo-100 rounded-full p-2">
                    {isAdmin ? <Shield className="h-5 w-5 text-red-600" /> : isAuthor ? <PenTool className="h-5 w-5 text-purple-600" /> : <User className="h-5 w-5 text-indigo-600" />}
                  </div>
                  <span className="text-sm text-gray-700">{user?.email?.split('@')[0]}</span>
                  <button onClick={logout} className="flex items-center text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden mt-4 pt-4 border-t space-y-3">
            {isStudent && (
              <>
                <Link to="/dashboard" className="block text-gray-700">Dashboard</Link>
                <Link to="/tests" className="block text-gray-700">Take Test</Link>
                <Link to="/attempts" className="block text-gray-700">My Attempts</Link>
              </>
            )}
            {isAuthor && (
              <>
                <Link to="/author/dashboard" className="block text-gray-700">Dashboard</Link>
                <Link to="/author/questions" className="block text-gray-700">My Questions</Link>
                <Link to="/author/tests" className="block text-gray-700">My Tests</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="block text-gray-700">Dashboard</Link>
                <Link to="/admin/users" className="block text-gray-700">Users</Link>
              </>
            )}
            <button onClick={logout} className="block w-full text-left text-red-600">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;