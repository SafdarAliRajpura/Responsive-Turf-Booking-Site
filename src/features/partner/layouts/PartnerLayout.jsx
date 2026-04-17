import React, { Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, MapPin, Calendar, Settings,
    LogOut, Bell, Search, Briefcase, Plus, TrendingUp, Trophy, Maximize
} from 'lucide-react';
import NotificationDropdown from '../../../components/common/NotificationDropdown';
import apiClient from '../../../utils/apiClient';
import userAvatarImg from '../../../assets/images/common/avatar-1.jpg'; // Placeholder for partner avatar
import carbonFibrePattern from '../../../assets/images/common/carbon-fibre.png';
import PremiumLoader from '../../../components/ui/PremiumLoader';

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
    const [searchQuery, setSearchQuery] = React.useState('');
    const [results, setResults] = React.useState({ venues: [], tournaments: [] });
    const [allData, setAllData] = React.useState({ venues: [], tournaments: [] });
    const [showResults, setShowResults] = React.useState(false);

    // Enhanced Security Check - Defined at component level for scope
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    React.useEffect(() => {
        if (!user || (user.role.toLowerCase() !== 'partner' && user.role.toLowerCase() !== 'admin')) {
            navigate('/partner/login');
        } else if (user.role.toLowerCase() === 'partner' && !user.isOnboarded) {
            navigate('/partner/onboarding');
        } else {
            // Pre-fetch all searchable data
            const fetchData = async () => {
                try {
                    const [vRes, tRes] = await Promise.all([
                        apiClient.get(`/venues?owner=${user.id || user._id}`),
                        apiClient.get('/tournaments/my-tournaments')
                    ]);
                    setAllData({
                        venues: vRes.data.data || [],
                        tournaments: tRes.data.data || []
                    });
                } catch (e) {
                    console.error("Search data fetch failed", e);
                }
            };
            fetchData();
        }
    }, [navigate, user?.id, user?._id]); // Stable dependencies

    React.useEffect(() => {
        if (!searchQuery.trim()) {
            setResults({ venues: [], tournaments: [] });
            return;
        }

        const query = searchQuery.toLowerCase();
        const filteredVenues = allData.venues.filter(v => 
            v.name.toLowerCase().includes(query) || v.location.toLowerCase().includes(query)
        ).slice(0, 4);

        const filteredTournaments = allData.tournaments.filter(t => 
            t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)
        ).slice(0, 4);

        setResults({ venues: filteredVenues, tournaments: filteredTournaments });
    }, [searchQuery, allData]);

    if (!user || (user.role.toLowerCase() !== 'partner' && user.role.toLowerCase() !== 'admin')) {
        return null; // Or a loading spinner
    }

    if (user.role.toLowerCase() === 'partner' && !user.isOnboarded) {
        return null; // prevent rendering layout while redirecting
    }

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/partner/dashboard' },
        { icon: MapPin, label: 'My Turfs', path: '/partner/turfs' },
        { icon: Calendar, label: 'Bookings', path: '/partner/bookings' },
        { icon: Maximize, label: 'Entry Scanner', path: '/partner/scanner' },
        { icon: Trophy, label: 'Tournaments', path: '/partner/tournaments' },
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
                        <button
                            onClick={() => navigate('/partner/turfs/add')}
                            className="w-full py-3 bg-neon-purple text-white font-bold rounded-xl hover:bg-fuchsia-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20"
                        >
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
                        onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            navigate('/partner/login');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm">Log Out</span>
                    </button>

                    <div className="mt-6 flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                        <img 
                            src={JSON.parse(localStorage.getItem('user'))?.user_profile || userAvatarImg} 
                            alt="Partner" 
                            className="w-10 h-10 rounded-lg border border-white/10 bg-white" 
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{JSON.parse(localStorage.getItem('user'))?.first_name || 'Fleet Lead'}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{JSON.parse(localStorage.getItem('user'))?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 w-0">

                {/* Topbar */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-md sticky top-0 z-30">
                    <div className="relative">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    setShowResults(false);
                                    navigate(`/partner/turfs?search=${searchQuery}`);
                                }
                            }}
                            className="flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-96 focus-within:border-neon-purple/50 transition-colors"
                        >
                            <Search className="w-4 h-4 text-slate-500 mr-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onFocus={() => setShowResults(true)}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search your venues or tournaments..."
                                className="bg-transparent border-none text-white text-sm placeholder-slate-500 focus:outline-none w-full font-medium"
                            />
                        </form>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showResults && searchQuery.trim() && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                                    >
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                                            {results.venues.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Venues</h4>
                                                    {results.venues.map(v => (
                                                        <button
                                                            key={v._id}
                                                            onClick={() => {
                                                                setShowResults(false);
                                                                navigate(`/partner/turfs`);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                                                                <MapPin className="w-4 h-4 text-teal-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white group-hover:text-neon-purple transition-colors">{v.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">{v.location}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {results.tournaments.length > 0 && (
                                                <div className="mb-2">
                                                    <h4 className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tournaments</h4>
                                                    {results.tournaments.map(t => (
                                                        <button
                                                            key={t._id}
                                                            onClick={() => {
                                                                setShowResults(false);
                                                                navigate(`/partner/tournaments`);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
                                                                <Trophy className="w-4 h-4 text-neon-purple" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white group-hover:text-fuchsia-400 transition-colors">{t.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">{t.category} • {t.date}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {results.venues.length === 0 && results.tournaments.length === 0 && (
                                                <div className="py-8 text-center">
                                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No Matches Found</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
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
