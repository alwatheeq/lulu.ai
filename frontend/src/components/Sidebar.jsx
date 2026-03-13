import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, Dumbbell, Bot, Settings, Activity, Users, ShieldAlert, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
    const { t } = useLanguage();
    const { user } = useAuth();

    const links = [
        { name: t('dashboard'), icon: LayoutDashboard, path: '/' },
        { name: t('scanner'), icon: ScanLine, path: '/scan' },
        { name: t('workouts'), icon: Dumbbell, path: '/workouts' },
        { name: t('coach'), icon: Bot, path: '/coach' },
        { name: t('community'), icon: Users, path: '/community' },
        { name: t('progress'), icon: Activity, path: '/progress' },
        { name: 'Meals Log', icon: UtensilsCrossed, path: '/meals' },
    ];

    if (user?.role === 'admin') {
        links.push({ name: 'Admin Panel', icon: ShieldAlert, path: '/admin' });
    }

    return (
        <div className="h-screen w-72 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 fixed z-50">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-12 mt-4 group cursor-pointer">
                <div className="w-24 h-24 p-1 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                    <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                        <img src="/avocado_logo.png" alt="Lulu.ai Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    </div>
                </div>
                <h1 className="text-3xl font-serif italic font-bold mt-4 text-white tracking-wide">
                    Lulu<span className="text-rose-500 not-italic">.ai</span>
                </h1>
                <p className="text-xs text-rose-300 font-medium tracking-widest uppercase mt-1">Smarter Health</p>
            </div>

            <nav className="flex-1 space-y-3 px-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-gradient-to-r from-rose-500/20 to-fuchsia-500/10 text-rose-300 shadow-inner'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            } `
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-fuchsia-500 rounded-r-full" />}
                                <link.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'group-hover:scale-110'}`} />
                                <span className="font-medium tracking-wide">{link.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <NavLink to="/settings" className="block bg-gradient-to-br from-zinc-900 to-zinc-900 border border-white/10 rounded-3xl p-5 relative overflow-hidden group hover:border-rose-500/30 transition-colors cursor-pointer">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-r from-rose-400 to-orange-400">
                            <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden">
                                <img src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"} alt="User" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white font-serif">{user?.full_name || "Glower"}</p>
                            <p className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">{user?.plan || "Member"}</p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
