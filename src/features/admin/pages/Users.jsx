import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Shield, User, Ban, CheckCircle } from 'lucide-react';
import userAvatar from '../../../assets/images/common/user-avatar.jpg';

export default function Users() {
    // Mock Users Data
    const [users] = useState([
        { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "User", status: "Active", joined: "12 Aug 2024" },
        { id: 2, name: "Priya Malik", email: "priya@example.com", role: "User", status: "Active", joined: "14 Aug 2024" },
        { id: 3, name: "Amit Admin", email: "amit@turfx.com", role: "Admin", status: "Active", joined: "01 Jan 2024" },
        { id: 4, name: "Vikram Singh", email: "vikram@example.com", role: "User", status: "Banned", joined: "20 July 2024" },
        { id: 5, name: "Sneha Patel", email: "sneha@example.com", role: "User", status: "Inactive", joined: "05 Aug 2024" },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">USER MANAGEMENT</h1>
                    <p className="text-slate-400">Manage user access and roles.</p>
                </div>
                <button className="px-4 py-2 bg-neon-green text-black font-bold rounded-xl hover:bg-white transition-colors">
                    + Add New User
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-neon-green/50 focus:outline-none"
                    />
                </div>
                <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>User</option>
                </select>
                <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-slate-300 focus:outline-none">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Banned</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
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
                        {users.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                                            <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${user.role === 'Admin'
                                            ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20'
                                            : 'bg-slate-800 text-slate-400 border-white/5'
                                        }`}>
                                        {user.role === 'Admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
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
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
