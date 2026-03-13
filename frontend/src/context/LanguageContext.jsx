import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const translations = {
    en: {
        // Sidebar
        dashboard: "Dashboard",
        scanner: "AI Scanner",
        workouts: "Workouts",
        coach: "Coach Lulu",
        community: "Community",
        progress: "My Progress",
        settings: "Settings",

        // Dashboard
        // Dashboard
        hello: "Hello",
        readyToGlow: "Ready to glow today?",
        quickLog: "Quick Log",
        nutritionBalance: "Nutrition Balance",
        recentMeals: "Recent Meals",
        upNext: "Up Next",
        startSession: "Start Session",
        viewAll: "View All",
        activeCalories: "Active Calories",
        hydration: "Hydration",
        dailySteps: "Daily Steps",
        dayStreak: "Day Streak",
        statChange: "vs yesterday",

        // Units/Labels
        kcalUnit: "kcal",
        litersUnit: "Liters",
        stepsUnit: "steps",
        daysUnit: "days",
        today: "Today",
        weekly: "Weekly",

        // Settings
        accountSettings: "Account Settings",
        personalInfo: "Personal Information",
        security: "Login & Security",
        payments: "Payment Methods",
        preferences: "Preferences",
        notifications: "Notifications",
        appearance: "App Appearance",
        language: "Language",
        signOut: "Sign Out",

        // Coach
        askLulu: "Ask Lulu about nutrition, workouts...",
    },
    ar: {
        // Sidebar
        dashboard: "لوحة القيادة",
        scanner: "الماسح الذكي",
        workouts: "التمارين",
        coach: "المدربة لولو",
        community: "المجتمع",
        progress: "تطوري",
        settings: "الإعدادات",

        // Dashboard
        hello: "مرحباً",
        readyToGlow: "مستعدة للتألق اليوم؟",
        quickLog: "سجل سريع",
        nutritionBalance: "توازن التغذية",
        recentMeals: "الوجبات الأخيرة",
        upNext: "القادم",
        startSession: "ابدأ الجلسة",
        viewAll: "عرض الكل",
        activeCalories: "السعرات النشطة",
        hydration: "الترطيب",
        dailySteps: "الخطوات",
        dayStreak: "أيام متتالية",
        statChange: "مقارنة بالأمس",

        // Units/Labels
        kcalUnit: "سعرة",
        litersUnit: "لتر",
        stepsUnit: "خطوة",
        daysUnit: "يوم",
        today: "اليوم",
        weekly: "أسبوعي",

        // Settings
        accountSettings: "إعدادات الحساب",
        personalInfo: "المعلومات الشخصية",
        security: "الأمان والدخول",
        payments: "طرق الدفع",
        preferences: "التفضيلات",
        notifications: "الإشعارات",
        appearance: "مظهر التطبيق",
        language: "اللغة",
        signOut: "تسجيل الخروج",

        // Coach
        askLulu: "اسألي لولو عن التغذية والتمارين...",
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL: language === 'ar',
        dir: language === 'ar' ? 'rtl' : 'ltr'
    };

    return (
        <LanguageContext.Provider value={value}>
            <div className={`min-h-screen ${language === 'ar' ? 'font-arabic' : ''}`}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};
