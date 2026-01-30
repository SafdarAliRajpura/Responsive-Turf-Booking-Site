import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, MoreVertical, Plus, IndianRupee, X, Image as ImageIcon, Upload } from 'lucide-react';
import footballImg from '../../../assets/images/home/night-football.jpg';

export default function Venues() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [venues] = useState([
        { id: 1, name: "Mumbai Football Arena", location: "Andheri West", price: "1200", rating: "4.9", sports: ["Football"], status: "Active" },
        { id: 2, name: "Bengaluru Sports Hub", location: "Koramangala", price: "800", rating: "4.7", sports: ["Cricket", "Football"], status: "Active" },
        { id: 3, name: "Smash Badminton Club", location: "Vasant Kunj", price: "600", rating: "4.8", sports: ["Badminton"], status: "Maintenance" },
    ]);

    return (
        <div className="space-y-6 relative">
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setShowAddModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            transition={{ duration: 0.5, type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 flex flex-col"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none" />

                            {/* Header */}
                            <div className="relative bg-slate-950/50 backdrop-blur-xl p-6 border-b border-white/5 flex justify-between items-center z-20">
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase text-white tracking-wide">Add New Venue</h2>
                                    <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-1">Enter venue details below</p>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all border border-white/5 hover:border-red-500/30"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide p-8 relative z-20">
                                <div className="space-y-8">
                                    {/* Image Upload */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-950/50 group-hover:bg-slate-950/80 transition-all group-hover:border-neon-green/30">
                                            <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-8 h-8 text-neon-green" />
                                            </div>
                                            <p className="font-bold text-white text-lg mb-2">Upload Venue Image</p>
                                            <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
                                        </div>
                                    </motion.div>

                                    {/* Form Fields */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-xs font-bold text-neon-blue uppercase tracking-widest ml-1">Venue Name</label>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Urban Arena"
                                                    className="relative w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none placeholder-slate-600 font-bold transition-all"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-xs font-bold text-neon-blue uppercase tracking-widest ml-1">Location</label>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur" />
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-neon-blue transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Andheri West, Mumbai"
                                                    className="relative w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none placeholder-slate-600 font-bold transition-all"
                                                />
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-xs font-bold text-neon-green uppercase tracking-widest ml-1">Hourly Price (₹)</label>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur" />
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                                                <input
                                                    type="number"
                                                    placeholder="1200"
                                                    className="relative w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none placeholder-slate-600 font-bold transition-all"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-xs font-bold text-neon-green uppercase tracking-widest ml-1">Venue Status</label>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur" />
                                                <select className="relative w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none font-bold appearance-none cursor-pointer">
                                                    <option>Active</option>
                                                    <option>Maintenance</option>
                                                    <option>Closed</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <div className="w-2 h-2 border-r-2 border-b-2 border-white/50 rotate-45 transform -translate-y-1"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-3"
                                    >
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Sports Available</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'].map((sport, i) => (
                                                <label key={sport} className="relative group cursor-pointer inline-block">
                                                    <input type="checkbox" className="peer sr-only" />
                                                    <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-sm font-bold transition-all peer-checked:bg-white peer-checked:text-black peer-checked:border-white peer-checked:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:border-white/30 hover:bg-white/5">
                                                        {sport}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl flex justify-end gap-3 z-20">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button className="relative px-8 py-3 bg-neon-green text-black font-black uppercase tracking-wider rounded-xl overflow-hidden hover:scale-105 transition-transform group">
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative z-10 flex items-center gap-2">Create Venue <Plus className="w-5 h-5" /></span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">VENUES</h1>
                    <p className="text-slate-400">Manage sports venues and facilities.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-neon-green text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Venue
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue, i) => (
                    <motion.div
                        key={venue.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-colors"
                    >
                        <div className="relative h-48">
                            <img src={footballImg} alt={venue.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                                <Star className="w-3 h-3 text-neon-yellow fill-current" />
                                <span className="text-xs font-bold text-white">{venue.rating}</span>
                            </div>
                            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${venue.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                                : 'bg-orange-500/20 text-orange-500 border-orange-500/30'
                                }`}>
                                {venue.status}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white leading-tight">{venue.name}</h3>
                                <button className="text-slate-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                            </div>

                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                <MapPin className="w-4 h-4" />
                                <span>{venue.location}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {venue.sports.map((sport, index) => (
                                    <span key={index} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] uppercase font-bold text-slate-400">
                                        {sport}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Hourly Rate</p>
                                    <p className="flex items-center text-white font-bold">
                                        <IndianRupee className="w-3 h-3 text-neon-green mr-1" />
                                        {venue.price}
                                    </p>
                                </div>
                                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/5 transition-colors">
                                    Edit Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
