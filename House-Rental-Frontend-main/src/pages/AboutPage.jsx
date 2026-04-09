import React from 'react';
import { Home, Users, Shield, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About RentEase 🏠
          </h1>
          <p className="text-xl text-gray-600">Your trusted partner in finding the perfect home</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover-lift animate-slide-in">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Home className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To simplify the home rental process by connecting property owners with reliable renters through a secure, transparent, and user-friendly platform. We believe everyone deserves a place to call home.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover-lift animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Community</h2>
            <p className="text-gray-600 leading-relaxed">
              Join thousands of satisfied users who have found their perfect homes through RentEase. Our platform brings together property owners and renters in a trusted ecosystem built on transparency and reliability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover-lift animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Security First</h2>
            <p className="text-gray-600 leading-relaxed">
              Your safety is our priority. We implement robust security measures to protect your personal information and ensure all transactions are secure. Every listing is verified for authenticity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover-lift animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Quality Assured</h2>
            <p className="text-gray-600 leading-relaxed">
              We maintain high standards for all listings on our platform. Each property is carefully reviewed to ensure it meets our quality criteria, giving you peace of mind in your search.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center shadow-xl animate-scale-in">
          <h2 className="text-3xl font-bold mb-4">Why Choose RentEase?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Happy Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5K+</div>
              <p className="text-blue-100">Properties Listed</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2024, RentEase was born from a simple idea: make home rental easier, faster, and more transparent. We noticed the challenges both property owners and renters faced in the traditional rental market and decided to create a solution.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our platform leverages modern technology to streamline the entire rental process - from property listing to booking requests, from payment tracking to maintenance management. We've built features that matter to real users, based on real feedback.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, RentEase serves thousands of users across the country, helping them find homes and manage properties with ease. We're constantly evolving, adding new features, and improving our platform to serve you better.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
