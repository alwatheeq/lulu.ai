import { useState, useRef, useCallback, useEffect } from "react";

// ─── Storage ───────────────────────────────────────────────────────────────────
const store = {
  get: async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

// ─── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "lulu.nutriscan", appSub: "Nutritionist Pro Platform",
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
    deleteConfirm: "Delete this client?",
  },
  ar: {
    appName: "لولو.نيوتري سكان", appSub: "منصة أخصائي التغذية الاحترافية",
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
      mealTypes: { Breakfast: "فطور", Lunch: "غداء", Dinner: "عشاء", Snack: "وجبة خفيفة" },
    },
    journal: {
      title: "📓 مجلة الطعام", entries: "{n} وجبة مسجلة",
      all: "الكل", today: "اليوم", week: "الأسبوع",
      totalCalories: "مجموع السعرات", avgScore: "متوسط نقاط الصحة", mealsLogged: "وجبات مسجلة",
      empty: "لا توجد مدخلات بعد", emptySub: "امسح طعامك لبدء التسجيل",
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
    deleteConfirm: "هل تريد حذف هذا العميل؟",
  }
};

// ─── Color palette ─────────────────────────────────────────────────────────────
const C = {
  bg: "#080d18", panel: "#0f1623", card: "#141e2e", border: "rgba(255,255,255,0.07)",
  pink: "#ec4899", pinkL: "#f9a8d4",
  green: "#4ade80", purple: "#a78bfa", blue: "#60a5fa", yellow: "#facc15", orange: "#fb923c",
  text: "#f1f5f9", muted: "#64748b",
};

// ─── Shared UI ─────────────────────────────────────────────────────────────────
const Badge = ({ children, color = C.pink }) => (
  <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: `${color}18`, color, border: `1px solid ${color}30`, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", disabled, small, full, style: sx }) => {
  const base = { cursor: disabled ? "not-allowed" : "pointer", borderRadius: small ? 8 : 10, border: "none", fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s ease", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center", whiteSpace: "nowrap", padding: small ? "7px 14px" : "11px 20px", fontSize: small ? 12 : 13, width: full ? "100%" : undefined };
  const variants = {
    primary: { background: `linear-gradient(135deg,${C.pink},#a855f7)`, color: "#fff", boxShadow: `0 6px 20px ${C.pink}35` },
    secondary: { background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}` },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    green: { background: `linear-gradient(135deg,${C.green},#22c55e)`, color: "#052e16", boxShadow: `0 6px 20px ${C.green}30` },
  };
  return <button style={{ ...base, ...variants[variant], ...sx }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const FInput = ({ label, value, onChange, placeholder, type = "text", required, dir }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: dir === "rtl" ? 0 : "0.09em", fontWeight: 700, marginBottom: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{label}{required && <span style={{ color: C.pink }}> *</span>}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir}
      style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border 0.2s", textAlign: dir === "rtl" ? "right" : "left" }}
      onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
  </div>
);

const FSelect = ({ label, value, onChange, options, dir }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0, fontWeight: 700, marginBottom: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} dir={dir}
      style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", cursor: "pointer", textAlign: dir === "rtl" ? "right" : "left" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({ children, style: sx, onClick }) => (
  <div onClick={onClick} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: onClick ? "pointer" : undefined, transition: "border-color 0.2s", ...sx }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = `${C.pink}50`)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = C.border)}>
    {children}
  </div>
);

const MacroBar = ({ label, value, max, color, unit = "g", dir }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
        <span style={{ fontSize: 11, color: C.text, fontWeight: 700 }}>{value}{unit}</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(${dir === "rtl" ? "270deg" : "90deg"},${color}88,${color})`, borderRadius: 4, transition: "width 1s ease", marginLeft: dir === "rtl" ? "auto" : 0 }} />
      </div>
    </div>
  );
};

const Spinner = () => (
  <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${C.pink}20`, borderTop: `3px solid ${C.pink}`, animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
);

