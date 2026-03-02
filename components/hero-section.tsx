'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const NeuralCanvas = dynamic(
  () => import('./neural-canvas').then((m) => ({ default: m.NeuralCanvas })),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-background" /> }
);

const FULL_TEXT = 'PROMPT ENGINEERING';

export function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < FULL_TEXT.length) {
        setDisplayText(FULL_TEXT.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
        setDoneTyping(true);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Neural Network canvas background */}
      <div className="absolute inset-0">
        <NeuralCanvas />
      </div>

      {/* Radial orbs */}
      <div className="hero-orb-1 top-1/4 -left-32 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true" />
      <div className="hero-orb-2 bottom-1/4 -right-32 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center py-32">

        {/* College badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass border border-cyan-500/20 reveal"
          style={{ animationDelay: '0ms' }}
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: 'glowPulse 2s ease-in-out infinite' }} aria-hidden="true" />
          <span className="text-xs font-space font-semibold tracking-widest text-cyan-300 uppercase">
            SRKR Engineering College (A) · Bhimavaram
          </span>
        </div>

        {/* Event badge */}
        <div className="reveal mb-4" style={{ transitionDelay: '100ms' }}>
          <span className="section-badge">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            National Level Event · 9:30 AM – 4:30 PM
          </span>
        </div>

        {/* Main Title */}
        <h1 className="reveal font-orbitron font-black mb-2" style={{ transitionDelay: '200ms' }}>
          <span
            className="block gradient-text-animated text-glow-cyan"
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            SAMAGRA
          </span>
          <span
            className="block text-white/30"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', letterSpacing: '0.4em', fontWeight: 400 }}
          >
            2026
          </span>
        </h1>

        {/* Department */}
        <p className="reveal font-space text-slate-400 text-sm sm:text-base tracking-widest uppercase mb-6" style={{ transitionDelay: '280ms' }}>
          Department of <span className="text-cyan-400 font-semibold">CSD</span> &amp; <span className="text-purple-400 font-semibold">CSIT</span> · Presents
        </p>

        {/* Typewriter */}
        <div className="reveal mb-8" style={{ transitionDelay: '360ms' }}>
          <div
            className="inline-block px-6 py-4 rounded-2xl glass border border-purple-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.05))' }}
          >
            <span
              className="font-orbitron font-bold gradient-text-cyan"
              style={{ fontSize: 'clamp(1.4rem, 4.5vw, 3rem)', letterSpacing: '0.05em' }}
              aria-label="Prompt Engineering"
            >
              {displayText}
            </span>
            <span
              className="typewriter-cursor"
              style={{ display: doneTyping ? 'none' : 'inline-block' }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ transitionDelay: '440ms' }}
        >
          <button
            onClick={() => scrollTo('registration')}
            className="btn-primary-gradient btn-shimmer px-8 py-4 rounded-full font-space font-bold text-base sm:text-lg flex items-center gap-3 group"
            aria-label="Register for SAMAGRA 2026"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Register Now
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="btn-neon-cyan px-8 py-4 rounded-full font-space text-base sm:text-lg flex items-center gap-3 group"
            aria-label="Learn more about Prompt Engineering"
          >
            Explore Event
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Stats strip */}
        <div
          className="reveal stagger-children grid grid-cols-3 gap-4 max-w-xl mx-auto"
          style={{ transitionDelay: '520ms' }}
        >
          {[
            { value: '2', label: 'Event Categories' },
            { value: '∞', label: 'AI Possibilities' },
            { value: '1', label: 'Epic Day' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-orbitron text-2xl sm:text-3xl font-black counter-value mb-1">
                {stat.value}
              </div>
              <div className="font-space text-xs text-slate-500 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hanging Posters ── */}
      {/* Left poster — poster2 (CSD/CSIT Prompt Engineering poster) → scrolls to About */}
      <div
        className="hidden lg:flex flex-col items-center absolute left-4 xl:left-10 top-20 z-10 cursor-pointer"
        onClick={() => scrollTo('about')}
        title="What is Prompt Engineering?"
        aria-hidden="true"
        style={{ animation: 'swayLeft 6s ease-in-out infinite' }}
      >
        {/* Pin */}
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ zIndex: 2 }}>
          <circle cx="9" cy="6" r="5.5" fill="#00d4ff" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          <circle cx="9" cy="6" r="2" fill="#fff" opacity="0.6" />
          <rect x="8" y="10" width="2" height="12" rx="1" fill="#00d4ff" opacity="0.7" />
        </svg>
        {/* Thread */}
        <div style={{ width: 1.5, height: 200, background: 'linear-gradient(180deg, #00d4ff80, transparent)' }} />
        {/* Poster frame */}
        <div
          style={{
            transform: 'rotate(-5deg)',
            transformOrigin: 'top center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.15)',
            borderRadius: 10,
            border: '2px solid rgba(0,212,255,0.25)',
            overflow: 'hidden',
            width: 200,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(-5deg) scale(1.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(-5deg)'; }}
        >
          <img
            src="/poster2.png"
            alt="SAMAGRA 2026 – Prompt Engineering event poster"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      {/* Right poster — poster1 (national level event poster) → scrolls to Registration */}
      <div
        className="hidden lg:flex flex-col items-center absolute right-4 xl:right-10 top-20 z-10 cursor-pointer"
        onClick={() => scrollTo('registration')}
        title="Register Now"
        style={{ animation: 'swayRight 7s ease-in-out infinite' }}
      >
        {/* Pin */}
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ zIndex: 2 }}>
          <circle cx="9" cy="6" r="5.5" fill="#7c3aed" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          <circle cx="9" cy="6" r="2" fill="#fff" opacity="0.6" />
          <rect x="8" y="10" width="2" height="12" rx="1" fill="#7c3aed" opacity="0.7" />
        </svg>
        {/* Thread */}
        <div style={{ width: 1.5, height: 70, background: 'linear-gradient(180deg, #7c3aed80, transparent)' }} />
        {/* Poster frame */}
        <div
          style={{
            transform: 'rotate(5deg)',
            transformOrigin: 'top center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(124,58,237,0.15)',
            borderRadius: 10,
            border: '2px solid rgba(124,58,237,0.25)',
            overflow: 'hidden',
            width: 220,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(5deg) scale(1.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(5deg)'; }}
        >
          <img
            src="/poster1.jpeg"
            alt="SAMAGRA 2026 national level event poster"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>
      </div>


      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
        style={{ animation: 'floatGentle 3s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <span className="font-space text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-cyan-500/30 flex justify-center pt-1.5">
          <div
            className="w-1 h-2 bg-cyan-400 rounded-full"
            style={{ animation: 'floatGentle 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
}
