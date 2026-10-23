import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Sparkles, Volume2, VolumeX, RotateCcw, 
    Share2, BookOpen, Activity, ArrowRight, Play, CheckCircle2
} from 'lucide-react';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Toast from '../../components/ui/Toast';
import apiClient from '../../utils/apiClient';

import { DraftStateMachine } from './patterns/DraftStatePattern';
import { DraftStrategyFactory } from './patterns/DraftStrategies';
import { draftAudio } from './utils/draftAudio';

import CoinTossModal from './components/CoinTossModal';
import PlayerPoolDrawer from './components/PlayerPoolDrawer';
import DraftRosterBoard from './components/DraftRosterBoard';
import DraftPosterModal from './components/DraftPosterModal';

export default function DraftRoom() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // Sound toggle state
    const [isMuted, setIsMuted] = useState(false);

    // Draft Metadata
    const [sport, setSport] = useState('Cricket');
    const [turfName, setTurfName] = useState('Central Arena Pitch');
    const [matchDate, setMatchDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [format, setFormat] = useState('6v6 Box');

    // Captains & Team Names
    const [captainA, setCaptainA] = useState('Virat');
    const [teamAName, setTeamAName] = useState('Strikers');
    const [captainB, setCaptainB] = useState('Rohit');
    const [teamBName, setTeamBName] = useState('Titans');

    // Strategy & State Machine
    const [strategyType, setStrategyType] = useState('snake');
    const [stateKey, setStateKey] = useState('SETUP'); // 'SETUP', 'COIN_TOSS', 'DRAFTING', 'COMPLETED'
    const stateMachineRef = useRef(new DraftStateMachine('SETUP'));

    // Toss Outcomes
    const [tossWinner, setTossWinner] = useState('A');
    const [firstPicker, setFirstPicker] = useState('A');
    const [isCoinTossOpen, setIsCoinTossOpen] = useState(false);

    // Rosters & Pools
    const [unpickedPool, setUnpickedPool] = useState([
        { name: 'Sameer Khan', role: 'Batsman', ovr: 86 },
        { name: 'Amit Sharma', role: 'Bowler', ovr: 84 },
        { name: 'Kunal Patel', role: 'All-Rounder', ovr: 88 },
        { name: 'Farhan Ali', role: 'Wicket-Keeper', ovr: 82 },
        { name: 'Rohan Mehra', role: 'Bowler', ovr: 80 },
        { name: 'Dev Sen', role: 'Batsman', ovr: 85 },
        { name: 'Zaid Sheikh', role: 'All-Rounder', ovr: 83 },
        { name: 'Tanmay Roy', role: 'Bowler', ovr: 79 }
    ]);
    const [teamA, setTeamA] = useState([]);
    const [teamB, setTeamB] = useState([]);
    const [pickHistory, setPickHistory] = useState([]);

    // Turn & Timer (15-second draft clock)
    const [activeCaptain, setActiveCaptain] = useState('A');
    const [timerSeconds, setTimerSeconds] = useState(15);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Modals & Notifications
    const [isPosterOpen, setIsPosterOpen] = useState(false);
    const [toast, setToast] = useState({ message: null, type: 'info' });

    // Pre-fill booking metadata if URL contains bookingId
    useEffect(() => {
        if (!bookingId) return;
        const fetchBooking = async () => {
            try {
                const res = await apiClient.get('/bookings');
                if (res.data?.success) {
                    const match = res.data.data.find(b => b._id === bookingId);
                    if (match) {
                        setTurfName(match.turfName || 'Arena Turf');
                        setSport(match.sport || 'Cricket');
                        setMatchDate(match.date || new Date().toISOString().split('T')[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching booking metadata for draft:', err);
            }
        };
        fetchBooking();
    }, [bookingId]);

    // Handle strategy change
    const strategy = DraftStrategyFactory.getStrategy(strategyType);

    // Update active captain based on total picks made
    const updateActiveCaptain = useCallback((currentPickCount, startingPicker) => {
        const next = strategy.getNextPicker(currentPickCount, startingPicker);
        setActiveCaptain(next);
        setTimerSeconds(15);
    }, [strategy]);

    // Handle Pick Athlete
    const handlePickPlayer = useCallback((player) => {
        if (stateKey !== 'DRAFTING') return;

        // Play pick buzzer chime
        draftAudio.playPickBuzzer();

        const pickedRound = Math.floor(pickHistory.length / 2) + 1;
        const playerWithRound = { ...player, pickedAtRound: pickedRound };

        if (activeCaptain === 'A') {
            setTeamA(prev => [...prev, playerWithRound]);
        } else {
            setTeamB(prev => [...prev, playerWithRound]);
        }

        // Remove from unpicked pool
        const updatedPool = unpickedPool.filter(p => p.name !== player.name);
        setUnpickedPool(updatedPool);

        const nextPickCount = pickHistory.length + 1;
        setPickHistory(prev => [...prev, { player: player.name, captain: activeCaptain }]);

        // Check if draft is finished
        if (updatedPool.length === 0) {
            setStateKey('COMPLETED');
            stateMachineRef.current.setState('COMPLETED');
            setIsTimerRunning(false);
            draftAudio.playFanfare();
            setToast({ message: 'All athletes drafted! Matchday squads are locked.', type: 'success' });
            return;
        }

        // Shift turn to next captain
        updateActiveCaptain(nextPickCount, firstPicker);
    }, [stateKey, activeCaptain, pickHistory.length, unpickedPool, updateActiveCaptain, firstPicker]);

    // Draft Clock Countdown Timer
    useEffect(() => {
        if (stateKey !== 'DRAFTING' || !isTimerRunning) return;

        const interval = setInterval(() => {
            setTimerSeconds(prev => {
                if (prev <= 1) {
                    // Timer expired: auto-pick highest OVR remaining player for active captain
                    if (unpickedPool.length > 0) {
                        const highestOvrPlayer = [...unpickedPool].sort((a, b) => (b.ovr || 80) - (a.ovr || 80))[0];
                        handlePickPlayer(highestOvrPlayer);
                    }
                    return 15;
                }
                // Play heartbeat audio
                draftAudio.playClockTick(prev <= 5);
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [stateKey, isTimerRunning, unpickedPool, handlePickPlayer]);

    // Coin Toss Outcome Handler
    const handleTossComplete = ({ tossWinner: winner, firstPicker: picker }) => {
        setTossWinner(winner);
        setFirstPicker(picker);
        setActiveCaptain(picker);

        // Move to Drafting State
        setStateKey('DRAFTING');
        stateMachineRef.current.setState('DRAFTING');
        setIsTimerRunning(true);
        setTimerSeconds(15);
        setToast({ 
            message: `${winner === 'A' ? captainA : captainB} won the toss! ${picker === 'A' ? captainA : captainB} has First Pick!`, 
            type: 'success' 
        });
    };

    // 1-Click AI Auto Balance
    const handleAutoBalance = () => {
        const balanced = strategy.autoBalance(unpickedPool, teamA, teamB);
        setTeamA(balanced.teamA);
        setTeamB(balanced.teamB);
        setUnpickedPool([]);
        setStateKey('COMPLETED');
        stateMachineRef.current.setState('COMPLETED');
        setIsTimerRunning(false);
        draftAudio.playFanfare();
        setToast({ message: 'AI balanced both squads equally by role and OVR!', type: 'success' });
    };

    // Reset Draft
    const handleResetDraft = () => {
        if (!window.confirm('Reset this draft session back to setup phase?')) return;
        const allPlayers = [
            ...teamA.map(p => ({ name: p.name, role: p.role, ovr: p.ovr })),
            ...teamB.map(p => ({ name: p.name, role: p.role, ovr: p.ovr })),
            ...unpickedPool
        ];
        setUnpickedPool(allPlayers);
        setTeamA([]);
        setTeamB([]);
        setPickHistory([]);
        setStateKey('SETUP');
        stateMachineRef.current.setState('SETUP');
        setIsTimerRunning(false);
        setToast({ message: 'Draft session reset to setup phase.', type: 'info' });
    };

    // Add Player manually
    const handleAddPlayer = (p) => {
        setUnpickedPool(prev => [...prev, p]);
    };

    // Remove Player
    const handleRemovePlayer = (idx) => {
        setUnpickedPool(prev => prev.filter((_, i) => i !== idx));
    };

    // Bulk Import from WhatsApp
    const handleBulkImport = (athletes) => {
        setUnpickedPool(prev => [...prev, ...athletes]);
        setToast({ message: `Imported ${athletes.length} athletes from text!`, type: 'success' });
    };

    // Save to Backend
    const handleSaveDraft = async () => {
        try {
            const payload = {
                bookingId: bookingId || null,
                sport,
                turfName,
                date: matchDate,
                format,
                captainA: { name: captainA, teamName: teamAName },
                captainB: { name: captainB, teamName: teamBName },
                tossWinner,
                tossDecision: firstPicker === tossWinner ? 'first_pick' : 'second_pick',
                draftStrategy: strategyType,
                teamA,
                teamB,
                unpickedPool,
                status: stateKey === 'COMPLETED' ? 'completed' : 'in_progress'
            };

            const res = await apiClient.post('/drafts', payload);
            if (res.data?.success) {
                setToast({ message: 'Drafted rosters successfully committed to server!', type: 'success' });
            }
        } catch (err) {
            console.error('Save draft error:', err);
            setToast({ message: 'Failed to sync draft session with server.', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-neon-green selection:text-black">
            <Header />

            {/* Cyber Stadium Ambient Lights */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-24 left-1/4 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[160px]" />
                <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[160px]" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-24">
                
                {/* Top Battle Banner */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green">
                                Live Captains Draft Room
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-white/10 text-slate-300">
                                {strategy.name}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                            DRAFT<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">ROOM</span>
                        </h1>
                        <p className="text-slate-400 text-xs font-medium mt-0.5">
                            3D Coin Toss, turn-based captain draft clock, and instant squad equilibrium for your turf slot
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                        {/* Audio Mute/Unmute */}
                        <button
                            type="button"
                            onClick={() => {
                                const muted = draftAudio.toggleMute();
                                setIsMuted(muted);
                            }}
                            className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all"
                            title={isMuted ? 'Unmute Stadium Audio' : 'Mute Audio'}
                        >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-neon-green" />}
                        </button>

                        {/* Reset Button */}
                        <button
                            type="button"
                            onClick={handleResetDraft}
                            className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all"
                            title="Reset Draft Session"
                        >
                            <RotateCcw size={16} />
                        </button>

                        {/* Strategy Selector Dropdown */}
                        <select
                            value={strategyType}
                            onChange={(e) => setStrategyType(e.target.value)}
                            disabled={stateKey === 'DRAFTING'}
                            className="bg-slate-900 border border-white/10 rounded-2xl px-3 py-2 text-xs font-black uppercase tracking-wider text-white focus:outline-none focus:border-neon-green disabled:opacity-50"
                        >
                            <option value="snake">Snake Draft (Parity)</option>
                            <option value="alternate">Alternate Picks</option>
                            <option value="auto_fair">AI Auto Fair Balance</option>
                        </select>
                    </div>
                </div>

                {/* Stepper Navigation Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                    {[
                        { key: 'SETUP', label: '1. Squad Setup' },
                        { key: 'COIN_TOSS', label: '2. 3D Coin Toss' },
                        { key: 'DRAFTING', label: '3. Live Drafting' },
                        { key: 'COMPLETED', label: '4. Matchday Face-Off' }
                    ].map((step) => {
                        const isCurrent = stateKey === step.key;
                        const isDone = (
                            (step.key === 'SETUP' && stateKey !== 'SETUP') ||
                            (step.key === 'COIN_TOSS' && (stateKey === 'DRAFTING' || stateKey === 'COMPLETED')) ||
                            (step.key === 'DRAFTING' && stateKey === 'COMPLETED')
                        );

                        return (
                            <div
                                key={step.key}
                                className={`p-3 rounded-2xl border text-center transition-all ${
                                    isCurrent 
                                        ? 'bg-gradient-to-r from-neon-green/20 to-slate-900 border-neon-green text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.15)] font-black' 
                                        : isDone 
                                        ? 'bg-slate-900/90 border-white/10 text-white font-bold'
                                        : 'bg-slate-950/60 border-white/5 text-slate-600 font-medium'
                                }`}
                            >
                                <span className="text-xs uppercase tracking-wider">{step.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Active Draft Clock Spotlight (Drafting Mode) */}
                {stateKey === 'DRAFTING' && (
                    <div className="mb-8 p-5 rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-black shadow-lg ${
                                    activeCaptain === 'A' ? 'bg-neon-green shadow-neon-green/20' : 'bg-neon-blue shadow-neon-blue/20'
                                }`}>
                                    {activeCaptain}
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                        Active Captain on the Clock
                                    </span>
                                    <h3 className="text-xl font-black uppercase italic text-white">
                                        {activeCaptain === 'A' ? `${captainA} (${teamAName})` : `${captainB} (${teamBName})`}
                                    </h3>
                                </div>
                            </div>

                            {/* 15-Second Timer Meter */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="text-right">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Pick Clock</span>
                                    <span className={`text-2xl font-black italic tracking-tighter ${
                                        timerSeconds <= 5 ? 'text-rose-500 animate-pulse' : 'text-neon-green'
                                    }`}>
                                        {timerSeconds}s
                                    </span>
                                </div>
                                <div className="w-48 h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${
                                            timerSeconds <= 5 ? 'bg-rose-500' : 'bg-neon-green'
                                        }`}
                                        style={{ width: `${(timerSeconds / 15) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Setup Controls (Setup Phase) */}
                {stateKey === 'SETUP' && (
                    <div className="mb-8 p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neon-green">
                                Captains & Turf Parameters
                            </span>
                            <span className="text-xs text-slate-400">Configure team names and captains before the toss</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Team A Name</label>
                                <input
                                    type="text"
                                    value={teamAName}
                                    onChange={(e) => setTeamAName(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Captain A</label>
                                <input
                                    type="text"
                                    value={captainA}
                                    onChange={(e) => setCaptainA(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Team B Name</label>
                                <input
                                    type="text"
                                    value={teamBName}
                                    onChange={(e) => setTeamBName(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-blue"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Captain B</label>
                                <input
                                    type="text"
                                    value={captainB}
                                    onChange={(e) => setCaptainB(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-blue"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={turfName}
                                    onChange={(e) => setTurfName(e.target.value)}
                                    placeholder="Turf Ground Name"
                                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                                />
                                <input
                                    type="text"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    placeholder="Match Format"
                                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white w-28"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleAutoBalance}
                                    className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white font-black text-xs uppercase tracking-wider transition-all border border-purple-500/30 flex items-center gap-1.5"
                                >
                                    <Sparkles size={13} /> 1-Click AI Auto Balance
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCoinTossOpen(true)}
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                                >
                                    <Play size={13} fill="black" /> Launch 3D Coin Toss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Completion Banner (Completed Phase) */}
                {stateKey === 'COMPLETED' && (
                    <div className="mb-8 p-6 rounded-[2.5rem] bg-gradient-to-r from-neon-green/15 via-slate-900 to-neon-blue/15 border border-neon-green/30 shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div>
                                <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-[10px] font-black uppercase tracking-wider border border-neon-green/30 inline-flex items-center gap-1.5 mb-2">
                                    <CheckCircle2 size={13} /> Squad Selection Finalized
                                </span>
                                <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white">
                                    {teamAName} vs {teamBName} Ready for Battle
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Both teams are locked in. Push your lineups directly to the tactical board, match ledger, or generate a WhatsApp story poster.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsPosterOpen(true)}
                                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/20 hover:border-white text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg"
                                >
                                    <Share2 size={13} /> Face-Off Poster
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(bookingId ? `/tactics/${bookingId}` : '/tactics')}
                                    className="px-4 py-2.5 rounded-xl bg-neon-green/15 hover:bg-neon-green text-neon-green hover:text-black border border-neon-green/30 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                                >
                                    <BookOpen size={13} /> Open in Playbook
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(bookingId ? `/scorecards/${bookingId}` : '/scorecards')}
                                    className="px-4 py-2.5 rounded-xl bg-neon-blue/15 hover:bg-neon-blue text-neon-blue hover:text-black border border-neon-blue/30 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                                >
                                    <Activity size={13} /> Open in ScoreHub
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                                >
                                    Save Session <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Primary Dual-Panel Draft Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Panel: Available Athlete Pool */}
                    <div className="lg:col-span-5">
                        <PlayerPoolDrawer
                            players={unpickedPool}
                            sport={sport}
                            isDrafting={stateKey === 'DRAFTING'}
                            activeCaptain={activeCaptain}
                            captainAName={teamAName}
                            captainBName={teamBName}
                            onPickPlayer={handlePickPlayer}
                            onAddPlayer={handleAddPlayer}
                            onRemovePlayer={handleRemovePlayer}
                            onBulkImport={handleBulkImport}
                        />
                    </div>

                    {/* Right Panel: Split Squad Rosters & Equilibrium Balance */}
                    <div className="lg:col-span-7">
                        <DraftRosterBoard
                            teamA={teamA}
                            teamB={teamB}
                            captainA={captainA}
                            captainB={captainB}
                            teamAName={teamAName}
                            teamBName={teamBName}
                            activeCaptain={activeCaptain}
                            isDrafting={stateKey === 'DRAFTING'}
                        />
                    </div>
                </div>

            </main>

            {/* 3D Coin Toss Modal */}
            <CoinTossModal
                isOpen={isCoinTossOpen}
                onClose={() => setIsCoinTossOpen(false)}
                captainA={captainA}
                captainB={captainB}
                teamAName={teamAName}
                teamBName={teamBName}
                onTossComplete={handleTossComplete}
            />

            {/* Matchday Face-Off Poster Modal */}
            <DraftPosterModal
                isOpen={isPosterOpen}
                onClose={() => setIsPosterOpen(false)}
                sport={sport}
                turfName={turfName}
                date={matchDate}
                format={format}
                captainA={captainA}
                captainB={captainB}
                teamAName={teamAName}
                teamBName={teamBName}
                teamA={teamA}
                teamB={teamB}
            />

            {/* Toast Notifications */}
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: null, type: 'info' })}
            />

            <Footer />
        </div>
    );
}
