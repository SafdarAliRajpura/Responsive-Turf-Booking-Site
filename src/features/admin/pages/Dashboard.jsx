import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, TrendingUp, DollarSign, Calendar,
    ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-${color}/20 transition-all`} />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl bg-${color}/10 border border-${color}/20 text-${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg border ${trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {trendValue}
            </div>
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    </motion.div>
);

export default function Dashboard() {
    // Mock Data
    const bookings = [
        { id: 1, user: "Rahul S.", venue: "Urban Arena", time: "2h ago", amount: "₹1,200", status: "Confirmed" },
        { id: 2, user: "Priya M.", venue: "Smash Court", time: "4h ago", amount: "₹800", status: "Given" },
        { id: 3, user: "Team Vikings", venue: "Salt Lake Stadium", time: "5h ago", amount: "₹3,500", status: "Confirmed" },
        { id: 4, user: "Amit K.", venue: "Oval Maidan", time: "1d ago", amount: "₹500", status: "Cancelled" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">DASHBOARD</h1>
                    <p className="text-slate-400">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-900 border border-white/10 text-slate-300 rounded-xl font-bold text-sm hover:text-white hover:border-white/30 transition-all">
                        Last 7 Days
                    </button>
                    <button className="px-4 py-2 bg-neon-blue text-black rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg shadow-neon-blue/20">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹4,25,000"
                    trend="up"
                    trendValue="+12.5%"
                    icon={DollarSign}
                    color="neon-green"
                />
                <StatCard
                    title="Total User"
                    value="2,450"
                    trend="up"
                    trendValue="+8.2%"
                    icon={Users}
                    color="neon-blue"
                />
                <StatCard
                    title="Active Bookings"
                    value="142"
                    trend="up"
                    trendValue="+24%"
                    icon={Calendar}
                    color="neon-purple"
                />
                <StatCard
                    title="Growth Rate"
                    value="18.4%"
                    trend="down"
                    trendValue="-2.1%"
                    icon={TrendingUp}
                    color="neon-pink"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Chart Area (Visual Mockup) */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* CSS Bar Chart Simulation */}
                    <div className="h-64 flex items-end justify-between gap-4">
                        {[40, 65, 30, 85, 55, 90, 45, 75, 60, 95, 50, 80].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                className="w-full bg-slate-800 rounded-t-lg relative group cursor-pointer hover:bg-neon-blue/50 transition-colors"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span>Jan</span><span>Fab</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Recent Bookings</h2>
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs">
                                        {booking.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm group-hover:text-neon-blue transition-colors">{booking.user}</p>
                                        <p className="text-xs text-slate-500">{booking.venue}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white text-sm">{booking.amount}</p>
                                    <p className={`text-[10px] font-bold uppercase ${booking.status === 'Confirmed' ? 'text-emerald-500' :
                                            booking.status === 'Cancelled' ? 'text-red-500' : 'text-slate-500'
                                        }`}>{booking.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-white/5 border border-white/5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        View All Activity
                    </button>
                </div>

            </div>

        </div>
    );
}
