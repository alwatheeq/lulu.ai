import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Video, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import api from '../api/axios';

const AI_Coach = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I'm Lulu, your wellness companion. How can I help you glow today?` }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        // Call Backend API
        try {
            const apiResponse = await api.post('/meals/chat', { prompt: input });

            const response = {
                id: Date.now() + 1,
                sender: 'bot',
                text: apiResponse.data.response || "I'm listening, but I didn't catch that."
            };
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error("Chat failed:", error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: "Sorry, I'm having trouble connecting to the server. 🔌"
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-zinc-800' : 'bg-rose-500/20'
                            }`}>
                            {msg.sender === 'user' ? <User className="w-5 h-5 text-gray-300" /> : <Bot className="w-5 h-5 text-rose-500" />}
                        </div>

                        <div className={`max-w-[75%] p-5 rounded-[2rem] shadow-sm ${msg.sender === 'user'
                            ? 'bg-rose-500 text-white rounded-tr-sm'
                            : 'bg-zinc-800/80 border border-white/5 text-gray-200 rounded-tl-sm backdrop-blur-md'
                            }`}>
                            <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask Lulu about nutrition, workouts..."
                        className="flex-1 bg-transparent text-white px-6 py-3 focus:outline-none placeholder-gray-500"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-gradient-to-r from-rose-500 to-fuchsia-500 hover:from-rose-600 hover:to-fuchsia-600 text-white p-3 rounded-full transition-all shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Human_Experts = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const res = await api.get('/users/experts');
                setExperts(res.data);
            } catch (err) {
                console.error("Failed to fetch experts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, []);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
    );

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-24">
            {experts.map((exp, i) => (
                <div key={i} className="bg-zinc-800/50 border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-rose-500/30 transition-all h-fit">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-500">
                            {/* Fallback to initials if no image */}
                            <div className="w-full h-full rounded-full bg-zinc-900 border-4 border-zinc-900 flex items-center justify-center text-2xl font-black text-rose-500 overflow-hidden">
                                {exp.image_url ? (
                                    <img src={exp.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    exp.full_name?.slice(0, 1) || exp.email.slice(0, 1).toUpperCase()
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-zinc-900 bg-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-serif">{exp.full_name || exp.email.split('@')[0]}</h3>
                    <p className="text-rose-400 text-sm font-medium mb-6 capitalize">{exp.role}</p>

                    <div className="flex gap-2 w-full mt-auto">
                        <button className="flex-1 bg-white text-zinc-900 font-bold py-3 rounded-xl hover:bg-rose-50 transition flex items-center justify-center gap-2">
                            <Video className="w-4 h-4" /> Call
                        </button>
                        <button className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" /> Book
                        </button>
                    </div>
                </div>
            ))}

            {experts.length === 0 && (
                <div className="col-span-full flex flex-col items-center py-20 text-gray-500">
                    <span className="text-4xl mb-4">🧘‍♀️</span>
                    <p className="font-medium">No experts available at the moment. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

const Coach = () => {
    const [tab, setTab] = useState('ai');

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden relative shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-fuchsia-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-500/20">
                        {tab === 'ai' ? <Sparkles className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white leading-none mb-1">{tab === 'ai' ? 'Lulu AI' : 'Expert Team'}</h2>
                        <p className="text-gray-400 text-sm">{tab === 'ai' ? 'Your 24/7 Wellness Companion' : 'Real pros for real results'}</p>
                    </div>
                </div>

                <div className="flex bg-black/40 rounded-full p-1 border border-white/5">
                    <button
                        onClick={() => setTab('ai')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tab === 'ai' ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        AI Coach
                    </button>
                    <button
                        onClick={() => setTab('human')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tab === 'human' ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Experts
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-black/20">
                {tab === 'ai' ? <AI_Coach /> : <Human_Experts />}
            </div>
        </div>
    );
};

export default Coach;
