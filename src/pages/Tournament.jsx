import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Trophy, Calendar, MapPin, Users, ArrowRight,
    Search, Filter, Star, Clock, IndianRupee, Crown,
    Target, Flame, Shield, ChevronRight
} from 'lucide-react';

// Reusing existing images for visual consistency
import footballNight from '../assets/images/home/football-night-new.jpg';
import cricketImg from '../assets/images/home/cricket.jpg';
import footballImg from '../assets/images/home/night-football.jpg';
import badmintonImg from '../assets/images/home/badminton.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const TournamentCard = ({ tournament, index, onRegister }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-neon-green/30 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_30px_rgba(57,255,20,0.1)]"
    >
        {/* Image & Status Overlay */}
        <div className="relative h-56 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors z-10" />

            {/* Status Badge */}
            <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-lg border backdrop-blur-md flex items-center gap-2 shadow-lg ${tournament.status === 'Open' ? 'bg-neon-green/20 border-neon-green/50 text-neon-green' :
                tournament.status === 'Filling Fast' ? 'bg-neon-yellow/20 border-neon-yellow/50 text-neon-yellow' :
                    'bg-slate-800/80 border-white/10 text-slate-400'
                }`}>
                <span className={`w-2 h-2 rounded-full ${tournament.status === 'Open' ? 'bg-neon-green animate-pulse' :
                    tournament.status === 'Filling Fast' ? 'bg-neon-yellow animate-bounce' :
                        'bg-slate-500'
                    }`} />
                <span className="text-xs font-black uppercase tracking-wider">{tournament.status}</span>
            </div>

            <img
                src={tournament.image}
                alt={tournament.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />

            {/* Category Tag */}
            <div className="absolute bottom-4 left-4 z-20">
                <span className="px-3 py-1 bg-neon-blue/20 backdrop-blur-md border border-neon-blue/30 text-neon-blue text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg flex items-center gap-1">
                    {tournament.category === 'Football' && <Target className="w-3 h-3" />}
                    {tournament.category === 'Cricket' && <Crown className="w-3 h-3" />}
                    {tournament.category}
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative">
            {/* Prize Pool Highlight */}
            <div className="absolute -top-6 right-6 z-20">
                <div className="bg-slate-950 border border-white/10 p-3 rounded-2xl shadow-xl flex flex-col items-center min-w-[100px] group-hover:-translate-y-2 transition-transform duration-300">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Prize Pool</span>
                    <div className="flex items-center text-neon-yellow font-black text-xl">
                        <IndianRupee className="w-4 h-4" />
                        {tournament.prizePool}
                    </div>
                </div>
            </div>

            <div className="mb-6 mt-2 pr-28">
                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neon-green transition-all">
                    {tournament.name}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neon-blue" />
                        <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neon-pink" />
                        <span>{tournament.location}</span>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Format</span>
                    <span className="text-white font-bold text-sm">{tournament.format}</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Entry Fee</span>
                    <span className="text-white font-bold text-sm flex items-center">
                        <IndianRupee className="w-3 h-3 text-slate-400 mr-0.5" />
                        {tournament.entryFee}
                    </span>
                </div>
            </div>

            <div className="mt-auto">
                <button
                    onClick={() => onRegister(tournament.id)}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-neon-green transition-all shadow-lg hover:shadow-neon-green/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                >
                    Register Team <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-slate-500 text-xs mt-3">
                    {tournament.slotsLeft} spots remaining
                </p>
            </div>
        </div>
    </motion.div>
);

const FilterButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all border flex items-center gap-2 ${active
            ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)] transform scale-105'
            : 'bg-slate-900/50 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800 focus:outline-none'
            }`}
    >
        {label === 'Live' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
        {label}
    </button>
);

