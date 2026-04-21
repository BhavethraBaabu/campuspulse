"use client";
import { useState } from "react";
import Link from "next/link";

const DEPARTMENTS = [
  {
    name: "Registrar's Office",
    icon: "📋",
    building: "Shaich Family Alumni & Student Engagement Center",
    phone: "(508) 793-7431",
    email: "registrar@clarku.edu",
    website: "https://www.clarku.edu/offices/registrar/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "Kathy Bisson", title: "Registrar", email: "kbisson@clarku.edu" },
      { name: "Lisa Sheridan", title: "Assistant Registrar", email: "lsheridan@clarku.edu" },
      { name: "Michael Foley", title: "Records Coordinator", email: "mfoley@clarku.edu" },
    ],
  },
  {
    name: "Financial Aid Office",
    icon: "💰",
    building: "Shaich Family Alumni & Student Engagement Center",
    phone: "(508) 793-7478",
    email: "financialaid@clarku.edu",
    website: "https://www.clarku.edu/offices/financial-aid/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "David Towse", title: "Director of Financial Aid", email: "dtowse@clarku.edu" },
      { name: "Sara Donahue", title: "Assistant Director", email: "sdonahue@clarku.edu" },
      { name: "Maria Rivera", title: "Financial Aid Counselor", email: "mrivera@clarku.edu" },
    ],
  },
  {
    name: "ISSS — International Students",
    icon: "🌍",
    building: "Shaich Family Alumni & Student Engagement Center",
    phone: "(508) 793-7458",
    email: "isss@clarku.edu",
    website: "https://www.clarku.edu/offices/isss/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "Gina Zanetti", title: "Director of ISSS", email: "gzanetti@clarku.edu" },
      { name: "Kristin Daly", title: "International Student Advisor", email: "kdaly@clarku.edu" },
      { name: "Ahmed Hassan", title: "International Student Advisor", email: "ahassan@clarku.edu" },
    ],
  },
  {
    name: "Career Connections Center",
    icon: "💼",
    building: "Shaich Family Alumni & Student Engagement Center",
    phone: "(508) 793-7294",
    email: "careercenter@clarku.edu",
    website: "https://www.clarku.edu/offices/career-connections-center/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "Joanne Dowd", title: "Director", email: "jdowd@clarku.edu" },
      { name: "Patrick Riley", title: "Career Advisor", email: "priley@clarku.edu" },
      { name: "Emily Chen", title: "Employer Relations", email: "echen@clarku.edu" },
    ],
  },
  {
    name: "Student Health Services",
    icon: "🏥",
    building: "115 Woodland Street",
    phone: "(508) 793-7467",
    email: "healthservices@clarku.edu",
    website: "https://www.clarku.edu/offices/health-services/",
    hours: "Mon-Fri 8:30am-5pm",
    staff: [
      { name: "Dr. Sarah Kim", title: "Medical Director", email: "skim@clarku.edu" },
      { name: "Jennifer Walsh", title: "Nurse Practitioner", email: "jwalsh@clarku.edu" },
    ],
  },
  {
    name: "Counseling Center",
    icon: "🧠",
    building: "115 Woodland Street",
    phone: "(508) 793-7678",
    email: "counseling@clarku.edu",
    website: "https://www.clarku.edu/offices/counseling-center/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "Dr. Lisa Park", title: "Director", email: "lpark@clarku.edu" },
      { name: "Dr. James Wilson", title: "Staff Psychologist", email: "jwilson@clarku.edu" },
      { name: "Maria Santos", title: "Counselor", email: "msantos@clarku.edu" },
    ],
  },
  {
    name: "Goddard Library",
    icon: "📚",
    building: "Goddard Library",
    phone: "(508) 793-7572",
    email: "library@clarku.edu",
    website: "https://www.clarku.edu/library/",
    hours: "Mon-Thu 8am-2am · Fri 8am-10pm · Sat-Sun 10am-2am",
    staff: [
      { name: "Molly Weeks", title: "University Librarian", email: "mweeks@clarku.edu" },
      { name: "David Owens", title: "Reference Librarian", email: "dowens@clarku.edu" },
      { name: "Susan Lee", title: "Digital Services Librarian", email: "slee@clarku.edu" },
    ],
  },
  {
    name: "Residential Life",
    icon: "🏠",
    building: "Sanford Hall",
    phone: "(508) 793-7453",
    email: "reslife@clarku.edu",
    website: "https://www.clarku.edu/offices/residential-life/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "Kevin Sullivan", title: "Director of Residential Life", email: "ksullivan@clarku.edu" },
      { name: "Amy Chen", title: "Assistant Director", email: "achen@clarku.edu" },
    ],
  },
  {
    name: "IT Help Desk",
    icon: "💻",
    building: "Goddard Library — Lower Level",
    phone: "(508) 793-7745",
    email: "helpdesk@clarku.edu",
    website: "https://www.clarku.edu/offices/its/",
    hours: "Mon-Fri 8am-6pm",
    staff: [
      { name: "Tom Bradley", title: "IT Director", email: "tbradley@clarku.edu" },
      { name: "Jessica Park", title: "Systems Administrator", email: "jpark@clarku.edu" },
    ],
  },
  {
    name: "Office of the Provost",
    icon: "🏛️",
    building: "Jonas Clark Hall",
    phone: "(508) 793-7211",
    email: "provost@clarku.edu",
    website: "https://www.clarku.edu/offices/provost/",
    hours: "Mon-Fri 9am-5pm",
    staff: [
      { name: "Davis Baird", title: "Provost & VP Academic Affairs", email: "dbaird@clarku.edu" },
      { name: "Sarah Johnson", title: "Executive Assistant", email: "sjohnson@clarku.edu" },
    ],
  },
];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.staff.some(s => s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(13,13,13,0.95)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: "#C00000" }}>CP</div>
            <span className="font-black text-white">CampusPulse</span>
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-sm font-semibold text-white/70">Directory</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/map" className="text-xs px-3 py-2 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            🗺️ Campus Map
          </Link>
          <Link href="/ask" className="text-xs px-4 py-2 rounded-lg font-bold text-white"
            style={{ background: "#C00000" }}>Ask AI</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Clark Directory</h1>
          <p className="text-white/40 mb-6">Find offices, staff, and contact information</p>

          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by department, name, or email..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30" />
            {search && (
              <button onClick={() => setSearch("")} className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>✕</button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(dept => (
            <div key={dept.name} className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.04)", border: expanded === dept.name ? "1px solid rgba(192,0,0,0.4)" : "1px solid rgba(255,255,255,0.08)" }}>

              {/* Department header */}
              <button className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => setExpanded(expanded === dept.name ? null : dept.name)}>
                <span className="text-2xl">{dept.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-white text-sm">{dept.name}</h3>
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                    📍 {dept.building} · {dept.hours}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a href={`mailto:${dept.email}`} onClick={e => e.stopPropagation()}
                    className="text-xs px-3 py-1 rounded-lg hidden md:block transition-colors hover:opacity-80"
                    style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.3)" }}>
                    Email
                  </a>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {expanded === dept.name ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded details */}
              {expanded === dept.name && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* Contact info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-5 py-4"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    <a href={`tel:${dept.phone}`}
                      className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.5)" }}>
                      📞 {dept.phone}
                    </a>
                    <a href={`mailto:${dept.email}`}
                      className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.5)" }}>
                      ✉️ {dept.email}
                    </a>
                    <a href={dept.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                      style={{ color: "#C00000" }}>
                      🌐 Visit website →
                    </a>
                  </div>

                  {/* Staff list */}
                  <div className="px-5 pb-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: "rgba(255,255,255,0.25)" }}>Staff</p>
                    <div className="space-y-2">
                      {dept.staff.map(person => (
                        <div key={person.email} className="flex items-center justify-between py-2"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <p className="text-sm font-medium text-white">{person.name}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{person.title}</p>
                          </div>
                          <a href={`mailto:${person.email}`}
                            className="text-xs transition-colors hover:opacity-80"
                            style={{ color: "#C00000" }}>
                            {person.email}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}