import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <span className="text-2xl font-bold">E-Learning</span>
            </div>
            <p className="text-gray-400">Learn & Grow with expert-led courses</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition">About Us</button></li>
              <li><button className="hover:text-white transition">Contact</button></li>
              <li><button className="hover:text-white transition">Privacy Policy</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition">Development</button></li>
              <li><button className="hover:text-white transition">Business</button></li>
              <li><button className="hover:text-white transition">Design</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Download App</h4>
            <p className="text-gray-400">Coming soon on iOS and Android</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 E-Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;