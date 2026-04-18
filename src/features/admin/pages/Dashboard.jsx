import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, TrendingUp, IndianRupee, Calendar,
    ArrowUpRight, ArrowDownRight, MoreHorizontal, Shield,
    FileText, Zap, Share2, Target, Activity, Loader2, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color, isLoading }) => {
    const colorMap = {
        'neon-green': { bg: 'bg-neon-green/10', border: 'border-neon-green/20', text: 'text-neon-green', glow: 'bg-emerald-500/20' },
        'neon-blue': { bg: 'bg-neon-blue/10', border: 'border-neon-blue/20', text: 'text-neon-blue', glow: 'bg-neon-blue/20' },
        'neon-purple': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', glow: 'bg-purple-500/20' },
        'neon-pink': { bg: 'bg-neon-pink/10', border: 'border-neon-pink/20', text: 'text-neon-pink', glow: 'bg-neon-pink/20' }
    };

    const styles = colorMap[color] || colorMap['neon-blue'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.1)' }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group transition-all"
        >
            <div className={`absolute -right-4 -bottom-4 w-32 h-32 ${styles.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${styles.bg} border ${styles.border} ${styles.text} shadow-lg shadow-black/20`}>
                    <Icon className="w-6 h-6" />
                </div>
                {!isLoading && trendValue && (
                    <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg border ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {trendValue}
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
                {isLoading ? (
                    <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
                ) : (
                    <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
                )}
            </div>
        </motion.div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
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

    const [isExporting, setIsExporting] = useState(false);

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
                        systemStatus: 'Online',
                        chartData: metrics.last7Days || []
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

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const csvRows = [
                ['Metric', 'Value'],
                ['Total Revenue', `₹${stats.revenue}`],
                ['Total Bookings', stats.bookings],
                ['User Base', stats.totalUsers],
                ['', ''],
                ['Recent Bookings', '', ''],
                ['Date', 'Customer', 'Turf', 'Amount', 'Status'],
                ...bookings.map(b => [b.date, b.userId?.first_name || b.user, b.turfName, b.price, b.status])
            ];

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Master_Financial_Report_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
        }, 1500);
    };

    // Helper to format currency
    const formatCurrency = (val) => `₹${Math.round(Number(val)).toLocaleString()}`;
    const formatTrend = (val) => `${val >= 0 ? '+' : ''}${val}%`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">NETWORK <span className="text-neon-blue">DASHBOARD</span></h1>
                    <p className="text-slate-400 font-medium text-sm">Real-time overview of your sports empire.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-3 bg-slate-900 border border-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                        Last 7 Days
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-6 py-3 bg-neon-blue hover:bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-neon-blue/20 disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                        {isExporting ? 'Exporting...' : 'Export Master Report'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Network Revenue"
                    value={isLoading ? "..." : formatCurrency(stats.revenue)}
                    trend={stats.trends.revenue >= 0 ? 'up' : 'down'}
                    trendValue={formatTrend(stats.trends.revenue)}
                    icon={IndianRupee}
                    color="neon-green"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Admin Earnings (20%)"
                    value={isLoading ? "..." : formatCurrency(stats.revenue * 0.2)}
                    trend={stats.trends.revenue >= 0 ? 'up' : 'down'}
                    trendValue={formatTrend(stats.trends.revenue)}
                    icon={TrendingUp}
                    color="neon-purple"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Registered Players"
                    value={isLoading ? "..." : (stats.totalUsers || stats.users || 0)}
                    trend={stats.trends.players >= 0 ? 'up' : 'down'}
                    trendValue={formatTrend(stats.trends.players)}
                    icon={Users}
                    color="neon-blue"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Systems Status"
                    value={stats.systemStatus}
                    trend="up"
                    trendValue="Online"
                    icon={Shield}
                    color="neon-pink"
                    isLoading={isLoading}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Chart Area */}                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">Earnings Momentum</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Network Performance</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_10px_#60a5fa]" />
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontWeight={900} dy={10} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} fontWeight={900} width={60} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '16px', border: '1px solid #ffffff10' }}
                                    itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '12px' }}
                                    cursor={{ stroke: '#60a5fa', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#60a5fa" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorAdminRev)" 
                                    dot={{ r: 4, fill: '#60a5fa', strokeWidth: 2, stroke: '#020617' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-6 uppercase italic tracking-tighter">Live Reservations</h2>
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        {isLoading ? (
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center py-4">Loading Data Link...</p>
                        ) : bookings.length === 0 ? (
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center py-4">No recent activity found.</p>
                        ) : bookings.map((booking, idx) => {
                            const displayName = booking.userId ? `${booking.userId.first_name} ${booking.userId.last_name}` : booking.user;
                            const userAvatar = booking.userId?.user_profile;
                            
                            return (
                                <motion.div 
                                    key={booking._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-bold text-xs uppercase overflow-hidden shadow-lg">
                                            {userAvatar ? (
                                                <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400">
                                                    {displayName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-[13px] group-hover:text-neon-blue transition-colors">{displayName}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[120px]">{booking.turfName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-white text-xs italic tracking-tight">₹{booking.price}</p>
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${
                                            booking.status.toLowerCase() === 'confirmed' ? 'text-emerald-500' :
                                            booking.status.toLowerCase() === 'cancelled' || booking.status.toLowerCase() === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                                        }`}>{booking.status}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    <button 
                        onClick={() => navigate('/admin/bookings')}
                        className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Open Activity Hub
                    </button>
                </div>

            </div>

        </div>
    );
}
