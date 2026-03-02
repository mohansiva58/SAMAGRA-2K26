'use client';

import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'About', id: 'about' },
  { label: 'Events', id: 'events' },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Register', id: 'registration' },
  { label: 'Contact', id: 'coordinators' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollY > 60);
      setScrollPercent((scrollY / docHeight) * 100);

      // Update active section
      const sections = ['hero', 'about', 'events', 'schedule', 'registration', 'coordinators'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollPercent}%` }}
        role="progressbar"
        aria-valuenow={scrollPercent}
        aria-label="Page scroll progress"
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'glass border-b border-cyan-500/10 py-3 shadow-lg shadow-cyan-500/5'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex flex-col leading-none cursor-pointer group"
            aria-label="Go to top"
          >
            <span
              className="font-orbitron text-xl font-black gradient-text-animated"
              style={{ letterSpacing: '0.08em' }}
            >
              SAMAGRA
            </span>
            <span className="text-[10px] font-space text-cyan-400/70 tracking-widest">
              2026
            </span>
          </button>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer font-space ${activeSection === link.id
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                    }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('registration')}
              className="hidden sm:flex items-center gap-2 btn-primary-gradient px-5 py-2 rounded-full text-sm font-space font-bold"
              aria-label="Register for SAMAGRA 2026"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Register Now
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="glass border-t border-cyan-500/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-space font-medium transition-all duration-200 cursor-pointer ${activeSection === link.id
                    ? 'text-cyan-400 bg-cyan-400/10'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                  }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('registration')}
              className="w-full btn-primary-gradient px-4 py-3 rounded-xl text-sm font-space font-bold mt-2"
            >
              Register Now
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
