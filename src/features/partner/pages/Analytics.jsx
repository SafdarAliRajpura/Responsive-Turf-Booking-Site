import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Share2, Download, FileText, Loader2, CheckCircle } from 'lucide-react';

const data = [
    { name: 'Mon', revenue: 4000, bookings: 24 },
    { name: 'Tue', revenue: 3000, bookings: 13 },
    { name: 'Wed', revenue: 2000, bookings: 9 },
    { name: 'Thu', revenue: 2780, bookings: 39 },
    { name: 'Fri', revenue: 1890, bookings: 48 },
    { name: 'Sat', revenue: 2390, bookings: 38 },
    { name: 'Sun', revenue: 3490, bookings: 43 },
];

const turfPerformance = [
    { name: 'Neon Arena Main', value: 400, color: '#a855f7' }, // neon-purple
    { name: 'Sky Badminton', value: 300, color: '#39ff14' },   // neon-green
    { name: 'Box Cricket', value: 300, color: '#00f3ff' },     // neon-blue
    { name: 'Arena B', value: 200, color: '#ff00ff' },         // neon-pink
];

const StatCard = ({ title, value, change, isGood }) => (
    <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white">{value}</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isGood ? 'text-neon-green bg-neon-green/10' : 'text-red-500 bg-red-500/10'}`}>
                {change}
            </span>
        </div>
    </div>
);

export default function Analytics() {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isGenerated, setIsGenerated] = React.useState(false);

    const handleGenerateInvoice = () => {
        setIsGenerating(true);
        setIsGenerated(false);
        // Simulate PDF generation and download
        setTimeout(() => {
            setIsGenerating(false);
            setIsGenerated(true);
            // reset state after 3s
            setTimeout(() => setIsGenerated(false), 3000);
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">ANALYTICS</h1>
                    <p className="text-slate-400">Deep dive into your business metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:border-white/20 text-sm font-bold transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button 
                        onClick={handleGenerateInvoice}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-lg text-sm relative overflow-hidden ${
                            isGenerated ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-neon-purple text-white hover:bg-fuchsia-600 shadow-neon-purple/20'
                        }`}
                    >
                        {isGenerating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                        ) : isGenerated ? (
                            <><CheckCircle className="w-4 h-4" /> Invoice Ready!</>
                        ) : (
                            <><FileText className="w-4 h-4" /> Auto Invoice</>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value="₹1.2L" change="+12%" isGood={true} />
                <StatCard title="Avg. Booking Value" value="₹850" change="+5%" isGood={true} />
                <StatCard title="Conversion Rate" value="3.2%" change="-1.1%" isGood={false} />
                <StatCard title="New Customers" value="145" change="+8.4%" isGood={true} />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg">Revenue Overview</h3>
                        <select className="bg-slate-950 border border-white/10 rounded-lg text-xs p-2 text-slate-300 focus:outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Turfs Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-6"
                >
                    <h3 className="font-bold text-white text-lg mb-6">Top Performing Turfs</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={turfPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
                                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} fontWeight={600} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {turfPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
