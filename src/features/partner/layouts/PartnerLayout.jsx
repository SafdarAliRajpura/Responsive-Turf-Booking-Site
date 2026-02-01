import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, MapPin, Calendar, Settings,
    LogOut, Bell, Search, Briefcase, Plus, TrendingUp
} from 'lucide-react';
import userAvatarImg from '../../../assets/images/common/avatar-1.jpg'; // Placeholder for partner avatar
import carbonFibrePattern from '../../../assets/images/common/carbon-fibre.png';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
            ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`} />
        <span className="font-bold tracking-wide text-sm">{label}</span>
        {active && (
            <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
        )}
    </button>
);

export default function PartnerLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/partner/dashboard' },
        { icon: MapPin, label: 'My Turfs', path: '/partner/turfs' },
        { icon: Calendar, label: 'Bookings', path: '/partner/bookings' },
        { icon: TrendingUp, label: 'Analytics', path: '/partner/analytics' },
        { icon: Settings, label: 'Settings', path: '/partner/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-purple selection:text-white flex overflow-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 cursor-pointer mb-8" onClick={() => navigate('/home')}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-neon-purple to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-neon-purple/20">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">
                            TURF<span className="text-neon-purple">X</span>
                            <span className="text-[10px] font-medium text-slate-500 ml-1 uppercase tracking-widest border border-slate-700 px-1 rounded">Partner</span>
                        </span>
                    </div>

                    <div className="mb-6">
                        <button className="w-full py-3 bg-neon-purple text-white font-bold rounded-xl hover:bg-fuchsia-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20">
                            <Plus className="w-4 h-4" /> Add New Turf
                        </button>
                    </div>

                    <div className="space-y-2">
                        {sidebarItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                path={item.path}
                                active={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-6 border-t border-white/5">
                    <button
                        onClick={() => navigate('/partner/login')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm">Log Out</span>
                    </button>

                    <div className="mt-6 flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                        <img src={userAvatarImg} alt="Partner" className="w-10 h-10 rounded-lg border border-white/10" />
                        <div>
                            <p className="text-sm font-bold text-white">John Doe</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Business Owner</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 w-0">

                {/* Topbar */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-96 focus-within:border-neon-purple/50 transition-colors">
                        <Search className="w-4 h-4 text-slate-500 mr-3" />
                        <input
                            type="text"
                            placeholder="Search your venues..."
                            className="bg-transparent border-none text-white text-sm placeholder-slate-500 focus:outline-none w-full font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#39ff14]" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}
