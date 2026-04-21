"use client";
import { useState } from "react";
import Link from "next/link";

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
  "Computer Science": "#1d4ed8",
  "Mathematics": "#0369a1",
  "Psychology": "#7c3aed",
  "Data Science": "#059669",
  "Biology": "#16a34a",
  "Economics": "#b45309",
  "Management": "#C00000",
  "Neuroscience": "#be185d",
  "Philosophy": "#92400e",
  "Sociology": "#0e7490",
  "Geography": "#065f46",
  "Environmental Science": "#166534",
  "English": "#6d28d9",
  "Communication": "#c2410c",
};

export default function CoursesPage() {
  const [step, setStep] = useState<"interests" | "goals" | "results">("interests");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState("");

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

  const STEPS = ["interests", "goals", "results"];
  const stepIdx = STEPS.indexOf(step);

  const matchColor = (m: number) => m >= 70 ? "#15803d" : m >= 40 ? "#b45309" : "#C00000";

  return (
    <main className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm"
              style={{ background: "#C00000" }}>CP</div>
            <div>
              <div className="font-black text-gray-900 text-sm leading-none">CampusPulse</div>
              <div className="text-xs leading-none mt-0.5" style={{ color: "#C00000" }}>Clark University</div>
            </div>
          </Link>

          {/* Step breadcrumb */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <span className={`capitalize font-medium ${i === stepIdx ? "text-gray-900" : i < stepIdx ? "text-green-600" : "text-gray-400"}`}>
                  {i < stepIdx ? "✓ " : ""}{s}
                </span>
                {i < 2 && <span className="text-gray-300 mx-1">→</span>}
              </div>
            ))}
          </div>

          <Link href="/ask"
            className="text-sm font-bold px-5 py-2 rounded text-white transition-all hover:opacity-90"
            style={{ background: "#C00000" }}>
            Ask AI
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <div className="h-full transition-all duration-700"
            style={{ width: `${(stepIdx / 2) * 100}%`, background: "#C00000" }} />
        </div>
      </nav>

      {/* ── HERO BAND ── */}
      <div className="py-12 border-b border-gray-100" style={{ background: "#fafafa" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C00000" }}>
            AI Course Recommender
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            Find your perfect Clark courses
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Tell us what you love and where you want to go — we'll match you with Clark University courses that fit.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-14">

        {/* ── STEP 1 — INTERESTS ── */}
        {step === "interests" && (
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-black text-gray-900 mb-2">What are you interested in?</h2>
              <p className="text-gray-500">Select everything that appeals to you — the more you choose, the better your recommendations.</p>
            </div>

            {/* Interest pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {INTERESTS.map(({ label, emoji }) => (
                <button key={label} onClick={() => toggleInterest(label)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border"
                  style={selectedInterests.includes(label)
                    ? { background: "#C00000", color: "white", borderColor: "#C00000" }
                    : { background: "white", color: "#374151", borderColor: "#d1d5db" }}>
                  <span style={{ fontSize: "14px" }}>{emoji}</span>
                  {label}
                  {selectedInterests.includes(label) && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom interest */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Anything else? Add your own
              </label>
              <input type="text" value={customInterest}
                onChange={e => setCustomInterest(e.target.value)}
                placeholder="e.g. Urban planning, Film studies, Public health..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-red-400 transition-colors"
              />
            </div>

            {/* Count */}
            {selectedInterests.length > 0 && (
              <p className="text-sm text-gray-500 mb-6">
                <span className="font-bold text-gray-900">{selectedInterests.length}</span> interest{selectedInterests.length !== 1 ? "s" : ""} selected
              </p>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div />
              <button
                onClick={() => setStep("goals")}
                disabled={selectedInterests.length === 0 && !customInterest}
                className="flex items-center gap-2 px-8 py-3 rounded font-bold text-white text-sm transition-all disabled:opacity-40 hover:opacity-90"
                style={{ background: "#C00000" }}>
                Next: Your goal
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — GOALS ── */}
        {step === "goals" && (
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-black text-gray-900 mb-2">What's your career goal?</h2>
              <p className="text-gray-500">This helps us prioritize courses most relevant to your future.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {GOALS.map(({ label, emoji }) => (
                <button key={label} onClick={() => setSelectedGoal(label)}
                  className="flex items-center gap-3 px-5 py-4 rounded-lg text-sm font-medium text-left transition-all border"
                  style={selectedGoal === label
                    ? { background: "#fff5f5", borderColor: "#C00000", color: "#111827", borderWidth: "2px" }
                    : { background: "white", borderColor: "#e5e7eb", color: "#374151", borderWidth: "1px" }}>
                  <span style={{ fontSize: "20px" }}>{emoji}</span>
                  <span className="flex-1">{label}</span>
                  {selectedGoal === label && (
                    <span className="text-xs font-bold" style={{ color: "#C00000" }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button onClick={() => setStep("interests")}
                className="flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm text-gray-600 border border-gray-200 transition-all hover:border-gray-400">
                ← Back
              </button>
              <button onClick={generateRecommendations} disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded font-bold text-white text-sm transition-all disabled:opacity-50 hover:opacity-90"
                style={{ background: "#C00000" }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>"Get my recommendations →"</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — RESULTS ── */}
        {step === "results" && (
          <div>
            {/* Header */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C00000" }}>
                Your recommendations
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                {recommendations.length} courses matched for you
              </h2>
              <p className="text-gray-500 text-sm">
                Based on your interest in <strong className="text-gray-900">{selectedInterests.slice(0, 2).join(" & ")}</strong>
                {selectedGoal && <> · goal to <strong className="text-gray-900">{selectedGoal.toLowerCase()}</strong></>}
              </p>
            </div>

            {/* AI advisor card */}
            {aiReasoning && (
              <div className="rounded-xl p-5 mb-8 flex gap-4"
                style={{ background: "#fff5f5", border: "1px solid #fecaca" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                  style={{ background: "#C00000" }}>AI</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5 text-gray-500">Academic Advisor</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{aiReasoning}</p>
                </div>
              </div>
            )}

            {/* Course list */}
            <div className="space-y-3 mb-10">
              {recommendations.map((rec, i) => (
                <div key={rec.course.code}
                  className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-white hover:shadow-sm">

                  {/* Rank */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white"
                    style={{ background: i === 0 ? "#C00000" : i === 1 ? "#374151" : "#9ca3af" }}>
                    {i + 1}
                  </div>

                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded"
                        style={{ background: `${DEPT_COLORS[rec.course.dept] || "#374151"}15`, color: DEPT_COLORS[rec.course.dept] || "#374151" }}>
                        {rec.course.code}
                      </span>
                      <span className="text-xs text-gray-400">{rec.course.credits} credits</span>
                      <span className="text-xs text-gray-400">· {rec.course.dept}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-base mb-1">{rec.course.name}</h3>
                    <p className="text-xs text-gray-500">{rec.reason}</p>

                    {/* Match bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${rec.match}%`, background: matchColor(rec.match) }} />
                      </div>
                      <span className="text-xs font-black flex-shrink-0"
                        style={{ color: matchColor(rec.match) }}>
                        {rec.match}% match
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 p-5 rounded-xl bg-gray-50">
              {[
                { value: recommendations.length, label: "Courses matched" },
                { value: `${recommendations.reduce((a, r) => a + r.course.credits, 0)} cr`, label: "Total credits" },
                { value: `${Math.round(recommendations.reduce((a, r) => a + r.match, 0) / recommendations.length)}%`, label: "Avg match" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={() => { setStep("interests"); setSelectedInterests([]); setSelectedGoal(""); setRecommendations([]); setAiReasoning(""); }}
                className="flex-1 py-3 rounded font-semibold text-sm text-gray-600 border border-gray-200 transition-all hover:border-gray-400">
                ↺ Start over
              </button>
              <Link href="/ask"
                className="flex-1 py-3 rounded font-bold text-sm text-center border border-gray-200 text-gray-700 transition-all hover:border-gray-400">
                Ask about courses →
              </Link>
              <Link href="/planner"
                className="flex-1 py-3 rounded font-black text-white text-sm text-center transition-all hover:opacity-90"
                style={{ background: "#C00000" }}>
                Plan my semester →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-400">
          CampusPulse · Clark University · Tech Innovation Challenge 2026
        </p>
      </div>
    </main>
  );
}