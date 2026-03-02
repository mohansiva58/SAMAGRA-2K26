'use client';

import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = 16;
          const increment = (target / duration) * step;
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="counter-value font-orbitron text-4xl font-black">
      {count}{suffix}
    </span>
  );
}

const prompts = [
  { input: 'Summarize this research paper in 3 bullet points', output: '• Key finding 1\n• Methodology\n• Conclusion' },
  { input: 'Generate a Python function to sort a list of objects', output: 'def sort_objects(lst, key):\n  return sorted(lst, key=lambda x: x[key])' },
  { input: 'Explain quantum computing to a 10-year-old', output: 'Imagine tiny balls that can be in two places at once...' },
];

export function AboutSection() {
  const [activePrompt, setActivePrompt] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePrompt((p) => (p + 1) % prompts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Why It Matters',
      desc: 'In an AI-driven world, communicating effectively with AI systems is becoming as fundamental as literacy. Master this skill today, lead tomorrow.',
      color: 'cyan',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Real-World Impact',
      desc: 'From healthcare diagnostics to creative content generation, prompt engineering powers innovations reshaping industries globally.',
      color: 'purple',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Future-Ready Skills',
      desc: 'Position yourself at the forefront of the AI revolution with skills that top employers are actively seeking in 2026 and beyond.',
      color: 'green',
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-badge mb-4">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            About the Theme
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-4">
            What is{' '}
            <span className="gradient-text-cyan">Prompt Engineering?</span>
          </h2>
          <p className="font-space text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            The art and science of crafting effective instructions for AI models — the bridge between human intent and machine intelligence.
          </p>
        </div>

        {/* AI Flow Diagram */}
        <div className="reveal mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 max-w-3xl mx-auto">
            {[
              { label: 'Human Intent', icon: '🧠', color: '#00d4ff' },
              null,
              { label: 'Prompt Engineering', icon: '⚡', color: '#7c3aed' },
              null,
              { label: 'AI Output', icon: '✨', color: '#00ff88' },
            ].map((item, i) =>
              item === null ? (
                <div key={i} className="hidden sm:flex items-center" aria-hidden="true">
                  <div className="w-12 h-px bg-gradient-to-r from-cyan-500/50 to-purple-500/50" />
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ) : (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 rounded-xl card-shine"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${item.color}0f 0%, transparent 70%)`,
                    border: `1px solid ${item.color}25`,
                    minWidth: 130,
                  }}
                >
                  <div className="text-3xl mb-2" role="img" aria-label={item.label}>{item.icon}</div>
                  <span className="font-space text-xs font-semibold tracking-wide" style={{ color: item.color }}>
                    {item.label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Reason Cards */}
        <div className="stagger-children grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`card-hover card-shine p-6 rounded-2xl ${card.color === 'cyan' ? 'neon-border-cyan' :
                  card.color === 'purple' ? 'neon-border-purple' : ''
                }`}
              style={{
                background: 'linear-gradient(135deg, rgba(13,17,23,0.9), rgba(13,17,23,0.7))',
                border: card.color === 'green' ? '1px solid rgba(0,255,136,0.25)' : undefined,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: card.color === 'cyan'
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))'
                    : card.color === 'purple'
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))'
                      : 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05))',
                  color: card.color === 'cyan' ? '#00d4ff' : card.color === 'purple' ? '#7c3aed' : '#00ff88',
                  border: `1px solid ${card.color === 'cyan' ? 'rgba(0,212,255,0.25)' : card.color === 'purple' ? 'rgba(124,58,237,0.25)' : 'rgba(0,255,136,0.25)'}`,
                }}
              >
                {card.icon}
              </div>
              <h3 className="font-space font-bold text-lg mb-2 text-white">{card.title}</h3>
              <p className="font-space text-slate-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Prompt Demo */}
        <div className="reveal max-w-2xl mx-auto">
          <div className="prompt-terminal">
            {/* Terminal bar */}
            <div className="terminal-bar" aria-label="Prompt demo terminal">
              <div className="terminal-dot" style={{ background: '#ef4444' }} />
              <div className="terminal-dot" style={{ background: '#f59e0b' }} />
              <div className="terminal-dot" style={{ background: '#10b981' }} />
              <span className="font-mono-code text-xs text-slate-500 ml-2">prompt-demo.ai</span>
            </div>

            {/* Prompt area */}
            <div className="p-5">
              <div className="mb-3">
                <span className="font-mono-code text-xs text-cyan-400/60 uppercase tracking-wider">Input Prompt</span>
                <p className="font-mono-code text-sm text-cyan-300 mt-1 transition-all duration-500">
                  &gt; {prompts[activePrompt].input}
                </p>
              </div>
              <div className="h-px bg-gradient-to-r from-cyan-500/20 to-transparent mb-3" aria-hidden="true" />
              <div>
                <span className="font-mono-code text-xs text-green-400/60 uppercase tracking-wider">AI Output</span>
                <p className="font-mono-code text-sm text-green-300 mt-1 whitespace-pre-line transition-all duration-500">
                  {prompts[activePrompt].output}
                </p>
              </div>
            </div>
          </div>
          <p className="text-center font-space text-xs text-slate-600 mt-3">
            Auto-cycling prompt examples · See the power of well-crafted prompts
          </p>
        </div>

        {/* Stats counters */}
        <div className="reveal stagger-children grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto text-center">
          {[
            { target: 95, suffix: '%', label: 'AI tools need Prompting' },
            { target: 300, suffix: '%', label: 'Productivity Boost' },
            { target: 2026, suffix: '', label: 'Year of AI Mastery' },
            { target: 100, suffix: '+', label: 'Expected Participants' },
          ].map((stat) => (
            <div key={stat.label}>
              <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              <p className="font-space text-xs text-slate-500 mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
