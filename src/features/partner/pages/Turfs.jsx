import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, IndianRupee, MoreVertical, Edit, Power } from 'lucide-react';

// Placeholder images
import turf1 from '../../../assets/images/home/football-night-new.jpg';
import turf2 from '../../../assets/images/home/badminton.jpg';
import turf3 from '../../../assets/images/home/cricket.jpg';

const TurfCard = ({ turf, index }) => (
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
                    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
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
                <div className="text-white font-bold text-lg flex items-center">
                    <IndianRupee className="w-4 h-4 text-slate-500 mr-1" />
                    {turf.price}/hr
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-neon-blue/10 rounded-lg text-slate-400 hover:text-neon-blue transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-neon-green/10 rounded-lg text-slate-400 hover:text-neon-green transition-colors" title="Toggle Status">
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

    const fetchTurfs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/venues');
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

    return (
        <div className="space-y-8">
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
                        <TurfCard key={turf.id} turf={turf} index={index} />
                    ))
                )}
            </div>
        </div>
    );
}
