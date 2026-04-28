"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const TOOLS = [
  { href: "/courses", icon: "🎓", label: "Course Recommender", desc: "AI-powered matching", accent: "#C00000", bg: "rgba(192,0,0,0.08)", border: "rgba(192,0,0,0.2)" },
  { href: "/gpa", icon: "📊", label: "GPA Calculator", desc: "Clark grading scale", accent: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  { href: "/email", icon: "✉️", label: "Email Templates", desc: "Professional emails", accent: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  { href: "/planner", icon: "📚", label: "Study Planner", desc: "All milestones", accent: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)" },
  { href: "/deadlines", icon: "📅", label: "Deadlines", desc: "Live countdowns", accent: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
  { href: "/directory", icon: "👥", label: "Directory", desc: "Find any staff", accent: "#0ea5e9", bg: "rgba(14,165,233,0.08)", border: "rgba(14,165,233,0.2)" },
  { href: "/map", icon: "🗺️", label: "Campus Map", desc: "All buildings", accent: "#14b8a6", bg: "rgba(20,184,166,0.08)", border: "rgba(20,184,166,0.2)" },
  { href: "/dashboard", icon: "📈", label: "Dashboard", desc: "Usage analytics", accent: "#eab308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
];

const TIPS = [
  "Ask CampusPulse to write an email to your professor",
  "Check your OPT deadline with the AI assistant",
  "Use the GPA calculator before registration",
  "The study planner has a full graduation checklist",
  "Ask questions in Spanish, Hindi, Chinese and more",
];

const ANNOUNCEMENTS = [
  { text: "Add/Drop deadline is approaching — check your schedule", color: "#C00000" },
  { text: "Spring 2026 registration is now open on ClarkYOU", color: "#3b82f6" },
  { text: "CampusPulse is available 24/7 — ask anything!", color: "#22c55e" },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; full_name: string; query_count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipIdx, setTipIdx] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [greetingEmoji, setGreetingEmoji] = useState("🌙");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/auth"); return; }
      supabase.from("users").select("email,full_name,query_count")
        .eq("id", data.user.id).single()
        .then(({ data: u }) => {
          if (u) setUser(u);
          setLoading(false);
        });
    });
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    setGreetingEmoji(h < 12 ? "🌅" : h < 17 ? "☀️" : "🌙");
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  const firstName = user?.full_name?.split(" ")[0] || "Student";

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>

      {/* ── NAV ── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(13,13,13,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
            style={{ background: "#C00000" }}>CP</div>
          <span className="font-black text-white text-sm">CampusPulse</span>
          <span className="text-xs px-2 py-0.5 rounded-full hidden sm:block"
            style={{ background: "rgba(192,0,0,0.12)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.25)" }}>
            Clark
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/ask"
            className="text-xs px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#C00000" }}>
            Ask AI →
          </Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="text-xs px-3 py-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── GREETING ── */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                {greeting}, {firstName}! {greetingEmoji}
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                {user?.query_count ? ` · ${user.query_count} questions asked` : ""}
              </p>
            </div>
          </div>

          {/* Rotating tip */}
          <motion.div key={tipIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(192,0,0,0.07)", border: "1px solid rgba(192,0,0,0.18)" }}>
            <span className="text-base">💡</span>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{TIPS[tipIdx]}</p>
          </motion.div>
        </motion.div>

        {/* ── ANNOUNCEMENTS ── */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}>Announcements</p>
          <div className="space-y-2">
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${a.color}20` }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{a.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.25)" }}>Your Clark Toolkit</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {TOOLS.map((tool, i) => (
              <motion.div key={tool.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.05 }}>
                <Link href={tool.href}
                  className="group flex flex-col p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 block h-full"
                  style={{ background: tool.bg, border: `1px solid ${tool.border}` }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${tool.accent}20`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${tool.accent}50`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = tool.border;
                  }}>
                  <div style={{ fontSize: "26px", marginBottom: "10px" }}>{tool.icon}</div>
                  <div className="font-black text-white text-sm mb-1">{tool.label}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{tool.desc}</div>
                  <div className="mt-3 text-xs font-bold" style={{ color: tool.accent }}>Open →</div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ── ASK AI CTA — full width ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl p-5 flex items-center justify-between gap-4 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,rgba(192,0,0,0.18),rgba(13,13,13,0.9))", border: "1px solid rgba(192,0,0,0.3)" }}>
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "rgba(192,0,0,0.15)", filter: "blur(50px)" }} />
            <div className="relative z-10">
              <h2 className="font-black text-white text-lg mb-1">Ask Clark Anything</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                285 pages indexed · cited answers · under 2 seconds · 6 languages
              </p>
            </div>
            <Link href="/ask"
              className="relative z-10 flex-shrink-0 px-6 py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
              style={{ background: "#C00000", boxShadow: "0 4px 20px rgba(192,0,0,0.35)" }}>
              Open AI Chat →
            </Link>
          </motion.div>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div className="grid grid-cols-3 gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}>
          {[
            { value: "285", label: "Pages indexed" },
            { value: "<2s", label: "Response time" },
            { value: "6", label: "Languages" },
          ].map(s => (
            <div key={s.label} className="rounded-xl py-4 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-2xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center py-5 mt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          CampusPulse · Clark University · Knowledge base updated April 2026
        </p>
      </div>
    </main>
  );
}