import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useDailyLog } from '../context/DailyLogContext';

const WaterTracker = ({ onClose }) => {
    const { waterIntake, waterGoal, addWater } = useDailyLog();
    const percentage = Math.min((waterIntake / waterGoal) * 100, 100);

    const handleAdd = (amount) => {
        addWater(amount);
    };

    return (
        <div className="text-center w-full">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Hydration Station</h3>
            <p className="text-gray-400 mb-8">Stay hydrated to keep glowing.</p>

            <div className="relative w-48 h-48 mx-auto mb-8">
                {/* Circular Progress Container */}
                <div className="w-full h-full rounded-full border-4 border-white/5 relative overflow-hidden bg-black/20 shadow-inner">
                    {/* Water Wave Animation */}
                    <motion.div
                        className="absolute inset-x-0 bottom-0 bg-cyan-500/50"
                        initial={{ height: `${percentage}%` }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1, type: "spring" }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-4 bg-cyan-400/30 blur-md" />
                    </motion.div>

                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <span className="text-4xl font-bold text-white drop-shadow-md">{(waterIntake / 1000).toFixed(1)}L</span>
                        <span className="text-xs text-cyan-100 uppercase tracking-widest font-bold mt-1">/ {(waterGoal / 1000).toFixed(1)}L</span>
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.2)] pointer-events-none" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[250, 500, 750].map((amount) => (
                    <button
                        key={amount}
                        onClick={() => handleAdd(amount)}
                        className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/50 transition-all active:scale-95"
                    >
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-300 group-hover:text-white">{amount}ml</span>
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all"
                >
                    Done for now
                </button>
            </div>
        </div>
    );
};

export default WaterTracker;
