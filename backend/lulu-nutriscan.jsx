import { useState, useRef, useCallback } from "react";

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
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}55`, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}/>
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
  const fileRef = useRef();

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const mime = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      // Extract base64 after the comma
      const base64 = dataUrl.split(",")[1];
      setImage(dataUrl);
      setImageData(base64);
      setMimeType(mime);
      setResult(null); setError(null);
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: imageData } },
            { type: "text", text: "Analyze the nutritional content of this food image. Return only the JSON." }
          ]}]
        })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      // Strip any markdown fences and parse
      const clean = text.replace(/```json[\s\S]*?```/g, t => t.replace(/```json|```/g, "")).replace(/```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON returned");
      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed);
    } catch (e) {
      setError(`Analysis failed: ${e.message}. Please try a clearer food photo.`);
    }
    setLoading(false);
  };

  const reset = () => { setImage(null); setImageData(null); setMimeType("image/jpeg"); setResult(null); setError(null); };

  const hColor = result ? (result.healthScore >= 75 ? "#4ade80" : result.healthScore >= 50 ? "#facc15" : "#f87171") : "#ec4899";

  return (
    <div style={{ minHeight: "100vh", background: "#080d18", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 56px", backgroundImage: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(236,72,153,0.08) 0%, transparent 65%)" }}>
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
      <div style={{ textAlign: "center", marginBottom: 40, animation: "fadein 0.6s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24, animation: "float 3s ease-in-out infinite" }}>🌸</span>
          <h1 style={{ margin: 0, fontFamily: "Playfair Display, serif", fontSize: 38, color: "#4ade80", letterSpacing: "-0.02em" }}>
            AI Calorie Scanner
          </h1>
          <span style={{ fontSize: 24, animation: "float 3.2s ease-in-out infinite" }}>🌸</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 4px" }}>Snap a photo of your meal and let Lulu analyze the nutrition.</p>
        <div style={{ fontSize: 12, color: "#ec4899", fontFamily: "Playfair Display, serif", fontStyle: "italic" }}>lulu.nutriscan</div>
      </div>

      {/* Two panel grid */}
      <div style={{ width: "100%", maxWidth: 920, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, animation: "fadein 0.7s ease 0.1s both" }}>

        {/* LEFT — Upload / Preview */}
        <div style={{ background: "#111827", borderRadius: 22, border: "1px solid rgba(255,255,255,0.06)", minHeight: 440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }}/>

          {!image ? (
            <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}>
              <div onClick={() => fileRef.current.click()} style={{ width: 92, height: 92, borderRadius: "50%", background: dragOver ? "rgba(236,72,153,0.18)" : "rgba(236,72,153,0.09)", border: `2px solid ${dragOver ? "rgba(236,72,153,0.45)" : "rgba(236,72,153,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, cursor: "pointer", marginBottom: 22, transition: "all 0.25s ease", boxShadow: dragOver ? "0 0 36px rgba(236,72,153,0.25)" : "none" }}>📷</div>
              <h2 style={{ margin: "0 0 8px", fontFamily: "Playfair Display, serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>Snap &amp; Analyze</h2>
              <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 28px", textAlign: "center" }}>Drag &amp; drop or match your plate</p>
              <button className="ubtn" onClick={() => fileRef.current.click()} style={{ padding: "13px 36px", borderRadius: 50, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#f472b6,#ec4899,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(236,72,153,0.32)", transition: "all 0.25s ease", letterSpacing: "0.02em", fontFamily: "inherit" }}>
                ⬆ Upload Photo
              </button>
              <p style={{ color: "#374151", fontSize: 11, marginTop: 14 }}>JPG · PNG · WEBP supported</p>
            </div>
          ) : (
            <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
              <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <img src={image} alt="food" style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }}/>
                {loading && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(8,13,24,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, backdropFilter: "blur(4px)" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", border: "3px solid rgba(236,72,153,0.15)", borderTop: "3px solid #ec4899", animation: "spin 0.9s linear infinite" }}/>
                    <span style={{ color: "#ec4899", fontSize: 13, fontWeight: 600 }}>Analyzing nutrition...</span>
                  </div>
                )}
                <button onClick={reset} style={{ position: "absolute", top: 10, right: 10, background: "rgba(8,13,24,0.82)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 11, backdropFilter: "blur(6px)" }}>✕ Remove</button>
              </div>
              {error && <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 12, marginBottom: 12 }}>⚠ {error}</div>}
              <button className="ubtn" onClick={analyze} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(236,72,153,0.25)" : "linear-gradient(135deg,#f472b6,#ec4899,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: loading ? "none" : "0 8px 28px rgba(236,72,153,0.32)", transition: "all 0.25s ease", fontFamily: "inherit" }}>
                {loading ? "Scanning..." : "✨ Analyze Nutrition"}
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])}/>
        </div>

        {/* RIGHT — Results */}
        <div style={{ background: "#111827", borderRadius: 22, border: "1px solid rgba(255,255,255,0.06)", minHeight: 440, padding: 28, display: "flex", flexDirection: "column", justifyContent: result ? "flex-start" : "center", alignItems: result ? "stretch" : "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }}/>

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

              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 16 }}/>

              {/* Macro bars */}
              <div style={{ marginBottom: 16 }}>
                <MacroBar label="Protein" value={Math.round(result.protein)} max={60} color="#f472b6" unit="g"/>
                <MacroBar label="Sugar" value={Math.round(result.sugar)} max={50} color="#fb923c" unit="g"/>
                <MacroBar label="Carbohydrates" value={Math.round(result.carbs)} max={100} color="#a78bfa" unit="g"/>
                <MacroBar label="Fat" value={Math.round(result.fat)} max={60} color="#facc15" unit="g"/>
              </div>

              {/* Stat pills */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 16 }}>
                <StatPill icon="🌾" label="Fiber" value={`${result.fiber}g`} color="#4ade80"/>
                <StatPill icon="🧂" label="Sodium" value={`${result.sodium}mg`} color="#60a5fa"/>
                <StatPill icon="💚" label="Score" value={`${result.healthScore}/100`} color={hColor}/>
              </div>

              {/* Health bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 600 }}>Health Score</span>
                  <span style={{ fontSize: 10, color: hColor, fontWeight: 700 }}>{result.healthScore >= 75 ? "✨ Excellent" : result.healthScore >= 60 ? "👍 Good" : result.healthScore >= 40 ? "⚠ Moderate" : "🔴 Poor"}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${result.healthScore}%`, borderRadius: 6, background: `linear-gradient(90deg,${hColor}55,${hColor})`, boxShadow: `0 0 10px ${hColor}44`, transition: "width 1.4s cubic-bezier(0.34,1.56,0.64,1)" }}/>
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
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Detected Ingredients</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {result.ingredients.map(i => (
                      <span key={i} className="itag" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s ease", cursor: "default" }}>{i}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={reset} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="#ec4899"} onMouseLeave={e => e.target.style.color="#6b7280"}>← Scan another food</button>
            </div>
          )}
        </div>
      </div>

      <p style={{ marginTop: 28, fontSize: 11, color: "#1f2937", textAlign: "center" }}>
        Powered by Claude Vision AI · lulu.nutriscan · Not medical advice
      </p>
    </div>
  );
}
