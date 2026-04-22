"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark", toggle: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("cp_theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("cp_theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme}
        style={{
          background: theme === "dark" ? "#0d0d0d" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#111827",
          minHeight: "100vh",
          transition: "background 0.3s ease, color 0.3s ease"
        }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);