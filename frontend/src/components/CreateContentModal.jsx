import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Film, FileText, CheckCircle2, Music, Clock, Layers } from 'lucide-react';

const CreateContentModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [type, setType] = useState('workout'); // workout, nutrition, meditation

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-2xl relative z-10 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white">Create Studio Content</h2>
                        <p className="text-gray-400 text-sm mt-1">Upload new classes, recipes, or guides.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-rose-500' : 'bg-white/10'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'workout', label: 'Workout', icon: Film },
                                { id: 'nutrition', label: 'Recipe', icon: FileText },
                                { id: 'meditation', label: 'Meditation', icon: Music },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setType(item.id)}
                                    className={`flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all ${type === item.id
                                            ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <item.icon className="w-8 h-8" />
                                    <span className="font-bold">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <input type="text" placeholder="e.g. Morning Hatha Flow" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration (min)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                                        <input type="number" placeholder="45" className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rose-500/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                                        <select className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rose-500/50 appearance-none">
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setStep(2)} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-rose-50 transition mt-4">
                            Next: Media Upload
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-white/10 rounded-[2rem] h-64 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-bold text-lg">Click to upload video</p>
                                <p className="text-gray-500 text-sm">MP4, MOV up to 2GB</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition">
                                Back
                            </button>
                            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-white text-black font-bold rounded-2xl hover:bg-rose-50 transition">
                                Next: Review
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6 py-8">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Ready to Publish?</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">Your content "Morning Hatha Flow" will be live for all Pro members.</p>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(2)} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition">
                                Edit
                            </button>
                            <button onClick={onClose} className="flex-1 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition shadow-lg shadow-rose-500/20">
                                Publish Now
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CreateContentModal;
