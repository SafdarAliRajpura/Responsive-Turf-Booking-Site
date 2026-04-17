import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, MapPin, IndianRupee, CheckCircle,
    Zap, Share2, Download, X, 
    ShieldCheck, Smartphone, Target,
    CreditCard, Trophy
} from 'lucide-react';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import apiClient from '../utils/apiClient';
import Toast from '../components/ui/Toast';

const dummyImage = 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800';

const ReceiptModal = ({ booking, onClose }) => {
    const ticketRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!ticketRef.current) return;
        setIsDownloading(true);

        try {
            // Wait a small bit for any animations to finish
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(ticketRef.current, {
                scale: 3, // High quality
                useCORS: true,
                backgroundColor: '#0f172a', // Matches slate-900 background for a clean cutout
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width / 3, canvas.height / 3] // Scale back down to original size in PDF
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
            pdf.save(`Match-Ticket-${booking.id.substring(0, 8)}.pdf`);
        } catch (error) {
            console.error("PDF Export Failure:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[580px] my-auto"
            >
                {/* Horizontal Tactical Pass Wrapper */}
                <div 
                    ref={ticketRef}
                    className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
                >
                    
                    {/* Left Panel: Match Intelligence */}
                    <div className="flex-1 p-8 border-r border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">
                                {booking.venue}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                                <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.4em]">Official Entry Pass</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Athlete</p>
                                <p className="text-sm font-bold text-white uppercase italic">{JSON.parse(localStorage.getItem('user'))?.first_name || 'Champion'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Match</p>
                                <p className="text-sm font-bold text-white uppercase italic">{booking.sport}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Date</p>
                                <p className="text-sm font-bold text-white italic">{booking.date}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Fee Paid</p>
                                <p className="text-xl font-black text-white flex items-center gap-1 italic">
                                    <IndianRupee size={16} className="text-neon-green"/> {booking.price}
                                </p>
                            </div>
                        </div>

                        {/* Integrated Time Socket */}
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Time Socket</p>
                                <p className="text-xs font-black text-neon-green italic leading-tight">{booking.time}</p>
                            </div>
                            <ShieldCheck size={20} className="text-neon-green opacity-50" />
                        </div>
                    </div>

                        <div className="w-full md:w-[220px] bg-slate-950/50 p-8 flex flex-col items-center justify-center border-t md:border-t-0 border-white/10">
                        <div className="p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(57,255,20,0.15)] mb-4">
                            <QRCodeSVG 
                                value={`ARENA-${booking.id}`}
                                size={140}
                                level="H"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase mb-1">Clearance Scan</p>
                            <p className="text-[7px] font-mono text-slate-700 break-all w-[160px] leading-tight">ID: {String(booking.id || '').toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Tactical Action Bar */}
                <div className="mt-6 flex gap-3">
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex-1 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-neon-green transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                        {isDownloading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download size={14} /> Download Match Ticket
                            </>
                        )}
                    </button>
                    <button onClick={onClose} className="px-6 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all flex items-center justify-center">
                        <X size={20} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BookingCard = ({ booking, onViewReceipt }) => {
    const statusColors = {
        'Pending': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        'Upcoming': 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
        'Confirmed': 'bg-neon-green/20 text-neon-green border-neon-green/30',
        'Completed': 'bg-neon-green/20 text-neon-green border-neon-green/30',
        'Cancelled': 'bg-red-500/20 text-red-500 border-red-500/30',
        'Rejected': 'bg-red-500/20 text-red-500 border-red-500/30'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-neon-green/30 transition-all shadow-xl"
        >
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 relative h-40 md:h-auto overflow-hidden">
                    <img
                        src={booking.image || dummyImage}
                        alt={booking.venue}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 to-transparent" />
                    <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${statusColors[booking.status] || statusColors['Pending']}`}>
                            {booking.status}
                        </span>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-black text-white italic uppercase mb-1 tracking-tighter">{booking.venue}</h3>
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-widest">
                                <Trophy size={12} className="text-neon-blue"/> {booking.sport} Match
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Fee Paid</p>
                            <span className="text-xl font-black italic text-neon-green flex items-center gap-1">
                                <IndianRupee size={16}/> {booking.price}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                                <Calendar size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule</p>
                                <p className="text-sm font-bold text-white">{booking.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                                <MapPin size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slot Info</p>
                                <p className="text-sm font-bold text-white truncate max-w-[120px]">{booking.time}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onViewReceipt}
                            className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white text-white hover:text-black font-black text-[10px] uppercase tracking-widest transition-all border border-white/10"
                        >
                            View Ticket
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const TournamentCard = ({ registration }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-neon-blue/30 transition-all"
        >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={80} className="text-neon-blue" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                            Tournament Squad
                        </span>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            {registration.tournamentId?.name || 'Championship'}
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status</p>
                        <p className="text-sm font-black text-neon-green uppercase italic">Enrolled</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 p-6 bg-slate-950/50 rounded-3xl border border-white/5">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-neon-blue"/> Team Name
                        </p>
                        <p className="text-lg font-black text-white uppercase italic">{registration.teamName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <Zap size={12} className="text-neon-blue"/> Squad Size
                        </p>
                        <p className="text-lg font-black text-white uppercase italic">{registration.players?.length || 0} Athletes</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <Target size={12} className="text-neon-blue"/> Captain
                        </p>
                        <p className="text-lg font-black text-white uppercase italic truncate">{registration.captainName}</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between text-slate-500 font-bold text-[10px] uppercase tracking-widest border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-600"/>
                        Event Date: <span className="text-slate-300">{registration.tournamentId?.date || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-slate-600"/>
                        Type: <span className="text-slate-300">{registration.tournamentId?.type || 'Standard'} Elite</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};



export default function MyBookings() {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingsData, setBookingsData] = useState([]);
    const [tournamentsData, setTournamentsData] = useState([]);
    const [activeTab, setActiveTab] = useState('Matches'); // 'Matches' or 'Squads'
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingRes, tourRes] = await Promise.all([
                apiClient.get('/bookings'),
                apiClient.get('/tournaments/my-registrations')
            ]);
            
            if (bookingRes.data?.success) {
                const mapped = bookingRes.data.data.map(b => ({
                    id: b._id,
                    venue: b.turfName,
                    location: 'Arena Certified',
                    date: b.date,
                    time: b.timeSlot,
                    price: b.price,
                    status: b.status,
                    sport: b.sport,
                    image: dummyImage
                }));
                setBookingsData(mapped);
            }

            if (tourRes.data?.success) {
                setTournamentsData(tourRes.data.data);
            }
        } catch (err) {
            console.error("Historical Data Sync Failure:", err);
            setToast({ message: "Failed to sync match history.", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">
            <Header />

            <AnimatePresence>
                {selectedBooking && (
                    <ReceiptModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                    />
                )}
            </AnimatePresence>

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[800px] bg-neon-green/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[150px]" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Unified Header */}
                    <div className="mb-12">
                        <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-neon-green font-black uppercase tracking-[0.3em] text-[10px] mb-2 block"
                        >
                            Arena Pro Athlete Stats
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-8"
                        >
                            MATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">HISTORY</span>
                        </motion.h1>
                        
                        {/* Tactical Tab Navigation */}
                        <div className="flex gap-4 p-1.5 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl w-fit">
                            {['Matches', 'Squads'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                                        activeTab === tab 
                                        ? 'bg-white text-black shadow-lg shadow-white/10' 
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    {tab === 'Matches' ? 'Arena Bookings' : 'Tournament Squads'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-20 flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-2 border-white/10 border-t-neon-green rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Intelligence Ledger</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {activeTab === 'Matches' ? (
                                    <motion.div 
                                        key="matches"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        {bookingsData.length > 0 ? (
                                            bookingsData.map((booking) => (
                                                <BookingCard
                                                    key={booking.id}
                                                    booking={booking}
                                                    onViewReceipt={() => setSelectedBooking(booking)}
                                                />
                                            ))
                                        ) : (
                                            <EmptyState 
                                                title="No Active Matches" 
                                                desc="Your pitch history is currently clear." 
                                                btnText="Find Your Next Ground"
                                                link="/venues"
                                            />
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="squads"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {tournamentsData.length > 0 ? (
                                            tournamentsData.map((reg) => (
                                                <TournamentCard key={reg._id} registration={reg} />
                                            ))
                                        ) : (
                                            <EmptyState 
                                                title="No Squad Registrations" 
                                                desc="You haven't enlisted in any championships yet." 
                                                btnText="View Tournaments"
                                                link="/tournaments"
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({...toast, message: null})} 
            />
        </div>
    );
}

const EmptyState = ({ title, desc, btnText, link }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-slate-900/20 backdrop-blur-sm rounded-[3rem] border border-white/5 border-dashed"
        >
            <h3 className="text-2xl font-black text-white italic uppercase mb-2">{title}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">{desc}</p>
            <button
                onClick={() => navigate(link)}
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neon-green transition-all shadow-xl"
            >
                {btnText}
            </button>
        </motion.div>
    );
}
