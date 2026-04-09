import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { Home, LogOut, User } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useRental();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md dark:bg-slate-800/80 border-b border-rose-100 dark:border-slate-700 fixed top-0 w-full z-50 px-6 py-4 shadow-sm flex justify-between items-center transition-colors">
      <Link to="/home" className="flex items-center gap-2 text-2xl font-extrabold text-violet-600 dark:text-violet-400 tracking-tighter">
        <Home className="w-8 h-8" />
        Rent<span className="text-slate-800 dark:text-white">Ease</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-700 px-4 py-2 rounded-full shadow-md border-2 border-rose-100 dark:border-slate-600">
              <div className="bg-gradient-to-br from-violet-400 to-teal-500 rounded-full p-2">
                <User size={20} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-slate-500 dark:text-slate-400">Logged in as</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">{user.role === 'owner' ? '🏢 Owner' : '👤 Renter'}</p>
              </div>
              <div className="border-l-2 border-rose-100 dark:border-slate-600 pl-3 hidden md:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
              </div>
            </div>
            <NotificationBell />
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-2 rounded-full font-bold hover:bg-red-100 dark:hover:bg-red-800 transition flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-violet-500 text-white px-6 py-2 rounded-full font-bold hover:bg-violet-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-violet-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold hover:from-violet-600 hover:to-teal-600 transition"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;