"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Paperclip, SendIcon, XIcon, LoaderIcon, Command, MicIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback((reset?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (reset) { textarea.style.height = `${minHeight}px`; return; }
    textarea.style.height = `${minHeight}px`;
    textarea.style.height = `${Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Infinity))}px`;
  }, [minHeight, maxHeight]);
  useEffect(() => { if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`; }, [minHeight]);
  return { textareaRef, adjustHeight };
}

const CLARK_COMMANDS = [
  { icon: "📅", label: "Deadlines", description: "Check upcoming Clark deadlines", prefix: "/deadlines" },
  { icon: "💰", label: "Financial Aid", description: "Financial aid questions", prefix: "/financial" },
  { icon: "🌍", label: "OPT/CPT", description: "International student questions", prefix: "/opt" },
  { icon: "📋", label: "Registrar", description: "Registration and transcripts", prefix: "/registrar" },
];

function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map(dot => (
        <motion.div key={dot}
          className="w-1.5 h-1.5 rounded-full mx-0.5"
          style={{ background: "#C00000" }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

interface AnimatedAIChatProps {
  onSubmit?: (question: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export function AnimatedAIChat({ onSubmit, loading = false, placeholder = "Ask anything about Clark University..." }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const idx = CLARK_COMMANDS.findIndex(c => c.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(e.target as Node)) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion(p => p < CLARK_COMMANDS.length - 1 ? p + 1 : 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion(p => p > 0 ? p - 1 : CLARK_COMMANDS.length - 1); }
      else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) { setValue(CLARK_COMMANDS[activeSuggestion].prefix + " "); setShowCommandPalette(false); }
      } else if (e.key === "Escape") { setShowCommandPalette(false); }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSubmit?.(value.trim());
    setValue("");
    adjustHeight(true);
  };

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported. Try Chrome."); return; }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setValue(transcript);
      adjustHeight();
    };
    recognition.start();
  };

  const selectCommand = (idx: number) => {
    setValue(CLARK_COMMANDS[idx].prefix + " ");
    setShowCommandPalette(false);
  };

  return (
    <div className="relative w-full">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20"
          style={{ background: "#C00000" }} />
      </div>

      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,0,0,0.25)" }}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}>

        {/* Command palette */}
        <AnimatePresence>
          {showCommandPalette && (
            <motion.div ref={commandPaletteRef}
              className="absolute left-4 right-4 bottom-full mb-2 rounded-xl overflow-hidden z-50"
              style={{ background: "rgba(13,13,13,0.98)", border: "1px solid rgba(192,0,0,0.3)" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(192,0,0,0.2)" }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C00000" }}>Clark Shortcuts</p>
              </div>
              {CLARK_COMMANDS.map((cmd, i) => (
                <motion.div key={cmd.prefix}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors"
                  style={{ background: activeSuggestion === i ? "rgba(192,0,0,0.1)" : "transparent" }}
                  onClick={() => selectCommand(i)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}>
                  <span className="text-lg">{cmd.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-white">{cmd.label}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{cmd.description}</div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: "rgba(192,0,0,0.6)" }}>{cmd.prefix}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="p-4">
          <textarea ref={textareaRef} value={value}
            onChange={e => { setValue(e.target.value); adjustHeight(); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder-white/20"
            style={{ minHeight: "60px", maxHeight: "120px", overflow: "hidden" }}
          />
        </div>

        {/* Attachments */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div className="px-4 pb-3 flex gap-2 flex-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}>
              {attachments.map((file, i) => (
                <motion.div key={i}
                  className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg"
                  style={{ background: "rgba(192,0,0,0.1)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(192,0,0,0.2)" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}>
                  <span>{file}</span>
                  <button onClick={() => setAttachments(a => a.filter((_, idx) => idx !== i))}
                    className="hover:text-white transition-colors">
                    <XIcon className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

          {/* Left side — attach + command */}
          <div className="flex items-center gap-2">
            <motion.button type="button" whileTap={{ scale: 0.94 }}
              onClick={() => setAttachments(a => [...a, `file-${Math.random().toString(36).slice(2, 6)}.pdf`])}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
              <Paperclip className="w-4 h-4" />
            </motion.button>

            <motion.button type="button" whileTap={{ scale: 0.94 }}
              onClick={() => setShowCommandPalette(p => !p)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: showCommandPalette ? "#C00000" : "rgba(255,255,255,0.3)",
                background: showCommandPalette ? "rgba(192,0,0,0.1)" : "transparent"
              }}
              onMouseEnter={e => { if (!showCommandPalette) (e.currentTarget.style.color = "white"); }}
              onMouseLeave={e => { if (!showCommandPalette) (e.currentTarget.style.color = "rgba(255,255,255,0.3)"); }}>
              <Command className="w-4 h-4" />
            </motion.button>

            <span className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.2)" }}>
              Type / for shortcuts
            </span>
          </div>

          {/* Right side — mic + ask */}
          <div className="flex items-center gap-2">
            {/* Mic button */}
            <motion.button type="button"
              onClick={handleVoice}
              whileTap={{ scale: 0.94 }}
              className="p-2 rounded-xl transition-all"
              style={{
                background: listening ? "rgba(192,0,0,0.25)" : "rgba(255,255,255,0.06)",
                border: listening ? "1px solid rgba(192,0,0,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: listening ? "#ff6b6b" : "rgba(255,255,255,0.5)",
              }}>
              {listening ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                </div>
              ) : (
                <MicIcon className="w-4 h-4" />
              )}
            </motion.button>

            {/* Ask button */}
            <motion.button type="button"
              onClick={handleSend}
              whileHover={value.trim() ? { scale: 1.02 } : {}}
              whileTap={value.trim() ? { scale: 0.97 } : {}}
              disabled={loading || !value.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-30"
              style={{
                background: value.trim() ? "#C00000" : "rgba(192,0,0,0.15)",
                color: "white",
                boxShadow: value.trim() ? "0 4px 15px rgba(192,0,0,0.3)" : "none",
              }}>
              {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
              <span>Ask</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Typing indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div className="flex items-center gap-2 mt-2 ml-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
              style={{ background: "#C00000" }}>CP</div>
            <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>Searching Clark</span>
              <TypingDots />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mouse glow when focused */}
      {inputFocused && (
        <motion.div
          className="fixed w-96 h-96 rounded-full pointer-events-none z-0 blur-[96px]"
          style={{ opacity: 0.04, background: "radial-gradient(circle, #C00000, transparent)" }}
          animate={{ x: mousePosition.x - 192, y: mousePosition.y - 192 }}
          transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }}
        />
      )}
    </div>
  );
}