import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Upload, IndianRupee, Layout,
    Type, CheckCircle, Image as ImageIcon,
    Dumbbell, Wifi, Car, Coffee, Info, ArrowLeft, Clock, Trash2, Plus, Locate
} from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import MapPicker from '../components/MapPicker';
import apiClient from '../../../utils/apiClient';

const AmenityChip = ({ label, icon: Icon, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300 ${selected
            ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const InputGroup = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </label>
        {children}
    </div>
);

export default function AddTurf() {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [formData, setFormData] = useState({
        turfName: '',
        description: '',
        address: '',
        city: '',
        pincode: '',
        coordinates: { lat: 23.0225, lng: 72.5714 }
    });

    const [courts, setCourts] = useState([]);
    const [pricingRules, setPricingRules] = useState({
        weekendPrice: '',
        peakHourPrice: ''
    });

    const [amenities, setAmenities] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const availableTimeSlots = [
        "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
        "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
    ];

    const toggleSlot = (slot) => {
        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleAmenity = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter(a => a !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const validateForm = () => {
        if (!formData.turfName.trim()) return "Turf Name is required.";
        if (!formData.description.trim()) return "Description is required.";
        if (formData.description.trim().length < 10) return "Description must be at least 10 characters.";

        if (courts.length === 0) return "At least one court must be added.";
        for (let i = 0; i < courts.length; i++) {
            if (!courts[i].name.trim()) return `Court ${i+1} Name is required.`;
            if (!courts[i].price || Number(courts[i].price) <= 0) return `Court ${i+1} must have a valid positive Hourly Rate.`;
        }

        if (!formData.address.trim()) return "Address is required.";
        if (!formData.city.trim()) return "City is required.";

        if (!formData.pincode) return "Pincode is required.";
        if (!/^\d{6}$/.test(formData.pincode)) return "Pincode must be a valid 6-digit number.";

        if (selectedSlots.length === 0) return "Please select at least one operating slot.";
        if (amenities.length === 0) return "Please select at least one amenity.";

        return null; // No errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            setToast({ message: error, type: 'error' });
            return;
        }

        // Convert all files to base64 so they store cleanly in DB
        let imagesArray = [];
        let primaryImage = "http://localhost:5000/uploads/venue_default.jpg";
        
        if (files.length > 0) {
            try {
                // Process all files in parallel
                imagesArray = await Promise.all(
                    files.map(file => getBase64(file))
                );
                primaryImage = imagesArray[0];
            } catch (err) {
                console.error("Gallery processing failed", err);
                setToast({ message: "Failed to process one or more images.", type: 'error' });
                return;
            }
        }

        // Map to Venue schema
        const submissionData = {
            name: formData.turfName,
            location: `${formData.address}, ${formData.city}, ${formData.pincode}`,
            price: Number(courts[0].price),
            sports: Array.from(new Set(courts.map(c => c.category.split(' ')[0]))),
            courts: courts.map(c => ({ name: c.name, category: c.category, price: Number(c.price) })),
            amenities,
            slots: [...selectedSlots].sort((a, b) => availableTimeSlots.indexOf(a) - availableTimeSlots.indexOf(b)),
            status: 'Active',
            rating: 5.0,
            distance: '1.2 km', 
            weekendPrice: Number(pricingRules.weekendPrice) || null,
            peakHourPrice: Number(pricingRules.peakHourPrice) || null,
            image: primaryImage,
            images: imagesArray,
            coordinates: formData.coordinates
        };

        try {
            const res = await apiClient.post('/venues', submissionData);
            if (res.data.success) {
                setToast({ message: "Turf created successfully in Live DB!", type: 'success' });
                setTimeout(() => navigate('/partner/turfs'), 1500);
            } else {
                setToast({ message: "Failed to create turf", type: 'error' });
            }
        } catch (err) {
            console.error("Error creating turf:", err);
            setToast({ message: err.response?.data?.message || "Network Error", type: 'error' });
        }
    };

    const availableAmenities = [
        { id: 'parking', label: 'Parking', icon: Car },
        { id: 'wifi', label: 'Free WiFi', icon: Wifi },
        { id: 'changing_room', label: 'Changing Room', icon: CheckCircle },
        { id: 'canteen', label: 'Cafeteria', icon: Coffee },
        { id: 'showers', label: 'Shower', icon: CheckCircle },
        { id: 'power_backup', label: 'Power Backup', icon: CheckCircle },
        { id: 'first_aid', label: 'First Aid', icon: CheckCircle },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate('/partner/turfs')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2 text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Turfs
                    </button>
                    <h1 className="text-3xl font-black text-white">ADD NEW TURF</h1>
                    <p className="text-slate-400">List a new sports venue on the platform.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-8"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                            <Info className="w-5 h-5" />
                        </span>
                        Basic Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <InputGroup label="Turf Name" icon={Type}>
                                <input
                                    name="turfName"
                                    value={formData.turfName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Neon Sports Arena"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                                />
                            </InputGroup>
                        </div>

                        <div className="md:col-span-2">
                            <InputGroup label="Description" icon={Layout}>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Tell us about the turf, surface quality, etc..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50 transition-colors resize-none"
                                />
                            </InputGroup>
                        </div>
                    </div>
                </motion.div>

                {/* Courts Management Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Layout className="w-5 h-5" />
                            </span>
                            Turf Courts
                        </h2>
                        <button
                            type="button"
                            onClick={() => setCourts([...courts, { id: Date.now(), name: `Court ${String.fromCharCode(65 + courts.length)}`, category: 'Football (5v5)', price: '' }])}
                            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Court
                        </button>
                    </div>

                    <div className="space-y-4">
                        {courts.map((court, index) => (
                            <div key={court.id} className="grid md:grid-cols-12 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-white/5">
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Court Name</label>
                                    <input
                                        type="text"
                                        value={court.name}
                                        onChange={(e) => {
                                            const newCourts = [...courts];
                                            newCourts[index].name = e.target.value;
                                            setCourts(newCourts);
                                        }}
                                        placeholder="e.g. Court A"
                                        className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                    <div className="relative">
                                        <Layout className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                        <select
                                            value={court.category}
                                            onChange={(e) => {
                                                const newCourts = [...courts];
                                                newCourts[index].category = e.target.value;
                                                setCourts(newCourts);
                                            }}
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 appearance-none text-sm"
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
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Hourly Rate (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                        <input
                                            type="number"
                                            value={court.price}
                                            onChange={(e) => {
                                                const newCourts = [...courts];
                                                newCourts[index].price = e.target.value;
                                                setCourts(newCourts);
                                            }}
                                            placeholder="1200"
                                            className="w-full bg-slate-900 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-1 flex justify-end md:mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setCourts(courts.filter(c => c.id !== court.id))}
                                        className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {courts.length === 0 && (
                            <div className="py-8 text-center px-4 text-slate-500 bg-slate-900/50 border border-white/5 border-dashed rounded-xl">
                                <Plus className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                No courts added yet. Click "+ Add Court" above to start building your venue's layout.
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Dynamic Pricing Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-8"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <IndianRupee className="w-5 h-5" />
                        </span>
                        Dynamic Pricing
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 p-6 border border-white/5 rounded-2xl bg-slate-950">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                                Weekend Base Price (₹)
                                <span className="text-[10px] text-amber-500 lowercase normal-case italic">Optional</span>
                            </label>
                            <div className="relative">
                                <IndianRupee className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="number"
                                    value={pricingRules.weekendPrice}
                                    onChange={(e) => setPricingRules({...pricingRules, weekendPrice: e.target.value})}
                                    placeholder="e.g. 1500"
                                    className="w-full bg-slate-900 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                                Peak Hour Price (₹)
                                <span className="text-[10px] text-amber-500 lowercase normal-case italic">Optional</span>
                            </label>
                            <div className="relative">
                                <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="number"
                                    value={pricingRules.peakHourPrice}
                                    onChange={(e) => setPricingRules({...pricingRules, peakHourPrice: e.target.value})}
                                    placeholder="e.g. 1800 (6 PM - 10 PM)"
                                    className="w-full bg-slate-900 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Slots Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Clock className="w-5 h-5" />
                            </span>
                            Operating Time Slots
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => setSelectedSlots(selectedSlots.length === availableTimeSlots.length ? [] : [...availableTimeSlots])}
                            className="text-xs font-bold uppercase tracking-wider text-neon-purple hover:text-white transition-colors"
                        >
                            {selectedSlots.length === availableTimeSlots.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {availableTimeSlots.map((slot) => {
                            const isSelected = selectedSlots.includes(slot);
                            return (
                                <button
                                    type="button"
                                    key={slot}
                                    onClick={() => toggleSlot(slot)}
                                    className={`py-3 rounded-xl border text-sm font-bold transition-all duration-300 ${isSelected 
                                        ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                                        : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Location & Media */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Location Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                                <MapPin className="w-5 h-5" />
                            </span>
                            Location Details
                        </h2>

                        <div className="grid gap-6">
                            <InputGroup label="Address Line">
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Building, Street, Landmark"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                                />
                            </InputGroup>

                            <div className="grid grid-cols-2 gap-6">
                                <InputGroup label="City">
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Mumbai"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                                    />
                                </InputGroup>
                                <InputGroup label="Pincode">
                                    <input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="400001"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                                    />
                                </InputGroup>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5 mt-2">
                                <label className="flex items-center gap-2 text-xs font-black text-neon-blue uppercase tracking-[0.2em] ml-1">
                                    <Locate className="w-3 h-3" />
                                    Pin Point On Map
                                </label>
                                <MapPicker 
                                    onLocationSelect={(coords) => setFormData(prev => ({...prev, coordinates: coords}))}
                                    defaultPos={formData.coordinates}
                                />
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic text-center">
                                    Navigate and click to lock exact GPS coordinates.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Amenities Check */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 border border-white/5 rounded-3xl p-8 h-full"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green">
                                <CheckCircle className="w-5 h-5" />
                            </span>
                            Amenities
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {availableAmenities.map((amenity) => (
                                <AmenityChip
                                    key={amenity.id}
                                    label={amenity.label}
                                    icon={amenity.icon}
                                    selected={amenities.includes(amenity.id)}
                                    onClick={() => toggleAmenity(amenity.id)}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Image Upload */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-8"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                            <ImageIcon className="w-5 h-5" />
                        </span>
                        Gallery
                    </h2>

                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${dragActive
                            ? 'border-neon-purple bg-neon-purple/5 scale-[1.01]'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 shadow-xl pointer-events-none">
                                <Upload className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="pointer-events-none">
                                <p className="text-white font-bold text-lg">Click to Upload or Drag & Drop</p>
                                <p className="text-slate-500 text-sm mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                            <button type="button" className="px-6 py-2 bg-white text-black text-sm font-bold rounded-xl mt-2 hover:bg-slate-200 transition-colors pointer-events-none">
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                            {files.map((file, idx) => (
                                <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-slate-950 aspect-video">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                            className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/partner/turfs')}
                        className="px-8 py-4 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-neon-purple to-fuchsia-600 rounded-xl font-black text-white shadow-lg hover:shadow-neon-purple/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" /> Publish Turf
                    </button>
                </div>
            </form>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
