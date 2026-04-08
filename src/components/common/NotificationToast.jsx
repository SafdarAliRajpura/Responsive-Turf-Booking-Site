import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Bell, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationToast = () => {
    const { latestToast, setLatestToast } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'LIKE': return <Heart className="w-5 h-5 text-neon-pink fill-current" />;
            case 'COMMENT': return <MessageSquare className="w-5 h-5 text-neon-blue" />;
            default: return <Bell className="w-5 h-5 text-neon-green" />;
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
            <AnimatePresence>
                {latestToast && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="pointer-events-auto bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] border-l-4 border-l-neon-blue"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            {getIcon(latestToast.type)}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-0.5">Community Alert</p>
                            <p className="text-sm text-white font-medium">
                                <span className="font-bold text-neon-blue">
                                    {latestToast.sender?.first_name || 'Someone'}
                                </span> {latestToast.message}
                            </p>
                        </div>
                        <button 
                            onClick={() => setLatestToast(null)}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;
