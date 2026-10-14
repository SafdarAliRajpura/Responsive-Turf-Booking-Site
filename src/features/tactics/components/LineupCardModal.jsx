import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Copy, Check, Crown, Sparkles, MapPin, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function LineupCardModal({
    isOpen,
    onClose,
    title,
    venueName,
    matchDate,
    matchTime,
    pitchFormat,
    formation,
    players
}) {
    const cardRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const starters = players.filter(p => !p.isSub);
    const subs = players.filter(p => p.isSub);

    // Format text representation for WhatsApp / Clipboard
    const getFormattedText = () => {
        let text = `⚽ *ARENA PRO MATCHDAY SQUAD* ⚽\n`;
        text += `🏟️ *Venue:* ${venueName || 'Premier Arena'}\n`;
        text += `📅 *Date:* ${matchDate || 'Upcoming Match'} | ⏰ ${matchTime || 'Prime Slot'}\n`;
        text += `📋 *Formation:* ${formation} (${pitchFormat})\n\n`;
        text += `*STARTING LINEUP:*\n`;
        starters.forEach(p => {
            text += `• #${p.number} ${p.name} [${p.role}]${p.isCaptain ? ' 👑 (C)' : ''}\n`;
        });
        if (subs.length > 0) {
            text += `\n*BENCH:*\n`;
            subs.forEach(p => {
                text += `• #${p.number} ${p.name}\n`;
            });
        }
        text += `\n🚀 Verified on Arena Pro Elite`;
        return text;
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(getFormattedText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(getFormattedText());
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    const handleDownloadImage = async () => {
        if (!cardRef.current || isExporting) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // High resolution retina rendering
                backgroundColor: '#020617',
                useCORS: true,
                logging: false
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `ArenaPro_Lineup_${(title || 'Match').replace(/\s+/g, '_')}.png`;
            link.click();
        } catch (err) {
            console.error('Failed to generate image:', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full shadow-2xl my-8"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Dialog Header */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[10px] font-black uppercase tracking-widest mb-2">
                            <Sparkles className="w-3 h-3" /> Match Graphic Exporter
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
                            Broadcast Lineup Card
                        </h2>
                    </div>

                    {/* THE EXPORTABLE GRAPHIC CARD CONTAINER */}
                    <div
                        ref={cardRef}
                        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-[2rem] border-2 border-emerald-500/30 overflow-hidden shadow-2xl space-y-6"
                    >
                        {/* Header Banner */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neon-green">
                                    Official Tactical Briefing
                                </span>
                                <h3 className="text-xl font-black italic uppercase text-white tracking-tight">
                                    {title || 'Matchday Starting Squad'}
                                </h3>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono font-black text-xs uppercase tracking-wider">
                                {formation}
                            </div>
                        </div>

                        {/* Match Intel Pill Strip */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-2xl border border-white/5 font-bold">
                            <div className="flex items-center gap-2 text-slate-300">
                                <MapPin className="w-4 h-4 text-neon-blue shrink-0" />
                                <span className="truncate">{venueName || 'Premier Arena'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="w-4 h-4 text-neon-pink shrink-0" />
                                <span>{matchDate || 'Today'}</span>
                            </div>
                        </div>

                        {/* Mini Tactical Pitch Rendering */}
                        <div className="relative w-full aspect-[4/3] bg-emerald-950/40 rounded-2xl border border-emerald-500/30 overflow-hidden shadow-inner">
                            {/* SVG Mini Pitch Markings */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/20" strokeWidth="1.5" fill="none">
                                <rect x="6%" y="6%" width="88%" height="88%" rx="8" />
                                <line x1="6%" y1="50%" x2="94%" y2="50%" strokeDasharray="3 3" />
                                <circle cx="50%" cy="50%" r="14%" />
                                <rect x="28%" y="6%" width="44%" height="18%" />
                                <rect x="28%" y="76%" width="44%" height="18%" />
                            </svg>

                            {/* Mini Player Nodes */}
                            {starters.map((p) => (
                                <div
                                    key={p.id}
                                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                >
                                    {p.isCaptain && <Crown className="w-2.5 h-2.5 text-amber-300 fill-current mb-0.5" />}
                                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-emerald-400 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                                        {p.number}
                                    </div>
                                    <span className="text-[8px] font-bold text-white bg-black/80 px-1.5 rounded-full mt-0.5 whitespace-nowrap">
                                        {p.name.split(' ')[0]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Roster List Columns */}
                        <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Starting Roster:</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {starters.map((p) => (
                                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                                            #{p.number}
                                        </span>
                                        <span className="font-bold text-slate-200 truncate">{p.name}</span>
                                        {p.isCaptain && <span className="text-[9px] text-amber-400 font-black ml-auto">(C)</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Branding */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Arena Pro Tactical Hub</span>
                            <span className="text-neon-green">Verified Lineup</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                        <button
                            onClick={handleDownloadImage}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs shadow-xl hover:bg-neon-green transition-all"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? 'Generating...' : 'Save PNG'}
                        </button>

                        <button
                            onClick={handleWhatsAppShare}
                            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider text-xs shadow-xl transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            WhatsApp
                        </button>

                        <button
                            onClick={handleCopyText}
                            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-wider text-xs transition-all"
                        >
                            {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
