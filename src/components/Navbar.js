import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, Shield, PenTool } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin, isAuthor, isStudent, user } = useAuth();
  const navigate = useNavigate();

  const handleLogo = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
      if (isStudent) navigate('/dashboard');
      else if (isAuthor) navigate('/author/dashboard');
      else if (isAdmin) navigate('/admin/dashboard');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" onClick={handleLogo} className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center"><BookOpen className="h-6 w-6 text-white"/></div>
          <span className="text-2xl font-bold text-gray-900">E-Learning</span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {isStudent && (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                  {/* "Take Test" removed – students access tests via course page */}
                  <Link to="/attempts" className="text-gray-700 hover:text-indigo-600">My Attempts</Link>
                </>
              )}
              {isAuthor && (
                <>
                  <Link to="/author/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                  <Link to="/author/questions" className="text-gray-700 hover:text-indigo-600">Questions</Link>
                  <Link to="/author/tests" className="text-gray-700 hover:text-indigo-600">Tests</Link>
                  <Link to="/author/create-test" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">+ Create</Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                  <Link to="/admin/users" className="text-gray-700 hover:text-indigo-600">Users</Link>
                </>
              )}
              <div className="flex items-center space-x-3 border-l pl-6">
                <div className="bg-indigo-100 rounded-full p-2">
                  {isAdmin ? <Shield className="h-5 w-5 text-red-600"/> : isAuthor ? <PenTool className="h-5 w-5 text-purple-600"/> : <User className="h-5 w-5 text-indigo-600"/>}
                </div>
                <span className="text-sm">{user?.email?.split('@')[0]}</span>
                <button onClick={logout} className="text-red-600 hover:text-red-700"><LogOut className="h-4 w-4"/></button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;