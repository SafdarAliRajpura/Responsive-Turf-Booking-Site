import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, IndianRupee, Ban, CheckCircle, X, ChevronDown, Filter as FilterIcon } from 'lucide-react';
import footballImg from '../../../assets/images/home/night-football.jpg';

import Toast from '../../../components/ui/Toast';

export default function Venues() {
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                                        <p className={`font-black uppercase italic tracking-tighter ${selectedVenue.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>{selectedVenue.status === 'Active' ? 'Operational' : 'Suspended'}</p>
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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">NETWORK <span className="text-neon-blue">VENUES</span></h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Oversee registered facilities and enforce platform standards.</p>
                </div>
            </div>

            {/* Venue Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Listings', val: venues.length, color: 'text-white' },
                    { label: 'Operational', val: venues.filter(v=>v.status==='Active').length, color: 'text-emerald-500' },
                    { label: 'Suspended', val: venues.filter(v=>v.status==='Banned').length, color: 'text-red-500' },
                    { label: 'High Rating', val: venues.filter(v=>v.rating >= 4.5).length, color: 'text-neon-yellow drop-shadow-[0_0_10px_rgba(255,255,0,0.3)]' }
                ].map((s,i)=>(
                    <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-5 rounded-[2rem] hover:bg-white/5 transition-all">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5">{s.label}</p>
                        <h4 className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</h4>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <input 
                        type="text" 
                        placeholder="Search venues by name or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white text-xs font-bold focus:border-neon-blue/30 focus:outline-none transition-all"
                    />
                    <MapPin className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-black uppercase tracking-widest flex items-center justify-between hover:border-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <FilterIcon className="w-4 h-4 text-slate-500 group-hover:text-neon-blue transition-colors" />
                            <span>{selectedSport === 'All' ? 'All Categories' : selectedSport}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                            >
                                {['All', 'Football', 'Cricket', 'Tennis', 'Badminton'].map((sport) => (
                                    <button
                                        key={sport}
                                        onClick={() => {
                                            setSelectedSport(sport);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-between ${selectedSport === sport ? 'text-neon-blue bg-neon-blue/5' : 'text-slate-400'}`}
                                    >
                                        {sport === 'All' ? 'All Categories' : sport}
                                        {selectedSport === sport && <div className="w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_10px_#00f3ff]" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues
                    .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase()))
                    .filter(v => selectedSport === 'All' || v.sports.some(s => s.toLowerCase() === selectedSport.toLowerCase()))
                    .map((venue, i) => (
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
                                : 'bg-red-500/20 text-red-500 border-red-500/30'
                                }`}>
                                {venue.status === 'Active' ? 'Operational' : 'Suspended'}
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
                                        className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20 transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-3 h-3" /> Restore facility
                                    </button>
                                ) : (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(venue.id, 'Banned'); }}
                                        className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500/20 transition-all flex items-center gap-2"
                                    >
                                        <Ban className="w-3 h-3" /> Suspend Facility
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
