import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Building2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import registerBg from '../../../assets/images/auth/register-bg.jpg';
import Toast from '../../../components/ui/Toast';

export default function PartnerRegister() {
    const navigate = useNavigate();
    const [focused, setFocused] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [data, setData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        profilePic: 'https://api.dicebear.com/7.x/micah/svg?seed=42&backgroundColor=0f172a'
    });
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!data.businessName.trim()) return handleError('Business Name is required!');
        if (!data.ownerName.trim()) return handleError('Owner Name is required!');
        if (!data.email) return handleError('Email is required!');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return handleError('Invalid email address.');
        if (!data.phone) return handleError('Phone Number is required!');
        if (!data.password) return handleError('Password is required!');
        if (data.password.length < 6) return handleError('Password must be at least 6 characters.');
        if (data.password !== data.confirmPassword) return handleError('Passwords do not match!');
        return true;
    };

    const handleError = (msg) => {
        setToast({ message: msg, type: 'error' });
        return false;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                // Since we might be sending a file later, we should ideally use FormData
                // But for now, conforming to our existing JSON payload structure (without real image upload)
                const payload = {
                    name: `${data.businessName} - ${data.ownerName}`,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                    role: 'partner',
                    user_profile: data.profilePic
                };

                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setToast({ message: 'Application Submitted! Welcome aboard.', type: 'success' });
                    // Store token automatically if registration logs them in natively (backend returns token)
                    if(result.data && result.data.token) {
                        localStorage.setItem('token', result.data.token);
                        localStorage.setItem('user', JSON.stringify(result.data));
                    }
                    setTimeout(() => navigate('/partner/login'), 1500);
                } else {
                    handleError(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error("Registration Error:", error);
                handleError('Something went wrong checking connectivity');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">

            {/* Fixed Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-green/20 rounded-full blur-[100px] animate-pulse-fast" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-fast" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${registerBg})` }} />
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
            </div>

            {/* Scrollable Content Container */}
            <div className="relative z-10 h-screen flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-lg mx-auto my-auto"
                >
                    <div className="relative backdrop-blur-2xl bg-slate-900/50 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                className="w-16 h-16 bg-gradient-to-tr from-neon-blue to-neon-green rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-neon-green transform -rotate-3"
                            >
                                <Building2 className="w-8 h-8 text-black" strokeWidth={2.5} />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl font-black text-white mb-2 tracking-tight"
                            >
                                BECOME A <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">PARTNER</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="text-slate-400 font-medium"
                            >
                                List your turf. Grow your community.
                            </motion.p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 relative z-20">

                            {/* Avatar Selection Slider */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.45 }}
                                className="mb-8"
                            >
                                <label className="block text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    Select Your Partner Avatar
                                </label>
                                {/* Hide scrollbar cleanly via inline styles and standard non-standard tags */}
                                <div className="flex gap-6 overflow-x-auto py-6 px-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    <style>{`
                                        .flex.gap-6::-webkit-scrollbar { display: none; }
                                    `}</style>
                                    {Array.from({length: 12}, (_, i) => `https://api.dicebear.com/7.x/micah/svg?seed=${i + 42}&backgroundColor=0f172a`).map((avatarUrl, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => setData({ ...data, profilePic: avatarUrl })}
                                            className={`flex-shrink-0 snap-center cursor-pointer transition-all duration-300 w-20 h-20 rounded-full border-4 ${data.profilePic === avatarUrl ? 'border-neon-green scale-110 shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'} bg-slate-800 overflow-hidden`}
                                        >
                                            <img src={avatarUrl} alt={`Avatar option ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Business Name & Owner Name Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'businessName' ? 'text-neon-green' : 'text-slate-500'}`}>
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Turf Name"
                                        value={data.businessName}
                                        onFocus={() => setFocused('businessName')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData({ ...data, businessName: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.55 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'ownerName' ? 'text-neon-green' : 'text-slate-500'}`}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Owner Name"
                                        value={data.ownerName}
                                        onFocus={() => setFocused('ownerName')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                    />
                                </motion.div>
                            </div>

                            {/* Email Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'email' ? 'text-neon-blue' : 'text-slate-500'}`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Business Email"
                                    value={data.email}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                />
                            </motion.div>

                            {/* Phone Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.65 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'phone' ? 'text-neon-blue' : 'text-slate-500'}`}>
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={data.phone}
                                    onFocus={() => setFocused('phone')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                />
                            </motion.div>

                            {/* Password Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'password' ? 'text-neon-pink' : 'text-slate-500'}`}>
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Create Password"
                                        value={data.password}
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.75 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'confirmPassword' ? 'text-neon-pink' : 'text-slate-500'}`}>
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={data.confirmPassword}
                                        onFocus={() => setFocused('confirmPassword')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                    />
                                </motion.div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="group relative w-full py-4 bg-gradient-to-r from-neon-green to-emerald-600 rounded-xl font-bold text-black text-lg shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.5)] transition-all duration-300 overflow-hidden mt-4"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? 'PROCESSING...' : 'REGISTER BUSINESS'} 
                                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                            className="mt-8 text-center space-y-4"
                        >
                            <p className="text-slate-500">
                                Already registered? <button onClick={() => navigate('/partner/login')} className="text-neon-blue hover:underline font-bold">Log in here</button>
                            </p>
                            <button onClick={() => navigate('/register')} className="text-xs text-slate-600 hover:text-white transition-colors">Looking to play instead?</button>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
