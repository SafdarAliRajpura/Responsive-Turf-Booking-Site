import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Menu, Bell } from 'lucide-react';
import userAvatarImg from '../../assets/images/common/user-avatar.jpg';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img
                                src={userAvatarImg}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
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
