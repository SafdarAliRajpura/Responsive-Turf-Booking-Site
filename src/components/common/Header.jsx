import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Menu, Bell, LogOut, LayoutDashboard, User as UserIcon, MessageSquare, Heart, Calendar, Search, MapPin, Trophy, Target } from 'lucide-react';
import userAvatarImg from '../../assets/images/common/user-avatar.jpg';
import { useNotifications } from '../../context/NotificationContext';
import NotificationToast from './NotificationToast';
import apiClient from '../../utils/apiClient';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Search State
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const searchRef = React.useRef(null);

    // Debounced Search Logic
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const res = await apiClient.get(`/search?query=${searchQuery}`);
                    if (res.data?.success) setSearchResults(res.data.data);
                } catch (err) {
                    console.error('Search failed', err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Close search on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get user data from local storage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userProfilePic = user?.user_profile || userAvatarImg;

    const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'LIKE': return <Heart className="w-4 h-4 text-neon-pink fill-current" />;
            case 'COMMENT': return <MessageSquare className="w-4 h-4 text-neon-blue" />;
            case 'BOOKING': return <Calendar className="w-4 h-4 text-neon-green" />;
            default: return <Bell className="w-4 h-4 text-white" />;
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                    <div className="w-10 h-10 bg-gradient-to-tr from-neon-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-neon-green/20">
                        <Zap className="w-6 h-6 text-black fill-current" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">
                        TURF<span className="text-neon-green">X</span>
                    </span>
                </div>

                <div className="hidden lg:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
                    <div className="relative w-full group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl opacity-20 group-hover:opacity-100 transition duration-500 blur" />
                        <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-2 hover:border-white/20 transition-all">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-neon-green transition-colors" />
                            <input 
                                type="text"
                                placeholder="Global Pulse Search..."
                                value={searchQuery}
                                onFocus={() => setShowSearch(true)}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-white text-xs font-bold placeholder-slate-600 focus:outline-none focus:ring-0 w-full px-4"
                            />
                            {isSearching && (
                                <div className="w-4 h-4 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearch && (searchQuery.length > 2) && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl z-[100] max-h-[70vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-300">
                            {searchResults.length > 0 ? (
                                <div className="p-2 space-y-1">
                                    {searchResults.map((item, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => {
                                                setShowSearch(false);
                                                if(item.type === 'Venue') navigate(`/venues/${item._id}`);
                                                else if(item.type === 'Tournament') navigate('/tournaments');
                                                else navigate('/profile');
                                            }}
                                            className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group/item text-left"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover/item:border-neon-green/30 transition-colors">
                                                {item.type === 'Venue' && <MapPin className="w-5 h-5 text-neon-pink" />}
                                                {item.type === 'Tournament' && <Trophy className="w-5 h-5 text-neon-yellow" />}
                                                {item.type === 'Player' && <Target className="w-5 h-5 text-neon-blue" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-bold text-white truncate">{item.name || `${item.first_name} ${item.last_name}`}</h4>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item.type}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 truncate">{item.location || (item.skillLevel ? `${item.skillLevel} Player` : 'Community Member')}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : !isSearching && (
                                <div className="p-12 text-center">
                                    <Search className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No matches found in the pulse</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <button
                        onClick={() => navigate('/home')}
                        className={`transition-colors ${isActive('/home') ? 'text-white text-shadow-neon' : 'hover:text-white'}`}
                        style={isActive('/home') ? { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' } : {}}
                    >
                        <span className={isActive('/home') ? 'text-neon-green' : ''}>Home</span>
                    </button>
                    <button
                        onClick={() => navigate('/venues')}
                        className={`transition-colors ${isActive('/venues') ? 'text-white' : 'hover:text-white'}`}
                        style={isActive('/venues') ? { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' } : {}}
                    >
                        <span className={isActive('/venues') ? 'text-neon-green' : ''}>Venues</span>
                    </button>
                    <button
                        onClick={() => navigate('/tournaments')}
                        className={`transition-colors ${isActive('/tournaments') ? 'text-white' : 'hover:text-white'}`}
                        style={isActive('/tournaments') ? { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' } : {}}
                    >
                        <span className={isActive('/tournaments') ? 'text-neon-green' : ''}>Tournaments</span>
                    </button>
                    <button
                        onClick={() => navigate('/community')}
                        className={`transition-colors ${isActive('/community') ? 'text-white' : 'hover:text-white'}`}
                        style={isActive('/community') ? { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' } : {}}
                    >
                        <span className={isActive('/community') ? 'text-neon-green' : ''}>Community</span>
                    </button>
                    <button
                        onClick={() => navigate('/bookings')}
                        className={`transition-colors ${isActive('/bookings') ? 'text-white' : 'hover:text-white'}`}
                        style={isActive('/bookings') ? { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' } : {}}
                    >
                        <span className={isActive('/bookings') ? 'text-neon-green' : ''}>My Bookings</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="group relative">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-neon-pink rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-slate-950 animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        <div className="absolute right-0 top-[calc(100%+0.5rem)] w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <h4 className="text-xs font-black uppercase tracking-widest text-white">Notifications</h4>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[10px] font-bold text-neon-blue hover:text-white transition-colors">Mark all read</button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif._id} 
                                            onClick={() => {
                                                markAsRead(notif._id);
                                                if(notif.link) navigate(notif.link);
                                            }}
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-neon-blue/5' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium line-clamp-2">
                                                    <span className="font-bold text-neon-blue">{notif.sender?.first_name || 'System'}</span> {notif.message}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-1">{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-neon-pink mt-2 flex-shrink-0" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm text-slate-500 italic">No alerts yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="group relative">
                        <button
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-purple-600 p-[2px] transition-transform hover:scale-105"
                        >
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                <img
                                    src={userProfilePic}
                                    alt="User"
                                    className="w-full h-full object-cover bg-white"
                                />
                            </div>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-12 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-white/5">
                                <p className="text-sm font-bold text-white truncate">{user ? `${user.first_name} ${user.last_name}` : 'Guest User'}</p>
                                <p className="text-[10px] text-neon-green uppercase font-black tracking-widest mt-1">{user?.role || 'Visitor'}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                {user && (
                                    <>
                                        <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                            <UserIcon className="w-4 h-4" /> Profile
                                        </button>
                                        {(user.role === 'partner' || user.role === 'admin') && (
                                            <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/partner/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neon-blue hover:text-white hover:bg-neon-blue/10 rounded-xl transition-colors">
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => {
                                                localStorage.clear();
                                                window.location.href = '/login';
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </>
                                )}
                                {!user && (
                                    <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neon-green hover:text-white hover:bg-neon-green/10 rounded-xl transition-colors">
                                        <LogOut className="w-4 h-4" /> Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="md:hidden text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <NotificationToast />
        </nav>
    );
};

export default Header;
