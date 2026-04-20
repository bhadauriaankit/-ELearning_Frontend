import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star } from 'lucide-react';

const TestList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('`${process.env.REACT_APP_API_URL}`/api/tests');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p className="text-xl text-gray-600">Learn new skills from expert instructors</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-48 flex items-center justify-center relative">
                <BookOpen className="h-20 w-20 text-white opacity-80" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500">Course</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration} min
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    1,234 students
                  </div>
                  <div className="flex items-center text-sm text-yellow-500">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    4.5
                  </div>
                </div>
                <Link 
                  to={`/course/${course.id}`}
                  className="block w-full bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Enroll Now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestList;