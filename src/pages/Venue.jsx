import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search, MapPin, Star, Filter, ArrowRight, IndianRupee, 
    ChevronLeft, ChevronRight, Navigation, Car, Wifi, 
    CheckCircle, Coffee
} from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { AnimatePresence } from 'framer-motion';

// Images
import footballImg from '../assets/images/home/night-football.jpg';
import cricketImg from '../assets/images/home/cricket.jpg';
import badmintonImg from '../assets/images/home/badminton.jpg';
import footballNight from '../assets/images/home/football-night-new.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';

import Footer from '../components/common/Footer';

import Header from '../components/common/Header';
import useNavigation from '../hooks/useNavigation';
import apiClient from '../utils/apiClient';

const FilterTag = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all border focus:outline-none ${active
            ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
            : 'bg-slate-900/50 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
            }`}
    >
        {label}
    </button>
);

const amenityMap = {
    'parking': { label: 'Parking', icon: Car },
    'wifi': { label: 'WiFi', icon: Wifi },
    'changing_room': { label: 'Locker', icon: CheckCircle },
    'canteen': { label: 'Cafeteria', icon: Coffee },
    'showers': { label: 'Shower', icon: CheckCircle },
    'first_aid': { label: 'First Aid', icon: CheckCircle },
    'power_backup': { label: 'Power', icon: CheckCircle }
};

const VenueCard = ({ venue, index, onBook }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { startNavigation, isLoading: navLoading, error: navError, notification: navNotification } = useNavigation();
    const hasValidCoords = venue.coordinates && venue.coordinates.lat !== 0 && venue.coordinates.lng !== 0;

    // Provide some fallback images to create a carousel effect if venue only has one image
    const images = venue.images || [
        venue.image,
        footballImg,
        cricketImg
    ];

    // Auto-play carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000 + (index * 1000));
        return () => clearInterval(timer);
    }, [images.length, index]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-neon-green/30 transition-all duration-300"
        >
            {/* Image Carousel Section */}
            <div className="relative h-56 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                
                <AnimatePresence initial={false}>
                    <motion.img
                        key={`venue-img-${currentImageIndex}`}
                        src={images[currentImageIndex]}
                        alt={venue.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Left/Right manual controls */}
                <div className="absolute inset-0 z-30 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length) }}
                        className="p-2 rounded-full bg-black/70 text-white hover:bg-neon-green hover:text-black backdrop-blur-md transition-all shadow-2xl pointer-events-auto"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % images.length) }}
                        className="p-2 rounded-full bg-black/70 text-white hover:bg-neon-green hover:text-black backdrop-blur-md transition-all shadow-2xl pointer-events-auto"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Rating & Distance Overlay */}
                <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-transform">
                        <Star className="w-4 h-4 text-neon-yellow fill-current" />
                        <span className="text-white text-sm font-black tracking-wide">{venue.rating}</span>
                    </div>
                </div>

                <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-neon-blue" />
                        <span className="text-white font-mono text-xs font-bold">{venue.distance || "2.5 km"}</span>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 z-20">
                    <div className="flex gap-2">
                        {venue.sports.map((sport, i) => (
                            <span key={i} className="px-2 py-1 bg-black/40 backdrop-blur border border-neon-blue/30 text-neon-blue text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg shadow-black/50">
                                {sport}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 right-4 z-20 flex gap-1">
                    {images.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-neon-green w-3' : 'bg-white/50'}`} />
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-green transition-colors">{venue.name}</h3>
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <MapPin className="w-3 h-3" />
                            <span>{venue.location}</span>
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {venue.amenities.map((item, i) => {
                        const am = amenityMap[item] || { label: item, icon: CheckCircle };
                        return (
                            <span key={i} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                                <am.icon className="w-3 h-3 text-neon-blue" />
                                {am.label}
                            </span>
                        );
                    })}
                </div>

                {navNotification && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-lg text-neon-blue text-xs font-bold mb-3">
                        <Navigation className="w-3 h-3 shrink-0" />
                        {navNotification}
                    </div>
                )}
                {navError && (
                    <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold mb-3">
                        {navError}
                    </div>
                )}

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                        <div className="flex items-center text-white font-black text-xl">
                            <IndianRupee className="w-4 h-4 text-neon-green" />
                            {venue.price}
                        </div>
                    </div>
                    {hasValidCoords && (
                        <button
                            onClick={(e) => { e.stopPropagation(); startNavigation(venue.coordinates); }}
                            disabled={navLoading}
                            title="Get Directions"
                            className="p-2.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-black transition-all disabled:opacity-50"
                        >
                            {navLoading ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Navigation className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => onBook(venue.id)}
                        className="px-5 py-2.5 bg-white text-black text-xs font-black uppercase rounded-xl hover:bg-neon-green transition-colors flex items-center gap-2 group/btn shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                    >
                        Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function Venue() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('sport') || 'All');
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Sync selectedCategory and searchQuery when URL changes
    useEffect(() => {
        const sportParam = searchParams.get('sport');
        const searchParam = searchParams.get('search');
        if (sportParam) setSelectedCategory(sportParam);
        if (searchParam) setSearchQuery(searchParam);
    }, [searchParams]);

    const fetchVenues = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'All') params.append('sport', selectedCategory);
            if (searchQuery) params.append('search', searchQuery);

            const res = await apiClient.get(`/venues?${params.toString()}`);
            if (res.data.success) {
                const mappedVenues = res.data.data.map((v) => ({
                    id: v._id,
                    name: v.name,
                    sports: v.sports && v.sports.length > 0 ? v.sports : ["Football"],
                    image: (v.images && v.images.length > 0) ? v.images[0] : (v.image || footballNight),
                    images: (v.images && v.images.length > 0) ? v.images : [v.image || footballNight, footballImg, cricketImg],
                    rating: v.rating || 4.5,
                    distance: v.distance || "2.5 km",
                    location: v.location,
                    price: v.price,
                    amenities: v.amenities && v.amenities.length > 0 ? v.amenities : ["parking"],
                    owner: v.owner && typeof v.owner === 'object' ? {
                         name: `${v.owner.first_name || 'Arena'} ${v.owner.last_name || 'Partner'}`,
                         avatar: v.owner.user_profile
                    } : null,
                    coordinates: v.coordinates || { lat: 0, lng: 0 }
                }));
                setVenues(mappedVenues);
            }
        } catch (err) {
            console.error("Error fetching venues:", err);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchVenues();
        }, 300); // Small debounce for search typing
        return () => clearTimeout(timer);
    }, [selectedCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[20%] w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                    <div className="w-full md:w-1/2">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl md:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter mb-8"
                        >
                            Find Your <br />
                            <span className="inline-block min-w-[300px] text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500">
                                <TypeAnimation
                                    sequence={[
                                        'Perfect Pitch',
                                        2000,
                                        'Winning Ground',
                                        2000,
                                        'Home Turf',
                                        2000
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    cursor={false}
                                />
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-2xl opacity-30 group-hover:opacity-100 transition duration-500 blur" />
                            <div className="relative flex items-center bg-slate-900 rounded-2xl p-2 border border-white/10">
                                <Search className="w-5 h-5 text-slate-400 ml-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by location, sport, or venue name..."
                                    className="bg-transparent border-none text-white placeholder-slate-500 focus:outline-none focus:ring-0 w-full px-4 py-2 font-medium"
                                />
                                <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-wrap gap-3"
                    >
                        {['All', 'Football', 'Cricket', 'Badminton'].map((cat) => (
                            <FilterTag
                                key={cat}
                                label={cat}
                                active={selectedCategory === cat}
                                onClick={() => setSelectedCategory(cat)}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Venues Grid */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500">
                        <div className="w-16 h-16 border-4 border-slate-900 border-t-neon-green rounded-full animate-spin mx-auto mb-6" />
                        <p className="tracking-[0.4em] uppercase text-[10px] font-black text-neon-green/60">Locating Premium Arenas...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {venues.map((venue, index) => (
                                <VenueCard
                                    key={venue.id}
                                    venue={venue}
                                    index={index}
                                    onBook={(id) => navigate(`/book/${id}`)}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {venues.length === 0 && (
                            <div className="text-center py-32 rounded-[3rem] bg-slate-900/20 border border-dashed border-white/5">
                                <Search className="w-16 h-16 mx-auto mb-6 text-slate-800" />
                                <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-2">No Arenas Matched</h3>
                                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Global database returned zero matches for this search pattern.</p>
                            </div>
                        )}
                    </>
                )}

            </main>
            <Footer />
        </div>
    );
}
