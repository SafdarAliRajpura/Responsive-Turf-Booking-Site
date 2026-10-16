import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X } from 'lucide-react';

const ROLE_COLORS = {
    // Football Roles
    GK: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-400/40', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]' },
    DEF: { bg: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-400/40', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.35)]' },
    MID: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400/40', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]' },
    FWD: { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-400/40', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]' },
    SUB: { bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-500/40', glow: 'shadow-none' },

    // Turf Box Cricket Roles
    WK: { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-400/40', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]' },
    BAT: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-400/40', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.35)]' },
    BOW: { bg: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-400/40', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.35)]' },
    AR: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400/40', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]' }
};

export default function PitchCanvas({
    sport = 'Football',
    players,
    onPlayersChange,
    drawings,
    onDrawingsChange,
    activeTool,
    onActionCompleted
}) {
    const pitchRef = useRef(null);
    const [draggingPlayerId, setDraggingPlayerId] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', number: '', role: 'MID', isCaptain: false });

    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState([]);

    // Open Player Edit Modal
    const handlePlayerClick = (e, player) => {
        e.stopPropagation();
        if (activeTool !== 'select') return;
        setSelectedPlayer(player);
        setEditForm({
            name: player.name,
            number: player.number,
            role: player.role,
            isCaptain: !!player.isCaptain
        });
    };

    const handleSavePlayerEdit = () => {
        if (!selectedPlayer) return;
        const updated = players.map(p => {
            if (p.id === selectedPlayer.id) {
                return {
                    ...p,
                    name: editForm.name.trim() || p.name,
                    number: parseInt(editForm.number) || p.number,
                    role: editForm.role,
                    isCaptain: editForm.isCaptain
                };
            }
            // If new captain set, clear previous captain
            if (editForm.isCaptain && p.id !== selectedPlayer.id) {
                return { ...p, isCaptain: false };
            }
            return p;
        });

        onPlayersChange(updated);
        setSelectedPlayer(null);
        if (onActionCompleted) onActionCompleted();
    };

    // Helper to extract normalized percentage coordinates from any pointer event
    const getPitchCoords = (e) => {
        if (!pitchRef.current) return null;
        const rect = pitchRef.current.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
        if (clientX == null || clientY == null) return null;

        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    };

    // ----------------------------------------------------
    // PLAYER DRAG & DROP HANDLERS (When activeTool === 'select')
    // ----------------------------------------------------
    const handlePlayerPointerDown = (e, playerId) => {
        if (activeTool !== 'select') return;
        e.preventDefault();
        e.stopPropagation();
        setDraggingPlayerId(playerId);
    };

    useEffect(() => {
        if (!draggingPlayerId) return;

        const handleGlobalPlayerMove = (e) => {
            const pt = getPitchCoords(e);
            if (!pt) return;
            const x = Math.max(6, Math.min(94, pt.x));
            const y = Math.max(6, Math.min(94, pt.y));
            onPlayersChange(players.map(p => (p.id === draggingPlayerId ? { ...p, x, y } : p)));
        };

        const handleGlobalPlayerUp = () => {
            setDraggingPlayerId(null);
            if (onActionCompleted) onActionCompleted();
        };

        window.addEventListener('pointermove', handleGlobalPlayerMove);
        window.addEventListener('pointerup', handleGlobalPlayerUp);
        return () => {
            window.removeEventListener('pointermove', handleGlobalPlayerMove);
            window.removeEventListener('pointerup', handleGlobalPlayerUp);
        };
    }, [draggingPlayerId, players, onPlayersChange, onActionCompleted]);

    // ----------------------------------------------------
    // TACTICAL DRAWING HANDLERS (When activeTool is Pass, Run, or Press)
    // ----------------------------------------------------
    const handleDrawStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.setPointerCapture?.(e.pointerId);

        const pt = getPitchCoords(e);
        if (!pt) return;

        setIsDrawing(true);
        setCurrentStroke([pt, pt]);
    };

    const handleDrawMove = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pt = getPitchCoords(e);
        if (!pt) return;

        setCurrentStroke(prev => (prev.length > 0 ? [prev[0], pt] : [pt, pt]));
    };

    const handleDrawEnd = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (currentStroke.length >= 2) {
            const start = currentStroke[0];
            const end = currentStroke[1];
            const dist = Math.hypot(end.x - start.x, end.y - start.y);

            // Minimum 2.5% drag threshold to commit stroke
            if (dist > 2.5) {
                const newDrawing = {
                    id: 'd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                    tool: activeTool,
                    color: activeTool === 'pass' ? '#00F3FF' : activeTool === 'run' ? '#FACC15' : '#EF4444',
                    points: [start, end]
                };
                onDrawingsChange([...drawings, newDrawing]);
                if (onActionCompleted) onActionCompleted();
            }
        }
        setCurrentStroke([]);
    };

    return (
        <div className="relative w-full flex flex-col items-center select-none">
            {/* Main Stadium Pitch Canvas Container */}
            <div
                ref={pitchRef}
                className={`relative w-full ${sport === 'Cricket' ? 'max-w-2xl sm:max-w-3xl aspect-square' : 'max-w-4xl aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4]'} bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 rounded-[2.5rem] border-2 border-emerald-500/20 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(16,185,129,0.08)]`}
            >
                {/* Interactive Tactical Drawing Canvas Overlay (Active when tool is Pass, Run, or Press) */}
                {activeTool !== 'select' && (
                    <div
                        className="absolute inset-0 z-40 cursor-crosshair touch-none"
                        onPointerDown={handleDrawStart}
                        onPointerMove={handleDrawMove}
                        onPointerUp={handleDrawEnd}
                        onPointerCancel={handleDrawEnd}
                    />
                )}
                {/* Synthetic Grass Alternating Stripes */}
                <div className="absolute inset-0 flex flex-col pointer-events-none opacity-40">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 w-full ${i % 2 === 0 ? 'bg-emerald-900/10' : 'bg-emerald-800/20'}`}
                        />
                    ))}
                </div>

                {/* Floodlight Lighting Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/90" />

                {/* SVG Pitch Markings (Sport Adaptive: Square Turf Box Cricket vs Rectangular Football) */}
                {sport === 'Cricket' ? (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/25" strokeWidth="2" fill="none">
                        {/* Square Outer Cage Boundary */}
                        <rect x="5%" y="5%" width="90%" height="90%" rx="16" />

                        {/* Inner Netting Cage Mesh Border */}
                        <rect x="7.5%" y="7.5%" width="85%" height="85%" rx="12" strokeDasharray="3 3" strokeOpacity="0.35" />

                        {/* Inner 30-Yard Circle (Fielding Restriction Ring) */}
                        <circle cx="50%" cy="50%" r="35%" strokeDasharray="6 4" strokeOpacity="0.4" />

                        {/* Central Turf Cricket Pitch Strip (22 Yards) */}
                        <rect x="42%" y="22%" width="16%" height="56%" rx="6" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" />
                        <line x1="42%" y1="50%" x2="58%" y2="50%" strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.2)" />

                        {/* STRIKER END (Top Creases & Wickets) */}
                        {/* Popping Crease */}
                        <line x1="36%" y1="28%" x2="64%" y2="28%" stroke="white" strokeWidth="2" strokeOpacity="0.75" />
                        {/* Bowling Crease */}
                        <line x1="42%" y1="24%" x2="58%" y2="24%" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                        {/* Return Creases */}
                        <line x1="38%" y1="22%" x2="38%" y2="30%" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                        <line x1="62%" y1="22%" x2="62%" y2="30%" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                        {/* 3 Stumps & Bails */}
                        <circle cx="48%" cy="24%" r="3.5" fill="#F59E0B" stroke="#F59E0B" />
                        <circle cx="50%" cy="24%" r="3.5" fill="#F59E0B" stroke="#F59E0B" />
                        <circle cx="52%" cy="24%" r="3.5" fill="#F59E0B" stroke="#F59E0B" />
                        <line x1="46.5%" y1="24%" x2="53.5%" y2="24%" stroke="#FDE68A" strokeWidth="2" />

                        {/* BOWLER END (Bottom Creases & Wickets) */}
                        {/* Popping Crease */}
                        <line x1="36%" y1="72%" x2="64%" y2="72%" stroke="white" strokeWidth="2" strokeOpacity="0.75" />
                        {/* Bowling Crease */}
                        <line x1="42%" y1="76%" x2="58%" y2="76%" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                        {/* Return Creases */}
                        <line x1="38%" y1="70%" x2="38%" y2="78%" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                        <line x1="62%" y1="70%" x2="62%" y2="78%" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                        {/* 3 Stumps & Bails */}
                        <circle cx="48%" cy="76%" r="3.5" fill="#F59E0B" stroke="#F59E0B" />
                        <circle cx="50%" cy="76%" r="3.5" fill="#F59E0B" stroke="#F59E0B" />
                        <circle cx="52%" cy="76%" r="3.5" fill="#F59E0B" stroke="#F59E0B" />
                        <line x1="46.5%" y1="76%" x2="53.5%" y2="76%" stroke="#FDE68A" strokeWidth="2" />

                        {/* Side Netting Labels */}
                        <text x="12%" y="51%" fill="rgba(255,255,255,0.2)" fontSize="9" fontWeight="900" letterSpacing="0.2em" stroke="none">OFF SIDE</text>
                        <text x="76%" y="51%" fill="rgba(255,255,255,0.2)" fontSize="9" fontWeight="900" letterSpacing="0.2em" stroke="none">LEG SIDE</text>
                        <text x="50%" y="51%" fill="rgba(255,255,255,0.12)" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="0.25em" stroke="none">BOX TURF CAGE</text>
                    </svg>
                ) : (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/25" strokeWidth="2" fill="none">
                        {/* Outer Boundary */}
                        <rect x="5%" y="4%" width="90%" height="92%" rx="16" />

                        {/* Halfway Line */}
                        <line x1="5%" y1="50%" x2="95%" y2="50%" strokeDasharray="4 4" />

                        {/* Center Circle & Center Spot */}
                        <circle cx="50%" cy="50%" r="14%" />
                        <circle cx="50%" cy="50%" r="1%" fill="white" fillOpacity="0.4" />

                        {/* Top Goal Box (Opponent Goal) */}
                        <rect x="25%" y="4%" width="50%" height="16%" />
                        <rect x="36%" y="4%" width="28%" height="7%" />
                        <circle cx="50%" cy="14%" r="1%" fill="white" fillOpacity="0.4" />
                        <path d="M 40% 20% A 10% 10% 0 0 0 60% 20%" />

                        {/* Bottom Goal Box (Our Goal) */}
                        <rect x="25%" y="80%" width="50%" height="16%" />
                        <rect x="36%" y="89%" width="28%" height="7%" />
                        <circle cx="50%" cy="86%" r="1%" fill="white" fillOpacity="0.4" />
                        <path d="M 40% 80% A 10% 10% 0 0 1 60% 80%" />

                        {/* Corner Arcs */}
                        <path d="M 5% 7% A 3% 3% 0 0 0 8% 4%" />
                        <path d="M 95% 7% A 3% 3% 0 0 1 92% 4%" />
                        <path d="M 5% 93% A 3% 3% 0 0 1 8% 96%" />
                        <path d="M 95% 93% A 3% 3% 0 0 0 92% 96%" />
                    </svg>
                )}

                {/* SVG Tactical Drawing Strokes Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <marker id="arrow-pass" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1 L 9 5 L 0 9 z" fill="#00F3FF" />
                        </marker>
                        <marker id="arrow-run" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1 L 9 5 L 0 9 z" fill="#FACC15" />
                        </marker>
                    </defs>

                    {/* Completed Stored Strokes */}
                    {drawings.map((draw) => {
                        if (!draw.points || draw.points.length < 2) return null;
                        const first = draw.points[0];
                        const last = draw.points[draw.points.length - 1];

                        if (draw.tool === 'press') {
                            const radius = Math.hypot(last.x - first.x, last.y - first.y);
                            return (
                                <circle
                                    key={draw.id}
                                    cx={`${first.x}%`}
                                    cy={`${first.y}%`}
                                    r={`${Math.max(3, radius)}%`}
                                    fill="rgba(239,68,68,0.22)"
                                    stroke="#EF4444"
                                    strokeWidth="2.5"
                                    strokeDasharray="4 3"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' }}
                                />
                            );
                        }

                        return (
                            <line
                                key={draw.id}
                                x1={`${first.x}%`}
                                y1={`${first.y}%`}
                                x2={`${last.x}%`}
                                y2={`${last.y}%`}
                                stroke={draw.color}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeDasharray={draw.tool === 'run' ? '6 4' : 'none'}
                                markerEnd={draw.tool === 'run' ? 'url(#arrow-run)' : 'url(#arrow-pass)'}
                                style={{ filter: `drop-shadow(0 0 8px ${draw.color})` }}
                            />
                        );
                    })}

                    {/* Live In-Progress Stroke */}
                    {isDrawing && currentStroke.length >= 2 && (
                        activeTool === 'press' ? (
                            <circle
                                cx={`${currentStroke[0].x}%`}
                                cy={`${currentStroke[0].y}%`}
                                r={`${Math.max(3, Math.hypot(currentStroke[1].x - currentStroke[0].x, currentStroke[1].y - currentStroke[0].y))}%`}
                                fill="rgba(239,68,68,0.25)"
                                stroke="#EF4444"
                                strokeWidth="2.5"
                                strokeDasharray="4 3"
                                style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.7))' }}
                            />
                        ) : (
                            <line
                                x1={`${currentStroke[0].x}%`}
                                y1={`${currentStroke[0].y}%`}
                                x2={`${currentStroke[1].x}%`}
                                y2={`${currentStroke[1].y}%`}
                                stroke={activeTool === 'pass' ? '#00F3FF' : '#FACC15'}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={activeTool === 'run' ? '6 4' : 'none'}
                                markerEnd={activeTool === 'run' ? 'url(#arrow-run)' : 'url(#arrow-pass)'}
                                style={{ filter: `drop-shadow(0 0 12px ${activeTool === 'pass' ? '#00F3FF' : '#FACC15'})` }}
                            />
                        )
                    )}
                </svg>

                {/* Player Tokens Layer */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {players.map((player) => {
                        const style = ROLE_COLORS[player.role] || ROLE_COLORS.MID;
                        const isDragging = draggingPlayerId === player.id;

                        return (
                            <motion.div
                                key={player.id}
                                onPointerDown={(e) => handlePlayerPointerDown(e, player.id)}
                                onClick={(e) => handlePlayerClick(e, player)}
                                initial={{ x: "-50%", y: "-50%" }}
                                animate={{
                                    left: `${player.x}%`,
                                    top: `${player.y}%`,
                                    x: "-50%",
                                    y: "-50%",
                                    scale: isDragging ? 1.25 : 1
                                }}
                                transition={{
                                    type: 'spring',
                                    damping: isDragging ? 30 : 20,
                                    stiffness: isDragging ? 300 : 150
                                }}
                                style={{ position: 'absolute' }}
                                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center group cursor-grab active:cursor-grabbing z-30 touch-none pointer-events-auto"
                            >
                                {/* Captain Crown Indicator */}
                                {player.isCaptain && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-bounce pointer-events-none">
                                        <Crown className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                )}

                                {/* Main Circular Player Token */}
                                <div className={`relative w-full h-full rounded-full bg-slate-900 border-2 ${style.border} ${style.glow} flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-white shadow-xl`}>
                                    {/* Ambient Role Gradient Ring */}
                                    <div className={`absolute inset-0 rounded-full ${style.bg} opacity-20`} />
                                    
                                    {/* Jersey Number */}
                                    <span className="text-sm sm:text-base font-black italic tracking-tighter text-white font-mono">
                                        {player.number}
                                    </span>

                                    {/* Role Badge Tag */}
                                    <span className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.2 rounded-md bg-slate-950 border border-white/20 ${style.text} uppercase tracking-widest`}>
                                        {player.role}
                                    </span>
                                </div>

                                {/* Player Name Pill */}
                                <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold text-slate-200 tracking-wide flex items-center gap-1 shadow-lg pointer-events-none whitespace-nowrap">
                                    {player.name}
                                    {player.isCaptain && <span className="text-amber-400 font-black">(C)</span>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Player Attributes Editor Modal */}
            <AnimatePresence>
                {selectedPlayer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedPlayer(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green font-black">
                                    #{editForm.number}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Player Intel</h3>
                                    <p className="text-xs text-slate-400 font-medium">Edit pitch attributes</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Athlete Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:border-neon-green outline-none"
                                        placeholder="e.g. Cristiano"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Kit Number</label>
                                        <input
                                            type="number"
                                            value={editForm.number}
                                            onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold font-mono focus:border-neon-green outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Role</label>
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-white text-xs font-bold focus:border-neon-green outline-none"
                                        >
                                            {sport === 'Cricket' ? (
                                                <>
                                                    <option value="WK">Wicketkeeper (WK)</option>
                                                    <option value="BAT">Batsman (BAT)</option>
                                                    <option value="BOW">Bowler (BOW)</option>
                                                    <option value="AR">All-Rounder (AR)</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="GK">Goalkeeper (GK)</option>
                                                    <option value="DEF">Defender (DEF)</option>
                                                    <option value="MID">Midfielder (MID)</option>
                                                    <option value="FWD">Forward (FWD)</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setEditForm({ ...editForm, isCaptain: !editForm.isCaptain })}
                                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${editForm.isCaptain ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center gap-2.5 text-xs font-bold">
                                        <Crown className="w-4 h-4 fill-current" />
                                        Team Captain (C)
                                    </div>
                                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${editForm.isCaptain ? 'bg-amber-400 border-amber-400 text-black' : 'border-slate-600'}`}>
                                        {editForm.isCaptain && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSavePlayerEdit}
                                    className="w-full py-3.5 rounded-xl bg-neon-green text-black font-black uppercase tracking-wider text-xs shadow-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all mt-4"
                                >
                                    Save Player
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
