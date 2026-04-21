"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const QUICK_ACTIONS = [
  { href: "/ask", icon: "💬", label: "Ask AI", desc: "Get instant answers" },
  { href: "/deadlines", icon: "📅", label: "Deadlines", desc: "Live countdowns" },
  { href: "/gpa", icon: "📊", label: "GPA Calc", desc: "Calculate your GPA" },
  { href: "/email", icon: "✉️", label: "Email Templates", desc: "Professional emails" },
  { href: "/planner", icon: "📚", label: "Study Planner", desc: "Academic checklists" },
  { href: "/directory", icon: "👥", label: "Directory", desc: "Find staff & offices" },
  { href: "/map", icon: "🗺️", label: "Campus Map", desc: "Find buildings" },
  { href: "/dashboard", icon: "📈", label: "Analytics", desc: "Usage stats" },
];

const ANNOUNCEMENTS = [
  { type: "deadline", text: "Add/Drop deadline is approaching — check your schedule", color: "#C00000" },
  { type: "event", text: "Tech Innovation Demo Day — April 30 on campus", color: "#4F46E5" },
  { type: "tip", text: "Ask CampusPulse anything about Clark — available 24/7", color: "#059669" },
];

const TIPS = [
  "Ask CampusPulse to write an email to your professor",
  "Check your OPT status by asking the AI assistant",
  "Use the GPA calculator before registration",
  "The study planner has a full graduation checklist",
  "You can ask questions in Spanish, Hindi, Chinese, and more",
];

export default function PersonalHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; full_name: string; query_count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [tipIdx, setTipIdx] = useState(0);

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

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");

    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  const firstName = user?.full_name?.split(" ")[0] || "Student";
  const hour = new Date().getHours();
  const emoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(13,13,13,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
            style={{ background: "#C00000" }}>CP</div>
          <span className="font-black text-white">CampusPulse</span>
          <span className="text-xs px-2 py-0.5 rounded-full hidden md:block"
            style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.3)" }}>Clark</span>
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

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Greeting */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                {greeting}, {firstName}! {emoji}
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {user?.query_count ? ` · ${user.query_count} questions asked` : ""}
              </p>
            </div>
          </div>

          {/* Tip of the moment */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(192,0,0,0.08)", border: "1px solid rgba(192,0,0,0.2)" }}>
            <span className="text-lg">💡</span>
            <p className="text-sm transition-all duration-500" style={{ color: "rgba(255,255,255,0.65)" }}>
              {TIPS[tipIdx]}
            </p>
          </div>
        </div>

        {/* Announcements */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}>Announcements</h2>
          <div className="space-y-2">
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${a.color}30` }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{a.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}>Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.href} href={action.href}
                className="group p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 block"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(192,0,0,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-bold text-white text-sm">{action.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ask AI quick access */}
        <div className="rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg,rgba(192,0,0,0.15),rgba(13,13,13,0.8))", border: "1px solid rgba(192,0,0,0.3)" }}>
          <h2 className="font-black text-white text-xl mb-2">Ask Clark Anything</h2>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            285 Clark pages indexed. Get a cited answer in under 2 seconds.
          </p>
          <Link href="/ask"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
            style={{ background: "#C00000", boxShadow: "0 4px 20px rgba(192,0,0,0.3)" }}>
            Open AI Chat →
          </Link>
        </div>
      </div>
    </main>
  );
}