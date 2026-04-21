"use client";
import { useState } from "react";
import Link from "next/link";

const DEMO_QUESTIONS = [
  "What is the add/drop deadline?",
  "How do I apply for OPT?",
  "Where is the financial aid office?",
  "What is the grading scale at Clark?",
  "How do I get a transcript?",
  "What are library hours?",
];

export default function TryPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [confidence, setConfidence] = useState("");
  const [responseTime, setResponseTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [error, setError] = useState("");
  const MAX_FREE = 3;

  const submitQuestion = async (q: string) => {
    if (!q.trim()) return;
    if (questionsUsed >= MAX_FREE) return;

    setLoading(true);
    setAnswer("");
    setError("");
    setQuestion(q);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, language: "English" }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setSourceUrl(data.sourceUrl || "");
      setSourceTitle(data.sourceTitle || "");
      setConfidence(data.confidence || "");
      setResponseTime(data.responseTime || 0);
      setQuestionsUsed(c => c + 1);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const remaining = MAX_FREE - questionsUsed;

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(13,13,13,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
            style={{ background: "#C00000" }}>CP</div>
          <span className="font-black text-white">CampusPulse</span>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.3)" }}>
            Clark
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-xs px-3 py-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}>Sign in</Link>
          <Link href="/auth?tab=signup"
            className="text-xs px-4 py-2 rounded-lg font-bold text-white"
            style={{ background: "#C00000" }}>Create free account</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: "rgba(192,0,0,0.1)", border: "1px solid rgba(192,0,0,0.3)", color: "rgba(255,255,255,0.7)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Try {MAX_FREE} free questions — no account needed
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ask Clark Anything
          </h1>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Real answers from Clark's official website. Cited and sourced.
          </p>
        </div>

        {/* Questions remaining */}
        {questionsUsed < MAX_FREE && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: MAX_FREE }).map((_, i) => (
              <div key={i} className="w-8 h-2 rounded-full transition-all duration-500"
                style={{ background: i < questionsUsed ? "rgba(255,255,255,0.15)" : "#C00000" }} />
            ))}
            <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              {remaining} question{remaining !== 1 ? "s" : ""} remaining
            </span>
          </div>
        )}

        {/* Locked state */}
        {questionsUsed >= MAX_FREE && (
          <div className="rounded-2xl p-8 text-center mb-8"
            style={{ background: "rgba(192,0,0,0.1)", border: "1px solid rgba(192,0,0,0.3)" }}>
            <div className="text-4xl mb-4">🔓</div>
            <h2 className="text-xl font-black text-white mb-2">You've used your 3 free questions!</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Create a free account to ask unlimited questions, save your history, and access all features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth?tab=signup"
                className="px-6 py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
                style={{ background: "#C00000", boxShadow: "0 4px 20px rgba(192,0,0,0.3)" }}>
                Create free account →
              </Link>
              <Link href="/auth"
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                Sign in
              </Link>
            </div>
          </div>
        )}

        {/* Input */}
        {questionsUsed < MAX_FREE && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-2 rounded-2xl mb-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "2px solid rgba(192,0,0,0.3)" }}>
              <svg className="w-5 h-5 ml-2 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submitQuestion(question); }}
                placeholder="Ask anything about Clark University..."
                className="flex-1 bg-transparent px-3 py-3 text-white outline-none text-sm placeholder-white/30"
              />
              <button
                onClick={() => submitQuestion(question)}
                disabled={loading || !question.trim()}
                className="flex-shrink-0 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-30"
                style={{ background: "#C00000" }}>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : "Ask →"}
              </button>
            </div>
          </div>
        )}

        {/* Suggested questions */}
        {!answer && questionsUsed < MAX_FREE && (
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
              style={{ color: "rgba(255,255,255,0.3)" }}>Try one of these:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => submitQuestion(q)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl px-6 py-5 mb-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "rgba(192,0,0,0.6)", animationDelay: `${d}s` }} />
                ))}
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                🔍 Searching 285 Clark pages...
              </span>
            </div>
          </div>
        )}

        {/* Answer */}
        {answer && !loading && (
          <div className="rounded-2xl overflow-hidden mb-8 transition-all"
            style={{ border: "1px solid rgba(192,0,0,0.3)", boxShadow: "0 0 30px rgba(192,0,0,0.1)" }}>
            {/* Question */}
            <div className="px-5 py-3"
              style={{ background: "rgba(192,0,0,0.15)", borderBottom: "1px solid rgba(192,0,0,0.2)" }}>
              <p className="text-sm font-medium text-white">Q: {question}</p>
            </div>

            {/* Answer */}
            <div className="px-5 py-5" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                {answer}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 flex-wrap">
                {sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: "#C00000" }}>
                    🔗 {sourceTitle || sourceUrl}
                  </a>
                )}
                {confidence && (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: confidence === "high" ? "#4ade80" : confidence === "medium" ? "#fbbf24" : "#f87171" }} />
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>
                      {confidence === "high" ? "High confidence" : confidence === "medium" ? "Partial match" : "Low confidence"}
                    </span>
                  </div>
                )}
                {responseTime > 0 && (
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    ⚡ {(responseTime / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        {/* Sign up prompt after first answer */}
        {questionsUsed > 0 && questionsUsed < MAX_FREE && answer && (
          <div className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
              Enjoying CampusPulse? Create a free account for unlimited questions + voice input + chat history.
            </p>
            <Link href="/auth?tab=signup"
              className="inline-block px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ background: "#C00000" }}>
              Get full access — free →
            </Link>
          </div>
        )}

        {/* Features preview */}
        {questionsUsed === 0 && (
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "⚡", text: "Under 2 seconds" },
              { icon: "🔗", text: "Always cited" },
              { icon: "🎤", text: "Voice input" },
            ].map(f => (
              <div key={f.text} className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{f.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}