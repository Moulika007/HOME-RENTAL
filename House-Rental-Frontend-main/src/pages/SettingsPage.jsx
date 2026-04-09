import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useRental } from '../context/RentalContext';
import { Moon, Sun, User, Bell, Shield, Info } from 'lucide-react';

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useRental();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              Appearance
            </h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium dark:text-white">Theme</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-16 h-8 rounded-full transition ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isDark ? 'translate-x-8' : ''}`} />
              </button>
            </div>
          </div>

          {/* Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Profile
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-500 dark:text-slate-400">Name</label>
                <p className="font-medium dark:text-white">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500 dark:text-slate-400">Email</label>
                <p className="font-medium dark:text-white">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500 dark:text-slate-400">Role</label>
                <p className="font-medium dark:text-white capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium dark:text-white">Push Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications in app</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-16 h-8 rounded-full transition ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${notifications ? 'translate-x-8' : ''}`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium dark:text-white">Email Alerts</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative w-16 h-8 rounded-full transition ${emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${emailAlerts ? 'translate-x-8' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={20} />
              Privacy & Security
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <p className="font-medium dark:text-white">Change Password</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Update your password</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Add extra security</p>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Info size={20} />
              About
            </h2>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>Version: 1.0.0</p>
              <p>© 2024 RentEase. All rights reserved.</p>
              <p>Built with React & Node.js</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
