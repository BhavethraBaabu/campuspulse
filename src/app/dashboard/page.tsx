"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Stats = {
  total_users: number;
  queries_today: number;
  total_queries: number;
  helpful_count: number;
  unhelpful_count: number;
  avg_response_ms: number;
};

type TopQuestion = {
  question: string;
  count: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topQuestions, setTopQuestions] = useState<TopQuestion[]>([]);
  const [recentQueries, setRecentQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "questions" | "recent">("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Total queries
    const { count: totalQueries } = await supabase
      .from("queries")
      .select("*", { count: "exact", head: true });

    // Queries today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: queriesToday } = await supabase
      .from("queries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Helpful count
    const { count: helpfulCount } = await supabase
      .from("queries")
      .select("*", { count: "exact", head: true })
      .eq("helpful", true);

    // Unhelpful count
    const { count: unhelpfulCount } = await supabase
      .from("queries")
      .select("*", { count: "exact", head: true })
      .eq("helpful", false);

    // Avg response time
    const { data: responseData } = await supabase
      .from("queries")
      .select("response_time_ms")
      .not("response_time_ms", "is", null)
      .limit(100);

    const avgMs = responseData?.length
      ? Math.round(responseData.reduce((a, b) => a + (b.response_time_ms || 0), 0) / responseData.length)
      : 0;

    setStats({
      total_users: totalUsers || 0,
      queries_today: queriesToday || 0,
      total_queries: totalQueries || 0,
      helpful_count: helpfulCount || 0,
      unhelpful_count: unhelpfulCount || 0,
      avg_response_ms: avgMs,
    });

    // Top questions
    const { data: queriesData } = await supabase
      .from("queries")
      .select("question")
      .order("created_at", { ascending: false })
      .limit(200);

    if (queriesData) {
      const counts: Record<string, number> = {};
      queriesData.forEach(q => {
        const key = q.question.toLowerCase().trim();
        counts[key] = (counts[key] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([question, count]) => ({ question, count }));
      setTopQuestions(sorted);
    }

    // Recent queries
    const { data: recent } = await supabase
      .from("queries")
      .select("question, answer, helpful, response_time_ms, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (recent) setRecentQueries(recent);

    setLoading(false);
  };

  const helpfulRate = stats
    ? stats.helpful_count + stats.unhelpful_count > 0
      ? Math.round((stats.helpful_count / (stats.helpful_count + stats.unhelpful_count)) * 100)
      : 0
    : 0;

  const STAT_CARDS = stats ? [
    { label: "Total users", value: stats.total_users, icon: "👥", color: "#4F46E5", bg: "#EEF2FF" },
    { label: "Queries today", value: stats.queries_today, icon: "💬", color: "#059669", bg: "#ECFDF5" },
    { label: "Total queries", value: stats.total_queries, icon: "📊", color: "#C00000", bg: "#FFF1F1" },
    { label: "Helpfulness rate", value: `${helpfulRate}%`, icon: "👍", color: "#D97706", bg: "#FFFBEB" },
    { label: "Avg response", value: `${(stats.avg_response_ms / 1000).toFixed(1)}s`, icon: "⚡", color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Clark pages indexed", value: "285", icon: "📚", color: "#0891B2", bg: "#ECFEFF" },
  ] : [];

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
          <span className="text-white/30 text-sm">/</span>
          <span className="text-sm font-semibold text-white/70">Analytics</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData}
            className="text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link href="/ask"
            className="text-xs px-4 py-2 rounded-lg font-bold text-white"
            style={{ background: "#C00000" }}>
            Ask a question
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Analytics Dashboard</h1>
          <p className="text-white/40 text-sm">Real usage data from Clark University students</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {STAT_CARDS.map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Helpfulness bar */}
            {stats && stats.helpful_count + stats.unhelpful_count > 0 && (
              <div className="rounded-2xl p-6 mb-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Answer quality</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {stats.helpful_count} helpful · {stats.unhelpful_count} not helpful
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${helpfulRate}%`, background: "linear-gradient(90deg, #059669, #34d399)" }} />
                </div>
                <div className="flex justify-between mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span>0%</span>
                  <span className="font-bold text-green-400">{helpfulRate}% satisfied</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {(["overview", "questions", "recent"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                  style={activeTab === tab
                    ? { background: "#C00000", color: "white" }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {tab === "overview" ? "📈 Overview" : tab === "questions" ? "❓ Top Questions" : "🕐 Recent"}
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{m.label}</span>
                      <span className="font-black text-lg" style={{ color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-white mb-4">For the judges</h3>
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
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {m.icon} {m.label}
                      </span>
                      <span className="text-sm font-bold text-white">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top questions tab */}
            {activeTab === "questions" && (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {topQuestions.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                    No questions yet — share the app with Clark students!
                  </div>
                ) : topQuestions.map((q, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-lg font-black w-6 text-center"
                      style={{ color: i < 3 ? "#C00000" : "rgba(255,255,255,0.2)" }}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-white capitalize">{q.question}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-bold"
                      style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080" }}>
                      {q.count}x
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent queries tab */}
            {activeTab === "recent" && (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {recentQueries.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                    No queries yet.
                  </div>
                ) : recentQueries.map((q, i) => (
                  <div key={i} className="px-6 py-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <span className="text-sm font-medium text-white">{q.question}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {q.helpful === true && <span className="text-xs text-green-400">👍</span>}
                        {q.helpful === false && <span className="text-xs text-red-400">👎</span>}
                        {q.response_time_ms && (
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {(q.response_time_ms / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {q.answer}
                    </p>
                    <span className="text-xs mt-1 block" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {new Date(q.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}