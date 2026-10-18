import React from 'react';
import { motion } from 'framer-motion';
import { 
    Trophy, Crown, Calendar, MapPin, 
    Share2, Edit3, Trash2, Award, Eye
} from 'lucide-react';
import { ScorecardFactory } from '../patterns/ScorecardStrategies';

export default function ScorecardCard({ 
    scorecard, 
    onOpenPoster, 
    onEdit, 
    onDelete, 
    onWhatsAppShare 
}) {
    const strategy = ScorecardFactory.getStrategy(scorecard.sport);
    const summary = strategy.computeSummary(scorecard);
    const sports = ScorecardFactory.getSupportedSports();
    const sportMeta = sports.find(s => s.id === scorecard.sport) || sports[0];

    const isTeamAWinner = summary.winner === scorecard.teamA?.name;
    const isTeamBWinner = summary.winner === scorecard.teamB?.name;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-slate-900/80 border border-white/10 hover:border-neon-green/30 rounded-[2rem] p-6 backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] transition-all overflow-hidden flex flex-col justify-between"
        >
            {/* Top ambient highlight on hover */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-neon-green/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-neon-green/15 transition-all" />

            {/* Header: Sport badge & Turf location */}
            <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5">{sportMeta.icon}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black uppercase text-white tracking-tight">
                                {scorecard.sport}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300">
                                Match Ledger
                            </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-neon-green" /> {scorecard.turfName || 'Arena Turf'}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-end gap-1">
                        <Calendar size={11} /> {scorecard.matchDate}
                    </span>
                    {scorecard.matchTime && (
                        <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                            {scorecard.matchTime}
                        </span>
                    )}
                </div>
            </div>

            {/* Result Header Badge */}
            <div className="relative z-10 mb-5">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Result</span>
                    <span className="text-xs font-black uppercase italic tracking-tight text-neon-green flex items-center gap-1.5 truncate">
                        <Trophy size={13} className="text-neon-green flex-shrink-0" />
                        <span className="truncate">{summary.resultSummary}</span>
                    </span>
                </div>
            </div>

            {/* Face-off Scoreboard */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
                {/* Team A */}
                <div className={`p-4 rounded-2xl border transition-all ${
                    isTeamAWinner 
                        ? 'bg-gradient-to-br from-neon-green/15 to-slate-950 border-neon-green/30' 
                        : 'bg-slate-950/60 border-white/5'
                }`}>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Team A</span>
                        {isTeamAWinner && <Crown size={12} className="text-neon-green" />}
                    </div>
                    <h4 className="text-sm font-black uppercase italic tracking-tight text-white truncate mb-2">
                        {scorecard.teamA?.name || 'Team A'}
                    </h4>
                    <div className="text-base font-black italic text-neon-green">
                        {summary.teamAScoreDisplay || '0'}
                    </div>
                </div>

                {/* Team B */}
                <div className={`p-4 rounded-2xl border transition-all ${
                    isTeamBWinner 
                        ? 'bg-gradient-to-br from-neon-blue/15 to-slate-950 border-neon-blue/30' 
                        : 'bg-slate-950/60 border-white/5'
                }`}>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Team B</span>
                        {isTeamBWinner && <Crown size={12} className="text-neon-blue" />}
                    </div>
                    <h4 className="text-sm font-black uppercase italic tracking-tight text-white truncate mb-2">
                        {scorecard.teamB?.name || 'Team B'}
                    </h4>
                    <div className="text-base font-black italic text-neon-blue">
                        {summary.teamBScoreDisplay || '0'}
                    </div>
                </div>
            </div>

            {/* Accolades preview if MVP is set */}
            {scorecard.playerOfTheMatch && (
                <div className="relative z-10 mb-5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                    <Award size={14} className="text-amber-400 flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">MVP:</span>
                    <span className="text-xs font-bold text-white uppercase italic truncate">
                        {scorecard.playerOfTheMatch}
                    </span>
                </div>
            )}

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
                <button
                    onClick={() => onOpenPoster(scorecard)}
                    className="px-3.5 py-2 rounded-xl bg-neon-green/10 hover:bg-neon-green text-neon-green hover:text-black font-black text-[10px] uppercase tracking-wider transition-all border border-neon-green/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(57,255,20,0.15)] hover:scale-105 active:scale-95"
                >
                    <Eye size={12} /> Poster
                </button>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onWhatsAppShare(scorecard)}
                        title="Broadcast to WhatsApp"
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black transition-all border border-emerald-500/20"
                    >
                        <Share2 size={13} />
                    </button>

                    <button
                        onClick={() => onEdit(scorecard)}
                        title="Edit Scorecard"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
                    >
                        <Edit3 size={13} />
                    </button>

                    <button
                        onClick={() => onDelete(scorecard._id)}
                        title="Delete Match Record"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all border border-rose-500/20"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
