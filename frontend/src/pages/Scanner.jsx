import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDailyLog } from "../context/DailyLogContext";
import { CheckCircle2, UtensilsCrossed, ArrowLeft } from "lucide-react";
import api from "../api/axios";

const SYSTEM_PROMPT = `You are a precise food nutrition analysis AI. When given an image of food, analyze it and return ONLY a valid JSON object with this exact structure:
{
  "foodName": "Name of the food/dish",
  "confidence": 85,
  "servingSize": "1 cup (240g)",
  "calories": 320,
  "protein": 12.5,
  "sugar": 8.2,
  "carbs": 45.0,
  "fat": 9.8,
  "fiber": 3.2,
  "sodium": 480,
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "healthScore": 72,
  "tags": ["High Protein", "Low Fat"],
  "insight": "One warm, encouraging sentence about this food and its benefits or a gentle tip."
}
All numeric values must be numbers (not strings). healthScore is 0-100. confidence is 0-100. Return ONLY the JSON, no markdown, no explanation.`;

const MacroBar = ({ label, value, max, color, unit }) => {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{value}<span style={{ color: "#6b7280", fontWeight: 400, fontSize: 11 }}> {unit}</span></span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}55`, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
            </div>
        </div>
    );
};

const StatPill = ({ icon, label, value, color }) => (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "11px 12px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        </div>
    </div>
);

export default function LuluNutriScan() {
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [mimeType, setMimeType] = useState("image/jpeg");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [logged, setLogged] = useState(false);
    const [mealType, setMealType] = useState("Lunch");
    const fileRef = useRef();
    const { addMeal } = useDailyLog();
    const navigate = useNavigate();

    const processFile = useCallback((file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const mime = file.type || "image/jpeg";
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const base64 = dataUrl.split(",")[1];
            setImage(dataUrl);
            setImageData(base64);
            setMimeType(mime);
            setResult(null); setError(null); setLogged(false);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragOver(false);
        processFile(e.dataTransfer.files[0]);
    }, [processFile]);

    const analyze = async () => {
        if (!imageData) return;
        setLoading(true); setError(null); setResult(null);
        try {
            // Convert base64 to Blob and send to secure backend proxy
            const byteString = atob(imageData);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            const blob = new Blob([ab], { type: mimeType });

            const formData = new FormData();
            formData.append("file", blob, "scan.jpg");

            const res = await api.post("/meals/scan", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Backend returns { success, data } — normalize to NutriScan shape
            const d = res.data?.data || res.data;
            const parsed = {
                foodName: d.name || d.foodName || "Unknown Food",
                confidence: d.confidence || 95,
                servingSize: d.servingSize || "1 serving",
                calories: d.calories || 0,
                protein: d.macros?.protein ?? d.protein ?? 0,
                sugar: d.macros?.sugar ?? d.sugar ?? 0,
                carbs: d.macros?.carbs ?? d.carbs ?? 0,
                fat: d.macros?.fats ?? d.fats ?? d.fat ?? 0,
                fiber: d.macros?.fiber ?? d.fiber ?? 0,
                sodium: d.macros?.sodium ?? d.sodium ?? d.sodium ?? 0,
                ingredients: Array.isArray(d.ingredients)
                    ? d.ingredients.map(i => (typeof i === "string" ? i : i.name))
                    : [],
                healthScore: d.health_score || d.healthScore || 75,
                tags: d.tags || [],
                insight: d.health_tip || d.insight || "Balanced meal choice!"
            };
            setResult(parsed);
        } catch (e) {
            const msg = e.response?.data?.detail || e.message || "Unknown error";
            setError(`Analysis failed: ${msg}. Please try a clearer food photo.`);
        }
        setLoading(false);
    };

    const handleLogMeal = async () => {
        if (!result) return;
        setError(null);
        try {
            await addMeal({
                name: result.foodName,
                food: result.foodName,
                type: mealType,
                calories: result.calories,
                kcal: result.calories,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat,
                fats: result.fat,
                macros: { protein: result.protein, carbs: result.carbs, fats: result.fat },
                ingredients: result.ingredients || [],
                healthTip: result.insight,
                img: image,
                source: "ai"
            });
            setLogged(true);
        } catch (e) {
            const msg = e.response?.data?.detail || e.message || "Unknown error";
            setError(`Failed to log meal: ${msg}`);
            console.error("Failed to log meal", e.response?.data || e);
        }
    };

    const reset = () => { setImage(null); setImageData(null); setMimeType("image/jpeg"); setResult(null); setError(null); setLogged(false); };

    const hColor = result ? (result.healthScore >= 75 ? "#4ade80" : result.healthScore >= 50 ? "#facc15" : "#f87171") : "#ec4899";

    return (
        <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 56px" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        @keyframes fadein{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .ubtn:hover{background:linear-gradient(135deg,#f472b6,#ec4899,#a855f7)!important;transform:translateY(-2px);box-shadow:0 14px 40px rgba(236,72,153,0.45)!important;}
        .ubtn:active{transform:translateY(0)!important;}
        .itag:hover{background:rgba(236,72,153,0.12)!important;border-color:rgba(236,72,153,0.25)!important;color:#f9a8d4!important;}
      `}</style>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32, animation: "fadein 0.6s ease", width: "100%", maxWidth: 920 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
                    >
                        ← Back
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22, animation: "float 3s ease-in-out infinite" }}>🌸</span>
                        <h1 style={{ margin: 0, fontFamily: "Playfair Display, serif", fontSize: 32, color: "#fff", letterSpacing: "-0.02em" }}>
                            Lulu <span style={{ color: "#ec4899" }}>NutriScan</span>
                        </h1>
                        <span style={{ fontSize: 22, animation: "float 3.2s ease-in-out infinite" }}>🌸</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#ec4899", fontFamily: "Playfair Display, serif", fontStyle: "italic", textAlign: "right" }}>lulu.nutriscan</div>
                </div>
                <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Snap a photo of your meal and let Lulu analyze the nutrition instantly.</p>
            </div>

            {/* Two panel grid */}
            <div style={{ width: "100%", maxWidth: 920, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, animation: "fadein 0.7s ease 0.1s both" }}>

                {/* LEFT — Upload / Preview */}
                <div style={{ background: "#111827", borderRadius: 22, border: "1px solid rgba(255,255,255,0.06)", minHeight: 440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

                    {!image ? (
                        <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}>
                            <div onClick={() => fileRef.current.click()} style={{ width: 92, height: 92, borderRadius: "50%", background: dragOver ? "rgba(236,72,153,0.18)" : "rgba(236,72,153,0.09)", border: `2px solid ${dragOver ? "rgba(236,72,153,0.45)" : "rgba(236,72,153,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, cursor: "pointer", marginBottom: 22, transition: "all 0.25s ease", boxShadow: dragOver ? "0 0 36px rgba(236,72,153,0.25)" : "none" }}>📷</div>
                            <h2 style={{ margin: "0 0 8px", fontFamily: "Playfair Display, serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>Snap &amp; Analyze</h2>
                            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 28px", textAlign: "center" }}>Drag &amp; drop or upload your plate</p>
                            <button className="ubtn" onClick={() => fileRef.current.click()} style={{ padding: "13px 36px", borderRadius: 50, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#f472b6,#ec4899,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(236,72,153,0.32)", transition: "all 0.25s ease", fontFamily: "inherit" }}>
                                ⬆ Upload Photo
                            </button>
                            <p style={{ color: "#374151", fontSize: 11, marginTop: 14 }}>JPG · PNG · WEBP supported</p>
                        </div>
                    ) : (
                        <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
                            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                                <img src={image} alt="food" style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }} />
                                {loading && (
                                    <div style={{ position: "absolute", inset: 0, background: "rgba(8,13,24,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, backdropFilter: "blur(4px)" }}>
                                        <div style={{ width: 52, height: 52, borderRadius: "50%", border: "3px solid rgba(236,72,153,0.15)", borderTop: "3px solid #ec4899", animation: "spin 0.9s linear infinite" }} />
                                        <span style={{ color: "#ec4899", fontSize: 13, fontWeight: 600 }}>Analyzing nutrition...</span>
                                    </div>
                                )}
                                <button onClick={reset} style={{ position: "absolute", top: 10, right: 10, background: "rgba(8,13,24,0.82)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 11, backdropFilter: "blur(6px)" }}>✕ Remove</button>
                            </div>

                            {/* Meal type selector */}
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 8 }}>Log as</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {["Breakfast", "Lunch", "Dinner", "Snack"].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setMealType(t)}
                                            style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: `1px solid ${mealType === t ? "rgba(236,72,153,0.5)" : "rgba(255,255,255,0.06)"}`, background: mealType === t ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.03)", color: mealType === t ? "#f9a8d4" : "#6b7280", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 12, marginBottom: 12 }}>⚠ {error}</div>}
                            <button className="ubtn" onClick={analyze} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(236,72,153,0.25)" : "linear-gradient(135deg,#f472b6,#ec4899,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: loading ? "none" : "0 8px 28px rgba(236,72,153,0.32)", transition: "all 0.25s ease", fontFamily: "inherit" }}>
                                {loading ? "Scanning..." : "✨ Analyze Nutrition"}
                            </button>
                        </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />
                </div>

                {/* RIGHT — Results */}
                <div style={{ background: "#111827", borderRadius: 22, border: "1px solid rgba(255,255,255,0.06)", minHeight: 440, padding: 28, display: "flex", flexDirection: "column", justifyContent: result ? "flex-start" : "center", alignItems: result ? "stretch" : "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

                    {!result ? (
                        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 16px", color: "#6b7280" }}>ⓘ</div>
                            <h3 style={{ margin: "0 0 10px", fontSize: 18, color: "#4b5563", fontWeight: 700 }}>No Data Yet</h3>
                            <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.7, margin: 0, maxWidth: 210 }}>Upload a photo to see the AI magic happen. We'll break down macros, calories, and ingredients.</p>
                        </div>
                    ) : (
                        <div style={{ position: "relative", zIndex: 1, animation: "fadein 0.5s ease" }}>
                            {/* Food + calories header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 10, color: "#ec4899", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 4 }}>Detected Food</div>
                                    <h2 style={{ margin: "0 0 3px", fontFamily: "Playfair Display, serif", fontSize: 19, color: "#fff", fontWeight: 700, lineHeight: 1.25 }}>{result.foodName}</h2>
                                    <div style={{ fontSize: 11, color: "#6b7280" }}>{result.servingSize}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "#ec4899", lineHeight: 1 }}>{result.calories}</div>
                                    <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>kcal</div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                                {result.tags?.map(t => <span key={t} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(236,72,153,0.1)", color: "#f9a8d4", border: "1px solid rgba(236,72,153,0.18)", fontWeight: 700, letterSpacing: "0.04em" }}>{t}</span>)}
                                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(74,222,128,0.08)", color: "#86efac", border: "1px solid rgba(74,222,128,0.18)", fontWeight: 700 }}>🎯 {result.confidence}% confident</span>
                            </div>

                            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 16 }} />

                            {/* Macro bars */}
                            <div style={{ marginBottom: 16 }}>
                                <MacroBar label="Protein" value={Math.round(result.protein)} max={60} color="#f472b6" unit="g" />
                                <MacroBar label="Sugar" value={Math.round(result.sugar)} max={50} color="#fb923c" unit="g" />
                                <MacroBar label="Carbohydrates" value={Math.round(result.carbs)} max={100} color="#a78bfa" unit="g" />
                                <MacroBar label="Fat" value={Math.round(result.fat)} max={60} color="#facc15" unit="g" />
                            </div>

                            {/* Stat pills */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 16 }}>
                                <StatPill icon="🌾" label="Fiber" value={`${result.fiber}g`} color="#4ade80" />
                                <StatPill icon="🧂" label="Sodium" value={`${result.sodium}mg`} color="#60a5fa" />
                                <StatPill icon="💚" label="Score" value={`${result.healthScore}/100`} color={hColor} />
                            </div>

                            {/* Health bar */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 600 }}>Health Score</span>
                                    <span style={{ fontSize: 10, color: hColor, fontWeight: 700 }}>{result.healthScore >= 75 ? "✨ Excellent" : result.healthScore >= 60 ? "👍 Good" : result.healthScore >= 40 ? "⚠ Moderate" : "🔴 Poor"}</span>
                                </div>
                                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${result.healthScore}%`, borderRadius: 6, background: `linear-gradient(90deg,${hColor}55,${hColor})`, boxShadow: `0 0 10px ${hColor}44`, transition: "width 1.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
                                </div>
                            </div>

                            {/* Insight */}
                            {result.insight && (
                                <div style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.14)", borderRadius: 12, padding: "11px 13px", marginBottom: 14, display: "flex", gap: 9 }}>
                                    <span style={{ fontSize: 15, flexShrink: 0 }}>💌</span>
                                    <p style={{ margin: 0, fontSize: 12, color: "#d1a0b8", lineHeight: 1.65 }}>{result.insight}</p>
                                </div>
                            )}

                            {/* Ingredients */}
                            {result.ingredients?.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Detected Ingredients</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                        {result.ingredients.map(i => (
                                            <span key={i} className="itag" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s ease", cursor: "default" }}>{i}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Log to Meals Button */}
                            {error && error.startsWith("Failed to log") && (
                                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 12, marginBottom: 10 }}>⚠ {error}</div>
                            )}
                            {!logged ? (
                                <button
                                    onClick={handleLogMeal}
                                    style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: "0 8px 28px rgba(16,185,129,0.3)", transition: "all 0.25s ease", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}
                                    className="ubtn"
                                >
                                    ✅ Log as {mealType} to Daily Log
                                </button>
                            ) : (
                                <div style={{ width: "100%", padding: "14px", borderRadius: 12, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
                                    ✓ Logged! Go to <button onClick={() => navigate("/meals")} style={{ background: "none", border: "none", color: "#6ee7b7", fontWeight: 800, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: 14 }}>Meals Log →</button>
                                </div>
                            )}

                            <button onClick={reset} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#ec4899"} onMouseLeave={e => e.target.style.color = "#6b7280"}>← Scan another food</button>
                        </div>
                    )}
                </div>
            </div>

            <p style={{ marginTop: 28, fontSize: 11, color: "#374151", textAlign: "center" }}>
                Powered by Claude AI Vision · lulu.nutriscan · Not medical advice
            </p>
        </div>
    );
}
