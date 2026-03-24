import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, User, CheckCircle, XCircle, Calendar as CalendarIcon, List, GripVertical } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        Confirmed: 'bg-neon-green/10 text-neon-green border-neon-green/20',
        Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
        Rejected: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default function Bookings() {
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [bookingsState, setBookingsState] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bookings');
                const data = await res.json();
                if (data.success) {
                    const mapped = data.data.map(b => ({
                        id: b._id,
                        turfName: b.turfName,
                        user: b.user || "Guest User",
                        date: b.date,
                        timeSlot: b.timeSlot,
                        status: b.status || 'Pending',
                        price: b.price,
                        dayIndex: new Date(b.date).getDay() || 0, // approximation for calendar
                        startHour: parseInt(b.timeSlot.split(':')[0]) || 12, 
                        duration: 1, 
                        color: b.color || "bg-yellow-500"
                    }));
                    setBookingsState(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setBookingsState(prev => prev.map(booking => 
                    booking.id === id ? { ...booking, status: newStatus, color: data.data.color } : booking
                ));
            }
        } catch(err) {
            console.error("Status update failed:", err);
        }
    };

    const filteredBookings = filter === 'All' ? bookingsState : bookingsState.filter(b => b.status === filter);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">BOOKINGS</h1>
                    <p className="text-slate-400">Track and manage your turf reservations.</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search Booking ID..."
                            className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-neon-purple/50 w-full md:w-64"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-purple transition-colors" />
                    </div>
                    <button className="bg-slate-900 border border-white/10 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-white/5 pb-4 overflow-x-auto">
                {['All', 'Confirmed', 'Pending', 'Cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === status
                            ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center bg-slate-900 border border-white/5 p-1 rounded-xl w-fit mb-4">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <List className="w-4 h-4" /> List View
                </button>
                <button 
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        viewMode === 'calendar' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <CalendarIcon className="w-4 h-4" /> Calendar View
                </button>
            </div>

            {viewMode === 'list' ? (
                /* Bookings List */
                <div className="space-y-4">
                {loading ? (
                    <div className="text-neon-purple font-bold text-center py-12">Fetching Bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-slate-500 font-bold text-center py-12 bg-slate-900 border border-white/5 rounded-2xl">No bookings exist here yet.</div>
                ) : filteredBookings.map((booking, index) => (
                    <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-900 hover:border-neon-purple/20 transition-all group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-xl bg-slate-800 flex flex-col items-center justify-center border border-white/5">
                                    <span className="text-slate-500 text-xs font-bold uppercase">Oct</span>
                                    <span className="text-2xl font-black text-white">{booking.date.split(' ')[1].replace(',', '')}</span>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-neon-purple transition-colors">{booking.turfName}</h3>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div className="flex md:items-center flex-col md:flex-row gap-2 md:gap-6 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {booking.user}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.timeSlot}</span>
                                        <span className="flex items-center gap-1 font-mono text-slate-500">{booking.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                <span className="text-xl font-bold text-white">₹{booking.price}</span>

                                {booking.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-bold transition-colors"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'Rejected')}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-colors"
                                        >
                                            <XCircle className="w-3 h-3" /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
                </div>
            ) : (
                /* Visual Drag-and-Drop Calendar Schedule */
                <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden p-6 relative min-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-neon-purple" /> Weekly Schedule
                        </h2>
                        <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                            Drag to Reschedule
                        </span>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px] relative">
                            {/* Header Row: Days */}
                            <div className="grid grid-cols-8 gap-0 border-b border-white/10 pb-4 mb-4">
                                <div className="text-slate-500 font-bold text-xs uppercase text-right pr-4 pt-2">Time</div>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="text-center font-bold text-slate-300">{day}</div>
                                ))}
                            </div>

                            {/* Time Rows */}
                            <div className="relative border-l border-white/5 ml-[12.5%]">
                                {Array.from({ length: 15 }, (_, i) => i + 9).map(hour => (
                                    <div key={hour} className="border-t border-white/5 h-20 relative flex items-start">
                                        <div className="absolute -left-[calc(100%+16px)] top-0 -translate-y-1/2 w-full text-right text-slate-500 text-xs font-bold font-mono">
                                            {hour}:00
                                        </div>
                                    </div>
                                ))}

                                {/* Overlaying Bookings */}
                                {filteredBookings.map((booking) => {
                                    // 9:00 is our top row (index 0) => startHour - 9 => grid position
                                    // Each hour row is 80px tall (h-20)
                                    // 1 day column = 1/7 of full width = ~14.28%
                                    // Need to shift right by `dayIndex * 14.28%`
                                    const topOffset = (booking.startHour - 9) * 80;
                                    const height = booking.duration * 80;
                                    const leftOffset = `${(booking.dayIndex / 7) * 100}%`;

                                    return (
                                        <motion.div
                                            drag
                                            dragConstraints={{ top: 0, bottom: 14 * 80, left: 0, right: 1000 }}
                                            dragSnapToOrigin={false}
                                            dragElastic={0}
                                            dragMomentum={false}
                                            whileDrag={{ scale: 1.05, zIndex: 10, cursor: 'grabbing', boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                                            key={booking.id}
                                            style={{
                                                top: topOffset,
                                                left: leftOffset,
                                                height: height,
                                                position: 'absolute',
                                                width: 'calc(14.28% - 8px)',
                                            }}
                                            className={`${booking.color} bg-opacity-20 border border-opacity-50 p-2 rounded-xl backdrop-blur-md cursor-grab transition-colors relative group hover:bg-opacity-30`}
                                        >
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical className="w-4 h-4 text-white/50" />
                                            </div>
                                            <p className="text-xs font-bold text-white truncate">{booking.turfName}</p>
                                            <p className="text-[10px] text-white/70 font-mono truncate">{booking.timeSlot}</p>
                                            <p className="text-[10px] font-bold mt-1 tracking-wider uppercase text-white/90 truncate">{booking.user}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
