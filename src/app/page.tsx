"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";

const ROTATING_WORDS = ["Answer.", "Deadline.", "Office.", "Resource.", "Policy."];

const FEATURES = [
  { icon: "💬", title: "AI Chat", desc: "Ask anything about Clark in plain English. Get cited answers in under 2 seconds." },
  { icon: "📅", title: "Live Deadlines", desc: "Real-time countdown timers for every important Clark deadline." },
  { icon: "🎓", title: "Course Recommender", desc: "AI-powered course matching based on your interests and career goals." },
  { icon: "📊", title: "GPA Calculator", desc: "Calculate semester and cumulative GPA using Clark's official grading scale." },
  { icon: "✉️", title: "Email Templates", desc: "Professional emails for OPT, financial aid, grade appeals and more." },
  { icon: "🌍", title: "Multi-language", desc: "Ask in English, Spanish, Hindi, Chinese, Arabic or French." },
  { icon: "🗺️", title: "Campus Map", desc: "Every Clark building with descriptions, key offices and directions." },
  { icon: "👥", title: "Staff Directory", desc: "Find every Clark office, department and staff member instantly." },
];

const STATS = [
  { value: "285", label: "Pages indexed" },
  { value: "<2s", label: "Response time" },
  { value: "6", label: "Languages" },
  { value: "100%", label: "Free forever" },
];

const NAV_LINKS = ["About", "Academics", "Admissions", "Research", "Contact"];

export default function HomePage() {
  const router = useRouter();
  const [wordIdx, setWordIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % ROTATING_WORDS.length), 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAsk = () => {
    if (query.trim()) router.push(`/ask?q=${encodeURIComponent(query)}`);
    else router.push("/ask");
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── ANNOUNCEMENT BANNER ── */}
      <div className="w-full py-2 text-center text-xs font-semibold tracking-wide text-white"
        style={{ background: "#C00000" }}>
        🎓 CampusPulse — AI-powered Clark University assistant · 100% Free · No setup needed
      </div>

      {/* ── NAV ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
        style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f3f4f6" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: "#C00000" }}>CP</div>
            <div>
              <div className="font-black text-gray-900 text-sm leading-none">CampusPulse</div>
              <div className="text-xs leading-none mt-0.5" style={{ color: "#C00000" }}>Clark University</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link} href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors hidden md:block">
              Sign in
            </Link>
            <Link href="/auth?tab=signup"
              className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ background: "#C00000" }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#0d0d0d" }}>

        {/* Sparkles */}
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="hero-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={60}
            particleColor="#C00000"
            speed={1}
            className="w-full h-full"
          />
        </div>

        {/* Red ambient glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(192,0,0,0.15) 0%, transparent 70%)" }} />
        </div>

        {/* Background image overlay */}
        <div className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live for all Clark students · 100% Free · No setup needed
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-6xl md:text-8xl font-black text-white mb-4 leading-none tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}>
            Challenge Convention.
          </motion.h1>

          <div className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight flex items-center justify-center gap-4 flex-wrap">
            <span className="text-white">Find Your</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                style={{ color: "#C00000" }}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}>
                {ROTATING_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-xl text-center max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            The AI assistant that knows every Clark University policy, deadline, office, and resource.
            Ask in plain English. Get a specific cited answer in under 5 seconds.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}>
            <div className="flex items-center gap-2 p-2 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(20px)" }}>
              <svg className="w-5 h-5 ml-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input ref={inputRef} type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAsk()}
                placeholder="Ask anything about Clark University..."
                className="flex-1 bg-transparent px-3 py-3 text-white outline-none text-base placeholder-white/30"
              />
              <button onClick={handleAsk}
                className="flex-shrink-0 px-6 py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
                style={{ background: "#C00000", boxShadow: "0 4px 20px rgba(192,0,0,0.4)" }}>
                Ask now →
              </button>
            </div>
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              Try: <button onClick={() => { setQuery("Where is the financial aid office?"); inputRef.current?.focus(); }}
                className="underline hover:text-white transition-colors">
                "Where is the financial aid office?"
              </button>
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}>
            <Link href="/auth?tab=signup"
              className="px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#C00000", boxShadow: "0 8px 30px rgba(192,0,0,0.4)" }}>
              Create free account
            </Link>
            <Link href="/try"
              className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              Try 3 free questions →
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(192,0,0,0.6), transparent)" }} />
          <svg className="w-4 h-4" style={{ color: "rgba(192,0,0,0.6)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-b border-gray-100" style={{ background: "#fafafa" }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={s.label} className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}>
              <div className="text-4xl font-black mb-1" style={{ color: "#C00000" }}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C00000" }}>
              Everything you need
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Your 3am Clark survival kit
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              No more digging through Clark's website at midnight. Everything in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-red-200 transition-all duration-300 bg-white hover:shadow-lg">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK CTA ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#0d0d0d" }}>
        <div className="absolute inset-0">
          <SparklesCore
            id="cta-sparkles"
            background="transparent"
            minSize={0.3}
            maxSize={1}
            particleDensity={30}
            particleColor="#C00000"
            speed={0.6}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(192,0,0,0.1) 0%, transparent 70%)" }} />
        </div>

        <motion.div className="relative z-10 max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <h2 className="text-5xl font-black text-white mb-4">
            Stop Googling.<br />Start Asking.
          </h2>
          <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join Clark students who get instant answers instead of spending 45 minutes on Clark's website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?tab=signup"
              className="px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90"
              style={{ background: "#C00000", boxShadow: "0 8px 30px rgba(192,0,0,0.4)" }}>
              Create free account →
            </Link>
            <Link href="/try"
              className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Try without signing up
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: "#C00000" }}>CP</div>
            <div>
              <div className="font-black text-gray-900 text-sm">CampusPulse</div>
              <div className="text-xs text-gray-400">Clark University · Worcester, MA</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/try" className="hover:text-gray-900 transition-colors">Try free</Link>
            <Link href="/ask" className="hover:text-gray-900 transition-colors">Ask AI</Link>
            <Link href="/auth" className="hover:text-gray-900 transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-gray-400">
            Not affiliated with Clark University · Student project
          </p>
        </div>
      </footer>
    </main>
  );
}