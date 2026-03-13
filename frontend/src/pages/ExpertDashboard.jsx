import React, { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

// --- Translations ---
const T = {
    en: {
        appName: "lulu.nutriscan Pro", appSub: "Nutritionist Pro Platform",
        welcome: "Welcome to lulu.nutriscan Pro 🌸", welcomeSub: "Your complete AI-powered nutritionist platform",
        noClients: "No clients yet", noClientsSub: "Add your first client to start managing their nutrition",
        addFirst: "➕ Add First Client", selectClient: "Select a client to begin",
        yourClients: "Your Clients", clients: "Clients", aiPowered: "AI", pro: "Pro",
        newClient: "+ New",
        tabs: { scanner: "📷 Food Scanner", journal: "📓 Food Journal", planner: "🥗 Meal Planner", chat: "💬 AI Assistant" },
        scanner: {
            title: "📷 Food Image", results: "📊 Nutrition Analysis", drop: "Drop food photo here",
            browse: "or click to browse", upload: "⬆ Upload Photo", analyze: "✨ Analyze Nutrition",
            scanning: "Scanning...", analyzing: "Analyzing...", noData: "No data yet",
            noDataSub: "Upload & analyze a food photo", logBtn: "📋 Log to Client Journal",
            logged: "✅ Logged to {name}'s journal", match: "match", kcal: "kcal",
            healthScore: "Health Score", sodium: "Sodium", protein: "Protein",
            sugar: "Sugar", carbs: "Carbs", fat: "Fat", fiber: "Fiber",
        },
        form: {
            addTitle: "➕ New Client", editTitle: "✏️ Edit Client",
            name: "Full Name", namePh: "Jane Doe", age: "Age", agePh: "28",
            weight: "Weight (kg)", weightPh: "65", height: "Height (cm)", heightPh: "165",
            goal: "Goal", diet: "Diet Type", calories: "Daily Calorie Target", caloriesPh: "Auto-calculate",
            allergies: "Food Allergies", allergiesPh: "nuts, dairy...", notes: "Notes", notesPh: "Clinical notes...",
            save: "💾 Save Changes", add: "✅ Add Client", cancel: "Cancel",
            goals: [
                { value: "weight-loss", label: "⬇ Weight Loss" }, { value: "muscle-gain", label: "💪 Muscle Gain" },
                { value: "maintenance", label: "⚖ Maintenance" }, { value: "endurance", label: "🏃 Endurance" },
                { value: "health", label: "❤️ General Health" }
            ],
            diets: [
                { value: "standard", label: "Standard" }, { value: "vegetarian", label: "🥗 Vegetarian" },
                { value: "vegan", label: "🌱 Vegan" }, { value: "keto", label: "🥑 Ketogenic" },
                { value: "paleo", label: "🥩 Paleo" }, { value: "mediterranean", label: "🫒 Mediterranean" },
                { value: "low-carb", label: "📉 Low Carb" }, { value: "gluten-free", label: "🌾 Gluten Free" }
            ],
        },
        planner: {
            title: "🥗 Meal Plan Generator", sub: "AI-personalized for {name}",
            generate: "✨ Generate Plan", generating: "Generating...", days: "days",
            dailyCalories: "Daily Calories", protein: "Protein", carbs: "Carbs", fat: "Fat",
            tips: "💡 Nutritionist Tips", day: "Day",
            mealTypes: { Breakfast: "Breakfast", Lunch: "Lunch", Dinner: "Dinner", Snack: "Snack" },
        },
        journal: {
            title: "📓 Food Journal", entries: "{n} entries logged",
            all: "All", today: "Today", week: "Week",
            totalCalories: "Total Calories", avgScore: "Avg Health Score", mealsLogged: "Meals Logged",
            empty: "No entries yet", emptySub: "Scan food to start logging",
        },
        chat: {
            title: "💬 AI Nutrition Assistant", sub: "Personalized advice for {name}",
            placeholder: "Ask about nutrition, meal timing, supplements...", send: "Send",
            greeting: "Hi! I'm Lulu, your AI nutrition assistant. I'm here to help you manage {name}'s nutrition plan. What would you like to know?",
            suggestions: ["What's the best meal timing?", "Suggest high-protein snacks", "Review macro ratios", "Foods to avoid for their goal"],
        },
        features: [
            { icon: "📷", title: "AI Food Scanner", desc: "Instant calorie & macro analysis from food photos" },
            { icon: "🥗", title: "Meal Plan Generator", desc: "Personalized AI meal plans based on goals & diet" },
            { icon: "📓", title: "Food Journal", desc: "Track every meal with full nutrition breakdown" },
            { icon: "💬", title: "AI Chat Assistant", desc: "Real-time nutrition advice for each client" },
        ],
        editProfile: "✏️ Edit Profile", target: "Target", yrs: "yrs",
        bmi: "BMI", allergiesLabel: "Allergies", kcalDay: "kcal/day",
        deleteConfirm: "Delete this client?", signOut: "Sign Out",
    },
    ar: {
        appName: "لولو.نيوتري سكان برو", appSub: "منصة أخصائي التغذية الاحترافية",
        welcome: "مرحباً بك في لولو.نيوتري سكان برو 🌸", welcomeSub: "منصتك الشاملة لإدارة التغذية بالذكاء الاصطناعي",
        noClients: "لا يوجد عملاء بعد", noClientsSub: "أضف أول عميل لبدء إدارة تغذيتهم",
        addFirst: "➕ إضافة أول عميل", selectClient: "اختر عميلاً للبدء",
        yourClients: "عملاؤك", clients: "العملاء", aiPowered: "ذكاء اصطناعي", pro: "برو",
        newClient: "+ جديد",
        tabs: { scanner: "📷 ماسح الطعام", journal: "📓 مجلة الطعام", planner: "🥗 خطة الوجبات", chat: "💬 المساعد الذكي" },
        scanner: {
            title: "📷 صورة الطعام", results: "📊 التحليل الغذائي", drop: "أفلت صورة الطعام هنا",
            browse: "أو انقر للتصفح", upload: "⬆ رفع صورة", analyze: "✨ تحليل القيم الغذائية",
            scanning: "جاري المسح...", analyzing: "جاري التحليل...", noData: "لا توجد بيانات بعد",
            noDataSub: "ارفع صورة طعام وحللها", logBtn: "📋 تسجيل في مجلة العميل",
            logged: "✅ تم التسجيل في مجلة {name}", match: "تطابق", kcal: "سعرة حرارية",
            healthScore: "نقاط الصحة", sodium: "صوديوم", protein: "بروتين",
            sugar: "سكر", carbs: "كربوهيدرات", fat: "دهون", fiber: "ألياف",
        },
        form: {
            addTitle: "➕ عميل جديد", editTitle: "✏️ تعديل العميل",
            name: "الاسم الكامل", namePh: "أحمد محمد", age: "العمر", agePh: "28",
            weight: "الوزن (كجم)", weightPh: "65", height: "الطول (سم)", heightPh: "165",
            goal: "الهدف", diet: "نوع النظام الغذائي", calories: "هدف السعرات اليومية", caloriesPh: "احتساب تلقائي",
            allergies: "الحساسية الغذائية", allergiesPh: "مكسرات، ألبان...", notes: "ملاحظات", notesPh: "ملاحظات سريرية...",
            save: "💾 حفظ التغييرات", add: "✅ إضافة العميل", cancel: "إلغاء",
            goals: [
                { value: "weight-loss", label: "⬇ خسارة الوزن" }, { value: "muscle-gain", label: "💪 بناء العضلات" },
                { value: "maintenance", label: "⚖ الحفاظ على الوزن" }, { value: "endurance", label: "🏃 التحمل" },
                { value: "health", label: "❤️ الصحة العامة" }
            ],
            diets: [
                { value: "standard", label: "عادي" }, { value: "vegetarian", label: "🥗 نباتي" },
                { value: "vegan", label: "🌱 نباتي صرف" }, { value: "keto", label: "🥑 كيتو" },
                { value: "paleo", label: "🥩 باليو" }, { value: "mediterranean", label: "🫒 متوسطي" },
                { value: "low-carb", label: "📉 قليل الكارب" }, { value: "gluten-free", label: "🌾 خالي من الغلوتين" }
            ],
        },
        planner: {
            title: "🥗 مولّد خطة الوجبات", sub: "مخصص بالذكاء الاصطناعي لـ {name}",
            generate: "✨ إنشاء الخطة", generating: "جاري الإنشاء...", days: "أيام",
            dailyCalories: "السعرات اليومية", protein: "بروتين", carbs: "كارب", fat: "دهون",
            tips: "💡 نصائح المختص", day: "اليوم",
            mealTypes: { Breakfast: "فطو", Lunch: "غداء", Dinner: "عشاء", Snack: "وجبة خفيفة" },
        },
        chat: {
            title: "💬 مساعد التغذية الذكي", sub: "نصائح مخصصة لـ {name}",
            placeholder: "اسأل عن التغذية، توقيت الوجبات، المكملات...", send: "إرسال",
            greeting: "مرحباً! أنا لولو، مساعدتك الذكية للتغذية. أنا هنا لمساعدتك في إدارة خطة {name} الغذائية. بماذا يمكنني مساعدتك؟",
            suggestions: ["أفضل توقيت للوجبات؟", "اقتراح وجبات خفيفة غنية بالبروتين", "مراجعة نسب المغذيات", "الأطعمة التي يجب تجنبها"],
        },
        features: [
            { icon: "📷", title: "ماسح الطعام بالذكاء الاصطناعي", desc: "تحليل فوري للسعرات والمغذيات من صور الطعام" },
            { icon: "🥗", title: "مولّد خطة الوجبات", desc: "خطط وجبات مخصصة بالذكاء الاصطناعي" },
            { icon: "📓", title: "مجلة الطعام", desc: "تتبع كل وجبة مع تفاصيل القيم الغذائية" },
            { icon: "💬", title: "المساعد الذكي", desc: "نصائح غذائية فورية لكل عميل" },
        ],
        editProfile: "✏️ تعديل الملف", target: "الهدف", yrs: "سنة",
        bmi: "مؤشر كتلة الجسم", allergiesLabel: "الحساسية", kcalDay: "سعرة/يوم",
        deleteConfirm: "هل تريد حذف هذا العميل؟", signOut: "تسجيل الخروج",
    }
};

// --- Color palette ---
const C = {
    bg: "#080d18", panel: "#0f1623", card: "#141e2e", border: "rgba(255,255,255,0.07)",
    pink: "#ec4899", pinkL: "#f9a8d4",
    green: "#4ade80", purple: "#a78bfa", blue: "#60a5fa", yellow: "#facc15", orange: "#fb923c",
    text: "#f1f5f9", muted: "#64748b", emerald: "#10b981"
};

const Spinner = () => (
    <div className="w-8 h-8 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
);

// --- Shared Components ---
const Badge = ({ children, color = C.pink }) => (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}>
        {children}
    </span>
);

