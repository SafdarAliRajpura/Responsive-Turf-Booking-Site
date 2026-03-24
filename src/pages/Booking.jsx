import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Calendar as CalendarIcon, Clock, MapPin, IndianRupee,
    CreditCard, ArrowRight, Star, CheckCircle,
    Plus, Minus, Trash2, Trophy, ChevronDown, ArrowLeft, MessageSquare, Send
} from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import SplitText from '../components/common/SplitText';

// Reuse images
import footballNight from '../assets/images/home/football-night-new.jpg';
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loadingVenue, setLoadingVenue] = useState(true);
    const [bookedSlots, setBookedSlots] = useState([]);
    
    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [duration, setDuration] = useState(60); // in minutes
    // Initialize sports (will be updated once venue loads)
    const [selectedSport, setSelectedSport] = useState("Football");
    const [selectedCourt, setSelectedCourt] = useState('');
    const [cartItem, setCartItem] = useState(null); // null or object
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                // Determine if it's a legacy static ID or a Mongo ID
                if (id === '1' || id === '2') {
                    // Fallback local dummy for static ID
                    setVenue({
                        name: id === '1' ? "Mumbai Football Arena" : "Bengaluru Sports Hub",
                        location: "City Center",
                        price: 1000,
                        sports: ["Football"],
                        rating: "4.9",
                        courts: { "Football": ["Turf A (5v5)", "Turf B (7v7)"] }
                    });
                    setLoadingVenue(false);
                    return;
                }

                const res = await fetch(`http://localhost:5000/api/venues/${id}`);
                const data = await res.json();
                
                if (data.success && data.data) {
                    const v = data.data;
                    const mappedVenue = {
                        name: v.name,
                        location: v.location,
                        price: v.price,
                        sports: v.sports && v.sports.length > 0 ? v.sports : ["Football"],
                        rating: v.rating || 4.5,
                        courts: {
                            "Football": ["Turf A (5v5)", "Turf B (7v7)", "Turf C (Pro)"],
                            "Cricket": ["Net 1 (Pace)", "Net 2 (Spin)", "Net 3 (Match)"],
                            "Badminton": ["Court 1 (Wooden)", "Court 2 (Synthetic)"]
                        }
                    };
                    setVenue(mappedVenue);
                    setSelectedSport(mappedVenue.sports[0]); // auto-select first sport
                } else {
                    console.error("Venue not found in DB");
                }
            } catch (err) {
                console.error("Error fetching single venue:", err);
            } finally {
                setLoadingVenue(false);
            }
        };

        const fetchBookingsForVanue = async () => {
             try {
                 const res = await fetch('http://localhost:5000/api/bookings');
                 const data = await res.json();
                 if (data.success) {
                     // Get active bookings
                     const activeBookings = data.data.filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected');
                     setBookedSlots(activeBookings);
                 }
             } catch(err) {
                 console.error("Error fetching booked slots:", err);
             }
        };

        fetchVenue();
        fetchBookingsForVanue();
    }, [id]);

    useEffect(() => {
        if (!venue || id === '1' || id === '2') return;
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
                const data = await res.json();
                if (data.success) {
                    setReviews(data.data);
                }
            } catch(e) {
                console.error("Failed to load reviews:", e);
            }
        };
        fetchReviews();
    }, [venue, id]);

    const times = [
        "06:00 AM", "07:00 AM", "08:00 AM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
    ];

    if (loadingVenue) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-neon-green rounded-full animate-spin" />
                <p className="tracking-widest uppercase text-xs font-bold text-neon-green">Initializing Booking Engine...</p>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <p className="tracking-widest uppercase text-lg font-bold text-red-500">Venue Not Found</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">Go Back</button>
            </div>
        );
    }

    const toggleAddToCart = () => {
        if (cartItem) {
            setCartItem(null); // Remove
        } else {
            setCartItem({
                turfName: venue.name,
                sport: selectedSport,
                date: new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                timeSlot: `${selectedTime} (${selectedCourt}) - ${Math.floor(duration / 60)}h ${duration % 60 > 0 ? (duration % 60) + 'm' : ''}`,
                price: (venue.price * (duration / 60)),
                status: 'pending'
            });
        }
    };

    const handleDurationChange = (delta) => {
        setDuration(prev => Math.max(30, Math.min(180, prev + delta)));
    };

    const processBooking = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItem)
            });
            const data = await res.json();
            if (data.success) {
                // Update local booked slots so it locks out immediately without refresh
                setBookedSlots(prev => [...prev, data.data]);
                setShowPaymentModal(true);
            }
        } catch(e) {
            console.error("Booking failed:", e);
        }
    };

    const submitReview = async () => {
        if (!newReview.comment.trim()) return;
        setSubmittingReview(true);
        try {
            const res = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    venueId: id,
                    user: 'Awesome User', // Default dummy user for MVP since no hard auth
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });
            const data = await res.json();
            if (data.success) {
                setReviews(prev => [data.data, ...prev]);
                setNewReview({ rating: 5, comment: '' });
                
                // Update local venue rating dynamically (MVP visual trick)
                const newTotal = (parseFloat(venue.rating) * (reviews.length || 1) + newReview.rating) / ((reviews.length || 1) + 1);
                setVenue(prev => ({ ...prev, rating: newTotal.toFixed(1) }));
            }
        } catch (e) {
            console.error("Failed to post review", e);
        } finally {
            setSubmittingReview(false);
        }
    };

    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [time, modifier] = timeStr.trim().split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (hours === 12) hours = 0;
        if (modifier === 'PM') hours += 12;
        return hours * 60 + (minutes || 0);
    };

    const isSlotBooked = (t) => {
        if (!selectedCourt) return false;
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        return bookedSlots.some(b => {
             if (b.turfName !== venue.name || b.sport !== selectedSport || b.date !== formattedDate) return false;
             if (!b.timeSlot.includes(selectedCourt)) return false;
             
             const bTimeStr = b.timeSlot.substring(0, 8);
             const bStartMins = parseTimeToMinutes(bTimeStr);
             let bDurMins = 60;
             const match = b.timeSlot.match(/- (\d+)h(?: (\d+)m)?/);
             if (match) {
                 bDurMins = parseInt(match[1] || 0) * 60 + parseInt(match[2] || 0);
             }
             const bEndMins = bStartMins + bDurMins;
             
             const targetMins = parseTimeToMinutes(t);
             // Return true if this button time falls within ANY booked slot runtime
             return targetMins >= bStartMins && targetMins < bEndMins;
        });
    };

    const hasActiveConflict = () => {
        if (!selectedTime || !selectedCourt) return false;
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const myStartMins = parseTimeToMinutes(selectedTime);
        const myEndMins = myStartMins + duration; // local duration state is in mins

        return bookedSlots.some(b => {
            if (b.turfName !== venue.name || b.sport !== selectedSport || b.date !== formattedDate) return false;
            if (!b.timeSlot.includes(selectedCourt)) return false;

            const bTimeStr = b.timeSlot.substring(0, 8);
            const bStartMins = parseTimeToMinutes(bTimeStr);
            let bDurMins = 60;
            const match = b.timeSlot.match(/- (\d+)h(?: (\d+)m)?/);
            if (match) {
                bDurMins = parseInt(match[1] || 0) * 60 + parseInt(match[2] || 0);
            }
            const bEndMins = bStartMins + bDurMins;

            // They overlap if the highest start is STRICTLY LESS than the lowest end
            return Math.max(myStartMins, bStartMins) < Math.min(myEndMins, bEndMins);
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black flex flex-col relative">

            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowPaymentModal(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center overflow-hidden"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-neon-green/20 rounded-full blur-[50px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-green/20">
                                    <CheckCircle className="w-10 h-10 text-neon-green" />
                                </div>

                                <h2 className="text-2xl font-black italic uppercase text-white mb-2">
                                    <TypeAnimation
                                        sequence={[
                                            'Booking Confirmed!',
                                            1000,
                                            'See You There!',
                                            1000
                                        ]}
                                        wrapper="span"
                                        speed={50}
                                        repeat={Infinity}
                                        cursor={false}
                                    />
                                </h2>
                                <p className="text-slate-400 mb-8 text-sm">Your slot has been successfully booked. Get ready to play!</p>

                                {cartItem && (
                                    <div className="bg-white/5 rounded-xl p-4 mb-8 text-left border border-white/5">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-400 text-xs">Venue</span>
                                            <span className="font-bold text-sm text-white">{cartItem.turfName}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-400 text-xs">Sport</span>
                                            <span className="font-bold text-sm text-white">{cartItem.sport}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-400 text-xs">Date</span>
                                            <span className="font-bold text-sm text-white">{cartItem.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-xs">Time Slot</span>
                                            <span className="font-bold text-sm text-white">{cartItem.timeSlot}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate('/bookings')}
                                    className="w-full py-3 bg-neon-green text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Go to My Bookings
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${carbonFibrePattern})` }} />
            </div>

            <Header />

            <main className="relative z-10 flex-grow max-w-7xl mx-auto px-6 py-12 w-full">

                {/* Header Section */}
                <div className="mb-8 border-b border-white/10 pb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-green group-hover:text-black group-hover:border-neon-green transition-all">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Back</span>
                    </button>
                    <h1 className="text-3xl font-black italic uppercase text-white mb-2"><SplitText>{venue.name}</SplitText></h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-neon-pink" />
                        <span>{venue.location}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600 mx-2" />
                        <Star className="w-4 h-4 text-neon-yellow fill-current" />
                        <span className="font-bold text-white">{venue.rating}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT PANEL: Booking Configuration */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Offer Banner */}
                        <div className="bg-gradient-to-r from-neon-green to-emerald-600 rounded-lg p-3 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                            <Trophy className="w-5 h-5 text-black" />
                            <span className="text-black font-bold text-sm uppercase tracking-wide">Earn 50 XP Points on this booking!</span>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">

                            {/* Sport Selector */}
                            <div className="grid md:grid-cols-4 items-center gap-4">
                                <label className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-right">Sport</label>
                                <div className="md:col-span-3">
                                    <div className="relative">
                                        <select
                                            value={selectedSport}
                                            onChange={(e) => {
                                                setSelectedSport(e.target.value);
                                                setSelectedCourt('');
                                            }}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-bold appearance-none focus:outline-none focus:border-neon-green/50"
                                        >
                                            {venue.sports?.map((sport) => (
                                                <option key={sport} value={sport}>{sport}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Date Selector */}
                            <div className="grid md:grid-cols-4 items-center gap-4">
                                <label className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-right">Date</label>
                                <div className="md:col-span-3 relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-widest uppercase focus:outline-none focus:border-neon-green/50 appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:border-white/30 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Court Selector */}
                            <div className="grid md:grid-cols-4 items-center gap-4">
                                <label className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-right">Court</label>
                                <div className="md:col-span-3 relative">
                                    <select
                                        value={selectedCourt}
                                        onChange={(e) => {
                                            setSelectedCourt(e.target.value);
                                            setSelectedTime(null); // Reset time when court changes
                                        }}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-medium appearance-none focus:outline-none focus:border-neon-green/50"
                                    >
                                        <option value="">-- Select Court First to See Available Times --</option>
                                        {venue.courts[selectedSport]?.map((court) => (
                                            <option key={court} value={court}>{court}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Time Selector */}
                            <div className="grid md:grid-cols-4 items-start gap-4">
                                <label className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-right mt-3">Start Time</label>
                                <div className="md:col-span-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {times.map((t, i) => {
                                        const booked = isSlotBooked(t);
                                        return (
                                            <button
                                                key={i}
                                                disabled={booked || !selectedCourt}
                                                onClick={() => setSelectedTime(t)}
                                                className={`px-2 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                                                    booked
                                                    ? 'bg-slate-900 border-red-500/30 text-red-500/50 cursor-not-allowed line-through'
                                                    : !selectedCourt
                                                    ? 'bg-slate-950 border-white/5 text-slate-600 cursor-not-allowed'
                                                    : selectedTime === t
                                                    ? 'bg-neon-green text-black border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                                                    : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                                                }`}
                                            >
                                                {booked ? 'Booked' : t}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Duration Selector */}
                            <div className="grid md:grid-cols-4 items-center gap-4">
                                <label className="text-slate-400 font-bold uppercase tracking-wider text-xs md:text-right">Duration</label>
                                <div className="md:col-span-3 flex items-center gap-4">
                                    <button
                                        onClick={() => handleDurationChange(-30)}
                                        className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="text-xl font-bold text-white w-32 text-center">
                                        {Math.floor(duration / 60)}h {duration % 60 > 0 && `${duration % 60}m`}
                                    </div>
                                    <button
                                        onClick={() => handleDurationChange(30)}
                                        className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white hover:bg-neon-green hover:text-black hover:border-neon-green transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Blank line to balance UI removal of old court selector chunk */}

                            {/* Add to Cart Button */}
                            <div className="md:pl-[25%] mt-4">
                                {hasActiveConflict() && (
                                    <p className="text-red-500 font-bold mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> 
                                        Conflict Detected: Your {duration / 60}h duration overlaps with an existing booking. Reduce duration or pick another time.
                                    </p>
                                )}
                                <button
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                                        selectedTime && selectedCourt && !cartItem && !hasActiveConflict()
                                        ? 'bg-white text-black hover:bg-neon-green hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                        }`}
                                    disabled={!selectedTime || !selectedCourt || cartItem || hasActiveConflict()}
                                    onClick={toggleAddToCart}
                                >
                                    {cartItem ? 'Added to Cart' : 'Add to Cart'} <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT PANEL: Cart / Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        Cart <span className="bg-neon-blue text-black text-[10px] px-1.5 py-0.5 rounded-full">{cartItem ? 1 : 0}</span>
                                    </h3>
                                    {cartItem && (
                                        <button onClick={() => setCartItem(null)} className="text-red-500 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="p-6 min-h-[200px] flex flex-col">
                                    {cartItem ? (
                                        <div className="flex-1 space-y-4">
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative group">
                                                <div className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" onClick={() => setCartItem(null)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </div>
                                                <p className="font-bold text-white text-sm mb-1">{cartItem.turfName}</p>
                                                <div className="text-slate-400 text-xs space-y-1">
                                                    <p className="flex items-center gap-2"><Trophy className="w-3 h-3" /> {cartItem.sport}</p>
                                                    <p className="flex items-center gap-2"><CalendarIcon className="w-3 h-3" /> {cartItem.date}</p>
                                                    <p className="flex items-center gap-2"><Clock className="w-3 h-3" /> {cartItem.timeSlot}</p>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center text-neon-green font-bold">
                                                    <IndianRupee className="w-3 h-3" /> {cartItem.price}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                                            <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-3">
                                                <CreditCard className="w-6 h-6 opacity-30" />
                                            </div>
                                            <p className="text-sm">Your cart is empty</p>
                                            <p className="text-xs mt-1">Select a slot to book</p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    {cartItem && (
                                        <div className="mt-6 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Subtotal</span>
                                                <span className="text-white font-bold">₹{cartItem.price}</span>
                                            </div>
                                            <button
                                                onClick={processBooking}
                                                className="w-full py-3 bg-neon-green text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                            >
                                                Proceed ₹{cartItem.price}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Reviews Section */}
                <div className="mt-12 bg-slate-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-yellow/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <h2 className="text-3xl font-black italic uppercase text-white mb-8 flex items-center gap-2">
                        <MessageSquare className="w-8 h-8 text-neon-yellow" /> Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow to-orange-400">Reviews</span>
                    </h2>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Feed */}
                        <div className="lg:col-span-8 space-y-6">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-white/5 border-dashed">
                                    <Star className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                reviews.map((rev) => (
                                    <motion.div 
                                        key={rev._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-black border border-neon-blue/30">
                                                    {rev.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">{rev.user}</h4>
                                                    <p className="text-xs text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-neon-yellow fill-neon-yellow' : 'text-slate-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Input Form */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 bg-slate-950 border border-white/5 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>
                                <div className="mb-6 flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                            className="transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star className={`w-8 h-8 ${newReview.rating >= star ? 'text-neon-yellow fill-neon-yellow drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]' : 'text-slate-700'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Share your experience playing here..."
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-neon-yellow focus:outline-none resize-none h-32 mb-4"
                                />
                                <button
                                    onClick={submitReview}
                                    disabled={submittingReview || !newReview.comment.trim()}
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!newReview.comment.trim() ? 'bg-slate-800 text-slate-500' : 'bg-neon-yellow text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,0,0.4)]'}`}
                                >
                                    {submittingReview ? 'Posting...' : <><Send className="w-4 h-4" /> Post Review</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
