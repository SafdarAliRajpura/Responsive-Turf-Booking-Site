import React, { useState } from 'react';
import { Save, Lock, Bell, Store, Globe } from 'lucide-react';
import userAvatar from '../../../assets/images/common/avatar-1.jpg'; // Placeholder

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-neon-purple">
                <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {children}
    </div>
);

const InputGroup = ({ label, type = "text", defaultValue, placeholder }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all font-medium"
        />
    </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4">
        <div>
            <p className="text-white font-bold text-sm">{label}</p>
            <p className="text-slate-500 text-xs mt-0.5">{description}</p>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-neon-purple' : 'bg-slate-700'}`}
        >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
);

export default function Settings() {
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        promo: true
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">SETTINGS</h1>
                    <p className="text-slate-400">Manage your profile and preferences.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-neon-green transition-colors shadow-lg hover:shadow-neon-green/20">
                    <Save className="w-5 h-5" /> Save Changes
                </button>
            </div>

            <Section title="Business Profile" icon={Store}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="text-center md:text-left">
                        <div className="relative group inline-block">
                            <img src={userAvatar} alt="Profile" className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-800" />
                            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm">
                                Change Photo
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full grid md:grid-cols-2 gap-6">
                        <InputGroup label="Business Name" defaultValue="Neon Sports Arena" />
                        <InputGroup label="Owner Name" defaultValue="John Doe" />
                        <InputGroup label="Contact Email" type="email" defaultValue="admin@neonarena.com" />
                        <InputGroup label="Phone Number" type="tel" defaultValue="+91 98765 43210" />
                        <div className="md:col-span-2">
                            <InputGroup label="Website / Social Link" icon={Globe} placeholder="https://instagram.com/neonsports" />
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Notifications" icon={Bell}>
                <div className="space-y-2 divide-y divide-white/5">
                    <Toggle
                        label="Email Notifications"
                        description="Receive booking confirmations via email."
                        checked={notifications.email}
                        onChange={(v) => setNotifications({ ...notifications, email: v })}
                    />
                    <Toggle
                        label="SMS Integration"
                        description="Get instant alerts on your mobile device."
                        checked={notifications.sms}
                        onChange={(v) => setNotifications({ ...notifications, sms: v })}
                    />
                    <Toggle
                        label="Marketing Tips"
                        description="Receive tips to grow your turf business."
                        checked={notifications.promo}
                        onChange={(v) => setNotifications({ ...notifications, promo: v })}
                    />
                </div>
            </Section>

            <Section title="Security" icon={Lock}>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                    <InputGroup label="New Password" type="password" placeholder="••••••••" />
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-sm">Two-Factor Authentication</p>
                        <p className="text-slate-500 text-xs mt-0.5">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 border border-neon-purple text-neon-purple rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neon-purple hover:text-white transition-colors">
                        Enable 2FA
                    </button>
                </div>
            </Section>
        </div>
    );
}
