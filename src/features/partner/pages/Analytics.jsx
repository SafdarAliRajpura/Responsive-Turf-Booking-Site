import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts';
import { Share2, FileText, Loader2, CheckCircle, IndianRupee, TrendingUp, Users, Target } from 'lucide-react';
import apiClient from '../../../utils/apiClient';

const StatCard = ({ title, value, change, isGood, icon: Icon }) => (
    <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        </div>
        <div className="flex items-end justify-between relative z-10">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">{value}</h3>
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isGood ? 'text-neon-green bg-neon-green/10' : 'text-red-500 bg-red-500/10'}`}>
                {change}
                <TrendingUp className={`w-3 h-3 ${!isGood ? 'rotate-180' : ''}`} />
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
    </div>
);

export default function Analytics() {
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await apiClient.get('/analytics/dashboard');
                if (res.data.success) {
                    setMetrics(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch detailed analytics", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: 'Partner Analytics Report',
            text: `Operational Report: ₹${metrics?.totalRevenue?.toLocaleString()} Gross Revenue | ${metrics?.activePlayers} Registered Athletes.`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} \nView Report: ${shareData.url}`);
                alert('Report Link copied to clipboard.');
            }
        } catch (err) {
            console.error('Sharing inhibited:', err);
        }
    };

    const handleDownloadInvoice = () => {
        setIsGenerating(true);
        setTimeout(() => {
            // Generate simple CSV content
            const csvRows = [
                ['Metric', 'Value'],
                ['Total Revenue', `₹${metrics?.totalRevenue}`],
                ['Total Bookings', metrics?.totalBookings],
                ['Active Players', metrics?.activePlayers],
                ['Avg Booking Value', `₹${metrics?.avgBookingValue}`],
                ['Conversion Rate', metrics?.conversionRate],
                ['', ''],
                ['Venue', 'Revenue', 'Bookings'],
                ...(metrics?.turfPerformance?.map(t => [t.name, t.value, t.count]) || [])
            ];

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Analytics_Report_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsGenerating(false);
            setIsGenerated(true);
            setTimeout(() => setIsGenerated(false), 3000);
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Gathering your stats...</p>
            </div>
        );
    }

    const data = metrics?.last7Days || [];
    const turfPerformance = metrics?.turfPerformance || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">BUSINESS <span className="text-neon-purple">ANALYTICS</span></h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Comprehensive performance insights and financial tracking.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:border-white/20 text-xs font-black uppercase tracking-widest transition-all"
                    >
                        <Share2 className="w-4 h-4" /> Share Report
                    </button>
                    <button 
                        onClick={handleDownloadInvoice}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl relative overflow-hidden ${
                            isGenerated ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-neon-purple text-white hover:bg-fuchsia-600 shadow-neon-purple/20'
                        }`}
                    >
                        {isGenerating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Exporting data...</>
                        ) : isGenerated ? (
                            <><CheckCircle className="w-4 h-4" /> Report Exported</>
                        ) : (
                            <><FileText className="w-4 h-4" /> Export Report</>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Net Earnings (90%)" 
                    value={`₹${((metrics?.totalRevenue || 0) * 0.9).toLocaleString()}`} 
                    change={`${metrics?.trends?.revenue >= 0 ? '+' : ''}${metrics?.trends?.revenue}%`} 
                    isGood={metrics?.trends?.revenue >= 0} 
                    icon={TrendingUp}
                />
                <StatCard 
                    title="Total Gross" 
                    value={`₹${(metrics?.totalRevenue || 0).toLocaleString()}`} 
                    change={`${metrics?.trends?.revenue >= 0 ? '+' : ''}${metrics?.trends?.revenue}%`} 
                    isGood={metrics?.trends?.revenue >= 0} 
                    icon={IndianRupee}
                />
                <StatCard 
                    title="Avg. Payout" 
                    value={`₹${Math.round((metrics?.avgBookingValue || 0) * 0.9)}`} 
                    change="+5.2%" 
                    isGood={true} 
                    icon={Target}
                />
                <StatCard 
                    title="Active Players" 
                    value={metrics?.activePlayers || 0} 
                    change={`${metrics?.trends?.players >= 0 ? '+' : ''}${metrics?.trends?.players}%`} 
                    isGood={metrics?.trends?.players >= 0} 
                    icon={Users}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-white text-lg uppercase italic tracking-tighter">Revenue Momentum <span className="text-slate-600 text-sm ml-2 font-bold">(Last 7 Days)</span></h3>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-neon-purple shadow-[0_0_10px_#a855f7]" />
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} fontWeight={900} dy={10} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} fontWeight={900} width={60} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '16px', border: '1px solid #ffffff10' }}
                                    itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '12px' }}
                                    cursor={{ stroke: '#a855f7', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#a855f7" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                    dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#020617' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Turfs Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8"
                >
                    <h3 className="font-black text-white text-lg mb-8 uppercase italic tracking-tighter">Arena Performance</h3>
                    <div className="space-y-6">
                        {turfPerformance.length > 0 ? turfPerformance.map((turf, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                                            <Target className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-black uppercase italic tracking-tighter text-sm">{turf.name}</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{turf.count || 0} Successful Reservations</p>
                                        </div>
                                    </div>
                                    <p className="text-white font-black text-sm italic tracking-tight">₹{turf.value.toLocaleString()}</p>
                                </div>
                                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(turf.value / Math.max(...turfPerformance.map(t => t.value))) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full rounded-full relative"
                                        style={{ backgroundColor: turf.color }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="h-[300px] flex items-center justify-center text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center italic">
                                Insufficient operational data to map performance.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
