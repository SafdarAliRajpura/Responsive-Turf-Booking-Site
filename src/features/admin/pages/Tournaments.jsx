import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users, Plus, IndianRupee, MoreVertical } from 'lucide-react';
import trophyImg from '../../../assets/images/home/cricket.jpg';

export default function Tournaments() {
    const [tournaments] = useState([
        { id: 1, name: "Mumbai Corporate Cup", status: "Open", filled: 12, total: 16, prize: "50,000", date: "Aug 15" },
        { id: 2, name: "Pro Cricket League", status: "Filling Fast", filled: 8, total: 20, prize: "1,00,000", date: "Sept 01" },
        { id: 3, name: "Monsoon Football Blast", status: "Closed", filled: 16, total: 16, prize: "30,000", date: "July 20" },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">TOURNAMENTS</h1>
                    <p className="text-slate-400">Organize and manage competitive events.</p>
                </div>
                <button className="px-4 py-2 bg-neon-green text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create Tournament
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {tournaments.map((t, i) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900 border border-white/5 rounded-3xl p-6 flex gap-6 hover:border-white/10 transition-colors group relative overflow-hidden"
                    >
                        <div className="w-32 h-32 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden flex-shrink-0">
                            <img src={trophyImg} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`inline-block px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider mb-2 ${t.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                        t.status === 'Filling Fast' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                            'bg-slate-700 text-slate-400 border border-white/5'
                                    }`}>
                                    {t.status}
                                </div>
                                <button className="text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                            </div>

                            <h3 className="text-xl font-black text-white italic uppercase mb-4">{t.name}</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar className="w-4 h-4 text-neon-blue" />
                                    <span>{t.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Trophy className="w-4 h-4 text-neon-yellow" />
                                    <span>₹{t.prize}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Registration</span>
                                    <span className="text-white font-bold">{t.filled}/{t.total} Teams</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-neon-green rounded-full"
                                        style={{ width: `${(t.filled / t.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
