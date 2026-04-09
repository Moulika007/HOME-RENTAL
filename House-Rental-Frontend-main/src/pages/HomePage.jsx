import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home } from 'lucide-react';
import { LoadingSpinner } from '../components/Loading';
import Modal from '../components/Modal';
import BookingFormModal from '../components/BookingFormModal';
import Toast from '../components/Toast';
import Confetti from '../components/Confetti';
import API_BASE from '../api';

const HomePage = () => {
  const { user, bookHouse } = useRental();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [bookingHouse, setBookingHouse] = useState(null);
  const [toast, setToast] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [purpose, setPurpose] = useState('All');
  const [propertyType, setPropertyType] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHouses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, purpose, propertyType]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/houses?query=${search}&purpose=${purpose}&propertyType=${propertyType}`);
      const data = await res.json();
      setHouses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (house) => {
    if (!user) {
      setToast({ message: 'Please login to send booking request', type: 'warning' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (user.role === 'owner') {
      setToast({ message: 'Owners cannot book houses', type: 'error' });
      return;
    }
    setBookingHouse(house);
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/houses/${bookingHouse._id}/request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowConfetti(true);
        setToast({ message: '🎉 Booking request sent! Redirecting to dashboard...', type: 'success' });
        setBookingHouse(null);
        setSelectedHouse(null);

        // Wait a bit then redirect
        setTimeout(() => {
          setShowConfetti(false);
          navigate('/dashboard');
        }, 2500);
      } else {
        setToast({ message: 'Failed to send request. Try again.', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error sending request', type: 'error' });
    }
  };

  const handleViewDetails = (house) => {
    setSelectedHouse(house);
  };

  const hasRequested = (house) => house.requests?.some(r => r.userId === user?._id);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-violet-100 via-fuchsia-100 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 px-6 py-20 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-violet-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-fuchsia-300 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 animate-fade-in text-violet-900 dark:text-white tracking-tight relative z-10">🏠 Find Your Dream Home</h1>
        <p className="text-lg mb-8 text-violet-700 dark:text-slate-300 font-medium relative z-10">✨ Discover the perfect rental property for you</p>
        <div className="max-w-xl mx-auto flex bg-white dark:bg-slate-700 p-2 rounded-full shadow-2xl mb-6">
          <input
            type="text"
            placeholder="Search by location..."
            className="flex-1 px-6 py-3 rounded-full outline-none text-slate-700 dark:text-white dark:bg-slate-700 dark:placeholder-slate-400"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-slate-900 dark:bg-slate-600 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition">Search</button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={() => { setPurpose('All'); setPropertyType('All'); }}
            className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${purpose === 'All' ? 'bg-violet-600 text-white animate-pulse' : 'bg-white text-slate-600 hover:bg-violet-50'}`}
          >
            All Properties
          </button>
          <button
            onClick={() => { setPurpose('Living'); setPropertyType('All'); }}
            className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${purpose === 'Living' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-violet-50'}`}
          >
            🏠 Living
          </button>
          <button
            onClick={() => { setPurpose('Vacation'); setPropertyType('All'); }}
            className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${purpose === 'Vacation' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-violet-50'}`}
          >
            🏖️ Vacation
          </button>
        </div>

        {purpose !== 'All' && (
          <div className="flex flex-wrap justify-center gap-3 mt-4 animate-fade-in">
            {(purpose === 'Living' ? ['Apartment', 'Studio', 'Villa', 'Shared House'] : ['Beach House', 'Relaxation Spot', 'Resort', 'Cottage']).map(type => (
              <button
                key={type}
                onClick={() => setPropertyType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${propertyType === type ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-inner' : 'border-slate-200 bg-white text-slate-500 hover:border-violet-300'}`}
              >
                {type}
              </button>
            ))}
            <button
              onClick={() => setPropertyType('All')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${propertyType === 'All' ? 'border-slate-400 bg-slate-100 text-slate-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
            >
              Any Type
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-6 -mt-10 relative z-10">
        {loading ? (
          <LoadingSpinner />
        ) : houses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-16 rounded-2xl shadow-xl text-center border-2 border-slate-200 dark:border-slate-700">
            <Home size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">No houses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {houses.map(house => (
              <div key={house._id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-700 flex flex-col h-full hover-lift animate-fade-in">
                <img src={(house.images && house.images.length > 0) ? house.images[0] : "https://via.placeholder.com/400"} className="w-full h-48 object-cover rounded-xl bg-slate-200" alt="house" />
                <div className="flex-1 mt-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{house.title}</h3>
                    <p className="text-violet-600 dark:text-violet-400 font-bold">₹{house.rent}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex items-center gap-1">
                    <MapPin size={14} className="inline" /> {house.location}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => handleViewDetails(house)} className="flex-1 border-2 border-slate-100 dark:border-slate-600 font-bold py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 transition-all shadow-sm">Details</button>

                    {house.isBooked ? (
                      <button disabled className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-400 font-bold py-2 rounded-xl cursor-not-allowed">Occupied</button>
                    ) : hasRequested(house) ? (
                      <button disabled className="flex-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold py-2 rounded-xl cursor-not-allowed">Sent</button>
                    ) : (
                      <button onClick={() => handleBook(house)} className="flex-1 bg-gradient-to-r from-violet-500 to-teal-500 text-white font-bold py-2 rounded-xl hover:from-violet-600 hover:to-teal-600 shadow-lg transform hover:scale-105 transition-all">Book</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedHouse} onClose={() => setSelectedHouse(null)} title={selectedHouse?.title}>
        {selectedHouse && (
          <div>
            <img src={selectedHouse.images[0]} className="w-full h-64 object-cover rounded-xl mb-4" />

            {/* Owner Info */}
            <div className="bg-violet-50 dark:bg-violet-900/30 rounded-xl p-4 mb-4 border border-violet-100 dark:border-violet-900/50">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Property Owner</p>
              <p className="font-bold text-lg text-slate-800 dark:text-white">{selectedHouse.ownerId?.name || 'Owner'}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedHouse.ownerId?.email}</p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-2"><MapPin size={16} className="inline" /> {selectedHouse.location}</p>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-4">₹{selectedHouse.rent}/month</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Type: {selectedHouse.propertyType}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Furnishing: {selectedHouse.furnishing}</p>
            {selectedHouse.amenities?.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold mb-2 dark:text-white">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.amenities.map((a, i) => (
                    <span key={i} className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-800">{a}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => handleBook(selectedHouse)} className="w-full bg-gradient-to-r from-violet-500 to-teal-500 text-white py-3 rounded-xl font-bold hover:from-violet-600 hover:to-teal-600 transform hover:scale-105 transition-all shadow-lg">Book Now</button>
          </div>
        )}
      </Modal>

      <BookingFormModal
        isOpen={!!bookingHouse}
        onClose={() => setBookingHouse(null)}
        house={bookingHouse}
        onSubmit={handleBookingSubmit}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
};

export default HomePage;