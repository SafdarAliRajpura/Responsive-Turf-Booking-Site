import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, User } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import userAvatarImg from '../../assets/images/common/user-avatar.jpg';

const LeaderboardCard = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await apiClient.get('/leaderboard');
            if (res.data?.success) {
                setPlayers(res.data.data);
            }
        } catch (err) {
            console.error('Leaderboard Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />;
            case 1: return <Medal className="w-5 h-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />;
            case 2: return <Medal className="w-5 h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />;
            default: return <span className="text-xs font-black text-slate-500">#{index + 1}</span>;
        }
    };

    const getSkillColor = (level) => {
        switch (level) {
            case 'Legend': return 'text-neon-pink border-neon-pink/30 bg-neon-pink/5';
            case 'Elite': return 'text-purple-400 border-purple-400/30 bg-purple-400/5';
            case 'Pro': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/5';
            case 'Semi-Pro': return 'text-neon-green border-neon-green/30 bg-neon-green/5';
            default: return 'text-slate-400 border-white/10 bg-white/5';
        }
    };

    if (loading) return (
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 animate-pulse">
            <div className="h-6 w-32 bg-white/5 rounded-full mb-6"></div>
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl mb-4"></div>)}
        </div>
    );

    return (
        <div className="bg-slate-900 border border-white/10 rounded-[35px] p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-bl-[100px] pointer-events-none group-hover:bg-neon-blue/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-neon-blue" />
                    Top <span className="text-neon-blue">5 Elites</span>
                </h3>
                <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>

            <div className="space-y-4 relative z-10">
                {players.slice(0, 5).map((player, i) => (
                    <motion.div 
                        key={player._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group/item flex items-center gap-4 p-3 rounded-2xl border transition-all ${i === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                    >
                        <div className="w-8 flex justify-center flex-shrink-0">
                            {getRankIcon(i)}
                        </div>

                        <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover/item:border-neon-blue transition-colors">
                                <img src={player.user_profile || userAvatarImg} alt="" className="w-full h-full object-cover" />
                            </div>
                            {i < 3 && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 flex items-center justify-center border border-white/10">
                                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{player.first_name} {player.last_name}</p>
                            <div className={`mt-0.5 inline-flex px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getSkillColor(player.skillLevel)}`}>
                                {player.skillLevel} • {player.primaryRole || 'Athlete'}
                            </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className="text-xs font-black text-neon-blue tabular-nums">{player.xp.toLocaleString()}</p>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest">XP</p>
                        </div>
                    </motion.div>
                ))}

                {players.length === 0 && (
                    <div className="py-10 text-center opacity-50">
                        <User className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-xs italic">Season just started...</p>
                    </div>
                )}
            </div>

            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">
                View Global Ranks
            </button>
        </div>
    );
};

export default LeaderboardCard;
