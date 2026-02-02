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

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Header />
            <main className="pt-24 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Terms of Service</h1>
                    <p className="text-slate-500 mb-12">Last updated: October 24, 2024</p>

                    <div className="prose prose-invert max-w-none">
                        <Section title="1. Introduction">
                            <p>Welcome to TurfX. By accessing our platform, you agree to comply with these Terms of Service. Please read them carefully before using our services.</p>
                        </Section>

                        <Section title="2. Booking and Cancellations">
                            <p>Users can book sports venues through our platform. Full payment is required to confirm a booking.</p>
                            <p>Cancellations made 24 hours prior to the slot time are eligible for a full refund. Cancellations made within 24 hours will incur a 50% fee. No-shows are non-refundable.</p>
                        </Section>

                        <Section title="3. User Responsibilities">
                            <p>You agree to use the facilities responsibly and adhere to the specific rules of each venue (e.g., proper footwear, no smoking). Damages caused to venue property during your slot will be your liability.</p>
                        </Section>

                        <Section title="4. Account Security">
                            <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility.</p>
                        </Section>

                        <Section title="5. Limitation of Liability">
                            <p>TurfX is a facilitator. We are not liable for any injuries, accidents, or theft that occur at the partner venues. Users engage in sports activities at their own risk.</p>
                        </Section>

                        <Section title="6. Changes to Terms">
                            <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                        </Section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
