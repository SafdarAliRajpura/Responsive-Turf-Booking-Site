import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Heart, MessageSquare, Calendar, CreditCard, Trophy, Zap, User, ChevronRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = ({ color = "neon-blue" }) => {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

    const getThemeColors = () => {
        switch (color) {
            case 'neon-green': return { 
                accent: 'text-neon-green', 
                bg: 'bg-neon-green', 
                glow: 'shadow-[0_0_15px_#39ff14]', 
                border: 'border-neon-green/30',
                light: 'bg-neon-green/10'
            };
            case 'neon-purple': return { 
                accent: 'text-neon-purple', 
                bg: 'bg-neon-purple', 
                glow: 'shadow-[0_0_15px_#a855f7]', 
                border: 'border-neon-purple/30',
                light: 'bg-neon-purple/10'
            };
            default: return { 
                accent: 'text-neon-blue', 
                bg: 'bg-neon-blue', 
                glow: 'shadow-[0_0_15px_#00f3ff]', 
                border: 'border-neon-blue/30',
                light: 'bg-neon-blue/10'
            };
        }
    };

    const theme = getThemeColors();

    const getIcon = (type) => {
        switch (type) {
            case 'LIKE': return <Heart className="w-4 h-4 text-neon-pink fill-current" />;
            case 'COMMENT': return <MessageSquare className={`w-4 h-4 ${theme.accent}`} />;
            case 'BOOKING': return <Calendar className={`w-4 h-4 ${theme.accent}`} />;
            case 'PAYMENT': return <CreditCard className="w-4 h-4 text-neon-yellow" />;
            case 'TOURNAMENT': return <Trophy className="w-4 h-4 text-orange-500" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="group relative">
            <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-white/20">
                <Bell className={`w-6 h-6 transition-transform group-hover:rotate-12 ${unreadCount > 0 ? theme.accent : ''}`} />
                {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-950 animate-bounce ${theme.bg} text-black ${theme.glow}`}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Matrix */}
            <div className="absolute right-0 top-[calc(100%+1rem)] w-96 bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 z-[100] overflow-hidden translate-y-2 group-hover:translate-y-0">
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${theme.light} flex items-center justify-center`}>
                            <Zap className={`w-4 h-4 ${theme.accent}`} />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Neural Intel</h4>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Live Operation Feed</p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} hover:brightness-125 transition-all`}>Purge Unread</button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                        <AnimatePresence initial={false}>
                            {notifications.slice(0, 8).map((notif) => (
                                <motion.div 
                                    key={notif._id} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => {
                                        markAsRead(notif._id);
                                        if(notif.link) navigate(notif.link);
                                    }}
                                    className={`group/item p-5 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer flex gap-4 relative ${!notif.isRead ? 'bg-white/[0.01]' : 'opacity-40'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover/item:${theme.border} transition-colors overflow-hidden relative`}>
                                        {notif.sender?.user_profile ? (
                                            <img src={notif.sender.user_profile} alt="S" className="w-full h-full object-cover" />
                                        ) : (
                                            getIcon(notif.type)
                                        )}
                                        {!notif.isRead && (
                                            <div className={`absolute top-0 right-0 w-2 h-2 ${theme.bg} rounded-bl-lg`} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                {notif.type || 'Alert'}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-700 uppercase">
                                                {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-tight group-hover/item:text-white transition-colors">
                                            <span className={`font-black uppercase italic tracking-tighter mr-1 ${theme.accent}`}>{notif.sender?.first_name || 'System'}</span> 
                                            {notif.message}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center">
                                        <ChevronRight className={`w-4 h-4 ${theme.accent}`} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="p-16 text-center">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6"
                            >
                                <Bell className="w-10 h-10 text-slate-400" />
                            </motion.div>
                            <p className="text-xs text-slate-500 font-black uppercase tracking-[0.3em]">No Dynamic Data</p>
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-2">Feed is currently silent</p>
                        </div>
                    )}
                </div>
                
                <div className="p-5 bg-white/[0.02] text-center">
                    <button 
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user?.role === 'admin') navigate('/admin/bookings');
                            else if (user?.role === 'partner') navigate('/partner/bookings');
                            else navigate('/bookings');
                        }} 
                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3"
                    >
                        Access Command Center <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
