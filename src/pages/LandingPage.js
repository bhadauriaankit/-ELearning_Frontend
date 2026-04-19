import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Users, TrendingUp, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Learn & Grow with <span className="text-indigo-600">DBP Learning</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Unlock thousands of expert-led courses in tech, business, design, and more.
                Get the skills to achieve your goals and stay competitive.
              </p>
              <div className="flex space-x-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-3">Get Started →</Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">Login</Link>
              </div>
              <div className="flex mt-8 space-x-8">
                <div className="flex items-center"><Users className="h-5 w-5 text-indigo-600 mr-2" /><span>10k+ Students</span></div>
                <div className="flex items-center"><BookOpen className="h-5 w-5 text-indigo-600 mr-2" /><span>100+ Courses</span></div>
                <div className="flex items-center"><Award className="h-5 w-5 text-indigo-600 mr-2" /><span>Certified</span></div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3" alt="Learning" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:shadow-xl transition rounded-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
              <p className="text-gray-600">Learn at your own pace with 24/7 access</p>
            </div>
            <div className="text-center p-6 hover:shadow-xl transition rounded-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">Gain in-demand skills and advance</p>
            </div>
            <div className="text-center p-6 hover:shadow-xl transition rounded-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Courses</h3>
              <p className="text-gray-600">Earn certificates upon completion</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;