import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Droplets, Footprints, Trophy, Sparkles, TrendingUp, Plus, X, Carrot, CheckCircle2, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useDailyLog } from '../context/DailyLogContext';
import { useAuth } from '../context/AuthContext';
import WaterTracker from '../components/WaterTracker';

const StatCard = ({ title, value, subtext, icon: Icon, color, delay }) => {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-premium rounded-[2.5rem] p-6 relative overflow-hidden group glass-card-hover"
        >
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500/20 rounded-full blur-[50px] group-hover:bg-${color}-500/30 transition-all duration-700`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 text-${color}-400 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="bg-black/20 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                    <span className={`text-[10px] font-bold text-${color}-300 uppercase tracking-wider`}>{t('today')}</span>
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-5xl font-serif font-bold text-white mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{value}</h3>
                <div className="flex items-end gap-2">
                    <p className="text-gray-400 font-medium tracking-wide text-sm">{title}</p>
                    <span className="text-[10px] text-gray-500 mb-1">/ {subtext}</span>
                </div>

                <div className="mt-6 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">{t('statChange')}</span>
                </div>
            </div>
        </motion.div>
    );
};

// ... LogModal component stays mostly the same ...
const LogModal = ({ onClose }) => {
    const { t, dir } = useLanguage();
    const navigate = useNavigate();
    const { addWater } = useDailyLog();
    const [view, setView] = useState('menu'); // 'menu' | 'water'

    const handleLogMeal = () => {
        onClose();
        navigate('/scan');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-premium rounded-[3rem] p-8 w-full max-w-lg relative z-10 shadow-2xl shadow-black/50 overflow-hidden"
            >
                {/* Header with Back Button if in sub-view */}
                <div className="flex justify-between items-center mb-8 relative z-20">
                    <div className="flex items-center gap-3">
                        {view !== 'menu' && (
                            <button
                                onClick={() => setView('menu')}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronRight className={`w-5 h-5 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-white">
                                {view === 'menu' ? t('quickLog') : 'Add Water'}
                            </h2>
                            {view === 'menu' && <p className="text-gray-400 text-sm mt-1">Track your journey</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative">
                    {/* View: Main Menu */}
                    {view === 'menu' && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="grid grid-cols-1 gap-4"
                        >
                            <button
                                onClick={handleLogMeal}
                                className="group relative overflow-hidden bg-zinc-900/50 hover:bg-zinc-800 p-6 rounded-[2rem] flex items-center gap-6 transition-all border border-white/5 hover:border-rose-500/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-500">
                                    <Carrot className="w-7 h-7" />
                                </div>
                                <div className={`text-left flex-1 ${dir === 'rtl' ? 'rtl:text-right' : ''}`}>
                                    <h3 className="text-xl font-bold text-white mb-1">{t('logMeal')}</h3>
                                    <p className="text-sm text-gray-400">{t('trackCaloriesMacros')}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:border-rose-500 transition-colors ${dir === 'rtl' ? 'rtl:mr-auto rtl:ml-0' : 'ml-auto'}`}>
                                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                </div>
                            </button>

                            <button
                                onClick={() => setView('water')}
                                className="group relative overflow-hidden bg-zinc-900/50 hover:bg-zinc-800 p-6 rounded-[2rem] flex items-center gap-6 transition-all border border-white/5 hover:border-cyan-500/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                                    <Droplets className="w-7 h-7" />
                                </div>
                                <div className={`text-left flex-1 ${dir === 'rtl' ? 'rtl:text-right' : ''}`}>
                                    <h3 className="text-xl font-bold text-white mb-1">{t('logWater')}</h3>
                                    <p className="text-sm text-gray-400">{t('addWaterGoal')}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-colors ${dir === 'rtl' ? 'rtl:mr-auto rtl:ml-0' : 'ml-auto'}`}>
                                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* View: Water Tracker */}
                    {view === 'water' && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <WaterTracker onClose={onClose} />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const Dashboard = () => {
    const [showLogModal, setShowLogModal] = useState(false);
    const { t, dir } = useLanguage();
    const navigate = useNavigate();
    const { meals, waterIntake, waterGoal, stats, addWater } = useDailyLog();
    const { user } = useAuth();


    const macroData = [
        { name: t('protein'), value: stats.protein, color: '#F43F5E' },
        { name: t('carbs'), value: stats.carbs, color: '#A78BFA' },
        { name: t('fats'), value: stats.fats, color: '#FBBF24' },
    ];

    return (
        <div className="space-y-12 pb-20 relative min-h-screen" dir={dir}>
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-rose-900/10 via-fuchsia-900/5 to-transparent pointer-events-none" />
            <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="fixed top-40 -left-20 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            {showLogModal && <LogModal onClose={() => setShowLogModal(false)} />}

            {/* Editorial Header */}
            <div className="relative flex flex-col md:flex-row justify-between items-end gap-6 z-10">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-rose-400 font-medium tracking-widest uppercase text-xs"
                    >
                        <span className="w-8 h-[1px] bg-rose-500" />
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-7xl font-serif font-bold text-white tracking-tight"
                    >
                        {t('hello')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-rose-400">
                            {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Glower'}
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-xl font-light max-w-md border-l-2 border-white/10 pl-4 mt-4"
                    >
                        {t('readyToGlow')}
                    </motion.p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogModal(true)}
                    className="group relative px-8 py-6 bg-white text-black font-bold text-lg rounded-[2rem] flex items-center gap-4 hover:bg-rose-50 transition-colors shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] border-4 border-white/20 bg-clip-padding"
                >
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                        <Plus className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                    <span className="font-extrabold tracking-wide text-xl">{t('quickLog')}</span>
                </motion.button>
            </div>

            {/* Asymmetric Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Left Column: Stats & Nutrition */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Floating Stats Cluster */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title={t('activeCalories')} value={stats.caloriesConsumed.toLocaleString()} subtext={`${stats.caloriesGoal} ${t('kcalUnit')}`} icon={Flame} color="rose" delay={0.1} />
                        <StatCard title={t('hydration')} value={(waterIntake / 1000).toFixed(1) + 'L'} subtext={`${(waterGoal / 1000).toFixed(1)} ${t('litersUnit')}`} icon={Droplets} color="cyan" delay={0.2} />
                        <StatCard title={t('dailySteps')} value="0" subtext={t('stepsUnit')} icon={Footprints} color="violet" delay={0.3} />
                        <StatCard title={t('dayStreak')} value="1" subtext={t('daysUnit')} icon={Trophy} color="amber" delay={0.4} />
                    </div>

                    {/* Nutrition - Magazine Style */}
                    <div className="glass-premium rounded-[3rem] p-10 relative overflow-hidden min-h-[400px] flex items-center">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-rose-500/10 to-transparent opacity-50 pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center relative z-10">
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">{t('nutritionBalance')}</h3>
                                <p className="text-gray-400 mb-8 font-light">Your daily fuel breakdown. Keep protein high for recovery.</p>

                                <div className="space-y-5">
                                    {macroData.map((macro) => (
                                        <div key={macro.name} className="group">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-300 font-medium tracking-wide flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: macro.color }} />
                                                    {macro.name}
                                                </span>
                                                <span className="text-white font-bold">{macro.value}g</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '75%' }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: macro.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative h-64 flex items-center justify-center">
                                {/* Custom decorative circle stack instead of simple pie */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-56 h-56 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                        <div className="w-48 h-48 rounded-full border border-dashed border-white/20" />
                                    </div>
                                </div>

                                <div className="relative z-20 text-center">
                                    <div className="text-6xl font-serif font-bold text-white tracking-tighter">{(stats.caloriesGoal - stats.caloriesConsumed).toLocaleString()}</div>
                                    <div className="text-xs uppercase tracking-[0.2em] text-rose-400 mt-2 font-bold">kcal Left</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Workout & Meals */}
                <div className="lg:col-span-4 space-y-8 flex flex-col">
                    {/* Immersive Workout Card - Vertical Magazine Cover Style */}
                    <div
                        onClick={() => navigate('/workouts')}
                        className="group relative flex-1 min-h-[400px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl shadow-indigo-900/20 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2670&auto=format&fit=crop")' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-widest mb-6 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                Live Session
                            </div>

                            <h2 className="text-4xl font-serif font-bold text-white leading-[1.1] mb-2">Yoga for<br />Inner Peace</h2>
                            <p className="text-gray-300 font-light text-lg mb-6">45 min • Intermediate Flow</p>

                            <button className="w-full py-5 bg-white text-black font-extrabold text-lg rounded-2xl hover:bg-rose-50 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]">
                                Start Now <ChevronRight className="w-5 h-5 stroke-[3]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Meals Strip */}
            <div className="glass-premium rounded-[3rem] p-8 mt-4 overflow-hidden relative">
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white">Recent Meals</h2>
                        <p className="text-gray-400 text-sm">Tracked today</p>
                    </div>
                    <button
                        onClick={() => navigate('/meals')}
                        className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/5 transition"
                    >
                        View Full Log
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {meals.slice(0, 3).map((meal, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-black/20 rounded-[2rem] p-4 flex gap-5 items-center group cursor-pointer hover:bg-white/5 transition border border-white/5"
                        >
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-zinc-900 border border-white/5">
                                <img
                                    src={meal.img.startsWith('http') ? meal.img : `https://images.unsplash.com/photo-${meal.img}?q=80&w=200&auto=format&fit=crop`}
                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition duration-700"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-1">{meal.type}</p>
                                <h4 className="font-bold text-white mb-2 leading-tight font-serif text-xl">{meal.name}</h4>
                                <div className="text-gray-400 text-xs font-mono">{meal.kcal} kcal</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
