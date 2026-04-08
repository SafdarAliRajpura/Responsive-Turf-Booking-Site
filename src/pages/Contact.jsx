import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Globe, ArrowRight } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Toast from '../components/ui/Toast';
import apiClient from '../utils/apiClient';

const ContactInfoCard = ({ icon: Icon, title, value, link, delay }) => (
    <motion.a
        href={link}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="flex items-start gap-4 p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-slate-900 hover:border-neon-green/30 transition-all group cursor-pointer"
    >
        <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-neon-green transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{value}</p>
        </div>
    </motion.a>
);

const InputField = ({ label, type = "text", placeholder, name, value, onChange, icon: Icon, textarea = false }) => (
    <div className="space-y-2 group">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-neon-green transition-colors">
            {label}
        </label>
        <div className="relative">
            <div className="absolute top-3.5 left-4 text-slate-500 group-focus-within:text-neon-green transition-colors pointer-events-none">
                <Icon className="w-5 h-5" />
            </div>
            {textarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows="4"
                    placeholder={placeholder}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all resize-none font-medium"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all font-medium"
                />
            )}
        </div>
    </div>
);

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setToast({ message: "Please fill in all required fields.", type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post('/contacts', formData);
            setToast({ message: "Your inquiry has been securely transmitted. Our support executives will connect with you shortly.", type: 'success' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error("Submission Error:", error);
            setToast({ message: "Transmission failed. Please verify your connection or try again momentarily.", type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">
            <Header />

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-bold uppercase tracking-widest"
                        >
                            Get in Touch
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter"
                        >
                            We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-600">Hear From You</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 max-w-2xl mx-auto text-lg"
                        >
                            Have a question about booking, partnership, or just want to say hi? <br className="hidden md:block" /> drop us a message and our team will get back to you.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-emerald-600" />

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <h2 className="text-2xl font-black italic uppercase text-white mb-6">Send a Message</h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Your Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            icon={User}
                                            placeholder="John Doe"
                                        />
                                        <InputField
                                            label="Email Address"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            icon={Mail}
                                            type="email"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <InputField
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        icon={MessageSquare}
                                        placeholder="How can we help?"
                                    />

                                    <InputField
                                        label="Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        icon={Send}
                                        textarea
                                        placeholder="Write your message here..."
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-neon-green text-black font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Contact Info & Map */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid sm:grid-cols-2 gap-6"
                            >
                                <ContactInfoCard
                                    icon={Mail}
                                    title="Email Us"
                                    value="support@turfbooking.com"
                                    link="mailto:support@turfbooking.com"
                                    delay={0.5}
                                />
                                <ContactInfoCard
                                    icon={Phone}
                                    title="Call Us"
                                    value="+91 98765 43210"
                                    link="tel:+919876543210"
                                    delay={0.6}
                                />
                                <ContactInfoCard
                                    icon={MapPin}
                                    title="Visit HQ"
                                    value="123 Sports Complex, Andheri West, Mumbai, 400053"
                                    link="#"
                                    delay={0.7}
                                />
                                <ContactInfoCard
                                    icon={Globe}
                                    title="Socials"
                                    value="@TurfBookingApp"
                                    link="#"
                                    delay={0.8}
                                />
                            </motion.div>

                            {/* Decorative Map Placeholder */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9 }}
                                className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden relative h-64 group"
                            >
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/72.83,19.11,13,0/800x400@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazl5b...')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                                {/* Fallback/Overlay if no real map image */}
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                    <a
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" /> View on Google Maps
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>
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
