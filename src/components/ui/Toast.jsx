import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (message && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    const variants = {
        hidden: { opacity: 0, y: -50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.9 }
    };

    const colors = {
        success: 'border-neon-green text-neon-green shadow-neon-green',
        error: 'border-neon-pink text-neon-pink shadow-neon-pink',
        info: 'border-neon-blue text-neon-blue shadow-neon-blue'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none"
                >
                    <div className={`pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border ${colors[type].split(' ')[0]} p-4 rounded-2xl shadow-lg shadow-${colors[type].split('-').pop()}/20`}>
                        <div className={`p-2 rounded-xl bg-white/5 ${colors[type]}`}>
                            {icons[type]}
                        </div>
                        <p className="flex-1 text-white font-medium text-sm">{message}</p>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
