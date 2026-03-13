import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useLanguage } from '../context/LanguageContext';

const Layout = () => {
    const { isRTL } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar stays fixed on the left even in Arabic to maintain 'Normal' design */}
            <div className="fixed left-0 top-0 bottom-0 z-50">
                <Sidebar />
            </div>

            {/* Main Content deals with offsets */}
            <main className={`flex-1 ml-72 p-8 overflow-y-auto h-screen custom-scrollbar transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
