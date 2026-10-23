import React from 'react';
import { Crown, Sparkles, Scale, ShieldCheck } from 'lucide-react';

export default function DraftRosterBoard({
    teamA = [],
    teamB = [],
    captainA = 'Captain A',
    captainB = 'Captain B',
    teamAName = 'Team Alpha',
    teamBName = 'Team Beta',
    activeCaptain = 'A',
    isDrafting = false
}) {
    // Calculate average OVR
    const getAvgOvr = (team) => {
        if (!team || team.length === 0) return 80;
        const total = team.reduce((sum, p) => sum + (p.ovr || 80), 0);
        return Math.round(total / team.length);
    };

    const avgA = getAvgOvr(teamA);
    const avgB = getAvgOvr(teamB);
    const ovrDiff = Math.abs(avgA - avgB);
    const parityPercent = Math.max(70, Math.min(100, 100 - (ovrDiff * 4)));

    const getRoleColor = (r) => {
        const lower = (r || '').toLowerCase();
        if (lower.includes('bat') || lower.includes('fwd') || lower.includes('forward')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        if (lower.includes('bowl') || lower.includes('def') || lower.includes('defender')) return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
        if (lower.includes('all') || lower.includes('mid')) return 'text-neon-green bg-neon-green/10 border-neon-green/20';
        if (lower.includes('keep') || lower.includes('gk')) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
        return 'text-slate-300 bg-white/5 border-white/5';
    };

    return (
        <div className="space-y-4">
            {/* Squad Parity Equilibrium Indicator */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <Scale size={14} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                            Squad Balance Equilibrium
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase italic text-white">
                                {teamAName} ({avgA} OVR) vs {teamBName} ({avgB} OVR)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-neon-green/15 text-neon-green border border-neon-green/30 flex items-center gap-1">
                        <Sparkles size={11} /> {parityPercent}% Balanced
                    </span>
                </div>
            </div>

            {/* Split Squads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Team Alpha Card */}
                <div className={`p-5 rounded-[2rem] border transition-all flex flex-col justify-between ${
                    isDrafting && activeCaptain === 'A'
                        ? 'bg-gradient-to-br from-neon-green/15 via-slate-950 to-slate-900 border-neon-green/50 shadow-[0_0_25px_rgba(57,255,20,0.15)] ring-1 ring-neon-green/30'
                        : 'bg-slate-900/70 border-white/10'
                }`}>
                    <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green font-black text-sm">
                                    A
                                </div>
                                <div>
                                    <h4 className="text-base font-black uppercase italic tracking-tight text-white flex items-center gap-1.5">
                                        {teamAName}
                                        {isDrafting && activeCaptain === 'A' && (
                                            <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                                        )}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Crown size={11} className="text-neon-green" /> {captainA}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xl font-black italic text-neon-green">{avgA}</span>
                                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest">OVR</span>
                            </div>
                        </div>

                        {/* Roster Items */}
                        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                            {teamA.length > 0 ? (
                                teamA.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-[10px] font-black text-slate-500 w-4">
                                                {idx + 1}.
                                            </span>
                                            <div className="min-w-0">
                                                <span className="text-xs font-black uppercase italic text-white truncate block">
                                                    {p.name}
                                                </span>
                                                <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-black uppercase border ${getRoleColor(p.role)}`}>
                                                    {p.role}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {p.pickedAtRound && (
                                                <span className="text-[9px] font-black uppercase text-slate-500 px-1.5 py-0.5 rounded bg-white/5">
                                                    R{p.pickedAtRound}
                                                </span>
                                            )}
                                            <span className="text-xs font-black text-neon-green">
                                                {p.ovr || 80}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center rounded-2xl bg-slate-950/40 border border-white/5 border-dashed">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Athletes Drafted Yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-wider">
                        <span>Squad Size: {teamA.length}</span>
                        <span className="flex items-center gap-1 text-neon-green">
                            <ShieldCheck size={12} /> Verified Roster
                        </span>
                    </div>
                </div>

                {/* Team Beta Card */}
                <div className={`p-5 rounded-[2rem] border transition-all flex flex-col justify-between ${
                    isDrafting && activeCaptain === 'B'
                        ? 'bg-gradient-to-br from-neon-blue/15 via-slate-950 to-slate-900 border-neon-blue/50 shadow-[0_0_25px_rgba(0,240,255,0.15)] ring-1 ring-neon-blue/30'
                        : 'bg-slate-900/70 border-white/10'
                }`}>
                    <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center text-neon-blue font-black text-sm">
                                    B
                                </div>
                                <div>
                                    <h4 className="text-base font-black uppercase italic tracking-tight text-white flex items-center gap-1.5">
                                        {teamBName}
                                        {isDrafting && activeCaptain === 'B' && (
                                            <span className="w-2 h-2 rounded-full bg-neon-blue animate-ping" />
                                        )}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Crown size={11} className="text-neon-blue" /> {captainB}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xl font-black italic text-neon-blue">{avgB}</span>
                                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest">OVR</span>
                            </div>
                        </div>

                        {/* Roster Items */}
                        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                            {teamB.length > 0 ? (
                                teamB.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-[10px] font-black text-slate-500 w-4">
                                                {idx + 1}.
                                            </span>
                                            <div className="min-w-0">
                                                <span className="text-xs font-black uppercase italic text-white truncate block">
                                                    {p.name}
                                                </span>
                                                <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-black uppercase border ${getRoleColor(p.role)}`}>
                                                    {p.role}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {p.pickedAtRound && (
                                                <span className="text-[9px] font-black uppercase text-slate-500 px-1.5 py-0.5 rounded bg-white/5">
                                                    R{p.pickedAtRound}
                                                </span>
                                            )}
                                            <span className="text-xs font-black text-neon-blue">
                                                {p.ovr || 80}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center rounded-2xl bg-slate-950/40 border border-white/5 border-dashed">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Athletes Drafted Yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-wider">
                        <span>Squad Size: {teamB.length}</span>
                        <span className="flex items-center gap-1 text-neon-blue">
                            <ShieldCheck size={12} /> Verified Roster
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
