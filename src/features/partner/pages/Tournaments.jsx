import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, MapPin, Calendar, Users, IndianRupee, Clock, X, Trash2, Edit, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import Toast from '../../../components/ui/Toast';

const TournamentCard = ({ tournament, onEdit, onDelete, index }) => (
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
            <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter group-hover:text-neon-purple transition-colors">
                {tournament.name}
            </h3>
            
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-neon-purple" />
                    <span className="truncate">{tournament.location}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4 text-neon-blue" />
                        {tournament.date}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Users className="w-4 h-4 text-neon-green" />
                        {tournament.totalSlots} Teams
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Entry: <span className="text-white">₹{tournament.entryFee}</span>
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [formData, setFormData] = useState({
        name: '', description: '', category: 'Football', location: '',
        date: '', time: '', entryFee: '', prizePool: '', totalSlots: '',
        minPlayers: 5, maxPlayers: 11,
        status: 'Upcoming', image: ''
    });

    const fetchMyTournaments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch(`http://localhost:5000/api/tournaments?owner=${user.id || user._id}`);
            const data = await res.json();
            if (data.success) {
                setTournaments(data.data);
            }
        } catch (err) {
            console.error("Fetch Tournaments Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTournaments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/tournaments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setToast({ message: "Championship Live!", type: "success" });
                setIsModalOpen(false);
                fetchMyTournaments();
                setFormData({
                    name: '', description: '', category: 'Football', location: '',
                    date: '', time: '', entryFee: '', prizePool: '', totalSlots: '',
                    minPlayers: 5, maxPlayers: 11,
                    status: 'Upcoming', image: ''
                });
            }
        } catch (err) {
            setToast({ message: "Deployment Failed", type: "error" });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Abort this championship?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">CHAMPIONSHIPS</h1>
                    <p className="text-slate-400 font-medium">Engineer and manage elite sports tournaments.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-neon-purple text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-neon-purple/20"
                >
                    <Plus className="w-5 h-5" /> Design Tournament
                </motion.button>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center text-neon-purple font-black tracking-[0.2em]">INITIALIZING SYTEMS...</div>
            ) : tournaments.length === 0 ? (
                <div className="py-24 text-center bg-slate-900/50 border border-white/5 rounded-[2.5rem]">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Campaigns</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Click 'Design Tournament' to launch your first championship onto the Arena Pro network.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.map((t, i) => (
                        <TournamentCard key={t._id} tournament={t} index={i} onDelete={handleDelete} onEdit={() => {}} />
                    ))}
                </div>
            )}

            {/* Premium Create Modal */}
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
                            className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 md:p-12 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-bl-[100%] pointer-events-none" />
                            
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Campaign <span className="text-neon-purple">Blueprint</span></h2>
                                    <p className="text-slate-400 text-sm">Define the parameters for your next elite tournament.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Championship Name</label>
                                        <input 
                                            type="text" required value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            placeholder="SUPER LEAGUE 2026"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:border-neon-purple/50 transition-all font-bold italic uppercase tracking-tighter"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Sport Discipline</label>
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

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Campaign Brief</label>
                                    <textarea 
                                        required value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        placeholder="Experience the peak of local competition..."
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:border-neon-purple/50 transition-all h-32 resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Host Stadium / Venue</label>
                                        <input 
                                            type="text" required value={formData.location}
                                            onChange={e => setFormData({...formData, location: e.target.value})}
                                            placeholder="Arena Pro Central"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:border-neon-purple/50 transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Tournament Banner / Poster</label>
                                        <div className="relative group/upload h-[120px]">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className={`w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                                                formData.image ? 'border-neon-purple/50 bg-neon-purple/5' : 'border-white/10 hover:border-white/20 bg-slate-950'
                                            }`}>
                                                {formData.image ? (
                                                    <div className="flex items-center gap-4 px-4 w-full h-full">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-white text-xs font-bold truncate italic">IMAGE_CAPTURED.JPG</p>
                                                            <p className="text-neon-purple text-[10px] font-black uppercase tracking-widest mt-1">Change Media</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 mb-2 group-hover/upload:text-neon-purple transition-colors">
                                                            <Upload className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Drop Visual Asset</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Launch Date</label>
                                        <input 
                                            type="date" required value={formData.date}
                                            onChange={e => setFormData({...formData, date: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-neon-purple/50 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Kickoff</label>
                                        <input 
                                            type="time" required value={formData.time}
                                            onChange={e => setFormData({...formData, time: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-neon-purple/50 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Max Slots</label>
                                        <input 
                                            type="number" required value={formData.totalSlots}
                                            onChange={e => setFormData({...formData, totalSlots: e.target.value})}
                                            placeholder="16"
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-neon-green font-black outline-none focus:border-neon-green/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Min Squad Size</label>
                                        <input 
                                            type="number" required value={formData.minPlayers}
                                            onChange={e => setFormData({...formData, minPlayers: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:border-neon-purple/50"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Max Roster Pool</label>
                                        <input 
                                            type="number" required value={formData.maxPlayers}
                                            onChange={e => setFormData({...formData, maxPlayers: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:border-neon-purple/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                    <div>
                                        <label className="text-[10px] font-black text-neon-yellow uppercase tracking-[0.2em] mb-2 block">Entry Bounty (₹)</label>
                                        <input 
                                            type="number" required value={formData.entryFee}
                                            onChange={e => setFormData({...formData, entryFee: e.target.value})}
                                            placeholder="500"
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-neon-yellow/50 transition-all font-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em] mb-2 block">Total Prize Pool (₹)</label>
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
                                    className="w-full py-6 bg-neon-purple text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl shadow-neon-purple/30 hover:bg-white hover:text-black transition-all group overflow-hidden relative"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        DEPLOY CHAMPIONSHIP <Trophy className="w-4 h-4" />
                                    </span>
                                </button>
                            </form>
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
