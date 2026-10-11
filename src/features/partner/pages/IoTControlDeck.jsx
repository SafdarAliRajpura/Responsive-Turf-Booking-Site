import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, Sun, Droplets, ShieldAlert, RotateCcw, 
    Radio, Activity, Lock, Unlock, RefreshCw, Cpu, Layers,
    ShieldCheck
} from 'lucide-react';
import apiClient from '../../../utils/apiClient';
import Toast from '../../../components/ui/Toast';

export default function IoTControlDeck() {
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [toast, setToast] = useState({ message: null, type: 'info' });

    // Fetch partner's venues
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const ownerId = user?.id || user?._id;
                const res = await apiClient.get(`/venues?owner=${ownerId}`);
                const venueList = res.data.data || res.data || [];
                setVenues(venueList);
                if (venueList.length > 0) {
                    setSelectedVenue(venueList[0]);
                }
            } catch (err) {
                console.error("Failed to load venues:", err);
            }
        };
        fetchVenues();
    }, []);

    // Fetch device status when selectedVenue changes
    useEffect(() => {
        if (!selectedVenue) return;
        fetchDeviceStatus(selectedVenue._id);
    }, [selectedVenue]);

    const fetchDeviceStatus = async (venueId) => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/iot/venue/${venueId}`);
            if (res.data.success) {
                setDevice(res.data.data);
                setCanUndo(res.data.data.commandAuditLog?.length > 0);
            }
        } catch (err) {
            console.error("IoT fetch error:", err);
            setToast({ message: "Failed to connect to stadium hardware controller", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Execute Hardware Command (Command Pattern)
    const handleExecuteCommand = async (commandType, params = {}) => {
        if (!selectedVenue) return;
        setExecuting(true);
        try {
            const res = await apiClient.post(`/iot/venue/${selectedVenue._id}/command`, {
                commandType,
                params
            });
            if (res.data.success) {
                setDevice(res.data.device);
                setCanUndo(res.data.canUndo);
                setToast({ 
                    message: `[COMMAND PATTERN] Executed ${commandType} successfully!`, 
                    type: 'success' 
                });
            }
        } catch (err) {
            console.error("Command failed:", err);
            setToast({ message: "Hardware command dispatch failed", type: 'error' });
        } finally {
            setExecuting(false);
        }
    };

    // Undo Last Command (Reversible Command Pattern action)
    const handleUndo = async () => {
        if (!selectedVenue) return;
        setExecuting(true);
        try {
            const res = await apiClient.post(`/iot/venue/${selectedVenue._id}/undo`);
            if (res.data.success) {
                setDevice(res.data.device);
                setCanUndo(res.data.canUndo);
                setToast({ 
                    message: `[COMMAND UNDO] State snapshot reverted successfully!`, 
                    type: 'info' 
                });
            } else {
                setToast({ message: res.data.message || "Undo failed", type: 'error' });
            }
        } catch (err) {
            setToast({ message: "No reversible commands in stack", type: 'error' });
        } finally {
            setExecuting(false);
        }
    };

    // Auto-Sync with Real Match Bookings
    const handleAutoSync = async () => {
        if (!selectedVenue) return;
        setExecuting(true);
        try {
            const res = await apiClient.post(`/iot/venue/${selectedVenue._id}/auto-sync`);
            if (res.data.success) {
                setDevice(res.data.data);
                const syncMsg = res.data.syncResult.matchActive 
                    ? `Active Match Detected! Stadium Floodlights Engaged (${res.data.syncResult.booking})`
                    : "Schedule Synchronized. No matches scheduled right now.";
                setToast({ message: syncMsg, type: res.data.syncResult.matchActive ? 'success' : 'info' });
            }
        } catch (err) {
            setToast({ message: "Autonomous schedule sync failed", type: 'error' });
        } finally {
            setExecuting(false);
        }
    };

    // Toggle Auto-Sync Mode
    const handleToggleAutoSync = async () => {
        if (!selectedVenue) return;
        try {
            const res = await apiClient.put(`/iot/venue/${selectedVenue._id}/toggle-auto-sync`);
            if (res.data.success) {
                setDevice(prev => ({ ...prev, autoSyncWithBookings: res.data.autoSyncWithBookings }));
                setToast({ 
                    message: res.data.autoSyncWithBookings ? "Autonomous Match Automation Enabled" : "Manual Override Mode Active", 
                    type: 'info' 
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && !device) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] space-y-4">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-neon-purple rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-neon-purple">Connecting to Stadium IoT Grid...</p>
            </div>
        );
    }

    const floodlightsOn = device?.floodlights?.status;
    const currentLux = device?.floodlights?.lux || 750;
    const sprinklersOn = device?.sprinklers?.status;
    const turnstileLocked = device?.turnstile?.isLocked;

    // Calculate dynamic lighting glow scale based on lux
    const lightGlowOpacity = floodlightsOn ? Math.min(Math.max(currentLux / 1200, 0.4), 1) : 0.05;

    return (
        <div className="space-y-10 pb-16">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-black uppercase tracking-widest mb-3">
                        <Radio className="w-3 h-3 animate-pulse" /> Telemetry & Hardware Control
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                        Smart Stadium <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-fuchsia-500 to-neon-green">IoT Deck</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Physical Hardware Virtualization • Command & Singleton Architecture
                    </p>
                </div>

                {/* Venue Selector & Quick Status */}
                <div className="flex flex-wrap items-center gap-4">
                    {venues.length > 0 && (
                        <div className="relative">
                            <select 
                                value={selectedVenue?._id || ''} 
                                onChange={(e) => {
                                    const v = venues.find(item => item._id === e.target.value);
                                    if (v) setSelectedVenue(v);
                                }}
                                className="bg-slate-900 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl px-4 py-3 appearance-none pr-10 focus:border-neon-purple outline-none"
                            >
                                {venues.map(v => (
                                    <option key={v._id} value={v._id}>{v.name}</option>
                                ))}
                            </select>
                            <Cpu className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    )}

                    <button
                        onClick={handleAutoSync}
                        disabled={executing}
                        className="px-4 py-3 bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} /> Sync Match Slots
                    </button>
                </div>
            </div>

            {/* Live Telemetry Sensor Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center text-neon-yellow">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Power Consumption</p>
                        <h4 className="text-lg font-black text-white">{device?.telemetry?.powerDrawKw || 14.8} <span className="text-xs text-slate-400 font-bold">kW/h</span></h4>
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Turf Soil Moisture</p>
                        <h4 className="text-lg font-black text-white">{device?.sprinklers?.soilMoisturePct || 42}%</h4>
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Grid Status</p>
                        <h4 className="text-lg font-black text-neon-green">{device?.telemetry?.solarBackupActive ? 'SOLAR ACTIVE' : 'GRID AC'}</h4>
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Hardware Latency</p>
                        <h4 className="text-lg font-black text-white">{device?.telemetry?.signalLatencyMs || 12} <span className="text-xs text-slate-400 font-bold">ms</span></h4>
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${turnstileLocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-neon-green/10 text-neon-green border border-neon-green/20'}`}>
                        {turnstileLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Gate Turnstiles</p>
                        <h4 className={`text-lg font-black ${turnstileLocked ? 'text-amber-400' : 'text-neon-green'}`}>
                            {turnstileLocked ? 'SECURE / LOCKED' : 'OPEN INGRESS'}
                        </h4>
                    </div>
                </div>
            </div>

            {/* MAIN INTERACTIVE CONSOLE: 2D Pitch View + Hardware Racks */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* 2D TACTICAL TOP-DOWN PITCH STADIUM VISUALIZER (7 Cols) */}
                <div className="lg:col-span-7 bg-slate-900/70 border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">
                                2D Arena Top-Down Visualizer
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${floodlightsOn ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40' : 'bg-slate-800 text-slate-500'}`}>
                                {floodlightsOn ? `FLOODLIGHTS ACTIVE (${currentLux} LUX)` : 'PITCH DARK / OFF'}
                            </span>
                        </div>
                    </div>

                    {/* Interactive Stadium Pitch Board */}
                    <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-emerald-950/80 to-emerald-900/90 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center select-none transition-all duration-700">
                        
                        {/* Dynamic Floodlight Radiance Overlay */}
                        <div 
                            className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
                            style={{
                                opacity: lightGlowOpacity,
                                background: 'radial-gradient(ellipse at 50% 50%, rgba(254, 240, 138, 0.45) 0%, rgba(56, 189, 248, 0.2) 60%, rgba(0, 0, 0, 0.2) 100%)'
                            }}
                        />

                        {/* Four Corner Floodlight Tower Beams */}
                        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, idx) => (
                            <div key={idx} className={`absolute ${pos} z-20 flex flex-col items-center pointer-events-none`}>
                                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${floodlightsOn ? 'bg-white border-neon-yellow shadow-[0_0_25px_#fef08a]' : 'bg-slate-800 border-slate-700'}`} />
                                {floodlightsOn && (
                                    <div 
                                        className="w-16 h-16 rounded-full blur-md opacity-70 pointer-events-none bg-yellow-200"
                                        style={{ transform: `scale(${currentLux / 500})` }}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Pitch Lines (FIFA Pro Marking Schema) */}
                        <div className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none">
                            {/* Center Line */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2" />
                            {/* Center Circle */}
                            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                            </div>
                            {/* Left Goal Area */}
                            <div className="absolute top-1/4 bottom-1/4 left-0 w-16 border-r-2 border-y-2 border-white/20" />
                            {/* Right Goal Area */}
                            <div className="absolute top-1/4 bottom-1/4 right-0 w-16 border-l-2 border-y-2 border-white/20" />
                        </div>

                        {/* Animated Sprinklers Effect */}
                        {sprinklersOn && (
                            <div className="absolute inset-0 pointer-events-none z-10">
                                {[
                                    'top-1/3 left-1/3', 'top-1/3 right-1/3',
                                    'bottom-1/3 left-1/3', 'bottom-1/3 right-1/3',
                                    'top-1/2 left-1/2'
                                ].map((sPos, i) => (
                                    <div key={i} className={`absolute ${sPos} -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}>
                                        <div className="w-3 h-3 rounded-full bg-sky-400 animate-ping" />
                                        <div className="absolute w-28 h-28 border border-sky-400/40 rounded-full animate-pulse" />
                                        <div className="absolute w-40 h-40 border border-dashed border-sky-300/20 rounded-full animate-spin" />
                                    </div>
                                ))}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-sky-950/90 border border-sky-500/40 text-sky-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                                    💦 Irrigation Burst Active (Pressure 48 PSI)
                                </div>
                            </div>
                        )}

                        {/* Side Turnstile Barrier Ingress Station */}
                        <div className="absolute bottom-2 left-10 z-20 flex items-center gap-2 bg-slate-950/90 border border-white/10 px-3 py-1.5 rounded-xl shadow-lg">
                            <div className={`w-2 h-2 rounded-full ${turnstileLocked ? 'bg-red-500' : 'bg-neon-green animate-pulse'}`} />
                            <span className="text-[9px] font-black tracking-widest uppercase text-slate-300">
                                Turnstile A: {turnstileLocked ? 'LOCKED' : 'ACCESS OPEN'}
                            </span>
                        </div>

                        {/* Center Turf Watermark */}
                        <div className="z-0 opacity-20 text-center pointer-events-none">
                            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                                {selectedVenue?.name || 'ARENA PITCH'}
                            </h2>
                            <p className="text-[8px] font-mono tracking-widest uppercase text-white mt-1">
                                FIFA STANDARD QUALITY • SMART IoT READY
                            </p>
                        </div>
                    </div>

                    {/* Quick Simulation Action Row */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Auto-Pilot:</span>
                            <button
                                onClick={handleToggleAutoSync}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${device?.autoSyncWithBookings ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40' : 'bg-white/5 text-slate-500'}`}
                            >
                                {device?.autoSyncWithBookings ? 'AUTO-SYNC ON' : 'MANUAL OVERRIDE'}
                            </button>
                        </div>

                        {/* Reversible Command Action Button (Command Pattern Live Showcase!) */}
                        <button
                            onClick={handleUndo}
                            disabled={!canUndo || executing}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${canUndo ? 'bg-white/10 hover:bg-white text-white hover:text-black shadow-lg cursor-pointer' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> 
                            <span>Undo Last Command</span>
                            <span className="text-[8px] bg-slate-800 text-neon-purple px-1.5 py-0.5 rounded font-mono">GOF PATTERN</span>
                        </button>
                    </div>
                </div>

                {/* HARDWARE CONTROLS RACK (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Master Floodlights Rack */}
                    <div className="bg-slate-900/70 border border-white/10 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${floodlightsOn ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30' : 'bg-white/5 text-slate-500'}`}>
                                    <Sun className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase italic tracking-tight text-white">Floodlight Grid</h4>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Zone 1 & 2 Master Array</p>
                                </div>
                            </div>

                            {/* Power Toggle Switch */}
                            <button
                                onClick={() => handleExecuteCommand('TOGGLE_FLOODLIGHTS')}
                                disabled={executing}
                                className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${floodlightsOn ? 'bg-neon-green justify-end' : 'bg-slate-800 justify-start'}`}
                            >
                                <motion.div 
                                    layout 
                                    className="w-6 h-6 rounded-full bg-slate-950 shadow-md"
                                />
                            </button>
                        </div>

                        {/* Lux Slider */}
                        <div className="space-y-3 pt-3 border-t border-white/5">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400 uppercase text-[10px] tracking-widest">Illuminance Power</span>
                                <span className="text-neon-yellow font-black">{currentLux} LUX</span>
                            </div>
                            <input 
                                type="range" 
                                min="200" 
                                max="1200" 
                                step="50"
                                value={currentLux}
                                onChange={(e) => handleExecuteCommand('SET_LUX', { lux: Number(e.target.value) })}
                                disabled={!floodlightsOn || executing}
                                className="w-full accent-neon-yellow cursor-pointer"
                            />
                            <div className="grid grid-cols-3 gap-2 pt-1">
                                {[
                                    { label: 'ECO (400)', val: 400 },
                                    { label: 'MATCH (800)', val: 800 },
                                    { label: 'BROADCAST (1100)', val: 1100 }
                                ].map(p => (
                                    <button 
                                        key={p.val}
                                        onClick={() => handleExecuteCommand('SET_LUX', { lux: p.val })}
                                        disabled={!floodlightsOn || executing}
                                        className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${currentLux === p.val ? 'bg-neon-yellow text-black border-neon-yellow' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sprinklers & Gate Rack (2-Col Grid) */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        
                        {/* Irrigation Controller */}
                        <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                                    <Droplets className="w-5 h-5" />
                                </div>
                                <span className={`w-2 h-2 rounded-full ${sprinklersOn ? 'bg-sky-400 animate-ping' : 'bg-slate-800'}`} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase text-white mb-1">Pitch Sprinklers</h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">Moisture: {device?.sprinklers?.soilMoisturePct}%</p>
                                <button
                                    onClick={() => handleExecuteCommand('TOGGLE_SPRINKLERS')}
                                    disabled={executing}
                                    className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sprinklersOn ? 'bg-sky-500 text-black shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'}`}
                                >
                                    {sprinklersOn ? 'STOP CYCLE' : 'START 3M BURST'}
                                </button>
                            </div>
                        </div>

                        {/* Turnstile Access Control */}
                        <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${turnstileLocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-neon-green/10 text-neon-green border border-neon-green/20'}`}>
                                    {turnstileLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                </div>
                                <span className={`w-2 h-2 rounded-full ${turnstileLocked ? 'bg-amber-400' : 'bg-neon-green'}`} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase text-white mb-1">Digital Turnstile</h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">Passes: {device?.turnstile?.totalPassesToday || 0}</p>
                                <button
                                    onClick={() => handleExecuteCommand('TOGGLE_TURNSTILE')}
                                    disabled={executing}
                                    className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${turnstileLocked ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5' : 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]'}`}
                                >
                                    {turnstileLocked ? 'UNLOCK GATE' : 'ENGAGE LOCK'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Tactical Shutdown Button */}
                    <button
                        onClick={() => {
                            if (window.confirm("CRITICAL OVERRIDE: Shut down all stadium lighting and release access gates?")) {
                                handleExecuteCommand('EMERGENCY_SHUTDOWN');
                            }
                        }}
                        disabled={executing}
                        className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-500 hover:text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group shadow-xl"
                    >
                        <ShieldAlert className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Tactical Emergency Override
                    </button>
                </div>
            </div>

            {/* DESIGN PATTERN ARCHITECTURE & COMMAND AUDIT LOG */}
            <div className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[9px] font-black uppercase tracking-widest mb-2">
                            <Layers className="w-3 h-3" /> GoF Pattern Telemetry
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
                            Command History & Audit Trail (Reversible Ledger)
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Total Audit Snapshots: {device?.commandAuditLog?.length || 0}
                    </span>
                </div>

                <div className="space-y-3">
                    {(!device?.commandAuditLog || device.commandAuditLog.length === 0) ? (
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest py-8 text-center">
                            No commands dispatched yet in this hardware session.
                        </p>
                    ) : (
                        device.commandAuditLog.slice(0, 5).map((log, idx) => (
                            <div 
                                key={idx} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/60 border border-white/5 rounded-2xl text-xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs ${log.status === 'REVERTED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'}`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-black text-white uppercase tracking-wider">{log.commandName}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Executed by: <span className="text-slate-300 font-bold">{log.executedBy}</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${log.status === 'REVERTED' ? 'bg-amber-500/10 text-amber-400' : 'bg-neon-green/10 text-neon-green'}`}>
                                        {log.status}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: null })} />
        </div>
    );
}
