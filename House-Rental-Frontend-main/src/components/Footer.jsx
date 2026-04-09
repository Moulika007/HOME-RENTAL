import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white/80 backdrop-blur-md dark:bg-slate-800/80 border-t border-rose-100 dark:border-slate-700 mt-auto md:pl-64">
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="text-blue-600" size={24} />
              <h4 className="font-bold text-lg text-slate-800 dark:text-white">RentEase</h4>
            </div>
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
              <li className="flex items-center gap-2"><Mail size={14} /> support@rentease.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> 123 Housing St, City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">🛡️ <strong>Authorized Housing Platform 2026</strong></p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">© 2026 RentEase. All rights reserved. | Fully compliant with government housing regulations</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
