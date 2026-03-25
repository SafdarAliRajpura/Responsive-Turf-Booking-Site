import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Shield, User, Ban, CheckCircle, Building2 } from 'lucide-react';
import userAvatar from '../../../assets/images/common/user-avatar.jpg';
import Toast from '../../../components/ui/Toast';

export default function Users() {
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('User'); // 'User' or 'Partner'
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [banConfirmation, setBanConfirmation] = useState(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    const filteredData = data.data.filter(u => u.role !== 'admin');
                    setUsers(filteredData.map(user => ({
                        id: user._id,
                        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
                        email: user.email,
                        profile: user.user_profile || null,
                        role: user.role === 'partner' ? 'Partner' : 'User',
                        status: user.isBanned ? 'Banned' : 'Active',
                        joined: new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        mobileNumber: user.mobileNumber || 'N/A'
                    })));
                } else {
                    console.warn("Fetch failed:", data.message);
                    setToast({ message: data.message || "Unauthorized access.", type: 'error' });
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setToast({ message: "Network error or Server issue", type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleBanStatus = async (userId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/ban`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.map(u => 
                    u.id === userId ? { ...u, status: data.data.isBanned ? 'Banned' : 'Active' } : u
                ));
            } else {
                setToast({ message: data.message || 'Failed to toggle ban status', type: 'error' });
            }
        } catch (error) {
            console.error('Error toggling ban status:', error);
            setToast({ message: 'Something went wrong!', type: 'error' });
        }
        setActiveDropdown(null);
        setBanConfirmation(null);
    };

    const openProfileSidebar = (user) => {
        setSelectedUser(user);
        setIsSidebarOpen(true);
        setActiveDropdown(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">USER MANAGEMENT</h1>
                    <p className="text-slate-400 font-medium">Manage access for your sports community.</p>
                </div>
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <button 
                        onClick={() => setFilter('User')}
                        className={`px-6 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all ${filter === 'User' ? 'bg-neon-green text-black shadow-lg shadow-neon-green/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        <User className="w-4 h-4" /> Regular Users
                    </button>
                    <button 
                        onClick={() => setFilter('Partner')}
                        className={`px-6 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all ${filter === 'Partner' ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Building2 className="w-4 h-4" /> Business Partners
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder={`Search ${filter}s...`}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-neon-green/50 focus:outline-none"
                    />
                </div>
                <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Banned</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-visible min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.filter(u => u.role === filter).map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 overflow-hidden border border-white/10 p-[1.5px] ${filter === 'Partner' ? 'rounded-2xl transition-all duration-300' : 'rounded-full'}`}>
                                            <div className="w-full h-full overflow-hidden rounded-[inherit] bg-white">
                                                <img 
                                                    src={user.profile || userAvatar} 
                                                    alt="" 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm tracking-tight uppercase italic">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                        user.role === 'Admin'
                                            ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20'
                                            : user.role === 'Partner'
                                                ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'
                                                : 'bg-slate-800 text-slate-400 border-white/5'
                                        }`}>
                                        {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                                        {user.role === 'Partner' && <Building2 className="w-3 h-3" />}
                                        {user.role === 'User' && <User className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            user.status === 'Banned' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-slate-800 text-slate-500 border-white/5'
                                        }`}>
                                        {user.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                                        {user.status === 'Banned' && <Ban className="w-3 h-3" />}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {user.joined}
                                </td>
                                <td className="px-6 py-4 text-right relative dropdown-container">
                                    <button 
                                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {activeDropdown === user.id && (
                                        <div className="absolute right-8 top-10 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl shadow-black/50 border border-white/10 overflow-hidden z-20 dropdown-menu">
                                            <button 
                                                onClick={() => openProfileSidebar(user)}
                                                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                            >
                                                <User className="w-4 h-4" />
                                                View Profile
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setBanConfirmation({ userId: user.id, name: user.name, status: user.status });
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 border-t border-white/5 ${
                                                    user.status === 'Banned' 
                                                    ? 'text-emerald-400 hover:bg-emerald-400/10' 
                                                    : 'text-red-400 hover:bg-red-400/10'
                                                }`}
                                            >
                                                {user.status === 'Banned' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                {user.status === 'Banned' ? 'Unban User' : 'Ban User'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Profile Sidebar Overlay */}
            {isSidebarOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl relative z-10 flex flex-col h-full overflow-y-auto"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur-md">
                            <h2 className="text-xl font-black text-white">User Profile</h2>
                            <button 
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-8 flex flex-col items-center">
                            <div className={`w-32 h-32 border-4 border-slate-800 shadow-2xl overflow-hidden mb-6 relative group ${selectedUser.role === 'Partner' ? 'rounded-[2rem]' : 'rounded-full'}`}>
                                <div className="w-full h-full overflow-hidden bg-white">
                                    <img src={selectedUser.profile || userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all cursor-pointer">
                                    <span className="text-xs text-white uppercase font-bold tracking-wider">View Full</span>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white mb-2">{selectedUser.name}</h3>
                            
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-8 ${
                                selectedUser.role === 'Admin'
                                    ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20'
                                    : selectedUser.role === 'Partner'
                                        ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'
                                        : 'bg-slate-800 text-slate-400 border-white/5'
                                }`}>
                                {selectedUser.role === 'Admin' && <Shield className="w-3 h-3" />}
                                {selectedUser.role === 'Partner' && <Building2 className="w-3 h-3" />}
                                {selectedUser.role === 'User' && <User className="w-3 h-3" />}
                                {selectedUser.role}
                            </span>
                            
                            <div className="w-full space-y-4">
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Email Address</p>
                                    <p className="text-white break-all">{selectedUser.email}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Phone Number</p>
                                    <p className="text-white">{selectedUser.mobileNumber}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Join Date</p>
                                    <p className="text-white">{selectedUser.joined}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Account Status</p>
                                        <p className="text-white">{selectedUser.status}</p>
                                    </div>
                                    <span className={`w-3 h-3 rounded-full shadow-sm ${selectedUser.status === 'Active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}></span>
                                </div>
                            </div>
                            
                            <div className="mt-8 w-full pt-6 border-t border-white/5 flex gap-3">
                                <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-colors">
                                    Message
                                </button>
                                <button 
                                    onClick={() => {
                                        setBanConfirmation({ userId: selectedUser.id, name: selectedUser.name, status: selectedUser.status });
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`flex-1 py-3 border rounded-xl font-bold transition-colors ${
                                        selectedUser.status === 'Banned' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                        : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                                    }`}
                                >
                                    {selectedUser.status === 'Banned' ? 'Unban User' : 'Ban User'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Premium Ban Confirmation Modal */}
            <AnimatePresence>
                {banConfirmation && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
                            onClick={() => setBanConfirmation(null)} 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-slate-900 border border-white/10 rounded-[2rem] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center overflow-hidden"
                        >
                            {/* Decorative glow behind icon */}
                            <div className={`absolute top-0 w-32 h-32 blur-[60px] rounded-full opacity-50 ${banConfirmation.status === 'Banned' ? 'bg-emerald-500' : 'bg-red-500'}`} />

                            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-2xl border ${banConfirmation.status === 'Banned' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20' : 'bg-red-500/20 text-red-500 border-red-500/50 shadow-red-500/20'}`}>
                                {banConfirmation.status === 'Banned' ? <CheckCircle className="w-10 h-10" /> : <Ban className="w-10 h-10" />}
                            </div>
                            
                            <h3 className="text-3xl font-black text-white mb-2 italic uppercase">
                                {banConfirmation.status === 'Banned' ? 'Unban' : 'Ban'} User?
                            </h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Are you sure you want to {banConfirmation.status === 'Banned' ? 'unban' : 'ban'} <span className="text-white font-bold">{banConfirmation.name}</span>? 
                                <br/>
                                <span className="text-xs mt-2 block opacity-70">
                                    {banConfirmation.status === 'Banned' ? 'They will instantly regain access to the platform.' : 'They will lose all frontend access immediately.'}
                                </span>
                            </p>
                            
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={() => setBanConfirmation(null)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        toggleBanStatus(banConfirmation.userId, banConfirmation.status);
                                        setBanConfirmation(null);
                                    }}
                                    className={`flex-1 py-4 rounded-xl font-black uppercase tracking-wider shadow-lg transition-all hover:scale-105 ${banConfirmation.status === 'Banned' ? 'bg-emerald-500 text-black hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-red-500 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
