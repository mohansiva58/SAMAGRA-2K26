'use client';

const coordinators = [
  {
    role: 'Faculty Coordinator',
    name: 'Mr. N Praveen',
    description: 'Overall supervision and strategic coordination of SAMAGRA 2026 – Prompt Engineering event',
    phone: null,
    color: '#00d4ff',
    initials: 'NP',
    gradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
  },
];

const studentCoordinators = [
  {
    name: 'D Rohith',
    role: 'Student Coordinator',
    area: 'Coordination & Logistics',
    phone: '7075020235',
    color: '#7c3aed',
    initials: 'DR',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  },
  {
    name: 'D Prabhas',
    role: 'Student Coordinator',
    area: 'Event Management & Support',
    phone: '7569045598',
    color: '#00ff88',
    initials: 'DP',
    gradient: 'linear-gradient(135deg, #00ff88, #00d4ff)',
  },
];

export function CoordinatorsSection() {
  return (
    <section id="coordinators" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute left-1/4 top-0 w-80 h-80 bg-purple-500/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-badge mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Event Team
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-4">
            Our{' '}
            <span className="gradient-text-purple">Coordinators</span>
          </h2>
          <p className="font-space text-slate-400 text-lg">
            The dedicated team behind SAMAGRA 2026
          </p>
        </div>

        {/* Faculty Coordinator */}
        <div className="reveal mb-8">
          {coordinators.map((coord) => (
            <div
              key={coord.name}
              className="coord-card p-8 max-w-2xl mx-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(13,17,23,0.95), rgba(13,17,23,0.8))',
                border: `1px solid ${coord.color}20`,
              }}
            >
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 font-orbitron text-xl font-black text-white"
                  style={{ background: coord.gradient, boxShadow: `0 0 30px ${coord.color}40` }}
                  aria-hidden="true"
                >
                  {coord.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-space text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ color: coord.color }}
                  >
                    {coord.role}
                  </p>
                  <h3 className="font-space font-bold text-2xl text-white mb-2">{coord.name}</h3>
                  <p className="font-space text-slate-400 text-sm leading-relaxed">{coord.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Coordinators */}
        <div className="stagger-children grid sm:grid-cols-2 gap-6">
          {studentCoordinators.map((coord) => (
            <div
              key={coord.name}
              className="coord-card p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(13,17,23,0.9), rgba(13,17,23,0.75))',
                border: `1px solid ${coord.color}18`,
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-orbitron text-sm font-black text-white"
                  style={{ background: coord.gradient, boxShadow: `0 0 20px ${coord.color}30` }}
                  aria-hidden="true"
                >
                  {coord.initials}
                </div>

                <div>
                  <p
                    className="font-space text-xs font-bold tracking-widest uppercase mb-0.5"
                    style={{ color: coord.color }}
                  >
                    {coord.role}
                  </p>
                  <h3 className="font-space font-bold text-lg text-white">{coord.name}</h3>
                  <p className="font-space text-slate-500 text-xs">{coord.area}</p>
                </div>
              </div>

              {/* Phone */}
              <a
                href={`tel:+91${coord.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                style={{
                  background: `${coord.color}08`,
                  border: `1px solid ${coord.color}20`,
                }}
                aria-label={`Call ${coord.name} at +91 ${coord.phone}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ background: `${coord.color}15`, color: coord.color }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span
                  className="font-orbitron text-sm font-bold tracking-wider"
                  style={{ color: coord.color }}
                >
                  +91 {coord.phone}
                </span>
                <svg
                  className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: coord.color }}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Venue Info */}
        <div className="reveal mt-12">
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.04))',
              border: '1px solid rgba(0,212,255,0.1)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-space font-semibold text-cyan-400">Venue</span>
            </div>
            <p className="font-space text-white font-semibold mb-1">Department of CSD & CSIT, SRKR Engineering College (A)</p>
            <p className="font-space text-slate-500 text-sm">
              SRKR Marg, Chinna Amiram, Bhimavaram – 534 204, W.G. Dist., Andhra Pradesh, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
