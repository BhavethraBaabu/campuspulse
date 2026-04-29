"use client";
import { useState } from "react";
import Link from "next/link";
import { NeonButton } from "@/components/ui/neon-button";
import { motion, AnimatePresence } from "framer-motion";

const CLARK_COURSES = [
  { code: "PSYC 101", name: "Introduction to Psychology", dept: "Psychology", credits: 3, tags: ["psychology", "mind", "behavior", "people", "mental health", "social"] },
  { code: "PSYC 220", name: "Social Psychology", dept: "Psychology", credits: 3, tags: ["psychology", "social", "people", "behavior", "groups"] },
  { code: "PSYC 240", name: "Developmental Psychology", dept: "Psychology", credits: 3, tags: ["psychology", "development", "children", "growth"] },
  { code: "PSYC 310", name: "Abnormal Psychology", dept: "Psychology", credits: 3, tags: ["psychology", "mental health", "disorders", "therapy"] },
  { code: "CS 120", name: "Introduction to Computing", dept: "Computer Science", credits: 3, tags: ["computer science", "programming", "coding", "technology", "data"] },
  { code: "CS 220", name: "Data Structures", dept: "Computer Science", credits: 3, tags: ["computer science", "programming", "data", "algorithms"] },
  { code: "CS 242", name: "Machine Learning", dept: "Computer Science", credits: 3, tags: ["machine learning", "ai", "data science", "algorithms", "technology"] },
  { code: "CS 330", name: "Artificial Intelligence", dept: "Computer Science", credits: 3, tags: ["ai", "artificial intelligence", "machine learning", "technology"] },
  { code: "MATH 130", name: "Calculus I", dept: "Mathematics", credits: 3, tags: ["math", "calculus", "quantitative", "science"] },
  { code: "MATH 217", name: "Statistics", dept: "Mathematics", credits: 3, tags: ["statistics", "data", "quantitative", "research", "data science"] },
  { code: "MATH 230", name: "Probability", dept: "Mathematics", credits: 3, tags: ["probability", "statistics", "math", "data science"] },
  { code: "ECON 100", name: "Principles of Economics", dept: "Economics", credits: 3, tags: ["economics", "business", "finance", "policy", "social"] },
  { code: "ECON 250", name: "Econometrics", dept: "Economics", credits: 3, tags: ["economics", "data", "statistics", "quantitative", "research"] },
  { code: "MGMT 100", name: "Introduction to Management", dept: "Management", credits: 3, tags: ["business", "management", "leadership", "organization"] },
  { code: "MGMT 215", name: "Entrepreneurship", dept: "Management", credits: 3, tags: ["entrepreneurship", "business", "startup", "innovation", "leadership"] },
  { code: "BIOL 101", name: "General Biology", dept: "Biology", credits: 4, tags: ["biology", "science", "life science", "health", "nature"] },
  { code: "BIOL 220", name: "Genetics", dept: "Biology", credits: 3, tags: ["biology", "genetics", "science", "health", "research"] },
  { code: "PHIL 100", name: "Introduction to Philosophy", dept: "Philosophy", credits: 3, tags: ["philosophy", "ethics", "critical thinking", "humanities"] },
  { code: "PHIL 220", name: "Ethics", dept: "Philosophy", credits: 3, tags: ["ethics", "philosophy", "moral", "social justice"] },
  { code: "SOCI 101", name: "Introduction to Sociology", dept: "Sociology", credits: 3, tags: ["sociology", "social", "people", "culture", "society"] },
  { code: "GEOG 245", name: "GIS and Spatial Analysis", dept: "Geography", credits: 3, tags: ["gis", "data", "technology", "geography", "mapping"] },
  { code: "ENGL 220", name: "Creative Writing", dept: "English", credits: 3, tags: ["writing", "creative", "humanities", "storytelling"] },
  { code: "COMM 100", name: "Communication Studies", dept: "Communication", credits: 3, tags: ["communication", "media", "public speaking", "social"] },
  { code: "NEUR 101", name: "Introduction to Neuroscience", dept: "Neuroscience", credits: 3, tags: ["neuroscience", "brain", "psychology", "biology", "science"] },
  { code: "ENVS 101", name: "Environmental Science", dept: "Environmental Science", credits: 3, tags: ["environment", "science", "sustainability", "nature", "global"] },
  { code: "DATA 101", name: "Introduction to Data Science", dept: "Data Science", credits: 3, tags: ["data science", "programming", "statistics", "ai", "technology"] },
  { code: "DATA 220", name: "Data Visualization", dept: "Data Science", credits: 3, tags: ["data science", "visualization", "design", "technology", "statistics"] },
];

