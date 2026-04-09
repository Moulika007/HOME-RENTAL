import React from 'react';
import { createPortal } from 'react-dom';
import { Home, Sparkles, X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, quote, houseTitle }) => {
  if (!isOpen) return null;

  const quotes = [
    "🎉 Congratulations! Your dream home awaits!",
    "✨ Welcome to your new beginning!",
    "🏡 Home is where your story begins!",
    "🌟 A new chapter of comfort starts now!",
    "💫 Your perfect space is ready for you!"
  ];

  const selectedQuote = quote || quotes[Math.floor(Math.random() * quotes.length)];

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 w-full" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/40 dark:to-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-5">
            <Sparkles size={40} className="text-violet-500 animate-pulse" />
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
            Request Accepted! 🎉
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{selectedQuote}</p>

          {houseTitle && (
            <div className="flex items-center justify-center gap-2 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-4 py-2 rounded-full mb-6 text-sm font-bold">
              <Home size={16} />
              <span>{houseTitle}</span>
            </div>
          )}

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            The owner has shared payment details. Complete your payment to confirm the booking.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-2xl font-bold hover:from-violet-700 hover:to-blue-700 transition shadow-lg active:scale-95"
          >
            View Payment Details →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;

