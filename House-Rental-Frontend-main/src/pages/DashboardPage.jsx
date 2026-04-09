import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import { useRental } from '../context/RentalContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Plus, MapPin, CheckCircle, XCircle, Trash2, Home, Clock, Bell, Pencil, Save, X, DoorOpen, CreditCard, Palmtree, Users, TrendingUp } from 'lucide-react';
import ExpandableDashboard from '../components/ExpandableDashboard';
import FinancialAnalytics from '../components/FinancialAnalytics';
import { LoadingSpinner } from '../components/Loading';
import Toast from '../components/Toast';
import PaymentDashboard from '../components/PaymentDashboard';
import ConfirmModal from '../components/ConfirmModal';
import AcceptRequestModal from '../components/AcceptRequestModal';
import HouseWorkspaceModal from '../components/HouseWorkspaceModal';
import PaymentModal from '../components/PaymentModal';

const DashboardPage = () => {
    // 1. Updated 'requestVacate' here
    const { user, myHouses, logout, fetchMyHouses, requestVacate } = useRental();
    const navigate = useNavigate();
    const location = useLocation();

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const [acceptModal, setAcceptModal] = useState({ isOpen: false, houseId: null, requestId: null, requestName: '' });
    const [workspaceModal, setWorkspaceModal] = useState({ isOpen: false, house: null });

    // RENTER STATE
    const [myRequests, setMyRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [payments, setPayments] = useState([]);
    const [myHome, setMyHome] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [paymentModal, setPaymentModal] = useState(null);

    // OWNER STATE
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState('home'); // 'home' | 'payments'
    const [editingTenantId, setEditingTenantId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', startDate: '' });
    const [showExpandable, setShowExpandable] = useState(false);
    const [editingHouseId, setEditingHouseId] = useState(null);
    const [editHouseForm, setEditHouseForm] = useState({ title: '', location: '', rent: '', images: '', purpose: 'Living', propertyType: 'Apartment', furnishing: 'Unfurnished', amenities: '' });

    const [newHouse, setNewHouse] = useState({
        title: '', location: '', rent: '', images: '',
        purpose: 'Living', propertyType: 'Apartment', furnishing: 'Unfurnished', amenities: '',
        isBooked: false, tenant: { name: '', email: '', phone: '', startDate: '', isRentPaid: false }
    });

    const [showFinancials, setShowFinancials] = useState(false);
    const [ownerPayments, setOwnerPayments] = useState([]);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetchData = async () => {
            if (user.role === 'renter') {
                await fetchRenterData();
            } else {
                await fetchMyHouses();
                fetchOwnerPayments();
            }
        };
        fetchData();

        // Auto-refresh every 15s so new booking requests appear without manual reload
        const interval = setInterval(() => {
            if (user?.role === 'owner') fetchMyHouses();
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // NEW: Handle Scroll from Notification state
    useEffect(() => {
        if (location.state?.scrollTo) {
            setShowExpandable(false); // Switch to Grid View
            setTimeout(() => {
                const element = document.getElementById(location.state.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('ring-4', 'ring-violet-400', 'ring-offset-2', 'dark:ring-offset-slate-900', 'animate-pulse');
                    setTimeout(() => {
                        element.classList.remove('ring-4', 'ring-violet-400', 'ring-offset-2', 'dark:ring-offset-slate-900', 'animate-pulse');
                        navigate(location.pathname, { replace: true, state: {} });
                    }, 3000);
                }
            }, 800);
        }
    }, [location.state, myHouses]);

    // Auto-open workspace from notification click
    useEffect(() => {
        if (location.state?.openWorkspace && myHouses?.length > 0) {
            const targetHouse = myHouses.find(h => h._id === location.state.openWorkspace);
            if (targetHouse) {
                setWorkspaceModal({ isOpen: true, house: targetHouse });
                navigate(location.pathname, { replace: true, state: { scrollTo: location.state.scrollTo } });
            }
        }
    }, [location.state?.openWorkspace, myHouses]);

    // Auto-open workspace for renter from notification
    useEffect(() => {
        if (!location.state?.openWorkspace) return;
        const hId = location.state.openWorkspace;
        // Check myHome first
        if (myHome && myHome._id === hId) {
            setWorkspaceModal({ isOpen: true, house: myHome });
            navigate(location.pathname, { replace: true, state: {} });
            return;
        }
        // Check acceptedRequests (pending payment state)
        const found = acceptedRequests.find(r => r._id === hId);
        if (found) {
            setWorkspaceModal({ isOpen: true, house: found });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.openWorkspace, myHome, acceptedRequests]);

    // --- API HELPERS ---
    const fetchOwnerPayments = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/payments/owner-payments`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setOwnerPayments(data || []);
        } catch (err) { console.error(err); }
    };

    const fetchRenterData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/renters/dashboard`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            console.log('Renter Dashboard Data:', data);
            setMyHome(data.myHome);
            setMyRequests(data.pendingRequests || []);
            setAcceptedRequests(data.acceptedRequests || []);
            setPayments(data.payments || []);
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = (houseId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Cancel Request',
            message: 'Are you sure you want to cancel this booking request?',
            type: 'warning',
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE}/api/houses/${houseId}/cancel-request`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (res.ok) {
                        setToast({ message: 'Request cancelled successfully', type: 'success' });
                        setTimeout(async () => {
                            await fetchRenterData();
                        }, 500);
                    } else {
                        setToast({ message: 'Failed to cancel request', type: 'error' });
                    }
                } catch (err) {
                    setToast({ message: 'Error cancelling request', type: 'error' });
                }
            }
        });
    };

    // --- NEW: HANDLE VACATE (For both Renter and Owner) ---
    const handleVacate = (houseId) => {
        const confirmMessage = user.role === 'owner'
            ? "Sending a vacate request to the tenant. They must approve it before the property is marked as vacant. Proceed?"
            : "Sending a vacate request to the owner. They must approve it before your residency ends. Proceed?";

        setConfirmModal({
            isOpen: true,
            title: user.role === 'owner' ? 'Request Tenant Removal' : 'Request to Leave',
            message: confirmMessage,
            type: 'warning',
            onConfirm: async () => {
                const success = await requestVacate(houseId);
                if (success) {
                    setToast({ message: 'Request sent! Waiting for approval.', type: 'info' });
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    setToast({ message: 'Failed to send request. Please try again.', type: 'error' });
                }
            }
        });
    };
    // --- OWNER FUNCTIONS ---
    const handleChange = (e) => setNewHouse({ ...newHouse, [e.target.name]: e.target.value });
    const handleTenantChange = (e) => setNewHouse({ ...newHouse, tenant: { ...newHouse.tenant, [e.target.name]: e.target.value } });

    const handleAddHouse = async (e) => {
        e.preventDefault();
        if (!user.token) return setToast({ message: 'Not Authenticated', type: 'error' });
        const imagesArray = newHouse.images.split(',').map(url => url.trim()).filter(url => url !== "");
        const amenitiesArray = newHouse.amenities.split(',').map(item => item.trim()).filter(item => item !== "");
        await fetch(`${API_BASE}/api/houses`, {
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
        await fetch(`${API_BASE}/api/houses/${houseId}/tenant-details`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(editForm)
        });
        setEditingTenantId(null);
        fetchMyHouses();
    };

    const startEditingHouse = (house) => {
        setEditingHouseId(house._id);
        setEditHouseForm({
            title: house.title,
            location: house.location,
            rent: house.rent,
            images: (house.images || []).join(', '),
            purpose: house.purpose || 'Living',
            propertyType: house.propertyType || 'Apartment',
            furnishing: house.furnishing || 'Unfurnished',
            amenities: (house.amenities || []).join(', ')
        });
    };

    const saveHouseChanges = async (houseId) => {
        const payload = {
            ...editHouseForm,
            rent: Number(editHouseForm.rent),
            images: editHouseForm.images.split(',').map(s => s.trim()).filter(Boolean),
            amenities: editHouseForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
        };
        const res = await fetch(`${API_BASE}/api/houses/${houseId}/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            setEditingHouseId(null);
            fetchMyHouses();
            setToast({ message: 'Property updated successfully', type: 'success' });
        } else {
            setToast({ message: 'Failed to update property', type: 'error' });
        }
    };

    const deleteHouse = (houseId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Property',
            message: 'Are you sure you want to delete this property? This action cannot be undone.',
            type: 'danger',
            onConfirm: async () => {
                await fetch(`${API_BASE}/api/houses/${houseId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` } });
                fetchMyHouses();
                setToast({ message: 'Property deleted successfully', type: 'success' });
            }
        });
    };
    // --- CLEANED FUNCTIONS (No Hidden Spaces) ---
    const handleAccept = (houseId, requestId, requestName) => {
        setAcceptModal({ isOpen: true, houseId, requestId, requestName });
    };

    const confirmAcceptRequest = async (paymentUpiId, paymentQrImage) => {
        const { houseId, requestId } = acceptModal;
        try {
            const res = await fetch(`${API_BASE}/api/houses/${houseId}/accept`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ requestId, paymentUpiId, paymentQrImage })
            });

            const data = await res.json();
            if (res.ok) {
                setToast({ message: 'Request Accepted! Renter has been notified to pay.', type: 'success' });
                fetchMyHouses();
            } else {
                setToast({ message: data.message || "Failed to accept", type: 'error' });
            }
        } catch (err) { console.error(err); }
        setAcceptModal({ isOpen: false, houseId: null, requestId: null, requestName: '' });
    };

    const handleDecline = async (houseId, requestId) => {
        try {
            const res = await fetch(`${API_BASE}/api/houses/${houseId}/decline`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ requestId })
            });

            if (res.ok) {
                setToast({ message: 'Request Declined', type: 'info' });
                fetchMyHouses();
            }
        } catch (err) { console.error(err); }
    };
    const toggleRent = async (houseId) => { await fetch(`${API_BASE}/api/houses/${houseId}/rent`, { method: 'PUT', headers: { Authorization: `Bearer ${user.token}` } }); fetchMyHouses(); };

    if (!user) return null;

    // ==========================================
    //            RENTER DASHBOARD
    // ==========================================
    if (user.role === 'renter') {
        if (loading) return <LoadingSpinner />;
        return (
            <div className="min-h-screen p-6 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">👤 Renter Dashboard</h1>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowFinancials(!showFinancials)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm ${showFinancials ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border'}`}
                            >
                                <TrendingUp size={16} /> {showFinancials ? 'Back to Dashboard' : 'View Financials'}
                            </button>
                            <div className="bg-amber-100 dark:bg-amber-900/50 px-4 py-2 rounded-full">
                                <span className="text-sm font-bold text-amber-600 dark:text-amber-300">⏳ {myRequests.length} Pending</span>
                            </div>
                            {acceptedRequests.length > 0 && (
                                <div className="bg-emerald-100 dark:bg-emerald-900/50 px-4 py-2 rounded-full">
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">✅ {acceptedRequests.length} Accepted</span>
                                </div>
                            )}
                            {payments.filter(p => p.status === 'pending').length > 0 && (
                                <div className="bg-rose-100 dark:bg-rose-900/50 px-4 py-2 rounded-full">
                                    <span className="text-sm font-bold text-rose-600 dark:text-rose-300">💳 {payments.filter(p => p.status === 'pending').length} Due</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {showFinancials ? (
                        <FinancialAnalytics user={user} payments={payments} bills={bills} />
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Home size={20} /> My Confirmed Home</h2>

                            {myHome ? (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 mb-10">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <img src={myHome.images[0] || "https://via.placeholder.com/400"} className="w-full md:w-48 h-32 object-cover rounded-xl bg-slate-200" alt="home" />
                                        <div className="flex-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block ${myHome.isBooked ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {myHome.isBooked ? 'Active Tenant' : '⏳ Awaiting Payment'}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{myHome.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 mb-2">{myHome.location}</p>
                                            <p className="text-violet-600 dark:text-violet-400 font-bold mb-4">₹{myHome.rent}/month</p>

                                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border dark:border-slate-600 inline-block">
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mr-2">Rent Status:</span>
                                                    {myHome.currentTenant.isRentPaid ? (
                                                        <span className="text-emerald-600 font-bold flex items-center gap-1 inline-flex"><CheckCircle size={14} /> Paid</span>
                                                    ) : (
                                                        <span className="text-red-500 font-bold flex items-center gap-1 inline-flex"><XCircle size={14} /> Due / Unpaid</span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <a href={`tel:${myHome.ownerId?.phone || ''}`} className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-md">
                                                        📞 Call Owner
                                                    </a>
                                                    <a href={`mailto:${myHome.ownerId?.email || ''}`} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center gap-2 border dark:border-slate-600">
                                                        ✉️ Email
                                                    </a>
                                                </div>

                                                <button
                                                    onClick={() => setWorkspaceModal({ isOpen: true, house: myHome })}
                                                    className="bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
                                                >
                                                    💬 Open Workspace
                                                </button>

                                                {(myHome.isPendingPayment || !myHome.currentTenant.isRentPaid) && (
                                                    <button
                                                        onClick={() => setPaymentModal({
                                                            houseId: myHome._id,
                                                            house: {
                                                                rent: myHome.rent,
                                                                title: myHome.title,
                                                                location: myHome.location,
                                                                paymentUpiId: myHome.paymentUpiId,
                                                                paymentQrImage: myHome.paymentQrImage,
                                                                propertyType: myHome.propertyType,
                                                                purpose: myHome.purpose,
                                                                isPendingPayment: myHome.isPendingPayment
                                                            },
                                                            owner: {
                                                                name: myHome.ownerId?.name,
                                                                email: myHome.ownerId?.email,
                                                                phone: myHome.ownerId?.phone
                                                            }
                                                        })}
                                                        className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-3 rounded-lg font-bold text-sm hover:from-violet-700 hover:to-blue-700 transition flex items-center gap-2 shadow-md animate-pulse"
                                                    >
                                                        💳 Pay Now
                                                    </button>
                                                )}

                                                {myHome.vacateRequest?.status === 'pending' ? (
                                                    <div className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 px-4 py-3 rounded-lg font-bold text-sm border border-amber-200 dark:border-amber-800 flex items-center gap-2 animate-pulse">
                                                        <Clock size={16} /> Vacate Pending Approval
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleVacate(myHome._id)}
                                                        className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-lg font-bold text-sm border border-rose-100 dark:border-rose-900/50 hover:bg-rose-100 transition flex items-center gap-2"
                                                    >
                                                        <DoorOpen size={16} /> Leave House
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-center text-slate-400 mb-10 shadow-lg">
                                    <Home size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="dark:text-slate-400">You do not have a confirmed home yet.</p>
                                    <button onClick={() => navigate('/home')} className="mt-4 text-violet-600 dark:text-violet-400 font-bold hover:underline">
                                        🏠 Browse Properties
                                    </button>
                                </div>
                            )}

                            {acceptedRequests.length > 0 && (
                                <div className="mb-10">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <CheckCircle size={20} className="text-emerald-500" /> Accepted Requests
                                        <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm">{acceptedRequests.length}</span>
                                    </h2>
                                    <div className="grid gap-4">
                                        {acceptedRequests.map(req => (
                                            <div key={req._id} className="bg-gradient-to-r from-teal-50 to-violet-50 dark:from-teal-900/20 dark:to-violet-900/20 p-6 rounded-xl shadow-lg border-2 border-teal-200 dark:border-teal-700">
                                                <div className="flex items-start gap-4">
                                                    <img src={req.images[0] || "https://via.placeholder.com/100"} className="w-24 h-24 rounded-xl object-cover shadow-md" alt="accepted" />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-xl text-slate-800 dark:text-white">{req.title}</h4>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                                                    <MapPin size={14} /> {req.location}
                                                                </p>
                                                            </div>
                                                            <span className="bg-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">✅ Accepted</span>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mt-3">
                                                            <p className="text-sm font-bold text-slate-700 dark:text-white mb-2 underline underline-offset-4 decoration-violet-300">🏠 Owner Contact Details</p>
                                                            <div className="space-y-1 mb-4">
                                                                <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Name:</strong> {req.ownerId?.name}</p>
                                                                <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Email:</strong> {req.ownerId?.email}</p>
                                                                <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Phone:</strong> {req.ownerId?.phone || 'N/A'}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <a href={`tel:${req.ownerId?.phone}`} className="flex-1 bg-violet-600 text-white text-center py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700 transition shadow-sm">📞 Call Now</a>
                                                                <a href={`mailto:${req.ownerId?.email}`} className="flex-1 bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 text-center py-2.5 rounded-xl font-bold text-sm border-2 border-violet-100 dark:border-violet-900/50 hover:bg-violet-50 transition shadow-sm">✉️ Email</a>
                                                                <button onClick={() => setWorkspaceModal({ isOpen: true, house: req })} className="flex-1 bg-indigo-600 text-white text-center py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-sm">💬 Workspace</button>
                                                            </div>
                                                            <p className="text-lg font-bold text-violet-600 dark:text-violet-400 mt-4 border-t pt-3">Monthly Rent: ₹{req.rent}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Clock size={20} /> Pending Applications
                                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm">{myRequests.length}</span>
                            </h2>
                            <div className="grid gap-4">
                                {myRequests.length > 0 ? myRequests.map(req => {
                                    const userRequest = req.requests?.find(r => r.userId === user._id);
                                    return (
                                        <div key={req._id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg border-2 border-amber-200 dark:border-amber-800/50 hover-lift">
                                            <div className="flex items-start gap-4 mb-4">
                                                <img src={req.images[0] || "https://via.placeholder.com/100"} className="w-24 h-24 rounded-xl object-cover bg-slate-200 shadow-md" alt="req" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-xl text-slate-800 dark:text-white">{req.title}</h4>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                                                <MapPin size={14} /> {req.location}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 items-end">
                                                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md animate-pulse">
                                                                ⏳ Awaiting Response
                                                            </span>
                                                            <button onClick={() => handleCancelRequest(req._id)} className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-800/50 transition shadow-sm">❌ Cancel Request</button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                                        <div className="bg-violet-50 dark:bg-violet-900/30 rounded-lg p-3">
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Rent</p>
                                                            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">₹{req.rent}</p>
                                                        </div>
                                                        <div className="bg-fuchsia-50 dark:bg-fuchsia-900/30 rounded-lg p-3">
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Property Type</p>
                                                            <p className="text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400">{req.propertyType || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-700 dark:to-violet-900/30 rounded-lg p-4 border border-violet-100 dark:border-slate-600">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">📅 Request Sent</p>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{userRequest ? new Date(userRequest.date).toLocaleString() : 'N/A'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">👤 Your Status</p>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{userRequest?.status || 'pending'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                                        <Clock size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-400 dark:text-slate-500 text-lg font-medium">No pending applications</p>
                                        <button onClick={() => navigate('/home')} className="mt-4 text-violet-600 dark:text-violet-400 font-bold hover:underline">🏠 Browse Properties</button>
                                    </div>
                                )}
                            </div>

                            {payments.length > 0 && (
                                <div className="mb-10">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        💳 Payment History
                                        <span className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-sm">{payments.length}</span>
                                    </h2>
                                    <div className="grid gap-4">
                                        {payments.map(payment => (
                                            <div key={payment._id} className={`p-5 rounded-xl shadow-lg border-2 ${payment.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-lg text-slate-800 dark:text-white">{payment.month}</p>
                                                        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1">₹{payment.amount}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        {payment.status === 'paid' ? (
                                                            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">✅ Paid</span>
                                                        ) : (
                                                            <button 
                                                                onClick={() => setPaymentModal({
                                                                    houseId: myHome._id,
                                                                    house: {
                                                                        rent: myHome.rent,
                                                                        title: myHome.title,
                                                                        location: myHome.location,
                                                                        paymentUpiId: myHome.paymentUpiId,
                                                                        paymentQrImage: myHome.paymentQrImage,
                                                                        propertyType: myHome.propertyType,
                                                                        purpose: myHome.purpose,
                                                                        isPendingPayment: myHome.isPendingPayment
                                                                    },
                                                                    owner: {
                                                                        name: myHome.ownerId?.name,
                                                                        email: myHome.ownerId?.email,
                                                                        phone: myHome.ownerId?.phone
                                                                    }
                                                                })}
                                                                className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:from-rose-600 hover:to-orange-600 transition"
                                                            >
                                                                💳 Pay Now
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <ConfirmModal {...confirmModal} onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
                <HouseWorkspaceModal isOpen={workspaceModal.isOpen} house={workspaceModal.house} user={user} onClose={() => setWorkspaceModal({ isOpen: false, house: null })} />
                <PaymentModal
                    isOpen={!!paymentModal}
                    onClose={() => setPaymentModal(null)}
                    house={paymentModal?.house}
                    owner={paymentModal?.owner}
                    houseId={paymentModal?.houseId}
                    user={user}
                    onPaymentDone={() => { setPaymentModal(null); fetchRenterData(); setToast({ message: 'Payment confirmed! Your booking is now active.', type: 'success' }); }}
                />
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        );
    }

    // ==========================================
    //            OWNER DASHBOARD
    // ==========================================
    const safeHouses = Array.isArray(myHouses) ? myHouses : [];

    return (
        <div className="min-h-screen p-6 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">🏢 Owner Dashboard</h1>
                    <div className="flex gap-3">
                        <button onClick={() => setShowAdd(!showAdd)} className="bg-violet-500 text-white px-5 py-2.5 rounded-xl font-bold flex gap-2 shadow-lg hover:bg-violet-600 transition">
                            <Plus /> {showAdd ? "Cancel" : "Add Property"}
                        </button>
                        <button onClick={() => { setShowFinancials(!showFinancials); if(!showFinancials) setShowExpandable(false); }} className={`px-5 py-2.5 rounded-xl font-bold flex gap-2 shadow-lg transition ${showFinancials ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 border'}`}>
                            <TrendingUp /> {showFinancials ? "List View" : "Financials"}
                        </button>
                        <button onClick={() => { setShowExpandable(!showExpandable); if(!showExpandable) setShowFinancials(false); }} className="bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-600 transition">
                            {showExpandable ? 'Grid View' : 'Analytics View'}
                        </button>
                    </div>
                </div>

                {showFinancials && <div className="mb-10"><FinancialAnalytics user={user} payments={ownerPayments} houses={safeHouses} /></div>}

                {showAdd && (
                    <form onSubmit={handleAddHouse} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl mb-8 border-2 border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" value={newHouse.title} onChange={handleChange} placeholder="House Title" className="border p-3 rounded-xl" required />
                            <input name="location" value={newHouse.location} onChange={handleChange} placeholder="Location" className="border p-3 rounded-xl" required />
                            <input name="rent" type="number" value={newHouse.rent} onChange={handleChange} placeholder="Rent Amount" className="border p-3 rounded-xl" required />
                            <input name="images" value={newHouse.images} onChange={handleChange} placeholder="Image URLs (comma separated)" className="border p-3 rounded-xl" />
                            <select name="purpose" value={newHouse.purpose} onChange={handleChange} className="border p-3 rounded-xl">
                                <option value="Living">Living</option>
                                <option value="Vacation">Vacation</option>
                            </select>
                            <select name="propertyType" value={newHouse.propertyType} onChange={handleChange} className="border p-3 rounded-xl">
                                {newHouse.purpose === 'Living' ? (
                                    <>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Studio">Studio</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Shared House">Shared House</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Beach House">Beach House</option>
                                        <option value="Relaxation Spot">Relaxation Spot</option>
                                        <option value="Resort">Resort</option>
                                        <option value="Cottage">Cottage</option>
                                    </>
                                )}
                            </select>
                            <select name="furnishing" value={newHouse.furnishing} onChange={handleChange} className="border p-3 rounded-xl"><option value="Unfurnished">Unfurnished</option><option value="Semi-Furnished">Semi-Furnished</option><option value="Furnished">Fully Furnished</option></select>
                            <input name="amenities" value={newHouse.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" className="border p-3 rounded-xl md:col-span-2" />
                            <div className="md:col-span-2 bg-violet-50 p-4 rounded-xl border border-violet-100 mt-2">
                                <label className="font-bold text-slate-700 mb-2 block">Occupancy Status</label>
                                <select className="border p-3 rounded-xl bg-white w-full mb-4" value={newHouse.isBooked} onChange={(e) => setNewHouse({ ...newHouse, isBooked: e.target.value === 'true' })}>
                                    <option value="false">Vacant</option><option value="true">Already Occupied</option>
                                </select>
                                {newHouse.isBooked && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input name="name" placeholder="Resident Name" onChange={handleTenantChange} className="border p-3 rounded-xl" required />
                                        <input name="email" placeholder="Resident Email" onChange={handleTenantChange} className="border p-3 rounded-xl" required />
                                        <input name="phone" placeholder="Phone Number" onChange={handleTenantChange} className="border p-3 rounded-xl" required />
                                        <input name="startDate" type="date" onChange={handleTenantChange} className="border p-3 rounded-xl" required />
                                        <div className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" onChange={(e) => setNewHouse({ ...newHouse, tenant: { ...newHouse.tenant, isRentPaid: e.target.checked } })} /><label>Rent Paid?</label></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold mt-4 hover:bg-teal-600 transition shadow-md">Save</button>
                    </form>
                )}

                {showExpandable ? (
                    <ExpandableDashboard houses={safeHouses} loading={false} />
                ) : (
                    <div className="space-y-12 pb-20">
                        {/* --- HELPER FUNCTION FOR RENDER --- */}
                        {(() => {
                                const renderCard = (house) => (
                                <div key={house._id} id={house._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md scroll-mt-24">
                                    <img src={house.images[0] || "https://via.placeholder.com/400"} className="w-full h-48 object-cover bg-slate-200 dark:bg-slate-700" alt={house.title} />
                                    <div className="p-5">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{house.title}</h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => startEditingHouse(house)} className="text-slate-300 hover:text-violet-500 transition" title="Edit Property">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => deleteHouse(house._id)} className="text-slate-300 hover:text-red-500 transition" title="Delete Property">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inline Edit Form */}
                                        {editingHouseId === house._id && (
                                            <div className="mt-3 mb-3 bg-violet-50 dark:bg-slate-900 p-4 rounded-xl border border-violet-200 dark:border-slate-700 space-y-2">
                                                <p className="text-xs font-black text-violet-700 dark:text-violet-300 uppercase tracking-wider mb-2">✏️ Edit Property</p>
                                                <input className="w-full border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" placeholder="Title" value={editHouseForm.title} onChange={e => setEditHouseForm({ ...editHouseForm, title: e.target.value })} />
                                                <input className="w-full border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" placeholder="Location" value={editHouseForm.location} onChange={e => setEditHouseForm({ ...editHouseForm, location: e.target.value })} />
                                                <input type="number" className="w-full border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" placeholder="Rent" value={editHouseForm.rent} onChange={e => setEditHouseForm({ ...editHouseForm, rent: e.target.value })} />
                                                <input className="w-full border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" placeholder="Image URLs (comma separated)" value={editHouseForm.images} onChange={e => setEditHouseForm({ ...editHouseForm, images: e.target.value })} />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <select className="border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" value={editHouseForm.purpose} onChange={e => setEditHouseForm({ ...editHouseForm, purpose: e.target.value })}>
                                                        <option value="Living">Living</option>
                                                        <option value="Vacation">Vacation</option>
                                                    </select>
                                                    <select className="border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" value={editHouseForm.furnishing} onChange={e => setEditHouseForm({ ...editHouseForm, furnishing: e.target.value })}>
                                                        <option value="Unfurnished">Unfurnished</option>
                                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                                        <option value="Furnished">Fully Furnished</option>
                                                    </select>
                                                </div>
                                                <input className="w-full border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" placeholder="Property Type" value={editHouseForm.propertyType} onChange={e => setEditHouseForm({ ...editHouseForm, propertyType: e.target.value })} />
                                                <input className="w-full border p-2 rounded-lg text-sm dark:bg-slate-800 dark:text-white dark:border-slate-600" placeholder="Amenities (comma separated)" value={editHouseForm.amenities} onChange={e => setEditHouseForm({ ...editHouseForm, amenities: e.target.value })} />
                                                <div className="flex gap-2 pt-1">
                                                    <button onClick={() => saveHouseChanges(house._id)} className="flex-1 bg-violet-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-violet-700 transition flex items-center justify-center gap-1">
                                                        <Save size={13} /> Save
                                                    </button>
                                                    <button onClick={() => setEditingHouseId(null)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1">
                                                        <X size={13} /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-1 mt-1 font-medium">
                                            <MapPin size={14} className="text-slate-400" /> {house.location}
                                        </p>
                                        <p className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-3">
                                            ✨ {house.propertyType}
                                        </p>

                                        {(house.isBooked || house.isPendingPayment) && house.currentTenant ? (
                                            <div className="mt-4 bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl border border-violet-100 dark:border-violet-900 relative">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-xs font-black text-violet-800 dark:text-violet-300 uppercase tracking-tighter">Current Resident</p>
                                                    <div className="flex gap-2">
                                                        {editingTenantId === house._id ? (
                                                            <>
                                                                <button onClick={() => saveTenantChanges(house._id)} className="text-teal-600"><Save size={16} /></button>
                                                                <button onClick={() => setEditingTenantId(null)} className="text-rose-500"><X size={16} /></button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => startEditing(house)} className="text-slate-400 hover:text-violet-600"><Pencil size={14} /></button>
                                                        )}
                                                    </div>
                                                </div>
                                                {editingTenantId === house._id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input className="text-sm border p-2 rounded-lg" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                                                        <input className="text-sm border p-2 rounded-lg" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone" />
                                                        <input className="text-sm border p-2 rounded-lg" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" />
                                                        <input type="date" className="text-sm border p-2 rounded-lg" value={editForm.startDate} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} />
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1 mb-3">
                                                        <p className="font-bold flex items-center gap-2">👤 {house.currentTenant.name}</p>
                                                        <div className="flex gap-2 mt-3">
                                                            <a href={`tel:${house.currentTenant.phone}`} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">📞 Call</a>
                                                            <a href={`mailto:${house.currentTenant.email}`} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1 shadow-sm">✉️ Mail</a>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t dark:border-slate-700">
                                                    <button onClick={() => toggleRent(house._id)} className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition ${house.currentTenant.isRentPaid ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-700 border-2 border-rose-100 dark:border-rose-900/30 text-rose-500'}`}>
                                                        {house.currentTenant.isRentPaid ? <><CheckCircle size={14} /> Paid</> : <><XCircle size={14} /> Unpaid</>}
                                                    </button>
                                                    {house.vacateRequest?.status === 'pending' ? (
                                                        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 py-2 rounded-lg font-bold text-[10px] uppercase text-center border border-amber-200 dark:border-amber-800 animate-pulse">
                                                            Vacate Pending
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleVacate(house._id)} className="bg-gradient-to-r from-rose-500 to-orange-400 text-white py-2 rounded-lg font-bold text-xs hover:from-rose-600 hover:to-orange-500 transition shadow-sm">
                                                            Vacate
                                                        </button>
                                                    )}
                                                    <button onClick={() => setWorkspaceModal({ isOpen: true, house })} className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-indigo-700 transition shadow-sm">
                                                        💬 Open Workspace
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-4">
                                                {house.requests && house.requests.length > 0 ? (
                                                    <>
                                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Bell size={12} /> {house.requests.length} New Application(s)</p>
                                                        {house.requests.map(req => (
                                                            <div key={req._id} className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50 mb-3 shadow-sm">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <p className="font-black text-slate-800 dark:text-amber-100">{req.name}</p>
                                                                    <span className="text-[10px] bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded font-black text-amber-800 dark:text-amber-200 uppercase">Pending</span>
                                                                </div>
                                                                
                                                                <div className="mb-3 space-y-1">
                                                                    <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">📧 {req.email}</p>
                                                                    <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">📞 {req.phone}</p>
                                                                    {req.moveInDate && <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mt-2 bg-violet-50 dark:bg-violet-900/30 p-1.5 rounded inline-block">📅 Move-in: {new Date(req.moveInDate).toLocaleDateString()}</p>}
                                                                </div>

                                                                {/* Vacation Details */}
                                                                {(req.guests || req.stayDuration) && (
                                                                    <div className="flex gap-4 mb-3 bg-white dark:bg-slate-900/40 p-2 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                                                        {req.guests && (
                                                                            <div>
                                                                                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Guests</p>
                                                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"><Users size={12} /> {req.guests}</p>
                                                                            </div>
                                                                        )}
                                                                        {req.stayDuration && (
                                                                            <div>
                                                                                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Duration</p>
                                                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"><Clock size={12} /> {req.stayDuration} Days</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Additional Details */}
                                                                {(req.additionalDetails || req.message) && (
                                                                    <div className="mb-4">
                                                                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 ml-1">Additional Details</p>
                                                                        <div className="bg-white/50 dark:bg-slate-900/30 p-2.5 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 italic border border-slate-100 dark:border-slate-800">
                                                                            "{req.additionalDetails || req.message}"
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleAccept(house._id, req._id, req.name)} className="flex-1 bg-teal-500 text-white text-xs py-2.5 rounded-xl font-bold shadow-md hover:bg-teal-600 transition active:scale-95">Accept Request</button>
                                                                    <button onClick={() => handleDecline(house._id, req._id)} className="flex-1 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs py-2.5 rounded-xl font-bold hover:bg-rose-200 transition active:scale-95">Decline</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ) : <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">🛋️ Vacant</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );

                            return (
                                <>
                                    {/* --- LIVING SECTION (Default) --- */}
                                    {safeHouses.filter(h => h.purpose === 'Living' || !h.purpose).length > 0 && (
                                        <section className="animate-fade-in">
                                            <div className="flex items-center gap-3 mb-6 border-b-2 border-indigo-100 dark:border-indigo-900 pb-3">
                                                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                                    <Home size={24} />
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Living Properties</h2>
                                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                                    {safeHouses.filter(h => h.purpose === 'Living' || !h.purpose).length}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {safeHouses.filter(h => h.purpose === 'Living' || !h.purpose).map(house => renderCard(house))}
                                            </div>
                                        </section>
                                    )}

                                    {/* --- VACATION SECTION --- */}
                                    {safeHouses.filter(h => h.purpose === 'Vacation').length > 0 && (
                                        <section className="animate-fade-in delay-100">
                                            <div className="flex items-center gap-3 mb-6 border-b-2 border-amber-100 dark:border-amber-900 pb-3 mt-12">
                                                <div className="p-2.5 bg-amber-100 dark:bg-amber-900 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm">
                                                    <Palmtree size={24} />
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Vacation Properties</h2>
                                                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                                    {safeHouses.filter(h => h.purpose === 'Vacation').length}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {safeHouses.filter(h => h.purpose === 'Vacation').map(house => renderCard(house))}
                                            </div>
                                        </section>
                                    )}

                                    {safeHouses.length === 0 && (
                                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-inner">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                                                <Plus size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No properties yet</p>
                                            <button onClick={() => setShowAdd(true)} className="mt-4 text-violet-500 font-bold hover:underline">Click here to add your first property</button>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}
                <AcceptRequestModal
                    isOpen={acceptModal.isOpen}
                    requestName={acceptModal.requestName}
                    onClose={() => setAcceptModal({ isOpen: false, houseId: null, requestId: null, requestName: '' })}
                    onAccept={confirmAcceptRequest}
                />
                <ConfirmModal {...confirmModal} onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
                <HouseWorkspaceModal isOpen={workspaceModal.isOpen} house={workspaceModal.house} user={user} onClose={() => setWorkspaceModal({ isOpen: false, house: null })} />
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </div>
    );
};

export default DashboardPage;