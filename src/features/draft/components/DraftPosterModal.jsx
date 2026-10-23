import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Download, Share2, Copy, Check, Crown, Trophy, 
    Sparkles, MapPin, Calendar, ShieldCheck
} from 'lucide-react';
import html2canvas from 'html2canvas';

export default function DraftPosterModal({
    isOpen,
    onClose,
    sport = 'Cricket',
    turfName = 'Arena Pro Turf',
    date = 'Matchday',
    format = '6v6 Box',
    captainA = 'Captain A',
    captainB = 'Captain B',
    teamAName = 'Team Alpha',
    teamBName = 'Team Beta',
    teamA = [],
    teamB = []
}) {
    const posterRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const getFormattedWhatsAppText = () => {
        let text = `⚔️ *TURFX OFFICIAL MATCHDAY SQUAD DRAFT* ⚔️\n`;
        text += `🏟️ *Turf:* ${turfName}\n`;
        text += `📅 *Date:* ${date} | ⚡ *Format:* ${format} (${sport})\n\n`;

        text += `🟢 *${teamAName.toUpperCase()}* (Capt: ${captainA})\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        teamA.forEach((p, idx) => {
            text += `${idx + 1}. ${p.name} [${p.role}] (OVR ${p.ovr || 80})\n`;
        });

        text += `\n🔵 *${teamBName.toUpperCase()}* (Capt: ${captainB})\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        teamB.forEach((p, idx) => {
            text += `${idx + 1}. ${p.name} [${p.role}] (OVR ${p.ovr || 80})\n`;
        });

        text += `\n🏆 *Balanced on TurfX Live Draft Room*`;
        return text;
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(getFormattedWhatsAppText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Clipboard copy error:', err);
        }
    };

    const handleWhatsAppShare = () => {
        const text = getFormattedWhatsAppText();
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleDownloadPNG = async () => {
        if (!posterRef.current || isExporting) return;
        setIsExporting(true);
        try {
            await new Promise(r => setTimeout(r, 200));
            const canvas = await html2canvas(posterRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#020617',
                logging: false
            });
            const link = document.createElement('a');
            link.download = `TurfX-Squad-Draft-${teamAName}-vs-${teamBName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('PNG export error:', err);
        } finally {
            setIsExporting(false);
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
                    {/* Header Controls */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-neon-green" />
                            <h3 className="text-white font-black uppercase italic tracking-wider text-sm">
                                Matchday Face-Off Squad Card
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Canvas Container */}
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

                        {/* Banner Top */}
                        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                            <div>
                                <span className="text-base font-black tracking-tight text-white uppercase italic">
                                    TURF<span className="text-neon-green">X</span>
                                </span>
                                <span className="ml-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300 tracking-widest">
                                    SQUAD BATTLE
                                </span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                    {sport} • {format}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-slate-300 flex items-center justify-end gap-1">
                                    <MapPin size={12} className="text-neon-green" /> {turfName}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                                    <Calendar size={11} className="inline mr-1" />{date}
                                </span>
                            </div>
                        </div>

                        {/* Center Clash Heading */}
                        <div className="relative z-10 text-center mb-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-neon-green/15 via-slate-900 to-neon-blue/15 border border-white/10 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                                <Sparkles size={13} className="text-neon-green" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">
                                    OFFICIAL LINEUP FACE-OFF
                                </span>
                            </div>
                        </div>

                        {/* Squad Columns */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                            {/* Team Alpha */}
                            <div className="p-4 rounded-3xl bg-slate-900/80 border border-neon-green/30 space-y-3">
                                <div className="border-b border-white/10 pb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neon-green block">Team A</span>
                                    <h4 className="text-sm font-black uppercase italic text-white truncate">{teamAName}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                                        <Crown size={10} className="inline mr-1 text-neon-green" />{captainA}
                                    </p>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                    {teamA.map((p, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-200">
                                            <span className="truncate max-w-[130px] font-bold">
                                                {idx + 1}. {p.name}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-black uppercase">
                                                {p.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Team Beta */}
                            <div className="p-4 rounded-3xl bg-slate-900/80 border border-neon-blue/30 space-y-3">
                                <div className="border-b border-white/10 pb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neon-blue block">Team B</span>
                                    <h4 className="text-sm font-black uppercase italic text-white truncate">{teamBName}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                                        <Crown size={10} className="inline mr-1 text-neon-blue" />{captainB}
                                    </p>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                    {teamB.map((p, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-200">
                                            <span className="truncate max-w-[130px] font-bold">
                                                {idx + 1}. {p.name}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-black uppercase">
                                                {p.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Branding */}
                        <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-slate-400">
                                <ShieldCheck size={12} className="text-neon-green" /> Balanced on TurfX Draft Engine
                            </span>
                            <span>Fair Play • True Competition</span>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-3 px-1">
                        <button
                            onClick={handleCopyText}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center gap-2"
                        >
                            {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>
                        <button
                            onClick={handleWhatsAppShare}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Share2 size={14} /> WhatsApp Squad
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
