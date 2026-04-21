"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_ITEMS = ["About", "Academics", "Admissions", "Research", "Contact"];

const PROGRAMS = [
  { icon: "🎓", title: "Undergraduate", desc: "82 majors, minors, and concentrations across arts, sciences, and professional fields.", href: "/auth?tab=signup" },
  { icon: "📖", title: "Graduate", desc: "Advanced degrees designed for working professionals and research scholars.", href: "/auth?tab=signup" },
  { icon: "🌍", title: "International", desc: "Dedicated support for F-1 students including OPT, CPT, and visa guidance.", href: "/auth?tab=signup" },
  { icon: "⚡", title: "Accelerated 4+1", desc: "Earn your bachelor's and master's degree in just five years.", href: "/auth?tab=signup" },
];

const STATS = [
  { value: "3,500+", label: "Undergraduate Students" },
  { value: "82", label: "Academic Programs" },
  { value: "#37", label: "Best Value (US News)" },
  { value: "9:1", label: "Student-Faculty Ratio" },
];

const FOOTER_LINKS = {
  "Academics": ["Programs", "Graduate Education", "Research", "Clark Experience", "Academic Calendar"],
  "Admissions": ["Undergraduate", "Graduate", "International", "Financial Aid", "Visit Campus"],
  "Student Life": ["Housing & Dining", "Health & Wellness", "Athletics", "Student Orgs", "Worcester"],
  "About Clark": ["Mission & Values", "Leadership", "News", "Events", "Alumni"],
};

const SUGGESTIONS = [
  "What is the add/drop deadline?",
  "How do I apply for OPT?",
  "Where is the financial aid office?",
  "What are SPS program requirements?",
  "How do I contact the registrar?",
];

const CLARK_FACTS = [
  "Clark University was founded in 1887 and is one of the oldest research universities in the US.",
  "Clark is ranked #37 on US News Best Value Schools 2026.",
  "100% of Clark students complete an internship or experiential learning opportunity.",
  "Clark's 4+1 program lets you earn a bachelor's and master's in just 5 years.",
  "Clark has a 9:1 student-to-faculty ratio — one of the best in New England.",
  "Robert H. Goddard launched the world's first liquid-fueled rocket near Clark's campus in 1926.",
  "66% of Clark students receive need-based financial aid.",
  "Clark's library has over 650,000 volumes and 24/7 study spaces.",
];

type NewsArticle = {
  title: string;
  summary: string;
  url: string;
  date: string;
  category: string;
};

