import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const DailyLogContext = createContext();

export const useDailyLog = () => useContext(DailyLogContext);

export const DailyLogProvider = ({ children }) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [waterIntake, setWaterIntake] = useState(0);
    const [waterGoal, setWaterGoal] = useState(2500);
    const [stats, setStats] = useState({
        caloriesConsumed: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        caloriesGoal: 2000
    });

    // Fetch data when user logs in
    useEffect(() => {
        if (user) {
            fetchMeals();
            fetchWater();
        } else {
            setMeals([]);
            setWaterIntake(0);
            setStats({ caloriesConsumed: 0, protein: 0, carbs: 0, fats: 0, caloriesGoal: 2000 });
        }
    }, [user]);

    const fetchMeals = async () => {
        try {
            const response = await api.get('/meals/');
            // Map backend fields to frontend format
            const mappedMeals = response.data.map(m => ({
                id: m.id,
                type: m.meal_type || 'Snack',
                name: m.name,
                kcal: m.calories,
                fat: m.fats,
                carbs: m.carbs,
                protein: m.protein,
                img: m.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
            }));
            setMeals(mappedMeals);
        } catch (error) {
            console.error("Failed to fetch meals:", error);
        }
    };

    const fetchWater = async () => {
        try {
            const response = await api.get('/water/today');
            setWaterIntake(response.data); // Expecting integer
        } catch (error) {
            console.error("Failed to fetch water:", error);
        }
    };

    // Calculate stats whenever meals change
    useEffect(() => {
        const newStats = meals.reduce((acc, meal) => ({
            caloriesConsumed: acc.caloriesConsumed + parseInt(meal.kcal),
            protein: acc.protein + parseInt(meal.protein),
            carbs: acc.carbs + parseInt(meal.carbs),
            fats: acc.fats + parseInt(meal.fats),
        }), { caloriesConsumed: 0, protein: 0, carbs: 0, fats: 0 });

        setStats(prev => ({ ...prev, ...newStats }));
    }, [meals]);

    const addMeal = async (mealData) => {
        try {
            // Don't send large base64 data URIs to the backend — store null
            const isBase64 = mealData.img?.startsWith('data:');
            const safeImageUrl = isBase64 ? null : (mealData.img || null);

            // Transform to backend format
            const payload = {
                name: mealData.food || mealData.name || 'Unknown Meal',
                meal_type: mealData.type || 'Snack',
                calories: Math.round(mealData.calories || mealData.kcal || 0),
                protein: parseFloat(mealData.macros?.protein ?? mealData.protein ?? 0),
                carbs: parseFloat(mealData.macros?.carbs ?? mealData.carbs ?? 0),
                fats: parseFloat(mealData.macros?.fats ?? mealData.fat ?? mealData.fats ?? 0),
                image_url: safeImageUrl,
                health_tip: mealData.healthTip || null,
                ingredients: mealData.ingredients
                    ? mealData.ingredients.map(i => typeof i === 'string' ? { name: i } : i)
                    : []
            };

            const response = await api.post('/meals/', payload);

            // Add to local state — keep the original image (even base64) for display
            const newMeal = {
                id: response.data.id,
                type: response.data.meal_type,
                name: response.data.name,
                kcal: response.data.calories,
                fat: response.data.fats,
                carbs: response.data.carbs,
                protein: response.data.protein,
                healthTip: response.data.health_tip,
                source: mealData.source || 'manual',
                // Use original img for display (base64 kept local-only)
                img: mealData.img || response.data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
            };

            setMeals(prev => [newMeal, ...prev]);
            return newMeal;
        } catch (error) {
            console.error("Failed to add meal:", error.response?.data || error);
            throw error;
        }
    };

    const addWater = async (amount) => {
        try {
            await api.post('/water/', { amount });
            setWaterIntake(prev => prev + amount);
        } catch (error) {
            console.error("Failed to add water:", error);
        }
    };

    const value = {
        meals,
        setMeals,
        waterIntake,
        waterGoal,
        stats,
        addMeal,
        addWater
    };

    return (
        <DailyLogContext.Provider value={value}>
            {children}
        </DailyLogContext.Provider>
    );
};
