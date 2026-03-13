import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Check for stored token and user
        const token = localStorage.getItem('lulu_token');
        const storedUser = localStorage.getItem('lulu_user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('lulu_user');
            }
        }
        setLoading(false);
    }, []);

    // Fetch full profile from API to access all fields
    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
            localStorage.setItem('lulu_user', JSON.stringify(response.data));
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const login = async (email, password) => {
        try {
            // Use URLSearchParams for application/x-www-form-urlencoded
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await api.post('/login/access-token', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token } = response.data;
            localStorage.setItem('lulu_token', access_token);

            // Fetch full profile immediately
            await fetchProfile();

            return true;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const loginWithGoogle = async (credential) => {
        try {
            const response = await api.post('/login/google', { token: credential });
            const { access_token } = response.data;
            localStorage.setItem('lulu_token', access_token);
            await fetchProfile();
            return true;
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    };

    const register = async (email, password, fullName, role = "user") => {
        try {
            const response = await api.post('/users/', {
                email,
                password,
                full_name: fullName,
                role
            });
            // Auto login after register
            await login(email, password);
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lulu_user');
        localStorage.removeItem('lulu_token');
    };

    const updateProfile = async (data) => {
        try {
            const response = await api.put('/users/me', data);
            setUser(response.data);
            localStorage.setItem('lulu_user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error("Update profile failed:", error);
            throw error;
        }
    };

    const updatePlan = (newPlan) => {
        // We will implement this with updateProfile now
        updateProfile({ plan: newPlan });
    };

    const value = {
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        updatePlan,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-black flex items-center justify-center text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xl font-serif">Loading Lulu AI...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
