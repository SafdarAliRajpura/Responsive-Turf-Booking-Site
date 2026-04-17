import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, FileText, Scale, Lock, RefreshCw, AlertCircle } from 'lucide-react';
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
            <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green group-hover:scale-110 transition-all">
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
            active ? 'bg-white/5 border border-white/10 text-neon-green' : 'text-slate-500 hover:text-white'
        }`}
    >
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        <ArrowRight size={14} className={`transition-transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
    </button>
);

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState('intro');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    const sections = [
        { id: 'intro', title: 'Tactical Introduction', icon: FileText },
        { id: 'booking', title: 'Arena Clearances', icon: Scale },
        { id: 'responsibilities', title: 'Athlete Conduct', icon: AlertCircle },
        { id: 'security', title: 'Intelligence Security', icon: Lock },
        { id: 'liability', title: 'Operational Risk', icon: Shield },
        { id: 'changes', title: 'Protocol Updates', icon: RefreshCw },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">
            <Header />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] opacity-20" />
            </div>

            <main className="relative z-10 pt-32 pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                    
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-72 shrink-0">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">Terms <br/><span className="text-neon-green">Of Service</span></h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Last Sync: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 mb-4">Tactical Sections</p>
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
                        <Section id="intro" title="1. Tactical Introduction" icon={FileText}>
                            <p>Welcome to TurfX, the premium arena scouting and squad coordination network. By accessing our platform through terminal or mobile interface, you agree to comply with these terms of engagement.</p>
                            <p>These protocols govern your interaction with our venue partners and the deployment of athletic services across the platform.</p>
                        </Section>

                        <Section id="booking" title="2. Arena Clearances" icon={Scale}>
                            <p>All venue scouting and booking operations require full financial clearance. Once a slot is initialized, the user assumes responsibility for the tactical deployment of their squad.</p>
                            <p>Cancellations made 24 hours prior to field deployment are eligible for a 100% credit refund. Cancellations within the 24-hour blackout period incur a 50% technical fee.</p>
                        </Section>

                        <Section id="responsibilities" title="3. Athlete Conduct" icon={AlertCircle}>
                            <p>Athletes must adhere to specific arena protocols (proper footwear, start/end precision). High-intensity behavior that results in structural damage will lead to immediate clearance revocation and liability assessment.</p>
                        </Section>

                        <Section id="security" title="4. Intelligence Security" icon={Lock}>
                            <p>Users are solely responsible for the integrity of their Bio Hub credentials. Unauthorized access protocols should be reported immediately to central support for identity lockdown.</p>
                        </Section>

                        <Section id="liability" title="5. Operational Risk" icon={Shield}>
                            <p>TurfX serves as the intelligence facilitator. All field engagements are conducted at the athlete's personal risk. The platform assumes no liability for physical trauma or material loss sustained during arena deployment.</p>
                        </Section>

                        <Section id="changes" title="6. Protocol Updates" icon={RefreshCw}>
                            <p>Operational protocols may be updated without prior visual transmission. Continued engagement with the platform after such updates confirms your acceptance of the new tactical framework.</p>
                        </Section>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
