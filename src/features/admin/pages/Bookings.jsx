import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, MapPin, IndianRupee, CheckCircle, XCircle } from 'lucide-react';

export default function Bookings() {
    const [bookings] = useState([
        { id: "BK001", user: "Rahul Sharma", venue: "Mumbai Football Arena", date: "Aug 15, 2024", time: "06:00 PM", amount: "1200", status: "Confirmed" },
        { id: "BK002", user: "Priya Malik", venue: "Smash Badminton Club", date: "Aug 16, 2024", time: "07:00 AM", amount: "600", status: "Pending" },
        { id: "BK003", user: "Amit Kumar", venue: "Bengaluru Sports Hub", date: "Aug 14, 2024", time: "08:00 PM", amount: "1600", status: "Cancelled" },
        { id: "BK004", user: "Vikram Singh", venue: "Marina Turf", date: "Aug 15, 2024", time: "05:00 PM", amount: "1000", status: "Confirmed" },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">BOOKINGS</h1>
                    <p className="text-slate-400">Track and manage venue reservations.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by ID, User, or Venue..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-neon-green/50 focus:outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-300 hover:text-white">
                    <Calendar className="w-4 h-4" />
                    <span>Select Date</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-300 hover:text-white">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Booking ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Venue & Time</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bookings.map((b, i) => (
                            <motion.tr
                                key={b.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-white/5 transition-colors group"
                            >
                                <td className="px-6 py-4 text-sm font-mono text-neon-blue font-bold">{b.id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-white text-sm">{b.user}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs">
                                        <p className="text-white font-medium flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-slate-500" /> {b.venue}
                                        </p>
                                        <div className="flex gap-2 text-slate-400">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.time}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-white flex items-center">
                                    <IndianRupee className="w-3 h-3 text-slate-500 mr-1" />
                                    {b.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            b.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                        }`}>
                                        {b.status === 'Confirmed' && <CheckCircle className="w-3 h-3" />}
                                        {b.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sm font-bold text-slate-400 hover:text-white underline decoration-dashed underline-offset-4">
                                        Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
