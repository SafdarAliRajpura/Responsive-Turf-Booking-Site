import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, DollarSign, Clock, MapPin, ArrowRight, MoreHorizontal } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, trend, color }) => (
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
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-neon-green bg-neon-green/10' : 'text-red-500 bg-red-500/10'}`}>
                {trend === 'up' ? '+' : ''}{change}%
                <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
            </div>
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-black text-white tracking-tight">{value}</p>
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
            <div className="font-bold text-white">#{id}</div>
        </td>
        <td className="py-4 px-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm text-slate-300">{turf}</span>
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
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${status === 'Confirmed' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' :
                    status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-500'
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
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">
                        Welcome, <span className="text-neon-purple">{user?.first_name || 'Partner'}</span>
                    </h1>
                    <p className="text-slate-400">Overview of your business performance.</p>
                </div>
                <div className="hidden md:flex items-center gap-4 bg-slate-900/50 p-2 pr-6 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white">
                         <img src={user?.user_profile || 'https://api.dicebear.com/7.x/micah/svg?seed=42'} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-tight">{user?.first_name} {user?.last_name}</p>
                        <p className="text-[10px] text-neon-purple font-black tracking-widest uppercase">Verified Partner</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={DollarSign}
                    title="Total Revenue"
                    value="₹1,24,500"
                    change="12.5"
                    trend="up"
                    color="neon-green"
                />
                <StatCard
                    icon={Calendar}
                    title="Total Bookings"
                    value="1,204"
                    change="8.2"
                    trend="up"
                    color="neon-blue"
                />
                <StatCard
                    icon={Users}
                    title="Active Customers"
                    value="845"
                    change="5.3"
                    trend="up"
                    color="neon-purple"
                />
                <StatCard
                    icon={Clock}
                    title="Avg. Occupancy"
                    value="78%"
                    change="-2.1"
                    trend="down"
                    color="neon-pink"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
                        <button className="text-sm font-bold text-neon-purple hover:text-white transition-colors flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-4 px-4">ID</th>
                                    <th className="pb-4 px-4">Turf</th>
                                    <th className="pb-4 px-4">Customer</th>
                                    <th className="pb-4 px-4">Time</th>
                                    <th className="pb-4 px-4">Status</th>
                                    <th className="pb-4 px-4">Amount</th>
                                    <th className="pb-4 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <BookingRow id="3024" turf="Urban Arena A" customer="Rahul S." time="Today, 18:00" status="Confirmed" amount="1200" />
                                <BookingRow id="3023" turf="Urban Arena B" customer="Mike T." time="Today, 20:00" status="Pending" amount="1500" />
                                <BookingRow id="3022" turf="Sky Turf" customer="Priya K." time="omorrow, 07:00" status="Confirmed" amount="800" />
                                <BookingRow id="3021" turf="Urban Arena A" customer="Amit J." time="Tomorrow, 19:00" status="Cancelled" amount="1200" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Alerts */}
                <div className="space-y-6">
                    {/* Visual Card */}
                    <div className="bg-gradient-to-br from-neon-purple/20 to-fuchsia-600/20 border border-neon-purple/30 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm -z-10" />
                        <h3 className="text-lg font-bold text-white mb-2">Marketing Boost</h3>
                        <p className="text-sm text-slate-300 mb-4">Promote your empty slots for the weekend with a 20% discount blast.</p>
                        <button className="w-full py-3 bg-neon-purple text-white font-bold rounded-xl shadow-lg shadow-neon-purple/20 hover:bg-fuchsia-600 transition-colors">
                            Launch Campaign
                        </button>
                    </div>

                    {/* Alerts List */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Alerts</h3>
                        <div className="space-y-4">
                            {[
                                { title: "New Review", desc: "You received a 5-star rating!", time: "2m ago", color: "neon-yellow" },
                                { title: "Maintenance", desc: "Turf B scheduled for cleaning.", time: "1h ago", color: "neon-blue" },
                                { title: "System Update", desc: "New booking features available.", time: "5h ago", color: "neon-green" }
                            ].map((alert, i) => (
                                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className={`w-2 h-2 mt-2 rounded-full bg-${alert.color} shadow-[0_0_8px_currentColor]`} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                                        <p className="text-xs text-slate-400">{alert.desc}</p>
                                        <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold">{alert.time}</p>
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