const INTERESTS = [
  { label: "Psychology", emoji: "🧠" },
  { label: "Data Science", emoji: "📊" },
  { label: "AI & Machine Learning", emoji: "🤖" },
  { label: "Business", emoji: "💼" },
  { label: "Biology", emoji: "🔬" },
  { label: "Writing", emoji: "✍️" },
  { label: "Math", emoji: "📐" },
  { label: "Environment", emoji: "🌿" },
  { label: "Social Justice", emoji: "⚖️" },
  { label: "Technology", emoji: "💻" },
  { label: "Research", emoji: "🔍" },
  { label: "Health", emoji: "❤️" },
];

const GOALS = [
  { label: "Get into grad school", emoji: "🎓" },
  { label: "Land a tech job", emoji: "💻" },
  { label: "Start my own business", emoji: "🚀" },
  { label: "Work in healthcare", emoji: "🏥" },
  { label: "Go into research", emoji: "🔬" },
  { label: "Work in policy/government", emoji: "🏛️" },
  { label: "Become a therapist", emoji: "🧠" },
  { label: "Work in finance", emoji: "💰" },
];

type Recommendation = {
  course: typeof CLARK_COURSES[0];
  reason: string;
  match: number;
};

const DEPT_COLORS: Record<string, string> = {
  "Computer Science": "#4F46E5",
  "Mathematics": "#0891B2",
  "Psychology": "#7C3AED",
  "Data Science": "#059669",
  "Biology": "#16a34a",
  "Economics": "#D97706",
  "Management": "#C00000",
  "Neuroscience": "#DB2777",
  "Philosophy": "#92400E",
  "Sociology": "#0369a1",
  "Geography": "#065f46",
  "Environmental Science": "#166534",
  "English": "#6D28D9",
  "Communication": "#C2410C",
};

const STEPS = ["interests", "goals", "results"];

