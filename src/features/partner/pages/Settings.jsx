import React, { useState, useEffect } from 'react';
import { Save, Lock, Store, Camera, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../../utils/apiClient';
import userAvatar from '../../../assets/images/common/avatar-1.jpg';
import Toast from '../../../components/ui/Toast';

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

const InputGroup = ({ label, type = "text", value, onChange, placeholder, name, isPassword, showPassword, onTogglePassword }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative">
            <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all font-medium ${isPassword ? 'pr-10' : ''}`}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            )}
        </div>
    </div>
);

export default function Settings() {
    const [toast, setToast] = useState({ message: null, type: 'info' });

    const showNotification = (message, type) => setToast({ message, type });

    const [profile, setProfile] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        mobileNumber: '',
        user_profile: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await apiClient.get('/auth/me');
                if (res.data.success && res.data.data) {
                    const user = res.data.data;
                    setProfile({
                        businessName: user.businessName || '',
                        ownerName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                        email: user.email || '',
                        mobileNumber: user.mobileNumber || '',
                        user_profile: user.user_profile || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        if (!profile.email || !profile.ownerName) {
            showNotification('Owner Name and Email are required.', 'error');
            return;
        }

        const nameParts = profile.ownerName.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ');

        const payload = {
            businessName: profile.businessName,
            first_name,
            last_name,
            email: profile.email,
            mobileNumber: profile.mobileNumber,
            user_profile: profile.user_profile
        };

        try {
            const res = await apiClient.put('/auth/profile', payload);
            if (res.data.success) {
                showNotification('Profile updated successfully!', 'success');
                localStorage.setItem('user', JSON.stringify(res.data.data));
            } else {
                showNotification(res.data.message || 'Failed to update profile.', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification(error.response?.data?.message || 'Server error updating profile.', 'error');
        }
    };

    const handleSavePassword = async () => {
        if (!passwords.currentPassword) {
            showNotification('You must enter your current password.', 'error');
            return;
        }
        if (!passwords.newPassword || passwords.newPassword.length < 6) {
            showNotification('New password must be at least 6 characters.', 'error');
            return;
        }

        try {
            const res = await apiClient.put('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (res.data.success) {
                showNotification('Password changed successfully!', 'success');
                setPasswords({ currentPassword: '', newPassword: '' });
                setShowCurrentPassword(false);
                setShowNewPassword(false);
            } else {
                showNotification(res.data.message || 'Failed to change password.', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification(error.response?.data?.message || 'Server error changing password.', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">SETTINGS</h1>
                    <p className="text-slate-400">Manage your profile and security parameters.</p>
                </div>
                <button 
                    onClick={handleSaveProfile}
                    className="flex shrink-0 items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-neon-green transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                >
                    <Save className="w-5 h-5" /> Save Profile
                </button>
            </div>

            <Section title="Business Profile" icon={Store}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="text-center md:text-left flex-shrink-0">
                        <div className="relative group inline-block">
                            <img src={profile.user_profile || userAvatar} alt="Profile" className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-800 bg-slate-900" />
                            <label className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm gap-2">
                                <Camera className="w-6 h-6" />
                                <span>Change Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProfile(p => ({...p, user_profile: reader.result}));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                    </div>
                    <div className="flex-1 w-full grid md:grid-cols-2 gap-6">
                        <InputGroup label="Business Name" name="businessName" value={profile.businessName} onChange={handleProfileChange} placeholder="e.g. Neon Arena" />
                        <InputGroup label="Owner Name" name="ownerName" value={profile.ownerName} onChange={handleProfileChange} placeholder="e.g. John Doe" />
                        <InputGroup label="Contact Email" type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="admin@example.com" />
                        <InputGroup label="Phone Number" type="tel" name="mobileNumber" value={profile.mobileNumber} onChange={handleProfileChange} placeholder="+91 98765 43210" />
                    </div>
                </div>
            </Section>

            <Section title="Security" icon={Lock}>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup 
                        label="Current Password" 
                        name="currentPassword" 
                        value={passwords.currentPassword} 
                        onChange={handlePasswordChange} 
                        placeholder="••••••••" 
                        isPassword={true}
                        showPassword={showCurrentPassword}
                        onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                    <InputGroup 
                        label="New Password" 
                        name="newPassword" 
                        value={passwords.newPassword} 
                        onChange={handlePasswordChange} 
                        placeholder="••••••••" 
                        isPassword={true}
                        showPassword={showNewPassword}
                        onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSavePassword} className="px-6 py-3 bg-neon-purple text-white rounded-xl font-bold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-neon-purple/20 flex items-center gap-2">
                        Update Password
                    </button>
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
            
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
        </div>
    );
}
