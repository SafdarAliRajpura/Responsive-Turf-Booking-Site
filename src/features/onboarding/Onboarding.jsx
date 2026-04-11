import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Zap, ChevronRight, MapPin } from 'lucide-react';
import apiClient from '../../utils/apiClient';

// Local Image Imports
import eliteTurfsImg from '../../assets/images/onboarding/elite-turfs.jpg';
import squadSyncImg from '../../assets/images/onboarding/squad-sync.jpg';
import gameOnImg from '../../assets/images/onboarding/game-on.jpg';

export default function Onboarding({ onComplete }) {
    const [current, setCurrent] = useState(0);
    const [stats, setStats] = useState({
        users: 2400,
        venues: 45,
        tournaments: 12,
        bookingCount: 1500
    });

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
                        bookingCount: data.featuredVenueBookingCount || 1500
                    });
                }
            } catch (err) {
                console.error("Onboarding stats fetch error:", err);
            }
        };
        fetchStats();
    }, []);

    const steps = [
        {
            title: "ELITE TURFS",
            subtitle: "WORLD CLASS FACILITIES",
            desc: `Experience football on ${stats.venues}+ FIFA-quality surfaces. Real-time booking for the ultimate game.`,
            icon: <Trophy className="w-10 h-10 text-yellow-400" />,
            img: eliteTurfsImg,
            color: "neon-green",
            stats: [
                { label: "Active Venues", value: `${stats.venues}+` },
                { label: "Cities", value: "Verified" }
            ]
        },
        {
            title: "SQUAD SYNC",
            subtitle: "BUILD YOUR LEGACY",
            desc: `Join ${stats.users > 1000 ? (stats.users/1000).toFixed(1)+'k' : stats.users}+ players already on the platform. Track stats and challenge rivals.`,
            icon: <Users className="w-10 h-10 text-neon-blue" />,
            img: squadSyncImg,
            color: "neon-blue",
            stats: [
                { label: "Pro Players", value: `${stats.users}+` },
                { label: "Matches", value: "Live" }
            ]
        },
        {
            title: "TOURNAMENTS",
            subtitle: "COMPETE & WIN",
            desc: `Sign up for ${stats.tournaments}+ live tournaments. Zero friction registration and automated bracket management.`,
            icon: <Zap className="w-10 h-10 text-neon-pink" />,
            img: gameOnImg,
            color: "neon-pink",
            stats: [
                { label: "Tournaments", value: stats.tournaments },
                { label: "Prizes", value: "Awaits" }
            ]
        }
    ];

    const nextStep = () => {
        if (current === steps.length - 1) {
            onComplete();
        } else {
            setCurrent(c => c + 1);
        }
    };

    const currentStep = steps[current];

    // Helper for trend colors
    const colorStyles = {
        'neon-green': 'from-neon-green to-green-600 shadow-[0_0_30px_rgba(57,255,20,0.3)]',
        'neon-blue': 'from-neon-blue to-blue-600 shadow-[0_0_30px_rgba(0,255,255,0.3)]',
        'neon-pink': 'from-neon-pink to-purple-600 shadow-[0_0_30px_rgba(255,0,255,0.3)]'
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden text-white font-sans selection:bg-neon-green selection:text-black">

            {/* Dynamic Background Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep.img}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={currentStep.img}
                        className="w-full h-full object-cover opacity-40 brightness-50"
                        alt="background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
                </motion.div>
            </AnimatePresence>

            {/* Main Content Card */}
            <motion.div
                layout
                className="relative z-10 w-full max-w-md px-6 my-auto"
            >
                <div className="relative backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">

                    <div className="relative z-10 flex flex-col h-full">

                        {/* Top Navigation / Progress */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-2">
                                {steps.map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            width: i === current ? 32 : 8,
                                            backgroundColor: i === current ? 
                                                (current === 0 ? '#39ff14' : current === 1 ? '#00f2ff' : '#ff007f') 
                                                : 'rgba(255,255,255,0.2)'
                                        }}
                                        className="h-2 rounded-full"
                                    />
                                ))}
                            </div>
                            <button
                                onClick={onComplete}
                                className="text-white/50 text-sm font-bold tracking-wider hover:text-white transition-colors uppercase"
                            >
                                Skip
                            </button>
                        </div>

                        {/* Content Body */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex-1 flex flex-col"
                            >
                                {/* Icon Badge */}
                                <div className="self-start mb-6 relative">
                                    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
                                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-md group hover:scale-105 transition-transform duration-300`}>
                                        <div className="transform transition-transform group-hover:rotate-12 duration-300">
                                            {currentStep.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="space-y-4 mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/5 border border-white/10 mb-3`}>
                                            {currentStep.subtitle}
                                        </span>
                                        <h1 className="text-4xl font-extrabold text-white leading-[1.1] mb-3">
                                            {currentStep.title.split(' ')[0]} <br />
                                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentStep.color === 'neon-green' ? 'from-neon-green to-emerald-400' : currentStep.color === 'neon-blue' ? 'from-neon-blue to-cyan-400' : 'from-neon-pink to-purple-400'}`}>
                                                {currentStep.title.split(' ').slice(1).join(' ')}
                                            </span>
                                        </h1>
                                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                            {currentStep.desc}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Mini Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {currentStep.stats.map((stat, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm">
                                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{stat.label}</p>
                                            <p className="text-white font-mono text-lg font-bold">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextStep}
                            className={`w-full py-4 rounded-xl bg-gradient-to-r ${colorStyles[currentStep.color]} text-black font-black text-lg tracking-wide uppercase transition-all flex items-center justify-center gap-2 group relative overflow-hidden`}
                        >
                            <span className="relative z-10">{current === steps.length - 1 ? 'Start Playing' : 'Continue'}</span>
                            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />

                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_infinite] w-1/2 blur-md" />
                        </motion.button>

                    </div>
                </div>
            </motion.div>

        </div>
    );
}