import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Trophy, User, Mail, Phone,
    ArrowLeft, CheckCircle, Plus, Trash2, IndianRupee
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Toast from '../components/ui/Toast';
import apiClient from '../utils/apiClient';

import tournamentBg from '../assets/images/home/football-night-new.jpg'; // Placeholder

// Moved InputField outside to prevent re-rendering issues
const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = "text", name, focused, setFocused }) => (
    <div className="group relative">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === name ? 'text-neon-yellow' : 'text-slate-500'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(name)}
                onBlur={() => setFocused(null)}
                placeholder={placeholder}
                className="relative z-10 w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-yellow/50 focus:shadow-[0_0_20px_rgba(255,255,0,0.1)] transition-all duration-300 font-medium"
            />
        </div>
    </div>
);

export default function TournamentRegistration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [loading, setLoading] = useState(true);

    const [tournament, setTournament] = useState({
        name: "Syncing...",
        image: '',
        fee: 0,
        minPlayers: 1,
        maxPlayers: 11
    });

    const [formData, setFormData] = useState({
        teamName: '',
        captainName: '',
        email: '',
        phone: '',
        players: ['', '', '', '', ''] 
    });

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const res = await apiClient.get(`/tournaments/${id}`);
                const data = res.data;
                if (data.success) {
                    setTournament({
                        name: data.data.name,
                        image: data.data.image,
                        fee: data.data.entryFee,
                        minPlayers: data.data.minPlayers || 5,
                        maxPlayers: data.data.maxPlayers || 11
                    });
                    // Initialize with minimum players required
                    setFormData(prev => ({
                        ...prev,
                        players: Array((data.data.minPlayers || 5)).fill('')
                    }));
                }
            } catch (err) {
                console.error("Error fetching tournament:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournament();
    }, [id]);

    const [focused, setFocused] = useState(null);

    const handlePlayerChange = (index, value) => {
        const newPlayers = [...formData.players];
        newPlayers[index] = value;
        setFormData({ ...formData, players: newPlayers });
    };

    const addPlayer = () => {
        if (formData.players.length < tournament.maxPlayers) {
            setFormData({ ...formData, players: [...formData.players, ''] });
        } else {
            setToast({ message: `Maximum ${tournament.maxPlayers} players allowed.`, type: 'error' });
        }
    };

    const removePlayer = (index) => {
        if (formData.players.length > tournament.minPlayers) {
            const newPlayers = formData.players.filter((_, i) => i !== index);
            setFormData({ ...formData, players: newPlayers });
        } else {
            setToast({ message: `Minimum ${tournament.minPlayers} players required.`, type: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.teamName || !formData.captainName || !formData.email || !formData.phone) {
            setToast({ message: "Please fill in all team details.", type: 'error' });
            return;
        }

        if (formData.players.some(p => !p.trim())) {
            setToast({ message: "Please provide names for all players.", type: 'error' });
            return;
        }

        try {
            const res = await apiClient.post(`/tournaments/${id}/register`, {
                teamName: formData.teamName,
                captainName: formData.captainName,
                email: formData.email,
                contactNumber: formData.phone,
                players: formData.players
            });

            const result = res.data;
            if (result.success) {
                setToast({ message: "Registration Successful! See you on the field.", type: 'success' });
                setTimeout(() => {
                    navigate('/tournaments');
                }, 1500);
            } else {
                setToast({ message: result.message || "Registration failed", type: 'error' });
            }
        } catch (error) {
            console.error("Registration error:", error);
            setToast({ message: "Failed to connect to server", type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-yellow selection:text-black">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-yellow/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-orange/5 rounded-full blur-[100px]" />
            </div>

            <Header />

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">

                <button
                    onClick={() => navigate('/tournaments')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tournaments
                </button>

                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Event Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-yellow/5 to-transparent opacity-50" />
                            <div className="w-full h-32 rounded-2xl mb-4 overflow-hidden border border-white/5 bg-slate-950 flex items-center justify-center">
                                {tournament.image ? (
                                    <img src={tournament.image} alt="Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <Trophy className="w-8 h-8 text-slate-800" />
                                )}
                            </div>

                            <h2 className="text-xl font-black text-white italic uppercase leading-tight mb-2">{tournament.name}</h2>

                            <div className="space-y-3 text-sm text-slate-300 mt-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span>Entry Fee</span>
                                    <span className="font-bold text-neon-yellow flex items-center"><IndianRupee className="w-3 h-3" /> {tournament.fee}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span>Team Size</span>
                                    <span className="font-bold text-white">{tournament.minPlayers}-{tournament.maxPlayers} Players</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-center">
                            <Trophy className="w-10 h-10 text-neon-yellow mx-auto mb-3" />
                            <h3 className="text-white font-bold mb-1">Big Prize Pool</h3>
                            <p className="text-slate-500 text-xs">Compete for glory and heavy cash rewards.</p>
                        </div>
                    </motion.div>

                    {/* Right Column: Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl">
                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-yellow via-orange-500 to-red-500" />

                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Register Team</h1>
                                <p className="text-slate-400 mt-2">Fill in the details to lock your spot.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Team Details Section */}
                                <div className="space-y-4">
                                    <h3 className="text-neon-yellow font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-neon-yellow"></span>
                                        Team Details
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InputField
                                            icon={Trophy}
                                            label="Team Name"
                                            name="teamName"
                                            placeholder="e.g. Thunder Strikers"
                                            value={formData.teamName}
                                            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                            focused={focused}
                                            setFocused={setFocused}
                                        />
                                        <InputField
                                            icon={User}
                                            label="Captain Name"
                                            name="captainName"
                                            placeholder="Leader's Name"
                                            value={formData.captainName}
                                            onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                                            focused={focused}
                                            setFocused={setFocused}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InputField
                                            icon={Mail}
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            placeholder="contact@team.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            focused={focused}
                                            setFocused={setFocused}
                                        />
                                        <InputField
                                            icon={Phone}
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            focused={focused}
                                            setFocused={setFocused}
                                        />
                                    </div>
                                </div>

                                {/* Player Roster Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-neon-blue font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-neon-blue"></span>
                                            Squad Roster
                                        </h3>
                                        <span className="text-xs text-slate-500">{formData.players.length}/{tournament.maxPlayers} Players</span>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.players.map((player, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 text-xs font-bold font-mono border border-white/5">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow relative group">
                                                    <input
                                                        type="text"
                                                        value={player}
                                                        onChange={(e) => handlePlayerChange(index, e.target.value)}
                                                        placeholder={`Player ${index + 1} Name`}
                                                        className="relative z-10 w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
                                                    />
                                                </div>
                                                {index >= tournament.minPlayers && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePlayer(index)}
                                                        className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors border border-white/5"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {formData.players.length < tournament.maxPlayers && (
                                        <button
                                            type="button"
                                            onClick={addPlayer}
                                            className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add Player
                                        </button>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-slate-400 text-sm">Total Registration Fee</span>
                                        <span className="text-2xl font-black text-white flex items-center"><IndianRupee className="w-5 h-5" /> {tournament.fee}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-neon-yellow to-orange-500 rounded-xl font-black text-black uppercase tracking-wider text-lg shadow-lg hover:shadow-neon-yellow/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        Confirm Registration <CheckCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>

            </main>

            <Footer />
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
