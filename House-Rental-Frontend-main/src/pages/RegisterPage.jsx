import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useRental();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'renter' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Create Account</h2>
        <p className="text-slate-400 text-center mb-6 text-sm">Join the House Rental System</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <input type="text" required placeholder="Full Name" className="bg-slate-50 border border-slate-200 p-3 rounded-xl w-full"
               onChange={(e) => setFormData({...formData, name: e.target.value})} />
             <input type="tel" required placeholder="Phone" className="bg-slate-50 border border-slate-200 p-3 rounded-xl w-full"
               onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <input type="email" required placeholder="Email Address" className="bg-slate-50 border border-slate-200 p-3 rounded-xl w-full"
               onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" required placeholder="Password" className="bg-slate-50 border border-slate-200 p-3 rounded-xl w-full"
               onChange={(e) => setFormData({...formData, password: e.target.value})} />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">I am a:</label>
            <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
               onChange={(e) => setFormData({...formData, role: e.target.value})}>
               <option value="renter">Renter </option>
               <option value="owner">Owner </option>
               
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;