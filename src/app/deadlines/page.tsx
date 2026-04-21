"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Deadline = {
  title: string;
  date: string;
  category: string;
  color: string;
  description: string;
};

const DEADLINES: Deadline[] = [
  { title: "Summer 2025 Add/Drop", date: "2025-05-30", category: "Registration", color: "#C00000", description: "Last day to add or drop courses without academic penalty" },
  { title: "Spring 2026 Commencement", date: "2026-05-17", category: "Academic", color: "#4F46E5", description: "Clark University Commencement Ceremony" },
  { title: "Fall 2025 Registration Opens", date: "2025-04-15", category: "Registration", color: "#059669", description: "Early registration opens for continuing students" },
  { title: "Financial Aid Priority Deadline", date: "2025-05-01", category: "Financial Aid", color: "#D97706", description: "Priority deadline for financial aid applications" },
  { title: "OPT Application Deadline", date: "2025-05-15", category: "International", color: "#7C3AED", description: "Recommended OPT application submission date" },
  { title: "Thesis Submission Deadline", date: "2025-04-25", category: "Academic", color: "#DB2777", description: "Final thesis and dissertation submission deadline" },
  { title: "Summer Housing Application", date: "2025-04-20", category: "Housing", color: "#0891B2", description: "Deadline to apply for summer housing" },
  { title: "Fall 2025 Tuition Due", date: "2025-08-01", category: "Financial", color: "#C00000", description: "Fall semester tuition payment deadline" },
  { title: "Tech Innovation Demo Day", date: "2026-04-30", category: "Event", color: "#C00000", description: "Clark University Tech Innovation Challenge Demo Day 🎓" },
];

function getTimeLeft(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff < 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { passed: false, days, hours, minutes, seconds };
}

function CountdownCard({ deadline }: { deadline: Deadline }) {
  const [time, setTime] = useState(getTimeLeft(deadline.date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(deadline.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline.date]);

  const urgency = time.days <= 3 ? "urgent" : time.days <= 7 ? "soon" : "normal";

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${time.passed ? "opacity-40" : ""}`}
      style={{
        background: urgency === "urgent" ? `rgba(192,0,0,0.1)` : "rgba(255,255,255,0.04)",
        border: urgency === "urgent" ? `1px solid rgba(192,0,0,0.4)` : "1px solid rgba(255,255,255,0.08)",
        boxShadow: urgency === "urgent" ? "0 0 20px rgba(192,0,0,0.1)" : "none",
      }}>

      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: `${deadline.color}20`, color: deadline.color, border: `1px solid ${deadline.color}40` }}>
          {deadline.category}
        </span>
        {urgency === "urgent" && !time.passed && (
          <span className="text-xs font-bold text-red-400 animate-pulse">⚠️ URGENT</span>
        )}
        {urgency === "soon" && !time.passed && (
          <span className="text-xs font-bold text-yellow-400">⏰ Soon</span>
        )}
        {time.passed && (
          <span className="text-xs text-white/30">Passed</span>
        )}
      </div>

      <h3 className="font-black text-white text-base mb-1">{deadline.title}</h3>
      <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{deadline.description}</p>

      {/* Date */}
      <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
        📅 {new Date(deadline.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {/* Countdown */}
      {!time.passed ? (
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: time.days, label: "Days" },
            { value: time.hours, label: "Hours" },
            { value: time.minutes, label: "Mins" },
            { value: time.seconds, label: "Secs" },
          ].map(t => (
            <div key={t.label} className="text-center rounded-xl py-2"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="text-xl font-black text-white"
                style={{ color: urgency === "urgent" ? "#ff6b6b" : "white" }}>
                {String(t.value).padStart(2, "0")}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{t.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
          This deadline has passed
        </div>
      )}
    </div>
  );
}

export default function DeadlinesPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(DEADLINES.map(d => d.category)))];
  const filtered = filter === "All" ? DEADLINES : DEADLINES.filter(d => d.category === filter);
  const upcoming = filtered.filter(d => !getTimeLeft(d.date).passed);
  const passed = filtered.filter(d => getTimeLeft(d.date).passed);

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(13,13,13,0.95)" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: "#C00000" }}>CP</div>
            <span className="font-black text-white">CampusPulse</span>
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-sm font-semibold text-white/70">Deadlines</span>
        </div>
        <Link href="/ask"
          className="text-xs px-4 py-2 rounded-lg font-bold text-white"
          style={{ background: "#C00000" }}>
          Ask a question
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Clark Deadlines</h1>
          <p className="text-white/40">Live countdown timers for every important Clark University deadline</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={filter === cat
                ? { background: "#C00000", color: "white" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Upcoming ({upcoming.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {upcoming.map(d => <CountdownCard key={d.title} deadline={d} />)}
            </div>
          </>
        )}

        {/* Passed */}
        {passed.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              Past deadlines ({passed.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passed.map(d => <CountdownCard key={d.title} deadline={d} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}