// ─── Language Toggle Button ────────────────────────────────────────────────────
const LangToggle = ({ lang, setLang }) => (
  <button onClick={() => setLang(l => l === "en" ? "ar" : "en")}
    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.04)", color: C.text, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}
    onMouseEnter={e => e.currentTarget.style.borderColor = C.pink}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
    <span style={{ fontSize: 16 }}>{lang === "en" ? "🇸🇦" : "🇬🇧"}</span>
    <span style={{ fontSize: 12 }}>{lang === "en" ? "العربية" : "English"}</span>
  </button>
);

// ─── FOOD SCANNER ───────────────────────────────────────────────────────────────
function FoodScanner({ client, lang }) {
  const t = T[lang].scanner;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logged, setLogged] = useState(false);
  const fileRef = useRef();

  const FOOD_PROMPT = lang === "ar"
    ? `أنت ذكاء اصطناعي متخصص في التغذية السريرية. حلل صورة الطعام وأعد فقط JSON صالح:
{"foodName":"","confidence":85,"servingSize":"","calories":0,"protein":0,"sugar":0,"carbs":0,"fat":0,"fiber":0,"sodium":0,"ingredients":[],"healthScore":75,"tags":[],"insight":""}
الأرقام فقط (بدون نصوص). healthScore/confidence من 0-100. أعد JSON فقط باللغة العربية.`
    : `You are a clinical nutrition AI. Analyze the food image and return ONLY valid JSON:
{"foodName":"","confidence":85,"servingSize":"","calories":0,"protein":0,"sugar":0,"carbs":0,"fat":0,"fiber":0,"sodium":0,"ingredients":[],"healthScore":75,"tags":[],"insight":""}
Numbers only. healthScore/confidence 0-100. Return ONLY JSON.`;

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target.result); setImageData(e.target.result.split(",")[1]);
      setMimeType(file.type || "image/jpeg"); setResult(null); setError(null); setLogged(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyze = async () => {
    if (!imageData) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: FOOD_PROMPT,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: imageData } },
            { type: "text", text: lang === "ar" ? "حلل القيم الغذائية في هذه الصورة. أعد JSON فقط." : "Analyze nutrition in this food image. Return only JSON." }
          ]}]
        })
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON returned");
      setResult(JSON.parse(match[0]));
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const logMeal = async () => {
    if (!result || !client) return;
    const entry = { id: Date.now(), date: new Date().toISOString(), image, ...result };
    const existing = await store.get(`logs:${client.id}`) || [];
    await store.set(`logs:${client.id}`, [entry, ...existing]);
    setLogged(true);
  };

  const hColor = result ? (result.healthScore >= 70 ? C.green : result.healthScore >= 45 ? C.yellow : "#f87171") : C.pink;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} dir={dir}>
      <Card>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>{t.title}</div>
        {!image ? (
          <div onClick={() => fileRef.current.click()} onDrop={e => { e.preventDefault(); processFile(e.dataTransfer.files[0]); }} onDragOver={e => e.preventDefault()}
            style={{ border: `2px dashed rgba(236,72,153,0.25)`, borderRadius: 14, padding: "48px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(236,72,153,0.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)"}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🍱</div>
            <div style={{ fontSize: 15, color: C.text, fontWeight: 600, marginBottom: 6 }}>{t.drop}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>{t.browse}</div>
            <Btn variant="primary" small>{t.upload}</Btn>
          </div>
        ) : (
          <div>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
              <img src={image} alt="food" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
              {loading && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(8,13,24,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, backdropFilter: "blur(4px)" }}>
                  <Spinner /><span style={{ color: C.pinkL, fontSize: 13, fontWeight: 600 }}>{t.analyzing}</span>
                </div>
              )}
              <button onClick={() => { setImage(null); setResult(null); setLogged(false); }}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(8,13,24,0.8)", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>✕</button>
            </div>
            {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 12px", color: "#fca5a5", fontSize: 12, marginBottom: 12 }}>⚠ {error}</div>}
            <Btn variant="primary" onClick={analyze} disabled={loading} full>{loading ? t.scanning : t.analyze}</Btn>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />
      </Card>

      <Card>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>{t.results}</div>
        {!result ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, color: C.muted, textAlign: "center", gap: 8 }}>
            <div style={{ fontSize: 36 }}>🔬</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t.noData}</div>
            <div style={{ fontSize: 12 }}>{t.noDataSub}</div>
          </div>
        ) : (
          <div style={{ animation: "fadein 0.4s ease", overflowY: "auto", maxHeight: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 2 }}>{result.foodName}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{result.servingSize}</div>
              </div>
              <div style={{ textAlign: dir === "rtl" ? "left" : "right" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.pink, lineHeight: 1 }}>{result.calories}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{t.kcal}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
              {result.tags?.map(tg => <Badge key={tg}>{tg}</Badge>)}
              <Badge color={C.green}>🎯 {result.confidence}% {t.match}</Badge>
            </div>
            <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
            <MacroBar label={t.protein} value={Math.round(result.protein)} max={60} color={C.pink} dir={dir} />
            <MacroBar label={t.sugar} value={Math.round(result.sugar)} max={50} color={C.orange} dir={dir} />
            <MacroBar label={t.carbs} value={Math.round(result.carbs)} max={100} color={C.purple} dir={dir} />
            <MacroBar label={t.fat} value={Math.round(result.fat)} max={60} color={C.yellow} dir={dir} />
            <MacroBar label={t.fiber} value={Math.round(result.fiber)} max={30} color={C.green} dir={dir} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, marginBottom: 12 }}>
              <div style={{ background: C.card, borderRadius: 10, padding: "10px 12px", textAlign: dir === "rtl" ? "right" : "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: hColor }}>{result.healthScore}/100</div>
                <div style={{ fontSize: 10, color: C.muted }}>{t.healthScore}</div>
              </div>
              <div style={{ background: C.card, borderRadius: 10, padding: "10px 12px", textAlign: dir === "rtl" ? "right" : "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{result.sodium}mg</div>
                <div style={{ fontSize: 10, color: C.muted }}>{t.sodium}</div>
              </div>
            </div>
            {result.insight && (
              <div style={{ background: `${C.pink}08`, border: `1px solid ${C.pink}18`, borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#d1a0b8", lineHeight: 1.7, marginBottom: 12, textAlign: dir === "rtl" ? "right" : "left" }}>
                💡 {result.insight}
              </div>
            )}
            {client && (
              logged
                ? <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}25`, borderRadius: 10, padding: "10px 14px", color: C.green, fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                    {t.logged.replace("{name}", client.name)}
                  </div>
                : <Btn variant="green" full onClick={logMeal}>{t.logBtn}</Btn>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── CLIENT FORM ────────────────────────────────────────────────────────────────
function ClientForm({ initial, onSave, onCancel, lang }) {
  const t = T[lang].form;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const empty = { name: "", age: "", weight: "", height: "", goal: "weight-loss", diet: "standard", allergies: "", targetCalories: "", notes: "" };
  const [form, setForm] = useState(initial || empty);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ animation: "fadein 0.3s ease" }} dir={dir}>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 20, textAlign: dir === "rtl" ? "right" : "left" }}>{initial ? t.editTitle : t.addTitle}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <FInput label={t.name} value={form.name} onChange={set("name")} placeholder={t.namePh} required dir={dir} />
        <FInput label={t.age} value={form.age} onChange={set("age")} type="number" placeholder={t.agePh} dir={dir} />
        <FInput label={t.weight} value={form.weight} onChange={set("weight")} type="number" placeholder={t.weightPh} dir={dir} />
        <FInput label={t.height} value={form.height} onChange={set("height")} type="number" placeholder={t.heightPh} dir={dir} />
        <FSelect label={t.goal} value={form.goal} onChange={set("goal")} options={t.goals} dir={dir} />
        <FSelect label={t.diet} value={form.diet} onChange={set("diet")} options={t.diets} dir={dir} />
        <FInput label={t.calories} value={form.targetCalories} onChange={set("targetCalories")} type="number" placeholder={t.caloriesPh} dir={dir} />
        <FInput label={t.allergies} value={form.allergies} onChange={set("allergies")} placeholder={t.allergiesPh} dir={dir} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{t.notes}</label>
        <textarea value={form.notes} onChange={e => set("notes")(e.target.value)} placeholder={t.notesPh} dir={dir}
          style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 80, outline: "none", boxSizing: "border-box", textAlign: dir === "rtl" ? "right" : "left" }}
          onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: dir === "rtl" ? "flex-start" : "flex-end" }}>
        {onCancel && <Btn variant="ghost" onClick={onCancel}>{t.cancel}</Btn>}
        <Btn variant="primary" onClick={() => { if (!form.name) return; onSave({ ...form, id: initial?.id || Date.now() }); }}>
          {initial ? t.save : t.add}
        </Btn>
      </div>
    </div>
  );
}

// ─── MEAL PLANNER ──────────────────────────────────────────────────────────────
function MealPlanner({ client, lang }) {
  const t = T[lang].planner;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [days, setDays] = useState("7");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  const PROMPT = lang === "ar"
    ? `أنت أخصائي تغذية محترف. أنشئ خطة وجبات لـ ${days} أيام لـ:
الاسم: ${client.name}، العمر: ${client.age}، الوزن: ${client.weight}كجم، الطول: ${client.height}سم
الهدف: ${client.goal}، الحساسية: ${client.allergies || "لا يوجد"}، النظام: ${client.diet || "عادي"}
هدف السعرات: ${client.targetCalories || "تلقائي"}
أعد JSON فقط: {"dailyCalories":2000,"macros":{"protein":150,"carbs":200,"fat":67},"days":[{"day":1,"meals":[{"type":"Breakfast","name":"","calories":0,"protein":0,"carbs":0,"fat":0,"notes":""}]}],"tips":["نصيحة"]}`
    : `You are a professional nutritionist. Create a ${days}-day meal plan for:
Name: ${client.name}, Age: ${client.age}, Weight: ${client.weight}kg, Height: ${client.height}cm
Goal: ${client.goal}, Allergies: ${client.allergies || "none"}, Diet: ${client.diet || "standard"}
Daily calories: ${client.targetCalories || "auto"}
Return ONLY JSON: {"dailyCalories":2000,"macros":{"protein":150,"carbs":200,"fat":67},"days":[{"day":1,"meals":[{"type":"Breakfast","name":"","calories":0,"protein":0,"carbs":0,"fat":0,"notes":""}]}],"tips":["tip"]}`;

  useEffect(() => { store.get(`mealplan:${client.id}`).then(p => p && setPlan(p)); }, [client.id]);

  const generate = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages: [{ role: "user", content: PROMPT }] })
      });
      const data = await res.json();
      const match = (data.content?.[0]?.text || "").match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No plan");
      const parsed = JSON.parse(match[0]);
      setPlan(parsed); await store.set(`mealplan:${client.id}`, parsed);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const mealColors = { Breakfast: C.yellow, Lunch: C.green, Dinner: C.purple, Snack: C.orange };

  return (
    <div dir={dir}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{t.title}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.sub.replace("{name}", client.name)}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={days} onChange={e => setDays(e.target.value)}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 12, fontFamily: "inherit" }}>
            {[3,5,7,14].map(d => <option key={d} value={d}>{d} {t.days}</option>)}
          </select>
          <Btn variant="primary" onClick={generate} disabled={loading}>{loading ? t.generating : t.generate}</Btn>
        </div>
      </div>

      {loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, gap: 16 }}><Spinner /><div style={{ color: C.muted, fontSize: 14 }}>{t.generating}</div></div>}
      {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 13 }}>⚠ {error}</div>}

      {plan && !loading && (
        <div style={{ animation: "fadein 0.4s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: t.dailyCalories, value: `${plan.dailyCalories}`, icon: "🔥", color: C.pink },
              { label: t.protein, value: `${plan.macros?.protein}g`, icon: "💪", color: C.purple },
              { label: t.carbs, value: `${plan.macros?.carbs}g`, icon: "🌾", color: C.yellow },
              { label: t.fat, value: `${plan.macros?.fat}g`, icon: "🥑", color: C.green },
            ].map(s => (
              <Card key={s.label} style={{ padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{s.label}</div>
              </Card>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4, justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
            {plan.days?.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 8, border: `1px solid ${i === activeDay ? C.pink : C.border}`, background: i === activeDay ? `${C.pink}18` : "transparent", color: i === activeDay ? C.pink : C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {t.day} {d.day}
              </button>
            ))}
          </div>
          {plan.days?.[activeDay] && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {plan.days[activeDay].meals?.map((meal, i) => (
                <Card key={i} style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                    <Badge color={mealColors[meal.type] || C.pink}>{t.mealTypes[meal.type] || meal.type}</Badge>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.pink }}>{meal.calories} {T[lang].scanner.kcal}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{meal.name}</div>
                  <div style={{ display: "flex", gap: 10, justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
                    <span style={{ fontSize: 11, color: C.muted }}>P: <b style={{ color: C.text }}>{meal.protein}g</b></span>
                    <span style={{ fontSize: 11, color: C.muted }}>C: <b style={{ color: C.text }}>{meal.carbs}g</b></span>
                    <span style={{ fontSize: 11, color: C.muted }}>F: <b style={{ color: C.text }}>{meal.fat}g</b></span>
                  </div>
                  {meal.notes && <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic", marginTop: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{meal.notes}</div>}
                </Card>
              ))}
            </div>
          )}
          {plan.tips?.length > 0 && (
            <div style={{ marginTop: 20, background: `${C.green}08`, border: `1px solid ${C.green}20`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 10, textAlign: dir === "rtl" ? "right" : "left" }}>{t.tips}</div>
              {plan.tips.map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: "#86efac", marginBottom: 6, paddingLeft: dir === "rtl" ? 0 : 14, paddingRight: dir === "rtl" ? 14 : 0, borderLeft: dir === "rtl" ? "none" : `2px solid ${C.green}40`, borderRight: dir === "rtl" ? `2px solid ${C.green}40` : "none", textAlign: dir === "rtl" ? "right" : "left" }}>{tip}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FOOD JOURNAL ──────────────────────────────────────────────────────────────
function FoodJournal({ client, lang }) {
  const t = T[lang].journal;
  const ts = T[lang].scanner;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { store.get(`logs:${client.id}`).then(l => setLogs(l || [])); }, [client.id]);

  const filtered = filter === "all" ? logs : logs.filter(l => {
    const d = new Date(l.date), now = new Date();
    if (filter === "today") return d.toDateString() === now.toDateString();
    if (filter === "week") return (now - d) < 7 * 86400000;
    return true;
  });

  const totalCal = filtered.reduce((s, l) => s + (l.calories || 0), 0);
  const avgScore = filtered.length ? Math.round(filtered.reduce((s, l) => s + (l.healthScore || 0), 0) / filtered.length) : 0;

  const deleteLog = async (id) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated); await store.set(`logs:${client.id}`, updated);
  };

  const filterLabels = { all: t.all, today: t.today, week: t.week };

  return (
    <div dir={dir}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{t.title}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.entries.replace("{n}", logs.length)}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "today", "week"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${f === filter ? C.pink : C.border}`, background: f === filter ? `${C.pink}18` : "transparent", color: f === filter ? C.pink : C.muted, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: t.totalCalories, value: `${totalCal}`, icon: "🔥", color: C.pink },
            { label: t.avgScore, value: `${avgScore}/100`, icon: "💚", color: C.green },
            { label: t.mealsLogged, value: filtered.length, icon: "📋", color: C.purple },
          ].map(s => (
            <Card key={s.label} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{s.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{t.empty}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{t.emptySub}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(log => {
            const hc = log.healthScore >= 70 ? C.green : log.healthScore >= 45 ? C.yellow : "#f87171";
            return (
              <Card key={log.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                {log.image && <img src={log.image} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{log.foodName}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.pink }}>{log.calories} {ts.kcal}</div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{new Date(log.date).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
                    <span style={{ fontSize: 11, color: C.muted }}>{ts.protein}: <b style={{ color: C.text }}>{Math.round(log.protein)}g</b></span>
                    <span style={{ fontSize: 11, color: C.muted }}>{ts.carbs}: <b style={{ color: C.text }}>{Math.round(log.carbs)}g</b></span>
                    <span style={{ fontSize: 11, color: C.muted }}>{ts.fat}: <b style={{ color: C.text }}>{Math.round(log.fat)}g</b></span>
                    <Badge color={hc}>{ts.healthScore}: {log.healthScore}</Badge>
                  </div>
                </div>
                <button onClick={() => deleteLog(log.id)}
                  style={{ background: "none", border: "none", color: "transparent", cursor: "pointer", fontSize: 16, padding: 4, transition: "color 0.2s", flexShrink: 0 }}
                  onMouseEnter={e => e.target.style.color = "#f87171"} onMouseLeave={e => e.target.style.color = "transparent"}>🗑</button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── AI CHAT ──────────────────────────────────────────────────────────────────
function AIChat({ client, lang }) {
  const t = T[lang].chat;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const [messages, setMessages] = useState([
    { role: "assistant", content: t.greeting.replace("{name}", client.name) }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const SYSTEM = lang === "ar"
    ? `أنت لولو، مساعدة ذكاء اصطناعي دافئة ومحترفة في التغذية. تساعد في إدارة العميل: ${client.name}، الهدف: ${client.goal}، النظام الغذائي: ${client.diet || "عادي"}، الحساسية: ${client.allergies || "لا يوجد"}. أجب باللغة العربية بشكل موجز ومحترف.`
    : `You are Lulu, a warm professional AI nutritionist. Helping with client: ${client.name}, Goal: ${client.goal}, Diet: ${client.diet || "standard"}, Allergies: ${client.allergies || "none"}. Be concise, evidence-based, friendly and professional.`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: SYSTEM,
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.content?.[0]?.text || "..." }]);
    } catch { setMessages(m => [...m, { role: "assistant", content: lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Connection error. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 500 }} dir={dir}>
      <div style={{ textAlign: dir === "rtl" ? "right" : "left", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{t.title}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.sub.replace("{name}", client.name)}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, maxHeight: 380 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? (dir === "rtl" ? "flex-start" : "flex-end") : (dir === "rtl" ? "flex-end" : "flex-start"), gap: 8, flexDirection: dir === "rtl" && m.role === "assistant" ? "row-reverse" : "row" }}>
            {m.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>🌸</div>}
            <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? `linear-gradient(135deg,${C.pink},${C.purple})` : C.card, color: C.text, fontSize: 13, lineHeight: 1.7, border: m.role === "assistant" ? `1px solid ${C.border}` : "none", textAlign: dir === "rtl" ? "right" : "left" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🌸</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "14px 14px 14px 4px", padding: "10px 14px", display: "flex", gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.pink, animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
        {t.suggestions.map(s => (
          <button key={s} onClick={() => setInput(s)}
            style={{ fontSize: 11, padding: "5px 10px", borderRadius: 20, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = C.pink; e.target.style.color = C.pink; }}
            onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.muted; }}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={t.placeholder} dir={dir}
          style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", color: C.text, fontSize: 13, fontFamily: "inherit", outline: "none", textAlign: dir === "rtl" ? "right" : "left" }}
          onFocus={e => e.target.style.borderColor = C.pink} onBlur={e => e.target.style.borderColor = C.border} />
        <Btn variant="primary" onClick={send} disabled={loading || !input.trim()}>{t.send}</Btn>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function NutriSystem() {
  const [lang, setLang] = useState("en");
  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [tab, setTab] = useState("scanner");
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const t = T[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    store.get("lang").then(l => l && setLang(l));
    store.get("clients").then(c => { if (c) setClients(c); setLoaded(true); });
  }, []);

  const changeLang = (fn) => {
    setLang(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      store.set("lang", next);
      return next;
    });
  };

  const saveClients = async (list) => { setClients(list); await store.set("clients", list); };

  const addClient = async (c) => {
    const list = editClient ? clients.map(x => x.id === c.id ? c : x) : [c, ...clients];
    await saveClients(list);
    if (editClient && activeClient?.id === c.id) setActiveClient(c);
    setShowForm(false); setEditClient(null);
  };

  const deleteClient = async (id) => {
    if (!confirm(t.deleteConfirm)) return;
    const list = clients.filter(c => c.id !== id);
    await saveClients(list);
    if (activeClient?.id === id) setActiveClient(null);
  };

  const TABS = [
    { id: "scanner", label: t.tabs.scanner },
    { id: "journal", label: t.tabs.journal },
    { id: "planner", label: t.tabs.planner },
    { id: "chat", label: t.tabs.chat },
  ];

  const goalIcons = { "weight-loss": "⬇", "muscle-gain": "💪", maintenance: "⚖", endurance: "🏃", health: "❤️" };
  const goalColors = { "weight-loss": C.pink, "muscle-gain": C.purple, maintenance: C.green, endurance: C.yellow, health: C.blue };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Noto Sans Arabic', 'Segoe UI', sans-serif" : "'DM Sans', sans-serif", display: "flex", color: C.text }} dir={dir}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:10px}
      `}</style>

      {/* ── Sidebar ── */}
      <div style={{ width: 280, background: C.panel, borderRight: dir === "ltr" ? `1px solid ${C.border}` : "none", borderLeft: dir === "rtl" ? `1px solid ${C.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0, order: dir === "rtl" ? 2 : 0 }}>
        {/* Logo + Lang */}
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            <div>
              <div style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "DM Sans, sans-serif", fontSize: lang === "ar" ? 17 : 20, fontWeight: 800, color: C.green }}>{t.appName}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{t.appSub}</div>
            </div>
            <LangToggle lang={lang} setLang={changeLang} />
          </div>
        </div>

        {/* Add client button */}
        <div style={{ padding: "12px 12px 0" }}>
          <Btn variant="primary" full small onClick={() => { setShowForm(true); setEditClient(null); }}>
            {t.newClient}
          </Btn>
        </div>

        {/* Client list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 10, marginTop: 6, textAlign: dir === "rtl" ? "right" : "left" }}>{t.yourClients}</div>
          {!loaded ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><Spinner /></div>
          ) : clients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 16px", color: C.muted }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{t.noClients}</div>
            </div>
          ) : (
            clients.map(c => (
              <div key={c.id} style={{ marginBottom: 6 }}>
                <div onClick={() => { setActiveClient(c); setTab("scanner"); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: activeClient?.id === c.id ? `${C.pink}14` : "transparent", border: `1px solid ${activeClient?.id === c.id ? `${C.pink}30` : "transparent"}`, transition: "all 0.15s", flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${C.pink}30,${C.purple}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: C.pink, flexShrink: 0 }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: dir === "rtl" ? "right" : "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {goalIcons[c.goal]} {c.goal?.replace("-", " ")}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteClient(c.id); }}
                    style={{ background: "none", border: "none", color: "transparent", cursor: "pointer", fontSize: 12, padding: 2, transition: "color 0.2s", flexShrink: 0 }}
                    onMouseEnter={e => e.target.style.color = "#f87171"} onMouseLeave={e => e.target.style.color = "transparent"}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer stats */}
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}`, background: C.card }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              { val: clients.length, label: t.clients, color: C.pink },
              { val: t.aiPowered, label: "AI", color: C.green },
              { val: t.pro, label: "Pro", color: C.purple },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.panel, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
          <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
            {activeClient ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{activeClient.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {goalIcons[activeClient.goal]} {activeClient.goal?.replace("-", " ")} · {activeClient.diet || "standard"}
                  {activeClient.age ? ` · ${activeClient.age} ${t.yrs}` : ""}
                  {activeClient.targetCalories ? ` · ${activeClient.targetCalories} ${t.kcalDay}` : ""}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>{t.selectClient}</div>
            )}
          </div>
          {activeClient && (
            <Btn variant="ghost" small onClick={() => { setEditClient(activeClient); setShowForm(true); }}>{t.editProfile}</Btn>
          )}
        </div>

        {/* Tabs */}
        {activeClient && (
          <div style={{ padding: "0 28px", borderBottom: `1px solid ${C.border}`, background: C.panel, display: "flex", gap: 0, flexShrink: 0, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
            {TABS.map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                style={{ padding: "13px 18px", background: "none", border: "none", borderBottom: `2px solid ${tab === tb.id ? C.pink : "transparent"}`, color: tab === tb.id ? C.pink : C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.2s", marginBottom: -1 }}>
                {tb.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {/* Form modal */}
          {showForm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: 20 }}>
              <div style={{ background: C.panel, borderRadius: 20, padding: 28, width: "100%", maxWidth: 640, border: `1px solid ${C.border}`, maxHeight: "90vh", overflowY: "auto", animation: "fadein 0.3s ease" }}>
                <ClientForm initial={editClient} onSave={addClient} onCancel={() => { setShowForm(false); setEditClient(null); }} lang={lang} />
              </div>
            </div>
          )}

          {!activeClient ? (
            <div style={{ animation: "fadein 0.5s ease" }} dir={dir}>
              <div style={{ marginBottom: 24, textAlign: dir === "rtl" ? "right" : "left" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 4 }}>{t.welcome}</div>
                <div style={{ fontSize: 14, color: C.muted }}>{t.welcomeSub}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 28 }}>
                {t.features.map(f => (
                  <Card key={f.title} style={{ padding: 20, textAlign: dir === "rtl" ? "right" : "left" }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 6 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
                  </Card>
                ))}
              </div>

              {clients.length > 0 && (
                <>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 14, textAlign: dir === "rtl" ? "right" : "left" }}>{t.yourClients}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                    {clients.map(c => {
                      const bmi = c.weight && c.height ? (c.weight / ((c.height/100)**2)).toFixed(1) : null;
                      return (
                        <Card key={c.id} onClick={() => { setActiveClient(c); setTab("scanner"); }} style={{ padding: 18 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "center", flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg,${C.pink}33,${C.purple}33)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: `1px solid ${C.pink}25` }}>{c.name[0].toUpperCase()}</div>
                              <div style={{ textAlign: dir === "rtl" ? "right" : "left" }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{c.name}</div>
                                <div style={{ fontSize: 11, color: C.muted }}>{c.age ? `${c.age} ${t.yrs}` : ""} {c.weight ? `· ${c.weight}kg` : ""}</div>
                              </div>
                            </div>
                            <button onClick={e => { e.stopPropagation(); setEditClient(c); setShowForm(true); }}
                              style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 8px", color: C.muted, fontSize: 11, cursor: "pointer" }}>✏️</button>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: dir === "rtl" ? "flex-end" : "flex-start" }}>
                            <Badge color={goalColors[c.goal] || C.pink}>{goalIcons[c.goal]} {c.goal?.replace("-", " ")}</Badge>
                            {c.diet && c.diet !== "standard" && <Badge color={C.blue}>{c.diet}</Badge>}
                            {bmi && <Badge color={bmi < 25 ? C.green : C.yellow}>{t.bmi}: {bmi}</Badge>}
                            {c.targetCalories && <Badge color={C.orange}>🔥 {c.targetCalories} {t.kcalDay}</Badge>}
                          </div>
                          {c.allergies && <div style={{ marginTop: 8, fontSize: 11, color: C.muted, textAlign: dir === "rtl" ? "right" : "left" }}>⚠ {t.allergiesLabel}: {c.allergies}</div>}
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}

              {clients.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>👩‍⚕️</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t.noClients}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>{t.noClientsSub}</div>
                  <Btn variant="primary" onClick={() => setShowForm(true)}>{t.addFirst}</Btn>
                </div>
              )}
            </div>
          ) : (
            <div style={{ animation: "fadein 0.4s ease" }}>
              {tab === "scanner" && <FoodScanner client={activeClient} lang={lang} />}
              {tab === "journal" && <FoodJournal client={activeClient} lang={lang} />}
              {tab === "planner" && <MealPlanner client={activeClient} lang={lang} />}
              {tab === "chat" && <AIChat client={activeClient} lang={lang} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
