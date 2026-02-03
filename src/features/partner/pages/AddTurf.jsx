import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Upload, DollarSign, Layout,
    Type, CheckCircle, Image as ImageIcon,
    Dumbbell, Wifi, Car, Coffee, Info, ArrowLeft
} from 'lucide-react';
import Toast from '../../../components/ui/Toast';

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
        category: 'Football (5v5)',
        hourlyRate: '',
        address: '',
        city: '',
        pincode: ''
    });

    const [amenities, setAmenities] = useState([]);
    const [dragActive, setDragActive] = useState(false);

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

    const validateForm = () => {
        if (!formData.turfName.trim()) return "Turf Name is required.";
        if (!formData.description.trim()) return "Description is required.";
        if (formData.description.trim().length < 10) return "Description must be at least 10 characters.";

        if (!formData.hourlyRate) return "Hourly Rate is required.";
        if (Number(formData.hourlyRate) <= 0) return "Hourly Rate must be a positive number.";

        if (!formData.address.trim()) return "Address is required.";
        if (!formData.city.trim()) return "City is required.";

        if (!formData.pincode) return "Pincode is required.";
        if (!/^\d{6}$/.test(formData.pincode)) return "Pincode must be a valid 6-digit number.";

        if (amenities.length === 0) return "Please select at least one amenity.";

        return null; // No errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            setToast({ message: error, type: 'error' });
            return;
        }

        const submissionData = {
            ...formData,
            amenities,
            // In a real app, images would be handled here
        };

        console.log("Turf Registration Data:", submissionData);

        setToast({ message: "Turf created successfully!", type: 'success' });
        setTimeout(() => navigate('/partner/turfs'), 1500);
    };

    const availableAmenities = [
        { id: 'parking', label: 'Parking', icon: Car },
        { id: 'wifi', label: 'Free WiFi', icon: Wifi },
        { id: 'changing_room', label: 'Changing Room', icon: Dumbbell },
        { id: 'canteen', label: 'Cafeteria', icon: Coffee },
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

                        <InputGroup label="category" icon={Layout}>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50 transition-colors appearance-none cursor-pointer"
                            >
                                <option>Football (5v5)</option>
                                <option>Football (7v7)</option>
                                <option>Cricket (Box)</option>
                                <option>Badminton</option>
                                <option>Tennis</option>
                            </select>
                        </InputGroup>

                        <InputGroup label="Hourly Rate (₹)" icon={DollarSign}>
                            <input
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                type="number"
                                placeholder="1200"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                            />
                        </InputGroup>
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
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                            ? 'border-neon-purple bg-neon-purple/5 scale-[1.01]'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrag}
                    >
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 shadow-xl">
                                <Upload className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">Click to Upload or Drag & Drop</p>
                                <p className="text-slate-500 text-sm mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                            <button type="button" className="px-6 py-2 bg-white text-black text-sm font-bold rounded-xl mt-2 hover:bg-slate-200 transition-colors">
                                Browse Files
                            </button>
                        </div>
                    </div>
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
