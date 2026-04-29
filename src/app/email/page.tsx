"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/neon-button";

const TEMPLATES = [
  {
    id: "late-withdrawal",
    category: "Registrar",
    title: "Late Withdrawal Request",
    icon: "📝",
    fields: ["studentName", "courseCode", "courseName", "reason", "semester"],
    generate: (f: Record<string, string>) => `Subject: Late Withdrawal Request — ${f.courseCode} ${f.courseName}

Dear Registrar's Office,

I hope this message finds you well. My name is ${f.studentName}, and I am writing to formally request a late withdrawal from ${f.courseCode}: ${f.courseName} for the ${f.semester} semester.

The reason for my request is as follows: ${f.reason}

I understand that this request is being made after the standard withdrawal deadline, and I appreciate your consideration of my circumstances. I am committed to maintaining my academic standing at Clark University and believe this withdrawal is in my best academic interest at this time.

Please let me know what documentation or additional steps are required to process this request. I am happy to provide any supporting materials.

Thank you for your time and assistance.

Sincerely,
${f.studentName}
Clark University Student`,
  },
  {
    id: "opt-extension",
    category: "ISSO Office",
    title: "OPT/CPT Extension Inquiry",
    icon: "🌍",
    fields: ["studentName", "studentId", "currentOPTEnd", "question"],
    generate: (f: Record<string, string>) => `Subject: OPT Extension Inquiry — ${f.studentName} (ID: ${f.studentId})

Dear ISSO Office,

I hope you are doing well. My name is ${f.studentName} (Student ID: ${f.studentId}), and I am currently on OPT authorization, which expires on ${f.currentOPTEnd}.

I am writing to inquire about the following: ${f.question}

Could you please advise me on the next steps and any deadlines I should be aware of? I want to ensure I remain in compliance with my F-1 visa status at all times.

I am available for an appointment at your earliest convenience and can also be reached by email.

Thank you for your continued support.

Best regards,
${f.studentName}
Clark University International Student`,
  },
  {
    id: "grade-appeal",
    category: "Academic",
    title: "Grade Appeal Letter",
    icon: "📊",
    fields: ["studentName", "courseCode", "professorName", "currentGrade", "reason"],
    generate: (f: Record<string, string>) => `Subject: Grade Appeal — ${f.courseCode}

Dear Professor ${f.professorName},

I hope this email finds you well. My name is ${f.studentName}, and I was a student in your ${f.courseCode} course this semester.

I am writing to respectfully appeal my final grade of ${f.currentGrade}. After carefully reviewing my coursework and the grading criteria, I believe there may be an error or circumstance that warrants reconsideration.

Specifically: ${f.reason}

I greatly respect your expertise and the standards of your course. I am not writing to dispute your academic judgment, but rather to bring this matter to your attention in case any component of my grade was calculated incorrectly or my circumstances were not fully considered.

I would very much appreciate the opportunity to discuss this with you during office hours or via email. Thank you for your time and consideration.

Respectfully,
${f.studentName}
Clark University Student`,
  },
  {
    id: "financial-aid",
    category: "Financial Aid",
    title: "Financial Aid Appeal",
    icon: "💰",
    fields: ["studentName", "studentId", "academicYear", "reason"],
    generate: (f: Record<string, string>) => `Subject: Financial Aid Appeal — ${f.studentName} (${f.academicYear})

Dear Financial Aid Office,

My name is ${f.studentName} (Student ID: ${f.studentId}), and I am writing to formally appeal my financial aid package for the ${f.academicYear} academic year.

My financial circumstances have changed significantly, and I believe my current aid award does not fully reflect my family's financial need. Specifically: ${f.reason}

I am requesting a review of my financial aid eligibility and would like to understand what documentation I need to provide to support this appeal. I am committed to continuing my education at Clark University and am hopeful that additional assistance may be available.

Thank you for taking the time to review my situation. I am happy to provide any additional information or documentation upon request.

Sincerely,
${f.studentName}
Clark University Student
Student ID: ${f.studentId}`,
  },
  {
    id: "recommendation",
    category: "Academic",
    title: "Recommendation Letter Request",
    icon: "✉️",
    fields: ["studentName", "professorName", "courseCode", "purpose", "deadline"],
    generate: (f: Record<string, string>) => `Subject: Recommendation Letter Request — ${f.studentName}

Dear Professor ${f.professorName},

I hope you are well. My name is ${f.studentName}, and I had the pleasure of being in your ${f.courseCode} course. I am reaching out to ask if you would be willing to write a letter of recommendation for me.

I am applying for: ${f.purpose}

The deadline for the recommendation is ${f.deadline}. I understand this is a significant ask, and I want to assure you that I will provide all necessary materials in advance, including my resume, personal statement, and any specific forms required.

I thoroughly enjoyed your course and believe you would be able to speak to my academic abilities and character. However, I completely understand if you are unable to commit to this at this time.

Please let me know if you are willing and able to support my application, and if there is any additional information I can provide.

Thank you so much for considering my request.

Warmly,
${f.studentName}`,
  },
];

