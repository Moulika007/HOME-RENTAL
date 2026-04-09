import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import PaymentModal from './PaymentModal';
import SuccessModal from './SuccessModal';
import VacateRequestModal from './VacateRequestModal';
import Confetti from './Confetti';
import API_BASE from '../api';

const NotificationBell = () => {
    const { user, respondVacate } = useRental();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showPanel, setShowPanel] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [paymentModal, setPaymentModal] = useState(null);
    const [successModal, setSuccessModal] = useState(null);
    const [vacateModal, setVacateModal] = useState(null);
    const [pendingPayment, setPendingPayment] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE}/api/notifications`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await fetch(`${API_BASE}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotificationClick = (notif) => {
        markAsRead(notif._id);

        // 1. FOR OWNERS: Navigate with state to scroll later
        if (notif.type === 'booking_request' || notif.type === 'payment_received') {
            const hId = notif.houseId?._id || notif.houseId;
            navigate('/dashboard', { state: { scrollTo: hId } });
            setShowPanel(false);
        }

        // Workspace notifications — navigate to dashboard
        if (['new_message', 'new_reminder', 'new_todo'].includes(notif.type)) {
            const hId = notif.houseId?._id || notif.houseId;
            navigate('/dashboard', { state: { scrollTo: hId, openWorkspace: hId } });
            setShowPanel(false);
        }

        // 2. FOR RENTERS: Show success, then store payment for later
        if (notif.type === 'request_accepted') {
            setShowConfetti(true);
            setSuccessModal({ houseTitle: notif.metadata?.houseTitle });
            
            // Store the payment data but don't show the modal yet
            setPendingPayment({
                houseId: notif.houseId?._id || notif.houseId,
                house: {
                    rent: notif.metadata?.rentAmount,
                    title: notif.metadata?.houseTitle,
                    location: notif.metadata?.location,
                    paymentUpiId: notif.metadata?.paymentUpiId,
                    paymentQrImage: notif.metadata?.paymentQrImage,
                    propertyType: notif.metadata?.propertyType,
                    purpose: notif.metadata?.purpose
                },
                owner: {
                    name: notif.metadata?.ownerName,
                    email: notif.metadata?.ownerEmail,
                    phone: notif.metadata?.ownerPhone
                }
            });
            setShowPanel(false);
        }

        // 3. VACATE REQUEST: Show Alert Modal
        if (notif.type === 'vacate_request') {
            setVacateModal({
                houseId: notif.houseId?._id || notif.houseId,
                metadata: notif.metadata
            });
            setShowPanel(false);
        }
    };

    const handleVacateResponse = async (action) => {
        const { houseId } = vacateModal;
        const success = await respondVacate(houseId, action);
        if (success) {
            setVacateModal(null);
            window.location.reload();
        }
    };

    const handleCloseSuccess = () => {
        setSuccessModal(null);
        // If there was a pending payment, trigger it now!
        if (pendingPayment) {
            setTimeout(() => {
                setPaymentModal(pendingPayment);
                setPendingPayment(null);
            }, 300);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await fetch(`${API_BASE}/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button onClick={() => setShowPanel(!showPanel)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Bell size={24} className="text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showPanel && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 z-[150] max-h-[32rem] overflow-hidden flex flex-col">
                    <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                        <button onClick={() => setShowPanel(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
                    </div>
                    <div className="overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell size={40} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No new notifications</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif._id} className={`p-4 border-b dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all ${!notif.isRead ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`} onClick={() => handleNotificationClick(notif)}>
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-snug">{notif.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-wider">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {!notif.isRead && <span className="w-2 h-2 bg-violet-500 rounded-full"></span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <PaymentModal
                isOpen={!!paymentModal}
                onClose={() => setPaymentModal(null)}
                house={paymentModal?.house}
                owner={paymentModal?.owner}
                houseId={paymentModal?.houseId}
                user={user}
                onPaymentDone={() => { setPaymentModal(null); window.location.reload(); }}
            />
            <SuccessModal
                isOpen={!!successModal}
                onClose={handleCloseSuccess}
                houseTitle={successModal?.houseTitle}
            />
            <VacateRequestModal
                isOpen={!!vacateModal}
                onClose={() => setVacateModal(null)}
                onRespond={handleVacateResponse}
                metadata={vacateModal?.metadata}
            />
            <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        </div>
    );
};

export default NotificationBell;
