import React from 'react';
import { FileText, CheckCircle, AlertCircle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
          📜 Terms of Service
        </h1>
        <p className="text-center text-slate-600 mb-12 text-lg">Effective Date: January 1, 2026</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600">
                By accessing and using RentEase, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">2. User Responsibilities</h2>
              </div>
              <p className="text-slate-600 mb-4">As a user of RentEase, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not misuse the platform for fraudulent activities</li>
                <li>Respect other users and property owners</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="text-purple-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">3. Property Listings</h2>
              </div>
              <p className="text-slate-600 mb-4">For property owners:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>You must have legal authority to list the property</li>
                <li>All property information must be accurate and up-to-date</li>
                <li>You are responsible for responding to booking requests</li>
                <li>You must honor accepted booking agreements</li>
                <li>Discriminatory practices are strictly prohibited</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-orange-600" size={32} />
                <h2 className="text-2xl font-bold text-slate-800">4. Booking & Payments</h2>
              </div>
              <p className="text-slate-600 mb-4">Regarding bookings and payments:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Booking requests are subject to owner approval</li>
                <li>Payment terms are agreed between renter and owner</li>
                <li>RentEase facilitates connections but is not party to rental agreements</li>
                <li>Cancellation policies are set by property owners</li>
                <li>Disputes should be resolved directly between parties</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.4s'}}>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Prohibited Activities</h2>
              <p className="text-slate-600 mb-4">You may not:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Use the platform for illegal purposes</li>
                <li>Attempt to hack or compromise platform security</li>
                <li>Post false or misleading information</li>
                <li>Harass or threaten other users</li>
                <li>Scrape or copy platform content without permission</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.5s'}}>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-600">
                RentEase provides a platform to connect renters and property owners. We are not responsible for the quality, safety, or legality of properties listed, the accuracy of listings, or the ability of users to complete transactions. Use of the platform is at your own risk.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl animate-slide-in" style={{animationDelay: '0.6s'}}>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Termination</h2>
              <p className="text-slate-600">
                We reserve the right to suspend or terminate your account if you violate these terms or engage in activities that harm the platform or other users. You may also terminate your account at any time through your settings.
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <p className="text-slate-700">
                <strong>Questions about our Terms?</strong> Contact us at <a href="mailto:legal@rentease.com" className="text-blue-600 hover:underline">legal@rentease.com</a>
              </p>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="space-y-6 animate-slide-in" style={{animationDelay: '0.7s'}}>
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=500&fit=crop" 
                alt="Terms" 
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3">⚖️ Fair & Transparent</h3>
                <p className="text-sm text-blue-100">
                  Our terms are designed to protect both renters and property owners while ensuring a safe platform for everyone.
                </p>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-800 mb-2">📅 Last Updated</p>
                  <p className="text-xs text-slate-600">January 1, 2026</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-800 mb-2">🔔 Changes</p>
                  <p className="text-xs text-slate-600">We'll notify you of any significant changes to these terms</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-800 mb-2">⚖️ Governing Law</p>
                  <p className="text-xs text-slate-600">These terms are governed by applicable housing laws</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
