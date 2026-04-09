import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Users, Clock } from 'lucide-react';

const BookingFormModal = ({ isOpen, onClose, house, onSubmit }) => {
  const isVacation = house?.purpose === 'Vacation';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: '',
    guests: 1,
    stayDuration: 1,
    additionalDetails: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        
        {/* Themed Accent */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isVacation ? 'from-amber-400 to-orange-500' : 'from-violet-500 to-teal-500'}`}></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            {isVacation ? <>🏖️ Vacation Booking</> : <>📝 Rental Booking</>}
          </h2>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className={`${isVacation ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' : 'bg-violet-50 dark:bg-violet-900/30 border-violet-100 dark:border-violet-800'} rounded-2xl p-5 mb-6 border flex justify-between items-center`}>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Property</p>
            <p className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{house?.title}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost</p>
            <p className={`font-black text-xl ${isVacation ? 'text-amber-600' : 'text-violet-600 dark:text-violet-400'}`}>₹{house?.rent}/{isVacation ? 'day' : 'month'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 transition-all outline-none text-slate-800 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 transition-all outline-none text-slate-800 dark:text-white"
                    placeholder="you@email.com"
                  />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 transition-all outline-none text-slate-800 dark:text-white"
                    placeholder="+91 1234567890"
                  />
                </div>
             </div>
          </div>

          <div className={`grid ${isVacation ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
             <div className={`${isVacation ? 'col-span-1' : ''}`}>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
                  {isVacation ? 'Check-in Date' : 'Move-in Date'}
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 transition-all outline-none text-slate-800 dark:text-white"
                  />
                </div>
             </div>

             {isVacation && (
               <>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
                      Days
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.stayDuration}
                      onChange={(e) => setFormData({ ...formData, stayDuration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none text-slate-800 dark:text-white font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
                      Guests
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none text-slate-800 dark:text-white font-bold"
                    />
                 </div>
               </>
             )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">
               {isVacation ? 'Additional Requests & Details' : 'Message to Owner (Optional)'}
            </label>
            <textarea
              value={formData.additionalDetails || formData.message}
              onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value, message: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500 transition-all outline-none text-slate-800 dark:text-white"
              rows="3"
              placeholder={isVacation ? "Tell us about your group, arrival time, or special needs..." : "Any additional information..."}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl transform active:scale-95 transition-all
              ${isVacation 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/20' 
                : 'bg-gradient-to-r from-violet-500 to-teal-500 shadow-violet-500/20'}`}
          >
            {isVacation ? 'Confirm Vacation Booking 🏖️' : 'Submit Rental Request 🏠'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
