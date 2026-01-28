import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Twitter } from 'lucide-react';

import loginBg from '../../assets/images/auth/login-bg.jpg';

import Toast from '../../components/ui/Toast';

export default function Login({ onLogin, onRegisterClick }) {
    const [focused, setFocused] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const validateForm = () => {
        if (!data.email) {
            setToast({ message: 'Email address is required!', type: 'error' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setToast({ message: 'Please enter a valid email address.', type: 'error' });
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
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Login Credentials:", data);
            setToast({ message: 'Login Successful! Welcome back.', type: 'success' });
            setTimeout(() => {
                onLogin();
            }, 1000);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">

            {/* Fixed Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-fast" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-green/20 rounded-full blur-[100px] animate-pulse-fast" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${loginBg})` }} />
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
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                className="w-16 h-16 bg-gradient-to-tr from-neon-green to-neon-blue rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-neon-green transform rotate-3"
                            >
                                <Lock className="w-8 h-8 text-black" strokeWidth={2.5} />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl font-black text-white mb-2 tracking-tight"
                            >
                                WELCOME <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">BACK</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="text-slate-400 font-medium"
                            >
                                Enter the arena.
                            </motion.p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 relative z-20">

                            {/* Email Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

                            {/* Password Input */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === 'password' ? 'text-neon-green' : 'text-slate-500'}`}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all durations-300 transform group-hover:scale-[1.01]"
                                />
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="group relative w-full py-4 bg-gradient-to-r from-neon-blue to-cyan-600 rounded-xl font-bold text-black text-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_40px_rgba(0,243,255,0.5)] transition-all duration-300 overflow-hidden mt-4"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    LOGIN NOW <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </form>

                        {/* Social Login */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                            className="mt-8"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900/50 text-slate-500">Or continue with</span>
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
                        transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                        className="text-center mt-8 text-slate-500"
                    >
                        Don't have an account? <button onClick={onRegisterClick} className="text-neon-green hover:underline font-bold">Sign up now</button>
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
