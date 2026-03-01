import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { MapPin, ArrowLeft, Check, User, ChevronLeft, ChevronRight } from 'lucide-react'; // Added Chevron Icons

const HouseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useRental();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for image carousel

  useEffect(() => {
    fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(h => h._id === id);
        setHouse(found);
        setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, [id]);

  const handleBook = async () => {
    if(!user) { alert("Please Login"); navigate('/login'); return; }
    if(user.role === 'owner') return alert("Owners cannot book houses.");

    try {
        const res = await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${id}/request`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            }
        });
        
        const data = await res.json();
        if(res.ok) {
            alert("Booking Request Sent! Check your Renter Dashboard for status.");
            navigate('/dashboard');
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Network Error");
    }
  };
  
  // Carousel Navigation Functions
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % house.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + house.images.length) % house.images.length);
  };

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!house) return <div className="p-10 text-center">House not found.</div>;

  const hasRequested = house.requests?.some(r => r.userId === user?._id);
  const ownerName = house.ownerId && house.ownerId.name 
    ? house.ownerId.name 
    : "Verified Landlord";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 font-bold text-slate-500 hover:text-blue-600 transition">
            <ArrowLeft size={20}/> Back to Search
        </button>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100">
            {/* IMAGE CAROUSEL (FIX 1 & 2) */}
            <div className="w-full h-[500px] relative bg-slate-200">
                <img 
                    // FIX: Use current index for the active image
                    src={(house.images && house.images.length > 0) ? house.images[currentImageIndex] : "https://via.placeholder.com/800"} 
                    // FIX: Use 'object-contain' to ensure the full image is shown
                    className="w-full h-full object-contain" 
                    alt={`House image ${currentImageIndex + 1}`}
                />
                
                {/* Carousel Controls */}
                {house.images.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage} 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                        ><ChevronLeft size={24}/></button>
                        
                        <button 
                            onClick={nextImage} 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                        ><ChevronRight size={24}/></button>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {house.images.map((_, index) => (
                                <div 
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-600' : 'bg-white/50 border border-black/20'} cursor-pointer`}
                                    onClick={() => setCurrentImageIndex(index)}
                                ></div>
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {house.propertyType || "Apartment"}
                </div>
            </div>

            <div className="p-8">
                {/* ... (rest of the content is the same) ... */}
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-extrabold text-slate-800">{house.title}</h1>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">${house.rent}</p>
                        <p className="text-xs text-slate-400">/month</p>
                    </div>
                </div>
                
                <p className="flex items-center gap-2 text-slate-500 mb-6 font-medium">
                    <MapPin className="text-blue-500"/> {house.location}
                </p>
                
                <div className="border-t border-b border-slate-100 py-6 mb-6">
                    <h3 className="font-bold text-lg mb-3">Amenities</h3>
                    <div className="flex gap-2 flex-wrap">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">{house.furnishing}</span>
                        {house.amenities?.map((am, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                                <Check size={12}/> {am}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Property Owner</p>
                            <p className="font-bold text-lg text-slate-800">{ownerName}</p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        {house.isBooked ? (
                            <button disabled className="w-full bg-slate-200 text-slate-400 font-bold px-8 py-3 rounded-xl cursor-not-allowed">
                                Currently Occupied
                            </button>
                        ) : hasRequested ? (
                            <button disabled className="w-full bg-yellow-100 text-yellow-700 font-bold px-8 py-3 rounded-xl border border-yellow-200">
                                Request Pending...
                            </button>
                        ) : (
                            <button onClick={handleBook} className="w-full bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                Request Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HouseDetailsPage;