"use client";
import { useState } from "react";
import Link from "next/link";
import { NeonButton } from "@/components/ui/neon-button";

type Task = {
  id: string;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  category: string;
};

type Scenario = {
  key: string;
  label: string;
  icon: string;
  desc: string;
  tasks: Task[];
};

const SCENARIOS: Scenario[] = [
  {
    key: "finals",
    label: "Finals Prep",
    icon: "📚",
    desc: "Everything you need before final exams",
    tasks: [
      { id: "f1", text: "Check final exam schedule on Clark portal", done: false, priority: "high", category: "Admin" },
      { id: "f2", text: "Request accommodations from Student Accessibility Services", done: false, priority: "high", category: "Admin" },
      { id: "f3", text: "Return all library books to avoid fines", done: false, priority: "low", category: "Admin" },
      { id: "f4", text: "Submit course evaluations for each class", done: false, priority: "low", category: "Admin" },
      { id: "f5", text: "Submit all outstanding assignments before finals week", done: false, priority: "high", category: "Academic" },
      { id: "f6", text: "Meet with professors during office hours", done: false, priority: "medium", category: "Academic" },
      { id: "f7", text: "Review syllabus — note what's on each final", done: false, priority: "high", category: "Academic" },
      { id: "f8", text: "Check grade requirements to pass each course", done: false, priority: "high", category: "Academic" },
      { id: "f9", text: "Book a study room at Goddard Library", done: false, priority: "medium", category: "Resources" },
      { id: "f10", text: "Form or join a study group for each exam", done: false, priority: "medium", category: "Resources" },
    ],
  },
  {
    key: "registration",
    label: "Course Registration",
    icon: "📋",
    desc: "Plan your next semester registration",
    tasks: [
      { id: "r1", text: "Check your registration date on ClarkYOU", done: false, priority: "high", category: "Admin" },
      { id: "r2", text: "Confirm financial aid covers your credit load", done: false, priority: "high", category: "Admin" },
      { id: "r3", text: "Meet with academic advisor to plan courses", done: false, priority: "high", category: "Planning" },
      { id: "r4", text: "Build a list of 8–10 courses (primary + backups)", done: false, priority: "high", category: "Planning" },
      { id: "r5", text: "Check for time conflicts in your schedule", done: false, priority: "medium", category: "Planning" },
      { id: "r6", text: "Look up professor ratings for each course", done: false, priority: "low", category: "Planning" },
      { id: "r7", text: "Check prerequisites for each course you want", done: false, priority: "high", category: "Academic" },
      { id: "r8", text: "Verify courses satisfy your major requirements", done: false, priority: "medium", category: "Academic" },
    ],
  },
  {
    key: "graduation",
    label: "Graduation",
    icon: "🎓",
    desc: "Complete graduation checklist",
    tasks: [
      { id: "g1", text: "Apply for graduation on ClarkYOU by the deadline", done: false, priority: "high", category: "Admin" },
      { id: "g2", text: "Request official transcripts to be sent out", done: false, priority: "high", category: "Admin" },
      { id: "g3", text: "Return any borrowed equipment or library materials", done: false, priority: "medium", category: "Admin" },
      { id: "g4", text: "Audit your degree requirements with the registrar", done: false, priority: "high", category: "Academic" },
      { id: "g5", text: "Confirm all major and minor requirements are complete", done: false, priority: "high", category: "Academic" },
      { id: "g6", text: "Order your cap and gown from the bookstore", done: false, priority: "medium", category: "Graduation" },
      { id: "g7", text: "Schedule graduation photos", done: false, priority: "low", category: "Graduation" },
      { id: "g8", text: "Confirm commencement ceremony details with family", done: false, priority: "medium", category: "Graduation" },
      { id: "g9", text: "Update LinkedIn with your Clark degree", done: false, priority: "low", category: "Career" },
      { id: "g10", text: "Register with Clark alumni network", done: false, priority: "low", category: "Career" },
    ],
  },
  {
    key: "opt",
    label: "OPT Application",
    icon: "🌍",
    desc: "Step-by-step OPT process for F-1 students",
    tasks: [
      { id: "o1", text: "Attend ISSS OPT information session", done: false, priority: "high", category: "ISSS" },
      { id: "o2", text: "Complete OPT e-request form on iClark portal", done: false, priority: "high", category: "ISSS" },
      { id: "o3", text: "Get OPT recommendation from ISSS advisor", done: false, priority: "high", category: "ISSS" },
      { id: "o4", text: "Report employment to ISSS within 10 days of starting", done: false, priority: "high", category: "ISSS" },
      { id: "o5", text: "Gather passport, I-20, I-94 documents", done: false, priority: "high", category: "Documents" },
      { id: "o6", text: "Prepare passport-style photos for application", done: false, priority: "medium", category: "Documents" },
      { id: "o7", text: "File Form I-765 with USCIS online", done: false, priority: "high", category: "USCIS" },
      { id: "o8", text: "Pay USCIS filing fee ($410)", done: false, priority: "high", category: "USCIS" },
      { id: "o9", text: "Track your EAD card status on USCIS website", done: false, priority: "medium", category: "USCIS" },
    ],
  },
];

