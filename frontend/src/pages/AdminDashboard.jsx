import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, TrendingUp, Search, MoreVertical, ShieldCheck, AlertCircle, Plus } from 'lucide-react';
import CreateContentModal from '../components/CreateContentModal';
import api from '../api/axios';

const AdminStatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 group hover:border-rose-500/20 transition-all"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">{change}</span>
            </div>
        </div>
        <h3 className="text-4xl font-serif font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
);

const UserRow = ({ user }) => (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td className="py-4 px-4">
            <div className="flex items-center gap-3">
                <img src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-white text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
            </div>
        </td>
        <td className="py-4 px-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.plan === 'Pro' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                {user.plan}
            </span>
        </td>
        <td className="py-4 px-4">
            <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active
            </span>
        </td>
        <td className="py-4 px-4 text-right">
            <button className="text-gray-500 hover:text-white">
                <MoreVertical className="w-4 h-4" />
            </button>
        </td>
    </tr>
);

const AdminDashboard = () => {
    const [search, setSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        user_count: 0,
        meal_count: 0,
        revenue: 0,
        active_sessions: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersRes = await api.get('/admin/users');
            setUsers(usersRes.data);

            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-400 text-lg">System Overview & User Management</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-rose-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-rose-500 transition shadow-lg shadow-rose-500/20">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard title="Total Users" value={stats?.user_count || 0} change="+12%" icon={Users} color="indigo" />
                <AdminStatCard title="Monthly Revenue" value={`$${(stats?.revenue || 0).toFixed(2)}`} change="+8.4%" icon={DollarSign} color="emerald" />
                <AdminStatCard title="Active Sessions" value={stats?.active_sessions || "12"} change="+24%" icon={Activity} color="rose" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Table */}
                <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-serif font-bold text-white">Recent Users ({filteredUsers.length})</h3>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs uppercase text-gray-500 tracking-wider">
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <UserRow key={user.id} user={{ ...user, name: user.full_name || 'User' }} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 h-fit">
                    <h3 className="text-xl font-serif font-bold text-white mb-6">System Health</h3>
                    <div className="space-y-4">
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white text-sm">High Server Load</h4>
                                <p className="text-xs text-rose-300 mt-1">CPU usage at 85%. Consider scaling.</p>
                            </div>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white text-sm">System Secure</h4>
                                <p className="text-xs text-emerald-300 mt-1">Last scan: 2 hours ago.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h4 className="font-bold text-white mb-4">Quick Actions</h4>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition text-sm font-medium">
                                Manage Subscription Plans
                            </button>
                            <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition text-sm font-medium">
                                Content Moderation (Community)
                            </button>
                            <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition text-sm font-medium">
                                View Audit Logs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Studio Content Management */}
                <div className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-serif font-bold text-white">Studio Content</h3>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    {showCreateModal && <CreateContentModal onClose={() => setShowCreateModal(false)} />}

                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: "Morning Glow Flow", category: "Yoga", duration: "25 min", views: "1.2k" },
                            { title: "HIIT Burn", category: "Cardio", duration: "45 min", views: "850" },
                            { title: "Power Pilates", category: "Pilates", duration: "30 min", views: "2.1k" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-400">{item.category} • {item.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500 font-medium">{item.views} views</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><MoreVertical className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
