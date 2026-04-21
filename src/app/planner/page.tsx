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

const PLANNER_TEMPLATES: Record<string, Task[]> = {
  finals: [
    { id: "1", text: "Check final exam schedule on Clark portal", done: false, priority: "high", category: "Admin" },
    { id: "2", text: "Request any needed accommodations from Student Accessibility Services", done: false, priority: "high", category: "Admin" },
    { id: "3", text: "Submit all outstanding assignments before finals week", done: false, priority: "high", category: "Academic" },
    { id: "4", text: "Meet with professors during office hours to clarify material", done: false, priority: "medium", category: "Academic" },
    { id: "5", text: "Book a study room at Goddard Library", done: false, priority: "medium", category: "Resources" },
    { id: "6", text: "Form or join a study group for each exam", done: false, priority: "medium", category: "Academic" },
    { id: "7", text: "Review syllabus for each course — note what's on the final", done: false, priority: "high", category: "Academic" },
    { id: "8", text: "Check grade requirements to pass each course", done: false, priority: "high", category: "Academic" },
    { id: "9", text: "Return all library books to avoid fines", done: false, priority: "low", category: "Admin" },
    { id: "10", text: "Submit course evaluations for each class", done: false, priority: "low", category: "Admin" },
  ],
  registration: [
    { id: "1", text: "Check your registration date and time on ClarkYOU", done: false, priority: "high", category: "Admin" },
    { id: "2", text: "Meet with academic advisor to plan courses", done: false, priority: "high", category: "Admin" },
    { id: "3", text: "Build a list of 8-10 courses (primary + backups)", done: false, priority: "high", category: "Planning" },
    { id: "4", text: "Check prerequisites for each course you want", done: false, priority: "high", category: "Academic" },
    { id: "5", text: "Verify courses satisfy your major requirements", done: false, priority: "medium", category: "Academic" },
    { id: "6", text: "Check for time conflicts in your schedule", done: false, priority: "medium", category: "Planning" },
    { id: "7", text: "Look up professor ratings for each course", done: false, priority: "low", category: "Planning" },
    { id: "8", text: "Confirm financial aid covers your credit load", done: false, priority: "high", category: "Financial" },
  ],
  graduation: [
    { id: "1", text: "Apply for graduation on ClarkYOU by the deadline", done: false, priority: "high", category: "Admin" },
    { id: "2", text: "Audit your degree requirements with the registrar", done: false, priority: "high", category: "Admin" },
    { id: "3", text: "Confirm all major and minor requirements are complete", done: false, priority: "high", category: "Academic" },
    { id: "4", text: "Order your cap and gown from the bookstore", done: false, priority: "medium", category: "Graduation" },
    { id: "5", text: "Request official transcripts to be sent to employers/grad schools", done: false, priority: "high", category: "Admin" },
    { id: "6", text: "Return any borrowed equipment or library materials", done: false, priority: "medium", category: "Admin" },
    { id: "7", text: "Update LinkedIn with your Clark degree", done: false, priority: "low", category: "Career" },
    { id: "8", text: "Register with Clark alumni network", done: false, priority: "low", category: "Career" },
    { id: "9", text: "Schedule graduation photos", done: false, priority: "low", category: "Graduation" },
    { id: "10", text: "Confirm commencement ceremony details with family", done: false, priority: "medium", category: "Graduation" },
  ],
  opt: [
    { id: "1", text: "Attend ISSS OPT information session", done: false, priority: "high", category: "ISSS" },
    { id: "2", text: "Complete OPT e-request form on iClark portal", done: false, priority: "high", category: "ISSS" },
    { id: "3", text: "Gather required documents: passport, I-20, I-94", done: false, priority: "high", category: "Documents" },
    { id: "4", text: "Get OPT recommendation from ISSS advisor", done: false, priority: "high", category: "ISSS" },
    { id: "5", text: "File Form I-765 with USCIS online", done: false, priority: "high", category: "USCIS" },
    { id: "6", text: "Pay USCIS filing fee ($410)", done: false, priority: "high", category: "USCIS" },
    { id: "7", text: "Track your EAD card status on USCIS website", done: false, priority: "medium", category: "USCIS" },
    { id: "8", text: "Report employment to ISSS within 10 days of starting", done: false, priority: "high", category: "ISSS" },
  ],
};

const SCENARIOS = [
  { key: "finals", label: "📚 Finals Prep", desc: "Everything you need before final exams" },
  { key: "registration", label: "📋 Course Registration", desc: "Plan your next semester registration" },
  { key: "graduation", label: "🎓 Graduation", desc: "Complete graduation checklist" },
  { key: "opt", label: "🌍 OPT Application", desc: "Step-by-step OPT process" },
];

export default function PlannerPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customTask, setCustomTask] = useState("");

  const loadScenario = (key: string) => {
    setSelected(key);
    setTasks(PLANNER_TEMPLATES[key].map(t => ({ ...t })));
  };

  const toggleTask = (id: string) => {
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const addCustomTask = () => {
    if (!customTask.trim()) return;
    setTasks(t => [...t, {
      id: Date.now().toString(),
      text: customTask,
      done: false,
      priority: "medium",
      category: "Custom",
    }]);
    setCustomTask("");
  };

  const completed = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const priorityColor = (p: string) =>
    p === "high" ? "#ff6b6b" : p === "medium" ? "#fbbf24" : "#4ade80";

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
          <span className="text-sm font-semibold text-white/70">Study Planner</span>
        </div>
        <Link href="/ask" className="text-xs px-4 py-2 rounded-lg font-bold text-white"
          style={{ background: "#C00000" }}>Ask a question</Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Personal Study Planner</h1>
          <p className="text-white/40">Clark-specific checklists for every academic milestone</p>
        </div>

        {/* Scenario selector */}
        {!selected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map(s => (
              <button key={s.key} onClick={() => loadScenario(s.key)}
                className="text-left p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(192,0,0,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                <div className="text-3xl mb-3">{s.label.split(" ")[0]}</div>
                <h3 className="font-black text-white text-lg mb-1">{s.label.slice(2)}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Task list */}
        {selected && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setSelected(null)}
                className="text-sm flex items-center gap-1 transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "white"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"}>
                ← Back
              </button>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {completed}/{tasks.length} completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="rounded-2xl p-4 mb-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Progress</span>
                <span className="text-sm font-black" style={{ color: progress === 100 ? "#4ade80" : "#C00000" }}>
                  {progress}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: progress === 100 ? "#4ade80" : "#C00000" }} />
              </div>
              {progress === 100 && (
                <p className="text-xs text-green-400 mt-2 font-bold">🎉 All done! You're ready!</p>
              )}
            </div>

            {/* Tasks */}
            <div className="space-y-2 mb-6">
              {tasks.map(task => (
                <div key={task.id}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer"
                  style={{ background: task.done ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.04)", border: `1px solid ${task.done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.08)"}` }}
                  onClick={() => toggleTask(task.id)}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ borderColor: task.done ? "#4ade80" : "rgba(255,255,255,0.3)", background: task.done ? "#4ade80" : "transparent" }}>
                    {task.done && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium transition-all"
                      style={{ color: task.done ? "rgba(255,255,255,0.3)" : "white", textDecoration: task.done ? "line-through" : "none" }}>
                      {task.text}
                    </p>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{task.category}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: priorityColor(task.priority) }} />
                </div>
              ))}
            </div>

            {/* Add custom task */}
            <div className="flex gap-2">
              <input type="text" value={customTask} onChange={e => setCustomTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCustomTask()}
                placeholder="Add a custom task..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <button onClick={addCustomTask}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "#C00000" }}>Add</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}