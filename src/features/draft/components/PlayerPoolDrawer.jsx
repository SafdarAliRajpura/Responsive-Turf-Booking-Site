import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, Sparkles, Trash2, Clipboard } from 'lucide-react';

export default function PlayerPoolDrawer({
    players = [],
    sport = 'Cricket',
    isDrafting = false,
    activeCaptain = 'A',
    captainAName = 'Team Alpha',
    captainBName = 'Team Beta',
    onPickPlayer,
    onAddPlayer,
    onRemovePlayer,
    onBulkImport
}) {
    const [name, setName] = useState('');
    const [role, setRole] = useState(sport === 'Cricket' ? 'All-Rounder' : 'Forward');
    const [ovr, setOvr] = useState(82);
    const [showImporter, setShowImporter] = useState(false);
    const [rawText, setRawText] = useState('');

    useEffect(() => {
        setRole(sport === 'Cricket' ? 'All-Rounder' : sport === 'Football' ? 'Forward' : 'Player');
    }, [sport]);

    const sportRoles = sport === 'Cricket'
        ? ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']
        : sport === 'Football'
        ? ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']
        : ['Player', 'Captain', 'Ace'];

    const handleAddSingle = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAddPlayer({
            id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: name.trim(),
            role: role || sportRoles[0],
            ovr: Number(ovr) || 80
        });
        setName('');
    };

    const handleBulkParse = () => {
        if (!rawText.trim()) return;
        const lines = rawText.split('\n');
        const parsed = [];

        lines.forEach(line => {
            const clean = line.replace(/^\d+[-.)]\s*/, '').trim();
            if (clean.length > 1) {
                // Check if role is in parentheses, e.g. "Rahul (Bowl)"
                const match = clean.match(/^(.*?)\s*\((.*?)\)$/);
                if (match) {
                    parsed.push({
                        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        name: match[1].trim(),
                        role: match[2].trim() || sportRoles[0],
                        ovr: Math.floor(Math.random() * 12) + 78
                    });
                } else {
                    parsed.push({
                        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        name: clean,
                        role: sportRoles[Math.floor(Math.random() * sportRoles.length)],
                        ovr: Math.floor(Math.random() * 12) + 78
                    });
                }
            }
        });

        if (parsed.length > 0) {
            onBulkImport(parsed);
            setRawText('');
            setShowImporter(false);
        }
    };

    const getRoleColor = (r) => {
        const lower = (r || '').toLowerCase();
        if (lower.includes('bat') || lower.includes('fwd') || lower.includes('forward')) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
        if (lower.includes('bowl') || lower.includes('def') || lower.includes('defender')) return 'text-sky-400 border-sky-400/30 bg-sky-400/10';
        if (lower.includes('all') || lower.includes('mid')) return 'text-neon-green border-neon-green/30 bg-neon-green/10';
        if (lower.includes('keep') || lower.includes('gk')) return 'text-rose-400 border-rose-400/30 bg-rose-400/10';
        return 'text-slate-300 border-white/10 bg-white/5';
    };

    return (
        <div className="bg-slate-900/80 border border-white/10 rounded-[2rem] p-5 md:p-6 backdrop-blur-xl shadow-xl flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black uppercase text-white tracking-tight">Available Athlete Pool</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-neon-green/10 text-neon-green border border-neon-green/20">
                            {players.length} Available
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                        {isDrafting 
                            ? `Active turn: ${activeCaptain === 'A' ? captainAName : captainBName} — Click to recruit!`
                            : 'Add athletes or import directly from WhatsApp squad message'}
                    </p>
                </div>

                {!isDrafting && (
                    <button
                        type="button"
                        onClick={() => setShowImporter(p => !p)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-wider transition-all border border-white/10 flex items-center gap-1.5"
                    >
                        <Clipboard size={12} className="text-neon-green" /> WhatsApp Import
                    </button>
                )}
            </div>

            {/* WhatsApp Text Importer Drawer */}
            {showImporter && (
                <div className="mb-4 p-4 rounded-2xl bg-slate-950 border border-neon-green/30 space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neon-green flex items-center gap-1.5">
                            <Sparkles size={12} /> Paste WhatsApp Squad Text
                        </span>
                        <button type="button" onClick={() => setShowImporter(false)} className="text-slate-500 hover:text-white text-xs">
                            Cancel
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder={`Paste squad text directly:\n1. Rahul (Batsman)\n2. Sameer (Bowler)\n3. Virat (All-Rounder)\n4. Rohit`}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-neon-green"
                    />
                    <button
                        type="button"
                        onClick={handleBulkParse}
                        className="w-full py-2 rounded-xl bg-neon-green text-black font-black text-xs uppercase tracking-wider hover:scale-[1.01] transition-all"
                    >
                        Extract & Add All Athletes
                    </button>
                </div>
            )}

            {/* Single Athlete Input (Setup Phase Only) */}
            {!isDrafting && (
                <form onSubmit={handleAddSingle} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Athlete Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="md:col-span-5 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="md:col-span-4 bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                    >
                        {sportRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min={60}
                        max={99}
                        value={ovr}
                        onChange={(e) => setOvr(e.target.value)}
                        title="Athlete Overall Rating (60-99)"
                        className="md:col-span-1 bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-xs font-black text-center text-white"
                    />
                    <button
                        type="submit"
                        className="md:col-span-2 py-2 rounded-xl bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black font-black text-xs uppercase tracking-wider border border-neon-green/40 flex items-center justify-center gap-1 transition-all"
                    >
                        <Plus size={14} /> Add
                    </button>
                </form>
            )}

            {/* Athletes Cards Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[460px] custom-scrollbar">
                {players.length > 0 ? (
                    players.map((p, idx) => (
                        <div
                            key={idx}
                            onClick={isDrafting ? () => onPickPlayer(p) : undefined}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                                isDrafting
                                    ? activeCaptain === 'A'
                                        ? 'bg-slate-950/80 hover:bg-neon-green/15 border-white/10 hover:border-neon-green cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]'
                                        : 'bg-slate-950/80 hover:bg-neon-blue/15 border-white/10 hover:border-neon-blue cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                                    : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white">
                                    {p.ovr || 80}
                                </div>
                                <div className="min-w-0">
                                    <h5 className="text-sm font-black uppercase italic tracking-tight text-white truncate">
                                        {p.name}
                                    </h5>
                                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${getRoleColor(p.role)}`}>
                                        {p.role || 'Player'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isDrafting ? (
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl transition-all ${
                                        activeCaptain === 'A'
                                            ? 'bg-neon-green text-black group-hover:scale-105 shadow-md'
                                            : 'bg-neon-blue text-black group-hover:scale-105 shadow-md'
                                    }`}>
                                        Draft ➔
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemovePlayer(idx);
                                        }}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-white/5">
                        <UserPlus size={24} className="text-slate-600 mx-auto mb-2" />
                        <p className="text-xs font-black uppercase text-slate-400">All Athletes Drafted!</p>
                        <p className="text-[10px] text-slate-500 mt-1">Both squads are ready for matchday.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
