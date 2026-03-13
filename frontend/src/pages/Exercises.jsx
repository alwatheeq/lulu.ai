import React, { useState } from 'react';
import { Play, Clock, Zap, Dumbbell, Star, ChevronRight, Calendar, Filter, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveWorkout from '../components/LiveWorkout';

const WorkoutCard = ({ title, duration, level, image, active, category, i }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className={`group relative overflow-hidden rounded-[2.5rem] cursor-pointer h-[420px] transition-all duration-300 ${active ? 'ring-2 ring-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.3)]' : 'hover:shadow-2xl hover:shadow-rose-500/10'}`}
    >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-zinc-950/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-1000" />

        {/* Saved Badge */}
        <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:bg-rose-500 hover:border-rose-500">
            <Star className="w-5 h-5 text-white" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full">
            <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-rose-300 uppercase mb-3 border border-rose-500/30 px-3 py-1 rounded-full bg-rose-500/10 backdrop-blur-sm">
                    {category}
                </span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">{title}</h3>

                <div className="flex items-center gap-4 text-gray-300 text-sm mt-2">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-rose-400" /> {duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-400" /> {level}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onStart(title, duration, level, image)}
                className="mt-6 w-full bg-white text-rose-950 font-bold py-3.5 rounded-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-rose-50 flex items-center justify-center gap-2 shadow-lg"
            >
                <Play className="w-4 h-4 fill-current" />
                Start Session
            </button>
        </div>
    </motion.div>
);

const Exercises = () => {
    const [filter, setFilter] = useState('All');
    const [activeWorkout, setActiveWorkout] = useState(null);

    const categories = ['All', 'Yoga', 'HIIT', 'Strength', 'Pilates'];

    const workouts = [
        {
            title: "Sculpt & Tone",
            duration: "45 min",
            level: "Intermediate",
            category: "Pilates",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2670&auto=format&fit=crop",
            active: true
        },
        {
            title: "Glute Burn",
            duration: "30 min",
            level: "Advanced",
            category: "Strength",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop",
            active: false
        },
        {
            title: "Morning Glow Flow",
            duration: "20 min",
            level: "Beginner",
            category: "Yoga",
            image: "https://images.unsplash.com/photo-1545205566-3da8d613635d?q=80&w=2670&auto=format&fit=crop",
            active: false
        },
        {
            title: "Cardio Blast",
            duration: "25 min",
            level: "Advanced",
            category: "HIIT",
            image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2674&auto=format&fit=crop",
            active: false
        },
        {
            title: "Core Power",
            duration: "15 min",
            level: "Intermediate",
            category: "Pilates",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop",
            active: false
        },
    ];

    const filteredWorkouts = filter === 'All' ? workouts : workouts.filter(w => w.category === filter);

    const handleStartWorkout = (title, duration, level, image) => {
        setActiveWorkout({ title, duration, level, image });
    };

    return (
        <div className="space-y-10 pb-10">
            <AnimatePresence>
                {activeWorkout && (
                    <LiveWorkout workout={activeWorkout} onEnd={() => setActiveWorkout(null)} />
                )}
            </AnimatePresence>

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-white mb-3">Studio</h1>
                    <p className="text-gray-400 font-light text-lg tracking-wide">Empowering workouts designed for your body.</p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat
                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Workout (Dynamic) */}
            <div className="relative rounded-[3rem] overflow-hidden min-h-[500px] flex items-end p-10 group">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1574680096141-9877b47657d4?q=80&w=2666&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Featured" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />
                </div>

                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse">Live Now</span>
                        <span className="text-rose-200 text-sm font-medium tracking-wide">with Coach Jessica</span>
                    </div>
                    <h2 className="text-6xl font-serif font-bold text-white mb-6 leading-none">Full Body<br />Sculpting</h2>
                    <p className="text-gray-200 text-lg mb-8 leading-relaxed font-light">Join 1.2k women in this high-energy session designed to tone every muscle group. No equipment needed.</p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleStartWorkout("Full Body Sculpting", "45 min", "Intermediate", "https://images.unsplash.com/photo-1574680096141-9877b47657d4?q=80&w=2666&auto=format&fit=crop")}
                            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Join Session
                        </button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Schedule
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div>
                <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-2xl font-serif font-bold text-white">Trending Classes</h2>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-white transition"><Filter className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredWorkouts.map((w, i) => (
                        <WorkoutCard key={i} {...w} i={i} onStart={handleStartWorkout} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Exercises;
