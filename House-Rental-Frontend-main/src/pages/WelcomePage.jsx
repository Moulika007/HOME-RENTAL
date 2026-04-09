import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight, MapPin } from 'lucide-react';
import API_BASE from '../api';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [featuredHouses, setFeaturedHouses] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/houses`);
        const data = await res.json();
        setFeaturedHouses(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-sky-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-rose-400 to-violet-500 rounded-full p-6 shadow-2xl">
              <Home size={64} className="text-white" />
            </div>
          </div>
          <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-rose-500 via-violet-500 to-teal-500 bg-clip-text text-transparent">
            🏡 Welcome to RentEase
          </h1>
          <p className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-4">✨ Your Perfect Home Awaits ✨</p>
          <p className="text-xl max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            🎯 Discover, connect, and secure your dream rental property with ease.
            Join thousands of happy renters and property owners! 🌟
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover-lift border-2 border-blue-100 dark:border-slate-700">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Secure & Trusted</h3>
            <p className="text-slate-600 dark:text-slate-300">Verified properties and secure transactions for peace of mind</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover-lift border-2 border-purple-100 dark:border-slate-700">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Easy Connect</h3>
            <p className="text-slate-600 dark:text-slate-300">Direct communication between renters and property owners</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl hover-lift border-2 border-pink-100 dark:border-slate-700">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Best Experience</h3>
            <p className="text-slate-600 dark:text-slate-300">User-friendly platform with 24/7 support</p>
          </div>
        </div>

        {/* Featured Houses */}
        {featuredHouses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-8 text-slate-800 dark:text-white">🏠 Featured Properties</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {featuredHouses.map(house => (
                <div key={house._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover-lift border-2 border-slate-100 dark:border-slate-700">
                  <img src={house.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-48 object-cover" alt={house.title} />
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">{house.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-3">
                      <MapPin size={16} /> {house.location}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{house.rent}/month</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/home')}
                className="bg-gradient-to-r from-violet-500 to-teal-500 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-violet-600 hover:to-teal-600 transform hover:scale-105 transition-all shadow-xl shadow-violet-200 dark:shadow-none inline-flex items-center gap-3"
              >
                🔍 Explore More Properties
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 mb-16 shadow-xl border-2 border-slate-100 dark:border-slate-700">
          <h2 className="text-4xl font-bold mb-8 text-center text-slate-800 dark:text-white">💎 Why Choose RentEase?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              '✅ Browse thousands of verified properties',
              '⚡ Instant booking requests',
              '🔔 Real-time notifications',
              '💳 Secure payment processing',
              '📋 Detailed property information',
              '🌟 Success stories from real users'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <span className="text-2xl">{benefit.split(' ')[0]}</span>
                <span className="text-lg font-medium">{benefit.substring(benefit.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Authorization Notice */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl p-8 mb-12 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🛡️</div>
            <div>
              <h3 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">🔐 Authorization & Compliance 2026</h3>
              <p className="text-lg text-slate-700 dark:text-slate-200 mb-3">
                ✅ RentEase is fully authorized and compliant with housing regulations as of 2026.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                🏛️ All properties listed are verified, and transactions are secured under government housing standards.
                🔒 Your data is protected with end-to-end encryption.
              </p>
            </div>
          </div>
        </div>

        {/* CTA if no houses */}
        {!featuredHouses.length && (
          <div className="text-center mb-12">
            <button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-3"
            >
              🏠 Explore Properties
              <ArrowRight size={24} />
            </button>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-4">✨ No credit card required • Free to browse</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">🏠 RentEase</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Your trusted platform for finding the perfect rental home.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">📄 Pages</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                <li><button onClick={() => navigate('/home')} className="hover:text-blue-600">Home</button></li>
                <li><button onClick={() => navigate('/success-stories')} className="hover:text-blue-600">Success Stories</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-blue-600">Login</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-blue-600">Register</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">🔗 Quick Links</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-600">About Us</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-blue-600">Contact</button></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-blue-600">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-blue-600">Terms of Service</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">📞 Contact</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                <li>📧 support@rentease.com</li>
                <li>📱 +1 (555) 123-4567</li>
                <li>📍 123 Housing St, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-2">🛡️ <strong>Authorized Housing Platform 2026</strong></p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">© 2026 RentEase. All rights reserved. | Fully compliant with government housing regulations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