const Btn = ({ children, onClick, variant = "primary", disabled, small, full, className = "" }) => {
    const base = "font-bold transition-all duration-200 flex items-center gap-2 justify-center whitespace-nowrap active:scale-95";
    const variants = {
        primary: `bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20`,
        secondary: `bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10`,
        ghost: `bg-transparent text-slate-400 border border-white/10 hover:text-white hover:border-white/20`,
        green: `bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-lg shadow-emerald-500/20`,
    };
    const size = small ? "px-3 py-1.5 text-xs rounded-lg" : "px-5 py-2.5 text-sm rounded-xl";
    const width = full ? "w-full" : "";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${size} ${width} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            {children}
        </button>
    );
};

const MacroBar = ({ label, value, max, color, unit = "g", dir }) => {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="mb-3">
            <div className={`flex justify-between mb-1 text-[11px] ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-200 font-bold">{value}{unit}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(${dir === "rtl" ? "270deg" : "90deg"},${color}88,${color})`
                    }}
                />
            </div>
        </div>
    );
};

// --- Sub-components ---
const FoodScanner = ({ client, lang }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const t = T[lang].scanner;
    const dir = lang === "ar" ? "rtl" : "ltr";
    const fileRef = useRef();

    const handleFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
        setResult(null);
        setError(null);
    };

    const analyzeImg = async () => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            const blob = await (await fetch(image)).blob();
            formData.append("file", blob, "food.jpg");

            const res = await api.post("/meals/scan", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                setResult(res.data.data);
            } else {
                throw new Error("Analysis failed");
            }
        } catch (e) {
            setError(e.response?.data?.detail || e.message);
        } finally {
            setLoading(false);
        }
    };

    const logToJournal = async () => {
        if (!result) return;
        try {
            await api.post(`/clients/${client.id}/journal`, {
                name: result.name,
                calories: result.calories,
                protein: result.macros?.protein || 0,
                carbs: result.macros?.carbs || 0,
                fats: result.macros?.fats || 0,
                meal_type: "Scan Analysis",
                image_url: null, // We'll skip uploading the full image for now
                health_tip: result.health_tip
            });
            alert(t.logged.replace("{name}", client.name));
        } catch (err) {
            console.error(err);
            alert("Failed to log entry");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir={dir}>
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{t.title}</h3>
                {!image ? (
                    <div
                        onClick={() => fileRef.current.click()}
                        className="border-2 border-dashed border-pink-500/20 rounded-2xl py-16 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/40 transition-colors"
                    >
                        <div className="text-5xl mb-4">🍱</div>
                        <p className="text-slate-200 font-semibold mb-1">{t.drop}</p>
                        <p className="text-slate-500 text-sm mb-6">{t.browse}</p>
                        <Btn variant="primary" small>{t.upload}</Btn>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                            <img src={image} className="w-full h-full object-contain" alt="food" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <Btn full variant="primary" onClick={analyzeImg} disabled={loading}>
                            {loading ? t.analyzing : t.analyze}
                        </Btn>
                    </div>
                )}
                <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
                {error && <p className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">⚠ {error}</p>}
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{t.results}</h3>
                {!result ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-3">
                        <div className="text-4xl opacity-50">🔬</div>
                        <p className="font-semibold">{t.noData}</p>
                        <p className="text-xs">{t.noDataSub}</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-black text-white">{result.name}</h2>
                                <p className="text-xs text-slate-500">serving size estimated</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-pink-500 leading-none">{result.calories}</div>
                                <span className="text-[10px] text-slate-500 uppercase font-bold">{t.kcal}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge color={C.green}>Health Score: {result.health_score || 75}/100</Badge>
                            {result.tags?.map(tag => <Badge key={tag} color={C.blue}>{tag}</Badge>)}
                        </div>

                        <div className="space-y-1">
                            <MacroBar label={t.protein} value={result.macros?.protein || 0} max={60} color={C.pink} dir={dir} />
                            <MacroBar label={t.carbs} value={result.macros?.carbs || 0} max={100} color={C.purple} dir={dir} />
                            <MacroBar label={t.fat} value={result.macros?.fats || 0} max={50} color={C.yellow} dir={dir} />
                        </div>

                        <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-xl">
                            <p className="text-xs leading-relaxed text-pink-200/80 italic">
                                💡 {result.health_tip || "Excellent meal choice! This provides a balanced profile of macros."}
                            </p>
                        </div>
                        <Btn full variant="green" onClick={logToJournal}>{t.logBtn}</Btn>
                    </div>
                )}
            </div>
        </div>
    );
};

