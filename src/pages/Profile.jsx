import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Star, Shield, MapPin, Calendar, Clock, Edit2, X, Save, User, Camera, Lock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import userAvatarImg from '../assets/images/common/user-avatar.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';

export default function Profile() {
    const [user, setUser] = useState(() => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            user_profile: null
        };
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(user);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = () => {
        setIsSaving(true);
        // Simulate an API call
        setTimeout(() => {
            setUser(editForm);
            localStorage.setItem('user', JSON.stringify(editForm));
            setIsSaving(false);
            setIsEditing(false);
        }, 1000);
    };
    
    const userProfilePic = user.user_profile || userAvatarImg;

    // Gamification & Badges Data
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        winRate: "100%",
        hoursPlayed: 0,
        totalPoints: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bookings');
                const data = await res.json();
                if (data.success) {
                    // For MVP assume all bookings belong to the user
                    const userBookings = data.data.filter(b => b.status === 'Completed' || b.status === 'Confirmed' || b.status === 'Upcoming' || b.status === 'Pending');
                    
                    let totalHours = 0;
                    userBookings.forEach(b => {
                        const match = b.timeSlot.match(/- (\d+)h(?: (\d+)m)?/);
                        if (match) {
                            totalHours += parseInt(match[1] || 0) + (parseInt(match[2] || 0) / 60);
                        }
                    });

                    // Points system: 50 XP per hour played + 10 XP per booking
                    const totalPoints = Math.floor((totalHours * 50) + (userBookings.length * 10));

                    setStats({
                        gamesPlayed: userBookings.length,
                        winRate: "100%", // Mocked until match results system
                        hoursPlayed: totalHours.toFixed(1),
                        totalPoints: totalPoints
                    });

                    // Populate recent activity from real bookings
                    const recent = userBookings.slice(0, 4).map((b, i) => ({
                        id: b._id,
                        turf: b.turfName,
                        date: new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                        result: b.sport, // Display sport instead of win/loss for MVP
                        points: `+${Math.floor(50 + 10)} XP`
                    }));
                    setRecentActivity(recent);
                }
            } catch (err) {
                console.error("Error fetching gamification data", err);
            }
        };
        fetchUserData();
    }, []);

    const badges = [
        {
            id: 1,
            name: "Top Scorer",
            icon: Trophy,
            color: "from-neon-blue to-cyan-500",
            textColor: "text-cyan-400",
            shadow: "shadow-[0_0_20px_rgba(0,243,255,0.3)]",
            desc: "Played 5+ matches",
            unlocked: stats.gamesPlayed >= 5
        },
        {
            id: 2,
            name: "Weekend Warrior",
            icon: Award,
            color: "from-neon-pink to-rose-500",
            textColor: "text-neon-pink",
            shadow: "shadow-[0_0_20px_rgba(255,0,255,0.3)]",
            desc: "Played 10+ matches",
            unlocked: stats.gamesPlayed >= 10
        },
        {
            id: 3,
            name: "Pro Athlete",
            icon: Star,
            color: "from-neon-yellow to-orange-500",
            textColor: "text-orange-400",
            shadow: "shadow-[0_0_20px_rgba(255,255,0,0.3)]",
            desc: "Earned 500+ XP",
            unlocked: stats.totalPoints >= 500
        },
        {
            id: 4,
            name: "Iron Lungs",
            icon: Shield,
            color: "from-neon-green to-emerald-500",
            textColor: "text-neon-green",
            shadow: "shadow-[0_0_20px_rgba(57,255,20,0.3)]",
            desc: "Booked 5+ hours",
            unlocked: parseFloat(stats.hoursPlayed) >= 5
        }
    ];

    const getPlayerRank = () => {
        if (stats.totalPoints >= 1000) return { title: 'DIAMOND', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/50' };
        if (stats.totalPoints >= 500) return { title: 'PLATINUM', color: 'text-neon-purple', bg: 'bg-neon-purple/10 border-neon-purple/50' };
        if (stats.totalPoints >= 100) return { title: 'GOLD', color: 'text-neon-yellow', bg: 'bg-neon-yellow/10 border-neon-yellow/50' };
        return { title: 'BRONZE', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/50' };
    };
    const playerRank = getPlayerRank();

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-neon-green selection:text-black">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-neon-blue/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Profile Header section */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 lg:p-12 mb-12 shadow-xl shadow-black/50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Avatar */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative group"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-neon-green via-neon-blue to-neon-purple p-1 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                                <div className="w-full h-full bg-slate-950 rounded-full overflow-hidden border-4 border-slate-900">
                                    <img src={userProfilePic} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <button 
                                onClick={() => { setEditForm(user); setIsEditing(true); }}
                                className="absolute bottom-2 right-2 p-2 bg-neon-green text-black rounded-full shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:scale-110 transition-transform"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </motion.div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <motion.h1 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight flex items-center justify-center md:justify-start gap-4"
                            >
                                <span>{user.first_name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">{user.last_name || ''}</span></span>
                                <span className={`text-xs px-3 py-1 rounded-full border ${playerRank.bg} ${playerRank.color} font-bold tracking-widest translate-y-[-4px]`}>
                                    {playerRank.title} RANK
                                </span>
                            </motion.h1>
                            <p className="text-slate-400 font-medium mb-6">{user.email}</p>

                            {/* Stat Blocks */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
                                <div className="text-center md:text-left">
                                    <h4 className="text-3xl font-black text-white">{stats.gamesPlayed}</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Matches</p>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="text-center md:text-left">
                                    <h4 className="text-3xl font-black text-neon-green">{stats.winRate}</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Win Rate</p>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="text-center md:text-left">
                                    <h4 className="text-3xl font-black text-white">{stats.hoursPlayed}h</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hours Played</p>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="text-center md:text-left">
                                    <h4 className="text-3xl font-black text-neon-yellow">{stats.totalPoints}</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Points</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Badges */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-neon-yellow" /> Gamification <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow to-orange-400">Awards</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {badges.map((badge, index) => (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={badge.unlocked ? { scale: 1.03 } : {}}
                                        className={`group relative bg-slate-900 border ${badge.unlocked ? 'border-white/10' : 'border-white/5 opacity-50'} p-6 rounded-3xl overflow-hidden cursor-pointer`}
                                    >
                                        {!badge.unlocked && (
                                            <div className="absolute inset-0 bg-slate-950/80 z-20 flex items-center justify-center backdrop-blur-[1px]">
                                                <div className="flex flex-col items-center">
                                                    <Lock className="w-5 h-5 text-slate-500 mb-1" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Locked</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 ${badge.unlocked ? 'group-hover:opacity-10' : ''} transition-opacity duration-300`} />
                                        <div className={`flex gap-4 items-start relative z-10 ${!badge.unlocked && 'grayscale'}`}>
                                            <div className={`p-4 rounded-2xl bg-slate-950 border border-white/10 ${badge.unlocked ? badge.shadow : ''} transition-shadow`}>
                                                <badge.icon className={`w-8 h-8 ${badge.textColor}`} />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold mb-1 transition-colors ${badge.unlocked ? 'text-white group-hover:text-white' : 'text-slate-500'}`}>{badge.name}</h3>
                                                <p className="text-sm text-slate-400">{badge.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Feed */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl h-full">
                            <h2 className="text-xl font-black italic uppercase mb-8 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-neon-blue" /> Recent <span className="text-neon-blue">Activity</span>
                            </h2>

                            <div className="space-y-6">
                                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                                    <motion.div 
                                        key={activity.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                        className="relative pl-6 border-l border-white/10 hover:border-neon-blue transition-colors"
                                    >
                                        <div className="absolute w-3 h-3 rounded-full bg-slate-800 border-[3px] border-neon-blue left-[-6.5px] top-1" />
                                        <div className="mb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">{activity.date}</div>
                                        <h4 className="text-white font-bold mb-1 truncate">{activity.turf}</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-300 capitalize">{activity.result}</span>
                                            <span className="text-neon-green font-bold bg-neon-green/10 px-2 py-0.5 rounded-md">{activity.points}</span>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-slate-500 font-bold text-center py-8">
                                        No recent games. Book a turf to start earning XP!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Edit Profile Modal Content (AnimatePresence handles insertion/removal animation) */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-white italic">EDIT <span className="text-neon-blue">PROFILE</span></h3>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={editForm.first_name}
                                        onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                                        placeholder="First Name"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={editForm.last_name}
                                        onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                                        placeholder="Last Name"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={editForm.user_profile || ''}
                                        onChange={(e) => setEditForm({...editForm, user_profile: e.target.value})}
                                        placeholder="Profile Avatar URL (Optional)"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="w-full mt-6 py-3 bg-neon-green text-black rounded-xl font-bold tracking-wide flex justify-center items-center gap-2 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all"
                            >
                                {isSaving ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        SAVE CHANGES
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