function ClarkNewsToday() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => { setNews(data.articles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="relative z-10 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </section>
  );

  if (news.length === 0) return null;

  return (
    <section className="relative z-10 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-sm font-black uppercase tracking-widest text-white">Clark News Today</p>
          </div>
          <a href="https://www.clarku.edu/news" target="_blank" rel="noopener noreferrer"
            className="text-xs transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            All news →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
              className="group block p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(192,0,0,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.3)" }}>
                  {article.category}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-red-300 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                {article.summary}
              </p>
              <div className="mt-3 text-xs font-semibold" style={{ color: "#C00000" }}>
                Read more →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrolled;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function TypewriterText({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx];
    const t = deleting
      ? setTimeout(() => {
          setDisplayed(d => d.slice(0, -1));
          if (displayed.length <= 1) { setDeleting(false); setIdx(i => (i + 1) % words.length); }
        }, 35)
      : setTimeout(() => {
          setDisplayed(word.slice(0, displayed.length + 1));
          if (displayed.length === word.length) setTimeout(() => setDeleting(true), 2500);
        }, 70);
    return () => clearTimeout(t);
  }, [displayed, deleting, idx, words]);
  return (
    <span style={{ color: "#C00000" }}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
function DidYouKnow() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % CLARK_FACTS.length);
        setVisible(true);
      }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl px-6 py-4 flex items-center gap-4"
      style={{ background: "rgba(192,0,0,0.06)", border: "1px solid rgba(192,0,0,0.15)" }}>
      <span className="text-2xl flex-shrink-0">💡</span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#C00000" }}>Did you know?</span>
          <div className="flex gap-1 ml-auto">
            {CLARK_FACTS.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i === idx ? "#C00000" : "rgba(192,0,0,0.2)" }} />
            ))}
          </div>
        </div>
        <p className="text-sm"
          style={{
            color: "rgba(0,0,0,0.7)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.4s ease, transform 0.4s ease"
          }}>
          {CLARK_FACTS[idx]}
        </p>
      </div>
    </div>
  );
}
export default function HomePage() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggIdx, setSuggIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const programsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef);
  const programsInView = useInView(programsRef);
  const statsInView = useInView(statsRef);
  const ctaInView = useInView(ctaRef);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setSuggIdx(i => (i + 1) % SUGGESTIONS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* ── ANNOUNCEMENT BANNER ── */}
      <div className="w-full py-2 text-center text-xs font-semibold tracking-wide text-white" style={{ background: "#C00000" }}>
        🎓 CampusPulse — AI-powered Clark University assistant · Built for the Tech Innovation Challenge 2026
      </div>

      {/* ── NAVBAR ── */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{ background: scrolled ? "rgba(255,255,255,0.98)" : "white", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-sm transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#C00000,#7a0000)" }}>CP</div>
            <div className="leading-none">
              <div className="font-black text-base text-gray-900 tracking-tight">CampusPulse</div>
              <div className="text-xs font-medium" style={{ color: "#C00000" }}>Clark University</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ background: "#C00000" }} />
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link href="/auth?tab=signup"
              className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#C00000", boxShadow: "0 4px 14px rgba(192,0,0,0.3)" }}>
              Get started free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(o => !o)}>
            <div className={`w-5 h-0.5 bg-gray-700 transition-all mb-1 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-gray-700 transition-all mb-1 ${mobileOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-gray-700 transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden px-6 pb-4 border-t border-gray-100">
            {NAV_ITEMS.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="block py-3 text-sm font-medium text-gray-600 border-b border-gray-50"
                onClick={() => setMobileOpen(false)}>{item}</a>
            ))}
            <div className="mt-4 flex gap-3">
              <Link href="/auth" className="flex-1 py-2.5 text-center text-sm border border-gray-200 rounded-lg text-gray-700">Sign in</Link>
              <Link href="/auth?tab=signup" className="flex-1 py-2.5 text-center text-sm font-bold rounded-lg text-white" style={{ background: "#C00000" }}>Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1800&q=80&auto=format&fit=crop"
            alt="Clark University campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(80,0,0,0.92) 0%, rgba(13,13,13,0.85) 60%, rgba(0,0,0,0.7) 100%)" }} />
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Content */}
        <div className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: "rgba(192,0,0,0.2)", border: "1px solid rgba(192,0,0,0.4)", color: "rgba(255,255,255,0.85)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live for all Clark students · 100% Free · No setup needed
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tight mb-6">
            Challenge Convention.
            <br />
            <TypewriterText words={[
              "Find Your Answer.",
              "Ask Clark Anything.",
              "Get Cited Facts.",
              "Change Our World.",
            ]} />
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}>
            The AI assistant that knows every Clark University policy, deadline, office, and resource.
            Ask in plain English. Get a specific cited answer in under 5 seconds.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 rounded-2xl mb-4"
              style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(192,0,0,0.4)", backdropFilter: "blur(20px)" }}>
              <svg className="ml-2 w-5 h-5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Ask anything about Clark University..."
                className="flex-1 bg-transparent px-3 py-3 text-white outline-none text-sm md:text-base placeholder-white/30"
                onKeyDown={e => {
                  if (e.key === "Enter" && query.trim())
                    window.location.href = `/auth?next=/ask&q=${encodeURIComponent(query)}`;
                }}
              />
              <Link href={`/auth?next=/ask&q=${encodeURIComponent(query)}`}
                className="flex-shrink-0 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "#C00000" }}>
                Ask now →
              </Link>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Try: <button onClick={() => setQuery(SUGGESTIONS[suggIdx])}
                className="underline underline-offset-2 transition-colors hover:text-white/70"
                style={{ color: "rgba(255,255,255,0.55)" }}>
                "{SUGGESTIONS[suggIdx]}"
              </button>
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/auth?tab=signup"
  className="px-8 py-4 rounded-xl font-black text-white text-base transition-all duration-200 hover:-translate-y-1"
  style={{ background: "#C00000", boxShadow: "0 8px 30px rgba(192,0,0,0.5)" }}>
  Create free account
</Link>
<Link href="/try"
  className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:-translate-y-1"
  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
  Try 3 free questions →
</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-white/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10" style={{ background: "#C00000" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-sm text-red-200 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DID YOU KNOW ── */}
{/* ── DID YOU KNOW ── */}
<section className="relative z-10 py-6 px-6">
  <div className="max-w-3xl mx-auto">
    <DidYouKnow />
  </div>
</section>

      {/* ── ABOUT ── */}
      <section id="about" ref={aboutRef as React.RefObject<HTMLElement>}
        className={`py-24 px-6 transition-all duration-1000 ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C00000" }}>About CampusPulse</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              Clark's website is hard to navigate.
              <span style={{ color: "#C00000" }}> We fixed it.</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Clark students waste 20–30 minutes per week searching for basic information — deadlines,
              policies, financial aid contacts, OPT procedures. CampusPulse indexes all of Clark's
              public content and makes it instantly searchable in plain English.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Every answer includes a direct citation to the official Clark.edu source page — so you
              can verify anything instantly and trust every response.
            </p>
            <div className="flex gap-4">
              <Link href="/auth?tab=signup"
                className="px-6 py-3 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                style={{ background: "#C00000", boxShadow: "0 4px 20px rgba(192,0,0,0.3)" }}>
                Get started free
              </Link>
              <Link href="/ask"
                className="px-6 py-3 rounded-lg font-semibold text-gray-700 text-sm border border-gray-200 transition-all duration-200 hover:border-red-200 hover:text-red-700">
                Try a question
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid #f3f4f6" }}>
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop"
                alt="Students at Clark University"
                className="w-full h-80 object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 rounded-xl p-4 shadow-xl"
              style={{ background: "white", border: "1px solid #f3f4f6", minWidth: "200px" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
                  style={{ background: "#C00000" }}>CP</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Answer ready</div>
                  <div className="text-xs text-gray-500">Response in 2.4s · Source cited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section id="academics" ref={programsRef as React.RefObject<HTMLElement>}
        className={`py-24 px-6 transition-all duration-1000 ${programsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        style={{ background: "#fafafa", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C00000" }}>What we cover</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Every corner of Clark, indexed.
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              CampusPulse knows every policy, deadline, and resource across all Clark departments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((p, i) => (
              <Link href={p.href} key={p.title}
                className={`group p-7 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-2 cursor-pointer block
                  ${programsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ border: "1px solid #e5e7eb", transitionDelay: `${i * 80}ms`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 text-base">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.desc}</p>
                <div className="text-xs font-bold transition-colors group-hover:text-red-600 flex items-center gap-1"
                  style={{ color: "#C00000" }}>
                  Ask about this →
                </div>
                <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{ background: "#C00000" }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Live demo card */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100"
              style={{ background: "#C00000" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
              <span className="ml-2 text-xs text-white/70 font-medium">campuspulse.clark.edu/ask</span>
            </div>
            <div className="p-6 space-y-4" style={{ background: "#0d0d0d" }}>
              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white"
                  style={{ background: "rgba(192,0,0,0.3)", border: "1px solid rgba(192,0,0,0.4)" }}>
                  What is the deadline to apply for OPT after graduation?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-1"
                  style={{ background: "#C00000" }}>CP</div>
                <div className="flex-1 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}>
                  You must apply for OPT within <strong className="text-white">60 days after your program end date</strong>.
                  Applications are filed through the ISSS office and must be submitted at least 90 days before your intended start date.
                  <div className="mt-3 text-xs flex items-center gap-2" style={{ color: "#C00000" }}>
                    🔗 clarku.edu/international-students-scholars/opt
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs pl-11" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span>Helpful?</span>
                <button className="hover:text-green-400 transition-colors">👍 Yes</button>
                <button className="hover:text-red-400 transition-colors">👎 No</button>
                <span className="ml-auto">2.1s</span>
              </div>
            </div>
          </div>

          {/* Right: Features list */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C00000" }}>Why CampusPulse</p>
            <h2 className="text-4xl font-black text-gray-900 mb-8">
              Everything Clark students need, finally in one place.
            </h2>
            <div className="space-y-5">
              {[
                { icon: "⚡", title: "Instant answers", desc: "Under 5 seconds — faster than navigating Clark's website by yourself." },
                { icon: "🔗", title: "Always cited", desc: "Direct link to the official Clark.edu page for every single answer." },
                { icon: "🌍", title: "International student focused", desc: "OPT, CPT, F-1 visa, I-20 — all the complex stuff explained simply." },
                { icon: "📅", title: "Up-to-date content", desc: "Knowledge base re-indexed regularly so deadlines are always accurate." },
              ].map(f => (
                <div key={f.title} className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-transform group-hover:scale-110"
                    style={{ background: "#fff1f1", border: "1px solid #fecaca" }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{f.title}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BIG STATS ── */}
      <section ref={statsRef as React.RefObject<HTMLElement>}
        className={`py-24 px-6 transition-all duration-1000 ${statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        style={{ background: "#f8f8f8", borderTop: "1px solid #f3f4f6" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C00000" }}>Clark University at a glance</p>
            <h2 className="text-4xl font-black text-gray-900">A world-class university.<br />An AI assistant that knows it all.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Clark pages indexed", sub: "Registrar, SPS, Financial Aid, and more" },
              { value: "5s", label: "Average response time", sub: "From question to cited answer" },
              { value: "24/7", label: "Always available", sub: "Even at 3am before a deadline" },
            ].map((s, i) => (
              <div key={s.label}
                className={`text-center transition-all duration-700 ${statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: "#C00000" }}>{s.value}</div>
                <div className="font-bold text-gray-900 mb-1">{s.label}</div>
                <div className="text-xs text-gray-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section ref={ctaRef as React.RefObject<HTMLElement>}
        className={`relative py-28 px-6 overflow-hidden transition-all duration-1000 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(120,0,0,0.95) 0%, rgba(13,13,13,0.92) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-6 text-red-300">Get started today</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Stop wasting time.<br />
            <span style={{ color: "#ff6b6b" }}>Start getting answers.</span>
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Free for every Clark student. No credit card. No setup. Ask your first question in 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?tab=signup"
              className="px-10 py-4 rounded-xl font-black text-white text-base transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: "#C00000", boxShadow: "0 8px 30px rgba(192,0,0,0.5)" }}>
              Create free account →
            </Link>
            <Link href="/ask"
              className="px-10 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              Try without signing up
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/30">
            Student project · Not officially affiliated with Clark University
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1a0000", borderTop: "1px solid rgba(192,0,0,0.2)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: "#C00000" }}>CP</div>
                <div>
                  <div className="font-black text-sm text-white">CampusPulse</div>
                  <div className="text-xs" style={{ color: "#C00000" }}>Clark University</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                AI-powered Q&A assistant for Clark University students. Built for the Tech Innovation Challenge 2026.
              </p>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C00000" }}>{category}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              © 2026 CampusPulse Clark · Student project · Not officially affiliated with Clark University
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Built with Next.js · Gemini AI · Qdrant · Supabase · Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}