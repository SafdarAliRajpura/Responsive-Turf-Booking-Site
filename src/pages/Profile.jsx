import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Medal, Star, Shield, MapPin, 
    Calendar, Clock, Edit2, X, Save, 
    User, Camera, Lock, TrendingUp, Zap, Target,
    MessageSquare, Award, ChevronDown, Upload, Smartphone
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Toast from '../components/ui/Toast';
import userAvatarImg from '../assets/images/common/user-avatar.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';
import apiClient from '../utils/apiClient';

const CountUp = ({ end, duration = 1 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const endVal = parseInt(end);
        if (isNaN(endVal) || endVal <= 0) {
            setCount(endVal || 0);
            return;
        }
        
        const totalMilisecDur = duration * 1000;
        const incrementTime = Math.max(totalMilisecDur / endVal, 10);
        
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= endVal) {
                setCount(endVal);
                clearInterval(timer);
            }
        }, incrementTime);
        
        return () => clearInterval(timer);
    }, [end, duration]);
    
    return <span>{count}</span>;
};

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const fileInputRef = useRef(null);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check (2MB limit for base64 efficiency)
        if (file.size > 2 * 1024 * 1024) {
            setToast({ message: "Image too large. Max 2MB for tactical gear.", type: 'error' });
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setEditForm({ ...editForm, user_profile: reader.result });
        };
        reader.onerror = error => {
            console.error('File Read Error:', error);
            setToast({ message: "Failed to process image.", type: 'error' });
        };
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
                setToast({ message: 'Profile synchronization complete!', type: 'success' });
            }
        } catch (err) {
            console.error('Profile Save Error:', err);
            setToast({ message: 'Failed to update tactical profile. Verify network.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const getXpProgress = () => {
        if (!user) return 0;
        const xp = user.xp || 0;
        // Legend Tier
        if (xp >= 5000) return 100;
        // Elite Tier (2500 - 4999)
        if (xp >= 2500) return Math.min(((xp - 2500) / 2500) * 100, 100);
        // Pro Tier (1000 - 2499)
        if (xp >= 1000) return Math.min(((xp - 1000) / 1500) * 100, 100);
        // Semi-Pro Tier (500 - 999)
        if (xp >= 500) return Math.min(((xp - 500) / 500) * 100, 100);
        // Amateur Tier (100 - 499)
        if (xp >= 100) return Math.min(((xp - 100) / 400) * 100, 100);
        // Rookie Tier (0 - 99)
        return Math.min((xp / 100) * 100, 100);
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
                                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r ${getTierColor(user.skillLevel)} rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg whitespace-nowrap`}>
                                            {user.skillLevel} • {user.primaryRole || 'Athlete'}
                                        </div>
                                    </div>

                                    <h1 className="text-3xl font-black italic uppercase mb-2 tracking-tighter">
                                        {user.first_name} <span className="text-neon-blue">{user.last_name}</span>
                                    </h1>
                                    <p className="text-slate-500 text-[10px] font-bold mb-6 flex items-center justify-center gap-2 uppercase tracking-widest">
                                        <MapPin className="w-3 h-3 text-neon-blue" /> Player ID: {(user._id || '000000').slice(-6).toUpperCase()}
                                    </p>

                                    {user.bio && (
                                        <div className="mb-8 px-4 py-3 bg-white/5 border border-white/5 rounded-2xl relative">
                                            <div className="absolute -top-2 left-4 px-2 bg-slate-900 text-[8px] font-black uppercase text-neon-blue tracking-widest">Athlete Bio</div>
                                            <p className="text-sm text-slate-400 font-medium italic leading-relaxed line-clamp-3">"{user.bio}"</p>
                                        </div>
                                    )}

                                    {/* Stat Grid */}
                                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">XP Earned</p>
                                            <p className="text-xl font-black text-white tabular-nums">{user.xp?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rank</p>
                                            <p className="text-xl font-black text-neon-green">#{user.rank || 1}</p>
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
                                                className="h-full bg-gradient-to-r from-neon-green to-emerald-600 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
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
                                        <h4 className="text-2xl font-black text-white">
                                            <CountUp end={s.val} />
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
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
                            className="bg-slate-900 border border-white/10 rounded-[40px] p-8 md:p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-neon-blue" />
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic uppercase leading-none mb-2">Athlete <span className="text-neon-green">Bio Hub</span></h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Update your identity matrix and tactical bio.</p>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                            </div>

                            {/* Dynamic Progression Insight */}
                            <div className="mb-10 bg-slate-950/50 border border-white/5 rounded-3xl p-6">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                    <span className="text-slate-500">Current Standing: <span className="text-white">{user.skillLevel}</span></span>
                                    <span className="text-neon-blue">Target: {getNextTier()}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-2">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getXpProgress()}%` }}
                                        className="h-full bg-gradient-to-r from-neon-green to-emerald-600 shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                                    />
                                </div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-right">
                                    {getXpProgress().toFixed(0)}% completion to {getNextTier()}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue ml-1 flex items-center gap-2">
                                            <User className="w-3 h-3" /> Identity Matrix
                                        </label>
                                        <div className="flex gap-4">
                                            <input type="text" value={editForm.first_name || ''} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} placeholder="First Name" className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 text-sm transition-all" />
                                            <input type="text" value={editForm.last_name || ''} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} placeholder="Last Name" className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 text-sm transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue ml-1 flex items-center gap-2">
                                            <Smartphone className="w-3 h-3" /> Tactical Contact
                                        </label>
                                        <input type="text" value={editForm.mobileNumber || ''} onChange={(e) => setEditForm({...editForm, mobileNumber: e.target.value})} placeholder="Mobile Number" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 text-sm transition-all" />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue ml-1 flex items-center gap-2">
                                            <Target className="w-3 h-3" /> Primary Field Role
                                        </label>
                                        <div className="relative group/select">
                                            <select 
                                                value={editForm.primaryRole || 'Athlete'} 
                                                onChange={(e) => setEditForm({...editForm, primaryRole: e.target.value})}
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 text-sm appearance-none cursor-pointer relative z-10 transition-all font-bold"
                                            >
                                                <option className="bg-slate-900">Striker</option>
                                                <option className="bg-slate-900">Midfielder</option>
                                                <option className="bg-slate-900">Defender</option>
                                                <option className="bg-slate-900">Goalkeeper</option>
                                                <option className="bg-slate-900">All-Rounder</option>
                                                <option className="bg-slate-900">Opening Batsman</option>
                                                <option className="bg-slate-900">Fast Bowler</option>
                                                <option className="bg-slate-900">Spin Bowler</option>
                                                <option className="bg-slate-900">Wicket Keeper</option>
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/select:text-neon-blue opacity-50 transition-colors z-0" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4 text-center pb-4 border-b border-white/5">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue ml-1 flex items-center justify-center gap-2">
                                            <Camera className="w-3 h-3" /> Digital Avatar
                                        </label>
                                        <div className="relative inline-block group/avatar">
                                            <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-white/10 overflow-hidden shadow-2xl relative mx-auto">
                                                <img src={editForm.user_profile || userAvatarImg} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                                <div 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer"
                                                >
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                                accept="image/*" 
                                            />
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="mt-3 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest transition-all"
                                            >
                                                Upload New Photo
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue ml-1 flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" /> Player Bio (Max 150)
                                        </label>
                                        <textarea 
                                            value={editForm.bio || ''} 
                                            onChange={(e) => {
                                                if(e.target.value.length <= 150) setEditForm({...editForm, bio: e.target.value});
                                            }}
                                            rows="2" 
                                            placeholder="Write something cool about your playstyle..." 
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </div>



                            <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-5 bg-white text-black font-black uppercase rounded-2xl shadow-xl hover:bg-neon-green transition-all shadow-neon-green/20">
                                {isSaving ? 'Synchronizing Data...' : 'Commit All Changes'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Footer />
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({...toast, message: null})} 
            />
        </div>
    );
}
