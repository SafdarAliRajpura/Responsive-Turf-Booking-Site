import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, User, Ban, CheckCircle, Building2, XCircle, Clock } from 'lucide-react';
import userAvatar from '../../../assets/images/common/user-avatar.jpg';
import Toast from '../../../components/ui/Toast';

export default function Users() {
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('User'); // 'User' or 'Partner'
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [banConfirmation, setBanConfirmation] = useState(null);
    const [processingId, setProcessingId] = useState(null);

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
                    name: user.first_name || 'Guest User',
                    email: user.email,
                    profile: user.user_profile || null,
                    role: user.role === 'partner' ? 'Partner' : 'User',
                    status: user.isBanned ? 'Banned' : (!user.isApproved && user.role === 'partner') ? 'Pending' : 'Active',
                    isApproved: user.isApproved,
                    joined: new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    mobileNumber: user.mobileNumber || 'N/A'
                })));
            } else {
                setToast({ message: data.message || "Unauthorized access.", type: 'error' });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setToast({ message: "Network error or Server issue", type: 'error' });
        } finally {
            // Loading handled by fetch state
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePartnerApproval = async (userId, action) => {
        setProcessingId(userId);
        try {
            const method = action === 'approve' ? 'PUT' : 'DELETE';
            const endpoint = action === 'approve' ? 'approve-partner' : 'reject-partner';
            
            const response = await fetch(`http://localhost:5000/api/users/${userId}/${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setToast({ message: data.message, type: 'success' });
                fetchUsers(); // Refresh list
            } else {
                setToast({ message: data.message || 'Operation failed', type: 'error' });
            }
        } catch (e) {
            setToast({ message: 'Server communication error', type: 'error' });
        } finally {
            setProcessingId(null);
            setActiveDropdown(null);
        }
    };

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic uppercase italic -skew-x-6 pb-1 border-b-4 border-neon-green/30 inline-block">MEMBER BASE</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Elite Scrutiny & Management Hub</p>
                </div>
                <div className="flex bg-slate-900 border border-white/5 p-1 rounded-2xl">
                    <button onClick={() => setFilter('User')} className={`px-8 py-3 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'User' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-slate-500 hover:text-white'}`}>
                        <User size={14} /> Athletes
                    </button>
                    <button onClick={() => setFilter('Partner')} className={`px-8 py-3 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'Partner' ? 'bg-neon-green text-black shadow-xl shadow-neon-green/20' : 'text-slate-500 hover:text-white'}`}>
                        <Building2 size={14} /> Partners
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Athletes', val: users.filter(u=>u.role==='User').length, color: 'text-white' },
                    { label: 'Active Partners', val: users.filter(u=>u.role==='Partner' && u.isApproved).length, color: 'text-neon-green' },
                    { label: 'Pending Apps', val: users.filter(u=>u.role==='Partner' && !u.isApproved).length, color: 'text-neon-blue animate-pulse' },
                    { label: 'Restricted', val: users.filter(u=>u.status==='Banned').length, color: 'text-red-500' }
                ].map((s,i)=>(
                    <div key={i} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{s.label}</p>
                        <h4 className={`text-2xl font-black italic italic ${s.color}`}>{s.val}</h4>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full">
                        <Search className="w-5 h-5 text-slate-700 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder={`Global Search ${filter} Core...`} className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white text-xs font-bold focus:border-neon-green/50 focus:outline-none" />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-600 uppercase text-[10px] font-black tracking-[0.2em]">
                        <tr>
                            <th className="px-8 py-5">Identity</th>
                            <th className="px-8 py-5">Access Rank</th>
                            <th className="px-8 py-5">Field Status</th>
                            <th className="px-8 py-5">Enlisted</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.filter(u => u.role === filter).map((user, index) => (
                            <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 overflow-hidden border border-white/10 ${user.role === 'Partner' ? 'rounded-2xl' : 'rounded-full'}`}>
                                            <img src={user.profile || userAvatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm tracking-tight uppercase italic">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${user.role === 'Partner' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20' : 'bg-slate-800/50 text-slate-400 border-white/10'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : user.status === 'Banned' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20 animate-pulse'}`}>
                                        {user.status === 'Active' ? <CheckCircle size={12}/> : user.status === 'Banned' ? <Ban size={12}/> : <Clock size={12}/>}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-xs text-slate-500 font-bold">{user.joined}</td>
                                <td className="px-8 py-5 text-right relative dropdown-container">
                                    <button onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)} className="p-3 text-slate-700 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                        <MoreVertical size={16} />
                                    </button>
                                    
                                    <AnimatePresence>
                                    {activeDropdown === user.id && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-12 top-10 w-56 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden text-left">
                                            {user.status === 'Pending' ? (
                                                <>
                                                    <button onClick={() => handlePartnerApproval(user.id, 'approve')} className="w-full px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 hover:bg-emerald-400/10 transition-colors flex items-center gap-3">
                                                        <CheckCircle size={14} /> {processingId === user.id ? 'Approving...' : 'Approve Partner'}
                                                    </button>
                                                    <button onClick={() => handlePartnerApproval(user.id, 'reject')} className="w-full px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3 border-t border-white/5">
                                                        <XCircle size={14} /> {processingId === user.id ? 'Rejecting...' : 'Decline Request'}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => openProfileSidebar(user)} className="w-full px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                                                        <User size={14} /> Inspect Profile
                                                    </button>
                                                    <button onClick={() => setBanConfirmation({ userId: user.id, name: user.name, status: user.status })} className={`w-full px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-3 border-t border-white/5 ${user.status === 'Banned' ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-red-500 hover:bg-red-500/10'}`}>
                                                        {user.status === 'Banned' ? <CheckCircle size={14} /> : <Ban size={14} />}
                                                        {user.status === 'Banned' ? 'Restore Access' : 'Terminate Access'}
                                                    </button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {users.filter(u => u.role === filter).length === 0 && (
                    <div className="text-center py-24 text-slate-700 font-black uppercase text-[10px] tracking-widest">Base is Currently Empty</div>
                )}
            </div>

            {/* Profile Sidebar & Modal logic remains identical but UI refined to match theme */}
            <AnimatePresence>
                {isSidebarOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="w-full max-w-lg bg-slate-900 border-l border-white/5 shadow-2xl relative z-10 flex flex-col h-full overflow-y-auto">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950">
                                <h2 className="text-2xl font-black italic uppercase italic text-white tracking-widest">Scrutiny Report</h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/5 rounded-full text-slate-500">
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className="p-10 flex flex-col items-center">
                                <div className={`w-32 h-32 border-4 border-white/5 shadow-2xl overflow-hidden mb-8 ${selectedUser.role === 'Partner' ? 'rounded-[2rem]' : 'rounded-full'}`}>
                                    <img src={selectedUser.profile || userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-3xl font-black italic uppercase italic text-white mb-2">{selectedUser.name}</h3>
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-10 ${selectedUser.role === 'Partner' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20' : 'bg-slate-800 text-slate-500'}`}>{selectedUser.role} Account</span>
                                
                                <div className="w-full space-y-4">
                                    {[
                                        { l: 'Business Email', v: selectedUser.email },
                                        { l: 'Contact Node', v: selectedUser.mobileNumber },
                                        { l: 'Enlistment Date', v: selectedUser.joined },
                                        { l: 'Auth Status', v: selectedUser.status }
                                    ].map((row, i)=>(
                                        <div key={i} className="bg-slate-950 border border-white/5 rounded-2xl p-5">
                                            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">{row.l}</p>
                                            <p className="text-white font-bold">{row.v}</p>
                                        </div>
                                    ))}
                                </div>

                                {selectedUser.status === 'Pending' && (
                                    <div className="grid grid-cols-2 gap-4 w-full mt-10">
                                        <button onClick={() => handlePartnerApproval(selectedUser.id, 'approve')} className="py-5 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all">Command Approve</button>
                                        <button onClick={() => handlePartnerApproval(selectedUser.id, 'reject')} className="py-5 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all">Scrutiny Reject</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Ban Modal simplified */}
            <AnimatePresence>
                {banConfirmation && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-lg" onClick={() => setBanConfirmation(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-slate-900 border border-white/10 rounded-[3rem] p-10 max-w-sm w-full text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <Ban className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-3xl font-black italic uppercase italic text-white mb-2">RESTRICT ACCESS?</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">Are you sure you want to terminate field access for {banConfirmation.name}?</p>
                            <div className="flex gap-4">
                                <button onClick={() => setBanConfirmation(null)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl focus:outline-none">Abort</button>
                                <button onClick={() => toggleBanStatus(banConfirmation.userId, banConfirmation.status)} className="flex-1 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-500/20">Execute</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: null })} />
        </div>
    );
}
