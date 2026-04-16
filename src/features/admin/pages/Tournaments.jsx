import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Plus, MoreVertical, Users, MapPin, Target, User as UserIcon, X, Loader2, IndianRupee } from 'lucide-react';
import apiClient from '../../../utils/apiClient';

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRosterOpen, setIsRosterOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [isLoadingRoster, setIsLoadingRoster] = useState(false);

    const fetchTournaments = async () => {
        try {
            const res = await apiClient.get('/tournaments');
            if (res.data.success) {
                setTournaments(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching admin tournaments:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoster = async (tournament) => {
        setSelectedTournament(tournament);
        setIsRosterOpen(true);
        setIsLoadingRoster(true);
        try {
            const res = await apiClient.get(`/tournaments/${tournament._id}/registrations`);
            if (res.data.success) {
                setRegistrations(res.data.data);
            }
        } catch (err) {
            console.error("Roster fetch error:", err);
        } finally {
            setIsLoadingRoster(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">GLOBAL <span className="text-neon-green">CHAMPIONSHIPS</span></h1>
                    <p className="text-slate-400 font-medium">Platform-wide tournament oversight and roster intelligence.</p>
                </div>
                <button className="px-6 py-3 bg-neon-green/10 border border-neon-green/20 text-neon-green font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-neon-green hover:text-black transition-all shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    Audit All Events
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Global Pulse...</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {tournaments.map((t, i) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 flex gap-6 hover:border-neon-green/30 transition-all group relative overflow-hidden"
                        >
                            <div className="w-32 h-32 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden flex-shrink-0 relative">
                                <img 
                                    src={t.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 to-transparent" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`px-2 py-1 rounded-lg text-[9px] uppercase font-black tracking-widest ${
                                            t.status === 'Upcoming' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' :
                                            t.status === 'Ongoing' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' :
                                            'bg-slate-800 text-slate-400 border border-white/10'
                                        }`}>
                                            {t.status}
                                        </div>
                                        <button onClick={() => fetchRoster(t)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-xl transition-all text-[9px] font-black uppercase tracking-tighter">
                                            <Users className="w-3 h-3" /> Inspect Roster
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-black text-white italic uppercase mb-1 tracking-tighter">{t.name}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mb-4">
                                        <MapPin className="w-3 h-3" /> {t.location}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                        <span className="text-slate-500">Arena Occupancy</span>
                                        <span className="text-white">{t.registeredTeams || 0}/{t.totalSlots} SQUADS</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((t.registeredTeams || 0) / t.totalSlots) * 100}%` }}
                                            className="h-full bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Global Roster Intel Modal */}
            <AnimatePresence>
                {isRosterOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" 
                            onClick={() => setIsRosterOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl p-10 shadow-3xl overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                        ADMIN <span className="text-neon-green">INSPECTION</span>
                                    </h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">{selectedTournament?.name} • Full Squad Ledger</p>
                                </div>
                                <button onClick={() => setIsRosterOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/10">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            {isLoadingRoster ? (
                                <div className="py-24 text-center">
                                    <Loader2 className="w-12 h-12 text-neon-green animate-spin mx-auto mb-6" />
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Downloading Intelligence Matrix...</p>
                                </div>
                            ) : registrations.length === 0 ? (
                                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                    <Users className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                                    <p className="text-slate-600 font-black uppercase tracking-widest text-sm">No tactical data found for this campaign.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {registrations.map((reg, idx) => (
                                        <div key={reg._id} className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 hover:border-neon-green/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center text-neon-green font-black text-xl">
                                                    #{idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-neon-green transition-colors">{reg.teamName}</h4>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Capt. {reg.captainName}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-8 flex-1 px-8 border-l border-white/5 h-full">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Intel Access</p>
                                                    <p className="text-sm font-bold text-white mb-1">{reg.email}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider">{reg.contactNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Squad Alpha</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {reg.players?.slice(0, 3).map((p, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[8px] text-slate-400 border border-white/5 uppercase">
                                                                {p}
                                                            </span>
                                                        ))}
                                                        {reg.players?.length > 3 && <span className="text-[8px] text-slate-500 font-black ml-1">+{reg.players.length - 3}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="bg-neon-green/10 px-4 py-2 rounded-xl border border-neon-green/20">
                                                    <span className="text-neon-green font-black uppercase tracking-widest text-[10px]">VERIFIED ATHLETES</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
