"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sourceUrl?: string;
  sourceTitle?: string;
  helpful?: boolean | null;
  loading?: boolean;
  copied?: boolean;
  confidence?: "high" | "medium" | "low";
  responseTime?: number;
  askCount?: number;
  mapLocation?: { lat: number; lng: number; name: string } | null;
};

const CATEGORIES = [
  {
    label: "📅 Deadlines",
    questions: [
      "What is the add/drop deadline?",
      "What is the late withdrawal deadline?",
      "When does spring registration open?",
      "What is the final exam schedule?",
    ],
  },
  {
    label: "💰 Financial Aid",
    questions: [
      "Where is the financial aid office?",
      "How do I apply for financial aid?",
      "What scholarships are available at Clark?",
      "When is financial aid disbursed?",
    ],
  },
  {
    label: "🌍 International",
    questions: [
      "How do I apply for OPT?",
      "What is CPT at Clark?",
      "How do I extend my F-1 visa?",
      "Where is the ISSS office?",
    ],
  },
  {
    label: "📋 Registrar",
    questions: [
      "How do I get a transcript?",
      "How do I declare a major?",
      "What is the grading scale at Clark?",
      "How do I contact the registrar?",
    ],
  },
];

const LANGUAGES = [
  { code: "English", flag: "🇺🇸" },
  { code: "Spanish", flag: "🇪🇸" },
  { code: "Chinese", flag: "🇨🇳" },
  { code: "Hindi", flag: "🇮🇳" },
  { code: "Arabic", flag: "🇸🇦" },
  { code: "French", flag: "🇫🇷" },
];

const PLACEHOLDERS = [
  "Ask me about the add/drop deadline...",
  "Confused about OPT? Just ask...",
  "Where is the financial aid office?",
  "What are library hours?",
  "How do I request a transcript?",
  "Lost on campus? Ask for directions...",
  "What is the grading scale at Clark?",
  "How do I apply for CPT?",
  "When does spring registration open?",
  "What scholarships are available?",
];

const FOLLOWUPS: Record<string, string[]> = {
  "add": ["What is the late withdrawal deadline?", "How do I drop a course?", "What happens after the add/drop period?"],
  "opt": ["What is CPT at Clark?", "How long does OPT approval take?", "Where is the ISSS office?"],
  "financial": ["What scholarships are available?", "When is financial aid disbursed?", "How do I appeal my financial aid?"],
  "transcript": ["How do I order an official transcript?", "How long does a transcript take?", "Is there a transcript fee?"],
  "withdraw": ["What is the add/drop deadline?", "Will a W grade affect my GPA?", "How do I contact my advisor?"],
  "default": ["What are library hours?", "How do I contact the registrar?", "Where is student health services?"],
};

function getFollowups(question: string): string[] {
  const q = question.toLowerCase();
  for (const [key, suggestions] of Object.entries(FOLLOWUPS)) {
    if (key !== "default" && q.includes(key)) return suggestions;
  }
  return FOLLOWUPS.default;
}

const OFFICE_LOCATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  "financial": { lat: 42.2510, lng: -71.8228, name: "Financial Aid Office" },
  "registrar": { lat: 42.2508, lng: -71.8225, name: "Registrar's Office" },
  "library": { lat: 42.2515, lng: -71.8220, name: "Goddard Library" },
  "isss": { lat: 42.2512, lng: -71.8230, name: "ISSS Office" },
  "career": { lat: 42.2506, lng: -71.8235, name: "Career Connections Center" },
  "health": { lat: 42.2518, lng: -71.8222, name: "Student Health Services" },
  "housing": { lat: 42.2520, lng: -71.8218, name: "Residential Life" },
};

function getOfficeLocation(question: string, answer: string) {
  const text = (question + " " + answer).toLowerCase();
  for (const [key, location] of Object.entries(OFFICE_LOCATIONS)) {
    if (text.includes(key)) return location;
  }
  return null;
}

const TOOLS = [
  { href: "/courses", icon: "🎓", label: "Course Recommender", accent: "#C00000" },
  { href: "/gpa", icon: "📊", label: "GPA Calculator", accent: "#3b82f6" },
  { href: "/email", icon: "✉️", label: "Email Templates", accent: "#22c55e" },
  { href: "/planner", icon: "📚", label: "Study Planner", accent: "#a855f7" },
  { href: "/deadlines", icon: "📅", label: "Deadlines", accent: "#f97316" },
  { href: "/directory", icon: "👥", label: "Directory", accent: "#0ea5e9" },
  { href: "/map", icon: "🗺️", label: "Campus Map", accent: "#14b8a6" },
  { href: "/dashboard", icon: "📈", label: "Dashboard", accent: "#eab308" },
];