const FoodJournal = ({ client, lang }) => {
    const [entries, setEntries] = useState([]);
    const t = T[lang].journal;
    const ts = T[lang].scanner;
    const dir = lang === "ar" ? "rtl" : "ltr";

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const res = await api.get(`/clients/${client.id}/journal`);
                setEntries(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJournal();
    }, [client.id]);

    const stats = [
        { label: t.totalCalories, value: entries.reduce((acc, curr) => acc + (curr.calories || 0), 0), icon: "🔥", color: C.pink },
        { label: t.avgScore, value: entries.length ? Math.round(entries.reduce((acc, curr) => acc + (curr.health_score || 75), 0) / entries.length) : 0, icon: "📊", color: C.green },
        { label: t.mealsLogged, value: entries.length, icon: "📓", color: C.purple },
    ];

    return (
        <div className="space-y-6" dir={dir}>
            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="text-2xl">{s.icon}</div>
                        <div>
                            <div className="text-lg font-black text-white">{s.value}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {entries.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 space-y-2">
                        <div className="text-4xl opacity-20">📓</div>
                        <p>{t.empty}</p>
                    </div>
                ) : (
                    entries.map((entry, idx) => (
                        <div key={idx} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-200">{entry.name}</h4>
                                <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()} • {entry.type}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-pink-500">{entry.calories}</span>
                                <span className="text-[10px] text-slate-500 ml-1 uppercase font-bold">{ts.kcal}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const MealPlanner = ({ client, lang }) => {
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const t = T[lang].planner;
    const dir = lang === "ar" ? "rtl" : "ltr";

    const generatePlan = async () => {
        setLoading(true);
        try {
            const prompt = `Create a 3-day meal plan for ${client.name}. Goal: ${client.goal}, Diet: ${client.diet}. Return only JSON: {"days": [{"day": 1, "meals": [{"type": "Breakfast", "name": "Smoothie", "calories": 350}]}]}`;
            const res = await api.post("/meals/ask", { prompt });
            if (res.data.success) {
                try {
                    const cleanJson = res.data.reply.replace(/```json|```/g, "").trim();
                    setPlan(JSON.parse(cleanJson));
                } catch (parseError) {
                    console.error("JSON parse failed, trying regex extraction", parseError);
                    const match = res.data.reply.match(/\{[\s\S]*\}/);
                    if (match) {
                        setPlan(JSON.parse(match[0]));
                    } else {
                        throw new Error("Could not extract JSON from response");
                    }
                }
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate meal plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6" dir={dir}>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{t.title}</h3>
                <Btn variant="primary" small onClick={generatePlan} disabled={loading}>
                    {loading ? t.generating : t.generate}
                </Btn>
            </div>

            {loading && <div className="py-20 flex justify-center"><Spinner /></div>}

            {plan && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plan.days.map((day, idx) => (
                        <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="font-black text-pink-500 uppercase tracking-widest text-xs">{t.day} {day.day}</h4>
                            <div className="space-y-4">
                                {day.meals.map((meal, midx) => (
                                    <div key={midx} className="border-l-2 border-slate-800 pl-3">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">{meal.type}</div>
                                        <div className="text-sm font-bold text-slate-200">{meal.name}</div>
                                        <div className="text-xs text-pink-500/80">{meal.calories} kcal</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AIChat = ({ client, lang }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([{ role: "assistant", content: T[lang].chat.greeting.replace("{name}", client.name) }]);
    const [loading, setLoading] = useState(false);
    const t = T[lang].chat;
    const dir = lang === "ar" ? "rtl" : "ltr";
    const scrollRef = useRef();

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const prompt = `You are Lulu, a pro nutritionist assistant helping with client ${client.name} (Goal: ${client.goal}). Answer this: ${userMsg}. Keep it short and pro.`;
            const res = await api.post("/meals/ask", { prompt });
            if (res.data.success) {
                setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px]" dir={dir}>
            <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-6">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-pink-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none border border-white/5"}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-xs text-slate-500 animate-pulse italic">Lulu is typing...</div>}
                <div ref={scrollRef} />
            </div>
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-white/10">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder={t.placeholder}
                    className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                />
                <Btn variant="primary" small onClick={handleSend} disabled={loading}>Send</Btn>
            </div>
        </div>
    );
};

// --- EXPERT DASHBOARD ---
const ExpertDashboard = () => {
    const { user, logout } = useAuth();
    const { language: lang, toggleLanguage, dir } = useLanguage();
    const [tab, setTab] = useState("scanner");
    const [clients, setClients] = useState([]);
    const [activeClient, setActiveClient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const t = T[lang];

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients/');
            setClients(res.data);
        } catch (err) {
            console.error("Failed to fetch clients:", err);
        }
    };

    useEffect(() => {
        if (user) fetchClients();
    }, [user?.id]);

    const saveClient = async (clientData) => {
        try {
            await api.post('/clients/', clientData);
            await fetchClients();
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save client");
        }
    };

    return (
        <div className={`min-h-screen bg-[#080d18] text-slate-200 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={dir}>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className={`w-72 bg-slate-900/80 border-slate-800 flex flex-col ${dir === "rtl" ? "border-l order-2" : "border-r"}`}>
                    <div className="p-6 border-b border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">lulu.pro</h1>
                            <button onClick={toggleLanguage} className="text-xs font-bold px-2 py-1 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition-colors">
                                {lang === "en" ? "AR" : "EN"}
                            </button>
                        </div>
                        <Btn full variant="primary" small onClick={() => setShowForm(true)}>{t.newClient}</Btn>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">{t.yourClients}</h4>
                        {clients.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setActiveClient(c)}
                                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${activeClient?.id === c.id ? "bg-pink-500/10 border border-pink-500/30 text-white" : "hover:bg-white/5 text-slate-400 border border-transparent"}`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center font-bold text-pink-500 text-xs uppercase">
                                    {c.name.slice(0, 2)}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate">{c.name}</p>
                                    <p className="text-[10px] opacity-60 uppercase">{c.goal}</p>
                                </div>
                            </button>
                        ))}
                        {clients.length === 0 && (
                            <div className="py-12 text-center space-y-2">
                                <span className="text-3xl block">👥</span>
                                <p className="text-xs text-slate-500 font-medium">{t.noClients}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-slate-900/50">
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <div className="text-sm font-bold text-pink-500">{clients.length}</div>
                                <div className="text-[8px] uppercase font-bold text-slate-500">{t.clients}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-emerald-500">LIVE</div>
                                <div className="text-[8px] uppercase font-bold text-slate-500">{t.aiPowered}</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full bg-[#080d1e] relative">
                    {!activeClient && (
                        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center p-12 space-y-8 animate-in fade-in duration-700">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-white">{t.welcome}</h2>
                                <p className="text-slate-400 text-lg">{t.welcomeSub}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                {t.features.map(f => (
                                    <div key={f.title} className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-left space-y-3">
                                        <span className="text-3xl">{f.icon}</span>
                                        <h4 className="font-bold text-white text-sm">{f.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <Btn variant="primary" onClick={() => setShowForm(true)}>{t.addFirst}</Btn>

                            <Btn variant="primary" onClick={() => setShowForm(true)}>{t.addFirst}</Btn>

                            <button
                                onClick={logout}
                                className="text-xs text-slate-500 hover:text-red-400 transition-colors font-bold uppercase tracking-widest mt-4"
                            >
                                {t.signOut} 🚪
                            </button>
                        </div>
                    )}

                    {activeClient && (
                        <>
                            <header className="px-8 py-5 border-b border-white/5 bg-slate-900/30 flex justify-between items-center backdrop-blur-md">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                            {activeClient.name}
                                            <Badge color={C.emerald}>{activeClient.goal}</Badge>
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {activeClient.age} yrs • {activeClient.weight}kg • {activeClient.diet}
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expert Access</span>
                                        <span className="text-xs font-bold text-emerald-400">{user?.full_name || user?.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        {["scanner", "journal", "planner", "chat"].map(tabId => (
                                            <button
                                                key={tabId}
                                                onClick={() => setTab(tabId)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === tabId ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
                                            >
                                                {t.tabs[tabId]}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2.5 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/10 border border-red-500/10 transition-all text-xs font-bold"
                                        title={T[lang].signOut}
                                    >
                                        🚪
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={tab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {tab === "scanner" && <FoodScanner client={activeClient} lang={lang} />}
                                        {tab === "journal" && <FoodJournal client={activeClient} lang={lang} />}
                                        {tab === "planner" && <MealPlanner client={activeClient} lang={lang} />}
                                        {tab === "chat" && <AIChat client={activeClient} lang={lang} />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                    {/* Modal Form */}
                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-black text-white">{t.form.addTitle}</h3>
                                    <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">✕</button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.form.name}</label>
                                        <input id="cn" type="text" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" placeholder={t.form.namePh} />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Email <span className="opacity-50 lowercase tracking-normal">(optional, links to user app account)</span></label>
                                        <input id="ce" type="email" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" placeholder="client@example.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.form.age}</label>
                                        <input id="ca" type="number" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" placeholder={t.form.agePh} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.form.weight}</label>
                                        <input id="cw" type="number" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" placeholder={t.form.weightPh} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.form.goal}</label>
                                        <select id="cg" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none">
                                            {t.form.goals.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">{t.form.diet}</label>
                                        <select id="cd" className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none">
                                            {t.form.diets.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Btn full variant="secondary" onClick={() => setShowForm(false)}>{t.form.cancel}</Btn>
                                    <Btn full variant="primary" onClick={() => {
                                        const name = document.getElementById("cn").value;
                                        if (!name) return;
                                        saveClient({
                                            name,
                                            email: document.getElementById("ce").value || null,
                                            age: parseInt(document.getElementById("ca").value) || 0,
                                            weight: parseFloat(document.getElementById("cw").value) || 0,
                                            goal: document.getElementById("cg").value,
                                            diet: document.getElementById("cd").value,
                                            notes: ""
                                        });
                                    }}>{t.form.add}</Btn>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ExpertDashboard;
