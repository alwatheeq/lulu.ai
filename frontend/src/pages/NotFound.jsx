import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-4">
            <div className="w-48 h-48 mb-8 relative">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-[60px] animate-pulse" />
                <img src="/avocado_logo.png" alt="Lost Avocado" className="w-full h-full object-contain relative z-10 grayscale opacity-50" />
            </div>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-serif font-bold text-white mb-4"
            >
                404
            </motion.h1>
            <p className="text-xl text-gray-400 mb-8 max-w-md">Oops! Looks like this page hasn't been added to your workout plan yet.</p>

            <Link to="/" className="btn-primary flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return Home
            </Link>
        </div>
    );
};

export default NotFound;
