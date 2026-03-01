import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { Home, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useRental();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-50 px-6 py-4 shadow-sm flex justify-between items-center">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 tracking-tighter">
        <Home className="w-8 h-8" />
        Rent<span className="text-slate-800">Ease</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {user ? (
          // LOGGED IN VIEW
          <>
            <span className="text-slate-500 font-medium hidden md:block">
              Welcome, <span className="text-slate-800 font-bold">{user.name}</span>
            </span>
            
            <Link to="/dashboard" className="text-slate-600 font-bold hover:text-blue-600 transition">
              Dashboard
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full font-bold hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </>
        ) : (
          // LOGGED OUT VIEW
          <>
            <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 transition">
              Owner Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;