import React, { useState } from 'react';
import { Menu, X, Home, User, Bell, Star, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useRental();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: User, label: 'Dashboard', path: '/dashboard' },
    { icon: Star, label: 'Success Stories', path: '/success-stories' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-violet-500 text-white p-2 rounded-lg shadow-lg hover:bg-violet-600 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 shadow-lg z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 pt-20 flex flex-col`}>
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200"
            >
              <Icon size={20} className="text-violet-500 dark:text-violet-400" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-slate-700 space-y-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 dark:hover:bg-slate-700 transition w-full text-slate-700 dark:text-slate-200"
          >
            <Settings size={20} className="text-violet-500 dark:text-violet-400" />
            <span className="font-medium">Quick Settings</span>
          </button>

          {showSettings && (
            <div className="ml-8 space-y-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition w-full text-sm"
              >
                {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                <span className="dark:text-white">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition w-full text-red-600 dark:text-red-400"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
