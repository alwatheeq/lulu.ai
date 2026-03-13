import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, CreditCard, Bell, Shield, LogOut, ChevronRight, Crown, Moon, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsSection = ({ title, children }) => (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 mb-8">
        <h3 className="text-xl font-serif font-bold text-white mb-6 border-b border-white/5 pb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Settings = () => {
    const { user, logout, updateProfile } = useAuth();
    const { t, language, toggleLanguage } = useLanguage();
    const [notifications, setNotifications] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        weight: '',
        height: '',
        activity_level: 'Sedentary',
        goal: 'Maintain',
        gender: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || user.name || '',
                age: user.age || '',
                weight: user.weight || '',
                height: user.height || '',
                activity_level: user.activity_level || 'Sedentary',
                goal: user.goal || 'Maintain',
                gender: user.gender || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await updateProfile({
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                height: formData.height ? parseFloat(formData.height) : null
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (!user) return null;

    return (
        <div className="pb-20 max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <div className="w-32 h-32 mx-auto relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-fuchsia-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <img src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-zinc-900 relative z-10" />
                    <div className="absolute bottom-1 right-1 z-20 bg-rose-500 text-white rounded-full p-2 border-4 border-zinc-900">
                        <Crown className="w-4 h-4 fill-current" />
                    </div>
                </div>
                <h1 className="text-4xl font-serif font-bold text-white mb-2">{user.full_name || user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                <div className="mt-4 flex justify-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-bold uppercase tracking-wide">
                        {user.plan || 'Free Plan'}
                    </span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl text-center ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <SettingsSection title={t('personalInfo')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            >
                                <option value="">Select Gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Activity Level</label>
                            <select
                                name="activity_level"
                                value={formData.activity_level}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            >
                                <option value="Sedentary">Sedentary (Office Job)</option>
                                <option value="Lightly Active">Lightly Active (1-2 days/week)</option>
                                <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                                <option value="Very Active">Very Active (6-7 days/week)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 mb-1 block">Goal</label>
                            <select
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                            >
                                <option value="Lose Weight">Lose Weight</option>
                                <option value="Maintain">Maintain</option>
                                <option value="Gain Muscle">Gain Muscle</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="mt-6 w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </SettingsSection>

                <SettingsSection title={t('preferences')}>
                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{t('notifications')}</p>
                                <p className="text-sm text-gray-400">Daily reminders & updates</p>
                            </div>
                        </div>
                        <div
                            onClick={() => setNotifications(!notifications)}
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-rose-500' : 'bg-gray-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{t('language')}</p>
                                <p className="text-sm text-gray-400">{language === 'en' ? 'English' : 'العربية'}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="px-4 py-2 bg-zinc-800 rounded-xl text-sm font-bold text-white hover:bg-zinc-700 transition"
                        >
                            {language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-violet-500/10 text-violet-400">
                                <Moon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{t('appearance')}</p>
                                <p className="text-sm text-gray-400">Dark Mode (System)</p>
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                <div className="flex justify-center mt-12">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-rose-500 hover:text-rose-400 font-bold px-8 py-3 rounded-2xl hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                    >
                        <LogOut className="w-5 h-5" />
                        {t('signOut')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
