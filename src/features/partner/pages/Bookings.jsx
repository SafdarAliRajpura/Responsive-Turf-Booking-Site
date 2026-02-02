import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, User, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        Confirmed: 'bg-neon-green/10 text-neon-green border-neon-green/20',
        Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default function Bookings() {
    const [filter, setFilter] = useState('All');

    const bookings = [
        { id: "#BK-8842", turf: "Neon Arena Main", user: "Rahul Sharma", date: "Oct 24, 2024", time: "18:00 - 19:00", status: "Confirmed", amount: "1,200" },
        { id: "#BK-8841", turf: "Sky Badminton Court", user: "Priya Singh", date: "Oct 24, 2024", time: "20:00 - 21:00", status: "Pending", amount: "800" },
        { id: "#BK-8840", turf: "Neon Arena Main", user: "Amit Patel", date: "Oct 25, 2024", time: "07:00 - 08:00", status: "Cancelled", amount: "1,200" },
        { id: "#BK-8839", turf: "Box Cricket Zone", user: "Vikram Malhotra", date: "Oct 25, 2024", time: "21:00 - 23:00", status: "Confirmed", amount: "3,000" },
        { id: "#BK-8838", turf: "Sky Badminton Court", user: "Neha Gupta", date: "Oct 26, 2024", time: "17:00 - 18:00", status: "Pending", amount: "800" },
    ];

    const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

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

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
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
                                        <h3 className="text-lg font-bold text-white group-hover:text-neon-purple transition-colors">{booking.turf}</h3>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div className="flex md:items-center flex-col md:flex-row gap-2 md:gap-6 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {booking.user}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.time}</span>
                                        <span className="flex items-center gap-1 font-mono text-slate-500">{booking.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                <span className="text-xl font-bold text-white">₹{booking.amount}</span>

                                {booking.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-bold transition-colors">
                                            <CheckCircle className="w-3 h-3" /> Approve
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-colors">
                                            <XCircle className="w-3 h-3" /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
