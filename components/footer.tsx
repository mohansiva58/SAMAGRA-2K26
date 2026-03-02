'use client';

const quickLinks = [
  { label: 'About', id: 'about' },
  { label: 'Events', id: 'events' },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Register', id: 'registration' },
  { label: 'Contact', id: 'coordinators' },
];

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff40, #7c3aed40, transparent)' }}
        aria-hidden="true"
      />

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.02))' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-orbitron font-black text-2xl gradient-text-animated mb-2" aria-label="SAMAGRA 2026">
              SAMAGRA
            </div>
            <div className="font-orbitron text-sm text-cyan-500/60 tracking-widest mb-4">2026</div>
            <p className="font-space text-slate-500 text-sm leading-relaxed">
              National Level Event · Prompt Engineering<br />
              Technical Presentation & Project Expo
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div
                className="px-3 py-1 rounded-full text-xs font-space font-semibold"
                style={{
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  color: '#00d4ff',
                }}
              >
                CSD
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-space font-semibold"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#a78bfa',
                }}
              >
                CSIT
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-space font-bold text-slate-300 text-sm uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2" role="list">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="font-space text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 cursor-pointer flex items-center gap-2 group"
                    aria-label={`Navigate to ${link.label} section`}
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors duration-200"
                      aria-hidden="true"
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-space font-bold text-slate-300 text-sm uppercase tracking-widest mb-4">Contact</h3>
            <div className="space-y-3">
              <div>
                <p className="font-space text-xs text-slate-600 uppercase tracking-wide mb-1">Faculty Coordinator</p>
                <p className="font-space text-sm text-slate-300">Mr. N Praveen</p>
              </div>
              <div>
                <p className="font-space text-xs text-slate-600 uppercase tracking-wide mb-1">Student Coordinators</p>
                <a href="tel:+917075020235" className="block font-space text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer" aria-label="Call D Rohith at +91 7075020235">
                  D Rohith · 7075020235
                </a>
                <a href="tel:+917569045598" className="block font-space text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer" aria-label="Call D Prabhas at +91 7569045598">
                  D Prabhas · 7569045598
                </a>
              </div>
              <div>
                <p className="font-space text-xs text-slate-600 uppercase tracking-wide mb-1">Venue</p>
                <p className="font-space text-xs text-slate-500 leading-relaxed">
                  SRKR Engineering College (A)<br />
                  Bhimavaram – 534 204, A.P., India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }}
          aria-hidden="true"
        />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-space text-xs text-slate-600">
            © 2026 SAMAGRA · SRKR Engineering College · Dept. of CSD & CSIT · All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 font-space text-xs text-slate-500 hover:text-cyan-400 transition-all duration-200 cursor-pointer group"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
            >
              <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
