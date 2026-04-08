import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Mail, Clock, Check, Inbox, Send, X } from 'lucide-react';
import apiClient from '../../../utils/apiClient';

export default function Inquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-neon-blue" />
                        Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-cyan-500">Inquiries</span>
                    </h1>
                    <p className="text-slate-400 mt-1">Manage contact forms and user messages.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-white/10 rounded-xl px-6 py-3 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                            <Inbox className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Unread</p>
                            <p className="text-xl font-black text-white">{unreadCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence>
                    {inquiries.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="bg-slate-900/50 border border-white/10 rounded-2xl p-12 text-center"
                        >
                            <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Inquiries Found</h3>
                            <p className="text-slate-400">You're all caught up! No new messages at the moment.</p>
                        </motion.div>
                    ) : (
                        inquiries.map((inquiry, idx) => (
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
                                                    <h4 className="text-sm font-bold text-neon-blue uppercase tracking-wider">Draft Reply</h4>
                                                    <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white">
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
