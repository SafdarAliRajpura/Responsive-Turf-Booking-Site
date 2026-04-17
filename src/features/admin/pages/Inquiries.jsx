import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Mail, Clock, Check, Inbox, Send, X } from 'lucide-react';
import apiClient from '../../../utils/apiClient';

export default function Inquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data } = await apiClient.get('/contacts');
            setInquiries(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
            setError("Failed to load inquiries");
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await apiClient.put(`/contacts/${id}/read`);
            setInquiries(inquiries.map(inq => 
                inq._id === id ? { ...inq, status: 'read' } : inq
            ));
        } catch (err) {
            console.error("Failed to update inquiry status:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await apiClient.delete(`/contacts/${id}`);
            setInquiries(inquiries.filter(inq => inq._id !== id));
        } catch (err) {
            console.error("Failed to delete inquiry:", err);
        }
    };

    const handleSendReply = async (id) => {
        if (!replyMessage.trim()) return;
        
        setSendingReply(true);
        try {
            await apiClient.post(`/contacts/${id}/reply`, { replyMessage });
            setInquiries(inquiries.map(inq => 
                inq._id === id ? { ...inq, status: 'read' } : inq
            ));
            setReplyingTo(null);
            setReplyMessage('');
        } catch (err) {
            console.error("Failed to send reply:", err);
            alert("Failed to send reply. Please try again.");
        } finally {
            setSendingReply(false);
        }
    };

    const unreadCount = inquiries.filter(i => i.status === 'unread').length;
    const resolvedCount = inquiries.filter(i => i.status === 'read').length;

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inq.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inq.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'All' || inq.status === filter;
        
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 mt-20">
                <p className="text-xl font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">SUPPORT <span className="text-neon-blue">INBOX</span></h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Monitor system-wide user requests and platform inquiries.</p>
                </div>
            </div>

            {/* Support Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Threads', val: inquiries.length, color: 'text-white' },
                    { label: 'Pending Response', val: unreadCount, color: 'text-orange-500' },
                    { label: 'Resolved', val: resolvedCount, color: 'text-emerald-500' }
                ].map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-5 rounded-[2rem] hover:bg-white/5 transition-all"
                    >
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5">{s.label}</p>
                        <h4 className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</h4>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Inbox className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email or topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-neon-blue/30 focus:outline-none transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex bg-slate-950/50 border border-white/10 rounded-xl p-1">
                    {['All', 'unread', 'read'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === opt ? 'bg-neon-blue text-black' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            {opt === 'unread' ? 'Pending' : opt === 'read' ? 'Resolved' : 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence>
                    {filteredInquiries.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-20 text-center"
                        >
                            <Inbox className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">No Records Found</h3>
                            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">You're all caught up with platform communications.</p>
                        </motion.div>
                    ) : (
                        filteredInquiries.map((inquiry, idx) => (
                            <motion.div
                                key={inquiry._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`bg-slate-900/50 backdrop-blur-xl border rounded-[2rem] p-6 md:p-8 relative overflow-hidden group ${
                                    inquiry.status === 'unread' ? 'border-neon-blue/30 shadow-[0_0_20px_rgba(0,255,255,0.05)]' : 'border-white/5 opacity-70'
                                }`}
                            >
                                {inquiry.status === 'unread' && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue" />
                                )}

                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                                inquiry.status === 'unread' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {inquiry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{inquiry.name}</h3>
                                                <a href={`mailto:${inquiry.email}`} className="text-sm font-medium text-slate-400 hover:text-neon-blue transition-colors flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {inquiry.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5">
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">{inquiry.subject}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col justify-between items-end min-w-[200px] border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(inquiry.createdAt).toLocaleString()}
                                        </p>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setReplyingTo(replyingTo === inquiry._id ? null : inquiry._id)}
                                                className="w-10 h-10 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue hover:text-black transition-all flex items-center justify-center"
                                                title="Reply"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                            {inquiry.status === 'unread' && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(inquiry._id)}
                                                    className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center"
                                                    title="Mark as Read"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(inquiry._id)}
                                                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                title="Delete Inquiry"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Reply Section Expandable */}
                                <AnimatePresence>
                                    {replyingTo === inquiry._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-black text-neon-blue uppercase tracking-widest">Compose Response</h4>
                                                    <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white transition-colors">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <textarea
                                                    value={replyMessage}
                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                    placeholder="Type your reply here..."
                                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all resize-none shadow-inner"
                                                    rows="4"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => handleSendReply(inquiry._id)}
                                                        disabled={sendingReply || !replyMessage.trim()}
                                                        className="px-6 py-2.5 bg-neon-blue text-black font-black uppercase tracking-wider text-sm rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {sendingReply ? 'Sending...' : 'Send Email'}
                                                        {!sendingReply && <Send className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
