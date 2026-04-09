import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HouseDetailsPage from './pages/HouseDetailsPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ScrollToTop from './components/ScrollToTop';
import Sidebar from './components/Sidebar';
import { useRental } from './context/RentalContext';

function App() {
  const { user } = useRental();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-50 via-sky-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><HomePage /></div><Footer /></>} />
        <Route path="/login" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><LoginPage /></div><Footer /></>} />
        <Route path="/register" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><RegisterPage /></div><Footer /></>} />
        <Route path="/dashboard" element={user ? <><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><DashboardPage /></div><Footer /></> : <Navigate to="/login" />} />
        <Route path="/house/:id" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><HouseDetailsPage /></div><Footer /></>} />
        <Route path="/success-stories" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><SuccessStoriesPage /></div><Footer /></>} />
        <Route path="/settings" element={user ? <><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><SettingsPage /></div><Footer /></> : <Navigate to="/login" />} />
        <Route path="/about" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><AboutPage /></div><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><ContactPage /></div><Footer /></>} />
        <Route path="/privacy" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><PrivacyPolicyPage /></div><Footer /></>} />
        <Route path="/terms" element={<><Navbar /><Sidebar /><div className="flex-1 pt-20 md:pl-64"><TermsOfServicePage /></div><Footer /></>} />
      </Routes>
      <ScrollToTop />
    </div>
  );
}

export default App;