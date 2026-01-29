import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search, MapPin, Star, Filter, ArrowRight, IndianRupee
} from 'lucide-react';

// Images
import footballImg from '../assets/images/home/night-football.jpg';
import cricketImg from '../assets/images/home/cricket.jpg';
import badmintonImg from '../assets/images/home/badminton.jpg';
import footballNight from '../assets/images/home/football-night-new.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';

import Footer from '../components/common/Footer';

import Header from '../components/common/Header';

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

const VenueCard = ({ venue, index, onBook }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-neon-green/30 transition-all duration-300"
    >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
            <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                <Star className="w-3 h-3 text-neon-yellow fill-current" />
                <span className="text-white text-xs font-bold">{venue.rating}</span>
            </div>
            <div className="absolute bottom-4 left-4 z-20">
                <div className="flex gap-2">
                    {venue.sports.map((sport, i) => (
                        <span key={i} className="px-2 py-1 bg-neon-blue/20 border border-neon-blue/30 text-neon-blue text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {sport}
                        </span>
                    ))}
                </div>
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
                {venue.amenities.map((amenity, i) => (
                    <span key={i} className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        {amenity}
                    </span>
                ))}
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Per Hour</span>
                    <div className="flex items-center text-white font-bold text-lg">
                        <IndianRupee className="w-4 h-4 text-neon-green" />
                        {venue.price}
                    </div>
                </div>
                <button
                    onClick={() => onBook(venue.id)}
                    className="px-4 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-neon-green transition-colors flex items-center gap-2 group/btn"
                >
                    Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </motion.div>
);

export default function Venue() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const venues = [
        {
            id: 1,
            name: "Mumbai Football Arena",
            sports: ["Football"],
            image: footballNight,
            rating: 4.9,
            location: "Andheri West, Mumbai",
            price: "1200",
            amenities: ["5v5", "Floodlights", "Showers", "Parking"]
        },
        {
            id: 2,
            name: "Bengaluru Sports Hub",
            sports: ["Cricket", "Football", "Badminton"],
            image: cricketImg,
            rating: 4.7,
            location: "Koramangala, Bengaluru",
            price: "800",
            amenities: ["Net Practice", "Bowling Machine", "Video Analysis"]
        },
        {
            id: 3,
            name: "Smash Badminton Club",
            sports: ["Badminton"],
            image: badmintonImg,
            rating: 4.8,
            location: "Vasant Kunj, Delhi",
            price: "600",
            amenities: ["Wooden Court", "AC", "Equipment Rental"]
        },
        {
            id: 4,
            name: "Marina Turf Grounds",
            sports: ["Football", "Cricket"],
            image: footballImg,
            rating: 4.6,
            location: "Marina Beach, Chennai",
            price: "1000",
            amenities: ["7v7", "Turf", "Changing Rooms"]
        },
        {
            id: 5,
            name: "Salt Lake Stadium Practice",
            sports: ["Football"],
            image: footballNight,
            rating: 4.9,
            location: "Salt Lake, Kolkata",
            price: "1500",
            amenities: ["5v5", "Night Vision", "Cafe", "Pro Shop"]
        }
    ];

    const filteredVenues = selectedCategory === 'All'
        ? venues
        : venues.filter(v => v.sports.includes(selectedCategory));

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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black italic uppercase mb-6"
                        >
                            Find Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500">Perfect Pitch</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-2xl opacity-30 group-hover:opacity-100 transition duration-500 blur" />
                            <div className="relative flex items-center bg-slate-900 rounded-2xl p-2 border border-white/10">
                                <Search className="w-5 h-5 text-slate-400 ml-3" />
                                <input
                                    type="text"
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
                        transition={{ delay: 0.2 }}
                        className="flex gap-2"
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVenues.map((venue, index) => (
                        <VenueCard
                            key={venue.id}
                            venue={venue}
                            index={index}
                            onBook={(id) => navigate(`/book/${id}`)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredVenues.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No venues found matching your criteria.</p>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}
