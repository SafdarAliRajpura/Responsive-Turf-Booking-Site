import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, IndianRupee, Ban, CheckCircle, X } from 'lucide-react';
import footballImg from '../../../assets/images/home/night-football.jpg';

import Toast from '../../../components/ui/Toast';

export default function Venues() {
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue] = useState(null);

    const fetchVenues = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/venues', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                // Formatting for display
                const mappedVenues = data.data.map((v) => ({
                    id: v._id,
                    name: v.name,
                    sports: v.sports && v.sports.length > 0 ? v.sports : ["Football"],
                    image: (v.images && v.images.length > 0) ? v.images[0] : (v.image || footballImg),
                    images: (v.images && v.images.length > 0) ? v.images : [v.image || footballImg],
                    rating: v.rating || 4.5,
                    location: v.location,
                    price: v.price,
                    status: v.status || "Active",
                    owner: v.owner ? {
                         name: `${v.owner.first_name} ${v.owner.last_name}`,
                         avatar: v.owner.user_profile
                    } : null
                }));
                setVenues(mappedVenues);
            }
        } catch (err) {
            console.error("Error fetching venues:", err);
            setToast({ message: "Failed to load venues", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/venues/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setToast({ message: `Turf is now ${newStatus}`, type: 'success' });
                // Update local list
                setVenues(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
            } else {
                setToast({ message: "Failed to update turf status.", type: 'error' });
            }
        } catch (e) {
            console.error(e);
            setToast({ message: "Server error", type: 'error' });
        }
    };

    return (
        <div className="space-y-6 relative">
            <AnimatePresence>
                {selectedVenue && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setSelectedVenue(null)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            transition={{ duration: 0.5, type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 flex flex-col"
                        >
                            <div className="relative h-64 shrink-0">
                                <img src={selectedVenue.image} alt={selectedVenue.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/50" />
                                <button
                                    onClick={() => setSelectedVenue(null)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/50 hover:bg-red-500/80 text-white flex items-center justify-center transition-all backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h2 className="text-3xl font-black text-white leading-tight mb-2">{selectedVenue.name}</h2>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <MapPin className="w-4 h-4 text-neon-blue" />
                                        <span>{selectedVenue.location}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 overflow-y-auto scrollbar-hide">
                                {/* Extra Images Grid */}
                                {selectedVenue.images && selectedVenue.images.length > 1 && (
                                    <div className="mb-8">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Gallery</p>
                                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
                                            {selectedVenue.images.map((img, idx) => (
                                                <img 
                                                    key={idx} 
                                                    src={img} 
                                                    alt={`${selectedVenue.name} - ${idx}`} 
                                                    className="w-32 h-24 object-cover rounded-xl shrink-0 snap-center border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                        <p className={`font-black ${selectedVenue.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>{selectedVenue.status}</p>
                                    </div>
                                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Hourly Price</p>
                                        <p className="font-black text-white flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4 text-neon-green" /> {selectedVenue.price}
                                        </p>
                                    </div>
                                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Sports</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedVenue.sports.map((s, i) => (
                                                <span key={i} className="text-xs font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded capitalize">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Partner/Owner Info (Requested Aesthetic) */}
                                {selectedVenue.owner && (
                                    <div className="bg-slate-950/80 rounded-3xl p-6 border border-white/5 flex items-center gap-5 group hover:border-neon-blue/30 transition-all duration-500 mt-6">
                                        <div className="w-16 h-16 rounded-2xl border-2 border-white/10 p-0.5 bg-slate-900 group-hover:border-neon-blue/50 transition-colors shrink-0">
                                            <img src={selectedVenue.owner.avatar || 'https://api.dicebear.com/7.x/micah/svg?seed=Safdar'} alt="Partner" className="w-full h-full object-cover rounded-[14px]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{selectedVenue.owner.name}</h4>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Partner</p>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_#00f3ff]" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">VENUES DIRECTORY</h1>
                    <p className="text-slate-400">Monitor and enforce regulations on all partner turfs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue, i) => (
                    <motion.div
                        key={venue.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-colors cursor-pointer"
                        onClick={() => setSelectedVenue(venue)}
                    >
                        <div className="relative h-48">
                            <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
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
                                {venue.status === 'Banned' ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(venue.id, 'Active'); }}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-3 h-3" /> Unban Turf
                                    </button>
                                ) : (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(venue.id, 'Banned'); }}
                                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] transition-colors flex items-center gap-2"
                                    >
                                        <Ban className="w-3 h-3" /> Ban Turf
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
