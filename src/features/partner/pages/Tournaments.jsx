import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, MapPin, Calendar, Users, IndianRupee, Clock, X, Trash2, Edit, CheckCircle, Upload, Image as ImageIcon, Loader2, User as UserIcon } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import apiClient from '../../../utils/apiClient';

const TournamentCard = ({ tournament, onEdit, onDelete, index, onViewRoster }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-neon-purple/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
    >
        <div className="relative h-48">
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors z-10" />
            <img 
                src={tournament.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80'} 
                alt={tournament.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                    tournament.status === 'Upcoming' ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30' :
                    tournament.status === 'Ongoing' ? 'bg-neon-green/20 text-neon-green border-neon-green/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                }`}>
                    {tournament.status}
                </span>
            </div>
            <div className="absolute bottom-4 left-4 z-20">
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <Trophy className="w-3 h-3 text-neon-yellow" />
                    <span className="text-white font-black text-xs">₹{tournament.prizePool.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div className="p-6">
            <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter group-hover:text-neon-purple transition-colors truncate">
                {tournament.name}
            </h3>
            
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-neon-purple flex-shrink-0" />
                    <span className="truncate">{tournament.location}</span>
                </div>
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                        <span>Squad Occupancy</span>
                        <span className="text-white">{tournament.registeredTeams || 0} / {tournament.totalSlots} JOINED</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((tournament.registeredTeams || 0) / tournament.totalSlots) * 100}%` }}
                            className="h-full bg-neon-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                    <button 
                        onClick={() => onViewRoster(tournament)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-neon-purple/20 text-slate-400 hover:text-neon-purple rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
                    >
                        <Users className="w-3.5 h-3.5" /> Roster
                    </button>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onEdit(tournament)}
                        className="p-2 hover:bg-neon-blue/10 rounded-xl text-slate-400 hover:text-neon-blue transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(tournament._id)}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [rosterModalOpen, setRosterModalOpen] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isLoadingRoster, setIsLoadingRoster] = useState(false);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    
    const initialFormState = {
        name: '', description: '', category: 'Football', location: '',
        date: '', time: '', entryFee: '', prizePool: '', totalSlots: '',
        minPlayers: 5, maxPlayers: 11,
        status: 'Upcoming', image: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchMyTournaments = async () => {
        try {
            const userString = localStorage.getItem('user');
            if (!userString) return;
            const user = JSON.parse(userString);
            const res = await apiClient.get(`/tournaments?owner=${user.id || user._id}`);
            if (res.data.success) {
                setTournaments(res.data.data);
            }
        } catch (err) {
            console.error("Fetch Tournaments Error:", err);
            setToast({ message: "Network synchronization failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTournaments();
    }, []);

    const openCreateModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openEditModal = (tournament) => {
        setIsEditing(true);
        setEditingId(tournament._id);
        setFormData({
            name: tournament.name,
            description: tournament.description,
            category: tournament.category,
            location: tournament.location,
            date: tournament.date,
            time: tournament.time,
            entryFee: tournament.entryFee,
            prizePool: tournament.prizePool,
            totalSlots: tournament.totalSlots,
            minPlayers: tournament.minPlayers,
            maxPlayers: tournament.maxPlayers,
            status: tournament.status,
            image: tournament.image
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = isEditing ? `/tournaments/${editingId}` : '/tournaments';
            const method = isEditing ? 'patch' : 'post';
            
            const res = await apiClient[method](url, formData);
            
            if (res.data.success) {
                setToast({ 
                    message: isEditing ? "Blueprint Modified Successfully" : "Championship Live!", 
                    type: "success" 
                });
                setIsModalOpen(false);
                fetchMyTournaments();
            }
        } catch (err) {
            console.error("Submission Error:", err);
            setToast({ message: "Transmission Error: Deployment failed", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Abort this championship? This action is IRREVERSIBLE.")) return;
        try {
            const res = await apiClient.delete(`/tournaments/${id}`);
            if (res.data.success) {
                setToast({ message: "Tournament Terminated", type: "success" });
                fetchMyTournaments();
            }
        } catch (err) {
            setToast({ message: "Decommissioning Failed", type: "error" });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleViewRoster = async (tournament) => {
        setSelectedTournament(tournament);
        setRosterModalOpen(true);
        setIsLoadingRoster(true);
        try {
            const res = await apiClient.get(`/tournaments/${tournament._id}/registrations`);
            if (res.data.success) {
                setRegistrations(res.data.data);
            }
        } catch (err) {
            console.error("Fetch roster error:", err);
            setToast({ message: "Failed to load roster intel.", type: "error" });
        } finally {
            setIsLoadingRoster(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">CHAMPIONSHIPS <span className="text-neon-purple text-2xl">LAB</span></h1>
                    <p className="text-slate-400 font-medium tracking-tight">Engineer and manage elite sports tournaments.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openCreateModal}
                    className="bg-neon-purple text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:bg-white hover:text-black transition-all"
                >
                    <Plus className="w-5 h-5" /> Design Tournament
                </motion.button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Syncing Arena Matrix...</p>
                </div>
            ) : tournaments.length === 0 ? (
                <div className="py-24 text-center bg-slate-900/50 border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-white/5">
                        <Trophy className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase italic tracking-tighter">No Active Campaigns</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">Click 'Design Tournament' to launch your first championship onto the Arena Pro network.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.map((t, i) => (
                        <TournamentCard 
                            key={t._id} 
                            tournament={t} 
                            index={i} 
                            onDelete={handleDelete} 
                            onEdit={openEditModal} 
                            onViewRoster={handleViewRoster}
                        />
                    ))}
                </div>
            )}

            {/* Premium Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 rounded-bl-[100%] pointer-events-none blur-3xl" />
                            
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                        {isEditing ? 'Modify' : 'Campaign'} <span className="text-neon-purple">Blueprint</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium">{isEditing ? 'Update the parameters of your active tournament.' : 'Define the parameters for your next elite tournament.'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Championship Name</label>
                                        <input 
                                            type="text" required value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            placeholder="SUPER LEAGUE 2026"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:border-neon-purple/50 transition-all font-bold italic uppercase tracking-tighter"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Sport Discipline</label>
                                        <select 
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-neon-purple/50 transition-all font-bold"
                                        >
                                            <option>Football</option>
                                            <option>Cricket</option>
                                            <option>Badminton</option>
                                            <option>Tennis</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Campaign Brief</label>
                                    <textarea 
                                        required value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        placeholder="Experience the peak of local competition..."
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:border-neon-purple/50 transition-all h-24 resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Host Stadium / Venue</label>
                                        <input 
                                            type="text" required value={formData.location}
                                            onChange={e => setFormData({...formData, location: e.target.value})}
                                            placeholder="Arena Pro Central"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:border-neon-purple/50 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Visual Asset (Banner)</label>
                                        <div className="relative group/upload h-[60px]">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className={`w-full h-full border border-dashed rounded-2xl flex items-center px-4 transition-all ${
                                                formData.image ? 'border-neon-purple/50 bg-neon-purple/5' : 'border-white/10 hover:border-white/20 bg-slate-950'
                                            }`}>
                                                {formData.image ? (
                                                    <div className="flex items-center gap-3 w-full h-full">
                                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                        </div>
                                                        <p className="text-neon-purple text-[10px] font-black uppercase tracking-widest truncate">Asset Loaded ✓</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4 text-slate-500 mr-2" />
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Upload Media</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Launch Date</label>
                                        <input 
                                            type="date" required value={formData.date}
                                            onChange={e => setFormData({...formData, date: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-neon-purple/50 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Kickoff</label>
                                        <input 
                                            type="time" required value={formData.time}
                                            onChange={e => setFormData({...formData, time: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-neon-purple/50 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Max Slots</label>
                                        <input 
                                            type="number" required value={formData.totalSlots}
                                            onChange={e => setFormData({...formData, totalSlots: e.target.value})}
                                            placeholder="16"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-neon-green font-black outline-none focus:border-neon-green/50 text-center"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 bg-white/5 p-5 rounded-[1.5rem] border border-white/5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neon-yellow uppercase tracking-[0.2em] ml-1">Entry Bounty (₹)</label>
                                        <input 
                                            type="number" required value={formData.entryFee}
                                            onChange={e => setFormData({...formData, entryFee: e.target.value})}
                                            placeholder="500"
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-neon-yellow/50 transition-all font-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em] ml-1">Total Prize Pool (₹)</label>
                                        <input 
                                            type="number" required value={formData.prizePool}
                                            onChange={e => setFormData({...formData, prizePool: e.target.value})}
                                            placeholder="10000"
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-neon-purple/50 transition-all font-black"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-neon-purple text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl shadow-neon-purple/30 hover:bg-white hover:text-black disabled:bg-slate-800 disabled:text-slate-500 transition-all group overflow-hidden relative"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {isSubmitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> SYNCHRONIZING...</>
                                        ) : (
                                            <>{isEditing ? 'COMMIT MODIFICATIONS' : 'DEPLOY CHAMPIONSHIP'} <Trophy className="w-4 h-4" /></>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Roster / Registrations Modal */}
            <AnimatePresence>
                {rosterModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
                            onClick={() => setRosterModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                        ROSTER <span className="text-neon-purple">INTEL</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{selectedTournament?.name} • Registrations</p>
                                </div>
                                <button onClick={() => setRosterModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {isLoadingRoster ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="w-10 h-10 text-neon-purple animate-spin mx-auto mb-4" />
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Decrypting Team Ledger...</p>
                                </div>
                            ) : registrations.length === 0 ? (
                                <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No squads have joined this campaign yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-5 px-6 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <div className="col-span-2">Team & Captain</div>
                                        <div>Contact</div>
                                        <div>Squad Size</div>
                                        <div className="text-right">Roster Status</div>
                                    </div>
                                    {registrations.map((reg, idx) => (
                                        <div key={reg._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-neon-purple/30 transition-all group">
                                            <div className="grid grid-cols-5 items-center gap-4">
                                                <div className="col-span-2 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-white/10 text-white font-black text-xs">
                                                        #{idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white uppercase italic tracking-tighter group-hover:text-neon-purple transition-colors">{reg.teamName}</h4>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1 font-bold">
                                                            <UserIcon className="w-3 h-3" /> Capt. {reg.captainName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-slate-400">
                                                    <p>{reg.email}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{reg.contactNumber}</p>
                                                </div>
                                                <div>
                                                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white border border-white/10">
                                                        {reg.players?.length || 0} PLAYERS
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-neon-green/10 text-neon-green border border-neon-green/20">
                                                        Confirmed
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Squad Composition:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {reg.players?.map((p, i) => (
                                                        <span key={i} className="px-2 py-1 bg-slate-950 rounded text-[9px] text-slate-400 border border-white/5 uppercase">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
