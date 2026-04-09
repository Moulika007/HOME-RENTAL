import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
          🔒 Privacy Policy
        </h1>
        <p className="text-center text-slate-600 mb-12 text-lg">Last updated: January 2026</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">Information We Collect</h2>
              </div>
              <p className="text-slate-600 mb-4">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Name, email address, and phone number</li>
                <li>Property preferences and search history</li>
                <li>Booking and payment information</li>
                <li>Communication records with property owners</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-purple-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">How We Use Your Information</h2>
              </div>
              <p className="text-slate-600 mb-4">Your information is used to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Provide and improve our rental services</li>
                <li>Process bookings and payments</li>
                <li>Send notifications about your requests</li>
                <li>Communicate with you about properties</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-green-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">Data Storage & Security</h2>
              </div>
              <p className="text-slate-600 mb-4">We implement industry-standard security measures:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure MongoDB database with access controls</li>
                <li>Regular security audits and updates</li>
                <li>JWT token-based authentication</li>
                <li>HTTPS encryption for all communications</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-orange-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">Your Rights</h2>
              </div>
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Lodge a complaint with authorities</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <p className="text-slate-700">
                <strong>Questions?</strong> Contact us at <a href="mailto:privacy@rentease.com" className="text-blue-600 hover:underline">privacy@rentease.com</a>
              </p>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="space-y-6 animate-slide-in" style={{animationDelay: '0.4s'}}>
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=500&fit=crop" 
                alt="Privacy" 
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3">🛡️ Your Privacy Matters</h3>
                <p className="text-sm text-blue-100">
                  We are committed to protecting your personal information and being transparent about how we use it.
                </p>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="bg-green-100 p-2 rounded-lg">✅</div>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="bg-green-100 p-2 rounded-lg">✅</div>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="bg-green-100 p-2 rounded-lg">✅</div>
                  <span>Regular Audits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
