import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle, XCircle, Home, Calendar } from 'lucide-react';

const VacateRequestModal = ({ isOpen, onClose, onRespond, metadata }) => {
  if (!isOpen) return null;

  const { requesterName, houseTitle, role } = metadata || {};

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[300] p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border-4 border-rose-500 overflow-hidden transform animate-in zoom-in-95 duration-300">
        
        {/* Header Alert Strip */}
        <div className="bg-rose-500 p-6 flex flex-col items-center text-center text-white">
          <div className="bg-white p-4 rounded-full text-rose-500 mb-4 shadow-lg animate-bounce">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">🚨 Vacate Alert 🚨</h2>
          <p className="text-rose-100 font-bold mt-1">Property Residency Update Required</p>
        </div>

        {/* Content */}
        <div className="p-10">
          <div className="space-y-6">
            <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl border-2 border-rose-100 dark:border-rose-900/50">
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed text-center">
                <span className="font-black text-slate-900 dark:text-white">{requesterName}</span> 
                {role === 'owner' ? " (the Owner)" : " (the Renter)"} wants to end the residency for:
              </p>
              
              <div className="flex items-center justify-center gap-3 mt-4 text-rose-600 dark:text-rose-400">
                <Home size={24} />
                <span className="text-2xl font-black underline decoration-4 underline-offset-4">{houseTitle}</span>
              </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <Calendar className="text-slate-400 mt-1" size={20} />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        By agreeing, the property will be marked as <span className="font-bold text-slate-800 dark:text-slate-200">VACANT</span> immediately. This action cannot be undone.
                    </p>
                </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => onRespond('reject')}
              className="group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <XCircle size={20} className="group-hover:rotate-90 transition-transform" />
              REJECT
            </button>
            <button
              onClick={() => onRespond('approve')}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-rose-500 text-white font-black shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-600 hover:-translate-y-1 transition-all active:scale-95"
            >
              <CheckCircle size={20} />
              AGREE & VACATE
            </button>
          </div>
          
          <p className="text-center text-slate-400 text-xs mt-6 font-bold uppercase tracking-widest">
            Mutual consent is required to process this request
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VacateRequestModal;
