import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MapPin, IndianRupee,
    CheckCircle, Star,
    ChevronDown, ArrowLeft, ArrowRight, MessageSquare, Send, Navigation
} from 'lucide-react';
import VenueMap from '../components/common/VenueMap';
import useNavigation from '../hooks/useNavigation';

// Reuse images
import carbonFibrePattern from '../assets/images/common/carbon-fibre.png';
import { 
    Car, Wifi, Coffee, Zap, 
    Activity, Luggage, ShowerHead, Award
} from 'lucide-react';

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
    const [selectedSport, setSelectedSport] = useState("Football");
    const [selectedCourt, setSelectedCourt] = useState('');
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [lastBooking, setLastBooking] = useState(null);

    const { startNavigation, isLoading: navLoading, error: navError, notification: navNotification } = useNavigation();

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                if (id === '1' || id === '2') {
                    setVenue({
                        name: id === '1' ? "Mumbai Football Arena" : "Bengaluru Sports Hub",
                        location: "City Center",
                        price: 1000,
                        sports: ["Football"],
                        rating: "4.9",
                        slots: ["06:00 AM", "07:00 AM", "08:00 PM"],
                        courts: { "Football": ["Turf A (5v5)", "Turf B (7v7)"] }
                    });
                    setLoadingVenue(false);
                    return;
                }

                const res = await fetch(`http://localhost:5000/api/venues/${id}`);
                const data = await res.json();
                
                if (data.success && data.data) {
                    const v = data.data;
                    let parsedCourts = {};
                    if (v.courts && v.courts.length > 0) {
                        v.courts.forEach(c => {
                            // Extract primary sport from category (e.g., "Football (5v5)" -> "Football")
                            // Fallback to "Football" if parsing fails
                            let sportName = "Football";
                            if (c.category) {
                                // Try to match from venue's sports list first
                                const matchingSport = v.sports?.find(s => c.category.toLowerCase().includes(s.toLowerCase()));
                                sportName = matchingSport || c.category.split(' ')[0];
                            }
                            
                            if (!parsedCourts[sportName]) parsedCourts[sportName] = [];
                            parsedCourts[sportName].push(`${c.name} (${c.category}) - ₹${c.price}/hr`);
                        });
                    } else {
                        // Fallback logic for legacy turfs without court mapping
                        parsedCourts = {};
                        (v.sports || ["Football"]).forEach(s => {
                            parsedCourts[s] = [`Main Arena (${s}) - ₹${v.price}/hr`];
                        });
                    }

                    const mappedVenue = {
                        name: v.name,
                        location: v.location,
                        description: v.description || "Experience gold-standard facilities with pro-grade lighting and world-class turf quality at our premier sports arena.",
                        price: v.price,
                        sports: v.sports && v.sports.length > 0 ? v.sports : ["Football"],
                        rating: v.rating || 4.5,
                        slots: v.slots || [],
                        courts: parsedCourts,
                        amenities: v.amenities || [],
                        images: (v.images && v.images.length > 0) ? v.images : [v.image || carbonFibrePattern],
                        coordinates: v.coordinates || { lat: 0, lng: 0 }
                    };
                    setVenue(mappedVenue);
                    setSelectedSport(mappedVenue.sports[0]);
                }
            } catch (err) {
                console.error("Error fetching single venue:", err);
            } finally {
                setLoadingVenue(false);
            }
        };

        fetchVenue();
    }, [id]);

    // Fetch dynamic availability
    useEffect(() => {
        if (!venue) return;
        const fetchBookingsForVenue = async () => {
            try {
                const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const res = await fetch(`http://localhost:5000/api/bookings/public?turfName=${encodeURIComponent(venue.name)}&date=${encodeURIComponent(formattedDate)}`);
                const data = await res.json();
                if (data.success) {
                    setBookedSlots(data.data);
                }
            } catch(err) {
                console.error("Error fetching available slots:", err);
            }
        };
        fetchBookingsForVenue();
    }, [venue, selectedDate]);

    useEffect(() => {
        if (!venue || id === '1' || id === '2') return;
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
                const data = await res.json();
                if (data.success) setReviews(data.data);
            } catch(e) {
                console.error("Failed to load reviews:", e);
            }
        };
        fetchReviews();
    }, [venue, id]);

    const times = venue?.slots && venue.slots.length > 0 ? venue.slots : [
        "06:00 AM", "07:00 AM", "08:00 AM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
    ];

    if (loadingVenue) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-neon-green rounded-full animate-spin" />
                <p className="tracking-widest uppercase text-xs font-bold text-neon-green">Initializing Arena...</p>
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

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const processImmediateBooking = async () => {
        if (!selectedTime || !selectedCourt) return;
        setBookingInProgress(true);

        const resSDK = await loadRazorpay();
        if (!resSDK) {
            alert("Razorpay SDK failed to load. Are you online?");
            setBookingInProgress(false);
            return;
        }

        let courtHourlyPrice = venue.price;
        if (selectedCourt && selectedCourt.includes('₹')) {
            const match = selectedCourt.match(/₹(\d+)\/hr/);
            if (match) courtHourlyPrice = Math.round(Number(match[1]));
        }

        const bookingData = {
            turfName: venue.name,
            sport: selectedSport,
            date: new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeSlot: `${selectedTime} (${selectedCourt}) - 1h`,
            price: courtHourlyPrice
        };

        try {
            // Step 1: Create Order on Backend
            const orderRes = await fetch('http://localhost:5000/api/payments/order', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: courtHourlyPrice, bookingData })
            });

            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error(orderData.message);

            // Step 2: Open Razorpay Checkout
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: "INR",
                name: "Arena Pro Elite",
                description: `Match Booking: ${venue.name}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    // Step 3: Verify Payment
                    try {
                        const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: orderData.bookingId
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            setLastBooking(bookingData);
                            setShowPaymentModal(true);
                        } else {
                            alert("Verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                    }
                },
                prefill: {
                    name: (JSON.parse(localStorage.getItem('user'))?.first_name || ""),
                    email: (JSON.parse(localStorage.getItem('user'))?.email || ""),
                },
                theme: { color: "#a855f7" } // Neon Purple theme
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch(e) {
            console.error("Booking/Payment failed:", e);
            alert(e.message || "Failed to initiate payment engine.");
        } finally {
            setBookingInProgress(false);
        }
    };

    const submitReview = async () => {
        if (!newReview.comment.trim()) return;
        setSubmittingReview(true);
        try {
            let realUserName = 'Guest';
            const lsUser = localStorage.getItem('user');
            if (lsUser) {
                const parsed = JSON.parse(lsUser);
                realUserName = parsed.first_name || parsed.email?.split('@')[0] || 'Athlete';
            }

            const res = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    venueId: id,
                    user: realUserName,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });
            const data = await res.json();
            if (data.success) {
                setReviews(prev => [data.data, ...prev]);
                setNewReview({ rating: 5, comment: '' });
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
        return bookedSlots.some(b => {
             if (!b.timeSlot.includes(selectedCourt)) return false;
             const targetMins = parseTimeToMinutes(t);
             const bTimeStr = b.timeSlot.substring(0, 8);
             const bStartMins = parseTimeToMinutes(bTimeStr);
             return targetMins === bStartMins;
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black flex flex-col relative">

            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowPaymentModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
                        >
                            <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-green/20">
                                <CheckCircle className="w-10 h-10 text-neon-green" />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase text-white mb-2">
                                Match Secured!
                            </h2>
                            <p className="text-slate-400 mb-8 text-sm">Your reservation is confirmed. Get ready to play!</p>
                            {lastBooking && (
                                <div className="bg-white/5 rounded-xl p-4 mb-8 text-left border border-white/5 text-xs space-y-2">
                                    <div className="flex justify-between font-bold"><span>Ground</span><span>{lastBooking.turfName}</span></div>
                                    <div className="flex justify-between"><span>Date</span><span>{lastBooking.date}</span></div>
                                    <div className="flex justify-between"><span>Slot</span><span>{lastBooking.timeSlot.split(' - ')[0]}</span></div>
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/bookings')}
                                className="w-full py-4 bg-neon-green text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                View My Bookings
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Header />

            <main className="relative z-10 flex-grow max-w-5xl mx-auto px-6 py-12 w-full">

                {/* Header Section */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-green group-hover:text-black transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Return</span>
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-4 tracking-tighter">{venue.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-neon-pink" /> {venue.location}</div>
                        <div className="flex items-center gap-2 border-l border-white/10 pl-4"><Star className="w-4 h-4 text-neon-yellow fill-current" /> <span className="font-bold text-white">{venue.rating}</span> <span className="text-xs opacity-50">(Community Score)</span></div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Arena Amenities Pill Row */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {(venue.amenities.length > 0 ? venue.amenities : ['parking', 'wifi', 'showers', 'power_backup']).map(id => {
                            const icons = {
                                parking: { label: 'Parking', icon: Car },
                                wifi: { label: 'Free WiFi', icon: Wifi },
                                showers: { label: 'Showers', icon: ShowerHead },
                                power_backup: { label: 'Power', icon: Zap },
                                canteen: { label: 'Café', icon: Coffee },
                                locker: { label: 'Locker', icon: Luggage },
                                first_aid: { label: 'First Aid', icon: Activity }
                            };
                            const item = icons[id] || { label: id, icon: Award };
                            return (
                                <span key={id} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <item.icon className="w-4 h-4 text-neon-blue" />
                                    {item.label}
                                </span>
                            );
                        })}
                    </div>

                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-black italic uppercase text-white tracking-widest">Arena Overview</h2>
                        <p className="text-slate-400 leading-relaxed font-medium text-lg">
                            {venue.description}
                        </p>
                    </div>

                {/* Unified Booking Panel */}
                <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-16">
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-3xl mx-auto space-y-10">
                        {/* Highlights */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            {venue.sports?.map(s => (
                                <span key={s} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300">{s} Certified</span>
                            ))}
                        </div>

                        {/* Config Selectors */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue ml-1">Choose Sport</label>
                                <div className="relative">
                                    <select value={selectedSport} onChange={(e) => { setSelectedSport(e.target.value); setSelectedCourt(''); }} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:border-neon-blue transition-colors">
                                        {venue.sports?.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-pink ml-1">Select Date</label>
                                <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold tracking-widest focus:border-neon-pink transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-green ml-1">Pick Arena / Court</label>
                            <div className="relative">
                                <select value={selectedCourt} onChange={(e) => { setSelectedCourt(e.target.value); setSelectedTime(null); }} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:border-neon-green transition-colors">
                                    <option value="">Choose your preferred ground...</option>
                                    {venue.courts[selectedSport]?.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Available Matches</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {times.map((t, i) => {
                                    const booked = isSlotBooked(t);
                                    return (
                                        <button key={i} disabled={booked || !selectedCourt} onClick={() => setSelectedTime(t)} className={`py-4 rounded-2xl border text-xs font-black transition-all ${booked ? 'bg-slate-900 border-red-500/30 text-red-500/30 cursor-not-allowed line-through' : !selectedCourt ? 'bg-slate-950/50 border-white/5 text-slate-600 cursor-not-allowed' : selectedTime === t ? 'bg-neon-green text-black border-neon-green shadow-lg scale-105' : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`}>
                                            {booked ? 'FULL' : t}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary & Confirm Block */}
                        <div className="pt-10 border-t border-white/5">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Fee</p>
                                    <h4 className="text-4xl font-black text-white italic flex items-center gap-2 justify-center md:justify-start">
                                        <IndianRupee className="w-8 h-8 text-neon-green" /> 
                                        {selectedCourt ? selectedCourt.match(/₹(\d+)/)?.[1] || venue.price : venue.price}
                                    </h4>
                                </div>
                                <div className="w-full md:w-auto">
                                    <button
                                        onClick={processImmediateBooking}
                                        disabled={!selectedTime || !selectedCourt || bookingInProgress}
                                        className={`w-full px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all text-sm flex items-center justify-center gap-3 ${!selectedTime || !selectedCourt ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-white text-black hover:bg-neon-green hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] group/btn active:scale-95'}`}
                                    >
                                        {bookingInProgress ? (
                                            <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Confirm & Secure <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <div className="mt-4 flex items-center justify-between px-2 opacity-40">
                                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            <Zap className="w-3 h-3 text-neon-yellow" fill="currentColor" /> Instant
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" /> Secure
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                {/* Location Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter flex items-center gap-3 mb-8">
                        <MapPin className="w-8 h-8 text-neon-pink" /> Turf <span className="text-neon-pink">Location</span>
                    </h2>
                    <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                        {/* Notification banner */}
                        {navNotification && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-neon-blue/10 border border-neon-blue/30 rounded-xl text-neon-blue text-sm font-bold">
                                <Navigation className="w-4 h-4 shrink-0" />
                                {navNotification}
                            </div>
                        )}
                        {/* Error banner */}
                        {navError && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-bold">
                                {navError}
                            </div>
                        )}
                        {/* Map */}
                        <VenueMap coordinates={venue.coordinates} />
                        {/* Navigation button */}
                        {venue.coordinates && venue.coordinates.lat !== 0 && (
                            <button
                                onClick={() => startNavigation(venue.coordinates)}
                                disabled={navLoading}
                                className="flex items-center gap-3 px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-black uppercase tracking-widest text-sm rounded-xl hover:bg-neon-blue hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {navLoading ? (
                                    <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Getting Location...</>
                                ) : (
                                    <><Navigation className="w-4 h-4" /> Start Navigation</>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-neon-blue" /> Athlete <span className="text-neon-blue">Feedback</span>
                        </h2>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {reviews.length} Feedbacks
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-12 space-y-4">
                            {reviews.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-white/5 border-dashed">
                                    <Star className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No match feedback yet</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reviews.map((rev) => (
                                        <motion.div key={rev._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neon-blue font-black border border-white/10">{rev.user.charAt(0)}</div>
                                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full text-[10px] font-black text-neon-yellow">★ {rev.rating}</div>
                                            </div>
                                            <h4 className="text-white font-bold mb-1">{rev.user}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                            <p className="text-slate-400 text-sm leading-relaxed italic">"{rev.comment}"</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Floating Add Review Box */}
                        <div className="lg:col-span-12 mt-12 bg-slate-900 p-10 rounded-[2.5rem] border border-white/10">
                            <h3 className="text-xl font-black italic uppercase text-white mb-8">Post Match Report</h3>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button key={s} onClick={() => setNewReview(prev => ({ ...prev, rating: s }))} className="transition-transform hover:scale-125 focus:outline-none">
                                                <Star className={`w-10 h-10 ${newReview.rating >= s ? 'text-neon-yellow fill-neon-yellow drop-shadow-[0_0_15px_rgba(255,255,0,0.3)]' : 'text-slate-800'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Rate your ground experience, lighting conditions, and staff behavior.</p>
                                </div>
                                <div className="space-y-4">
                                    <textarea value={newReview.comment} onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))} placeholder="Drop your feedback here..." className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-neon-yellow transition-all h-32 resize-none" />
                                    <button onClick={submitReview} disabled={submittingReview || !newReview.comment.trim()} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${!newReview.comment.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-neon-yellow text-black hover:bg-white hover:shadow-lg'}`}>{submittingReview ? 'POSTING...' : <><Send className="w-4 h-4 inline mr-2" /> SUBMIT REPORT</>}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
