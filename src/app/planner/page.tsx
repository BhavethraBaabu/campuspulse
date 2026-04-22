"use client";
import { useState } from "react";
import Link from "next/link";

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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; line: string }> = {
  "Admin":      { bg: "#fff1f1", text: "#991b1b", line: "#C00000" },
  "Academic":   { bg: "#eff6ff", text: "#1e40af", line: "#3b82f6" },
  "Resources":  { bg: "#f0fdf4", text: "#166534", line: "#22c55e" },
  "Planning":   { bg: "#faf5ff", text: "#6b21a8", line: "#a855f7" },
  "Graduation": { bg: "#fffbeb", text: "#92400e", line: "#f59e0b" },
  "Career":     { bg: "#ecfdf5", text: "#065f46", line: "#10b981" },
  "ISSS":       { bg: "#fff7ed", text: "#9a3412", line: "#f97316" },
  "Documents":  { bg: "#f0f9ff", text: "#0c4a6e", line: "#0ea5e9" },
  "USCIS":      { bg: "#fdf4ff", text: "#701a75", line: "#d946ef" },
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "High", medium: "Medium", low: "Low"
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "#C00000", medium: "#d97706", low: "#6b7280"
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
    <main className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center font-black text-white text-xs"
                style={{ background: "#C00000" }}>CP</div>
              <span className="font-black text-gray-900 text-sm">CampusPulse</span>
            </Link>
            {selected && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-sm text-gray-500">{selected.label}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selected && (
              <button onClick={() => { setSelected(null); setTasks([]); }}
                className="text-xs px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors">
                ← All plans
              </button>
            )}
            <Link href="/ask"
              className="text-xs px-4 py-1.5 rounded-md font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#C00000" }}>
              Ask AI
            </Link>
          </div>
        </div>
      </nav>

      {/* ── SCENARIO SELECTOR ── */}
      {!selected && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C00000" }}>
              Study Planner
            </p>
            <h1 className="text-4xl font-black text-gray-900 mb-3">
              Your academic checklist
            </h1>
            <p className="text-gray-500 text-lg">
              Clark-specific step-by-step plans for every academic milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCENARIOS.map(s => (
              <button key={s.key} onClick={() => loadScenario(s)}
                className="group text-left p-6 rounded-2xl border border-gray-100 hover:border-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm bg-white">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{s.label}</h3>
                <p className="text-sm text-gray-500 mb-4">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{s.tasks.length} tasks</span>
                  <span className="text-xs font-bold transition-colors group-hover:text-red-600"
                    style={{ color: "#C00000" }}>
                    Start checklist →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TIMELINE VIEW ── */}
      {selected && (
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Header with progress ring */}
          <div className="flex items-start justify-between mb-10 pb-8 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C00000" }}>
                {selected.icon} {selected.label}
              </p>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Your checklist</h1>
              <p className="text-gray-500">{selected.desc}</p>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <div className="text-2xl font-black text-gray-900">{completed}</div>
                  <div className="text-xs text-gray-400">completed</div>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                  <div className="text-2xl font-black text-gray-900">{total - completed}</div>
                  <div className="text-xs text-gray-400">remaining</div>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div>
                  <div className="text-2xl font-black text-gray-900">{categories.length}</div>
                  <div className="text-xs text-gray-400">sections</div>
                </div>
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex-shrink-0 relative w-20 h-20">
              <svg width="80" height="80" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <circle cx="28" cy="28" r="22" fill="none" stroke="#C00000" strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDash}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-gray-900">{progress}%</span>
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

          {progress === 100 && (
            <div className="rounded-2xl p-5 mb-8 flex items-center gap-4 border border-green-200 bg-green-50">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-black text-green-900 text-sm">All done! 🎉</p>
                <p className="text-green-700 text-xs">You've completed every task. You're ready!</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-10">
            {categories.map((category, catIdx) => {
              const catTasks = groups[category];
              const colors = CATEGORY_COLORS[category] || { bg: "#f9fafb", text: "#374151", line: "#9ca3af" };
              const catDone = catTasks.filter(t => t.done).length;

              return (
                <div key={category} className="relative">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: colors.line }} />
                    <h2 className="text-xs font-black uppercase tracking-widest"
                      style={{ color: colors.text }}>
                      {category}
                    </h2>
                    <div className="flex-1 h-px" style={{ background: `${colors.line}30` }} />
                    <span className="text-xs font-medium" style={{ color: colors.text }}>
                      {catDone}/{catTasks.length}
                    </span>
                  </div>

                  {/* Tasks with timeline line */}
                  <div className="ml-4 relative">
                    {/* Vertical line */}
                    <div className="absolute left-2.5 top-0 bottom-0 w-px"
                      style={{ background: `${colors.line}25` }} />

                    <div className="space-y-2">
                      {catTasks.map((task, taskIdx) => (
                        <div key={task.id}
                          className="relative flex items-start gap-4 pl-8 group cursor-pointer"
                          onClick={() => toggleTask(task.id)}>

                          {/* Timeline dot */}
                          <div className="absolute left-0 top-3 flex-shrink-0 transition-all duration-200"
                            style={{ zIndex: 1 }}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200`}
                              style={{
                                background: task.done ? colors.line : "white",
                                borderColor: task.done ? colors.line : "#e5e7eb",
                              }}>
                              {task.done && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Task card */}
                          <div className={`flex-1 flex items-center justify-between py-3 px-4 rounded-xl border transition-all duration-200 ${task.done ? "opacity-50" : "hover:border-gray-200 hover:shadow-sm"}`}
                            style={{
                              background: task.done ? "#fafafa" : "white",
                              borderColor: task.done ? "transparent" : "#f3f4f6",
                            }}>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium transition-all ${task.done ? "line-through text-gray-400" : "text-gray-900"}`}>
                                {task.text}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                              {/* Priority dot */}
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: PRIORITY_COLOR[task.priority] }} />
                                <span className="text-xs hidden sm:block"
                                  style={{ color: PRIORITY_COLOR[task.priority] }}>
                                  {PRIORITY_LABEL[task.priority]}
                                </span>
                              </div>
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
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-black text-gray-900 mb-3">Add a custom task</h3>
            <div className="flex gap-2">
              <select value={customCategory} onChange={e => setCustomCategory(e.target.value)}
                className="text-sm px-3 py-2.5 rounded-lg border border-gray-200 text-gray-700 outline-none focus:border-red-300 transition-colors bg-white">
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input type="text" value={customTask}
                onChange={e => setCustomTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="Add your own task..."
                className="flex-1 text-sm px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 outline-none focus:border-red-300 transition-colors" />
              <button onClick={addTask}
                className="px-4 py-2.5 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: "#C00000" }}>
                Add
              </button>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex gap-3 mt-6">
            <Link href="/ask"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-center border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors">
              Ask AI about this →
            </Link>
            <Link href="/gpa"
              className="flex-1 py-3 rounded-xl text-sm font-black text-white text-center hover:opacity-90 transition-opacity"
              style={{ background: "#C00000" }}>
              GPA Calculator →
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 py-5 text-center mt-10">
        <p className="text-xs text-gray-400">CampusPulse · Clark University · Tech Innovation Challenge 2026</p>
      </div>
    </main>
  );
}