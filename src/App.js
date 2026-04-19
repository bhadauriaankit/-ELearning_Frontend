import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import TestList from './pages/student/TestList';
import TestTaking from './pages/student/TestTaking';
import TestResult from './pages/student/TestResult';
import MyAttempts from './pages/student/MyAttempts';

// Author Pages
import AuthorDashboard from './pages/author/AuthorDashboard';
import AuthorQuestions from './pages/author/AuthorQuestions';
import CreateQuestion from './pages/author/CreateQuestion';
import AuthorTests from './pages/author/AuthorTests';
import CreateTest from './pages/author/CreateTest';
import CreateModule from './pages/author/CreateModule';
import ViewModules from './pages/student/ViewModules';
import CoursePlayer from './pages/student/CoursePlayer';


// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTests from './pages/admin/AdminTests';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
              <Route path="/tests" element={<PrivateRoute><TestList /></PrivateRoute>} />
              <Route path="/test/:testId" element={<PrivateRoute><TestTaking /></PrivateRoute>} />
              <Route path="/result/:attemptId" element={<PrivateRoute><TestResult /></PrivateRoute>} />
              <Route path="/attempts" element={<PrivateRoute><MyAttempts /></PrivateRoute>} />

              {/* Author Routes */}
              <Route path="/author/dashboard" element={<PrivateRoute authorOnly><AuthorDashboard /></PrivateRoute>} />
              <Route path="/author/questions" element={<PrivateRoute authorOnly><AuthorQuestions /></PrivateRoute>} />
              <Route path="/author/create-question" element={<PrivateRoute authorOnly><CreateQuestion /></PrivateRoute>} />
              <Route path="/author/tests" element={<PrivateRoute authorOnly><AuthorTests /></PrivateRoute>} />
              <Route path="/author/create-test" element={<PrivateRoute authorOnly><CreateTest /></PrivateRoute>} />
              <Route path="/modules/:testId" element={<PrivateRoute><ViewModules /></PrivateRoute>} />

              <Route path="/author/create-module/:testId" element={<PrivateRoute authorOnly><CreateModule /></PrivateRoute>} />
              <Route path="/course/:testId" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
<Route path="/author/create-module" element={<PrivateRoute authorOnly><CreateModule /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />
              <Route path="/admin/tests" element={<PrivateRoute adminOnly><AdminTests /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;