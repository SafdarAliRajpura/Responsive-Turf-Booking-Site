import React, { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, MapPin, Trophy,
    Calendar, Settings, LogOut, Bell, Search, Zap, MessageSquare
} from 'lucide-react';
import NotificationDropdown from '../../../components/common/NotificationDropdown';
import userAvatarImg from '../../../assets/images/common/user-avatar.jpg';
import carbonFibrePattern from '../../../assets/images/common/carbon-fibre.png';
import PremiumLoader from '../../../components/ui/PremiumLoader';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
            ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`} />
        <span className="font-bold tracking-wide text-sm">{label}</span>
        {active && (
            <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)]"
            />
        )}
    </button>
);

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role && user.role.toLowerCase() !== 'admin') {
            navigate('/home'); // Redirect to home if NOT admin
        }
    }, [navigate]); // Stable dependencies

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: MapPin, label: 'Venues', path: '/admin/venues' },
        { icon: Trophy, label: 'Tournaments', path: '/admin/tournaments' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-blue selection:text-black flex overflow-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 cursor-pointer mb-8" onClick={() => navigate('/home')}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-neon-blue to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-neon-blue/20">
                            <Zap className="w-5 h-5 text-black fill-current" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">
                            TURF<span className="text-neon-blue">X</span>
                            <span className="text-[10px] font-medium text-slate-500 ml-1 uppercase tracking-widest border border-slate-700 px-1 rounded">Admin</span>
                        </span>
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
                        onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm">Logout Admin</span>
                    </button>

                    <div className="mt-6 flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                        <img 
                            src={JSON.parse(localStorage.getItem('user'))?.user_profile || userAvatarImg} 
                            alt="Admin" 
                            className="w-10 h-10 rounded-lg border border-white/10 bg-white" 
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{JSON.parse(localStorage.getItem('user'))?.first_name || 'Admin'}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 w-0"> {/* w-0 to fix flex overflow */}

                {/* Topbar */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-96 focus-within:border-neon-blue/50 transition-colors">
                        <Search className="w-4 h-4 text-slate-500 mr-3" />
                        <input
                            type="text"
                            placeholder="Type to search..."
                            className="bg-transparent border-none text-white text-sm placeholder-slate-500 focus:outline-none w-full font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationDropdown color="neon-green" />
                    </div>
                </header>

                {/* Page Content */}
                <main 
                    key={location.pathname} 
                    className="flex-1 overflow-y-auto p-8 scrollbar-hide"
                >
                    <Suspense fallback={<PremiumLoader />}>
                        <Outlet />
                    </Suspense>
                </main>

            </div>
        </div>
    );
}
