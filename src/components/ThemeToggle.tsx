"use client";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
        color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
      }}>
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}