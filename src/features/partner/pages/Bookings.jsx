import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Clock, User, CheckCircle, XCircle, 
    Calendar as CalendarIcon, List, GripVertical, 
    X, MapPin, IndianRupee, Target
} from 'lucide-react';
import apiClient from '../../../utils/apiClient';

const StatusBadge = ({ status }) => {
    const styles = {
        Confirmed: 'bg-neon-green/10 text-neon-green border-neon-green/20',
        Completed: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
        Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
        Rejected: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default function Bookings() {
    const [filter, setFilter] = useState('All');
    const [bookingsState, setBookingsState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await apiClient.get('/bookings');
            if (res.data.success) {
                // Sort by date (newest first)
                const sorted = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const mapped = sorted.map(b => ({
                    ...b,
                    id: b._id,
                    dayIndex: new Date(b.date).getDay() || 0,
                    startHour: parseInt(b.timeSlot.split(':')[0]) || 12,
                    duration: 1
                }));
                setBookingsState(mapped);
            }
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await apiClient.patch(`/bookings/${id}`, { status: newStatus });
            if (res.data.success) {
                setBookingsState(prev => prev.map(booking => 
                    booking.id === id ? { ...booking, status: newStatus } : booking
                ));
                if (selectedBooking && selectedBooking.id === id) {
                    setSelectedBooking({ ...selectedBooking, status: newStatus });
                }
                setIsCancelModalOpen(false);
                setBookingToCancel(null);
            }
        } catch(err) {
            console.error("Status update failed:", err);
        }
    };

    const filteredBookings = bookingsState.filter(b => {
        return filter === 'All' || b.status === filter;
    });

    const getFormattedDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return { day: '01', month: 'JAN' };
            return {
                day: d.getDate().toString().padStart(2, '0'),
                month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
            };
        } catch (e) {
            return { day: '01', month: 'JAN' };
        }
    };

    return (
        <div className="space-y-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter">ARENA <span className="text-neon-purple uppercase font-black">RESERVATIONS</span></h1>
                    <p className="text-slate-400 font-medium text-sm">Manage your field bookings and player sessions.</p>
                </div>

                <div className="flex gap-4">
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-white/5 pb-4 overflow-x-auto">
                {['All', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === status
                            ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)
                ) : filteredBookings.length === 0 ? (
                    <div className="text-slate-500 font-bold text-center py-20 bg-slate-900 border border-white/5 rounded-[40px] uppercase tracking-widest text-xs italic">No activity found.</div>
                ) : filteredBookings.map((booking, index) => {
                    const { day, month } = getFormattedDate(booking.date);
                    return (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedBooking(booking)}
                            className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[30px] p-6 hover:bg-slate-900/60 hover:border-neon-purple/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-full bg-neon-purple/5 skew-x-[30deg] translate-x-16 pointer-events-none" />
                            
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-slate-800 flex flex-col items-center justify-center border border-white/5 group-hover:border-neon-purple/30 transition-all">
                                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] pb-1 border-b border-white/5 w-full text-center">{month}</span>
                                    <span className="text-2xl font-black text-white mt-1 italic uppercase">{day}</span>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-neon-purple transition-all">{booking.turfName}</h3>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div className="flex md:items-center flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-neon-purple" /> {booking.user}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {booking.timeSlot}</span>
                                        <span className="font-mono text-slate-600 opacity-50 tracking-normal">{(booking.id || '').slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-8 relative z-10">
                                <span className="text-2xl font-black text-white italic flex items-center gap-1">
                                    <IndianRupee className="w-4 h-4 text-neon-purple" /> {booking.price}
                                </span>
                                <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
                                    VIEW DETAILS
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Details Side Panel for Partners */}
            <AnimatePresence>
                {selectedBooking && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-4 right-4 bottom-4 w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl z-[101] rounded-[40px] flex flex-col overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-neon-purple/10 to-transparent pointer-events-none" />
                            
                            <div className="p-8 relative h-full flex flex-col">
                                <button 
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mt-12 space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    <div>
                                        <span className="text-[10px] font-black text-neon-purple uppercase tracking-[0.3em] mb-3 block">Reservation Details</span>
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                                            {selectedBooking.user}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-4">
                                            <StatusBadge status={selectedBooking.status} />
                                            <p className="text-slate-500 font-mono text-[10px] uppercase break-all w-full">ID: {(selectedBooking.id || '').toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</p>
                                            <p className="text-sm font-black text-white uppercase italic">{selectedBooking.sport || 'General'}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Earnings</p>
                                            <p className="text-base font-black text-neon-green italic flex items-center gap-1.5">
                                                <IndianRupee className="w-4 h-4" /> {selectedBooking.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/60 border border-white/5 rounded-[34px] p-8 space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neon-purple flex-shrink-0 border border-white/5">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Field Location</p>
                                                <p className="text-lg font-black text-white italic uppercase tracking-tight">{selectedBooking.turfName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 flex-shrink-0 border border-white/5">
                                                <CalendarIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Engagement Time</p>
                                                <p className="text-lg font-black text-white italic uppercase tracking-tight">{selectedBooking.date} @ {selectedBooking.timeSlot}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Action Footer - Only show Cancel option for confirmed bookings */}
                                {selectedBooking.status === 'Confirmed' && (
                                    <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                                        <button 
                                            onClick={() => {
                                                setBookingToCancel(selectedBooking);
                                                setIsCancelModalOpen(true);
                                            }}
                                            className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-red-500/20 transition-all shadow-lg hover:shadow-red-500/20"
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Premium Confirmation Modal */}
            <AnimatePresence>
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" 
                            onClick={() => setIsCancelModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl overflow-hidden text-center"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-red-500/20">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">Confirm <span className="text-red-500">Cancellation</span></h2>
                            <p className="text-slate-400 font-medium text-sm mb-8">
                                You are about to cancel the reservation for <span className="text-white font-bold">{bookingToCancel?.user}</span>. This booking cannot be recovered.
                            </p>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 transition-all"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(bookingToCancel?.id, 'Cancelled')}
                                    className="flex-1 py-4 bg-red-600 hover:bg-white text-white hover:text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-600/20 transition-all"
                                >
                                    Cancel Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
