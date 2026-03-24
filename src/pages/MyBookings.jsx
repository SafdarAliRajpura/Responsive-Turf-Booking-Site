import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, IndianRupee, CheckCircle, ArrowRight, History, PlayCircle } from 'lucide-react';
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
                className="bg-white text-black w-full max-w-sm rounded-3xl overflow-hidden relative shadow-2xl"
            >
                {/* Receipt Header */}
                <div className="bg-slate-950 text-white p-6 text-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/20 rounded-full blur-[40px]" />
                    <div className="relative z-10">
                        <CheckCircle className="w-10 h-10 text-neon-green mx-auto mb-3" />
                        <h2 className="text-xl font-black italic uppercase">Payment Receipt</h2>
                        <p className="text-slate-400 text-xs mt-1">Transforming Sports & Tech</p>
                    </div>
                </div>

                {/* Receipt Body */}
                <div className="p-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 rounded-full -translate-y-1/2" />

                    <div className="text-center mb-6">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Amount Paid</p>
                        <h3 className="text-3xl font-black">₹{booking.price}.00</h3>
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold mt-2 uppercase">
                            Success
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-dashed border-slate-200 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Payment ID</span>
                            <span className="font-bold text-slate-900">PAY-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Date</span>
                            <span className="font-bold text-slate-900">{booking.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Time</span>
                            <span className="font-bold text-slate-900">{booking.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Venue</span>
                            <span className="font-bold text-slate-900 text-right w-1/2">{booking.venue}</span>
                        </div>
                    </div>

                    {/* Barcode Mockup */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="h-12 bg-slate-100 rounded flex items-center justify-center opacity-50">
                            <span className="tracking-[0.5em] font-mono text-xs font-bold text-slate-400">||| ||||| || ||| ||||</span>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">{booking.id}</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Close Receipt
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
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img
                        src={booking.image}
                        alt={booking.venue}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent" />

                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border backdrop-blur-md ${statusColors[booking.status]}`}>
                            {booking.status}
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-black text-white italic uppercase leading-none mb-1">{booking.venue}</h3>
                        <p className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neon-green" /> {booking.location}
                        </p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-neon-green/5 transition-all" />

                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date & Time</p>
                            <div className="flex items-start gap-2 text-slate-200">
                                <Calendar className="w-4 h-4 mt-0.5 text-neon-blue" />
                                <div>
                                    <p className="font-bold">{booking.date}</p>
                                    <p className="text-sm font-medium text-slate-400">{booking.time}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                            <div className="flex items-center gap-1 text-white">
                                <IndianRupee className="w-4 h-4 text-neon-green" />
                                <span className="text-xl font-black italic">{booking.price}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Booking ID</p>
                            <p className="font-mono text-sm font-bold text-slate-300">{booking.id}</p>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sport</p>
                            <p className="text-sm font-bold text-white">{booking.sport}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-3 relative z-10">
                        <button
                            onClick={onViewReceipt}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors border border-white/5"
                        >
                            View Receipt
                        </button>
                        {booking.status === 'Completed' ? (
                            <button className="flex-1 py-3 rounded-xl bg-neon-green text-black font-bold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Book Again
                            </button>
                        ) : booking.status === 'Upcoming' ? (
                            <button className="flex-1 py-3 rounded-xl bg-slate-800 text-red-400 font-bold text-sm hover:bg-red-500/10 hover:text-red-500 transition-colors border border-white/5">
                                Cancel
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function MyBookings() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingsData, setBookingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bookings');
                const data = await res.json();
                if (data.success) {
                    const mapped = data.data.map(b => ({
                        id: b._id,
                        venue: b.turfName,
                        location: 'Location Unavailable', // Or fetch venue details
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

    const filteredBookings = bookingsData.filter(booking => {
        // Pending, Confirmed go to Upcoming. Cancelled, Rejected, Completed go to History
        const isUpcoming = ['Upcoming', 'Pending', 'Confirmed'].includes(booking.status);
        if (activeTab === 'upcoming') return isUpcoming;
        if (activeTab === 'history') return !isUpcoming;
        return true;
    });

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
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2"
                            >
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500">Bookings</span>
                            </motion.h1>
                            <p className="text-slate-400 font-medium">Manage upcoming matches and view your history.</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/10">
                            {[
                                { id: 'upcoming', label: 'Upcoming', icon: PlayCircle },
                                { id: 'history', label: 'History', icon: History }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all relative ${activeTab === tab.id
                                        ? 'text-black'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-lg"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <tab.icon className="w-4 h-4" /> {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-20 text-neon-green font-bold">Loading your active bookings...</div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
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
                                    className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed"
                                >
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
                                        <Calendar className="w-8 h-8 opacity-50" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
                                    <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                                        You don't have any {activeTab} bookings. Ready to play?
                                    </p>
                                    <button
                                        onClick={() => navigate('/venues')}
                                        className="px-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                                    >
                                        Browse Venues
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
