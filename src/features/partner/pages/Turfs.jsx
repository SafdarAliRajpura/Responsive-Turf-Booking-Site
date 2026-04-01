import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, IndianRupee, MoreVertical, Edit, Power, X, Trash2 } from 'lucide-react';
import Toast from '../../../components/ui/Toast';

// Placeholder images
import turf1 from '../../../assets/images/home/football-night-new.jpg';
import turf2 from '../../../assets/images/home/badminton.jpg';
import turf3 from '../../../assets/images/home/cricket.jpg';

const TurfCard = ({ turf, index, onToggleStatus, onEditInfo }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-neon-purple/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
    >
        <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
            <img src={turf.image} alt={turf.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />

            <div className="absolute top-4 right-4 z-20">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border ${turf.status === 'Active'
                    ? 'bg-neon-green/20 text-neon-green border-neon-green/30'
                    : turf.status === 'Banned'
                    ? 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                    : 'bg-red-500/20 text-red-500 border-red-500/30'
                    }`}>
                    {turf.status}
                </div>
            </div>
        </div>

        <div className="p-6">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors">{turf.name}</h3>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <MapPin className="w-4 h-4 text-neon-purple" />
                {turf.location}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-white font-bold text-xs flex items-center text-slate-400">
                    {turf.courts && turf.courts.length > 0 ? `${turf.courts.length} Custom Courts` : "Standard Layout"}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onEditInfo(turf)}
                        className="p-2 hover:bg-neon-blue/10 rounded-lg text-slate-400 hover:text-neon-blue transition-colors" title="Edit Properties"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onToggleStatus(turf)}
                        className={`p-2 rounded-lg transition-colors shadow-sm ${turf.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 shadow-emerald-500/20' : turf.status === 'Banned' ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 shadow-red-500/20'}`} 
                        title="Toggle Status"
                    >
                        <Power className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function Turfs() {
    const navigate = useNavigate();
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [editingTurf, setEditingTurf] = useState(null);
    const [submittingEdit, setSubmittingEdit] = useState(false);

    const fetchTurfs = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const ownerId = user?.id || user?._id;
            
            const res = await fetch(`http://localhost:5000/api/venues?owner=${ownerId}`);
            const data = await res.json();
            if (data.success) {
                // In a real app, you would filter by partner's owner ID here. 
                // Since this is a local setup without auth-persistence on backend, we grab all.
                const mapped = data.data.map(v => ({
                    id: v._id,
                    name: v.name,
                    location: v.location,
                    price: v.price.toString(),
                    status: v.status || "Active",
                    slots: v.slots || [],
                    courts: v.courts || [],
                    image: (v.images && v.images.length > 0) ? v.images[0] : (v.image || turf1)
                }));
                // Latest goes first visually
                setTurfs(mapped.reverse());
            }
        } catch (err) {
            console.error("Error fetching partner turfs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTurfs();
    }, []);

    const availableTimeSlots = [
        "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
        "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
    ];

    const handleToggleStatus = async (turf) => {
        if (turf.status === 'Banned') {
            setToast({ message: "Super Admin has banned this turf. Cannot change status.", type: 'error' });
            return;
        }
        const newStatus = turf.status === 'Active' ? 'Closed' : 'Active';
        try {
            const res = await fetch(`http://localhost:5000/api/venues/${turf.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setTurfs(prev => prev.map(t => t.id === turf.id ? { ...t, status: newStatus } : t));
                setToast({ message: `Turf is now ${newStatus}`, type: 'success' });
            }
        } catch(e) {
            setToast({ message: "Failed to update status", type: 'error' });
        }
    };

    const handleSaveEdit = async () => {
        if (!editingTurf.name || !editingTurf.location) {
            setToast({ message: "Name and location are required", type: 'error' });
            return;
        }
        if (editingTurf.courts && editingTurf.courts.some(c => !c.name || !c.price)) {
            setToast({ message: "All courts must have a name and a valid price", type: 'error' });
            return;
        }
        setSubmittingEdit(true);
        try {
            const res = await fetch(`http://localhost:5000/api/venues/${editingTurf.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    name: editingTurf.name, 
                    price: editingTurf.courts && editingTurf.courts.length > 0 ? Number(editingTurf.courts[0].price) : editingTurf.price,
                    location: editingTurf.location,
                    slots: [...editingTurf.slots].sort((a, b) => availableTimeSlots.indexOf(a) - availableTimeSlots.indexOf(b)),
                    courts: editingTurf.courts ? editingTurf.courts.map(({ _id, tempId, ...rest }) => rest) : [],
                    sports: editingTurf.courts ? Array.from(new Set(editingTurf.courts.map(c => c.category.split(' ')[0]))) : []
                })
            });
            const data = await res.json();
            if (data.success) {
                setTurfs(prev => prev.map(t => t.id === editingTurf.id ? { 
                    ...t, 
                    name: editingTurf.name, 
                    price: editingTurf.courts && editingTurf.courts.length > 0 ? Number(editingTurf.courts[0].price).toString() : editingTurf.price, 
                    location: editingTurf.location, 
                    slots: editingTurf.slots,
                    courts: editingTurf.courts
                } : t));
                setToast({ message: "Turf details updated", type: "success" });
                setEditingTurf(null);
            }
        } catch(e) {
            setToast({ message: "Update failed", type: "error" });
        } finally {
            setSubmittingEdit(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            <AnimatePresence>
                {editingTurf && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setEditingTurf(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl p-8 shadow-2xl z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-white">Quick Edit Turf</h2>
                                <button onClick={() => setEditingTurf(null)} className="text-slate-500 hover:text-red-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Turf Name</label>
                                    <input 
                                        type="text" 
                                        value={editingTurf.name} 
                                        onChange={(e) => setEditingTurf({...editingTurf, name: e.target.value})}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                    <input 
                                        type="text" 
                                        value={editingTurf.location} 
                                        onChange={(e) => setEditingTurf({...editingTurf, location: e.target.value})}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple mt-1"
                                    />
                                </div>
                                
                                <div className="pt-2 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Courts Mapping</label>
                                        <button 
                                            type="button" 
                                            onClick={() => setEditingTurf({...editingTurf, courts: [...(editingTurf.courts || []), { tempId: Date.now(), name: `Court ${String.fromCharCode(65 + (editingTurf.courts?.length || 0))}`, category: 'Football (5v5)', price: '' }]})}
                                            className="text-xs font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> Add Court
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                                        {(editingTurf.courts || []).map((court, idx) => (
                                            <div key={court._id || court.tempId || idx} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-white/5 items-center">
                                                <div className="col-span-4">
                                                    <input 
                                                        type="text" 
                                                        value={court.name} 
                                                        onChange={(e) => {
                                                            const newCourts = [...editingTurf.courts];
                                                            newCourts[idx].name = e.target.value;
                                                            setEditingTurf({...editingTurf, courts: newCourts});
                                                        }}
                                                        className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple text-xs"
                                                        placeholder="Court Name"
                                                    />
                                                </div>
                                                <div className="col-span-4 max-w-full overflow-hidden">
                                                    <select
                                                        value={court.category}
                                                        onChange={(e) => {
                                                            const newCourts = [...editingTurf.courts];
                                                            newCourts[idx].category = e.target.value;
                                                            setEditingTurf({...editingTurf, courts: newCourts});
                                                        }}
                                                        className="w-full bg-slate-900 border border-white/5 rounded-lg px-2 py-2 text-white outline-none text-xs"
                                                    >
                                                        <option>Football (5v5)</option>
                                                        <option>Football (7v7)</option>
                                                        <option>Football (9v9)</option>
                                                        <option>Football (11v11)</option>
                                                        <option>Cricket (Box)</option>
                                                        <option>Cricket (Full Pitch)</option>
                                                        <option>Badminton</option>
                                                        <option>Tennis</option>
                                                        <option>Basketball (Full Court)</option>
                                                        <option>Basketball (Half Court)</option>
                                                        <option>Volleyball</option>
                                                        <option>Pickleball</option>
                                                        <option>Squash</option>
                                                        <option>Table Tennis</option>
                                                        <option>Swimming Pool</option>
                                                        <option>Gym / Fitness Studio</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-3">
                                                    <input 
                                                        type="number" 
                                                        value={court.price} 
                                                        onChange={(e) => {
                                                            const newCourts = [...editingTurf.courts];
                                                            newCourts[idx].price = e.target.value;
                                                            setEditingTurf({...editingTurf, courts: newCourts});
                                                        }}
                                                        className="w-full bg-slate-900 border border-white/5 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-neon-purple text-xs"
                                                        placeholder="Price"
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-center">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            const newCourts = editingTurf.courts.filter((_, currentIdx) => currentIdx !== idx);
                                                            setEditingTurf({...editingTurf, courts: newCourts});
                                                        }}
                                                        className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                        Operating Slots
                                        <button 
                                            type="button" 
                                            onClick={() => setEditingTurf({...editingTurf, slots: editingTurf.slots.length === availableTimeSlots.length ? [] : [...availableTimeSlots]})}
                                            className="text-neon-purple hover:text-white transition-colors"
                                        >
                                            {editingTurf.slots.length === availableTimeSlots.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto scrollbar-hide pr-2">
                                        {availableTimeSlots.map((slot) => {
                                            const isSelected = editingTurf.slots.includes(slot);
                                            return (
                                                <button
                                                    type="button"
                                                    key={slot}
                                                    onClick={() => {
                                                        const newSlots = isSelected 
                                                            ? editingTurf.slots.filter(s => s !== slot)
                                                            : [...editingTurf.slots, slot];
                                                        setEditingTurf({...editingTurf, slots: newSlots});
                                                    }}
                                                    className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition-all duration-300 ${isSelected 
                                                        ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                                                        : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSaveEdit}
                                disabled={submittingEdit}
                                className="w-full mt-8 bg-neon-purple hover:bg-fuchsia-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {submittingEdit ? 'Saving...' : 'Save Changes'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">MY TURFS</h1>
                    <p className="text-slate-400">Manage your sports venues and pricing.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/partner/turfs/add')}
                    className="flex items-center gap-2 bg-neon-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-fuchsia-600 transition-colors shadow-lg shadow-neon-purple/20"
                >
                    <Plus className="w-5 h-5" /> Add New Turf
                </motion.button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-neon-purple font-bold tracking-widest uppercase text-sm">
                        <div className="w-8 h-8 mx-auto border-4 border-slate-800 border-t-neon-purple rounded-full animate-spin mb-4" />
                        Fetching Your Properties...
                    </div>
                ) : turfs.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-slate-900/50 border border-white/5 rounded-3xl">
                        <p className="font-bold text-lg mb-2">No Turfs Managed</p>
                        <p className="text-sm">Click 'Add New Turf' to start listing your venues.</p>
                    </div>
                ) : (
                    turfs.map((turf, index) => (
                        <TurfCard 
                            key={turf.id} 
                            turf={turf} 
                            index={index} 
                            onToggleStatus={handleToggleStatus} 
                            onEditInfo={setEditingTurf} 
                        />
                    ))
                )}
            </div>

            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, message: null })} 
            />
        </div>
    );
}
