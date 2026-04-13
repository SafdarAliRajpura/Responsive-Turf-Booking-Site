import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Orbital Loader */}
                <div className="relative w-24 h-24 mb-10">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-r-2 border-neon-purple rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-b-2 border-l-2 border-neon-green rounded-full shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    </div>
                </div>

                {/* Typography Shimmer */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h2 className="text-xl font-black italic uppercase tracking-[0.3em] text-white leading-none mb-3">
                        Arena <span className="text-neon-purple">Engine</span>
                    </h2>
                    <div className="flex items-center gap-1 justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                        />
                    </div>
                </motion.div>

                {/* Status Indicator */}
                <div className="mt-12 overflow-hidden bg-white/5 border border-white/10 rounded-full w-48 h-1 relative">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple to-transparent"
                    />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Syncing Intelligence</p>
            </div>
        </div>
    );
};

export default PremiumLoader;
