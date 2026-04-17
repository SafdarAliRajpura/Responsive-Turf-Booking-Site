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
                { name: "Community", path: "/community" },
                { name: "Partner with Us", path: "/partner/register" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", path: "/help-center" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Contact Us", path: "/contact" }
            ]
        }
    ];

    return (
        <footer className="relative bg-slate-950 pt-20 pb-10 overflow-hidden border-t border-white/5">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">


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
