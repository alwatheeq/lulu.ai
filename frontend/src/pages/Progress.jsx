import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, ArrowUpRight, Scale, Activity } from 'lucide-react';

const StatBox = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 hover:border-rose-500/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
                <Icon className="w-5 h-5" />
            </div>
            {change && (
                <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-bold text-green-400">{change}</span>
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-serif font-bold text-white">{value}</p>
    </div>
);

const Progress = () => {
    const [timeRange, setTimeRange] = useState('Week');

    const data = [
        { name: 'Mon', weight: 65.2, calories: 1800, steps: 8432 },
        { name: 'Tue', weight: 65.0, calories: 2100, steps: 10245 },
        { name: 'Wed', weight: 64.8, calories: 1950, steps: 7500 },
        { name: 'Thu', weight: 64.9, calories: 2000, steps: 9100 },
        { name: 'Fri', weight: 64.5, calories: 1850, steps: 12000 },
        { name: 'Sat', weight: 64.4, calories: 2300, steps: 14500 },
        { name: 'Sun', weight: 64.2, calories: 1900, steps: 8000 },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-white mb-2">My Journey</h1>
                    <p className="text-gray-400 text-lg">Tracking your consistency and growth.</p>
                </div>

                <div className="flex bg-zinc-900 border border-white/10 rounded-xl p-1">
                    {['Week', 'Month', 'Year'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === range
                                    ? 'bg-rose-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatBox title="Current Weight" value="64.2 kg" change="-1.0 kg" icon={Scale} color="rose" />
                <StatBox title="Avg. Calories" value="1,985" change="-120" icon={Activity} color="violet" />
                <StatBox title="Workouts" value="12" change="+2" icon={Trophy} color="amber" />
                <StatBox title="Streak" value="21 days" icon={Calendar} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Weight Chart */}
                <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xl font-bold text-white mb-8 font-serif flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-rose-500" />
                        Weight Trends
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#52525B"
                                    tick={{ fill: '#71717A', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#52525B"
                                    tick={{ fill: '#71717A', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181B',
                                        borderColor: '#27272A',
                                        color: '#fff',
                                        borderRadius: '1rem',
                                        padding: '1rem'
                                    }}
                                    itemStyle={{ color: '#F43F5E' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#F43F5E"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorWeight)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Calorie Bar Chart */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xl font-bold text-white mb-8 font-serif">Weekly Intake</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#52525B"
                                    tick={{ fill: '#71717A', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                    interval={0}
                                />
                                <Tooltip
                                    cursor={{ fill: '#27272A' }}
                                    contentStyle={{
                                        backgroundColor: '#18181B',
                                        borderColor: '#27272A',
                                        color: '#fff',
                                        borderRadius: '1rem'
                                    }}
                                />
                                <Bar dataKey="calories" fill="#A78BFA" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-rose-900/20 to-violet-900/20 border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-pulse">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-white mb-2">Milestone Reached!</h3>
                            <p className="text-rose-200">You've hit your calorie goal for 21 days straight.</p>
                        </div>
                    </div>
                    <button className="bg-white text-rose-600 font-bold px-8 py-3 rounded-xl hover:bg-rose-50 transition transform hover:scale-105 shadow-lg">
                        Claim Reward
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Progress;
