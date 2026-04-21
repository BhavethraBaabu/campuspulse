"use client";
import { useState } from "react";
import Link from "next/link";

const GRADE_POINTS: Record<string, number> = {
  "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0,
  "F": 0.0,
};

type Course = {
  id: string;
  name: string;
  grade: string;
  credits: number;
};

export default function GPAPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Course 1", grade: "A", credits: 3 },
    { id: "2", name: "Course 2", grade: "B+", credits: 3 },
    { id: "3", name: "Course 3", grade: "A-", credits: 4 },
  ]);
  const [cumulativeGPA, setCumulativeGPA] = useState("");
  const [cumulativeCredits, setCumulativeCredits] = useState("");

  const addCourse = () => {
    setCourses(c => [...c, {
      id: Date.now().toString(),
      name: `Course ${c.length + 1}`,
      grade: "A",
      credits: 3,
    }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) setCourses(c => c.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(c => c.map(course => course.id === id ? { ...course, [field]: value } : course));
  };

  const semesterGPA = () => {
    const totalPoints = courses.reduce((acc, c) => acc + (GRADE_POINTS[c.grade] || 0) * c.credits, 0);
    const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const newCumulativeGPA = () => {
    const cumGPA = parseFloat(cumulativeGPA);
    const cumCredits = parseFloat(cumulativeCredits);
    if (!cumGPA || !cumCredits) return null;

    const semPoints = courses.reduce((acc, c) => acc + (GRADE_POINTS[c.grade] || 0) * c.credits, 0);
    const semCredits = courses.reduce((acc, c) => acc + c.credits, 0);
    const totalPoints = cumGPA * cumCredits + semPoints;
    const totalCredits = cumCredits + semCredits;
    return (totalPoints / totalCredits).toFixed(2);
  };

  const gpa = parseFloat(semesterGPA());
  const gpaColor = gpa >= 3.7 ? "#4ade80" : gpa >= 3.0 ? "#fbbf24" : gpa >= 2.0 ? "#fb923c" : "#f87171";

  const getHonors = (g: number) => {
    if (g >= 3.9) return "🏆 Summa Cum Laude eligible";
    if (g >= 3.7) return "🥇 Magna Cum Laude eligible";
    if (g >= 3.5) return "🥈 Cum Laude eligible";
    if (g >= 2.0) return "✅ Good academic standing";
    return "⚠️ Below minimum GPA — seek academic advising";
  };

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
          <span className="text-sm font-semibold text-white/70">GPA Calculator</span>
        </div>
        <Link href="/ask" className="text-xs px-4 py-2 rounded-lg font-bold text-white"
          style={{ background: "#C00000" }}>Ask a question</Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">GPA Calculator</h1>
          <p className="text-white/40">Uses Clark University's official 4.0 grading scale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course input */}
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
                <div className="col-span-5">Course</div>
                <div className="col-span-4">Grade</div>
                <div className="col-span-2">Credits</div>
                <div className="col-span-1"></div>
              </div>

              {/* Courses */}
              {courses.map(course => (
                <div key={course.id} className="grid grid-cols-12 gap-2 px-4 py-2 items-center"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="col-span-5">
                    <input type="text" value={course.name}
                      onChange={e => updateCourse(course.id, "name", e.target.value)}
                      className="w-full bg-transparent text-sm text-white outline-none"
                      style={{ color: "white" }} />
                  </div>
                  <div className="col-span-4">
                    <select value={course.grade}
                      onChange={e => updateCourse(course.id, "grade", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none rounded-lg px-2 py-1"
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {Object.keys(GRADE_POINTS).map(g => (
                        <option key={g} value={g} style={{ background: "#1a1a1a" }}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={course.credits} min={1} max={6}
                      onChange={e => updateCourse(course.id, "credits", parseInt(e.target.value) || 1)}
                      className="w-full bg-transparent text-sm text-white outline-none text-center rounded-lg px-2 py-1"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button onClick={() => removeCourse(course.id)}
                      className="text-xs transition-colors hover:text-red-400"
                      style={{ color: "rgba(255,255,255,0.2)" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addCourse}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all mb-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>
              + Add course
            </button>

            {/* Cumulative GPA */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="font-bold text-white mb-4 text-sm">Calculate New Cumulative GPA (optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>Current Cumulative GPA</label>
                  <input type="number" value={cumulativeGPA} onChange={e => setCumulativeGPA(e.target.value)}
                    step="0.01" min="0" max="4.0" placeholder="e.g. 3.45"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>Credits Completed</label>
                  <input type="number" value={cumulativeCredits} onChange={e => setCumulativeCredits(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Semester GPA */}
            <div className="rounded-2xl p-6 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${gpaColor}40` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                Semester GPA
              </p>
              <div className="text-6xl font-black mb-2" style={{ color: gpaColor }}>
                {semesterGPA()}
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {courses.reduce((a, c) => a + c.credits, 0)} credits
              </p>
            </div>

            {/* Honors status */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-bold text-white mb-1">Clark Honors Status</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{getHonors(gpa)}</p>
            </div>

            {/* New cumulative */}
            {newCumulativeGPA() && (
              <div className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(192,0,0,0.1)", border: "1px solid rgba(192,0,0,0.3)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  New Cumulative GPA
                </p>
                <div className="text-4xl font-black" style={{ color: "#C00000" }}>
                  {newCumulativeGPA()}
                </div>
              </div>
            )}

            {/* Grade scale */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-bold text-white mb-3">Clark Grade Scale</p>
              <div className="space-y-1">
                {Object.entries(GRADE_POINTS).map(([grade, points]) => (
                  <div key={grade} className="flex items-center justify-between text-xs">
                    <span className="font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>{grade}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>{points.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}