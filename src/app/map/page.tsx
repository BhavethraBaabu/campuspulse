"use client";
import { useState } from "react";
import Link from "next/link";

const BUILDINGS = [
  { name: "Jonas Clark Hall", icon: "🏛️", type: "Academic", description: "Main academic building, administrative offices, President's Office", lat: 42.2512, lng: -71.8228, key_offices: ["President's Office", "Provost Office", "Dean's Office"] },
  { name: "Goddard Library", icon: "📚", type: "Library", description: "Main university library with 650,000+ volumes, digital commons, IT Help Desk, study spaces", lat: 42.2515, lng: -71.8220, key_offices: ["Library", "IT Help Desk", "Digital Commons"] },
  { name: "Shaich Family Alumni & Student Engagement Center (ASEC)", icon: "🏢", type: "Student Services", description: "Hub for student services including Registrar, Financial Aid, ISSS, Career Center", lat: 42.2508, lng: -71.8225, key_offices: ["Registrar", "Financial Aid", "ISSS", "Career Center"] },
  { name: "Sanford Hall", icon: "🏠", type: "Residential", description: "Residential life office and student housing", lat: 42.2520, lng: -71.8218, key_offices: ["Residential Life Office"] },
  { name: "Dana Commons", icon: "🍽️", type: "Dining", description: "Main dining facility and student commons area", lat: 42.2505, lng: -71.8230, key_offices: ["Dining Services"] },
  { name: "115 Woodland Street", icon: "🏥", type: "Health", description: "Student Health Services and Counseling Center", lat: 42.2518, lng: -71.8222, key_offices: ["Student Health Services", "Counseling Center"] },
  { name: "Lasry Center for Bioscience", icon: "🔬", type: "Academic", description: "State-of-the-art biology and chemistry research facility", lat: 42.2510, lng: -71.8215, key_offices: ["Biology Dept", "Chemistry Dept", "Research Labs"] },
  { name: "Sackler Sciences Center", icon: "⚗️", type: "Academic", description: "Science building with labs and lecture halls for STEM courses", lat: 42.2506, lng: -71.8220, key_offices: ["Physics Dept", "Math Dept", "Computer Science"] },
  { name: "Jefferson Academic Center", icon: "🎓", type: "Academic", description: "Lecture halls, classrooms, and academic offices", lat: 42.2514, lng: -71.8232, key_offices: ["Lecture Halls", "Psychology Dept"] },
  { name: "Atwood Hall", icon: "🏡", type: "Residential", description: "First-year student housing and residential programs", lat: 42.2522, lng: -71.8225, key_offices: ["Resident Advisors", "First-Year Programs"] },
  { name: "Higgins University Center", icon: "🎭", type: "Student Life", description: "Student activities, clubs, events, recreation", lat: 42.2509, lng: -71.8235, key_offices: ["Student Activities", "Recreation", "Campus Events"] },
  { name: "Robert H. Goddard House", icon: "🚀", type: "Historic", description: "Historic home and museum dedicated to Robert H. Goddard, inventor of liquid-fueled rockets", lat: 42.2516, lng: -71.8228, key_offices: ["Goddard Museum"] },
];

const TYPES = ["All", "Academic", "Student Services", "Library", "Health", "Dining", "Residential", "Student Life", "Historic"];

const TYPE_COLORS: Record<string, string> = {
  "Academic": "#4F46E5",
  "Student Services": "#C00000",
  "Library": "#059669",
  "Health": "#DB2777",
  "Dining": "#D97706",
  "Residential": "#7C3AED",
  "Student Life": "#0891B2",
  "Historic": "#92400E",
};

export default function MapPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<typeof BUILDINGS[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = BUILDINGS.filter(b => {
    const matchesType = filter === "All" || b.type === filter;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.key_offices.some(o => o.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

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
          <span className="text-sm font-semibold text-white/70">Campus Map</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/directory" className="text-xs px-3 py-2 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            👥 Directory
          </Link>
          <Link href="/ask" className="text-xs px-4 py-2 rounded-lg font-bold text-white"
            style={{ background: "#C00000" }}>Ask AI</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Campus Map</h1>
          <p className="text-white/40 mb-6">Find every building and office on Clark's campus</p>

          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search buildings or offices..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30" />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(type => (
              <button key={type} onClick={() => setFilter(type)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={filter === type
                  ? { background: "#C00000", color: "white" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Buildings list */}
          <div className="md:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map(building => (
              <button key={building.name}
                onClick={() => setSelected(selected?.name === building.name ? null : building)}
                className="w-full text-left p-4 rounded-xl transition-all duration-200"
                style={{
                  background: selected?.name === building.name ? "rgba(192,0,0,0.1)" : "rgba(255,255,255,0.04)",
                  border: selected?.name === building.name ? "1px solid rgba(192,0,0,0.4)" : "1px solid rgba(255,255,255,0.08)"
                }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{building.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{building.name}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: `${TYPE_COLORS[building.type]}20`, color: TYPE_COLORS[building.type] }}>
                      {building.type}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="md:col-span-2">
            {selected ? (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Map embed */}
                <div className="relative">
                  <iframe
                    width="100%"
                    height="250"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${encodeURIComponent(selected.name + " Clark University Worcester MA")}`}
                    allowFullScreen
                    title={selected.name}
                  />
                  {/* Fallback if no API key */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ background: "rgba(13,13,13,0.9)" }}>
                    <span className="text-4xl mb-3">{selected.icon}</span>
                    <p className="text-white font-bold text-sm mb-2">{selected.name}</p>
                    <a href={`https://maps.google.com?q=${encodeURIComponent(selected.name + " Clark University Worcester MA")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                      style={{ background: "#C00000" }}>
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                {/* Building info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-black text-white mb-1">{selected.name}</h2>
                      <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: `${TYPE_COLORS[selected.type]}20`, color: TYPE_COLORS[selected.type], border: `1px solid ${TYPE_COLORS[selected.type]}40` }}>
                        {selected.type}
                      </span>
                    </div>
                    <a href={`https://maps.google.com?q=${encodeURIComponent(selected.name + " Clark University Worcester MA")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs px-3 py-2 rounded-lg font-bold transition-all hover:opacity-80"
                      style={{ background: "rgba(192,0,0,0.15)", color: "#ff8080", border: "1px solid rgba(192,0,0,0.3)" }}>
                      📍 Directions
                    </a>
                  </div>

                  <p className="text-sm mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {selected.description}
                  </p>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: "rgba(255,255,255,0.3)" }}>Key Offices</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.key_offices.map(office => (
                        <span key={office} className="text-xs px-3 py-1.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          {office}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl flex flex-col items-center justify-center text-center h-80"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <span className="text-5xl mb-4">🗺️</span>
                <h3 className="text-lg font-black text-white mb-2">Select a building</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Click any building on the left to see details and directions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}