const CATEGORY_COLORS: Record<string, { border: string; text: string; dot: string }> = {
  "Admin":      { border: "rgba(192,0,0,0.3)",   text: "#ff8080", dot: "#C00000" },
  "Academic":   { border: "rgba(59,130,246,0.3)", text: "#93c5fd", dot: "#3b82f6" },
  "Resources":  { border: "rgba(34,197,94,0.3)",  text: "#86efac", dot: "#22c55e" },
  "Planning":   { border: "rgba(168,85,247,0.3)", text: "#d8b4fe", dot: "#a855f7" },
  "Graduation": { border: "rgba(245,158,11,0.3)", text: "#fcd34d", dot: "#f59e0b" },
  "Career":     { border: "rgba(16,185,129,0.3)", text: "#6ee7b7", dot: "#10b981" },
  "ISSS":       { border: "rgba(249,115,22,0.3)", text: "#fdba74", dot: "#f97316" },
  "Documents":  { border: "rgba(14,165,233,0.3)", text: "#7dd3fc", dot: "#0ea5e9" },
  "USCIS":      { border: "rgba(217,70,239,0.3)", text: "#f0abfc", dot: "#d946ef" },
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "#C00000", medium: "#d97706", low: "#6b7280"
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "High", medium: "Med", low: "Low"
};

function groupByCategory(tasks: Task[]) {
  const groups: Record<string, Task[]> = {};
  tasks.forEach(t => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });
  return groups;
}

