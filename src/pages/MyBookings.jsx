import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, IndianRupee, CheckCircle } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

const dummyImage = 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800';

const ReceiptModal = ({ booking, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-black w-full max-w-sm rounded-[2rem] overflow-hidden relative shadow-2xl"
            >
                {/* Receipt Header */}
                <div className="bg-slate-950 text-white p-6 text-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/20 rounded-full blur-[40px]" />
                    <div className="relative z-10">
                        <CheckCircle className="w-10 h-10 text-neon-green mx-auto mb-3" />
                        <h2 className="text-xl font-black italic uppercase italic">TRANSFORMED MATCH</h2>
                        <p className="text-slate-400 text-xs mt-1">ARENA PRO ELITE RECEIPT</p>
                    </div>
                </div>

                {/* Receipt Body */}
                <div className="p-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 rounded-full -translate-y-1/2" />

                    <div className="text-center mb-6">
                        <p className="text-xs text-slate-500 font-black uppercase tracking-wider mb-1">TOTAL AMOUNT</p>
                        <h3 className="text-3xl font-black italic">₹{booking.price}.00</h3>
                    </div>

                    <div className="space-y-4 border-t border-dashed border-slate-200 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">Reference</span>
                            <span className="font-bold text-slate-900 font-mono">{booking.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">Date</span>
                            <span className="font-bold text-slate-900">{booking.date}</span>
                        </div>
                        <div className="flex justify-between text-sm text-right">
                            <span className="text-slate-500 font-bold uppercase text-[10px] text-left">Match Details</span>
                            <span className="font-bold text-slate-900">{booking.venue} <br/> <small className="text-slate-500 font-medium">{booking.time}</small></span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                        onClick={onClose}
                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
                    >
                        Close Ticket
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
                {/* Image Section */}
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

                {/* Details Section */}
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

                    <div className="mt-6 flex justify-end">
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

// Added Trophy import context for the icon
const Trophy = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default function MyBookings() {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingsData, setBookingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bookings', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    const mapped = data.data.map(b => ({
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
            } catch (err) {
                console.error("Failed to load user bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
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
                            className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-4"
                        >
                            MATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">HISTORY</span>
                        </motion.h1>
                        <div className="flex items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
                                Total Bookings: {bookingsData.length}
                            </div>
                        </div>
                    </div>

                    {/* Bookings Timeline (No Sections) */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-20 flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-2 border-white/10 border-t-neon-green rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Match Timeline</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                            {bookingsData.length > 0 ? (
                                bookingsData.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onViewReceipt={() => setSelectedBooking(booking)}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-32 bg-slate-900/20 backdrop-blur-sm rounded-[3rem] border border-white/5 border-dashed"
                                >
                                    <h3 className="text-2xl font-black text-white italic uppercase italic mb-2">No Active Matches</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">
                                        Your pitch history is currently clear.
                                    </p>
                                    <button
                                        onClick={() => navigate('/venues')}
                                        className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neon-green transition-all shadow-xl"
                                    >
                                        Find Your Next Ground
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
