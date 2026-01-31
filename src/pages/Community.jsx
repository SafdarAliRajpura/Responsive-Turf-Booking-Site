import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, MessageSquare, Calendar, Trophy,
    Heart, Share2, MessageCircle
} from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import SplitText from '../components/common/SplitText';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';
import userAvatarImg from '../assets/images/common/user-avatar.jpg';

// Mock Data
const discussions = [
    {
        id: 1,
        author: "Alex Striker",
        avatar: userAvatarImg,
        title: "Best strategy for 5v5 turf football?",
        category: "Strategy",
        likes: 124,
        comments: 45,
        time: "2h ago"
    },
    {
        id: 2,
        author: "Sarah Goalie",
        avatar: userAvatarImg,
        title: "Looking for a goalkeeper for this weekend's tournament!",
        category: "Team Up",
        likes: 89,
        comments: 23,
        time: "5h ago"
    },
    {
        id: 3,
        author: "Mike Coach",
        avatar: userAvatarImg,
        title: "Review: The new turf at Andheri West is amazing",
        category: "Reviews",
        likes: 256,
        comments: 12,
        time: "1d ago"
    }
];

const events = [
    {
        id: 1,
        title: "Sunday Morning Football Meetup",
        date: "Aug 25, 7:00 AM",
        location: "Mumbai Football Arena",
        attendees: 18,
        maxAttendees: 20
    },
    {
        id: 2,
        title: "Cricket Nets Practice Session",
        date: "Aug 26, 6:00 PM",
        location: "Bengaluru Sports Hub",
        attendees: 5,
        maxAttendees: 8
    }
];

export default function Community() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                {/* Hero Section */}
                {/* Hero Section */}
                {/* Hero Section */}
                <div className="relative mb-24 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Background Blob */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                    {/* Left Column: Content */}
                    <div className="relative z-10 flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 mb-8 backdrop-blur-md shadow-lg shadow-neon-blue/10"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Community Live Hub</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black italic uppercase mb-6 tracking-tighter leading-tight"
                        >
                            <span className="block mb-2 drop-shadow-2xl"><SplitText>Connect.</SplitText></span>
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-violet-500 to-purple-500 inline-block min-w-[300px] drop-shadow-[0_0_30px_rgba(100,100,255,0.4)]">
                                <TypeAnimation
                                    sequence={[
                                        'Compete.',
                                        2000,
                                        'Collaborate.',
                                        2000,
                                        'Challenge.',
                                        2000
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    cursor={false}
                                />
                            </div>
                            <span className="block mt-2 drop-shadow-2xl"><SplitText>Conquer.</SplitText></span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                            className="text-slate-400 max-w-xl text-xl mb-10 leading-relaxed font-light"
                        >
                            Join the ultimate sports ecosystem. Find reliable teammates, discuss pro strategies, and participate in exclusive city-wide events.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                            className="flex items-center gap-6"
                        >
                            <button className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-2xl hover:bg-neon-blue hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-neon-blue/40 hover:-translate-y-1">
                                Start Discussion
                            </button>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden relative">
                                        <img src={userAvatarImg} alt="User" className="w-full h-full object-cover opacity-80" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold text-white z-10">
                                    2k+
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Community Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="relative hidden lg:flex items-center justify-center min-h-[500px]"
                    >
                        {/* Tactical Squad Visual Container */}
                        <div className="relative w-full max-w-sm mx-auto">
                            {/* Abstract Ambient Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] opacity-20 pointer-events-none" />

                            {/* Main Glass Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[30px] p-8 shadow-2xl overflow-hidden group hover:border-white/20 transition-colors"
                            >
                                {/* Subtle Noise Texture */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                {/* Header Section */}
                                <div className="mb-8 relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
                                        </span>
                                        <span className="text-xs font-bold text-neon-green uppercase tracking-wider">Live Pulse</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tight">
                                        1,204
                                    </h2>
                                    <p className="text-sm text-slate-400 font-medium mt-1">Active Ballers Online</p>
                                </div>

                                {/* Activity Feed List */}
                                <div className="space-y-6 relative z-10">
                                    {[
                                        { icon: Trophy, color: "text-neon-yellow", title: "City League Final", subtitle: "Match starting in 5m" },
                                        { icon: Users, color: "text-neon-blue", title: "Thunder FC", subtitle: "Recruiting 2 players" },
                                        { icon: MessageCircle, color: "text-neon-pink", title: "Hot Discussion", subtitle: "Best turf boots 2024?" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group/item">
                                            <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-white/20 transition-colors ${item.color}`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white leading-none mb-1 group-hover/item:text-neon-blue transition-colors">{item.title}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{item.subtitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Action */}
                                <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-xs font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                                        Join The Action <Share2 className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Decorative Gradient Overlay */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] pointer-events-none opacity-50" />
                            </motion.div>
                        </div>                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Column: Discussions */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-neon-blue" /> Trending Discussions
                            </h2>
                            <button className="text-sm text-neon-blue font-bold hover:text-white transition-colors">View All</button>
                        </div>

                        {discussions.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 + (i * 0.15) }}
                                className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-white/10" />
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight group-hover:text-neon-blue transition-colors">{post.title}</h3>
                                            <p className="text-xs text-slate-500 mt-1">Posted by <span className="text-white">{post.author}</span> • {post.time}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/5">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 text-slate-400 text-sm">
                                    <button className="flex items-center gap-2 hover:text-neon-pink transition-colors">
                                        <Heart className="w-4 h-4" /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-neon-blue transition-colors">
                                        <MessageCircle className="w-4 h-4" /> {post.comments}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Upcoming Events */}
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-neon-green" /> Upcoming Events
                            </h3>
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-neon-green/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="bg-slate-950 px-2 py-1 rounded text-xs font-bold text-neon-green border border-neon-green/20">
                                                {event.date}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-white mb-1">{event.title}</h4>
                                        <p className="text-xs text-slate-400 mb-3">{event.location}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">
                                                {event.attendees}/{event.maxAttendees} Joined
                                            </span>
                                            <button className="text-xs font-bold text-black bg-white px-3 py-1.5 rounded-lg hover:bg-neon-green transition-colors">
                                                Join
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Teaser */}
                        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-neon-purple/20 blur-2xl rounded-full" />
                            <Trophy className="w-12 h-12 text-neon-yellow mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]" />
                            <h3 className="text-xl font-bold text-white mb-2">Weekly Leaderboard</h3>
                            <p className="text-sm text-slate-300 mb-6">Compete with the best and earn exclusive rewards!</p>
                            <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded-xl hover:bg-neon-yellow hover:shadow-[0_0_20px_rgba(255,255,0,0.3)] transition-all">
                                View Rankings
                            </button>
                        </div>

                    </div>
                </div>

            </main >
            <Footer />
        </div >
    );
}
