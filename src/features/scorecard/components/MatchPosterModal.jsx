import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Download, Share2, Copy, Check, Crown, Trophy, 
    Flame, Sparkles, MapPin, Award, Shield
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { ScorecardFactory } from '../patterns/ScorecardStrategies';

export default function MatchPosterModal({ isOpen, onClose, scorecard }) {
    const posterRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen || !scorecard) return null;

    const strategy = ScorecardFactory.getStrategy(scorecard.sport);
    const summary = strategy.computeSummary(scorecard);
    const sports = ScorecardFactory.getSupportedSports();
    const sportMeta = sports.find(s => s.id === scorecard.sport) || sports[0];

    const isTeamAWinner = summary.winner === scorecard.teamA?.name;
    const isTeamBWinner = summary.winner === scorecard.teamB?.name;

    // Handle high quality PNG export
    const handleDownloadPNG = async () => {
        if (!posterRef.current || isExporting) return;
        setIsExporting(true);

        try {
            await new Promise(res => setTimeout(res, 200));

            const canvas = await html2canvas(posterRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#020617',
                logging: false,
                allowTaint: true
            });

            const link = document.createElement('a');
            link.download = `TurfX-${scorecard.sport}-Scorecard-${scorecard._id ? scorecard._id.substring(0, 6) : 'Match'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to export match poster:', err);
        } finally {
            setIsExporting(false);
        }
    };

    // Handle WhatsApp broadcast
    const handleWhatsAppShare = () => {
        const text = strategy.formatWhatsAppShare(scorecard);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Copy text representation
    const handleCopySummary = async () => {
        try {
            const text = strategy.formatWhatsAppShare(scorecard);
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Clipboard copy error:', err);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-[620px] my-auto"
                >
                    {/* Top Action Bar */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{sportMeta.icon}</span>
                            <div>
                                <h3 className="text-white font-black uppercase italic tracking-wider text-sm flex items-center gap-2">
                                    Official Match Poster
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-neon-green/10 text-neon-green border border-neon-green/30">
                                        Verified
                                    </span>
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cricfy & CricHeroes Style Broadcast Card</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Printable Poster Canvas */}
                    <div 
                        ref={posterRef}
                        className="relative bg-slate-950 border border-white/15 rounded-[2.5rem] p-7 overflow-hidden shadow-2xl text-white select-none"
                        style={{
                            background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)'
                        }}
                    >
                        {/* Ambient Stadium Glow */}
                        <div className="absolute -top-24 -left-24 w-72 h-72 bg-neon-green/10 rounded-full blur-[90px] pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-neon-blue/10 rounded-full blur-[90px] pointer-events-none" />

                        {/* Poster Header */}
                        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-green to-emerald-500 flex items-center justify-center shadow-lg shadow-neon-green/20">
                                    <Trophy className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-black tracking-tight text-white uppercase italic">
                                            TURF<span className="text-neon-green">X</span>
                                        </span>
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300 tracking-widest">
                                            MATCH LEDGER
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        {scorecard.sport} Showdown
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1 text-[11px] font-black text-slate-300">
                                    <MapPin size={12} className="text-neon-green" />
                                    <span className="truncate max-w-[160px]">{scorecard.turfName || 'Arena Ground'}</span>
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                    <span>{scorecard.matchDate || 'Matchday'}</span>
                                    {scorecard.matchTime && <span>• {scorecard.matchTime}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Match Result Banner */}
                        <div className="relative z-10 text-center mb-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-neon-green/15 via-emerald-500/10 to-neon-blue/15 border border-neon-green/30 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                                <Sparkles size={14} className="text-neon-green animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest text-neon-green">
                                    {summary.resultSummary}
                                </span>
                            </div>
                        </div>

                        {/* Score Board Face-Off */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                            {/* Team A Box */}
                            <div className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
                                isTeamAWinner 
                                    ? 'bg-gradient-to-br from-neon-green/15 to-slate-900 border-neon-green/40 shadow-[0_0_25px_rgba(57,255,20,0.15)]' 
                                    : 'bg-slate-900/80 border-white/10'
                            }`}>
                                {isTeamAWinner && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 text-neon-green text-[10px] font-black tracking-wider uppercase bg-neon-green/10 px-2 py-0.5 rounded-full border border-neon-green/30">
                                        <Crown size={12} /> Winner
                                    </div>
                                )}
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-8 h-8 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center font-black text-sm text-neon-green">
                                        A
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-base font-black uppercase italic tracking-tight text-white truncate">
                                            {scorecard.teamA?.name || 'Team Alpha'}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                                            {scorecard.teamA?.captain ? `Capt: ${scorecard.teamA.captain}` : 'Squad A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/10">
                                    <div className="text-2xl font-black italic tracking-tight text-white">
                                        {summary.teamAScoreDisplay || '0'}
                                    </div>
                                </div>
                            </div>

                            {/* Team B Box */}
                            <div className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
                                isTeamBWinner 
                                    ? 'bg-gradient-to-br from-neon-blue/15 to-slate-900 border-neon-blue/40 shadow-[0_0_25px_rgba(0,240,255,0.15)]' 
                                    : 'bg-slate-900/80 border-white/10'
                            }`}>
                                {isTeamBWinner && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 text-neon-blue text-[10px] font-black tracking-wider uppercase bg-neon-blue/10 px-2 py-0.5 rounded-full border border-neon-blue/30">
                                        <Crown size={12} /> Winner
                                    </div>
                                )}
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-8 h-8 rounded-xl bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center font-black text-sm text-neon-blue">
                                        B
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-base font-black uppercase italic tracking-tight text-white truncate">
                                            {scorecard.teamB?.name || 'Team Beta'}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                                            {scorecard.teamB?.captain ? `Capt: ${scorecard.teamB.captain}` : 'Squad B'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/10">
                                    <div className="text-2xl font-black italic tracking-tight text-white">
                                        {summary.teamBScoreDisplay || '0'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sport Detailed Breakdown Card */}
                        {scorecard.sport === 'Football' && scorecard.footballData?.goalScorers?.length > 0 && (
                            <div className="relative z-10 bg-slate-900/60 rounded-2xl p-4 border border-white/5 mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                    <Flame size={12} className="text-neon-pink" /> Goalscorers
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {scorecard.footballData.goalScorers.map((g, idx) => (
                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                            ⚽ {g.playerName} {g.minute ? `(${g.minute}')` : ''}
                                            <span className="text-[9px] uppercase text-slate-400 font-black">
                                                [{g.team === 'A' ? scorecard.teamA?.name : scorecard.teamB?.name}]
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {scorecard.sport === 'Badminton' && scorecard.racketData?.sets?.length > 0 && (
                            <div className="relative z-10 bg-slate-900/60 rounded-2xl p-4 border border-white/5 mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Set-by-Set Game Scores
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {scorecard.racketData.sets.map((s, idx) => (
                                        <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Set {s.setNumber}</span>
                                            <span className="text-sm font-black text-white">{s.scoreA} - {s.scoreB}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accolades: Player of the Match & Notes */}
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {scorecard.playerOfTheMatch && (
                                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                                        <Award size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block">
                                            Player of the Match
                                        </span>
                                        <span className="text-sm font-black text-white uppercase italic truncate block">
                                            {scorecard.playerOfTheMatch}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {scorecard.notes && (
                                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center gap-3">
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                                            Match Highlights
                                        </span>
                                        <p className="text-xs text-slate-300 font-medium italic line-clamp-2">
                                            "{scorecard.notes}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Poster Footer Branding */}
                        <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-slate-400">
                                <Shield size={12} className="text-neon-green" /> Authenticated TurfX Ledger
                            </span>
                            <span>Play • Compete • Conquer</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-3 px-1">
                        <button
                            onClick={handleCopySummary}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center gap-2"
                        >
                            {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>

                        <button
                            onClick={handleWhatsAppShare}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Share2 size={14} /> WhatsApp Broadcast
                        </button>

                        <button
                            onClick={handleDownloadPNG}
                            disabled={isExporting}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Download size={14} />
                            {isExporting ? 'Exporting HD...' : 'Download Card PNG'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
