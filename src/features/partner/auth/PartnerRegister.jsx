import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, ArrowRight, Building2, Phone, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import registerBg from '../../../assets/images/auth/register-bg.jpg';
import Toast from '../../../components/ui/Toast';

export default function PartnerRegister() {
    const navigate = useNavigate();
    const [focused, setFocused] = useState(null);
    const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(42);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [data, setData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const avatars = [42, 45, 48, 51, 54];

    const validateForm = () => {
        if (!data.businessName.trim()) return handleError('Ground Name is required!');
        if (!data.ownerName.trim()) return handleError('Owner Name is required!');
        if (!data.email) return handleError('Business Email is required!');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return handleError('Invalid business email.');
        if (!data.phone) return handleError('Contact Phone is required!');
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
                const payload = {
                    name: `${data.businessName} | ${data.ownerName}`,
                    email: data.email,
                    phone: data.phone,
                    role: 'partner',
                    user_profile: `https://api.dicebear.com/7.x/micah/svg?seed=${selectedAvatarSeed}&backgroundColor=0f172a`
                };

                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setToast({ message: 'Application Received! Joining the fleet...', type: 'success' });
                    setTimeout(() => navigate('/partner/login'), 1500);
                } else {
                    handleError(result.message || 'Submission failed');
                }
            } catch (error) {
                handleError('Connectivity failed. Try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">

            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-green/20 rounded-full blur-[100px] animate-pulse-fast" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-fast" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${registerBg})` }} />
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
            </div>

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
                                LIST YOUR <span className="text-neon-green">TURF</span>
                            </motion.h2>
                            <p className="text-slate-400 font-medium">Join the network. Reach more players.</p>
                        </div>

                        {/* Avatars */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <p className="text-sm font-bold text-white mb-3 tracking-widest uppercase text-[10px]">Your Business ID Signature</p>
                            <div className="flex gap-3 overflow-x-auto py-4 px-2 scrollbar-hide">
                                {avatars.map((seed) => (
                                    <button
                                        key={seed}
                                        type="button"
                                        onClick={() => setSelectedAvatarSeed(seed)}
                                        className={`relative w-16 h-16 rounded-2xl flex-shrink-0 border-2 transition-all ${selectedAvatarSeed === seed ? 'border-neon-green scale-110 shadow-lg shadow-neon-green/20' : 'border-transparent opacity-60 hover:opacity-100 mx-1'}`}
                                    >
                                        <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=0f172a`} alt="" className="w-full h-full rounded-2xl object-cover bg-slate-800" />
                                        {selectedAvatarSeed === seed && (
                                            <div className="absolute -bottom-1 -right-1 bg-neon-green rounded-full p-0.5">
                                                <CheckCircle className="w-4 h-4 text-black" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="group relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focused === 'bn' ? 'text-neon-green' : 'text-slate-500'}`}>
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Ground / Turf Name"
                                    value={data.businessName}
                                    onFocus={() => setFocused('bn')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({...data, businessName: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 transition-all font-bold" 
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.55 }} className="group relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focused === 'on' ? 'text-neon-green' : 'text-slate-500'}`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Owner Full Name"
                                    value={data.ownerName}
                                    onFocus={() => setFocused('on')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({...data, ownerName: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 transition-all font-bold" 
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="group relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focused === 'em' ? 'text-neon-blue' : 'text-slate-500'}`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="Business Email"
                                    value={data.email}
                                    onFocus={() => setFocused('em')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({...data, email: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 transition-all font-bold" 
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.65 }} className="group relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focused === 'ph' ? 'text-neon-blue' : 'text-slate-500'}`}>
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input 
                                    type="tel" 
                                    placeholder="Phone Number"
                                    value={data.phone}
                                    onFocus={() => setFocused('ph')}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setData({...data, phone: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 transition-all font-bold" 
                                />
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-lg transition-all shadow-xl flex items-center justify-center gap-3 mt-8 ${isLoading ? 'bg-slate-800 text-slate-500' : 'bg-neon-green text-black hover:bg-white shadow-neon-green/10'}`}
                            >
                                {isLoading ? 'INITIALIZING...' : 'CLAIM BUSINESS SEAT'} <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </form>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="mt-8 text-center pt-6 border-t border-white/5">
                            <p className="text-slate-500 text-sm">Already a fleet partner? <button onClick={() => navigate('/partner/login')} className="text-neon-blue hover:underline font-bold">Log in here</button></p>
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
