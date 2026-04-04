import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CreditCard, ArrowRight, ArrowLeft, Mail, Phone, FileText, CheckCircle, Upload, Banknote, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Toast from '../../../components/ui/Toast';

const InputGroup = ({ icon: Icon, placeholder, value, onChange, type = "text", focused, setFocused, name }) => (
    <div className="group relative">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focused === name ? 'text-neon-blue' : 'text-slate-500'}`}>
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onFocus={() => setFocused(name)}
            onBlur={() => setFocused(null)}
            onChange={onChange}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all durations-300 group-hover:bg-slate-950 text-sm"
        />
    </div>
);

export default function PartnerOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [focused, setFocused] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    
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

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const b64 = await getBase64(e.target.files[0]);
                setBrandLogo(b64);
            } catch(e) {
                setToast({ message: "Error parsing image", type: 'error'});
            }
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
             try {
                const b64 = await getBase64(e.dataTransfer.files[0]);
                setBrandLogo(b64);
            } catch(e) {
                setToast({ message: "Error parsing image", type: 'error'});
            }
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!data.businessName || !data.supportEmail || !data.supportPhone) {
                return setToast({ message: 'Please fill all fields in this step.', type: 'error' });
            }
            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.supportEmail)) {
                return setToast({ message: 'Valid support email is required.', type: 'error' });
            }
        }
        if (step === 2) {
            if (!data.gstNumber) {
                return setToast({ message: 'GST / Business Reg Number is required.', type: 'error' });
            }
        }
        setStep(p => p + 1);
    };

    const prevStep = () => setStep(p => p - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!data.accountHolderName || !data.accountNumber || !data.ifscCode || !data.upiId) {
             return setToast({ message: 'All financial fields are required.', type: 'error' });
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/onboard', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    ...data,
                    brandLogo: brandLogo || 'default-logo.png'
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setToast({ message: 'Setup complete! Triggering dashboard layout...', type: 'success' });
                const user = JSON.parse(localStorage.getItem('user'));
                user.isOnboarded = true;
                user.businessName = data.businessName;
                localStorage.setItem('user', JSON.stringify(user));

                // Fake confetti delay
                setTimeout(() => {
                    navigate('/partner/dashboard');
                }, 1500);
            } else {
                setToast({ message: result.message || 'Setup Failed', type: 'error' });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Onboarding Error:", error);
            setToast({ message: 'Failed to connect to server.', type: 'error' });
            setIsLoading(false);
        }
    };

    const steps = [
        { num: 1, title: 'Profile', desc: 'Basic info' },
        { num: 2, title: 'Verification', desc: 'Secure KYC' },
        { num: 3, title: 'Payouts', desc: 'Get paid' }
    ];

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-neon-blue selection:text-black flex items-center justify-center p-4">
            
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                
                {/* Header & Stepper */}
                <div className="mb-8 text-center sm:text-left sm:flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">COMPLETE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">VENUE SETUP</span></h1>
                        <p className="text-slate-400 text-sm font-medium">Just a few steps to unlock your partner dashboard.</p>
                    </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    
                    {/* Stepper Header */}
                    <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-slate-900/40">
                        {steps.map((s, idx) => (
                            <div key={s.num} className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 shadow-lg ${step >= s.num ? 'bg-gradient-to-tr from-neon-blue to-neon-purple text-white shadow-neon-blue/20' : 'bg-slate-800 text-slate-500 border border-white/10 shadow-none'}`}>
                                    {step > s.num ? <CheckCircle className="w-5 h-5 text-white" /> : s.num}
                                </div>
                                <div className="hidden sm:block">
                                    <p className={`text-sm font-bold ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>{s.title}</p>
                                    <p className={`text-[10px] uppercase tracking-wider ${step >= s.num ? 'text-neon-blue' : 'text-slate-600'}`}>{s.desc}</p>
                                </div>
                                {idx < steps.length - 1 && <div className={`hidden sm:block w-8 h-px mx-4 ${step > s.num ? 'bg-neon-blue' : 'bg-slate-800'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Form Area */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Profile */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-neon-blue" />
                                            Business Profile
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <InputGroup icon={Building2} name="businessName" placeholder="Registered Business Name" value={data.businessName} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            </div>
                                            <InputGroup icon={Mail} name="supportEmail" placeholder="Support Email Address" type="email" value={data.supportEmail} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            <InputGroup icon={Phone} name="supportPhone" placeholder="Customer Support Phone" type="tel" value={data.supportPhone} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end pt-4">
                                        <button type="button" onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                                            Next Step <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: KYC */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-neon-purple" />
                                            Verification & Branding
                                        </h2>
                                        
                                        <InputGroup icon={FileText} name="gstNumber" placeholder="GST Number / Registered ID" value={data.gstNumber} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                        
                                        <div className="mt-6">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 pl-1">Brand Logo (Optional)</label>
                                            <div 
                                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${dragActive ? 'border-neon-purple bg-neon-purple/5' : 'border-white/10 hover:border-white/20'}`}
                                                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                                                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                                {brandLogo ? (
                                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-800">
                                                        <img src={brandLogo} alt="Logo" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                                            <Upload className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <p className="text-sm font-bold">Drag & Drop your logo</p>
                                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between pt-4">
                                        <button type="button" onClick={prevStep} className="px-6 py-3 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button type="button" onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                                            Next Step <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Payouts */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Banknote className="w-5 h-5 text-emerald-400" />
                                            Payout Setup
                                        </h2>
                                        
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <InputGroup icon={Banknote} name="accountHolderName" placeholder="Account Holder Name" value={data.accountHolderName} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            </div>
                                            <InputGroup icon={Banknote} name="accountNumber" placeholder="Account Number" type="password" value={data.accountNumber} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            <InputGroup icon={Banknote} name="ifscCode" placeholder="IFSC Code" value={data.ifscCode} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            <div className="sm:col-span-2">
                                                <InputGroup icon={CreditCard} name="upiId" placeholder="UPI ID (e.g. business@ybl)" value={data.upiId} onChange={handleChange} focused={focused} setFocused={setFocused} />
                                            </div>
                                        </div>
                                    
                                        <div className="flex justify-between pt-8">
                                            <button type="button" onClick={prevStep} className="px-6 py-3 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold">
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                            <button type="submit" disabled={isLoading} className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all flex items-center gap-2 disabled:opacity-50">
                                                {isLoading ? 'Processing...' : 'Complete Registration'} {!isLoading && <CheckCircle className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
