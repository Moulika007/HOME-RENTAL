import React, { createContext, useState, useContext, useEffect } from 'react';

const RentalContext = createContext();

const API_BASE = 'http://localhost:5000';

export const RentalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [myHouses, setMyHouses] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 1. Fetch Owner's Houses
  const fetchMyHouses = async () => {
    if (!user || user.role !== 'owner') return;
    try {
      const res = await fetch(`${API_BASE}/api/houses/my-houses`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setMyHouses(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMyHouses(); }, [user]);

  // 2. Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (error) { return null; }
  };

  // 3. Register
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) { return false; }
  }

  // 4. Book House
  const bookHouse = async (houseId) => {
    if (!user) return false;
    try {
      const res = await fetch(`${API_BASE}/api/houses/${houseId}/request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });
      return res.ok;
    } catch (error) {
      console.error("Booking Error:", error);
      return false;
    }
  };

  // 5. Vacate House (Initiate Request)
  const requestVacate = async (houseId) => {
    try {
      const res = await fetch(`${API_BASE}/api/houses/${houseId}/request-vacate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return res.ok;
    } catch (error) {
      console.error("Request Vacate Error:", error);
      return false;
    }
  };

  // 6. Respond to Vacate Request (Approve/Reject)
  const respondVacate = async (houseId, action) => {
    try {
      const res = await fetch(`${API_BASE}/api/houses/${houseId}/respond-vacate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ action })
      });
      return res.ok;
    } catch (error) {
      console.error("Respond Vacate Error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setMyHouses([]);
    localStorage.removeItem('user');
  };

  return (
    <RentalContext.Provider value={{ user, myHouses, login, register, logout, fetchMyHouses, bookHouse, requestVacate, respondVacate }}>
      {children}
    </RentalContext.Provider>
  );
};


export const useRental = () => useContext(RentalContext);