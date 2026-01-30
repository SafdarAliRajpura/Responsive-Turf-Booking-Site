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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl"
                        >
                            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-black italic uppercase text-white">Add New Venue</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400 hover:text-white" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Image Upload */}
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-neon-green/50 hover:bg-white/5 transition-all cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-neon-green group-hover:text-black transition-colors">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-white mb-1">Click to upload venue image</p>
                                    <p className="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Urban Arena"
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="e.g. Andheri West, Mumbai"
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hourly Price (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="number"
                                                placeholder="1200"
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                        <select className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 font-medium appearance-none">
                                            <option>Active</option>
                                            <option>Maintenance</option>
                                            <option>Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sports Available</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball'].map((sport) => (
                                            <label key={sport} className="flex items-center gap-2 bg-slate-950 border border-white/10 px-4 py-2 rounded-xl cursor-pointer hover:border-white/30 transition-colors">
                                                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-neon-green focus:ring-0" />
                                                <span className="text-sm font-bold text-slate-300">{sport}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button className="px-8 py-3 bg-neon-green text-black font-black uppercase tracking-wider rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg shadow-neon-green/20">
                                        Create Venue
                                    </button>
                                </div>
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
