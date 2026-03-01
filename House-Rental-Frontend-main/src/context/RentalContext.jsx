import React, { createContext, useState, useContext, useEffect } from 'react';

const RentalContext = createContext();

export const RentalProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [myHouses, setMyHouses] = useState([]);

  // 1. Fetch Owner's Houses
  const fetchMyHouses = async () => {
    if(!user || user.role !== 'owner') return; 
    try {
      const res = await fetch('https://house-rental-backend-1-5gyd.onrender.com/api/houses/my-houses', {
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
      const res = await fetch('https://house-rental-backend-1-5gyd.onrender.com/api/users/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(res.ok) {
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
      const res = await fetch('https://house-rental-backend-1-5gyd.onrender.com/api/users/register', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userData)
        });
        if(res.ok) {
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
      if(!user) return false;
      try {
          const res = await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}/request`, {
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

  // 5. Vacate House (This was causing your crash!)
  const vacateHouse = async (houseId) => {
    try {
      const res = await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}/vacate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      if (res.ok) {
        // Refresh local data immediately
        if (user.role === 'owner') fetchMyHouses(); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("Vacate Error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setMyHouses([]);
    localStorage.removeItem('user');
  };

  return (
    // 👇 LOOK HERE: I added 'vacateHouse' to this list. This fixes the TypeError.
    <RentalContext.Provider value={{ user, myHouses, login, register, logout, fetchMyHouses, bookHouse, vacateHouse }}>
      {children}
    </RentalContext.Provider>
  );
};


export const useRental = () => useContext(RentalContext);