import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CreditCard, QrCode, CheckCircle, Loader, ChevronRight, ShieldCheck, Landmark, Smartphone, Zap } from 'lucide-react';
import API_BASE from '../api';

const PaymentModal = ({ isOpen, onClose, house, owner, houseId, onPaymentDone, user }) => {
  const [step, setStep] = useState('selection'); // 'selection' | 'upi' | 'card' | 'processing' | 'done'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

  useEffect(() => {
    if (isOpen) {
      // If owner provided payment details, go straight to UPI/QR step
      setStep((house?.paymentQrImage || house?.paymentUpiId) ? 'upi' : 'selection');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use owner-uploaded QR if available, otherwise generate from UPI ID
  const upiId = house?.paymentUpiId || owner?.phone || 'unknown@upi';
  const ownerName = owner?.name?.replace(/\s+/g, '') || 'Owner';
  const uploadedQr = house?.paymentQrImage || null;
  const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${upiId}%26pn=${ownerName}%26cu=INR`;

  const simulateProcessing = async () => {
    setStep('processing');
    setError('');
    
    // Simulate real-world banking delay
    await new Promise(resolve => setTimeout(resolve, 3500));

    try {
      const res = await fetch(`${API_BASE}/api/houses/${houseId}/confirm-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setStep('done');
        if (onPaymentDone) onPaymentDone(data);
      } else {
        setStep('selection');
        setError(data.message || 'Payment confirmation failed');
      }
    } catch (err) {
      setStep('selection');
      setError('Network error. Please try again.');
    }
  };

  const handleClose = () => {
    if (step === 'processing') return; // Prevent closing during processing
    setStep('selection');
    setError('');
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'selection':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">Choose your preferred payment method:</p>
            
            {/* UPI Option */}
            <button 
              onClick={() => setStep('upi')}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <Smartphone size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">UPI / QR Code</p>
                  <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>

            {/* Card Option */}
            <button 
              onClick={() => setStep('card')}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                  <CreditCard size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">Credit / Debit Card</p>
                  <p className="text-xs text-slate-400">Visa, Mastercard, RuPay</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
            </button>

            {/* Net Banking */}
            <button 
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl opacity-60 cursor-not-allowed group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                  <Landmark size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-500 dark:text-slate-400">Net Banking</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter bg-slate-200 dark:bg-slate-700 px-1.5 rounded inline-block">COMING SOON</p>
                </div>
              </div>
            </button>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            {/* Only show back button if we came from selection */}
            {!house?.paymentQrImage && !house?.paymentUpiId && (
              <div className="flex items-center gap-2 text-slate-500 mb-2 cursor-pointer hover:text-blue-600 transition" onClick={() => setStep('selection')}>
                <ChevronRight className="rotate-180" size={16} /> <span className="text-sm font-bold">Back to Methods</span>
              </div>
            )}

            {/* Payment Details Card */}
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-2xl border border-violet-100 dark:border-violet-800 p-4">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-3">Payment Details</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Property</span>
                <span className="font-bold text-slate-800 dark:text-white">{house?.title}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500 dark:text-slate-400">Rent Amount</span>
                <span className="font-black text-violet-600 text-base">₹{house?.rent?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500 dark:text-slate-400">Pay To</span>
                <span className="font-bold text-slate-800 dark:text-white">{ownerName}</span>
              </div>
              {!uploadedQr && upiId !== 'unknown@upi' && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-500 dark:text-slate-400">UPI ID</span>
                  <span className="font-mono font-bold text-blue-600 text-xs">{upiId}</span>
                </div>
              )}
            </div>

            {/* QR Code — centred and prominent */}
            <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-dashed border-violet-200 dark:border-violet-700 shadow-inner">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scan to Pay</p>
              <img
                src={uploadedQr || QR_IMAGE_URL}
                alt="Payment QR Code"
                className="w-52 h-52 object-contain rounded-xl shadow-md"
              />
              {uploadedQr ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> Owner's Verified QR Photo
                  </p>
                </div>
              ) : (
                upiId !== 'unknown@upi' && (
                  <span className="text-xs font-mono text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {upiId}
                  </span>
                )
              )}
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800 flex gap-2">
              <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">Open Google Pay, PhonePe or any UPI app → Scan QR → Pay ₹{house?.rent} → Come back and click the button below.</p>
            </div>

            <button
              onClick={simulateProcessing}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <CheckCircle size={22} className="text-emerald-300" /> I've Paid — Confirm
            </button>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-2 text-slate-500 mb-2 cursor-pointer hover:text-blue-600 transition" onClick={() => setStep('selection')}>
              <ChevronRight className="rotate-180" size={16} /> <span className="text-sm font-bold">Back to Methods</span>
            </div>

            <div className="space-y-4">
               {/* Card Preview */}
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-10 h-7 bg-amber-400/80 rounded-md"></div>
                    <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">CREDIT CARD</div>
                  </div>
                  <p className="text-xl font-mono tracking-[0.2em] mb-4">
                    {cardData.number ? cardData.number.replace(/\d{4}/g, '$& ').trim() : '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] opacity-50 uppercase mb-1">Card Holder</p>
                      <p className="text-sm font-bold tracking-wide uppercase">{cardData.name || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] opacity-50 uppercase mb-1">Expires</p>
                      <p className="text-sm font-bold font-mono">{cardData.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4111 2222 3333 4444"
                      maxLength={16}
                      value={cardData.number}
                      onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g, '')})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardData.expiry}
                      onChange={e => setCardData({...cardData, expiry: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">CVV</label>
                    <input 
                      type="password" 
                      placeholder="•••"
                      maxLength={3}
                      value={cardData.cvv}
                      onChange={e => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="JOHN DOE"
                      value={cardData.name}
                      onChange={e => setCardData({...cardData, name: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none" 
                    />
                  </div>
               </div>
            </div>

            <button
              onClick={simulateProcessing}
              disabled={!cardData.number || !cardData.expiry || !cardData.cvv}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Securely Pay ₹{house?.rent}
            </button>
            <div className="flex items-center justify-center gap-2 text-slate-400">
               <ShieldCheck size={14} />
               <p className="text-[9px] font-medium uppercase tracking-wider">PCI-DSS Compliant 256-bit Encrypted</p>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
            <div className="relative mb-8">
               <div className="w-24 h-24 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
               <div className="w-24 h-24 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full absolute inset-0 animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-blue-500 animate-pulse" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Processing with Gateway</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[240px]">We're securely communicating with your bank. Please do not refresh or close this window.</p>
            
            <div className="mt-8 flex gap-2">
               {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full bg-blue-600/30 animate-bounce`} style={{animationDelay: `${i*0.2}s`}}></div>)}
            </div>
          </div>
        );

      case 'done':
        return (
          <div className="text-center py-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Confirmed! 🎉</h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
               <p className="text-slate-500 dark:text-slate-400 text-sm">Your payment for <strong>{house?.title}</strong> is now complete.</p>
               <p className="text-slate-400 text-xs mt-1">Transaction ID: #TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <p className="text-sm text-slate-400 mb-6">The owner has been notified. You can now access your dashboard to view tenant details.</p>
            <button onClick={handleClose} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/20 active:scale-95">
              Go to Dashboard
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md my-auto overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-7 text-white flex justify-between items-center relative">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner">
               {step === 'selection' ? <CreditCard size={24} /> : step === 'upi' ? <QrCode size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                {step === 'done' ? 'Success' : house?.isPendingPayment ? 'Initial Deposit' : 'Monthly Rent'}
              </h2>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-[0.2em]">{house?.title || 'Rent Payment'}</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all relative z-10">
            <X size={20} />
          </button>
          
          {/* Subtle Glow Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-[50px]"></div>
        </div>

        <div className="p-7 overflow-y-auto max-h-[60vh]">
          {/* Order Summary Miniature */}
          {step !== 'done' && step !== 'processing' && step !== 'upi' && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Rent Amount</p>
                  <p className="text-2xl font-black text-blue-600">₹{house?.rent?.toLocaleString('en-IN')}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Platform Fee</p>
                  <p className="text-sm font-bold text-emerald-500">Free</p>
               </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 p-3 rounded-xl text-xs font-bold text-center border border-rose-100 dark:border-rose-800 animate-shake">
              ⚠️ {error}
            </div>
          )}

          {renderStep()}
        </div>
        
        {/* Footer Security Badge */}
        <div className="px-7 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6 grayscale opacity-50">
           <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> <span className="text-[8px] font-bold uppercase tracking-widest">Secure</span></div>
           <div className="flex items-center gap-1.5"><Landmark size={12} /> <span className="text-[8px] font-bold uppercase tracking-widest">Bank Verified</span></div>
           <div className="flex items-center gap-1.5"><Zap size={12} /> <span className="text-[8px] font-bold uppercase tracking-widest">Instant</span></div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>,
    document.body
  );
};

export default PaymentModal;