export default function Tournament() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const tournaments = [
        {
            id: 1,
            name: "Mumbai Corporate Cup 2024",
            category: "Football",
            image: footballNight,
            status: "Filling Fast",
            date: "Aug 15 - Aug 20, 2024",
            location: "Mumbai Football Arena, Andheri",
            prizePool: "50,000",
            entryFee: "4,000",
            format: "5v5 Knockout",
            slotsLeft: 4
        },
        {
            id: 2,
            name: "Pro Cricket League Season 4",
            category: "Cricket",
            image: cricketImg,
            status: "Open",
            date: "Sept 01 - Sept 10, 2024",
            location: "Bengaluru Cricket Nets, Koramangala",
            prizePool: "1,00,000",
            entryFee: "8,000",
            format: "Box Cricket",
            slotsLeft: 12
        },
        {
            id: 3,
            name: "Late Night 5s Sunder League",
            category: "Football",
            image: footballImg,
            status: "Open",
            date: "Every Saturday",
            location: "Urban Arena, Mumbai",
            prizePool: "25,000",
            entryFee: "2,500",
            format: "League Stage",
            slotsLeft: 8
        },
        {
            id: 4,
            name: "Monsoon Football Blast",
            category: "Football",
            image: footballImg,
            status: "Waitlist",
            date: "July 20, 2024",
            location: "Salt Lake Stadium Practice, Kolkata",
            prizePool: "30,000",
            entryFee: "3,000",
            format: "7v7 Knockout",
            slotsLeft: 0
        },
        {
            id: 5,
            name: "Gully Cricket Championship",
            category: "Cricket",
            image: cricketImg,
            status: "Open",
            date: "Oct 02 - Oct 05, 2024",
            location: "Shivaji Park, Mumbai",
            prizePool: "20,000",
            entryFee: "1,500",
            format: "Tennis Ball",
            slotsLeft: 16
        },
        {
            id: 6,
            name: "Smash Masters 2024",
            category: "Badminton",
            image: badmintonImg,
            status: "Filling Fast",
            date: "Nov 10 - Nov 12, 2024",
            location: "Smash Court, Delhi",
            prizePool: "40,000",
            entryFee: "2,000",
            format: "Doubles",
            slotsLeft: 6
        },
        {
            id: 7,
            name: "Corporate Cricket Bash",
            category: "Cricket",
            image: cricketImg,
            status: "Open",
            date: "Dec 05 - Dec 10, 2024",
            location: "Oval Maidan, Mumbai",
            prizePool: "1,50,000",
            entryFee: "10,000",
            format: "Leather Ball",
            slotsLeft: 8
        }
    ];

    const filteredTournaments = selectedCategory === 'All'
        ? tournaments
        : tournaments.filter(t => t.category === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden flex flex-col">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/2 w-[1000px] h-[1000px] bg-neon-blue/5 rounded-full blur-[150px] animate-pulse-slow my-auto" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-neon-pink/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full">

                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-20">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="p-2 bg-neon-yellow/10 rounded-lg border border-neon-yellow/20 text-neon-yellow animate-pulse">
                                <Trophy className="w-6 h-6" />
                            </span>
                            <span className="text-neon-yellow font-bold tracking-[0.2em] uppercase text-sm">Compete & Conquer</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black italic uppercase leading-[0.9] mb-8 tracking-tighter"
                        >
                            GLORY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow via-orange-500 to-red-600 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]">AWAITS.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-xl max-w-lg leading-relaxed mb-10 border-l-4 border-neon-yellow/30 pl-6"
                        >
                            Join the city's fiercest tournaments. Prove your skills, climb the leaderboard, and take home the grand prize.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-8 items-center"
                        >
                            <div>
                                <p className="text-4xl font-black text-white flex items-baseline">
                                    15L<span className="text-lg text-neon-green ml-1">+</span>
                                </p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Prizes Won</p>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div>
                                <p className="text-4xl font-black text-white flex items-baseline">
                                    120<span className="text-lg text-neon-blue ml-1">+</span>
                                </p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active Teams</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Hero Card Feature */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: -2 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        {/* Decorative Blob Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-neon-yellow/20 to-neon-orange/20 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10 bg-slate-900 border border-white/10 rounded-[2.5rem] p-4 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 group">
                            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3]">
                                <img src={footballNight} alt="Featured" className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-white font-bold text-xs uppercase tracking-wider">Live Now</span>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-neon-yellow font-bold uppercase tracking-widest text-xs mb-2">Featured Event</p>
                                    <h3 className="text-3xl font-black text-white italic uppercase leading-none mb-2">Summer Cup '24</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-300">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Mumbai</span>
                                        <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> 50K Prize</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="relative group w-full md:w-96">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-yellow to-neon-pink rounded-2xl opacity-30 group-hover:opacity-100 transition duration-500 blur" />
                        <div className="relative flex items-center bg-slate-900 rounded-2xl p-2 border border-white/10 shadow-xl">
                            <Search className="w-5 h-5 text-slate-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="bg-transparent border-none text-white placeholder-slate-500 focus:outline-none focus:ring-0 w-full px-4 py-3 font-medium text-lg"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {['All', 'Football', 'Cricket', 'Badminton'].map((cat) => (
                            <FilterButton
                                key={cat}
                                label={cat}
                                active={selectedCategory === cat}
                                onClick={() => setSelectedCategory(cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filteredTournaments.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament.id}
                                tournament={tournament}
                                index={index}
                                onRegister={(id) => navigate(`/book/${id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-3xl bg-slate-900/20">
                        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-slate-300 mb-2">No Tournaments found</h3>
                        <p>Check back later for new events.</p>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
