import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, IndianRupee, Clock, MapPin, ArrowRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../utils/apiClient';

const StatCard = ({ icon: Icon, title, value, change, trend, color, isLoading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-all"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-${color}/10 transition-colors`} />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            {!isLoading && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-neon-green bg-neon-green/10' : 'text-red-500 bg-red-500/10'}`}>
                    {trend === 'up' ? '+' : ''}{change}%
                    <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
                </div>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
            {isLoading ? (
                <div className="h-8 w-24 bg-slate-800 rounded animate-pulse" />
            ) : (
                <p className="text-3xl font-black text-white tracking-tight">{value}</p>
            )}
        </div>
    </motion.div>
);

const BookingRow = ({ id, turf, customer, time, status, amount }) => (
    <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors"
    >
        <td className="py-4 px-4">
            <div className="font-bold text-white text-xs truncate max-w-[60px]">#{id.slice(-6)}</div>
        </td>
        <td className="py-4 px-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm text-slate-300 font-bold truncate max-w-[100px]">{turf}</span>
            </div>
        </td>
        <td className="py-4 px-4 text-sm text-slate-300">{customer}</td>
        <td className="py-4 px-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {time}
            </div>
        </td>
        <td className="py-4 px-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                status === 'Confirmed' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' :
                status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
                {status}
            </span>
        </td>
        <td className="py-4 px-4 font-bold text-white">₹{amount}</td>
        <td className="py-4 px-4 text-right">
            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </td>
    </motion.tr>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ revenue: 0, bookings: 0, customers: 0, occupancy: '0%' });
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await apiClient.get('/analytics/dashboard');
                const data = res.data;
                
                if (data.success) {
                    const metrics = data.data;

                    setStats({
                        revenue: `₹${metrics.totalRevenue.toLocaleString()}`,
                        bookings: metrics.totalBookings,
                        customers: metrics.activePlayers,
                        occupancy: metrics.occupancyPercentage || '0%',
                        trends: metrics.trends
                    });
                    setRecentBookings(metrics.recentBookings);
                }
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">
                        Welcome, <span className="text-neon-purple leading-tight">{user?.first_name || 'Fleet Leader'}</span>
                    </h1>
                    <p className="text-slate-400">Your Business Intelligence Console.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={IndianRupee}
                    title="Total Revenue"
                    value={stats.revenue}
                    change={stats.trends?.revenue || 0} trend={stats.trends?.revenue >= 0 ? 'up' : 'down'} color="neon-green" isLoading={isLoading}
                />
                <StatCard
                    icon={Calendar}
                    title="Total Bookings"
                    value={stats.bookings}
                    change={stats.trends?.bookings || 0} trend={stats.trends?.bookings >= 0 ? 'up' : 'down'} color="neon-blue" isLoading={isLoading}
                />
                <StatCard
                    icon={Users}
                    title="Unique Players"
                    value={stats.customers}
                    change={stats.trends?.players || 0} trend={stats.trends?.players >= 0 ? 'up' : 'down'} color="neon-purple" isLoading={isLoading}
                />
                <StatCard
                    icon={Clock}
                    title="Avg. Occupancy"
                    value={stats.occupancy}
                    change={stats.trends?.occupancy || 0} trend={stats.trends?.occupancy >= 0 ? 'up' : 'down'} color="neon-pink" isLoading={isLoading}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Recent Activity</h2>
                        <button onClick={() => navigate('/partner/bookings')} className="text-sm font-bold text-neon-purple hover:text-white transition-colors flex items-center gap-1">
                            Operational Hub <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-4 px-4">ID</th>
                                    <th className="pb-4 px-4">Stadia</th>
                                    <th className="pb-4 px-4">Player</th>
                                    <th className="pb-4 px-4">Schedule</th>
                                    <th className="pb-4 px-4">Status</th>
                                    <th className="pb-4 px-4">Amount</th>
                                    <th className="pb-4 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7" className="py-8 text-center text-slate-500">Retrieving business matrix...</td></tr>
                                ) : recentBookings.length === 0 ? (
                                    <tr><td colSpan="7" className="py-12 text-center text-slate-500">No recent operational data.</td></tr>
                                ) : (
                                    recentBookings.map((b) => (
                                        <BookingRow 
                                            key={b._id} 
                                            id={b._id} 
                                            turf={b.turfName} 
                                            customer={b.user} 
                                            time={b.date} 
                                            status={b.status} 
                                            amount={b.price} 
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Strategy */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-neon-purple/20 to-fuchsia-600/20 border border-neon-purple/30 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm -z-10" />
                        <h3 className="text-lg font-black text-white mb-2 uppercase italic tracking-tighter">Growth Strategy</h3>
                        <p className="text-sm text-slate-400 mb-4 font-medium">Boost weekend occupancy. Launch targeted slot discounts for late-night strikers.</p>
                        <button className="w-full py-4 bg-neon-purple text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-neon-purple/20 hover:bg-white transition-all">
                            Enable Boost
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-lg font-black text-white mb-4 uppercase italic tracking-tighter">System Metrics</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Revenue Flow", desc: "Transactions optimized.", time: "Live", color: "neon-yellow" },
                                { title: "Maintenance", desc: "System check complete.", time: "Clean", color: "neon-blue" },
                                { title: "New Feature", desc: "Analytics v2.0 deployed.", time: "Today", color: "neon-green" }
                            ].map((alert, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                    <div className={`w-2 h-2 mt-1.5 rounded-full bg-${alert.color} shadow-[0_0_8px_currentColor] animate-pulse`} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-none mb-1">{alert.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{alert.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
