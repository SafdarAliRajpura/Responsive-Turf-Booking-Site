import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Twitter, Eye, EyeOff, Phone, Shield, CheckCircle2 } from 'lucide-react';

import registerBg from '../../assets/images/auth/register-bg.jpg';

import Toast from '../../components/ui/Toast';

export default function Register({ onRegister, onLoginClick }) {
    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const avatars = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=d1d4f9",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=ffdfbf",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliza&backgroundColor=b6e3f4"
    ];

    const validateForm = () => {
        if (!data.name.trim()) {
            setToast({ message: 'Full Name is required!', type: 'error' });
            return false;
        }
        if (!data.email) {
            setToast({ message: 'Email address is required!', type: 'error' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setToast({ message: 'Please enter a valid email address.', type: 'error' });
            return false;
        }
        if (!data.phone) {
            setToast({ message: 'Phone Number is required!', type: 'error' });
            return false;
        }
        if (!data.password) {
            setToast({ message: 'Password is required!', type: 'error' });
            return false;
        }
        if (data.password.length < 6) {
            setToast({ message: 'Password must be at least 6 characters.', type: 'error' });
            return false;
        }
        if (data.password !== data.confirmPassword) {
            setToast({ message: 'Passwords do not match!', type: 'error' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        password: data.password,
                        user_profile: avatars[selectedAvatar]
                    })
                });

                const result = await response.json();
                
                if (response.ok && result.success) {
                    setToast({ message: 'Account Created Successfully! Joining squad...', type: 'success' });
                    // Optional: Save token locally
                    if(result.data && result.data.token) {
                        localStorage.setItem('token', result.data.token);
                        localStorage.setItem('user', JSON.stringify(result.data));
                    }
                    setTimeout(() => {
                        onRegister();
                    }, 1500);
                } else {
                    setToast({ message: result.message || 'Registration failed!', type: 'error' });
                }
            } catch (error) {
                console.error("Register error:", error);
                setToast({ message: 'Server error. Please try again.', type: 'error' });
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
                    className="w-full max-w-md mx-auto my-auto"
                >
                    <div className="relative backdrop-blur-2xl bg-slate-900/50 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">

                        {/* Header */}
                        <div className="mb-8">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl font-black text-white mb-2 tracking-tight uppercase"
                            >
                                CLAIM YOUR SPOT
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="text-slate-400 font-medium"
                            >
                                Join the Pro league. Access elite arenas.
                            </motion.p>
                        </div>

                        {/* Avatars */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <p className="text-sm font-bold text-white mb-3">Choose Your Player</p>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {avatars.map((avatar, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedAvatar(index)}
                                        className={`relative w-16 h-16 rounded-full flex-shrink-0 border-2 transition-all ${selectedAvatar === index ? 'border-neon-green scale-110' : 'border-transparent opacity-70 hover:opacity-100 mx-1'}`}
                                    >
                                        <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full rounded-full object-cover bg-white" />
                                        {selectedAvatar === index && (
                                            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full">
                                                <CheckCircle2 className="w-5 h-5 text-neon-green" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 relative z-20">

                            {/* Name Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'name' ? 'text-neon-green' : 'text-slate-500'}`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={data.name}
                                    onFocus={() => setFocused('name')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                />
                            </motion.div>

                            {/* Email Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'email' ? 'text-neon-blue' : 'text-slate-500'}`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
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
                                transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
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

                            {/* Password Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'password' ? 'text-neon-pink' : 'text-slate-500'}`}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={data.password}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </motion.div>

                            {/* Confirm Password Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'confirmPassword' ? 'text-neon-pink' : 'text-slate-500'}`}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={data.confirmPassword}
                                    onFocus={() => setFocused('confirmPassword')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink/50 focus:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="group relative w-full py-4 bg-neon-green rounded-xl font-bold text-black text-lg shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.5)] transition-all duration-300 overflow-hidden mt-4 uppercase border-none"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    CREATE PRO ACCOUNT
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </form>

                        {/* Social Login */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                            className="mt-8"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900/50 text-slate-500">Or sign up with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                                    <Github className="w-5 h-5 text-white block" />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                                    <Twitter className="w-5 h-5 text-sky-400 block" />
                                </motion.button>
                            </div>
                        </motion.div>

                    </div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                        className="text-center mt-8 text-slate-500"
                    >
                        Already have an account? <button onClick={onLoginClick} className="text-neon-blue hover:underline font-bold">Log in</button>
                    </motion.p>
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
