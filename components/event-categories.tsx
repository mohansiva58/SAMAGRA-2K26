'use client';

import { useState } from 'react';

const events = [
  {
    id: 'presentation',
    number: '01',
    title: 'Technical Presentation',
    subtitle: 'Share Your Knowledge',
    description:
      'Deliver an engaging and research-backed presentation on prompt engineering techniques, real-world applications, or AI innovations of 2026.',
    color: 'cyan',
    colorHex: '#00d4ff',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: [
      'Theoretical insights & innovations',
      'Research-backed findings',
      'Real-world case studies',
      'Q&A session with panel',
    ],
    value: 'technical-presentation',
  },
  {
    id: 'expo',
    number: '02',
    title: 'Project Expo',
    subtitle: 'Demonstrate & Innovate',
    description:
      'Showcase live AI-powered solutions and prompt-based projects that solve real problems. Demonstrate your innovation in an interactive booth setting.',
    color: 'purple',
    colorHex: '#7c3aed',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    features: [
      'Live project demonstration',
      'Practical AI solutions',
      'Interactive showcase',
      'Expert evaluation panel',
    ],
    value: 'project-expo',
  },
];

export function EventCategories() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const scrollToRegister = (eventValue?: string) => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="events" className="relative py-24 md:py-36 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-badge mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Event Categories
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-4">
            Choose Your{' '}
            <span className="gradient-text-purple">Path</span>
          </h2>
          <p className="font-space text-slate-400 text-lg max-w-xl mx-auto">
            Showcase your prompt engineering skills across two dynamic event formats
          </p>
        </div>

        {/* Event Cards */}
        <div className="stagger-children grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {events.map((event) => (
            <div
              key={event.id}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              className="card-hover card-shine relative rounded-2xl p-8 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.8) 100%)`,
                border: `1px solid ${hoveredEvent === event.id ? event.colorHex + '60' : event.colorHex + '20'}`,
                boxShadow: hoveredEvent === event.id
                  ? `0 0 40px ${event.colorHex}15, 0 20px 60px rgba(0,0,0,0.4)`
                  : '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.35s ease',
              }}
              onClick={() => scrollToRegister(event.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && scrollToRegister(event.value)}
              aria-label={`${event.title} - click to register`}
            >
              {/* Number badge */}
              <div
                className="absolute top-5 right-5 font-orbitron text-5xl font-black opacity-8"
                style={{ color: event.colorHex, lineHeight: 1 }}
                aria-hidden="true"
              >
                {event.number}
              </div>

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: `linear-gradient(135deg, ${event.colorHex}18, ${event.colorHex}08)`,
                  border: `1px solid ${event.colorHex}30`,
                  color: event.colorHex,
                  boxShadow: hoveredEvent === event.id ? `0 0 20px ${event.colorHex}30` : 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {event.icon}
              </div>

              <p
                className="font-space text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: event.colorHex }}
              >
                {event.subtitle}
              </p>
              <h3 className="font-space font-bold text-2xl text-white mb-3">{event.title}</h3>
              <p className="font-space text-slate-400 text-sm leading-relaxed mb-6">{event.description}</p>

              {/* Feature list */}
              <ul className="space-y-2 mb-7" role="list">
                {event.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 font-space text-sm text-slate-300">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: event.colorHex }}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="w-full py-3 rounded-xl font-space font-semibold text-sm transition-all duration-250"
                style={{
                  background: hoveredEvent === event.id
                    ? `linear-gradient(135deg, ${event.colorHex}, ${event.color === 'cyan' ? '#7c3aed' : '#00d4ff'})`
                    : `linear-gradient(135deg, ${event.colorHex}20, ${event.colorHex}10)`,
                  color: hoveredEvent === event.id ? '#000' : event.colorHex,
                  border: `1px solid ${event.colorHex}40`,
                }}
                aria-label={`Register for ${event.title}`}
              >
                Register for This Event
              </button>
            </div>
          ))}
        </div>

        {/* Event Info Grid */}
        <div className="reveal">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.04))',
              border: '1px solid rgba(0,212,255,0.12)',
            }}
          >
            <h3 className="font-space font-bold text-xl text-center mb-8 text-white">Event At a Glance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="#00d4ff" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: 'Venue',
                  value: 'SRKR Engineering College',
                  color: '#00d4ff',
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="#7c3aed" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: 'Time',
                  value: '9:30 AM – 4:30 PM',
                  color: '#7c3aed',
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="#00ff88" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  ),
                  label: 'Department',
                  value: 'CSD & CSIT',
                  color: '#00ff88',
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="#a78bfa" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  ),
                  label: 'Level',
                  value: 'National Level',
                  color: '#a78bfa',
                },
              ].map((info) => (
                <div key={info.label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: `${info.color}0f`, border: `1px solid ${info.color}20` }}
                  >
                    {info.icon}
                  </div>
                  <p className="font-space text-xs text-slate-500 uppercase tracking-wide">{info.label}</p>
                  <p className="font-space font-semibold text-sm text-white text-center">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
