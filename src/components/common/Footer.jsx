import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Instagram, Twitter, Linkedin, Github, Send, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, href: "#", color: "hover:text-sky-400" },
        { icon: Instagram, href: "#", color: "hover:text-pink-500" },
        { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
        { icon: Github, href: "#", color: "hover:text-white" },
    ];

    const footerLinks = [
        {
            title: "Platform",
            links: [
                { name: "Home", path: "/home" },
                { name: "Venues", path: "/venues" },
                { name: "Tournaments", path: "/tournaments" },
                { name: "Community", path: "#" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", path: "#" },
                { name: "Terms of Service", path: "#" },
                { name: "Privacy Policy", path: "#" },
                { name: "Contact Us", path: "#" }
            ]
        }
    ];

    return (
        <footer className="relative bg-slate-950 pt-20 pb-10 overflow-hidden border-t border-white/5">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Newsletter Section */}
                <div className="mb-20">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 md:flex items-center justify-between gap-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 md:w-1/2">
                            <h3 className="text-3xl font-black text-white mb-2 uppercase italic">Stay Ahead of the Game</h3>
                            <p className="text-slate-400">Join our newsletter for exclusive discounts, tournament updates, and pro tips.</p>
                        </div>

                        <div className="relative z-10 mt-6 md:mt-0 md:w-1/2">
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email..."
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all"
                                />
                                <button className="bg-neon-green text-black p-4 rounded-xl hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                                    <Send className="w-5 h-5 -ml-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/home')}>
                            <div className="w-10 h-10 bg-gradient-to-tr from-neon-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-neon-green/20">
                                <Zap className="w-6 h-6 text-black fill-current" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">
                                TURF<span className="text-neon-green">X</span>
                            </span>
                        </div>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            The ultimate ecosystem for sports enthusiasts. Book, play, compete, and conquer.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    whileHover={{ y: -3 }}
                                    className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 transition-colors ${social.color}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column, idx) => (
                        <div key={idx} className="lg:col-span-1">
                            <h4 className="text-white font-bold uppercase tracking-wider mb-6">{column.title}</h4>
                            <ul className="space-y-4">
                                {column.links.map((link, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => link.path.startsWith('/') ? navigate(link.path) : null}
                                            className="text-slate-400 hover:text-neon-green transition-colors text-sm font-medium flex items-center gap-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-neon-green transition-colors" />
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact/Map Column */}
                    <div className="lg:col-span-1">
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Contact</h4>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                                </div>
                                <p className="text-slate-400 text-sm">
                                    123 Sports Avenue, <br />
                                    Tech City, TC 90210
                                </p>
                            </div>
                            <div className="h-px bg-white/5" />
                            <p className="text-slate-400 text-sm">support@turfx.com</p>
                            <p className="text-neon-green font-bold">+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} TurfX Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-neon-pink fill-current mx-1 animate-pulse" />
                        <span>for players everywhere.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
