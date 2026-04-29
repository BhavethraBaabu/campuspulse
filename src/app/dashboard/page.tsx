"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { NeonButton } from "@/components/ui/neon-button";

type Stats = {
  total_users: number;
  queries_today: number;
  total_queries: number;
  helpful_count: number;
  unhelpful_count: number;
  avg_response_ms: number;
};

type TopQuestion = { question: string; count: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topQuestions, setTopQuestions] = useState<TopQuestion[]>([]);
  const [recentQueries, setRecentQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "questions" | "recent">("overview");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });
    const { count: totalQueries } = await supabase.from("queries").select("*", { count: "exact", head: true });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { count: queriesToday } = await supabase.from("queries").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString());
    const { count: helpfulCount } = await supabase.from("queries").select("*", { count: "exact", head: true }).eq("helpful", true);
    const { count: unhelpfulCount } = await supabase.from("queries").select("*", { count: "exact", head: true }).eq("helpful", false);
    const { data: responseData } = await supabase.from("queries").select("response_time_ms").not("response_time_ms", "is", null).limit(100);
    const avgMs = responseData?.length ? Math.round(responseData.reduce((a, b) => a + (b.response_time_ms || 0), 0) / responseData.length) : 0;

    setStats({ total_users: totalUsers || 0, queries_today: queriesToday || 0, total_queries: totalQueries || 0, helpful_count: helpfulCount || 0, unhelpful_count: unhelpfulCount || 0, avg_response_ms: avgMs });

    const { data: queriesData } = await supabase.from("queries").select("question").order("created_at", { ascending: false }).limit(200);
    if (queriesData) {
      const counts: Record<string, number> = {};
      queriesData.forEach(q => { const key = q.question.toLowerCase().trim(); counts[key] = (counts[key] || 0) + 1; });
      setTopQuestions(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([question, count]) => ({ question, count })));
    }

    const { data: recent } = await supabase.from("queries").select("question, answer, helpful, response_time_ms, created_at").order("created_at", { ascending: false }).limit(20);
    if (recent) setRecentQueries(recent);
    setLoading(false);
  };

  const helpfulRate = stats && stats.helpful_count + stats.unhelpful_count > 0
    ? Math.round((stats.helpful_count / (stats.helpful_count + stats.unhelpful_count)) * 100) : 0;

  const STAT_CARDS = stats ? [
    { label: "Total users", value: stats.total_users, icon: "👥", accent: "#4F46E5" },
    { label: "Queries today", value: stats.queries_today, icon: "💬", accent: "#059669" },
    { label: "Total queries", value: stats.total_queries, icon: "📊", accent: "#C00000" },
    { label: "Helpfulness", value: `${helpfulRate}%`, icon: "👍", accent: "#D97706" },
    { label: "Avg response", value: `${(stats.avg_response_ms / 1000).toFixed(1)}s`, icon: "⚡", accent: "#7C3AED" },
    { label: "Pages indexed", value: "285", icon: "📚", accent: "#0891B2" },
  ] : [];

  const TABS = [
    { key: "overview", label: "📈 Overview" },
    { key: "questions", label: "❓ Top Questions" },
    { key: "recent", label: "🕐 Recent" },
  ] as const;

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>

      {/* ── NAV ── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(13,13,13,0.97)" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black text-white text-sm">CampusPulse</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(192,0,0,0.25)", color: "#ff8080" }}>Clark</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Analytics</span>
        </div>

        <div className="flex items-center gap-3">
          <NeonButton
            onClick={fetchData}
            variant="ghost" size="sm"
            className="text-xs rounded-lg flex items-center gap-1.5"
            style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </NeonButton>
          <Link href="/ask">
            <NeonButton variant="solid" size="sm"
              className="font-bold text-white rounded-lg"
              style={{ background: "#C00000" }}>
              Ask a question
            </NeonButton>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── HEADER ── */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-2">Analytics Dashboard</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Real usage data from Clark University students</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {STAT_CARDS.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-4 text-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.accent}25` }}>
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>{s.icon}</div>
                  <div className="text-2xl font-black mb-1" style={{ color: s.accent }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* ── HELPFULNESS BAR ── */}
            {stats && stats.helpful_count + stats.unhelpful_count > 0 && (
              <motion.div className="rounded-2xl p-6 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Answer quality</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {stats.helpful_count} helpful · {stats.unhelpful_count} not helpful
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${helpfulRate}%` }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    style={{ background: "linear-gradient(90deg,#059669,#34d399)" }} />
                </div>
                <div className="flex justify-between mt-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <span>0%</span>
                  <span className="font-bold text-green-400">{helpfulRate}% satisfied</span>
                  <span>100%</span>
                </div>
              </motion.div>
            )}

            {/* ── TABS ── */}
            <div className="flex gap-2 mb-6">
              {TABS.map(tab => (
                <NeonButton
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  variant={activeTab === tab.key ? "solid" : "ghost"}
                  size="sm"
                  className="text-sm font-semibold rounded-xl transition-all"
                  style={activeTab === tab.key
                    ? { background: "#C00000", color: "white" }
                    : { color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {tab.label}
                </NeonButton>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-white mb-4">Key metrics</h3>
                  {[
                    { label: "Total registered users", value: stats?.total_users || 0, color: "#4F46E5" },
                    { label: "Total questions asked", value: stats?.total_queries || 0, color: "#C00000" },
                    { label: "Questions today", value: stats?.queries_today || 0, color: "#059669" },
                    { label: "Avg response time", value: `${((stats?.avg_response_ms || 0) / 1000).toFixed(1)}s`, color: "#D97706" },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{m.label}</span>
                      <span className="font-black text-lg" style={{ color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-white mb-4">Tech stack</h3>
                  {[
                    { label: "Clark pages indexed", value: "285", icon: "📄" },
                    { label: "Answer model", value: "Llama 3.1", icon: "🤖" },
                    { label: "Vector DB", value: "Qdrant Cloud", icon: "🔍" },
                    { label: "Auth provider", value: "Supabase", icon: "🔐" },
                    { label: "Monthly cost", value: "$0", icon: "💸" },
                    { label: "Deployment", value: "Vercel", icon: "🚀" },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {m.icon} {m.label}
                      </span>
                      <span className="text-sm font-bold text-white">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="md:col-span-2 rounded-2xl p-6 flex items-center justify-between gap-4"
                  style={{ background: "linear-gradient(135deg,rgba(192,0,0,0.15),rgba(13,13,13,0.9))", border: "1px solid rgba(192,0,0,0.3)" }}>
                  <div>
                    <h3 className="font-black text-white text-lg mb-1">Share CampusPulse with Clark students</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Every question asked helps us improve. Share with your classmates!
                    </p>
                  </div>
                  <Link href="/ask">
                    <NeonButton variant="solid" size="default"
                      className="font-black text-white rounded-xl flex-shrink-0"
                      style={{ background: "#C00000", boxShadow: "0 4px 20px rgba(192,0,0,0.3)" }}>
                      Ask a question →
                    </NeonButton>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── TOP QUESTIONS TAB ── */}
            {activeTab === "questions" && (
              <motion.div className="rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {topQuestions.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                    No questions yet — share the app with Clark students!
                  </div>
                ) : topQuestions.map((q, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-lg font-black w-6 text-center"
                      style={{ color: i < 3 ? "#C00000" : "rgba(255,255,255,0.2)" }}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-white capitalize">{q.question}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.2)" }}>
                      {q.count}x
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── RECENT TAB ── */}
            {activeTab === "recent" && (
              <motion.div className="rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {recentQueries.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>No queries yet.</div>
                ) : recentQueries.map((q, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="px-6 py-4 hover:bg-white/5 transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <span className="text-sm font-medium text-white">{q.question}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {q.helpful === true && <span className="text-xs text-green-400">👍</span>}
                        {q.helpful === false && <span className="text-xs text-red-400">👎</span>}
                        {q.response_time_ms && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                            ⚡ {(q.response_time_ms / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs line-clamp-2 mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{q.answer}</p>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {new Date(q.created_at).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}