export default function CoursesPage() {
  const [step, setStep] = useState<"interests" | "goals" | "results">("interests");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState("");

  const stepIdx = STEPS.indexOf(step);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const generateRecommendations = async () => {
    setLoading(true);
    const allInterests = [...selectedInterests, ...(customInterest ? [customInterest] : [])];
    const keywords = allInterests.map(i => i.toLowerCase());

    const scored = CLARK_COURSES.map(course => {
      const matches = course.tags.filter(tag =>
        keywords.some(k => tag.includes(k) || k.includes(tag))
      ).length;
      return { course, matchScore: Math.min(98, Math.round((matches / Math.max(course.tags.length, 1)) * 100) + matches * 10) };
    })
      .filter(s => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `You are a Clark University academic advisor. Student interests: ${allInterests.join(", ")}. Career goal: ${selectedGoal || "not specified"}. Recommended courses: ${scored.map(s => s.course.name).join(", ")}. Write 2 encouraging sentences explaining why these courses fit their profile. Mention Clark University specifically.`,
          language: "English"
        }),
      });
      const data = await res.json();
      setAiReasoning(data.answer || "");
    } catch { setAiReasoning(""); }

    setRecommendations(scored.map(s => ({
      course: s.course,
      match: Math.min(98, s.matchScore),
      reason: `Matches your interest in ${s.course.tags.filter(t => keywords.some(k => t.includes(k))).slice(0, 2).join(" & ") || s.course.dept}${selectedGoal ? ` · supports your goal to ${selectedGoal.toLowerCase()}` : ""}`,
    })));
    setLoading(false);
    setStep("results");
  };

  const matchColor = (m: number) => m >= 70 ? "#4ade80" : m >= 40 ? "#fbbf24" : "#f87171";

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(13,13,13,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black text-white text-sm">CampusPulse</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(192,0,0,0.25)", color: "#ff8080" }}>Clark</span>
          </Link>

          {/* Step progress */}
          <div className="hidden md:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: i < stepIdx ? "#4ade80" : i === stepIdx ? "#C00000" : "rgba(255,255,255,0.08)",
                      color: i <= stepIdx ? "white" : "rgba(255,255,255,0.3)",
                    }}>
                    {i < stepIdx ? "✓" : i + 1}
                  </div>
                  <span className="text-xs capitalize"
                    style={{ color: i === stepIdx ? "white" : "rgba(255,255,255,0.3)" }}>{s}</span>
                </div>
                {i < 2 && <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>}
              </div>
            ))}
          </div>

          <Link href="/ask">
            <NeonButton variant="solid" size="sm"
              className="font-bold text-white rounded-lg px-4 py-2 text-xs"
              style={{ background: "#C00000" }}>
              Ask AI
            </NeonButton>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full transition-all duration-700"
            style={{ width: `${(stepIdx / 2) * 100}%`, background: "#C00000" }} />
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="py-14 text-center border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(192,0,0,0.04)" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C00000" }}>
            AI Course Recommender
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Find your perfect Clark courses
          </h1>
          <p className="text-lg max-w-xl mx-auto leading-relaxed px-6"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            Tell us what you love and where you want to go — we will match you with Clark courses that fit.
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-14">

        {/* ── STEP 1 — INTERESTS ── */}
        <AnimatePresence mode="wait">
          {step === "interests" && (
            <motion.div key="interests"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-10">
                <h2 className="text-2xl font-black text-white mb-2">What are you interested in?</h2>
                <p style={{ color: "rgba(255,255,255,0.45)" }}>
                  Select everything that appeals to you — the more you choose, the better your recommendations.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {INTERESTS.map(({ label, emoji }) => (
                  <motion.button key={label} onClick={() => toggleInterest(label)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border"
                    style={selectedInterests.includes(label)
                      ? { background: "#C00000", color: "white", borderColor: "#C00000", boxShadow: "0 4px 15px rgba(192,0,0,0.3)" }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.12)" }}>
                    <span>{emoji}</span>
                    {label}
                    {selectedInterests.includes(label) && <span className="text-xs font-bold">✓</span>}
                  </motion.button>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Anything else? Add your own
                </label>
                <input type="text" value={customInterest}
                  onChange={e => setCustomInterest(e.target.value)}
                  placeholder="e.g. Urban planning, Film studies, Public health..."
                  className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,0,0,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              {selectedInterests.length > 0 && (
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <span className="font-bold text-white">{selectedInterests.length}</span> interest{selectedInterests.length !== 1 ? "s" : ""} selected
                </p>
              )}

              <div className="flex items-center justify-between pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div />
                <NeonButton
                  onClick={() => setStep("goals")}
                  disabled={selectedInterests.length === 0 && !customInterest}
                  variant="solid" size="default"
                  className="font-bold text-white rounded-lg disabled:opacity-40"
                  style={{ background: "#C00000" }}>
                  Next: Your goal →
                </NeonButton>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 — GOALS ── */}
          {step === "goals" && (
            <motion.div key="goals"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-10">
                <h2 className="text-2xl font-black text-white mb-2">What is your career goal?</h2>
                <p style={{ color: "rgba(255,255,255,0.45)" }}>
                  This helps us prioritize courses most relevant to your future.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {GOALS.map(({ label, emoji }) => (
                  <motion.button key={label} onClick={() => setSelectedGoal(label)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium text-left transition-all"
                    style={selectedGoal === label
                      ? { background: "rgba(192,0,0,0.12)", border: "2px solid rgba(192,0,0,0.6)", color: "white" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ fontSize: "20px" }}>{emoji}</span>
                    <span className="flex-1">{label}</span>
                    {selectedGoal === label && <span className="text-xs font-bold" style={{ color: "#ff8080" }}>✓</span>}
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button onClick={() => setStep("interests")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
                  style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ← Back
                </button>
                <NeonButton
                  onClick={generateRecommendations}
                  disabled={loading}
                  variant="solid" size="default"
                  className="font-bold text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  style={{ background: "#C00000" }}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : "Get my recommendations →"}
                </NeonButton>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 — RESULTS ── */}
          {step === "results" && (
            <motion.div key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              <div className="mb-8 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C00000" }}>
                  Your recommendations
                </p>
                <h2 className="text-3xl font-black text-white mb-2">
                  {recommendations.length} courses matched for you
                </h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Based on interest in <span className="text-white font-bold">{selectedInterests.slice(0, 2).join(" & ")}</span>
                  {selectedGoal && <> · goal to <span className="text-white font-bold">{selectedGoal.toLowerCase()}</span></>}
                </p>
              </div>

              {/* AI advisor */}
              {aiReasoning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-5 mb-8 flex gap-4"
                  style={{ background: "rgba(192,0,0,0.08)", border: "1px solid rgba(192,0,0,0.25)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                    style={{ background: "#C00000" }}>AI</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "#C00000" }}>Academic Advisor</p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{aiReasoning}</p>
                  </div>
                </motion.div>
              )}

              {/* Course cards */}
              <div className="space-y-3 mb-10">
                {recommendations.map((rec, i) => (
                  <motion.div key={rec.course.code}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white"
                      style={{ background: i === 0 ? "#C00000" : i === 1 ? "#374151" : "#1f2937" }}>
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-black px-2 py-0.5 rounded"
                          style={{ background: `${DEPT_COLORS[rec.course.dept] || "#374151"}20`, color: DEPT_COLORS[rec.course.dept] || "#aaa" }}>
                          {rec.course.code}
                        </span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {rec.course.credits} credits · {rec.course.dept}
                        </span>
                      </div>
                      <h3 className="font-black text-white text-base mb-1">{rec.course.name}</h3>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{rec.reason}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.match}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{ background: matchColor(rec.match) }} />
                        </div>
                        <span className="text-xs font-black flex-shrink-0" style={{ color: matchColor(rec.match) }}>
                          {rec.match}% match
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-10 p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { value: recommendations.length, label: "Courses matched" },
                  { value: `${recommendations.reduce((a, r) => a + r.course.credits, 0)} cr`, label: "Total credits" },
                  { value: `${Math.round(recommendations.reduce((a, r) => a + r.match, 0) / recommendations.length)}%`, label: "Avg match" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button
                  onClick={() => { setStep("interests"); setSelectedInterests([]); setSelectedGoal(""); setRecommendations([]); setAiReasoning(""); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ↺ Start over
                </button>
                <Link href="/ask" className="flex-1">
                  <NeonButton variant="ghost" size="default"
                    className="w-full font-bold text-sm rounded-xl py-3"
                    style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    Ask about courses →
                  </NeonButton>
                </Link>
                <Link href="/planner" className="flex-1">
                  <NeonButton variant="solid" size="default"
                    className="w-full font-black text-white text-sm rounded-xl py-3"
                    style={{ background: "#C00000" }}>
                    Plan my semester →
                  </NeonButton>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="text-center py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          CampusPulse · Clark University · Knowledge base updated April 2026
        </p>
      </div>
    </main>
  );
}