function AskChat() {
  const router = useRouter();
  const params = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; full_name: string } | null>(null);
  const [queryCount, setQueryCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [language, setLanguage] = useState("English");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/auth"); return; }
      supabase.from("users").select("email,full_name,query_count")
        .eq("id", data.user.id).single()
        .then(({ data: u }) => {
          if (u) { setUser(u); setQueryCount(u.query_count || 0); }
        });
    });
    const q = params.get("q");
    if (q) setTimeout(() => submitQuestion(q), 600);
    try {
      const saved = localStorage.getItem("cp_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const exportToPDF = () => {
    setExporting(true);
    const html = `<html><head><title>CampusPulse Clark - Chat Export</title>
      <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#333}
      h1{color:#C00000;border-bottom:2px solid #C00000;padding-bottom:10px}
      .message{margin:20px 0;padding:15px;border-radius:8px}
      .user{background:#fff0f0;border-left:4px solid #C00000}
      .assistant{background:#f8f8f8;border-left:4px solid #666}
      .role{font-weight:bold;font-size:12px;text-transform:uppercase;color:#999;margin-bottom:5px}
      .source{font-size:12px;color:#C00000;margin-top:8px}
      .footer{margin-top:40px;font-size:12px;color:#999;text-align:center}</style></head><body>
      <h1>CampusPulse Clark — Chat Export</h1>
      <p style="color:#999;font-size:13px">Exported on ${new Date().toLocaleDateString()} · clarku.edu</p>
      ${messages.filter(m => !m.loading).map(m => `
        <div class="message ${m.role}">
          <div class="role">${m.role === "user" ? "You" : "CampusPulse AI"}</div>
          <div>${m.content}</div>
          ${m.sourceUrl ? `<div class="source">📎 Source: <a href="${m.sourceUrl}">${m.sourceTitle || m.sourceUrl}</a></div>` : ""}
          ${m.responseTime ? `<div class="source">⚡ ${(m.responseTime / 1000).toFixed(1)}s</div>` : ""}
        </div>`).join("")}
      <div class="footer">Generated by CampusPulse Clark</div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campuspulse-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const getAskCount = async (question: string): Promise<number> => {
    const { count } = await supabase
      .from("queries").select("*", { count: "exact", head: true })
      .ilike("question", `%${question.split(" ").slice(0, 3).join(" ")}%`);
    return count || 0;
  };

  const submitQuestion = async (question: string) => {
    if (!question.trim() || loading) return;
    const newHistory = [question, ...history.filter(h => h !== question)].slice(0, 15);
    setHistory(newHistory);
    try { localStorage.setItem("cp_history", JSON.stringify(newHistory)); } catch {}
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: question };
    const loadMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "", loading: true };
    setMessages(m => [...m, userMsg, loadMsg]);
    setLoading(true);
    try {
      const [res, askCount] = await Promise.all([
        fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, language }),
        }),
        getAskCount(question),
      ]);
      const data = await res.json();
      const mapLocation = getOfficeLocation(question, data.answer || "");
      setMessages(m => m.map(msg => msg.id === loadMsg.id
        ? { ...msg, content: data.answer, sourceUrl: data.sourceUrl, sourceTitle: data.sourceTitle, confidence: data.confidence, responseTime: data.responseTime, askCount, mapLocation, loading: false, helpful: null, copied: false }
        : msg));
      setQueryCount(c => c + 1);
    } catch {
      setMessages(m => m.map(msg => msg.id === loadMsg.id
        ? { ...msg, content: "Sorry, something went wrong. Please try again.", loading: false }
        : msg));
    }
    setLoading(false);
  };

  const handleFeedback = (msgId: string, helpful: boolean) => {
    setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, helpful } : msg));
  };

  const handleCopy = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, copied: true } : msg));
    setTimeout(() => setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, copied: false } : msg)), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const lastUserQuestion = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
  const followups = getFollowups(lastUserQuestion);
  const hasMessages = messages.length > 0;
  const completedMessages = messages.filter(m => !m.loading && m.role === "assistant" && m.content);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#0d0d0d" }}>

      {/* ── TOP NAV ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(13,13,13,0.97)", backdropFilter: "blur(20px)", zIndex: 50 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(o => !o)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: "#C00000" }}>CP</div>
            <span className="font-black text-white text-sm hidden md:block">CampusPulse Clark</span>
          </Link>
        </div>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1"
          style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { href: "/home", icon: "🏠", label: "Home" },
            { href: "/deadlines", icon: "📅", label: "Deadlines" },
            { href: "/directory", icon: "👥", label: "Directory" },
            { href: "/map", icon: "🗺️", label: "Map" },
            { href: "/dashboard", icon: "📈", label: "Dashboard" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {queryCount > 0 && (
            <span className="text-xs hidden md:block" style={{ color: "rgba(255,255,255,0.3)" }}>
              {queryCount} asked
            </span>
          )}
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: "#1a1a1a" }}>{l.flag} {l.code}</option>
            ))}
          </select>
          {completedMessages.length > 0 && (
            <button onClick={exportToPDF} disabled={exporting}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          )}
          {hasMessages && (
            <button onClick={() => setMessages([])}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── SIDEBAR ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-shrink-0 flex flex-col overflow-hidden"
              style={{ borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}>
              <div className="w-[220px] flex flex-col h-full p-3">
                <button onClick={() => setMessages([])}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all"
                  style={{ background: "rgba(192,0,0,0.15)", border: "1px solid rgba(192,0,0,0.3)", color: "#ff8080" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New chat
                </button>

                <div className="mb-4 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest px-1 mb-2"
                    style={{ color: "rgba(255,255,255,0.25)" }}>Tools</p>
                  {TOOLS.map(tool => (
                    <Link key={tool.href} href={tool.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                      <span>{tool.icon}</span>
                      <span>{tool.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {history.length > 0 && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2 px-1"
                        style={{ color: "rgba(255,255,255,0.25)" }}>Recent</p>
                      <div className="space-y-1">
                        {history.map((q, i) => (
                          <button key={i} onClick={() => submitQuestion(q)}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all truncate"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {user && (
                  <div className="mt-auto pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ background: "rgba(192,0,0,0.4)" }}>
                        {user.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{user.full_name || "Student"}</div>
                        <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{user.email}</div>
                      </div>
                    </div>
                    <button onClick={handleSignOut}
                      className="w-full text-xs px-3 py-2 rounded-lg transition-all text-left"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">

            {/* ── EMPTY STATE ── */}
            {!hasMessages && (
              <motion.div className="pt-4 pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}>

                {/* Header */}
                <motion.div className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}>
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl mx-auto mb-4"
                    style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}>
                    CP
                  </motion.div>
                  <motion.h2 className="text-2xl font-black text-white mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}>
                    What do you need to know?
                  </motion.h2>
                  <motion.p className="text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}>
                    Ask anything about Clark University
                  </motion.p>
                </motion.div>

                {/* Tools grid 3 cols */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {TOOLS.map((tool, i) => (
                    <motion.div key={tool.href}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 200, damping: 20 }}>
                      <Link href={tool.href}
                        className="group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-200 block"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${tool.accent}50`;
                          (e.currentTarget as HTMLElement).style.background = `${tool.accent}12`;
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 25px ${tool.accent}20`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }}>
                        <motion.div
                          style={{ fontSize: "26px", marginBottom: "8px" }}
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}>
                          {tool.icon}
                        </motion.div>
                        <div className="text-xs font-bold text-white leading-tight">{tool.label}</div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <motion.div className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>or ask directly</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                </motion.div>

                {/* Category tabs */}
                <motion.div className="flex gap-2 mb-4 flex-wrap justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}>
                  {CATEGORIES.map((cat, i) => (
                    <motion.button key={i} onClick={() => setActiveCategory(i)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                      style={activeCategory === i
                        ? { background: "#C00000", color: "white" }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}>
                      {cat.label}
                    </motion.button>
                  ))}
                </motion.div>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 }}>
                  {CATEGORIES[activeCategory].questions.map((q, i) => (
                    <motion.button key={i} onClick={() => submitQuestion(q)}
                      className="text-left px-4 py-3 rounded-xl text-sm transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)";
                        (e.currentTarget as HTMLElement).style.color = "white";
                        (e.currentTarget as HTMLElement).style.background = "rgba(192,0,0,0.08)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      }}>
                      {q}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div key={msg.id}>
                  <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-1"
                        style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>CP</div>
                    )}
                    <div className="max-w-xl">
                      {msg.role === "user" ? (
                        <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
                          style={{ background: "rgba(192,0,0,0.25)", border: "1px solid rgba(192,0,0,0.35)" }}>
                          {msg.content}
                        </div>
                      ) : msg.loading ? (
                        <div className="px-4 py-4 rounded-2xl rounded-tl-sm"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Searching Clark website</span>
                            {[0, 0.2, 0.4].map((d, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                style={{ background: "rgba(192,0,0,0.6)", animationDelay: `${d}s` }} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.sourceUrl && (
                              <a href={msg.sourceUrl} target="_blank" rel="noopener noreferrer"
                                className="mt-3 flex items-center gap-1.5 text-xs hover:opacity-80"
                                style={{ color: "#C00000" }}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                {msg.sourceTitle || msg.sourceUrl}
                              </a>
                            )}
                            {msg.mapLocation && (
                              <div className="mt-3 rounded-xl overflow-hidden"
                                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                                <div className="flex items-center gap-2 px-3 py-2"
                                  style={{ background: "rgba(255,255,255,0.06)" }}>
                                  <span className="text-xs">📍</span>
                                  <span className="text-xs font-medium text-white">{msg.mapLocation.name}</span>
                                  <a href={`https://maps.google.com?q=Clark+University+${encodeURIComponent(msg.mapLocation.name)}+Worcester+MA`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="ml-auto text-xs font-semibold"
                                    style={{ color: "#C00000" }}>
                                    Open in Maps →
                                  </a>
                                </div>
                                <div className="px-3 py-2 text-xs"
                                  style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
                                  📌 Clark University · Worcester, MA 01610
                                </div>
                              </div>
                            )}
                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                              {msg.confidence && (
                                <div className="flex items-center gap-1 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{
                                    background: msg.confidence === "high" ? "#4ade80" : msg.confidence === "medium" ? "#fbbf24" : "#f87171"
                                  }} />
                                  <span style={{ color: "rgba(255,255,255,0.35)" }}>
                                    {msg.confidence === "high" ? "High confidence" : msg.confidence === "medium" ? "Partial match" : "Low confidence"}
                                  </span>
                                </div>
                              )}
                              {msg.responseTime && (
                                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                                  ⚡ {(msg.responseTime / 1000).toFixed(1)}s
                                </span>
                              )}
                              {msg.askCount && msg.askCount > 1 && (
                                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                                  👥 {msg.askCount} students asked this
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-2 ml-1 flex-wrap">
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Helpful?</span>
                            {msg.helpful === null && (
                              <>
                                <button onClick={() => handleFeedback(msg.id, true)}
                                  className="text-xs px-2 py-1 rounded-lg transition-colors"
                                  style={{ color: "rgba(255,255,255,0.3)" }}>👍 Yes</button>
                                <button onClick={() => handleFeedback(msg.id, false)}
                                  className="text-xs px-2 py-1 rounded-lg transition-colors"
                                  style={{ color: "rgba(255,255,255,0.3)" }}>👎 No</button>
                              </>
                            )}
                            {msg.helpful === true && <span className="text-xs text-green-400/60">Thanks!</span>}
                            {msg.helpful === false && <span className="text-xs text-red-400/60">Thanks, we will improve.</span>}
                            <button onClick={() => handleCopy(msg.id, msg.content)}
                              className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                              style={{ color: msg.copied ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                              {msg.copied ? "✓ Copied!" : (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.role === "assistant" && !msg.loading && idx === messages.length - 1 && (
                    <div className="mt-4 ml-11">
                      <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Related questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {followups.map((q, i) => (
                          <button key={i} onClick={() => submitQuestion(q)}
                            className="text-xs px-3 py-1.5 rounded-full transition-all"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── INPUT BAR ── */}
          <div className="flex-shrink-0 px-4 py-4 max-w-3xl mx-auto w-full">
            <AnimatedAIChat
              onSubmit={(q) => submitQuestion(q)}
              loading={loading}
              placeholder={PLACEHOLDERS[placeholderIdx]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="h-screen" style={{ background: "#0d0d0d" }} />}>
      <AskChat />
    </Suspense>
  );
}