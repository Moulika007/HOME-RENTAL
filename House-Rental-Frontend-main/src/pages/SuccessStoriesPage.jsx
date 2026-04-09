import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useRental } from '../context/RentalContext';
import API_BASE from '../api';
import Toast from '../components/Toast';

const SuccessStories = () => {
  const { user } = useRental();
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ houseId: '', story: '', rating: 5 });
  const [myHouses, setMyHouses] = useState([]);
  const [toast, setToast] = useState(null);

  const staticStories = [
    {
      _id: 'static-1',
      userName: 'Aman R.',
      userRole: 'renter',
      story: 'Found a beautiful beach house for my summer vacation through this platform. The process was so smooth and the owner was very helpful!',
      rating: 5,
      createdAt: '2024-03-01T10:00:00.000Z',
      isStatic: true
    },
    {
      _id: 'static-2',
      userName: 'Sarah L.',
      userRole: 'owner',
      story: 'Managing my rental villa has never been easier. I found great tenants within a week of listing! Highly recommend this service for property owners.',
      rating: 5,
      createdAt: '2024-03-15T14:30:00.000Z',
      isStatic: true
    }
  ];

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/success-stories`);
      const data = await res.json();
      setStories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyHouses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/houses/my-houses`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      // Only show houses that are booked (since success happens after booking)
      setMyHouses(data.filter(h => h.isBooked || h.currentTenant));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/success-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setToast({ message: 'Success story submitted! Thank you for sharing.', type: 'success' });
        setShowForm(false);
        setFormData({ houseId: '', story: '', rating: 5 });
        fetchStories(); // Refresh list
      } else {
        const errData = await res.json();
        setToast({ message: errData.message || 'Failed to submit success story', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error submitting story', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4">🌟 Success Stories</h1>
            <p className="text-lg text-violet-100 max-w-2xl">Hear from our community of happy renters and property owners who found their perfect match.</p>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Recent Experiences</h2>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              {showForm ? 'Cancel' : '✨ Share Your Story'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-10 border-2 border-violet-100 animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Add Your Experience</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-2">Select the Property</label>
                <select
                  value={formData.houseId}
                  onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
                  className="w-full p-3 border-2 border-slate-100 rounded-xl outline-none focus:border-violet-400 transition"
                  required
                >
                  <option value="">-- Choose a property --</option>
                  {myHouses.map(h => <option key={h._id} value={h._id}>{h.title} ({h.location})</option>)}
                </select>
                {myHouses.length === 0 && <p className="text-xs text-rose-500 mt-1">You need to have an active or past rental to share a story.</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-2">Your Story</label>
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="How was your experience with the property or the owner?"
                  className="w-full p-3 border-2 border-slate-100 rounded-xl outline-none focus:border-violet-400 transition min-h-[120px]"
                  required
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-bold text-slate-600">Your Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(r => (
                    <Star
                      key={r}
                      size={28}
                      fill={r <= formData.rating ? '#8b5cf6' : 'none'}
                      stroke={r <= formData.rating ? '#8b5cf6' : '#cbd5e1'}
                      onClick={() => setFormData({ ...formData, rating: r })}
                      className="cursor-pointer transition-transform hover:scale-110"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={myHouses.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${myHouses.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'}`}
              >
                Submit Story
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-8">
          {[...staticStories, ...stories].map((story, idx) => (
            <div key={story._id} className={`bg-white p-8 rounded-2xl shadow-md border-l-8 transition-all hover:shadow-lg ${story.isStatic ? 'border-violet-500' : 'border-emerald-400'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${story.userRole === 'owner' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                    {story.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{story.userName}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {story.userRole === 'owner' ? '🏘️ Property Owner' : '🔑 Happy Renter'}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < story.rating ? '#fbbf24' : 'none'} stroke={i < story.rating ? '#fbbf24' : '#e2e8f0'} />
                  ))}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed italic mb-4">"{story.story}"</p>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50">
                {story.houseId ? (
                  <p className="text-sm font-semibold text-violet-600">
                    📍 {story.houseId.title} - {story.houseId.location}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-slate-400 flex items-center gap-1">
                    ✨ Featured Story
                  </p>
                )}
                <p className="text-xs text-slate-400">{new Date(story.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SuccessStories;