const FIELD_LABELS: Record<string, string> = {
  studentName: "Your Full Name",
  studentId: "Student ID",
  courseCode: "Course Code (e.g. CS 101)",
  courseName: "Course Name",
  reason: "Reason / Details",
  semester: "Semester (e.g. Spring 2026)",
  currentOPTEnd: "Current OPT End Date",
  question: "Your Question / Concern",
  professorName: "Professor Last Name",
  currentGrade: "Current Grade",
  academicYear: "Academic Year (e.g. 2025-2026)",
  purpose: "What you are applying for",
  deadline: "Submission Deadline",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Registrar": "#4F46E5",
  "ISSO Office": "#0891B2",
  "Academic": "#7C3AED",
  "Financial Aid": "#059669",
};

export default function EmailPage() {
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!selected) return;
    setGenerated(selected.generate(fields));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Email Templates</span>
        </div>
        <Link href="/ask">
          <NeonButton variant="solid" size="sm"
            className="font-bold text-white rounded-lg"
            style={{ background: "#C00000" }}>
            Ask a question
          </NeonButton>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── HEADER ── */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-white mb-2">Clark Email Templates</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Professional emails for every Clark University situation
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── TEMPLATE GRID ── */}
          {!selected && (
            <motion.div key="grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              {TEMPLATES.map((t, i) => (
                <motion.div key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}>
                  <button
                    onClick={() => { setSelected(t); setFields({}); setGenerated(""); }}
                    className="w-full text-left p-5 rounded-2xl transition-all duration-200 group"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${CATEGORY_COLORS[t.category] || "#C00000"}60`;
                      (e.currentTarget as HTMLElement).style.background = `${CATEGORY_COLORS[t.category] || "#C00000"}10`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    }}>
                    <motion.div
                      style={{ fontSize: "28px", marginBottom: "12px" }}
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}>
                      {t.icon}
                    </motion.div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: CATEGORY_COLORS[t.category] || "#C00000" }}>
                      {t.category}
                    </div>
                    <h3 className="font-black text-white text-sm mb-2">{t.title}</h3>
                    <div className="text-xs font-medium transition-colors"
                      style={{ color: "rgba(255,255,255,0.3)" }}>
                      {t.fields.length} fields required →
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── FORM + PREVIEW ── */}
          {selected && (
            <motion.div key="form"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}>

              {/* Form */}
              <div>
                <button onClick={() => { setSelected(null); setGenerated(""); }}
                  className="text-sm mb-6 flex items-center gap-1.5 transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "white"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"}>
                  ← Back to templates
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `${CATEGORY_COLORS[selected.category] || "#C00000"}15`, border: `1px solid ${CATEGORY_COLORS[selected.category] || "#C00000"}30` }}>
                    {selected.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selected.title}</h2>
                    <p className="text-xs" style={{ color: CATEGORY_COLORS[selected.category] || "#C00000" }}>
                      {selected.category}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {selected.fields.map((field, i) => (
                    <motion.div key={field}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}>
                      <label className="text-xs font-medium block mb-1.5"
                        style={{ color: "rgba(255,255,255,0.5)" }}>
                        {FIELD_LABELS[field] || field}
                      </label>
                      {field === "reason" || field === "question" ? (
                        <textarea
                          value={fields[field] || ""}
                          onChange={e => setFields(f => ({ ...f, [field]: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                          placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}...`}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,0,0,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      ) : (
                        <input
                          type="text"
                          value={fields[field] || ""}
                          onChange={e => setFields(f => ({ ...f, [field]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                          placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}...`}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,0,0,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <NeonButton
                  onClick={handleGenerate}
                  variant="solid"
                  size="lg"
                  className="w-full font-black text-white rounded-xl py-3"
                  style={{ background: "linear-gradient(135deg,#C00000,#8B0000)", boxShadow: "0 4px 20px rgba(192,0,0,0.3)" }}>
                  Generate Email →
                </NeonButton>
              </div>

              {/* Preview */}
              <div>
                <div className="flex items-center justify-between mb-3 sticky top-20">
                  <h3 className="font-bold text-white text-sm">Email Preview</h3>
                  {generated && (
                    <NeonButton
                      onClick={handleCopy}
                      variant={copied ? "ghost" : "default"}
                      size="sm"
                      className="text-xs rounded-lg font-bold transition-all"
                      style={copied
                        ? { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }
                        : { color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      {copied ? "✓ Copied!" : "Copy email"}
                    </NeonButton>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {generated ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", maxHeight: "520px" }}>
                      {generated}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", minHeight: "300px" }}>
                      <motion.span
                        className="text-5xl mb-4 block"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}>
                        ✉️
                      </motion.span>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Fill in the form and click<br />
                        <span style={{ color: "#C00000" }}>Generate Email</span> to preview
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}