import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, CreditCard, ArrowRight, ArrowLeft, 
    Mail, Phone, FileText, CheckCircle, Upload, 
    Banknote, ShieldCheck, Zap, Globe, MousePointer2, AlertCircle, User as UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Toast from '../../../components/ui/Toast';

const InputGroup = ({ icon: Icon, placeholder, value, onChange, type = "text", focused, setFocused, name }) => (
    <div className="group relative">
        <label className={`absolute -top-2.5 left-4 px-2 bg-slate-900 text-[9px] font-black uppercase tracking-[0.2em] z-10 transition-all duration-300 ${focused === name ? 'text-neon-blue opacity-100' : 'text-slate-500 opacity-0'}`}>
            {placeholder}
        </label>
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === name ? 'text-neon-blue' : 'text-slate-500'}`}>
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            name={name}
            placeholder={focused === name ? "" : placeholder}
            value={value}
            onFocus={() => setFocused(name)}
            onBlur={() => setFocused(null)}
            onChange={onChange}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/30 focus:bg-slate-950 transition-all duration-500 group-hover:border-white/10 text-sm font-medium"
        />
    </div>
);

const PayoutOption = ({ id, icon: Icon, title, desc, active, onClick }) => (
    <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(id)}
        className={`relative p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 flex flex-col items-center text-center gap-4 ${
            active ? 'border-neon-green bg-neon-green/5 shadow-[0_0_30px_rgba(57,255,20,0.1)]' : 'border-white/5 bg-white/5 hover:border-white/10'
        }`}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-neon-green text-black' : 'bg-white/5 text-slate-500'}`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <h4 className={`text-sm font-black uppercase tracking-tighter ${active ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight mt-1">{desc}</p>
        </div>
        {active && (
            <div className="absolute top-4 right-4 text-neon-green">
                <CheckCircle className="w-5 h-5" />
            </div>
        )}
    </motion.div>
);

export default function PartnerOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [focused, setFocused] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [payoutMethod, setPayoutMethod] = useState('upi');
    
    // Form Data
    const [data, setData] = useState({
        businessName: '',
        supportEmail: '',
        supportPhone: '',
        gstNumber: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
    });

    const [brandLogo, setBrandLogo] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleAutoFill = () => {
        setData({
            ...data,
            accountHolderName: 'TEST PARTNER ACCOUNT',
            accountNumber: '999912345678',
            ifscCode: 'TEST0000123',
            upiId: 'testpartner@upi'
        });
        setToast({ message: "Test Credentials Synchronized", type: 'info' });
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => setBrandLogo(reader.result);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.dataTransfer.files[0]);
            reader.onload = () => setBrandLogo(reader.result);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!data.businessName || !data.supportEmail)) {
            return setToast({ message: 'Vital stats missing. Please complete primary profile.', type: 'error' });
        }
        if (step === 2 && !data.gstNumber) {
            return setToast({ message: 'Identity verification ID required.', type: 'error' });
        }
        setStep(p => p + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/auth/onboard', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ ...data, brandLogo: brandLogo || '' })
                });

                const result = await response.json();
                if (result.success) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    user.isOnboarded = true;
                    user.businessName = data.businessName;
                    user.user_profile = brandLogo; // Sync Brand Logo to Profile
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/partner/dashboard');
                }
            } catch (err) {
                setToast({ message: 'Network Breach Detected. System retry initiated.', type: 'error' });
                setIsLoading(false);
            }
        }, 1200);
    };

    const steps = [
        { num: 1, title: 'Identity', color: 'from-neon-blue to-indigo-600' },
        { num: 2, title: 'Branding', color: 'from-neon-purple to-fuchsia-600' },
        { num: 3, title: 'Capital', color: 'from-neon-green to-emerald-600' }
    ];

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans overflow-hidden flex items-center justify-center p-4">
            
            {/* Dynamic Mesh Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[150px] transition-all duration-1000 ${step === 1 ? 'bg-neon-blue/10 scale-100' : 'bg-neon-purple/5 scale-110'}`} />
                <div className={`absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full blur-[150px] transition-all duration-1000 ${step === 3 ? 'bg-neon-green/10 opacity-100' : 'bg-neon-blue/5 opacity-50'}`} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                
                {/* Brand Logo & Title */}
                <div className="text-center mb-10">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 group cursor-default">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">Tactical Onboarding Protocol</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 leading-none">
                        Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green">Partner Activation</span>
                    </h1>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            className={`h-full bg-gradient-to-r ${steps[step-1].color}`}
                        />
                    </div>
                    
                    {/* Minimalist Stepper */}
                    <div className="flex justify-center gap-12 py-8 border-b border-white/5 bg-slate-950/20">
                        {steps.map((s) => (
                            <div key={s.num} className="flex flex-col items-center gap-2">
                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step >= s.num ? `bg-white shadow-[0_0_15px_#fff]` : 'bg-slate-800'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.num ? 'text-white' : 'text-slate-600'}`}>{s.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-10 md:p-14">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: IDENTITY */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue border border-neon-blue/20">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black uppercase italic tracking-tight">Business Intel</h2>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Initialize your presence</p>
                                            </div>
                                        </div>
                                        <InputGroup icon={Globe} name="businessName" placeholder="Corporate Entity Name" value={data.businessName} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <InputGroup icon={Mail} name="supportEmail" placeholder="Operation Email" type="email" value={data.supportEmail} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            <InputGroup icon={Phone} name="supportPhone" placeholder="Quick Response Line" type="tel" value={data.supportPhone} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                        </div>
                                    </div>
                                    <button onClick={nextStep} className="w-full py-5 bg-white text-black font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:bg-neon-blue transition-all group shadow-xl">
                                        Secure Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: BRANDING */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black uppercase italic tracking-tight">Verification Hub</h2>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Security & Brand Presence</p>
                                            </div>
                                        </div>
                                        <InputGroup icon={FileText} name="gstNumber" placeholder="Tax Registration / GSTIN" value={data.gstNumber} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                        
                                        <div 
                                            className={`relative group border-2 border-dashed rounded-[2.5rem] p-10 text-center transition-all ${dragActive ? 'border-neon-purple bg-neon-purple/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                                            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                                            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                            {brandLogo ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-500">
                                                        <img src={brandLogo} alt="Logo" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-neon-purple">Brand Image Synchronized</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-neon-purple group-hover:text-black transition-all">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <h3 className="text-sm font-black uppercase italic mb-1">Upload Brand Icon</h3>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Drag & Drop visual asset here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-500 hover:text-white">Back</button>
                                        <button onClick={nextStep} className="flex-1 py-5 bg-white text-black font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:bg-neon-purple transition-all group shadow-xl">Complete Branding <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: CAPITAL/PAYOUTS */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black uppercase italic tracking-tight">Capital Forge</h2>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Financial Settlement Protocol</p>
                                                </div>
                                            </div>
                                            <button onClick={handleAutoFill} className="flex items-center gap-2 px-4 py-2 bg-neon-blue/10 border border-neon-blue/20 rounded-xl text-neon-blue text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-all">
                                                <MousePointer2 className="w-3 h-3" /> Auto-Sync Test Credentials
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <PayoutOption id="upi" icon={Zap} title="Rapid UPI" desc="Instant 90% Settlements" active={payoutMethod === 'upi'} onClick={setPayoutMethod} />
                                            <PayoutOption id="bank" icon={Banknote} title="Elite Bank" desc="Direct NEFT/RTGS Transfer" active={payoutMethod === 'bank'} onClick={setPayoutMethod} />
                                        </div>

                                        <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 space-y-6 relative overflow-hidden">
                                            <AlertCircle className="absolute -right-4 -top-4 w-32 h-32 text-white/5 pointer-events-none" />
                                            <InputGroup icon={UserIcon} name="accountHolderName" placeholder="Beneficiary Account Name" value={data.accountHolderName} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <InputGroup icon={payoutMethod === 'upi' ? MousePointer2 : CreditCard} name={payoutMethod === 'upi' ? "upiId" : "accountNumber"} placeholder={payoutMethod === 'upi' ? "VPA / UPI ID" : "Bank Account Number"} value={payoutMethod === 'upi' ? data.upiId : data.accountNumber} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                                {payoutMethod === 'bank' && <InputGroup icon={Building2} name="ifscCode" placeholder="Branch IFSC Code" value={data.ifscCode} onChange={handleChange} focused={focused} setFocused={setFocused} />}
                                                {payoutMethod === 'upi' && <div className="hidden sm:block" />}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(2)} className="px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-500 hover:text-white">Back</button>
                                        <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green text-black font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:scale-[1.02] transition-all group shadow-xl">
                                            {isLoading ? 'Activating Matrix...' : 'Activate Partner Dashboard'} <Zap className="w-5 h-5 fill-current" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: null })} />
        </div>
    );
}
