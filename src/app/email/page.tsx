"use client";
import { useState } from "react";
import Link from "next/link";

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
  professorName: "Professor's Last Name",
  currentGrade: "Current Grade",
  academicYear: "Academic Year (e.g. 2025-2026)",
  purpose: "What you're applying for",
  deadline: "Submission Deadline",
};

export default function EmailPage() {
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!selected) return;
    const email = selected.generate(fields);
    setGenerated(email);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <span className="text-sm font-semibold text-white/70">Email Templates</span>
        </div>
        <Link href="/ask" className="text-xs px-4 py-2 rounded-lg font-bold text-white"
          style={{ background: "#C00000" }}>Ask a question</Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Clark Email Templates</h1>
          <p className="text-white/40">Professional emails for every Clark University situation</p>
        </div>

        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => { setSelected(t); setFields({}); setGenerated(""); }}
                className="text-left p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,0,0,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(192,0,0,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                <div className="text-2xl mb-3">{t.icon}</div>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#C00000" }}>{t.category}</div>
                <h3 className="font-black text-white text-sm">{t.title}</h3>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <button onClick={() => { setSelected(null); setGenerated(""); }}
                className="text-sm mb-6 flex items-center gap-1 transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "white"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"}>
                ← Back to templates
              </button>

              <h2 className="text-xl font-black text-white mb-1">{selected.icon} {selected.title}</h2>
              <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>Fill in the fields below to generate your email</p>

              <div className="space-y-4">
                {selected.fields.map(field => (
                  <div key={field}>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {FIELD_LABELS[field] || field}
                    </label>
                    {field === "reason" || field === "question" ? (
                      <textarea
                        value={fields[field] || ""}
                        onChange={e => setFields(f => ({ ...f, [field]: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={fields[field] || ""}
                        onChange={e => setFields(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder={`Enter ${FIELD_LABELS[field]?.toLowerCase() || field}...`}
                      />
                    )}
                  </div>
                ))}

                <button onClick={handleGenerate}
                  className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#C00000,#8B0000)" }}>
                  Generate Email →
                </button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-sm">Email Preview</h3>
                {generated && (
                  <button onClick={handleCopy}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                    style={{ background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)", color: copied ? "#4ade80" : "rgba(255,255,255,0.6)", border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}` }}>
                    {copied ? "✓ Copied!" : "Copy email"}
                  </button>
                )}
              </div>

              {generated ? (
                <div className="rounded-2xl p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", maxHeight: "500px" }}>
                  {generated}
                </div>
              ) : (
                <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", minHeight: "300px" }}>
                  <span className="text-4xl mb-3">✉️</span>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Fill in the form and click<br />"Generate Email" to see your email
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}