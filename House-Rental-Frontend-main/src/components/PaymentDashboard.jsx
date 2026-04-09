import React, { useState, useEffect } from 'react';
import {
    CalendarDays, CheckCircle, Clock, Plus, Trash2,
    Zap, Droplets, Wifi, Flame, FileText, Home, TrendingUp, X
} from 'lucide-react';
import API_BASE from '../api';

const CATEGORY_ICONS = {
    Electricity: <Zap size={16} className="text-yellow-500" />,
    Water: <Droplets size={16} className="text-blue-400" />,
    Internet: <Wifi size={16} className="text-purple-500" />,
    Gas: <Flame size={16} className="text-orange-500" />,
    Rent: <Home size={16} className="text-green-500" />,
    Other: <FileText size={16} className="text-slate-500" />,
};

const CATEGORIES = ['Electricity', 'Water', 'Internet', 'Gas', 'Rent', 'Other'];

// ─── Mini Calendar ─────────────────────────────────────────────────────────────
const MiniCalendar = ({ markedDates = [] }) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const marked = new Set(
        markedDates.map(d => {
            const dt = new Date(d);
            return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
        })
    );

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = Array(firstDay).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="text-slate-400 hover:text-blue-600 transition px-2">‹</button>
                <span className="font-bold text-slate-700 dark:text-white text-sm">{monthName}</span>
                <button onClick={nextMonth} className="text-slate-400 hover:text-blue-600 transition px-2">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-slate-400 font-semibold">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {cells.map((day, i) => {
                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const isMarked = day && marked.has(`${viewYear}-${viewMonth}-${day}`);
                    return (
                        <div
                            key={i}
                            className={`
                w-7 h-7 mx-auto flex items-center justify-center rounded-full font-medium transition
                ${!day ? '' : isMarked ? 'bg-green-500 text-white' : isToday ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}
              `}
                        >
                            {day || ''}
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-3 mt-3 text-xs text-slate-500 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block" /> Paid</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded-full inline-block" /> Today</span>
            </div>
        </div>
    );
};

