import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Trophy, Sparkles, Plus, Trash2, 
    MapPin, Award, CheckCircle2, HelpCircle
} from 'lucide-react';
import { ScorecardFactory } from '../patterns/ScorecardStrategies';
import apiClient from '../../../utils/apiClient';

export default function ScorecardEntryModal({ 
    isOpen, 
    onClose, 
    initialScorecard = null, 
    bookingData = null, 
    onSuccess 
}) {
    const sports = ScorecardFactory.getSupportedSports();

    const [sport, setSport] = useState('Cricket');
    const [turfName, setTurfName] = useState('');
    const [turfLocation, setTurfLocation] = useState('');
    const [matchDate, setMatchDate] = useState('');
    const [matchTime, setMatchTime] = useState('');
    const [bookingId, setBookingId] = useState(null);

    // Team Information
    const [teamAName, setTeamAName] = useState('Team Alpha');
    const [teamACaptain, setTeamACaptain] = useState('');
    const [teamBName, setTeamBName] = useState('Team Beta');
    const [teamBCaptain, setTeamBCaptain] = useState('');

    // Cricket Data
    const [cricketData, setCricketData] = useState({
        matchOversLimit: 10,
        firstInnings: { team: 'A', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0 },
        secondInnings: { team: 'B', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0 }
    });

    // Football Data
    const [footballData, setFootballData] = useState({
        teamAGoals: 0,
        teamBGoals: 0,
        halfTimeScore: { teamA: 0, teamB: 0 },
        penalties: { isPenaltyShootout: false, scoreA: 0, scoreB: 0 },
        goalScorers: []
    });

    // Racket Data (Badminton / Tennis)
    const [racketData, setRacketData] = useState({
        matchFormat: 'Singles',
        sets: [
            { setNumber: 1, scoreA: 21, scoreB: 18, winner: 'A' },
            { setNumber: 2, scoreA: 19, scoreB: 21, winner: 'B' },
            { setNumber: 3, scoreA: 21, scoreB: 15, winner: 'A' }
        ]
    });

    // Universal Data
    const [universalData, setUniversalData] = useState({
        metricName: 'Points',
        pointsA: 0,
        pointsB: 0
    });

    // Accolades & Notes
    const [playerOfTheMatch, setPlayerOfTheMatch] = useState('');
    const [notes, setNotes] = useState('');

    // Goalscorer temp form for football
    const [newScorer, setNewScorer] = useState({ playerName: '', team: 'A', minute: '' });

    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Initialize or Reset form on modal open
    useEffect(() => {
        if (!isOpen) return;

        setErrorMsg(null);

        if (initialScorecard) {
            setSport(initialScorecard.sport || 'Cricket');
            setTurfName(initialScorecard.turfName || '');
            setTurfLocation(initialScorecard.turfLocation || '');
            setMatchDate(initialScorecard.matchDate || '');
            setMatchTime(initialScorecard.matchTime || '');
            setBookingId(initialScorecard.bookingId || null);
            setTeamAName(initialScorecard.teamA?.name || 'Team Alpha');
            setTeamACaptain(initialScorecard.teamA?.captain || '');
            setTeamBName(initialScorecard.teamB?.name || 'Team Beta');
            setTeamBCaptain(initialScorecard.teamB?.captain || '');
            setPlayerOfTheMatch(initialScorecard.playerOfTheMatch || '');
            setNotes(initialScorecard.notes || '');

            if (initialScorecard.cricketData) setCricketData(initialScorecard.cricketData);
            if (initialScorecard.footballData) setFootballData(initialScorecard.footballData);
            if (initialScorecard.racketData) setRacketData(initialScorecard.racketData);
            if (initialScorecard.universalData) setUniversalData(initialScorecard.universalData);
        } else if (bookingData) {
            const defaultSport = bookingData.sport || 'Cricket';
            setSport(defaultSport);
            setTurfName(bookingData.venue || bookingData.turfName || '');
            setTurfLocation(bookingData.location || 'Certified Ground');
            setMatchDate(bookingData.date || new Date().toISOString().split('T')[0]);
            setMatchTime(bookingData.time || bookingData.timeSlot || '');
            setBookingId(bookingData.id || bookingData._id || null);
            setTeamAName('My Squad');
            setTeamBName('Opponents');
            setTeamACaptain(JSON.parse(localStorage.getItem('user'))?.first_name || 'Captain');
            setTeamBCaptain('');
            setPlayerOfTheMatch('');
            setNotes('');
        } else {
            // Fresh blank
            setSport('Cricket');
            setTurfName('Local Arena Turf');
            setTurfLocation('Ground #1');
            setMatchDate(new Date().toISOString().split('T')[0]);
            setMatchTime('8:00 PM');
            setBookingId(null);
            setTeamAName('Team Alpha');
            setTeamBName('Team Beta');
            setTeamACaptain('');
            setTeamBCaptain('');
            setPlayerOfTheMatch('');
            setNotes('');
        }
    }, [isOpen, initialScorecard, bookingData]);

    if (!isOpen) return null;

    // Build virtual scorecard snapshot to test Strategy
    const currentScorecardSnapshot = {
        sport,
        turfName,
        turfLocation,
        matchDate,
        matchTime,
        bookingId,
        teamA: { name: teamAName, captain: teamACaptain },
        teamB: { name: teamBName, captain: teamBCaptain },
        cricketData,
        footballData,
        racketData,
        universalData,
        playerOfTheMatch,
        notes
    };

    // Calculate result preview in real-time via GoF Strategy
    const strategy = ScorecardFactory.getStrategy(sport);
    const summary = strategy.computeSummary(currentScorecardSnapshot);

    // Goalscorer helpers for Football
    const handleAddGoalScorer = () => {
        if (!newScorer.playerName.trim()) return;
        setFootballData(prev => ({
            ...prev,
            goalScorers: [
                ...prev.goalScorers,
                {
                    playerName: newScorer.playerName.trim(),
                    team: newScorer.team,
                    minute: newScorer.minute ? Number(newScorer.minute) : null,
                    isPenalty: false
                }
            ]
        }));
        setNewScorer({ playerName: '', team: 'A', minute: '' });
    };

    const handleRemoveGoalScorer = (index) => {
        setFootballData(prev => ({
            ...prev,
            goalScorers: prev.goalScorers.filter((_, i) => i !== index)
        }));
    };

    // Racket set helpers
    const handleAddSet = () => {
        setRacketData(prev => {
            const nextSetNum = (prev.sets?.length || 0) + 1;
            return {
                ...prev,
                sets: [
                    ...(prev.sets || []),
                    { setNumber: nextSetNum, scoreA: 0, scoreB: 0, winner: 'A' }
                ]
            };
        });
    };

    const handleUpdateSet = (index, field, val) => {
        setRacketData(prev => {
            const nextSets = [...prev.sets];
            nextSets[index] = {
                ...nextSets[index],
                [field]: Number(val)
            };
            // Automatically determine winner of set
            if (nextSets[index].scoreA > nextSets[index].scoreB) nextSets[index].winner = 'A';
            else if (nextSets[index].scoreB > nextSets[index].scoreA) nextSets[index].winner = 'B';
            return { ...prev, sets: nextSets };
        });
    };

    const handleRemoveSet = (index) => {
        setRacketData(prev => ({
            ...prev,
            sets: prev.sets.filter((_, i) => i !== index).map((s, idx) => ({ ...s, setNumber: idx + 1 }))
        }));
    };

    // Save Scorecard to Backend API
    const handleSaveScorecard = async () => {
        setIsSaving(true);
        setErrorMsg(null);

        try {
            const validation = strategy.validate(currentScorecardSnapshot);
            if (!validation.valid) {
                setErrorMsg(validation.error);
                setIsSaving(false);
                return;
            }

            const payload = {
                ...currentScorecardSnapshot,
                winner: summary.winner,
                resultSummary: summary.resultSummary,
                scorecardId: initialScorecard?._id || undefined
            };

            const res = await apiClient.post('/scorecards', payload);
            if (res.data?.success) {
                if (onSuccess) onSuccess(res.data.data);
                onClose();
            } else {
                setErrorMsg(res.data?.message || 'Failed to save scorecard.');
            }
        } catch (err) {
            console.error('Error saving scorecard:', err);
            setErrorMsg(err.response?.data?.message || 'Error occurred while saving scorecard.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-3xl my-auto bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green shadow-lg shadow-neon-green/10">
                                <Trophy size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">
                                    {initialScorecard ? 'Update Match Scorecard' : 'Log Match Result & Scorecard'}
                                </h2>
                                <p className="text-xs text-slate-400 font-medium">
                                    Track match statistics, individual scores, and declare winners on your ledger
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                            <HelpCircle size={16} />
                            {errorMsg}
                        </div>
                    )}

                    {/* Scrollable Form Body */}
                    <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-6 custom-scrollbar">
                        
                        {/* 1. Sport Selector Pills */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 block">
                                Choose Turf Sport
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                                {sports.map(s => {
                                    const isSelected = sport === s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setSport(s.id)}
                                            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                                isSelected 
                                                    ? 'bg-neon-green/15 border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.2)]' 
                                                    : 'bg-slate-900 border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-2xl mb-1">{s.icon}</span>
                                            <span className={`text-xs font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                {s.id}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Venue & Match Details */}
                        <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <MapPin size={12} className="text-neon-green" /> Venue & Timing
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Turf Name</label>
                                    <input
                                        type="text"
                                        value={turfName}
                                        onChange={(e) => setTurfName(e.target.value)}
                                        placeholder="e.g. Apex Box Cricket Turf"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Match Date</label>
                                    <input
                                        type="date"
                                        value={matchDate}
                                        onChange={(e) => setMatchDate(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Time Slot</label>
                                    <input
                                        type="text"
                                        value={matchTime}
                                        onChange={(e) => setMatchTime(e.target.value)}
                                        placeholder="e.g. 7:00 PM - 8:00 PM"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Teams & Captains */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Team A */}
                            <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-lg bg-neon-green/20 text-neon-green font-black text-xs flex items-center justify-center">A</span>
                                    <span className="text-xs font-black uppercase tracking-wider text-white">Team / Side A</span>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Team Name (e.g. Super Strikers)"
                                        value={teamAName}
                                        onChange={(e) => setTeamAName(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Captain / Lead Player Name"
                                        value={teamACaptain}
                                        onChange={(e) => setTeamACaptain(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 placeholder-slate-600 focus:outline-none focus:border-neon-green"
                                    />
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-lg bg-neon-blue/20 text-neon-blue font-black text-xs flex items-center justify-center">B</span>
                                    <span className="text-xs font-black uppercase tracking-wider text-white">Team / Side B</span>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Team Name (e.g. Thunder Warriors)"
                                        value={teamBName}
                                        onChange={(e) => setTeamBName(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-blue"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Captain / Lead Player Name"
                                        value={teamBCaptain}
                                        onChange={(e) => setTeamBCaptain(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 placeholder-slate-600 focus:outline-none focus:border-neon-blue"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Sport-Specific Score Matrix */}
                        
                        {/* Cricket Scoreboard */}
                        {sport === 'Cricket' && (
                            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 border border-neon-green/20 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-wider text-neon-green flex items-center gap-1.5">
                                        🏏 Cricket / Box Cricket Innings
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Max Overs:</span>
                                        <input
                                            type="number"
                                            value={cricketData.matchOversLimit}
                                            onChange={(e) => setCricketData(prev => ({ ...prev, matchOversLimit: Number(e.target.value) }))}
                                            className="w-14 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-center text-xs font-black text-white"
                                        />
                                    </div>
                                </div>

                                {/* Innings 1 */}
                                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                                        <span>1st Innings (Batting: {cricketData.firstInnings.team === 'A' ? teamAName : teamBName})</span>
                                        <button
                                            type="button"
                                            onClick={() => setCricketData(prev => ({
                                                ...prev,
                                                firstInnings: { ...prev.firstInnings, team: prev.firstInnings.team === 'A' ? 'B' : 'A' },
                                                secondInnings: { ...prev.secondInnings, team: prev.firstInnings.team === 'A' ? 'A' : 'B' }
                                            }))}
                                            className="text-[10px] text-neon-green font-bold uppercase underline"
                                        >
                                            Swap Batting First
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Runs</label>
                                            <input
                                                type="number"
                                                value={cricketData.firstInnings.runs}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    firstInnings: { ...prev.firstInnings, runs: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Wickets</label>
                                            <input
                                                type="number"
                                                max={10}
                                                value={cricketData.firstInnings.wickets}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    firstInnings: { ...prev.firstInnings, wickets: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Overs</label>
                                            <input
                                                type="number"
                                                value={cricketData.firstInnings.overs}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    firstInnings: { ...prev.firstInnings, overs: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Balls (0-5)</label>
                                            <input
                                                type="number"
                                                max={5}
                                                min={0}
                                                value={cricketData.firstInnings.balls || 0}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    firstInnings: { ...prev.firstInnings, balls: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Innings 2 */}
                                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                                        <span>2nd Innings (Chasing: {cricketData.secondInnings.team === 'A' ? teamAName : teamBName})</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                                            Target: {Number(cricketData.firstInnings.runs) + 1}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Runs</label>
                                            <input
                                                type="number"
                                                value={cricketData.secondInnings.runs}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    secondInnings: { ...prev.secondInnings, runs: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Wickets</label>
                                            <input
                                                type="number"
                                                max={10}
                                                value={cricketData.secondInnings.wickets}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    secondInnings: { ...prev.secondInnings, wickets: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Overs</label>
                                            <input
                                                type="number"
                                                value={cricketData.secondInnings.overs}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    secondInnings: { ...prev.secondInnings, overs: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-black block">Balls (0-5)</label>
                                            <input
                                                type="number"
                                                max={5}
                                                min={0}
                                                value={cricketData.secondInnings.balls || 0}
                                                onChange={(e) => setCricketData(prev => ({
                                                    ...prev,
                                                    secondInnings: { ...prev.secondInnings, balls: Number(e.target.value) }
                                                }))}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-center text-sm font-black text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Football Scoreboard */}
                        {sport === 'Football' && (
                            <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-950 border border-neon-blue/20 space-y-4">
                                <span className="text-xs font-black uppercase tracking-wider text-neon-blue flex items-center gap-1.5">
                                    ⚽ Football & Futsal Score
                                </span>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-center">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{teamAName}</p>
                                        <div className="flex items-center justify-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setFootballData(p => ({ ...p, teamAGoals: Math.max(0, p.teamAGoals - 1) }))}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black"
                                            >
                                                -
                                            </button>
                                            <span className="text-3xl font-black text-white">{footballData.teamAGoals}</span>
                                            <button 
                                                type="button"
                                                onClick={() => setFootballData(p => ({ ...p, teamAGoals: p.teamAGoals + 1 }))}
                                                className="w-8 h-8 rounded-lg bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue font-black"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-2 block font-bold">Goals</span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-center">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{teamBName}</p>
                                        <div className="flex items-center justify-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setFootballData(p => ({ ...p, teamBGoals: Math.max(0, p.teamBGoals - 1) }))}
                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black"
                                            >
                                                -
                                            </button>
                                            <span className="text-3xl font-black text-white">{footballData.teamBGoals}</span>
                                            <button 
                                                type="button"
                                                onClick={() => setFootballData(p => ({ ...p, teamBGoals: p.teamBGoals + 1 }))}
                                                className="w-8 h-8 rounded-lg bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue font-black"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-2 block font-bold">Goals</span>
                                    </div>
                                </div>

                                {/* Half Time Score */}
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
                                    <span className="text-slate-400 font-bold uppercase text-[10px]">Half-Time Score:</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={0}
                                            value={footballData.halfTimeScore?.teamA || 0}
                                            onChange={(e) => setFootballData(p => ({ ...p, halfTimeScore: { ...p.halfTimeScore, teamA: Number(e.target.value) } }))}
                                            className="w-12 bg-slate-900 border border-white/10 rounded-lg py-1 text-center font-bold text-white text-xs"
                                        />
                                        <span className="text-slate-500">-</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={footballData.halfTimeScore?.teamB || 0}
                                            onChange={(e) => setFootballData(p => ({ ...p, halfTimeScore: { ...p.halfTimeScore, teamB: Number(e.target.value) } }))}
                                            className="w-12 bg-slate-900 border border-white/10 rounded-lg py-1 text-center font-bold text-white text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Penalty Shootout Option */}
                                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={footballData.penalties?.isPenaltyShootout || false}
                                            onChange={(e) => setFootballData(p => ({
                                                ...p,
                                                penalties: { ...p.penalties, isPenaltyShootout: e.target.checked }
                                            }))}
                                            className="rounded border-white/20 bg-slate-900 text-neon-blue focus:ring-0"
                                        />
                                        <span>Decided on Penalty Shootout</span>
                                    </label>

                                    {footballData.penalties?.isPenaltyShootout && (
                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold">Penalties Won:</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={footballData.penalties.scoreA}
                                                    onChange={(e) => setFootballData(p => ({ ...p, penalties: { ...p.penalties, scoreA: Number(e.target.value) } }))}
                                                    className="w-12 bg-slate-900 border border-white/10 rounded-lg py-1 text-center font-bold text-white text-xs"
                                                />
                                                <span className="text-slate-500">-</span>
                                                <input
                                                    type="number"
                                                    value={footballData.penalties.scoreB}
                                                    onChange={(e) => setFootballData(p => ({ ...p, penalties: { ...p.penalties, scoreB: Number(e.target.value) } }))}
                                                    className="w-12 bg-slate-900 border border-white/10 rounded-lg py-1 text-center font-bold text-white text-xs"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Goal Scorers Adder */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Goal Scorers</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Scorer Name"
                                            value={newScorer.playerName}
                                            onChange={(e) => setNewScorer(p => ({ ...p, playerName: e.target.value }))}
                                            className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white"
                                        />
                                        <select
                                            value={newScorer.team}
                                            onChange={(e) => setNewScorer(p => ({ ...p, team: e.target.value }))}
                                            className="bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs font-bold text-white"
                                        >
                                            <option value="A">{teamAName}</option>
                                            <option value="B">{teamBName}</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Min '"
                                            value={newScorer.minute}
                                            onChange={(e) => setNewScorer(p => ({ ...p, minute: e.target.value }))}
                                            className="w-16 bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-center font-bold text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddGoalScorer}
                                            className="px-3 py-1.5 rounded-xl bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black font-black text-xs transition-all"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {footballData.goalScorers?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {footballData.goalScorers.map((g, idx) => (
                                                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                                    ⚽ {g.playerName} {g.minute ? `(${g.minute}')` : ''} [{g.team === 'A' ? teamAName : teamBName}]
                                                    <button type="button" onClick={() => handleRemoveGoalScorer(idx)} className="text-rose-400 hover:text-rose-300">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Racket Sports (Badminton / Tennis) */}
                        {(sport === 'Badminton' || sport === 'Tennis') && (
                            <div className="p-5 rounded-3xl bg-gradient-to-br from-fuchsia-950/20 via-slate-900 to-slate-950 border border-fuchsia-500/20 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
                                        🏸 Set Scores (Best of 3 / 5)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddSet}
                                        className="px-3 py-1 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Add Set
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {racketData.sets?.map((set, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-white/5">
                                            <span className="text-xs font-black uppercase text-slate-400">Set {set.setNumber}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-slate-500">{teamAName}:</span>
                                                    <input
                                                        type="number"
                                                        value={set.scoreA}
                                                        onChange={(e) => handleUpdateSet(idx, 'scoreA', e.target.value)}
                                                        className="w-14 bg-slate-900 border border-white/10 rounded-lg py-1 text-center font-bold text-white text-xs"
                                                    />
                                                </div>
                                                <span className="text-slate-600 font-black">-</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-slate-500">{teamBName}:</span>
                                                    <input
                                                        type="number"
                                                        value={set.scoreB}
                                                        onChange={(e) => handleUpdateSet(idx, 'scoreB', e.target.value)}
                                                        className="w-14 bg-slate-900 border border-white/10 rounded-lg py-1 text-center font-bold text-white text-xs"
                                                    />
                                                </div>
                                                {racketData.sets.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSet(idx)}
                                                        className="p-1 text-rose-400 hover:text-rose-300"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Universal Sport Scoreboard */}
                        {sport === 'Universal' && (
                            <div className="p-5 rounded-3xl bg-slate-900/60 border border-purple-500/20 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                                        🎯 Universal Score Metric
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Points / Goals"
                                        value={universalData.metricName}
                                        onChange={(e) => setUniversalData(p => ({ ...p, metricName: e.target.value }))}
                                        className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white w-28 text-center"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-center">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{teamAName}</p>
                                        <input
                                            type="number"
                                            value={universalData.pointsA}
                                            onChange={(e) => setUniversalData(p => ({ ...p, pointsA: Number(e.target.value) }))}
                                            className="w-20 mx-auto bg-slate-900 border border-white/10 rounded-xl py-2 text-center text-2xl font-black text-white"
                                        />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-center">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{teamBName}</p>
                                        <input
                                            type="number"
                                            value={universalData.pointsB}
                                            onChange={(e) => setUniversalData(p => ({ ...p, pointsB: Number(e.target.value) }))}
                                            className="w-20 mx-auto bg-slate-900 border border-white/10 rounded-xl py-2 text-center text-2xl font-black text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Live Strategy Result Preview Banner */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-green/10 via-slate-900 to-neon-blue/10 border border-white/10 flex items-center justify-between">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                                    Live Strategy Outcome (GoF Pattern)
                                </span>
                                <p className="text-sm font-black italic uppercase text-white mt-0.5">
                                    {summary.resultSummary}
                                </p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/30 text-neon-green text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={12} /> Live Preview
                            </div>
                        </div>

                        {/* 6. Accolades & Match Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5 block">
                                    <Award size={12} className="text-amber-400" /> Player of the Match / MVP
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe (45 runs & 2 wkts)"
                                    value={playerOfTheMatch}
                                    onChange={(e) => setPlayerOfTheMatch(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">
                                    Match Highlights & Notes
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Thriller last ball finish, wet pitch"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveScorecard}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            {isSaving ? 'Logging Match...' : 'Save & Commit to Ledger'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
