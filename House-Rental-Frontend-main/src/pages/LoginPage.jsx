import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const LoginPage = () => {
  const { login } = useRental();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 1. Attempt Login
    const userData = await login(formData.email, formData.password);
    
    // 2. Check Result
    if (userData) {
      console.log("Logged in as:", userData.role); // Debugging check

      if (userData.role === 'owner') {
        navigate('/dashboard'); // Owners -> Dashboard
      } else {
        navigate('/'); // Renters -> Home Page
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
         <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Home size={28}/></div>
            <h1 className="text-3xl font-extrabold text-slate-800">RentEase</h1>
         </div>
         <p className="text-slate-500">Welcome Back</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Login</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;