// ─── Add Bill Form ─────────────────────────────────────────────────────────────
const AddBillForm = ({ onAdd, onCancel }) => {
    const [form, setForm] = useState({ title: '', category: 'Electricity', amount: '', dueDate: '', notes: '' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="bg-blue-50 dark:bg-slate-700 rounded-2xl p-4 border border-blue-100 dark:border-slate-600 space-y-3">
            <h4 className="font-bold text-slate-700 dark:text-white">➕ Add Bill Reminder</h4>
            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="Bill title (e.g. EB Bill)"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    className="col-span-2 border rounded-xl px-3 py-2 text-sm dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                />
                <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    className="border rounded-xl px-3 py-2 text-sm dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={form.amount}
                    onChange={e => set('amount', e.target.value)}
                    className="border rounded-xl px-3 py-2 text-sm dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                />
                <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => set('dueDate', e.target.value)}
                    className="col-span-2 border rounded-xl px-3 py-2 text-sm dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                />
                <input
                    placeholder="Notes (optional)"
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    className="col-span-2 border rounded-xl px-3 py-2 text-sm dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => form.title && form.dueDate && onAdd(form)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                >Save Bill</button>
                <button onClick={onCancel} className="px-4 py-2 rounded-xl border text-sm dark:border-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition">Cancel</button>
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const PaymentDashboard = ({ user, myHouses = [] }) => {
    const [payments, setPayments] = useState([]);
    const [bills, setBills] = useState([]);
    const [showAddBill, setShowAddBill] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.token) return;
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [pRes, bRes] = await Promise.all([
                    fetch(`${API_BASE}/api/payments/my-payments`, { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch(`${API_BASE}/api/bills`, { headers: { Authorization: `Bearer ${user.token}` } }),
                ]);
                const [pData, bData] = await Promise.all([pRes.json(), bRes.json()]);
                setPayments(Array.isArray(pData) ? pData : []);
                setBills(Array.isArray(bData) ? bData : []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, [user]);

    const addBill = async (form) => {
        const res = await fetch(`${API_BASE}/api/bills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            const bill = await res.json();
            setBills(prev => [...prev, bill]);
            setShowAddBill(false);
        }
    };

    const payBill = async (id) => {
        const res = await fetch(`${API_BASE}/api/bills/${id}/pay`, {
            method: 'PUT', headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) setBills(prev => prev.map(b => b._id === id ? { ...b, isPaid: true, paidDate: new Date() } : b));
    };

    const deleteBill = async (id) => {
        const res = await fetch(`${API_BASE}/api/bills/${id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) setBills(prev => prev.filter(b => b._id !== id));
    };

    // Calendar marked dates: payment paid dates + unpaid bill due dates
    const markedDates = [
        ...payments.filter(p => p.paidDate).map(p => p.paidDate),
        ...bills.filter(b => !b.isPaid).map(b => b.dueDate),
    ];

    // Next rent due (from myHouses or payments)
    const lastPayment = payments[0];
    const nextDue = lastPayment?.dueDate ? new Date(lastPayment.dueDate) : null;
    const daysUntilDue = nextDue ? Math.ceil((nextDue - new Date()) / (1000 * 60 * 60 * 24)) : null;

    // For owner — per-house payment status
    const isOwner = user?.role === 'owner';

    if (loading) return (
        <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="space-y-6">

            {/* ── Header Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Last Paid */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-800">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">💚 Last Payment</p>
                    {lastPayment ? (
                        <>
                            <p className="text-lg font-bold text-green-700 dark:text-green-300">₹{lastPayment.amount}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                {new Date(lastPayment.paidDate || lastPayment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-green-500">{lastPayment.month}</p>
                        </>
                    ) : <p className="text-sm text-slate-400">No payments yet</p>}
                </div>

                {/* Next Due */}
                <div className={`rounded-2xl p-4 border ${daysUntilDue !== null && daysUntilDue <= 7 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'}`}>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">📅 Next Due</p>
                    {nextDue ? (
                        <>
                            <p className={`text-lg font-bold ${daysUntilDue !== null && daysUntilDue <= 7 ? 'text-red-600' : 'text-blue-700 dark:text-blue-300'}`}>
                                {nextDue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {daysUntilDue !== null && (
                                <p className={`text-xs font-semibold ${daysUntilDue <= 7 ? 'text-red-500' : 'text-blue-500'}`}>
                                    {daysUntilDue > 0 ? `${daysUntilDue} days` : daysUntilDue === 0 ? 'Due today!' : 'Overdue!'}
                                </p>
                            )}
                        </>
                    ) : <p className="text-sm text-slate-400">Not set</p>}
                </div>

                {/* Total Paid */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-100 dark:border-purple-800 col-span-2 md:col-span-1">
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">💜 Total Paid</p>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        ₹{payments.reduce((s, p) => s + (p.status === 'paid' ? p.amount : 0), 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-purple-500">{payments.filter(p => p.status === 'paid').length} payments</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* ── Calendar ── */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                        <CalendarDays size={18} className="text-blue-600" /> Payment Calendar
                    </h3>
                    <MiniCalendar markedDates={markedDates} />
                </div>

                {/* ── Payment History ── */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-600" /> Payment History
                    </h3>
                    {payments.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-dashed border-slate-200 dark:border-slate-600">
                            <p className="text-slate-400 text-sm">No payment history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {payments.map(p => (
                                <div key={p._id} className={`flex items-center justify-between p-3 rounded-xl border ${p.status === 'paid' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800'}`}>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">{p.month}</p>
                                        {p.paidDate && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Paid: {new Date(p.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                        {p.dueDate && (
                                            <p className="text-xs text-slate-400">
                                                Next due: {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                        {isOwner && p.houseId?.title && (
                                            <p className="text-xs text-blue-500">🏠 {p.houseId.title}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800 dark:text-white">₹{p.amount}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'}`}>
                                            {p.status === 'paid' ? '✅ Paid' : '⏳ Due'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bill Reminders ── */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                        <FileText size={18} className="text-orange-500" /> Bill Reminders
                    </h3>
                    <button
                        onClick={() => setShowAddBill(!showAddBill)}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                    >
                        {showAddBill ? <><X size={14} />Cancel</> : <><Plus size={14} />Add Bill</>}
                    </button>
                </div>

                {showAddBill && <AddBillForm onAdd={addBill} onCancel={() => setShowAddBill(false)} />}

                <div className="space-y-2 mt-3">
                    {bills.length === 0 && !showAddBill && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-600">
                            <p className="text-slate-400 text-sm">No bill reminders yet. Add your electricity, water bills!</p>
                        </div>
                    )}
                    {bills.map(b => {
                        const due = new Date(b.dueDate);
                        const days = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
                        const isOverdue = !b.isPaid && days < 0;
                        const isDueSoon = !b.isPaid && days >= 0 && days <= 3;
                        return (
                            <div key={b._id} className={`flex items-center gap-3 p-3 rounded-xl border ${b.isPaid ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 opacity-60' : isOverdue ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' : isDueSoon ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                                <div className="text-xl">{CATEGORY_ICONS[b.category] || CATEGORY_ICONS['Other']}</div>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${b.isPaid ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>{b.title}</p>
                                    <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span>{b.category}</span>
                                        {b.amount && <span>· ₹{b.amount}</span>}
                                        <span>· Due: {due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        {b.isPaid && b.paidDate && <span className="text-green-600">· Paid {new Date(b.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                                        {!b.isPaid && isOverdue && <span className="text-red-500 font-bold">· OVERDUE</span>}
                                        {!b.isPaid && isDueSoon && <span className="text-yellow-500 font-bold">· Due soon!</span>}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {!b.isPaid && (
                                        <button onClick={() => payBill(b._id)} title="Mark as Paid"
                                            className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition">
                                            <CheckCircle size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => deleteBill(b._id)} title="Delete"
                                        className="text-slate-300 hover:text-red-500 p-1.5 transition">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaymentDashboard;
