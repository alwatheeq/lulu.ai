import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Flame, Beef, Wheat, Droplets, Trash2, ScanLine, Plus,
    UtensilsCrossed, ChevronRight, Clock, Search, X
} from 'lucide-react';
import { useDailyLog } from '../context/DailyLogContext';
import api from '../api/axios';

const MEAL_TYPE_COLORS = {
    Breakfast: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    Lunch: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    Dinner: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
    Snack: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

const MacroPill = ({ icon: Icon, value, unit, color }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5`}>
        <Icon className={`w-3 h-3 ${color}`} />
        <span className="text-white text-xs font-bold">{value}</span>
        <span className="text-gray-500 text-xs">{unit}</span>
    </div>
);

const MealCard = ({ meal, onDelete, index }) => {
    const typeStyle = MEAL_TYPE_COLORS[meal.type] || MEAL_TYPE_COLORS['Snack'];
    const isUnsplash = meal.img && meal.img.includes('unsplash');
    const imgSrc = meal.img && (meal.img.startsWith('http') || meal.img.startsWith('data:'))
        ? meal.img
        : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row"
        >
            {/* Image */}
            <div className="w-full md:w-36 h-36 shrink-0 relative overflow-hidden">
                <img
                    src={imgSrc}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop'; }}
                />
                {/* AI badge */}
                {meal.source === 'ai' && (
                    <div className="absolute top-2 left-2 bg-violet-500/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ScanLine className="w-2.5 h-2.5" /> AI Scan
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                                {meal.type}
                            </span>
                            <h3 className="text-xl font-serif font-bold text-white mt-2 leading-tight">{meal.name}</h3>
                        </div>
                        <button
                            onClick={() => onDelete(meal.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-rose-500/20 text-gray-500 hover:text-rose-400"
                            title="Delete meal"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {meal.healthTip && (
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mt-1 mb-3">{meal.healthTip}</p>
                    )}
                </div>

                {/* Macros */}
                <div className="flex flex-wrap gap-2 mt-2">
                    <MacroPill icon={Flame} value={meal.kcal} unit="kcal" color="text-rose-400" />
                    <MacroPill icon={Beef} value={meal.protein} unit="g pro" color="text-amber-400" />
                    <MacroPill icon={Wheat} value={meal.carbs} unit="g carb" color="text-violet-400" />
                    <MacroPill icon={Droplets} value={meal.fat} unit="g fat" color="text-cyan-400" />
                </div>
            </div>
        </motion.div>
    );
};

// Group meals by type
const groupByType = (meals) => {
    return meals.reduce((groups, meal) => {
        const key = meal.type || 'Snack';
        if (!groups[key]) groups[key] = [];
        groups[key].push(meal);
        return groups;
    }, {});
};

const MealsLog = () => {
    const navigate = useNavigate();
    const { meals, setMeals, stats } = useDailyLog();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [deleting, setDeleting] = useState(null);

    const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const filtered = meals.filter(m => {
        const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'All' || m.type === filterType;
        return matchesSearch && matchesType;
    });

    const grouped = groupByType(filtered);
    const ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            await api.delete(`/meals/${id}`);
            // Update local state via context - refetch would be ideal but we filter here for speed
            if (typeof setMeals === 'function') {
                setMeals(prev => prev.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error('Delete failed', err);
        } finally {
            setDeleting(null);
        }
    };

    const totalKcal = filtered.reduce((s, m) => s + (parseInt(m.kcal) || 0), 0);
    const totalProtein = filtered.reduce((s, m) => s + (parseInt(m.protein) || 0), 0);
    const totalCarbs = filtered.reduce((s, m) => s + (parseInt(m.carbs) || 0), 0);
    const totalFat = filtered.reduce((s, m) => s + (parseInt(m.fat) || 0), 0);

    return (
        <div className="space-y-8 pb-16 relative">
            {/* Background glow */}
            <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-rose-600/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-rose-400 font-bold tracking-widest uppercase text-xs mb-2"
                    >
                        <span className="w-8 h-[1px] bg-rose-500" /> Today's Food Journal
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-5xl font-serif font-bold text-white tracking-tight"
                    >
                        Meals Log
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 mt-2"
                    >
                        {meals.length} meal{meals.length !== 1 ? 's' : ''} tracked today
                    </motion.p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/scan')}
                        className="flex items-center gap-2 px-6 py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 font-bold rounded-2xl border border-violet-500/30 transition-all hover:scale-105"
                    >
                        <ScanLine className="w-5 h-5" /> Scan Food
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(244,63,94,0.3)]"
                    >
                        <Plus className="w-5 h-5 stroke-[3]" /> Log Meal
                    </button>
                </div>
            </div>

            {/* Daily Summary Bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Calories', value: totalKcal, unit: 'kcal', icon: Flame, color: 'rose', max: stats.caloriesGoal },
                    { label: 'Protein', value: totalProtein, unit: 'g', icon: Beef, color: 'amber', max: 150 },
                    { label: 'Carbs', value: totalCarbs, unit: 'g', icon: Wheat, color: 'violet', max: 250 },
                    { label: 'Fat', value: totalFat, unit: 'g', icon: Droplets, color: 'cyan', max: 70 },
                ].map(({ label, value, unit, icon: Icon, color, max }) => (
                    <div key={label} className={`bg-zinc-900/40 border border-white/5 rounded-[1.75rem] p-5 hover:border-${color}-500/20 transition-colors`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-xl bg-${color}-500/10`}>
                                <Icon className={`w-4 h-4 text-${color}-400`} />
                            </div>
                            <span className="text-gray-400 text-sm font-medium">{label}</span>
                        </div>
                        <div className="text-3xl font-serif font-bold text-white">{value}<span className="text-sm text-gray-500 font-sans ml-1">{unit}</span></div>
                        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                className={`h-full rounded-full bg-${color}-500`}
                            />
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search meals..."
                        className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/40 border border-white/5 rounded-2xl p-1.5">
                    {mealTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filterType === type
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Meals List */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 gap-6 text-center"
                >
                    <div className="w-24 h-24 rounded-full bg-zinc-900/60 border border-white/5 flex items-center justify-center">
                        <UtensilsCrossed className="w-10 h-10 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">No meals here yet</h3>
                        <p className="text-gray-500">
                            {search ? `No results for "${search}"` : 'Start logging your meals to see them appear here.'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/scan')}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all hover:scale-105"
                    >
                        <ScanLine className="w-5 h-5" /> Scan Your First Meal
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-10">
                    {ORDER.filter(type => grouped[type]?.length).map(type => (
                        <div key={type}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-bold uppercase tracking-widest ${MEAL_TYPE_COLORS[type]?.text || 'text-gray-400'}`}>
                                    {type}
                                </span>
                                <span className="flex-1 h-[1px] bg-white/5" />
                                <span className="text-gray-600 text-xs">{grouped[type].length} item{grouped[type].length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {grouped[type].map((meal, i) => (
                                        <MealCard
                                            key={meal.id || i}
                                            meal={meal}
                                            index={i}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                    {/* Ungrouped items that don't match ORDER types */}
                    {Object.keys(grouped)
                        .filter(t => !ORDER.includes(t) && grouped[t].length > 0)
                        .map(type => (
                            <div key={type}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{type}</span>
                                    <span className="flex-1 h-[1px] bg-white/5" />
                                </div>
                                <div className="space-y-4">
                                    {grouped[type].map((meal, i) => (
                                        <MealCard key={meal.id || i} meal={meal} index={i} onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export default MealsLog;
