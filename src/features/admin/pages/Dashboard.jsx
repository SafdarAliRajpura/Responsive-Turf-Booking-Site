import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, TrendingUp, IndianRupee, Calendar,
    ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }) => {
    const colorMap = {
        'neon-green': {
            bg: 'bg-neon-green/10',
            border: 'border-neon-green/20',
            text: 'text-neon-green',
            glow: 'bg-neon-green/10'
        },
        'neon-blue': {
            bg: 'bg-neon-blue/10',
            border: 'border-neon-blue/20',
            text: 'text-neon-blue',
            glow: 'bg-neon-blue/10'
        },
        'neon-purple': {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            text: 'text-purple-500',
            glow: 'bg-purple-500/10'
        },
        'neon-pink': {
            bg: 'bg-neon-pink/10',
            border: 'border-neon-pink/20',
            text: 'text-neon-pink',
            glow: 'bg-neon-pink/10'
        }
    };

    const styles = colorMap[color] || colorMap['neon-blue'];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${styles.glow} rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-100 transition-all`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${styles.bg} border ${styles.border} ${styles.text}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {title === "System Status" && (
                    <div className="flex items-center text-xs font-bold px-2 py-1 rounded-lg border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        Live
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-3xl font-black text-white">{value}</p>
            </div>
        </motion.div>
    );
};

export default function Dashboard() {
    const [stats, setStats] = useState({ 
        revenue: 0, 
        users: 0, 
        totalUsers: 0,
        bookings: 0, 
        trends: { revenue: 0, players: 0, bookings: 0 },
        systemStatus: 'Optimal',
        chartData: []
    });
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch('http://localhost:5000/api/analytics/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success) {
                    const metrics = data.data;
                    setStats({
                        revenue: metrics.totalRevenue,
                        users: metrics.activePlayers,
                        totalUsers: metrics.totalUsers,
                        bookings: metrics.totalBookings,
                        trends: metrics.trends,
                        systemStatus: metrics.systemStatus || 'Optimal',
                        chartData: metrics.chartData || []
                    });
                    setBookings(metrics.recentBookings);
                }
            } catch (err) {
                console.error("Admin Dashboard fetch failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper to format currency
    const formatCurrency = (val) => `₹${Number(val).toLocaleString()}`;
    const formatTrend = (val) => `${val >= 0 ? '+' : ''}${val}%`;

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
                    value={isLoading ? "..." : formatCurrency(stats.revenue)}
                    trend={stats.trends.revenue >= 0 ? 'up' : 'down'}
                    trendValue={formatTrend(stats.trends.revenue)}
                    icon={IndianRupee}
                    color="neon-green"
                />
                <StatCard
                    title="Total Users"
                    value={isLoading ? "..." : stats.totalUsers || stats.users}
                    trend={stats.trends.players >= 0 ? 'up' : 'down'}
                    trendValue={formatTrend(stats.trends.players)}
                    icon={Users}
                    color="neon-blue"
                />
                <StatCard
                    title="Total Bookings"
                    value={isLoading ? "..." : stats.bookings}
                    trend={stats.trends.bookings >= 0 ? 'up' : 'down'}
                    trendValue={formatTrend(stats.trends.bookings)}
                    icon={Calendar}
                    color="neon-purple"
                />
                <StatCard
                    title="System Status"
                    value={stats.systemStatus}
                    trend="up"
                    trendValue="Live"
                    icon={TrendingUp}
                    color="neon-pink"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* CSS Bar Chart with Real Data */}
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                        {stats.chartData.length > 0 ? stats.chartData.map((data, i) => {
                            // Calculate height relative to max revenue
                            const maxRevenue = Math.max(...stats.chartData.map(d => d.revenue), 100);
                            const h = (data.revenue / maxRevenue) * 100;
                            
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(h, 5)}%` }} // Minimum 5% height for visual
                                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                    className="w-full bg-slate-800 rounded-t-lg relative group cursor-pointer hover:bg-neon-blue/50 transition-colors"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        ₹{data.revenue.toLocaleString()}
                                    </div>
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase">
                                        {data.month}
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 italic">
                                No revenue data for chart
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Recent Bookings</h2>
                    <div className="space-y-6">
                        {isLoading ? (
                            <p className="text-slate-500 text-sm text-center py-4">Loading bookings...</p>
                        ) : bookings.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-4">No recent activity.</p>
                        ) : bookings.map((booking) => {
                            const displayName = booking.userId ? `${booking.userId.first_name} ${booking.userId.last_name}` : booking.user;
                            const userAvatar = booking.userId?.user_profile;
                            
                            return (
                                <div key={booking._id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                                            {userAvatar ? (
                                                <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                                    {displayName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm group-hover:text-neon-blue transition-colors">{displayName}</p>
                                            <p className="text-xs text-slate-500">{booking.turfName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white text-sm">₹{booking.price}</p>
                                        <p className={`text-[10px] font-bold uppercase ${booking.status.toLowerCase() === 'confirmed' ? 'text-emerald-500' :
                                                booking.status.toLowerCase() === 'cancelled' || booking.status.toLowerCase() === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                                            }`}>{booking.status}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button className="w-full mt-8 py-3 bg-white/5 border border-white/5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        View All Activity
                    </button>
                </div>

            </div>

        </div>
    );
}
