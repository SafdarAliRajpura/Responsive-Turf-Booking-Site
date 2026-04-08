import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import SplitText from '../components/common/SplitText';
import {
    Trophy, Users, Search,
    MapPin, Star, ArrowRight,
    Shield, Smartphone, Globe, Activity
} from 'lucide-react';

// Local Image Imports
import heroBgImg from '../assets/images/home/hero-bg.jpg';
import footballImg from '../assets/images/home/night-football.jpg';
import cricketImg from '../assets/images/home/cricket.jpg';
import badmintonImg from '../assets/images/home/badminton.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';
import cubesPattern from '../assets/images/common/cubes.png';
import avatar1 from '../assets/images/common/avatar-1.jpg';
import avatar2 from '../assets/images/common/avatar-2.jpg';
import avatar3 from '../assets/images/common/avatar-3.jpg';

import Footer from '../components/common/Footer';

import Header from '../components/common/Header';
import apiClient from '../utils/apiClient';

const avatars = [avatar1, avatar2, avatar3];

const colorVariants = {
    'neon-yellow': 'text-neon-yellow bg-neon-yellow/10',
    'neon-pink': 'text-neon-pink bg-neon-pink/10',
    'neon-blue': 'text-neon-blue bg-neon-blue/10',
    'neon-green': 'text-neon-green bg-neon-green/10',
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4"
    >
        <div className={`p-3 rounded-xl ${colorVariants[color] || colorVariants['neon-green']}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);



const FeatureCard = ({ title, desc, image, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
    >
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500" />
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="w-12 h-1 bg-neon-green mb-4 transform origin-left transition-transform duration-300 group-hover:scale-x-150" />
            <h3 className="text-3xl font-black text-white mb-2 uppercase italic">{title}</h3>
            <p className="text-slate-300 line-clamp-2 mb-6 group-hover:text-white transition-colors">{desc}</p>

            <button className="flex items-center gap-2 text-neon-green font-bold tracking-wide uppercase text-sm group-hover:translate-x-2 transition-transform">
                Explore Now <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </motion.div>
);

export default function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 2400,
        venues: 45,
        tournaments: 12,
        featuredVenue: {
            name: "Urban Arena",
            location: "Mumbai, MH",
            rating: 4.9
        }
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/analytics/platform-stats');
                if (res.data?.success) {
                    const data = res.data.data;
                    setStats({
                        users: data.users || 2400,
                        venues: data.venues || 45,
                        tournaments: data.tournaments || 12,
                        featuredVenue: data.featuredVenue || { name: "Urban Arena", location: "Mumbai, MH", rating: 4.9 }
                    });
                }
            } catch (err) {
                console.error("Stats fetching error:", err);
            }
        };
        fetchStats();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/venues?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon-green text-xs font-bold tracking-widest uppercase mb-6">
                                The Future of Sports
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6">
                                GAME <br />
                                <span className="inline-block min-w-[9ch] text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-600">
                                    <TypeAnimation
                                        sequence={[
                                            'ON.',
                                            2000,
                                            'READY.',
                                            2000,
                                            'STARTED.',
                                            2000,
                                            'LIVE.',
                                            2000
                                        ]}
                                        wrapper="span"
                                        speed={50}
                                        repeat={Infinity}
                                        cursor={false}
                                    />
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                                Book premium turfs, join tournaments, and track your stats.
                                Experience sports like never before with TurfX.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                            className="flex flex-wrap gap-4"
                        >
                            <form onSubmit={handleSearch} className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl p-2 flex items-center max-w-sm focus-within:border-neon-green/50 transition-colors">
                                <MapPin className="w-5 h-5 text-slate-500 ml-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Find a turf near you..."
                                    className="bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 w-full px-4 py-2 font-medium"
                                />
                                <button type="submit" className="bg-neon-green text-black p-3 rounded-xl hover:bg-white transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4"
                        >
                            <StatCard icon={Trophy} label="Tournaments" value={`${stats.tournaments} Live`} color="neon-yellow" />
                            <StatCard icon={MapPin} label="Venues" value={`${stats.venues}+`} color="neon-pink" />
                            <StatCard icon={Users} label="Players" value={stats.users > 1000 ? `${(stats.users/1000).toFixed(1)}k` : stats.users} color="neon-blue" />
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 relative group">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-slate-900/50 shadow-2xl shadow-neon-blue/20"
                        >
                            <img
                                src={
                                    stats.featuredVenue.image 
                                        ? (stats.featuredVenue.image.startsWith('data:') || stats.featuredVenue.image.startsWith('http') 
                                            ? stats.featuredVenue.image 
                                            : `http://localhost:5000${stats.featuredVenue.image.startsWith('/') ? '' : '/'}${stats.featuredVenue.image}`)
                                        : heroBgImg
                                }
                                alt={stats.featuredVenue.name}
                                className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110"
                                onError={(e) => { e.target.onerror = null; e.target.src = heroBgImg; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                            <div className="absolute top-8 left-8">
                                <span className="px-4 py-2 bg-neon-yellow text-black font-black uppercase text-[10px] tracking-widest rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center gap-2">
                                    <Star className="w-3 h-3 fill-current" /> Highest Rated Arena
                                </span>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 bg-slate-950/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl group-hover:border-neon-blue/40 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-white font-black text-3xl italic uppercase leading-none mb-1 tracking-tighter">
                                            {stats.featuredVenue.name}
                                        </h4>
                                        <p className="text-neon-blue text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> {stats.featuredVenue.location}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-neon-yellow flex items-center gap-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                                            <Star className="w-6 h-6 fill-current" />
                                            <span className="text-3xl font-black italic">{stats.featuredVenue.rating || '5.0'}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Elite Score</span>
                                    </div>
                                </div>
                                
                                <div className="h-px w-full bg-white/10 mb-6" />

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Popular with Pros</span>
                                        <div className="flex -space-x-3">
                                            {[avatar1, avatar2, avatar3].map((av, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden ring-2 ring-neon-blue/20">
                                                    <img src={av} alt="p" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-900 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-neon-blue/20">
                                                +25
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/venues')} 
                                        className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-neon-green hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all transform active:scale-95"
                                    >
                                        Book Elite Turf
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Elements around Image */}
                        <div className="absolute top-10 -right-10 w-24 h-24 bg-neon-pink rounded-2xl rotate-12 blur-2xl opacity-40 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-blue rounded-full blur-3xl opacity-40" />
                    </div>
                </div>

                {/* Categories / Grid */}
                <div className="mb-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            {/* <h2 className="text-4xl font-black text-white mb-2">WHAT'S YOUR <span className="text-neon-blue">GAME?</span></h2> */}
                            <div className="flex items-center gap-2 text-4xl font-black text-white mb-2">
                                <SplitText>WHAT'S YOUR</SplitText>
                                <span className="text-neon-blue inline-flex"><SplitText>GAME?</SplitText></span>
                            </div>
                            <p className="text-slate-400">Explore premium facilities curated for pros.</p>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-white hover:text-neon-green transition-colors font-bold uppercase tracking-wide text-sm border-b border-transparent hover:border-neon-green pb-1">
                            View All Categories <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            title="Night Football"
                            desc="FIFA-grade floodlights and premium grass for the ultimate night games."
                            image={footballImg}
                            delay={0.2}
                        />
                        <FeatureCard
                            title="Cricket Nets"
                            desc="Pro-level bowling machines and pitch analysis for serious practice."
                            image={cricketImg}
                            delay={0.4}
                        />
                        <FeatureCard
                            title="Badminton"
                            desc="Indoor wooden courts with shock absorption and climate control."
                            image={badmintonImg}
                            delay={0.6}
                        />
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <span className="text-neon-pink font-bold tracking-widest uppercase text-xs mb-4 block">The TurfX Advantage</span>
                        {/* <h2 className="text-4xl md:text-5xl font-black text-white mb-6">WHY <span className="text-neon-green">CHOOSE US?</span></h2> */}
                        <div className="flex justify-center flex-wrap gap-3 text-4xl md:text-5xl font-black text-white mb-6">
                            <SplitText>WHY</SplitText>
                            <span className="text-neon-green inline-flex"><SplitText>CHOOSE US?</SplitText></span>
                        </div>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">We're not just a booking platform. We're your ecosystem for sports excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                icon: Smartphone,
                                title: "Instant Access",
                                desc: "Book your favorite turf in seconds with our lightning-fast interface.",
                                bgClass: "bg-neon-blue/10",
                                textClass: "text-neon-blue"
                            },
                            {
                                icon: Shield,
                                title: "Pro Standards",
                                desc: "Every venue is verified for quality, safety, and amenities.",
                                bgClass: "bg-neon-green/10",
                                textClass: "text-neon-green"
                            },
                            {
                                icon: Activity,
                                title: "Live Analytics",
                                desc: "Track your matches, wins, and performance stats over time.",
                                bgClass: "bg-neon-pink/10",
                                textClass: "text-neon-pink"
                            },
                            {
                                icon: Globe,
                                title: "Community",
                                desc: "Find teams, challenge rivals, and climb the city-wide leaderboards.",
                                bgClass: "bg-neon-yellow/10",
                                textClass: "text-neon-yellow"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    opacity: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
                                    y: { delay: i * 0.15, duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }
                                }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="bg-slate-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:bg-slate-900/60 hover:border-white/10 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`w-7 h-7 ${item.textClass}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Banne */}
                <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10 px-6 py-20 text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20" />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${cubesPattern})` }} />

                    <motion.div
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10 max-w-2xl mx-auto"
                    >
                        {/* <h2 className="text-5xl font-black text-white mb-6">READY TO <span className="text-neon-green">DOMINATE?</span></h2> */}
                        <div className="flex justify-center flex-wrap gap-3 text-5xl font-black text-white mb-6">
                            <SplitText>READY TO</SplitText>
                            <span className="text-neon-green inline-flex"><SplitText>DOMINATE?</SplitText></span>
                        </div>
                        <p className="text-slate-300 text-lg mb-8">Join thousands of players booking the best turfs in the city. Don't just watch the game, be the game.</p>
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => navigate('/venues')} className="px-8 py-4 bg-neon-green text-black font-black uppercase tracking-wider rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                                Start Booking
                            </button>
                            <button className="px-8 py-4 bg-slate-800 text-white font-bold uppercase tracking-wider rounded-2xl hover:bg-slate-700 transition-all border border-white/10">
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
