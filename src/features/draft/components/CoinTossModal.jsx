import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, X } from 'lucide-react';
import { draftAudio } from '../utils/draftAudio';

export default function CoinTossModal({ 
    isOpen, 
    onClose, 
    captainA = 'Captain A', 
    captainB = 'Captain B', 
    teamAName = 'Team Alpha',
    teamBName = 'Team Beta',
    onTossComplete 
}) {
    const [call, setCall] = useState('HEADS'); // 'HEADS' or 'TAILS'
    const [callingCaptain, setCallingCaptain] = useState('A'); // 'A' or 'B'
    const [isFlipping, setIsFlipping] = useState(false);
    const [tossResult, setTossResult] = useState(null); // 'HEADS' or 'TAILS'
    const [winner, setWinner] = useState(null); // 'A' or 'B'
    const [decision, setDecision] = useState('first_pick'); // 'first_pick' or 'second_pick'

    if (!isOpen) return null;

    const handleFlip = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setTossResult(null);
        setWinner(null);

        // Play metallic spinning audio
        draftAudio.playCoinFlip();

        // 50/50 randomized outcome
        const outcome = Math.random() > 0.5 ? 'HEADS' : 'TAILS';

        setTimeout(() => {
            setTossResult(outcome);
            setIsFlipping(false);

            // Determine winner
            const won = call === outcome;
            const winningCap = won ? callingCaptain : (callingCaptain === 'A' ? 'B' : 'A');
            setWinner(winningCap);

            // Play referee whistle
            draftAudio.playWhistle();
        }, 1800);
    };

    const handleConfirm = () => {
        const firstPicker = decision === 'first_pick' ? winner : (winner === 'A' ? 'B' : 'A');
        onTossComplete({
            tossWinner: winner,
            tossDecision: decision,
            firstPicker
        });
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl text-center overflow-hidden"
                >
                    {/* Ambient Glow */}
                    <div className="absolute -top-20 -left-20 w-48 h-48 bg-neon-green/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-neon-blue/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                        <X size={16} />
                    </button>

                    {/* Title */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green">
                            Official Matchday Toss
                        </span>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase text-white mb-6">
                        3D VIRTUAL COIN TOSS
                    </h3>

                    {/* 3D Coin Animation Element */}
                    <div className="my-8 flex justify-center perspective-[1000px]">
                        <motion.div
                            animate={isFlipping ? {
                                rotateY: [0, 1800 + (call === 'TAILS' ? 180 : 0)],
                                scale: [1, 1.25, 1],
                                y: [0, -60, 0]
                            } : {
                                rotateY: tossResult === 'TAILS' ? 180 : 0
                            }}
                            transition={isFlipping ? {
                                duration: 1.8,
                                ease: "easeInOut"
                            } : { duration: 0.3 }}
                            className="w-36 h-36 rounded-full relative transform-style-3d shadow-[0_0_35px_rgba(234,179,8,0.3)] cursor-pointer select-none"
                            onClick={!isFlipping && !tossResult ? handleFlip : undefined}
                        >
                            {/* Heads Face */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-4 border-yellow-200 flex flex-col items-center justify-center backface-hidden shadow-inner">
                                <Trophy className="w-10 h-10 text-slate-950 mb-1" />
                                <span className="text-xs font-black tracking-widest text-slate-950">HEADS</span>
                                <span className="text-[8px] font-bold text-slate-900 tracking-wider">TURFX PRO</span>
                            </div>

                            {/* Tails Face */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-300 to-cyan-100 border-4 border-sky-100 flex flex-col items-center justify-center rotate-y-180 backface-hidden shadow-inner">
                                <Sparkles className="w-10 h-10 text-slate-950 mb-1" />
                                <span className="text-xs font-black tracking-widest text-slate-950">TAILS</span>
                                <span className="text-[8px] font-bold text-slate-900 tracking-wider">ARENA CUP</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Selection Controls (Before Toss) */}
                    {!tossResult && (
                        <div className="space-y-4">
                            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-400">Caller:</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCallingCaptain('A')}
                                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                                            callingCaptain === 'A' ? 'bg-neon-green text-black' : 'bg-white/5 text-slate-300'
                                        }`}
                                    >
                                        {captainA} ({teamAName})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCallingCaptain('B')}
                                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                                            callingCaptain === 'B' ? 'bg-neon-blue text-black' : 'bg-white/5 text-slate-300'
                                        }`}
                                    >
                                        {captainB} ({teamBName})
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCall('HEADS')}
                                    className={`py-3 rounded-2xl font-black uppercase text-xs tracking-wider transition-all border ${
                                        call === 'HEADS'
                                            ? 'bg-amber-400/20 text-amber-400 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                                            : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    Call Heads
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCall('TAILS')}
                                    className={`py-3 rounded-2xl font-black uppercase text-xs tracking-wider transition-all border ${
                                        call === 'TAILS'
                                            ? 'bg-sky-400/20 text-sky-400 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                                            : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    Call Tails
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleFlip}
                                disabled={isFlipping}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-102 active:scale-98 transition-all disabled:opacity-50"
                            >
                                {isFlipping ? 'Spinning Coin...' : 'FLIP COIN NOW'}
                            </button>
                        </div>
                    )}

                    {/* Result Card (After Toss) */}
                    {tossResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                    Coin Landed On {tossResult}!
                                </span>
                                <h4 className="text-lg font-black uppercase italic text-neon-green">
                                    👑 {winner === 'A' ? `${captainA} (${teamAName})` : `${captainB} (${teamBName})`} Won the Toss!
                                </h4>
                            </div>

                            <div className="text-left space-y-2 pt-2 border-t border-white/5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                    Toss Winner's Decision:
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDecision('first_pick')}
                                        className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                                            decision === 'first_pick'
                                                ? 'bg-neon-green/20 text-neon-green border-neon-green'
                                                : 'bg-slate-950 text-slate-400 border-white/5'
                                        }`}
                                    >
                                        <span className="block font-black">First Pick</span>
                                        <span className="text-[9px] text-slate-400">Pick 1st in Draft</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDecision('second_pick')}
                                        className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                                            decision === 'second_pick'
                                                ? 'bg-neon-blue/20 text-neon-blue border-neon-blue'
                                                : 'bg-slate-950 text-slate-400 border-white/5'
                                        }`}
                                    >
                                        <span className="block font-black">Second Pick</span>
                                        <span className="text-[9px] text-slate-400">Choose Pitch Side</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleFlip}
                                    className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-white/10"
                                >
                                    Re-Flip
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.25)] flex items-center justify-center gap-2 hover:scale-102 transition-all"
                                >
                                    Proceed to Live Draft <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
