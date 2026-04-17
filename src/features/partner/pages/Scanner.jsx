import React, { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Maximize, Camera, ShieldCheck, 
    AlertTriangle, CheckCircle2, User,
    MapPin, Zap, RefreshCcw
} from 'lucide-react';
import axios from 'axios';

const ScannerModal = ({ data, error, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-[400px] bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className={`p-10 text-center ${error ? 'bg-red-500/10' : 'bg-neon-green/10'}`}>
                {error ? (
                    <AlertTriangle size={60} className="text-red-500 mx-auto mb-6 animate-pulse" />
                ) : (
                    <CheckCircle2 size={60} className="text-neon-green mx-auto mb-6 animate-bounce" />
                )}
                <h3 className={`text-2xl font-black uppercase italic tracking-tighter mb-2 ${error ? 'text-red-500' : 'text-white'}`}>
                    {error ? 'Verification Failed' : 'Checked In Successfully'}
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    {error || 'The player is authorized for field entry.'}
                </p>
            </div>

            {data && (
                <div className="p-8 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center text-neon-green">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Player Details</p>
                            <p className="text-sm font-bold text-white uppercase italic">
                                {data.userId?.first_name} {data.userId?.last_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Booking Summary</p>
                            <p className="text-sm font-bold text-white uppercase italic">
                                {data.sport} • {data.timeSlot}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 pt-0">
                <button
                    onClick={onClose}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-neon-green transition-all shadow-xl"
                >
                    Close Result
                </button>
            </div>
        </motion.div>
    </motion.div>
);

export default function Scanner() {
    const [result, setResult] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [checkInData, setCheckInData] = useState(null);
    const [error, setError] = useState(null);
    const [manualMode, setManualMode] = useState(false);
    const [manualId, setManualId] = useState('');

    const { ref } = useZxing({
        onDecodeResult(decodedResult) {
            if (!isVerifying) {
                const text = decodedResult.getText();
                if (text.startsWith('ARENA-')) {
                    handleVerification(text.split('ARENA-')[1]);
                } else {
                    setError('Invalid QR: Please scan an official Arena Entry Pass.');
                }
            }
        },
    });

    const handleVerification = async (bookingId) => {
        setIsVerifying(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(
                `http://localhost:5000/api/bookings/${bookingId}/check-in`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (res.data.success) {
                setCheckInData(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const resetScanner = () => {
        setCheckInData(null);
        setError(null);
        setResult('');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 pt-10 font-sans">
            <AnimatePresence>
                {(checkInData || error) && (
                    <ScannerModal 
                        data={checkInData} 
                        error={error} 
                        onClose={resetScanner} 
                    />
                )}
            </AnimatePresence>

            {/* Header Intelligence */}
            <div className="max-w-xl mx-auto mb-10 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-neon-green/10 rounded-full blur-[80px]" />
                <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-1.5 bg-neon-green/10 border border-neon-green/30 rounded-full text-[10px] font-black text-neon-green uppercase tracking-[0.3em] mb-4 flex mx-auto w-fit relative z-10"
                >
                    Live Entry System
                </motion.span>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 relative z-10">
                    ENTRY <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">SCANNER</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest relative z-10">
                    Scan Player Entry Pass to confirm booking
                </p>
            </div>

            {/* Viewfinder / Manual Console */}
            <div className="max-w-xl mx-auto relative">
                {!manualMode ? (
                    <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40 group">
                        
                        {/* The Video Feed */}
                        <video ref={ref} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />

                        {/* Scanning UI Overlays */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            
                            {/* Edge Visuals */}
                            <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-neon-green rounded-tl-3xl opacity-50" />
                            <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-neon-green rounded-tr-3xl opacity-50" />
                            <div className="absolute bottom-10 left-10 w-16 h-16 border-b-4 border-l-4 border-neon-green rounded-bl-3xl opacity-50" />
                            <div className="absolute bottom-10 right-10 w-16 h-16 border-b-4 border-r-4 border-neon-green rounded-br-3xl opacity-50" />

                            {/* Scanner Line Animation */}
                            <div className="absolute left-1/2 top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-green to-transparent animate-[scan_3s_ease-in-out_infinite] blur-[2px]" />
                            
                            {/* Processing Intelligence */}
                            {isVerifying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-neon-green/20 border-t-neon-green rounded-full animate-spin" />
                                        <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Verifying Pass...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Camera Switch/Utility */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                            <button 
                                onClick={() => setManualMode(true)}
                                className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 text-white transition-all border border-white/10 text-[10px] font-black uppercase tracking-widest"
                            >
                                Enter ID Manually
                            </button>
                        </div>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl"
                    >
                        <ShieldCheck size={48} className="text-neon-green mx-auto mb-6 opacity-50" />
                        <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Manual Entry</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Enter the Reference ID to confirm entry</p>

                        <div className="space-y-4">
                            <input 
                                type="text"
                                placeholder="ENTER TICKET REFERENCE ID"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value.toUpperCase())}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-center text-white font-mono tracking-widest focus:border-neon-green/50 focus:outline-none transition-all placeholder:text-slate-700"
                            />
                            <button 
                                onClick={() => handleVerification(manualId)}
                                disabled={isVerifying || !manualId}
                                className="w-full py-4 bg-neon-green text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {isVerifying ? 'Verifying...' : 'Clear for Entry'}
                            </button>
                            <button 
                                onClick={() => setManualMode(false)}
                                className="w-full text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] hover:text-white transition-all"
                            >
                                Use Camera Scan
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Tactical Status Board */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-900 shadow-xl border border-white/5 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scanner Status</p>
                        <div className="flex items-center justify-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                             <span className="text-sm font-bold text-white uppercase italic">Scanner Ready</span>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900 shadow-xl border border-white/5 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Connection</p>
                        <div className="flex items-center justify-center gap-2">
                             <ShieldCheck size={16} className="text-neon-blue" />
                             <span className="text-sm font-bold text-white uppercase italic">System Linked</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
