import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Save, Lock, Store, Camera, Eye, EyeOff, Shield, 
    Bell, Globe, CheckCircle, Loader2, Trash2, 
    User, Smartphone, CreditCard
} from 'lucide-react';
import apiClient from '../../../utils/apiClient';
import userAvatar from '../../../assets/images/common/avatar-1.jpg';
import Toast from '../../../components/ui/Toast';
import { useNotifications } from '../../../context/NotificationContext';

const Section = ({ title, subtitle, icon: Icon, children }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 mb-8 relative overflow-hidden group shadow-2xl"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 rounded-bl-[100%] pointer-events-none group-hover:bg-neon-purple/10 transition-colors" />
        
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-neon-purple border border-white/10 shadow-lg">
                <Icon className="w-7 h-7" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{title}</h2>
                <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
            </div>
        </div>
        {children}
    </motion.div>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder, name, isPassword, showPassword, onTogglePassword, icon: Icon }) => (
    <div className="space-y-2.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />}
            <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-950 border border-white/10 rounded-2xl ${Icon ? 'pl-12' : 'px-5'} py-4 text-white text-sm focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all font-bold placeholder:text-slate-800 ${isPassword ? 'pr-12' : ''}`}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors focus:outline-none"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            )}
        </div>
    </div>
);

export default function Settings() {
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [isSaving, setIsSaving] = useState(false);
    const [isPassLoading, setIsPassLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const { notifications, markAsRead, markAllRead } = useNotifications();

    const [profile, setProfile] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        mobileNumber: '',
        user_profile: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await apiClient.get('/auth/me');
                if (res.data.success && res.data.data) {
                    const user = res.data.data;
                    setProfile({
                        businessName: user.businessName || '',
                        ownerName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                        email: user.email || '',
                        mobileNumber: user.mobileNumber || '',
                        user_profile: user.user_profile || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const nameParts = profile.ownerName.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ');

        const payload = {
            businessName: profile.businessName,
            first_name,
            last_name,
            email: profile.email,
            mobileNumber: profile.mobileNumber,
            user_profile: profile.user_profile
        };

        try {
            const res = await apiClient.put('/auth/profile', payload);
            if (res.data.success) {
                setToast({ message: 'Blueprint Integrated Successfully!', type: 'success' });
                localStorage.setItem('user', JSON.stringify(res.data.data));
            }
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Synchronization Error', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePassword = async () => {
        if (!passwords.currentPassword) {
            setToast({ message: 'Current credentials required.', type: 'error' });
            return;
        }
        setIsPassLoading(true);
        try {
            const res = await apiClient.put('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (res.data.success) {
                setToast({ message: 'Security Protocol Updated!', type: 'success' });
                setPasswords({ currentPassword: '', newPassword: '' });
                setShowCurrentPassword(false);
                setShowNewPassword(false);
            }
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Validation Failed', type: 'error' });
        } finally {
            setIsPassLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 relative px-4 sm:px-0">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
                        Control <span className="text-neon-purple">Center</span>
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Configure your professional operational parameters.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-neon-green transition-all shadow-xl hover:shadow-neon-green/20 disabled:bg-slate-800 disabled:text-slate-500"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Commit Changes
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Side: Navigation Links / Status */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-bl-[100%] pointer-events-none" />
                        <div className="relative inline-block mb-6">
                            <img 
                                src={profile.user_profile || userAvatar} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-950 bg-slate-950 shadow-2xl" 
                            />
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-black rounded-xl border-4 border-slate-900 flex items-center justify-center cursor-pointer hover:bg-neon-purple hover:text-white transition-all shadow-lg">
                                <Camera className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProfile(p => ({...p, user_profile: reader.result}));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate leading-none mb-1">{profile.businessName || 'Untitled Business'}</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{profile.ownerName}</p>
                        
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-slate-600">Site Status</span>
                                <span className="text-neon-green flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> All Systems Online</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-slate-600">Reputation</span>
                                <span className="text-neon-yellow">Elite Partner</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 space-y-2">
                        {[
                            { icon: User, label: 'Account Profile', id: 'profile' },
                            { icon: Bell, label: 'Notifications', id: 'notifications' },
                            { icon: CreditCard, label: 'Payout Settings', id: 'payout' },
                            { icon: Globe, label: 'Platform Hub', id: 'hub' }
                        ].map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-neon-purple' : ''}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Forms */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <Section 
                                    title="Operational Profile" 
                                    subtitle="Public facing data for your athlete network." 
                                    icon={Store}
                                >
                                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                        <InputGroup label="Business Title" name="businessName" value={profile.businessName} onChange={handleProfileChange} placeholder="e.g. Neon Arena" icon={Smartphone} />
                                        <InputGroup label="Director of Ops" name="ownerName" value={profile.ownerName} onChange={handleProfileChange} placeholder="e.g. John Doe" icon={User} />
                                        <InputGroup label="Communication Socket" type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="admin@example.com" icon={Globe} />
                                        <InputGroup label="Secure Mobile" type="tel" name="mobileNumber" value={profile.mobileNumber} onChange={handleProfileChange} placeholder="+91 98765 43210" icon={Smartphone} />
                                    </div>
                                </Section>

                                <Section 
                                    title="Security Layer" 
                                    subtitle="Control access protocols and account integrity." 
                                    icon={Shield}
                                >
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <InputGroup 
                                            label="Access Key (Current)" 
                                            name="currentPassword" 
                                            value={passwords.currentPassword} 
                                            onChange={handlePasswordChange} 
                                            placeholder="••••••••" 
                                            isPassword={true}
                                            showPassword={showCurrentPassword}
                                            onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
                                            icon={Lock}
                                        />
                                        <InputGroup 
                                            label="New Access Key" 
                                            name="newPassword" 
                                            value={passwords.newPassword} 
                                            onChange={handlePasswordChange} 
                                            placeholder="••••••••" 
                                            isPassword={true}
                                            showPassword={showNewPassword}
                                            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                                            icon={CheckCircle}
                                        />
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <button 
                                            onClick={handleSavePassword} 
                                            disabled={isPassLoading}
                                            className="px-8 py-4 bg-neon-purple text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all shadow-xl shadow-neon-purple/30 flex items-center gap-2 disabled:bg-slate-800"
                                        >
                                            {isPassLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                            Upgrade Access Security
                                        </button>
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                                <Smartphone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase italic tracking-tighter leading-none mb-1">Two-Factor Authentication</p>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Biometric & SMS Secondary Access</p>
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 border-2 border-slate-800 text-slate-400 hover:text-white hover:border-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                                            Enable Layer
                                        </button>
                                    </div>
                                </Section>

                                <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-red-500/10 transition-all">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-black text-red-500 italic uppercase tracking-tighter leading-none mb-2">Off-Chain Decommissioning</h3>
                                        <p className="text-slate-500 text-xs font-medium">Permanently remove your business from the Arena network.</p>
                                    </div>
                                    <button className="px-8 py-4 bg-transparent border-2 border-red-500/30 text-red-500/60 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Deactivate Account
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <Section 
                                    title="Intelligence Feed" 
                                    subtitle="Manage your tactical operational alerts." 
                                    icon={Bell}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Event Log</p>
                                        <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-neon-purple hover:text-white transition-colors">Clear All Intel</button>
                                    </div>

                                    <div className="space-y-4">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div 
                                                    key={notif._id}
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-6 rounded-3xl border transition-all flex items-start gap-4 cursor-pointer ${!notif.isRead ? 'bg-neon-purple/5 border-neon-purple/20' : 'bg-slate-950 border-white/5 opacity-60 hover:opacity-100'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${!notif.isRead ? 'bg-neon-purple text-black' : 'bg-white/5 text-slate-400'}`}>
                                                        <Bell className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{notif.type}</span>
                                                            <span className="text-[9px] font-bold text-slate-600 italic">{new Date(notif.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-sm text-white font-medium leading-relaxed">{notif.message}</p>
                                                    </div>
                                                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_10px_#a855f7] mt-2" />}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center bg-slate-950/50 rounded-3xl border border-dashed border-white/5">
                                                <Bell className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs italic">Operational logs are currently silent.</p>
                                            </div>
                                        )}
                                    </div>
                                </Section>
                            </motion.div>
                        )}

                        {activeTab === 'payout' && (
                            <motion.div key="payout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <Section title="Settlement Protocol" subtitle="Configure your financial payout routes." icon={CreditCard}>
                                    <div className="py-20 text-center bg-slate-950/50 rounded-3xl border border-dashed border-white/5">
                                        <CreditCard className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs italic">Financial blueprint expansion in progress.</p>
                                    </div>
                                </Section>
                            </motion.div>
                        )}
                        
                        {activeTab === 'hub' && (
                            <motion.div key="hub" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <Section title="Platform Matrix" subtitle="Connected ecosystem settings and API tokens." icon={Globe}>
                                    <div className="py-20 text-center bg-slate-950/50 rounded-3xl border border-dashed border-white/5">
                                        <Globe className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs italic">System expansion protocols loading...</p>
                                    </div>
                                </Section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
