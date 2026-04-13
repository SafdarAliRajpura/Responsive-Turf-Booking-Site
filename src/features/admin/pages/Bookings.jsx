import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Calendar, Clock, MapPin, 
    IndianRupee, CheckCircle, XCircle, X, 
    User, Target, Trash2, ArrowRight
} from 'lucide-react';
import apiClient from '../../../utils/apiClient';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await apiClient.get('/bookings');
            if (res.data.success) {
                setBookings(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await apiClient.patch(`/bookings/${id}`, { status });
            if (res.data.success) {
                setBookings(bookings.map(b => b._id === id ? { ...b, status: res.data.data.status } : b));
                setSelectedBooking({ ...selectedBooking, status: res.data.data.status });
            }
        } catch (err) {
            console.error('Update Status Error:', err);
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.turfName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">ARENA <span className="text-neon-blue uppercase">RESERVATIONS</span></h1>
                    <p className="text-slate-400 text-sm font-medium">Real-time platform activity and booking orchestration.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Scan entries by User, ID or Turf..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-neon-blue/50 focus:outline-none transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">
                    <Filter className="w-4 h-4" />
                    <span>Segment</span>
                </button>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[30px] overflow-hidden backdrop-blur-sm shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/80 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="px-8 py-5">TX ID</th>
                            <th className="px-8 py-5">Athlete</th>
                            <th className="px-8 py-5">Field & Schedule</th>
                            <th className="px-8 py-5">Gross</th>
                            <th className="px-8 py-5">Platform Fee</th>
                            <th className="px-8 py-5">Partner Share</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Intel</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                             [1,2,3,4].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="8" className="px-8 py-6 h-16 bg-white/5"></td>
                                </tr>
                             ))
                        ) : filteredBookings.map((b, i) => (
                            <motion.tr
                                key={b._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="hover:bg-white/5 transition-all group"
                            >
                                <td className="px-8 py-6 text-xs font-black text-slate-500 font-mono tracking-tighter">{(b._id || 'tx').slice(-8).toUpperCase()}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20 text-neon-blue">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <p className="font-black text-white text-sm uppercase italic">{b.user}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-white font-bold text-xs flex items-center gap-2 uppercase tracking-tight">
                                            <Target className="w-3 h-3 text-neon-green" /> {b.turfName}
                                        </p>
                                        <div className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.timeSlot}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-black text-white/50 text-xs">
                                    <div className="flex items-center gap-1">
                                        <IndianRupee className="w-2.5 h-2.5" />
                                        <span>{b.price}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-black text-neon-green">
                                    <div className="flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3" />
                                        <span>{b.adminCommission || (Number(b.price) * 0.1).toFixed(2)}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-black text-white">
                                    <div className="flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3 text-slate-500" />
                                        <span>{b.partnerShare || (Number(b.price) * 0.9).toFixed(2)}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                                        b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                        b.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            b.status === 'Confirmed' ? 'bg-emerald-500' :
                                            b.status === 'Cancelled' ? 'bg-red-500' : 'bg-orange-400'
                                        }`} />
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button 
                                        onClick={() => setSelectedBooking(b)}
                                        className="text-[10px] font-black text-neon-blue hover:text-white uppercase tracking-widest border-b border-neon-blue/0 hover:border-white transition-all pb-0.5"
                                    >
                                        Inspect
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Side Panel */}
            <AnimatePresence>
                {selectedBooking && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-4 right-4 bottom-4 w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl z-[101] rounded-[40px] flex flex-col overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-neon-blue/10 to-transparent pointer-events-none" />
                            
                            <div className="p-8 relative">
                                <button 
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mt-8 space-y-6">
                                    <div>
                                        <span className="text-[10px] font-black text-neon-blue uppercase tracking-[0.2em] mb-2 block">Reservation Dossier</span>
                                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                                            {selectedBooking.user}
                                        </h2>
                                        <p className="text-slate-500 font-mono text-xs uppercase mt-1">ID: {selectedBooking._id}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Sport</p>
                                            <p className="text-sm font-bold text-white uppercase">{selectedBooking.sport}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Billing Value</p>
                                            <p className="text-sm font-black text-neon-green italic flex items-center gap-1">
                                                <IndianRupee className="w-3 h-3" /> {selectedBooking.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Platform Fee (10%)</p>
                                             <p className="text-sm font-black text-neon-green">₹{selectedBooking.adminCommission || (Number(selectedBooking.price) * 0.1).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Partner Payout (90%)</p>
                                             <p className="text-sm font-black text-white">₹{selectedBooking.partnerShare || (Number(selectedBooking.price) * 0.9).toFixed(2)}</p>
                                        </div>
                                        <div className="h-px bg-white/5" />
                                        <div className="flex items-start gap-4 pt-2">
                                             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                 <Target className="w-5 h-5 text-neon-blue" />
                                             </div>
                                             <div>
                                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Transaction Ref</p>
                                                 <p className="text-[10px] font-mono font-bold text-white uppercase">{selectedBooking.paymentId || 'Razorpay_Order_ID: ' + (selectedBooking.orderId || 'N/A')}</p>
                                             </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Control Protocol</p>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                                Super Admin privileges are restricted to Observation Mode. 
                                                Status mitigation must be initiated by the designated Arena Partner.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto p-8 bg-slate-950/50 border-t border-white/5">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">
                                    Administrative Action: Updating the status will trigger a system-wide notification to the athlete and the turf manager.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
