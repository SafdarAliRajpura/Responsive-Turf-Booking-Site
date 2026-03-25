import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Menu, Bell, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import userAvatarImg from '../../assets/images/common/user-avatar.jpg';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get user data from local storage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userProfilePic = user?.user_profile || userAvatarImg;

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
                    <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
                    </button>
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
                                                window.location.href = '/home';
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
        </nav>
    );
};

export default Header;
