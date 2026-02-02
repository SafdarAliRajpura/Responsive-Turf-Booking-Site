import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-slate-400 space-y-4 leading-relaxed text-sm">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Header />
            <main className="pt-24 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Privacy Policy</h1>
                    <p className="text-slate-500 mb-12">Last updated: October 24, 2024</p>

                    <div className="prose prose-invert max-w-none">
                        <Section title="1. Information We Collect">
                            <p>We collect information you provide directly to us, such as your name, email address, phone number, and payment information when you register or make a booking.</p>
                        </Section>

                        <Section title="2. How We Use Your Information">
                            <p>We use your data to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Process bookings and payments.</li>
                                <li>Communicate with you regarding your reservations.</li>
                                <li>Send you promotional offers (which you can opt-out of).</li>
                                <li>Improve platform security and functionality.</li>
                            </ul>
                        </Section>

                        <Section title="3. Data Sharing">
                            <p>Your name and contact details are shared with the Venue Partner solely for the purpose of managing your booking. We do not sell your personal data to third parties.</p>
                        </Section>

                        <Section title="4. Cookies">
                            <p>We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.</p>
                        </Section>

                        <Section title="5. Data Security">
                            <p>We implement strict security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
                        </Section>

                        <Section title="6. Contact Us">
                            <p>If you have questions about this policy, please contact us at privacy@turfx.com.</p>
                        </Section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
