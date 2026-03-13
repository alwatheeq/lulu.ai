import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, CheckCircle, Flame, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const LiveWorkout = ({ workout, onEnd }) => {
    const [started, setStarted] = useState(false);
    const [currentSet, setCurrentSet] = useState(1);
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);

    // Mock exercises
    const [exercises, setExercises] = useState([
        { name: "Warm-up Jump Rope", reps: "2 mins", completed: false },
        { name: "Dumbbell Squats", reps: "15 reps", completed: false },
        { name: "Push-ups", reps: "12 reps", completed: false },
        { name: "Plank", reps: "60 secs", completed: false },
    ]);

    React.useEffect(() => {
        let interval;
        if (started && !isPaused) {
            interval = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [started, isPaused]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleComplete = (idx) => {
        const updated = [...exercises];
        updated[idx].completed = !updated[idx].completed;
        setExercises(updated);
    };

    const allCompleted = exercises.every(e => e.completed);

    const handleFinishWorkout = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F43F5E', '#A78BFA', '#FBBF24']
        });
        setShowCompletion(true);
    };

    if (showCompletion) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-3xl overflow-y-auto flex items-center justify-center p-4"
                >
                    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-center max-w-lg w-full">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-32 h-32 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(244,63,94,0.4)]"
                        >
                            <Trophy className="w-16 h-16 text-white" />
                        </motion.div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-4">Workout Complete!</h2>
                        <p className="text-gray-400 text-lg mb-8">You crushed your {workout.title} session. Keep the momentum going!</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-sm text-gray-400 mb-1">Time</div>
                                <div className="text-2xl font-bold text-white font-mono">{formatTime(time)}</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-sm text-gray-400 mb-1">Burned</div>
                                <div className="text-2xl font-bold text-rose-400 flex justify-center items-center gap-1">
                                    <Flame className="w-5 h-5" /> 320 kcal
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onEnd}
                            className="w-full py-4 bg-white text-black font-bold text-xl rounded-2xl hover:scale-105 transition-all shadow-xl"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-3xl overflow-y-auto"
            >
                <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">

                    {/* Header */}
                    <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                        <button
                            onClick={onEnd}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            End Session
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-serif font-bold text-white">{workout.title}</h2>
                            <div className="flex justify-center items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-rose-400 text-xs tracking-widest uppercase font-bold">Live Session</span>
                            </div>
                        </div>
                        <div className="text-3xl font-mono font-bold text-white w-24 text-right">
                            {formatTime(time)}
                        </div>
                    </header>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Video / Main Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 group">
                                <img src={workout.image} alt={workout.title} className="w-full h-full object-cover opacity-60" />
                                {!started ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <button
                                            onClick={() => setStarted(true)}
                                            className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_50px_rgba(244,63,94,0.5)] cursor-pointer z-10"
                                        >
                                            <Play className="w-10 h-10 text-white fill-current ml-2" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setIsPaused(!isPaused)}
                                                className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-bold hover:bg-white/30 transition-colors border border-white/10"
                                            >
                                                {isPaused ? 'Resume' : 'Pause'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tracker Sidebar */}
                        <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-6 h-fit sticky top-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-serif font-bold text-white">Set {currentSet} of 3</h3>
                                <div className="text-gray-400 text-sm">{workout.duration}</div>
                            </div>

                            <div className="space-y-3">
                                {exercises.map((ex, i) => (
                                    <div
                                        key={i}
                                        onClick={() => started && toggleComplete(i)}
                                        className={`p-4 rounded-2xl border transition-all ${!started ? 'opacity-50 cursor-not-allowed border-white/5 bg-zinc-800/20' : ex.completed ? 'bg-rose-500/10 border-rose-500/30' : 'bg-zinc-800/50 border-white/5 hover:border-white/20 cursor-pointer'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className={`font-bold ${ex.completed ? 'text-rose-200 line-through' : 'text-white'}`}>{ex.name}</h4>
                                                <p className="text-xs font-mono text-gray-400 mt-1">{ex.reps}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${ex.completed ? 'border-rose-500 bg-rose-500' : 'border-gray-600'}`}>
                                                {ex.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    if (currentSet < 3) {
                                        setCurrentSet(s => s + 1);
                                        setExercises(exercises.map(e => ({ ...e, completed: false })));
                                    } else {
                                        handleFinishWorkout();
                                    }
                                }}
                                disabled={!allCompleted || !started}
                                className={`w-full mt-8 py-4 rounded-2xl font-bold transition-all ${allCompleted ? 'bg-white text-black hover:scale-[1.02] shadow-xl' : 'bg-zinc-800 text-gray-500 cursor-not-allowed'}`}
                            >
                                {currentSet === 3 && allCompleted ? 'Complete Workout' : 'Next Set'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LiveWorkout;
