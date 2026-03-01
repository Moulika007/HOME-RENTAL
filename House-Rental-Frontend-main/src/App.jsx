import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';       // <--- 1. Import this
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HouseDetailsPage from './pages/HouseDetailsPage';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20"> 
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* <--- 2. Ensure this line exists */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/house/:id" element={<HouseDetailsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;