import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Medal, Star, Shield, MapPin, 
    Calendar, Clock, Edit2, X, Save, 
    User, Camera, Lock, TrendingUp, Zap, Target,
    MessageSquare, Award
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import userAvatarImg from '../assets/images/common/user-avatar.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';
import apiClient from '../utils/apiClient';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/auth/me');
            if (res.data?.success) {
                const userData = res.data.data;
                setUser(userData);
                setEditForm(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (err) {
            console.error('Profile Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await apiClient.put('/auth/profile', editForm);
            if (res.data?.success) {
                const updated = res.data.data;
                setUser(updated);
                localStorage.setItem('user', JSON.stringify(updated));
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Profile Save Error:', err);
            alert('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const getXpProgress = () => {
        if (!user) return 0;
        const xp = user.xp || 0;
        if (xp >= 5000) return 100;
        if (xp >= 2500) return ((xp - 2500) / 2500) * 100;
        if (xp >= 1000) return ((xp - 1000) / 1500) * 100;
        if (xp >= 500) return ((xp - 500) / 500) * 100;
        if (xp >= 100) return ((xp - 100) / 400) * 100;
        return (xp / 100) * 100;
    };

    const getNextTier = () => {
        if (!user) return 'Amateur';
        const level = user.skillLevel;
        const tiers = ['Rookie', 'Amateur', 'Semi-Pro', 'Pro', 'Elite', 'Legend'];
        const index = tiers.indexOf(level);
        return index < tiers.length - 1 ? tiers[index + 1] : 'MAX';
    };

    const getTierColor = (level) => {
        switch (level) {
            case 'Legend': return 'from-neon-pink to-purple-600 shadow-neon-pink/40';
            case 'Elite': return 'from-purple-500 to-indigo-600 shadow-purple-500/40';
            case 'Pro': return 'from-neon-blue to-blue-700 shadow-neon-blue/40';
            case 'Semi-Pro': return 'from-neon-green to-emerald-700 shadow-neon-green/40';
            default: return 'from-slate-700 to-slate-900 shadow-white/5';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const userProfilePic = user?.user_profile || userAvatarImg;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-neon-green selection:text-black">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-neon-blue/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: The Player Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group h-full"
                        >
                            <div className={`absolute -inset-0.5 bg-gradient-to-br ${getTierColor(user.skillLevel)} opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200 rounded-[40px] shadow-2xl`} />
                            
                            <div className="relative bg-slate-900 border border-white/10 rounded-[40px] p-8 overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none" />
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-8">
                                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${getTierColor(user.skillLevel)} p-1.5 shadow-2xl`}>
                                            <div className="w-full h-full bg-slate-950 rounded-full overflow-hidden border-4 border-slate-900">
                                                <img src={userProfilePic} alt="Profile" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r ${getTierColor(user.skillLevel)} rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg`}>
                                            {user.skillLevel} Tier
                                        </div>
                                    </div>

                                    <h1 className="text-3xl font-black italic uppercase mb-2 tracking-tighter">
                                        {user.first_name} <span className="text-neon-blue">{user.last_name}</span>
                                    </h1>
                                    <p className="text-slate-500 text-sm font-medium mb-8 flex items-center justify-center gap-2">
                                        <MapPin className="w-3 h-3" /> Player ID: {(user._id || '000000').slice(-6).toUpperCase()}
                                    </p>

                                    {/* Stat Grid */}
                                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">XP Earned</p>
                                            <p className="text-xl font-black text-white tabular-nums">{user.xp?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rank</p>
                                            <p className="text-xl font-black text-neon-green">#{(Math.floor(Math.random() * 50) + 1)}</p>
                                        </div>
                                    </div>

                                    {/* XP Progress */}
                                    <div className="w-full space-y-3 mb-8">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">Progression</span>
                                            <span className="text-neon-blue">Next: {getNextTier()}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getXpProgress()}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full bg-gradient-to-r ${getTierColor(user.skillLevel)} shadow-[0_0_15px_rgba(0,150,255,0.4)]`}
                                            />
                                        </div>
                                        <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-tighter">
                                            {getXpProgress().toFixed(0)}% to next skill tier
                                        </p>
                                    </div>

                                    <div className="flex gap-4 w-full">
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit Profile
                                        </button>
                                        <button className="p-4 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue rounded-2xl border border-neon-blue/20 transition-all">
                                            <Zap className="w-4 h-4 fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Experience Hub */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Summary Cards */}
                        <div className="grid sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Arena Matches', val: user.stats?.totalBookings || 0, icon: Target, color: 'text-neon-green' },
                                { label: 'Social Insights', val: user.stats?.discussionsCreated || 0, icon: MessageSquare, color: 'text-neon-blue' },
                                { label: 'Badge Score', val: user.badges?.length || 0, icon: Trophy, color: 'text-neon-yellow' },
                            ].map((s, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex items-center gap-6"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <s.icon className={`w-6 h-6 ${s.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">{s.val}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Badges */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black italic uppercase flex items-center gap-3">
                                    <Star className="w-6 h-6 text-neon-yellow" /> Hall Of <span className="text-neon-yellow">Fame</span>
                                </h2>
                                <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">All Badges</button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(user.badges?.length > 0 ? user.badges : [1, 2, 3, 4]).map((badge, i) => {
                                    const isReal = typeof badge === 'object';
                                    return (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + (i * 0.1) }}
                                            className={`aspect-square bg-slate-900 border ${isReal ? 'border-neon-blue/30' : 'border-white/5 opacity-20 grayscale'} rounded-3xl p-4 flex flex-col items-center justify-center text-center group transition-all hover:bg-slate-800`}
                                        >
                                            <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isReal ? 'bg-neon-blue/20 text-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.2)]' : 'bg-white/5 text-slate-700'}`}>
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <h4 className={`text-xs font-black uppercase tracking-tighter ${isReal ? 'text-white' : 'text-slate-700'}`}>
                                                {isReal ? badge.name : 'Unknown'}
                                            </h4>
                                            {!isReal && <Lock className="w-3 h-3 text-slate-800 mt-2" />}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Activity Feed */}
                        <div className="bg-slate-900 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-purple-600" />
                            <h2 className="text-2xl font-black italic uppercase mb-10 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-neon-blue" /> Tactical <span className="text-neon-blue">Milestones</span>
                            </h2>
                            
                            <div className="space-y-8">
                                {[
                                    { t: 'Joined the Ecosystem', d: 'New Player Registration', date: new Date(user.createdAt).toLocaleDateString(), xp: '+100 XP' },
                                    { t: 'Field Scout', d: 'Browsed Local Venues', date: 'Historical', xp: '+10 XP' }
                                ].map((m, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-lg">{m.t}</h4>
                                                <span className="text-xs font-black text-neon-green uppercase tracking-widest">{m.xp}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">{m.d} • {m.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
                    >
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-[40px] p-10 w-full max-w-lg shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-neon-blue" />
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-3xl font-black text-white italic uppercase">Player <span className="text-neon-green">Bio</span></h3>
                                <button onClick={() => setIsEditing(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Identity</label>
                                    <div className="flex gap-4">
                                        <input type="text" value={editForm.first_name || ''} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} placeholder="First Name" className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-green/50" />
                                        <input type="text" value={editForm.last_name || ''} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} placeholder="Last Name" className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-green/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Avatar URL</label>
                                    <input type="text" value={editForm.user_profile || ''} onChange={(e) => setEditForm({...editForm, user_profile: e.target.value})} placeholder="https://..." className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-green/50" />
                                </div>
                                <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-5 bg-white text-black font-black uppercase rounded-2xl shadow-xl hover:bg-neon-green transition-all mt-6 shadow-neon-green/20">
                                    {isSaving ? 'Syncing...' : 'Update Athlete Profile'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