export default function PlannerPage() {
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customTask, setCustomTask] = useState("");
  const [customCategory, setCustomCategory] = useState("Admin");

  const loadScenario = (scenario: Scenario) => {
    setSelected(scenario);
    setTasks(scenario.tasks.map(t => ({ ...t })));
  };

  const toggleTask = (id: string) => {
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const addTask = () => {
    if (!customTask.trim()) return;
    setTasks(t => [...t, {
      id: Date.now().toString(),
      text: customTask,
      done: false,
      priority: "medium",
      category: customCategory,
    }]);
    setCustomTask("");
  };

  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const groups = groupByCategory(tasks);
  const categories = Object.keys(groups);
  const circumference = 2 * Math.PI * 22;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d", color: "white" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50" style={{ background: "rgba(13,13,13,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-black text-white text-sm">CampusPulse</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(192,0,0,0.2)", color: "#ff8080" }}>Clark</span>
            </Link>
            {selected && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{selected.label}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selected && (
              <button onClick={() => { setSelected(null); setTasks([]); }}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", background: "transparent" }}>
                ← All plans
              </button>
            )}
            <Link href="/ask">
              <NeonButton variant="solid" size="sm" className="font-bold text-xs">
                Ask AI
              </NeonButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── SCENARIO SELECTOR ── */}
      {!selected && (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
              style={{ background: "rgba(192,0,0,0.1)", border: "1px solid rgba(192,0,0,0.25)", color: "#ff8080" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Study Planner
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Your academic checklist</h1>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              Clark-specific step-by-step plans for every academic milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCENARIOS.map(s => (
              <button key={s.key} onClick={() => loadScenario(s)}
                className="group text-left p-6 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(192,0,0,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-black text-white text-lg mb-1">{s.label}</h3>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{s.tasks.length} tasks</span>
                  <span className="text-xs font-bold" style={{ color: "#ff8080" }}>Start checklist →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TIMELINE VIEW ── */}
      {selected && (
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-10 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-3"
                style={{ background: "rgba(192,0,0,0.1)", border: "1px solid rgba(192,0,0,0.25)", color: "#ff8080" }}>
                {selected.icon} {selected.label}
              </div>
              <h1 className="text-3xl font-black text-white mb-2">Your checklist</h1>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>{selected.desc}</p>
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <div className="text-2xl font-black text-white">{completed}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>completed</div>
                </div>
                <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <div className="text-2xl font-black text-white">{total - completed}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>remaining</div>
                </div>
                <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <div className="text-2xl font-black text-white">{categories.length}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>sections</div>
                </div>
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex-shrink-0 relative w-20 h-20">
              <svg width="80" height="80" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="28" cy="28" r="22" fill="none" stroke="#C00000" strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDash}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-white">{progress}%</span>
              </div>
              {progress === 100 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* All done banner */}
          {progress === 100 && (
            <div className="rounded-2xl p-5 mb-8 flex items-center gap-4"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-black text-green-400 text-sm">All done! 🎉</p>
                <p className="text-xs" style={{ color: "rgba(134,239,172,0.7)" }}>You've completed every task. You're ready!</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-10">
            {categories.map((category) => {
              const catTasks = groups[category];
              const colors = CATEGORY_COLORS[category] || { border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.5)", dot: "#fff" };
              const catDone = catTasks.filter(t => t.done).length;

              return (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.dot }} />
                    <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: colors.text }}>
                      {category}
                    </h2>
                    <div className="flex-1 h-px" style={{ background: colors.border }} />
                    <span className="text-xs font-medium" style={{ color: colors.text }}>
                      {catDone}/{catTasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="ml-4 relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-px" style={{ background: colors.border }} />
                    <div className="space-y-2">
                      {catTasks.map((task) => (
                        <div key={task.id}
                          className="relative flex items-start gap-4 pl-8 cursor-pointer"
                          onClick={() => toggleTask(task.id)}>

                          {/* Timeline dot */}
                          <div className="absolute left-0 top-3" style={{ zIndex: 1 }}>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                              style={{
                                background: task.done ? colors.dot : "transparent",
                                borderColor: task.done ? colors.dot : "rgba(255,255,255,0.15)",
                              }}>
                              {task.done && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Task card */}
                          <div className="flex-1 flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200"
                            style={{
                              background: task.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${task.done ? "transparent" : "rgba(255,255,255,0.07)"}`,
                              opacity: task.done ? 0.5 : 1,
                            }}>
                            <p className="text-sm font-medium transition-all"
                              style={{
                                color: task.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                                textDecoration: task.done ? "line-through" : "none",
                              }}>
                              {task.text}
                            </p>
                            <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: PRIORITY_COLOR[task.priority] }} />
                              <span className="text-xs hidden sm:block" style={{ color: PRIORITY_COLOR[task.priority] }}>
                                {PRIORITY_LABEL[task.priority]}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom task */}
          <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-black text-white mb-3">Add a custom task</h3>
            <div className="flex gap-2">
              <select value={customCategory} onChange={e => setCustomCategory(e.target.value)}
                className="text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat} style={{ background: "#1a1a1a" }}>{cat}</option>
                ))}
              </select>
              <input type="text" value={customTask}
                onChange={e => setCustomTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="Add your own task..."
                className="flex-1 text-sm px-4 py-2.5 rounded-lg outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
              <NeonButton variant="solid" size="default" onClick={addTask} className="font-bold text-sm">
                Add
              </NeonButton>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex gap-3 mt-6">
            <Link href="/ask" className="flex-1">
              <NeonButton variant="default" size="default" className="w-full font-bold text-sm">
                Ask AI about this →
              </NeonButton>
            </Link>
            <Link href="/gpa" className="flex-1">
              <NeonButton variant="solid" size="default" className="w-full font-black text-sm">
                GPA Calculator →
              </NeonButton>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 py-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          CampusPulse · Clark University · Tech Innovation Challenge 2026
        </p>
      </div>
    </main>
  );
}