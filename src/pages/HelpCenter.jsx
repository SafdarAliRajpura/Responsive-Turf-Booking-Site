import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, Book, MessageCircle, FileText } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FaqItem = ({ question, answer, isOpen, onClick }) => (
    <div className={`border rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl ${
        isOpen ? 'border-neon-green/30 bg-slate-900/80 shadow-neon-green/5' : 'border-white/5 bg-slate-900/30'
    }`}>
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-7 text-left group"
        >
            <span className={`font-black italic uppercase text-sm tracking-tighter transition-colors ${isOpen ? 'text-neon-green' : 'text-slate-300 group-hover:text-white'}`}>
                {question}
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-neon-green text-black rotate-180' : 'bg-white/5 text-slate-500'}`}>
                <ChevronDown size={14} />
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className="px-7 pb-8 text-slate-400 text-sm leading-relaxed font-medium border-t border-white/5 pt-4 mx-7">
                        {answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const TacticalCard = ({ icon: Icon, title, description, colorClass }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all cursor-pointer group overflow-hidden"
    >
        <div className={`absolute -top-12 -right-12 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`} />
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-all border border-white/5`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-white font-black italic uppercase text-lg mb-3 tracking-tighter">{title}</h3>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">{description}</p>
    </motion.div>
);

export default function HelpCenter() {
    const [openIndex, setOpenIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            question: "How do I book a turf?",
            answer: "Booking a turf is simple! Navigate to the 'Venues' page, select your preferred turf, choose a date and time slot, and proceed to payment. You'll receive a confirmation instantly."
        },
        {
            question: "What is the cancellation policy?",
            answer: "You can cancel your booking up to 24 hours before the scheduled time for a full refund. Cancellations made within 24 hours may be subject to a 50% cancellation fee."
        },
        {
            question: "Can I register for tournaments individually?",
            answer: "Most tournaments require a full team to register. However, some casual tournaments allow individual registration where we'll place you in a team. Check the specific tournament details for more info."
        },
        {
            question: "How do I become a partner?",
            answer: "Click on the 'Partner with Us' link in the footer or navigation menu. Fill out the registration form with your business details, and our team will verify your venue within 48 hours."
        },
        {
            question: "Is my payment information secure?",
            answer: "Absolutely. We use industry-standard encryption and trusted payment gateways to ensure your financial data is always protected."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-green selection:text-black">
            <Header />

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Premium Hero */}
                    <div className="text-center mb-20 relative">
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-full bg-neon-green/20 blur-[150px] opacity-20 pointer-events-none" />
                        
                        <motion.span 
                            initial={{ opacity: 0, tracking: '0.5em' }}
                            animate={{ opacity: 1, tracking: '0.3em' }}
                            className="text-neon-green text-[10px] font-black uppercase mb-4 block"
                        >
                            Arena Intelligence Terminal
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8"
                        >
                            HOW CAN WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">HELP YOU?</span>
                        </motion.h1>

                        {/* Search Matrix */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <input
                                type="text"
                                placeholder="Search field intel, policies, and squad rules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl py-6 pl-14 pr-6 text-white focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_50px_rgba(57,255,20,0.1)] transition-all font-black uppercase text-xs tracking-widest placeholder:text-slate-600"
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neon-green w-5 h-5 pointer-events-none" />
                        </motion.div>
                    </div>

                    {/* Quick Deployment Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid md:grid-cols-3 gap-6 mb-24"
                    >
                        <TacticalCard icon={Book} title="Booking Guide" description="Master the arena scouting and slot deployment protocols." colorClass="bg-neon-green" />
                        <TacticalCard icon={FileText} title="Payments" description="Financial clearancce, refunds, and tactical billing intel." colorClass="bg-neon-blue" />
                        <TacticalCard icon={MessageCircle} title="Live Comm" description="Rules of engagement for tournaments and live discussions." colorClass="bg-purple-500" />
                    </motion.div>

                    {/* Central FAQ Ledger */}
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black italic uppercase italic flex items-center gap-4">
                                <HelpCircle className="text-neon-green w-8 h-8" /> FAQ <span className="text-slate-600">LEDGER</span>
                            </h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-white/5 to-transparent ml-8" />
                        </div>

                        <div className="space-y-4 min-h-[400px]">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                >
                                    <FaqItem
                                        question={faq.question}
                                        answer={faq.answer}
                                        isOpen={openIndex === index}
                                        onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 border border-dashed border-white/5 rounded-[2rem]"
                            >
                                <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">No Tactical Intel Found for "{searchQuery}"</p>
                            </motion.div>
                        )}
                        </div>
                    </div>

                    {/* Engagement Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-32 p-12 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-[3rem] text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-neon-green/5 blur-[80px] -z-10" />
                        <h2 className="text-4xl font-black italic uppercase italic mb-4">Still in the <span className="text-neon-green">Dark?</span></h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-10 max-w-md mx-auto leading-loose">
                            Connect with our tactical support squad for immediate field clearance and dispute resolution.
                        </p>
                        <button 
                            onClick={() => window.location.href = '/contact'}
                            className="px-10 py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-neon-green transition-all shadow-xl shadow-white/5"
                        >
                            Initialize Support Link
                        </button>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
