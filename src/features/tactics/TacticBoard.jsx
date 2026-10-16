import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Toast from '../../components/ui/Toast';
import apiClient from '../../utils/apiClient';

import PitchCanvas from './components/PitchCanvas';
import TacticToolbar from './components/TacticToolbar';
import LineupCardModal from './components/LineupCardModal';
import { getFormationPositions, SPORT_CATALOGS } from './patterns/FormationStrategies';
import { TacticCaretaker } from './patterns/TacticMemento';

export default function TacticBoard() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // Core Board State
    const [sport, setSport] = useState('Football');
    const [pitchFormat, setPitchFormat] = useState('5v5');
    const [formation, setFormation] = useState('1-2-1');
    const [title, setTitle] = useState('Friday Night Matchday Squad');
    const [notes, setNotes] = useState('');
    const [players, setPlayers] = useState(() => getFormationPositions('Football', '5v5', '1-2-1'));
    const [drawings, setDrawings] = useState([]);
    const [activeTool, setActiveTool] = useState('select'); // 'select' | 'pass' | 'run' | 'press'
    
    // Booking Metadata (if linked to a booking)
    const [bookingData, setBookingData] = useState(null);

    // Memento Caretaker Instance (Maintains Undo / Redo Stacks)
    const caretakerRef = useRef(new TacticCaretaker(30));
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Modals & Notifications
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ message: null, type: 'info' });

    // Sync caretaker availability state
    const updateCaretakerButtons = () => {
        setCanUndo(caretakerRef.current.canUndo());
        setCanRedo(caretakerRef.current.canRedo());
    };

    // Take snapshot of active board state for Undo/Redo
    const pushStateToMemento = (overrideState = {}) => {
        const stateToSave = {
            sport,
            players,
            drawings,
            formation,
            pitchFormat,
            title,
            ...overrideState
        };
        caretakerRef.current.saveState(stateToSave);
        updateCaretakerButtons();
    };

    // ----------------------------------------------------
    // INITIALIZATION & BACKEND LOADING
    // ----------------------------------------------------
    useEffect(() => {
        const loadBookingTactic = async () => {
            if (!bookingId) return;
            try {
                const res = await apiClient.get(`/tactics/booking/${bookingId}`);
                if (res.data.success) {
                    let detectedSport = 'Football';
                    if (res.data.booking) {
                        setBookingData(res.data.booking);
                        setTitle(`${res.data.booking.turfName} Lineup`);
                        if (res.data.booking.sport && res.data.booking.sport.toLowerCase().includes('cricket')) {
                            detectedSport = 'Cricket';
                        }
                    }

                    // If existing tactic exists in database, hydrate it
                    if (res.data.data) {
                        const t = res.data.data;
                        const tacticSport = t.sport || detectedSport;
                        setSport(tacticSport);
                        if (t.pitchFormat) setPitchFormat(t.pitchFormat);
                        if (t.formation) setFormation(t.formation);
                        if (t.title) setTitle(t.title);
                        if (t.players && t.players.length > 0) setPlayers(t.players);
                        if (t.drawings) setDrawings(t.drawings);
                        if (t.notes) setNotes(t.notes);
                    } else if (detectedSport === 'Cricket') {
                        // Brand new cricket booking: initialize with cricket defaults
                        setSport('Cricket');
                        setPitchFormat('7v7');
                        setFormation('7-ring');
                        setPlayers(getFormationPositions('Cricket', '7v7', '7-ring'));
                    }
                }
            } catch (err) {
                console.warn('No existing tactic found or error loading:', err.message);
            }
        };

        loadBookingTactic();
    }, [bookingId]);

    // ----------------------------------------------------
    // SPORT & FORMATION STRATEGY SWITCHING
    // ----------------------------------------------------
    const handleSportChange = (newSport) => {
        if (newSport === sport) return;
        pushStateToMemento();
        setSport(newSport);
        const sportConfig = SPORT_CATALOGS[newSport] || SPORT_CATALOGS.Football;
        const newFormat = sportConfig.defaultFormat;
        const newFormation = sportConfig.formations[newFormat][0].id;
        setPitchFormat(newFormat);
        setFormation(newFormation);
        const newPositions = getFormationPositions(newSport, newFormat, newFormation);
        setPlayers(newPositions);
        setDrawings([]);
        updateCaretakerButtons();
        setToast({ 
            message: `Switched to ${newSport === 'Cricket' ? 'Turf Box Cricket (Square Arena Mode)' : 'Football (Rectangular Stadium Mode)'}`, 
            type: 'info' 
        });
    };

    const handlePitchFormatChange = (newFormat) => {
        pushStateToMemento();
        setPitchFormat(newFormat);
        const sportConfig = SPORT_CATALOGS[sport] || SPORT_CATALOGS.Football;
        const list = sportConfig.formations[newFormat] || sportConfig.formations[sportConfig.defaultFormat];
        const defaultFormation = list[0].id;
        setFormation(defaultFormation);
        const newPositions = getFormationPositions(sport, newFormat, defaultFormation);
        setPlayers(newPositions);
        updateCaretakerButtons();
    };

    const handleFormationChange = (newFormation) => {
        pushStateToMemento();
        setFormation(newFormation);
        const newPositions = getFormationPositions(sport, pitchFormat, newFormation);
        
        // Preserve existing player custom names & numbers while transitioning coordinates
        const merged = newPositions.map((pos, idx) => {
            const existing = players[idx];
            return {
                ...pos,
                name: existing?.name || pos.name,
                number: existing?.number || pos.number,
                isCaptain: existing?.isCaptain || pos.isCaptain
            };
        });

        setPlayers(merged);
        updateCaretakerButtons();
    };

    const handleResetPositions = () => {
        pushStateToMemento();
        const fresh = getFormationPositions(sport, pitchFormat, formation);
        setPlayers(fresh);
        updateCaretakerButtons();
        setToast({ message: 'Formation positions reset to default coordinates.', type: 'info' });
    };

    const handleClearDrawings = () => {
        if (drawings.length === 0) return;
        pushStateToMemento();
        setDrawings([]);
        updateCaretakerButtons();
        setToast({ message: 'Tactical ink cleared.', type: 'info' });
    };

    // ----------------------------------------------------
    // GOF MEMENTO UNDO / REDO OPERATIONS
    // ----------------------------------------------------
    const handleUndo = () => {
        const currentState = { sport, players, drawings, formation, pitchFormat, title };
        const prevState = caretakerRef.current.undo(currentState);
        if (prevState) {
            if (prevState.sport) setSport(prevState.sport);
            setPlayers(prevState.players);
            setDrawings(prevState.drawings);
            setFormation(prevState.formation);
            setPitchFormat(prevState.pitchFormat);
            if (prevState.title) setTitle(prevState.title);
            updateCaretakerButtons();
        }
    };

    const handleRedo = () => {
        const currentState = { sport, players, drawings, formation, pitchFormat, title };
        const nextState = caretakerRef.current.redo(currentState);
        if (nextState) {
            if (nextState.sport) setSport(nextState.sport);
            setPlayers(nextState.players);
            setDrawings(nextState.drawings);
            setFormation(nextState.formation);
            setPitchFormat(nextState.pitchFormat);
            if (nextState.title) setTitle(nextState.title);
            updateCaretakerButtons();
        }
    };

    // Keyboard Shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) handleRedo();
                else handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sport, players, drawings, formation, pitchFormat]);

    // ----------------------------------------------------
    // SAVE TACTIC TO DATABASE
    // ----------------------------------------------------
    const handleSaveTactic = async () => {
        setIsSaving(true);
        try {
            const payload = {
                bookingId: bookingId || null,
                title: title.trim() || 'Tactical Plan',
                sport,
                pitchFormat,
                formation,
                players,
                drawings,
                notes
            };

            const res = await apiClient.post('/tactics', payload);
            if (res.data.success) {
                setToast({ message: 'Tactical Playbook saved to your profile!', type: 'success' });
            }
        } catch (err) {
            console.error('Error saving tactic:', err);
            setToast({ message: err.response?.data?.message || 'Failed to save tactical plan', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-neon-green selection:text-black">
            <Header />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
                {/* Return button & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-md group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[10px] font-black uppercase tracking-widest mb-1">
                                <BookOpen className="w-3.5 h-3.5" /> TacticBoard Pro • Multi-Sport Tactical Engine
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">
                                {sport === 'Cricket' ? 'Box Cricket ' : 'Arena '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-emerald-400 to-teal-400">
                                    {sport === 'Cricket' ? 'Cage Board' : 'Playbook'}
                                </span>
                            </h1>
                            <div className="mt-1 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-transparent border-b border-white/10 hover:border-white/30 focus:border-neon-green text-xs sm:text-sm font-bold text-slate-300 focus:text-white outline-none transition-colors px-1 py-0.5 w-64 sm:w-80 truncate"
                                    placeholder="Tactical Plan Name..."
                                    title="Click to rename playbook"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Booking Context Pill (if accessed via booking) */}
                    {bookingData && (
                        <div className="flex items-center gap-4 p-3 px-5 rounded-2xl bg-slate-900 border border-white/10 text-xs shadow-xl">
                            <div className="w-9 h-9 rounded-xl bg-neon-green/10 text-neon-green flex items-center justify-center font-black">
                                {sport === 'Cricket' ? '🏏' : '🏟️'}
                            </div>
                            <div>
                                <p className="font-black text-white uppercase">{bookingData.turfName}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{bookingData.date} • {bookingData.timeSlot.split(' - ')[0]}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Interactive Work Area */}
                <div className="flex flex-col items-center">
                    {/* Interactive Toolbar */}
                    <TacticToolbar
                        sport={sport}
                        onSportChange={handleSportChange}
                        pitchFormat={pitchFormat}
                        onPitchFormatChange={handlePitchFormatChange}
                        selectedFormation={formation}
                        onFormationChange={handleFormationChange}
                        activeTool={activeTool}
                        onToolChange={setActiveTool}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onClearDrawings={handleClearDrawings}
                        onResetPositions={handleResetPositions}
                        onSave={handleSaveTactic}
                        onOpenExportModal={() => setIsExportModalOpen(true)}
                        isSaving={isSaving}
                    />

                    {/* Pitch Canvas */}
                    <PitchCanvas
                        sport={sport}
                        players={players}
                        onPlayersChange={setPlayers}
                        drawings={drawings}
                        onDrawingsChange={setDrawings}
                        activeTool={activeTool}
                        onActionCompleted={() => {
                            pushStateToMemento();
                        }}
                    />

                    {/* Tactical Briefing Notes */}
                    <div className="w-full max-w-4xl mt-6 p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <span>📝</span> Tactical Briefing & Strategy Instructions
                            </label>
                            <span className="text-[9px] text-slate-500 font-mono">Auto-saved with playbook</span>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="2"
                            placeholder={sport === 'Cricket' ? "e.g. Keep 2 overs of pace in powerplay, target leg stump yorkers during death overs..." : "e.g. High press in first 10 minutes, overlap through wing-backs on counter-attack..."}
                            className="w-full bg-slate-950/80 border border-white/5 rounded-2xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:border-neon-green outline-none resize-none transition-colors"
                        />
                    </div>

                    {/* Design Pattern Academic Attribution Banner */}
                    <div className="w-full max-w-4xl mt-6 p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue flex items-center justify-center font-black">
                                <Layers className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">Architectural Design Patterns Applied</span>
                                <span className="text-[10px] text-slate-500 font-mono">GoF Strategy Pattern (Sport Formations: Football & Box Cricket) + GoF Memento Pattern (Undo/Redo History Stack)</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            Academic Grade
                        </span>
                    </div>
                </div>
            </main>

            {/* Lineup Card Broadcast Exporter Modal */}
            <LineupCardModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title={title}
                sport={sport}
                venueName={bookingData?.turfName || (sport === 'Cricket' ? 'Turf Box Arena' : 'Arena Pro Stadium')}
                matchDate={bookingData?.date || 'Upcoming Match'}
                matchTime={bookingData?.timeSlot?.split(' - ')[0] || 'Prime Slot'}
                pitchFormat={pitchFormat}
                formation={formation}
                players={players}
            />

            <Footer />
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: null })} />
        </div>
    );
}
