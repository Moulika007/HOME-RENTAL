import React, { useEffect, useState } from 'react';
import { useRental } from '../context/RentalContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, MapPin, CheckCircle, XCircle, Trash2, Home, Clock, Bell, Pencil, Save, X, DoorOpen } from 'lucide-react';

const DashboardPage = () => {
  // 1. ADDED 'vacateHouse' to the destructuring here
  const { user, myHouses, logout, fetchMyHouses, vacateHouse } = useRental();
  const navigate = useNavigate();
  
  // RENTER STATE
  const [myRequests, setMyRequests] = useState([]);
  const [myHome, setMyHome] = useState(null);

  // OWNER STATE
  const [showAdd, setShowAdd] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', startDate: '' });
  
  const [newHouse, setNewHouse] = useState({ 
    title: '', location: '', rent: '', images: '', 
    propertyType: 'Apartment', furnishing: 'Unfurnished', amenities: '',
    isBooked: false, tenant: { name: '', email: '', phone: '', startDate: '', isRentPaid: false }
  });

  // INIT
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'renter') {
        fetchRenterData();
    } else {
        fetchMyHouses();
    }
  }, [user]);

  // --- API HELPERS ---
  const fetchRenterData = async () => {
      try {
          // Note: Ideally create a specific endpoint for this, but this works for now
          const res = await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses`);
          const allHouses = await res.json();
          if (Array.isArray(allHouses)) {
            // Pending Requests
            const pending = allHouses.filter(h => !h.isBooked && h.requests && h.requests.some(r => r.userId === user._id));
            setMyRequests(pending);
            
            // Confirmed Home (Strict Check)
            const home = allHouses.find(h => 
                h.isBooked && 
                h.currentTenant && 
                String(h.currentTenant.userId) === String(user._id)
            );
            setMyHome(home);
          }
      } catch(err) { console.error(err); }
  };

  // --- NEW: HANDLE VACATE (For both Renter and Owner) ---
  // --- FIX: Force Reload on Vacate ---
  const handleVacate = async (houseId) => {
    const confirmMessage = user.role === 'owner' 
        ? "Are you sure you want to remove this tenant? This will mark the house as Vacant." 
        : "Are you sure you want to leave this house? Your residency will end immediately.";

    if (window.confirm(confirmMessage)) {
        const success = await vacateHouse(houseId);
        if (success) {
            alert("Success! House is now vacant.");
            // Force a hard reload to ensure Database and UI match perfectly
            window.location.reload(); 
        } else {
            alert("Failed to vacate. Please try again.");
        }
    }
  };
  // --- OWNER FUNCTIONS ---
  const handleChange = (e) => setNewHouse({ ...newHouse, [e.target.name]: e.target.value });
  const handleTenantChange = (e) => setNewHouse({ ...newHouse, tenant: { ...newHouse.tenant, [e.target.name]: e.target.value } });
  
  const handleAddHouse = async (e) => {
    e.preventDefault();
    if (!user.token) return alert("Not Authenticated");
    const imagesArray = newHouse.images.split(',').map(url => url.trim()).filter(url => url !== "");
    const amenitiesArray = newHouse.amenities.split(',').map(item => item.trim()).filter(item => item !== "");
    await fetch('https://house-rental-backend-1-5gyd.onrender.com/api/houses', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ ...newHouse, images: imagesArray, amenities: amenitiesArray })
    });
    setShowAdd(false);
    fetchMyHouses();
  };

  // --- EDIT TENANT FUNCTIONS ---
  const startEditing = (house) => {
      setEditingTenantId(house._id);
      setEditForm({ name: house.currentTenant.name, email: house.currentTenant.email, phone: house.currentTenant.phone, startDate: house.currentTenant.startDate });
  };

  const saveTenantChanges = async (houseId) => {
      await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}/tenant-details`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify(editForm)
      });
      setEditingTenantId(null);
      fetchMyHouses();
  };

  const deleteHouse = async (houseId) => { if(!window.confirm("Delete?")) return; await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` } }); fetchMyHouses(); };
// --- CLEANED FUNCTIONS (No Hidden Spaces) ---
  const handleAccept = async (houseId, requestId) => { 
      try {
        // I typed this manually to ensure no spaces exist
        const res = await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}/accept`, { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }, 
            body: JSON.stringify({ requestId }) 
        });
        
        const data = await res.json();
        if (res.ok) {
            alert("Request Accepted!");
            fetchMyHouses();
        } else {
            alert(data.message || "Failed to accept");
        }
      } catch (err) { console.error(err); }
  };

  const handleDecline = async (houseId, requestId) => { 
      try {
        const res = await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}/decline`, { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }, 
            body: JSON.stringify({ requestId }) 
        });
        
        if (res.ok) {
            alert("Request Declined");
            fetchMyHouses();
        }
      } catch (err) { console.error(err); }
  };
  const toggleRent = async (houseId) => { await fetch(`https://house-rental-backend-1-5gyd.onrender.com/api/houses/${houseId}/rent`, { method: 'PUT', headers: { Authorization: `Bearer ${user.token}` } }); fetchMyHouses(); };

  if (!user) return null;

  // ==========================================
  //            RENTER DASHBOARD
  // ==========================================
  if (user.role === 'renter') {
      return (
        <div className="min-h-screen bg-slate-50 p-6 pt-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div><h1 className="text-2xl font-bold text-slate-800">Renter Dashboard</h1></div>
                    <button onClick={() => {logout(); navigate('/login')}} className="text-red-500 font-bold flex gap-2"><LogOut size={20}/> Logout</button>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Home size={20}/> My Confirmed Home</h2>
                
                {myHome ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
                        <div className="flex flex-col md:flex-row gap-6">
                            <img src={myHome.images[0] || "https://via.placeholder.com/400"} className="w-full md:w-48 h-32 object-cover rounded-xl bg-slate-200" alt="home"/>
                            <div className="flex-1">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">Active Tenant</span>
                                <h3 className="text-xl font-bold text-slate-800">{myHome.title}</h3>
                                <p className="text-slate-500 mb-2">{myHome.location}</p>
                                <p className="text-blue-600 font-bold mb-4">${myHome.rent}/month</p>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-50 rounded-lg border inline-block">
                                        <span className="text-xs font-bold text-slate-500 uppercase mr-2">Rent Status:</span>
                                        {myHome.currentTenant.isRentPaid ? (
                                            <span className="text-green-600 font-bold flex items-center gap-1 inline-flex"><CheckCircle size={14}/> Paid</span>
                                        ) : (
                                            <span className="text-red-500 font-bold flex items-center gap-1 inline-flex"><XCircle size={14}/> Due / Unpaid</span>
                                        )}
                                    </div>

                                    {/* --- RENTER VACATE BUTTON --- */}
                                    <button 
                                        onClick={() => handleVacate(myHome._id)}
                                        className="bg-red-50 text-red-600 px-4 py-3 rounded-lg font-bold text-sm border border-red-100 hover:bg-red-100 transition flex items-center gap-2"
                                    >
                                        <DoorOpen size={16}/> Leave House
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 mb-10">
                        <Home size={48} className="mx-auto mb-4 opacity-50"/>
                        <p>You do not have a confirmed home yet.</p>
                        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Browse Houses on Homepage</button>
                    </div>
                )}

                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={20}/> Pending Applications</h2>
                <div className="grid gap-4">
                    {myRequests.length > 0 ? myRequests.map(req => (
                        <div key={req._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <img src={req.images[0] || "https://via.placeholder.com/100"} className="w-16 h-16 rounded-lg object-cover bg-slate-200" alt="req"/>
                                <div><h4 className="font-bold text-slate-800">{req.title}</h4><p className="text-xs text-slate-500">{req.location}</p></div>
                            </div>
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Waiting for Owner</span>
                        </div>
                    )) : <p className="text-slate-400 italic">No pending applications.</p>}
                </div>
            </div>
        </div>
      );
  }

  // ==========================================
  //            OWNER DASHBOARD
  // ==========================================
  const safeHouses = Array.isArray(myHouses) ? myHouses : [];

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div><h1 className="text-2xl font-bold text-slate-800">Owner Dashboard</h1></div>
            <button onClick={() => {logout(); navigate('/login')}} className="text-red-500 font-bold flex gap-2"><LogOut size={20}/> Logout</button>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="mb-8 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex gap-2 shadow-lg"><Plus /> {showAdd ? "Cancel" : "Add Property"}</button>
        
        {showAdd && (
            <form onSubmit={handleAddHouse} className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" value={newHouse.title} onChange={handleChange} placeholder="House Title" className="border p-3 rounded-xl" required/>
                    <input name="location" value={newHouse.location} onChange={handleChange} placeholder="Location" className="border p-3 rounded-xl" required/>
                    <input name="rent" type="number" value={newHouse.rent} onChange={handleChange} placeholder="Rent Amount" className="border p-3 rounded-xl" required/>
                    <input name="images" value={newHouse.images} onChange={handleChange} placeholder="Image URLs (comma separated)" className="border p-3 rounded-xl" />
                    <select name="propertyType" value={newHouse.propertyType} onChange={handleChange} className="border p-3 rounded-xl"><option value="Apartment">Apartment</option><option value="Villa">Villa</option><option value="Cottage">Cottage</option></select>
                    <select name="furnishing" value={newHouse.furnishing} onChange={handleChange} className="border p-3 rounded-xl"><option value="Unfurnished">Unfurnished</option><option value="Semi-Furnished">Semi-Furnished</option><option value="Furnished">Fully Furnished</option></select>
                    <input name="amenities" value={newHouse.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" className="border p-3 rounded-xl md:col-span-2" />
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
                        <label className="font-bold text-slate-700 mb-2 block">Occupancy Status</label>
                        <select className="border p-3 rounded-xl bg-white w-full mb-4" value={newHouse.isBooked} onChange={(e) => setNewHouse({ ...newHouse, isBooked: e.target.value === 'true' })}>
                            <option value="false">Vacant</option><option value="true">Already Occupied</option>
                        </select>
                        {newHouse.isBooked && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" placeholder="Resident Name" onChange={handleTenantChange} className="border p-3 rounded-xl" required/>
                                <input name="email" placeholder="Resident Email" onChange={handleTenantChange} className="border p-3 rounded-xl" required/>
                                <input name="phone" placeholder="Phone Number" onChange={handleTenantChange} className="border p-3 rounded-xl" required/>
                                <input name="startDate" type="date" onChange={handleTenantChange} className="border p-3 rounded-xl" required/>
                                <div className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" onChange={(e) => setNewHouse({ ...newHouse, tenant: { ...newHouse.tenant, isRentPaid: e.target.checked } })} /><label>Rent Paid?</label></div>
                            </div>
                        )}
                    </div>
                </div>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold mt-4">Save</button>
            </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeHouses.map(house => (
                <div key={house._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <img src={house.images[0] || "https://via.placeholder.com/400"} className="w-full h-48 object-cover bg-slate-200"/>
                    <div className="p-5">
                        <div className="flex justify-between items-start"><h3 className="font-bold text-lg text-slate-800">{house.title}</h3><button onClick={() => deleteHouse(house._id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button></div>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mb-1"><MapPin size={14}/> {house.location}</p>
                        
                        {house.isBooked && house.currentTenant ? (
                            <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 relative">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-blue-800 uppercase">Resident Details</p>
                                    <div className="flex gap-2">
                                        {editingTenantId === house._id ? (
                                            <>
                                                <button onClick={() => saveTenantChanges(house._id)} className="text-green-600"><Save size={16}/></button>
                                                <button onClick={() => setEditingTenantId(null)} className="text-red-500"><X size={16}/></button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEditing(house)} className="text-slate-400 hover:text-blue-600"><Pencil size={14}/></button>
                                        )}
                                    </div>
                                </div>
                                {editingTenantId === house._id ? (
                                    <div className="flex flex-col gap-2">
                                        <input className="text-sm border p-1 rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Name" />
                                        <input className="text-sm border p-1 rounded" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="Phone" />
                                        <input className="text-sm border p-1 rounded" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email" />
                                        <input type="date" className="text-sm border p-1 rounded" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} />
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-700 space-y-1">
                                        <p className="font-bold">{house.currentTenant.name}</p>
                                        <p className="text-xs">{house.currentTenant.phone}</p>
                                        <p className="text-xs text-slate-500">{house.currentTenant.email}</p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <button onClick={() => toggleRent(house._id)} className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition ${house.currentTenant.isRentPaid ? 'bg-green-500 text-white' : 'bg-white border-2 border-red-100 text-red-500'}`}>
                                        {house.currentTenant.isRentPaid ? <><CheckCircle size={14}/> Paid</> : <><XCircle size={14}/> Unpaid</>}
                                    </button>
                                    
                                    {/* --- OWNER VACATE BUTTON --- */}
                                    <button onClick={() => handleVacate(house._id)} className="bg-red-500 text-white py-2 rounded-lg font-bold text-xs hover:bg-red-600 transition">
                                        Vacate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4">
                                {house.requests && house.requests.length > 0 ? (
                                    <>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Bell size={12}/> {house.requests.length} Request(s)</p>
                                        {house.requests.map(req => (
                                            <div key={req._id} className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 mb-2">
                                                <p className="font-bold text-sm text-slate-800">{req.name}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={() => handleAccept(house._id, req._id)} className="flex-1 bg-green-600 text-white text-xs py-1.5 rounded-lg font-bold">Accept</button>
                                                    <button onClick={() => handleDecline(house._id, req._id)} className="flex-1 bg-red-100 text-red-600 text-xs py-1.5 rounded-lg font-bold">Decline</button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-sm text-slate-400">Vacant</div>}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;