import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import API_BASE from '../api';
import { X, MessageSquare, Calendar, CheckSquare, Send, Plus, Trash2 } from 'lucide-react';

const HouseWorkspaceModal = ({ isOpen, house, user, onClose }) => {
    const [activeTab, setActiveTab] = useState('chat'); // chat, calendar, todos
    
    // States for data
    const [messages, setMessages] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [todos, setTodos] = useState([]);

    // States for inputs
    const [newMessage, setNewMessage] = useState('');
    const [newReminder, setNewReminder] = useState({ title: '', date: '' });
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        if (!isOpen || !house) return;
        fetchWorkspaceData();
        const interval = setInterval(fetchWorkspaceData, 5000);
        return () => clearInterval(interval);
    }, [isOpen, house?._id]);

    const fetchWorkspaceData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/workspace`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                setReminders(data.reminders || []);
                setTodos(data.todos || []);
            }
        } catch { /* keep existing state on error */ }
    };

    if (!isOpen || !house) return null;

    // --- API Calls ---
    const addMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ text: newMessage })
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                setNewMessage('');
            }
        } catch (error) { console.error('Error adding message:', error); }
    };

    const addReminder = async (e) => {
        e.preventDefault();
        if (!newReminder.title || !newReminder.date) return;
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/reminders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(newReminder)
            });
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
                setNewReminder({ title: '', date: '' });
            }
        } catch (error) { console.error('Error adding reminder:', error); }
    };

    const deleteReminder = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/reminders/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
            }
        } catch (error) { console.error('Error deleting reminder:', error); }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ text: newTodo })
            });
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
                setNewTodo('');
            }
        } catch (error) { console.error('Error adding todo:', error); }
    };

    const toggleTodo = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/todos/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
            }
        } catch (error) { console.error('Error toggling todo:', error); }
    };

    const deleteTodo = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/houses/${house._id}/todos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
            }
        } catch (error) { console.error('Error deleting todo:', error); }
    };

    // --- Renders ---
    return createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[400] overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="bg-indigo-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">🏘️ Workspace: {house.title}</h2>
                        <p className="text-indigo-200 text-sm mt-1">
                            Collaborate directly with your {user.role === 'owner' ? 'tenant' : 'landlord'}.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-indigo-500 hover:bg-rose-500 rounded-full transition shadow-md">
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-x-auto shrink-0">
                    <button onClick={() => setActiveTab('chat')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600 tracking-tight' : 'text-slate-500 hover:text-indigo-500'} whitespace-nowrap`}>
                        <MessageSquare size={16} /> Chat & Messages
                    </button>
                    <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition ${activeTab === 'calendar' ? 'text-amber-600 border-b-2 border-amber-600 tracking-tight' : 'text-slate-500 hover:text-amber-500'} whitespace-nowrap`}>
                        <Calendar size={16} /> Reminders
                        {reminders.length > 0 && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs ml-1">{reminders.length}</span>}
                    </button>
                    <button onClick={() => setActiveTab('todos')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition ${activeTab === 'todos' ? 'text-emerald-600 border-b-2 border-emerald-600 tracking-tight' : 'text-slate-500 hover:text-emerald-500'} whitespace-nowrap`}>
                        <CheckSquare size={16} /> To-Do List
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
                    
                    {/* CHAT TAB */}
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-full h-[50vh]">
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-slate-400 mt-10">
                                        <MessageSquare size={48} className="mx-auto text-slate-300 mb-2" />
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.senderId?.toString() === user._id?.toString();
                                        return (
                                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <span className="text-[10px] text-slate-400 font-black uppercase mb-1 ml-1 mr-1">{msg.senderName}</span>
                                                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-tl-none'}`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1 ml-1 mr-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                            <form onSubmit={addMessage} className="flex gap-2 shrink-0 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <input 
                                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-3 text-sm dark:text-white"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" disabled={!newMessage.trim()} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-md">
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* CALENDAR TAB */}
                    {activeTab === 'calendar' && (
                        <div className="flex flex-col h-full">
                            <form onSubmit={addReminder} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 shrink-0">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-3">Add New Reminder</h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="E.g., Rent Due, Maintenance" 
                                        required
                                        className="flex-1 border p-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
                                        value={newReminder.title} 
                                        onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                                    />
                                    <input 
                                        type="date" 
                                        required
                                        className="border p-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
                                        value={newReminder.date} 
                                        onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                                    />
                                    <button className="bg-amber-500 text-white px-4 py-2.5 rounded-lg font-bold shadow-md hover:bg-amber-600 transition flex justify-center items-center gap-1 shrink-0">
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </form>
                            
                            <div className="flex-1 overflow-y-auto space-y-3">
                                {reminders.length === 0 ? (
                                    <div className="text-center text-slate-400 mt-10">
                                        <Calendar size={48} className="mx-auto text-slate-300 mb-2" />
                                        <p>No upcoming reminders.</p>
                                    </div>
                                ) : (
                                    reminders.sort((a,b) => new Date(a.date) - new Date(b.date)).map((rem) => (
                                        <div key={rem._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 border-l-amber-500 shadow-sm flex items-center justify-between group">
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white text-md tracking-tight leading-none">{rem.title}</p>
                                                <p className="text-xs text-amber-600 dark:text-amber-400 font-black mt-2 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded inline-block">
                                                    📅 {new Date(rem.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <button onClick={() => deleteReminder(rem._id)} className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100 p-2">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* TODOS TAB */}
                    {activeTab === 'todos' && (
                        <div className="flex flex-col h-full">
                            <form onSubmit={addTodo} className="flex gap-2 shrink-0 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <input 
                                    className="flex-1 border p-3 rounded-xl text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-inner dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                    placeholder="Add a new task (e.g. Sign contract, Repair AC)..." 
                                    value={newTodo} 
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    required
                                />
                                <button type="submit" className="bg-emerald-500 text-white px-5 rounded-xl font-bold hover:bg-emerald-600 shadow-md transition flex items-center gap-1">
                                    <Plus size={18} /> Add Task
                                </button>
                            </form>
                            
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {todos.length === 0 ? (
                                    <div className="text-center text-slate-400 mt-10">
                                        <CheckSquare size={48} className="mx-auto text-slate-300 mb-2" />
                                        <p>No tasks. You're all caught up!</p>
                                    </div>
                                ) : (
                                    todos.map((t) => (
                                        <div key={t._id} className={`p-4 rounded-xl border flex items-center gap-3 transition ${t.isCompleted ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                                            <input 
                                                type="checkbox" 
                                                checked={t.isCompleted} 
                                                onChange={() => toggleTodo(t._id)}
                                                className="w-5 h-5 accent-emerald-500 cursor-pointer rounded-sm border-slate-300"
                                            />
                                            <span className={`flex-1 text-sm ${t.isCompleted ? 'line-through text-slate-500 font-medium' : 'text-slate-800 dark:text-white font-bold'}`}>
                                                {t.text}
                                            </span>
                                            <button onClick={() => deleteTodo(t._id)} className="text-slate-300 hover:text-rose-500 transition p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
};

export default HouseWorkspaceModal;

