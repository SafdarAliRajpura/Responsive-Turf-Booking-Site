import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Database, Share2, Cookie, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Section = ({ id, title, icon: Icon, children }) => (
    <motion.section 
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 scroll-mt-32"
    >
        <div className="flex items-center gap-4 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-all">
                <Icon size={18} />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{title}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
        </div>
        <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 text-slate-400 leading-relaxed text-sm font-medium space-y-4 hover:border-white/10 transition-all">
            {children}
        </div>
    </motion.section>
);

const NavItem = ({ sectionId, title, active, onClick }) => (
    <button 
        onClick={() => onClick(sectionId)}
        className={`w-full flex items-center justify-between group py-3 px-4 rounded-xl transition-all ${
            active ? 'bg-white/5 border border-white/10 text-neon-blue' : 'text-slate-500 hover:text-white'
        }`}
    >
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        <ArrowRight size={14} className={`transition-transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
    </button>
);

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState('collect');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    const sections = [
        { id: 'collect', title: 'Data Scouting', icon: Eye },
        { id: 'usage', title: 'Operational Usage', icon: Database },
        { id: 'sharing', title: 'Strategic Sharing', icon: Share2 },
        { id: 'cookies', title: 'Cookie Intel', icon: Cookie },
        { id: 'security', title: 'Vault Security', icon: ShieldCheck },
        { id: 'contact', title: 'Command Contact', icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-blue selection:text-black">
            <Header />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px] opacity-20" />
            </div>

            <main className="relative z-10 pt-32 pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                    
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-72 shrink-0">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none text-neon-blue">Privacy <br/><span className="text-white">Protocol</span></h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Last Sync: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 mb-4">Encryption Sections</p>
                                {sections.map(s => (
                                    <NavItem 
                                        key={s.id}
                                        sectionId={s.id}
                                        title={s.title}
                                        active={activeSection === s.id}
                                        onClick={scrollToSection}
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Content Ledger */}
                    <div className="flex-1 max-w-3xl">
                        <Section id="collect" title="1. Data Scouting" icon={Eye}>
                            <p>We collect essential athlete intelligence provided directly during HQ registration. This includes first/last name, tactical contact (email/phone), and payment clearance details for arena bookings.</p>
                            <p>We also monitor device-level telemetry to optimize your terminal's performance during high-intensity sessions.</p>
                        </Section>

                        <Section id="usage" title="2. Operational Usage" icon={Database}>
                            <p>Your intelligence data is utilized to:</p>
                            <ul className="list-none space-y-3 pl-4">
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-neon-blue" /> Process booking authorizations and clearances.</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-neon-blue" /> Synchronize squad notifications and tournament alerts.</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-neon-blue" /> Transmission of platform security patches and updates.</li>
                            </ul>
                        </Section>

                        <Section id="sharing" title="3. Strategic Sharing" icon={Share2}>
                            <p>Athlete credentials (name/contact) are only shared with the specific Arena Partner where a slot has been initialized. We do not transmit your data to external mercenary networks or unverified advertisers.</p>
                        </Section>

                        <Section id="cookies" title="4. Cookie Intel" icon={Cookie}>
                            <p>We use session-layer cookies to maintain your login persistence and cache tactical field data for faster rendering. You can block these cookies through your terminal settings, but it may impact real-time responsiveness.</p>
                        </Section>

                        <Section id="security" title="5. Vault Security" icon={ShieldCheck}>
                            <p>All athlete intelligence is stored behind multi-layered encryption protocols. Our data vaults are monitored 24/7 to prevent unauthorized scouting or credential theft.</p>
                        </Section>

                        <Section id="contact" title="6. Command Contact" icon={Mail}>
                            <p>For inquiries regarding your data footprint or to request identity deletion, contact our Privacy Command at <span className="text-neon-blue">privacy@turfx.com</span>.</p>
                        </Section>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
