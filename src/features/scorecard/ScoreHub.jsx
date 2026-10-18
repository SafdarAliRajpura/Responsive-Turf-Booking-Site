import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Plus, Search, 
    Award, Activity, BookOpen
} from 'lucide-react';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Toast from '../../components/ui/Toast';
import apiClient from '../../utils/apiClient';

import ScorecardCard from './components/ScorecardCard';
import ScorecardEntryModal from './components/ScorecardEntryModal';
import MatchPosterModal from './components/MatchPosterModal';
import { ScorecardFactory } from './patterns/ScorecardStrategies';

export default function ScoreHub() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // Scorecards and stats
    const [scorecards, setScorecards] = useState([]);
    const [careerStats, setCareerStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters and search
    const [selectedSport, setSelectedSport] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [editingScorecard, setEditingScorecard] = useState(null);
    const [posterScorecard, setPosterScorecard] = useState(null);
    const [isPosterOpen, setIsPosterOpen] = useState(false);
    const [bookingPrefill, setBookingPrefill] = useState(null);

    // Toast
    const [toast, setToast] = useState({ message: null, type: 'info' });

    // Fetch user scorecards & stats
    const fetchScorecardsAndStats = async () => {
        setLoading(true);
        try {
            const [cardsRes, statsRes] = await Promise.all([
                apiClient.get('/scorecards'),
                apiClient.get('/scorecards/career-stats')
            ]);

            if (cardsRes.data?.success) {
                setScorecards(cardsRes.data.data || []);
            }
            if (statsRes.data?.success) {
                setCareerStats(statsRes.data.data);
            }
        } catch (err) {
            console.error('Failed to load scorecards:', err);
            setToast({ message: 'Failed to sync match ledger data.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchScorecardsAndStats();
    }, []);

    // Check if bookingId is passed in URL
    useEffect(() => {
        if (!bookingId) return;

        const loadBookingAndOpenModal = async () => {
            try {
                // First check if a scorecard already exists for this booking
                const res = await apiClient.get(`/scorecards/by-booking/${bookingId}`);
                if (res.data?.success && res.data.data) {
                    // Scorecard already exists, open it for editing
                    setEditingScorecard(res.data.data);
                    setIsEntryModalOpen(true);
                } else {
                    // Try to fetch booking metadata to pre-populate entry
                    const bookRes = await apiClient.get('/bookings');
                    if (bookRes.data?.success) {
                        const target = bookRes.data.data.find(b => b._id === bookingId);
                        if (target) {
                            setBookingPrefill({
                                id: target._id,
                                venue: target.turfName,
                                date: target.date,
                                time: target.timeSlot,
                                sport: target.sport || 'Cricket'
                            });
                            setIsEntryModalOpen(true);
                        }
                    }
                }
            } catch (err) {
                console.error('Error prefetching booking for scorecard:', err);
            }
        };

        loadBookingAndOpenModal();
    }, [bookingId]);

    // Handle delete scorecard
    const handleDeleteScorecard = async (id) => {
        if (!window.confirm('Are you sure you want to delete this match record from your ledger?')) return;
        try {
            const res = await apiClient.delete(`/scorecards/${id}`);
            if (res.data?.success) {
                setToast({ message: 'Match scorecard removed from ledger.', type: 'success' });
                fetchScorecardsAndStats();
            }
        } catch (err) {
            console.error('Failed to delete scorecard:', err);
            setToast({ message: 'Failed to delete scorecard.', type: 'error' });
        }
    };

    // Handle open poster
    const handleOpenPoster = (sc) => {
        setPosterScorecard(sc);
        setIsPosterOpen(true);
    };

    // Handle direct WhatsApp share
    const handleWhatsAppShare = (sc) => {
        const strategy = ScorecardFactory.getStrategy(sc.sport);
        const text = strategy.formatWhatsAppShare(sc);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Handle open edit
    const handleOpenEdit = (sc) => {
        setEditingScorecard(sc);
        setBookingPrefill(null);
        setIsEntryModalOpen(true);
    };

    // Filtered scorecards
    const filteredScorecards = scorecards.filter(sc => {
        const matchesSport = selectedSport === 'All' || sc.sport?.toLowerCase() === selectedSport.toLowerCase();
        const matchesSearch = !searchQuery.trim() || 
            sc.teamA?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sc.teamB?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sc.turfName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sc.sport?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSport && matchesSearch;
    });

    const sportFilters = ['All', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Universal'];

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-neon-green selection:text-black">
            <Header />

            {/* Ambient Cyber Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[650px] h-[650px] bg-neon-green/5 rounded-full blur-[160px]" />
                <div className="absolute top-1/2 right-1/4 w-[650px] h-[650px] bg-neon-blue/5 rounded-full blur-[160px]" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-24">
                
                {/* Hero & Title Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                            <span className="text-neon-green font-black uppercase tracking-[0.3em] text-[10px]">
                                Cricfy-Style Multi-Sport Match Ledger
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                            SCORE<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">HUB</span>
                        </h1>
                        <p className="text-slate-400 text-xs md:text-sm font-medium mt-1 max-w-xl">
                            Log match scores manually for box cricket, futsal, badminton & more. Declare winners, award MVP trophies, and generate HD broadcast story posters!
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => {
                                setEditingScorecard(null);
                                setBookingPrefill(null);
                                setIsEntryModalOpen(true);
                            }}
                            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-neon-green to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Log Match Score
                        </button>
                    </div>
                </div>

                {/* Athlete Career Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {/* Total Matches */}
                    <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recorded Games</span>
                            <div className="w-8 h-8 rounded-xl bg-neon-green/10 text-neon-green flex items-center justify-center">
                                <Activity size={16} />
                            </div>
                        </div>
                        <div className="text-3xl font-black italic text-white">
                            {careerStats?.totalMatches ?? scorecards.length}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                            Verified on Turf Ledger
                        </p>
                    </div>

                    {/* Most Played Sport */}
                    <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Arena</span>
                            <div className="w-8 h-8 rounded-xl bg-neon-blue/10 text-neon-blue flex items-center justify-center">
                                <Trophy size={16} />
                            </div>
                        </div>
                        <div className="text-2xl font-black italic text-white truncate">
                            {scorecards.length > 0 ? (
                                Object.entries(
                                    scorecards.reduce((acc, c) => ({ ...acc, [c.sport]: (acc[c.sport] || 0) + 1 }), {})
                                ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Cricket'
                            ) : 'Ready'}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                            Multi-Sport Strategy Engine
                        </p>
                    </div>

                    {/* MVP Medals */}
                    <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MVP Honors</span>
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <Award size={16} />
                            </div>
                        </div>
                        <div className="text-3xl font-black italic text-amber-400">
                            {scorecards.filter(s => s.playerOfTheMatch).length}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                            Player of the Match Awards
                        </p>
                    </div>

                    {/* Quick Tactical Playbook Link */}
                    <div 
                        onClick={() => navigate('/tactics')}
                        className="p-5 rounded-3xl bg-gradient-to-br from-neon-green/10 via-slate-900 to-slate-950 border border-neon-green/20 backdrop-blur-xl cursor-pointer hover:border-neon-green/40 hover:scale-[1.02] transition-all flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neon-green">Pro Suite</span>
                            <BookOpen size={16} className="text-neon-green" />
                        </div>
                        <div>
                            <h4 className="text-base font-black italic uppercase text-white">Tactics Board</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Design formations & lineups</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
                    {/* Sport Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                        {sportFilters.map(sport => {
                            const isSelected = selectedSport === sport;
                            return (
                                <button
                                    key={sport}
                                    onClick={() => setSelectedSport(sport)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                        isSelected 
                                            ? 'bg-white text-black shadow-lg shadow-white/10' 
                                            : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                                    }`}
                                >
                                    {sport === 'Cricket' && '🏏 '}
                                    {sport === 'Football' && '⚽ '}
                                    {sport === 'Badminton' && '🏸 '}
                                    {sport === 'Tennis' && '🎾 '}
                                    {sport === 'Universal' && '🎯 '}
                                    {sport}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[260px]">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Filter by Team or Turf..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-neon-green"
                        />
                    </div>
                </div>

                {/* Scorecards Grid / Empty State */}
                {loading ? (
                    <div className="text-center py-20 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-white/10 border-t-neon-green rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Syncing Turf Match Ledger...
                        </p>
                    </div>
                ) : filteredScorecards.length > 0 ? (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredScorecards.map(sc => (
                                <ScorecardCard
                                    key={sc._id}
                                    scorecard={sc}
                                    onOpenPoster={handleOpenPoster}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleDeleteScorecard}
                                    onWhatsAppShare={handleWhatsAppShare}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="p-12 md:p-16 rounded-[2.5rem] bg-slate-900/40 border border-white/5 text-center max-w-xl mx-auto">
                        <div className="w-16 h-16 rounded-3xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green mx-auto mb-4">
                            <Trophy size={28} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase text-white mb-2">
                            No Match Records Found
                        </h3>
                        <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto mb-6">
                            {searchQuery || selectedSport !== 'All' 
                                ? 'No games match your selected sport or search query.' 
                                : 'You have not logged any match scorecards yet. Record your first turf game to build your career match ledger!'}
                        </p>
                        <button
                            onClick={() => {
                                setEditingScorecard(null);
                                setBookingPrefill(null);
                                setIsEntryModalOpen(true);
                            }}
                            className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-200 text-black font-black text-xs uppercase tracking-wider transition-all"
                        >
                            Log Your First Scorecard
                        </button>
                    </div>
                )}
            </main>

            {/* Modals */}
            <ScorecardEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => {
                    setIsEntryModalOpen(false);
                    setEditingScorecard(null);
                    setBookingPrefill(null);
                }}
                initialScorecard={editingScorecard}
                bookingData={bookingPrefill}
                onSuccess={(savedCard) => {
                    setToast({ message: 'Scorecard successfully logged!', type: 'success' });
                    fetchScorecardsAndStats();
                }}
            />

            <MatchPosterModal
                isOpen={isPosterOpen}
                onClose={() => setIsPosterOpen(false)}
                scorecard={posterScorecard}
            />

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: null, type: 'info' })}
            />

            <Footer />
        </div>
    );
}
