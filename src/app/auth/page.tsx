"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<"login" | "signup">(
    params.get("tab") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const next = params.get("next") || "/ask";
  const q = params.get("q") || "";

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (!email.endsWith("@clarku.edu")) {
      setError("Please use your Clark University email (@clarku.edu)");
      setLoading(false); return;
    }
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    if (err) { setError(err.message); }
    else {
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id, email, full_name: fullName,
          created_at: new Date().toISOString(),
        }, { onConflict: "id" });
      }
      setSuccess("Check your Clark email to verify, then sign in!");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (err) { setError(err.message); }
    else {
      if (data.user) {
        await supabase.from("users")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", data.user.id);
      }
      router.push(q ? `${next}?q=${encodeURIComponent(q)}` : next);
    }
    setLoading(false);
  };

  const input = "w-full border rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-colors bg-white/5 border-white/10 focus:border-red-600/70";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "#0d0d0d" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,0,0,0.08) 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
            style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>CP</div>
          <span className="text-white font-black text-xl">CampusPulse</span>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(192,0,0,0.15)", color: "#ff6b6b" }}>Clark</span>
        </Link>

        <div className="rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {(["login", "signup"] as const).map(t => (
              <button key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className="flex-1 py-2.5 text-sm font-bold rounded-lg transition-all"
                style={tab === t
                  ? { background: "linear-gradient(135deg,#C00000,#8B0000)", color: "#fff" }
                  : { color: "rgba(255,255,255,0.4)" }}>
                {t === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Clark email</label>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@clarku.edu" required className={input} />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Password</label>
                <input type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required className={input} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>
                {loading ? "Signing in..." : "Sign in →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Full name</label>
                <input type="text" value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your name" required className={input} />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Clark email</label>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@clarku.edu" required className={input} />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Password</label>
                <input type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required minLength={8} className={input} />
              </div>
              <p className="text-xs text-white/25">
                Only @clarku.edu emails are accepted.
              </p>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>
                {loading ? "Creating account..." : "Create free account →"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Student project · Not officially affiliated with Clark University
        </p>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#0d0d0d" }} />}>
      <AuthForm />
    </Suspense>
  );
}