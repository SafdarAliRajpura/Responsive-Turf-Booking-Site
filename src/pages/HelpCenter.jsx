import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, Book, MessageCircle, FileText } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FaqItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-slate-900/50 hover:bg-slate-900 transition-colors">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-6 text-left"
        >
            <span className="font-bold text-white text-lg">{question}</span>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-neon-green' : ''}`} />
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                        {answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const CategoryCard = ({ icon: Icon, title, description }) => (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-neon-green/30 hover:bg-slate-800 transition-all cursor-pointer group">
        <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
    </div>
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

                    {/* Hero */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6"
                        >
                            How can we <span className="text-neon-green">Help You?</span>
                        </motion.h1>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative max-w-xl mx-auto"
                        >
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all font-medium"
                            />
                            <Search className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                        </motion.div>
                    </div>

                    {/* Quick Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid md:grid-cols-3 gap-6 mb-16"
                    >
                        <CategoryCard icon={Book} title="Booking Guide" description="Learn how to find and book the best venues." />
                        <CategoryCard icon={FileText} title="Payments & Refunds" description="Understand our billing and cancellation policies." />
                        <CategoryCard icon={MessageCircle} title="Community Guidelines" description="Rules for tournaments and fair play." />
                    </motion.div>

                    {/* FAQs */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <HelpCircle className="text-neon-green" /> Frequently Asked Questions
                        </h2>

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
                            <div className="text-center text-slate-500 py-12">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
