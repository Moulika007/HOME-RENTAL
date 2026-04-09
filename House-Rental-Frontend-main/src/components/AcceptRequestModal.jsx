import React, { useState, useRef } from 'react';
import { X, QrCode, Smartphone, Upload, ImagePlus } from 'lucide-react';

const AcceptRequestModal = ({ isOpen, onClose, onAccept, requestName }) => {
    const [tab, setTab] = useState('upi'); // 'upi' | 'qr'
    const [upiId, setUpiId] = useState('');
    const [qrImage, setQrImage] = useState(null);   // base64 string
    const [qrPreview, setQrPreview] = useState(null);
    const fileRef = useRef();

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setQrImage(ev.target.result);
            setQrPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (tab === 'upi') {
            if (!upiId.trim()) return alert('Please enter a UPI ID or Phone Number');
            onAccept(upiId.trim(), null);
        } else {
            if (!qrImage) return alert('Please upload a QR code image');
            onAccept('', qrImage);
        }
    };

    const handleClose = () => {
        setUpiId('');
        setQrImage(null);
        setQrPreview(null);
        setTab('upi');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={handleClose}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 bg-violet-50 dark:bg-violet-900/20 flex items-center justify-between border-b border-violet-100 dark:border-violet-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-violet-100 dark:bg-violet-800 p-2 rounded-2xl text-violet-600 dark:text-violet-300">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Accept Request</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">from {requestName}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition"><X size={24} /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setTab('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition ${tab === 'upi' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Smartphone size={16} /> UPI ID / Phone
                    </button>
                    <button
                        onClick={() => setTab('qr')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition ${tab === 'qr' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <ImagePlus size={16} /> Upload QR Code
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {tab === 'upi' ? (
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Enter your UPI ID or phone number. The renter will use this to generate a QR code for payment.
                            </p>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                UPI ID / Phone Number
                            </label>
                            <input
                                type="text"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="e.g., username@upi or 9876543210"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Upload your UPI QR code image. The renter will scan it directly to pay.
                            </p>
                            <div
                                onClick={() => fileRef.current.click()}
                                className="border-2 border-dashed border-violet-200 dark:border-violet-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition"
                            >
                                {qrPreview ? (
                                    <img src={qrPreview} alt="QR Preview" className="w-40 h-40 object-contain rounded-xl" />
                                ) : (
                                    <>
                                        <Upload size={36} className="text-violet-300 mb-2" />
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Click to upload QR image</p>
                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                                    </>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            {qrPreview && (
                                <button type="button" onClick={() => { setQrImage(null); setQrPreview(null); }} className="mt-2 text-xs text-rose-500 font-bold hover:underline">
                                    Remove image
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={handleClose} className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition shadow-lg shadow-teal-100 dark:shadow-none">
                            Accept Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcceptRequestModal;
