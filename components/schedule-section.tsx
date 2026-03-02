'use client';

const schedule = [
    { time: '9:30 AM', title: 'Registration & Welcome', desc: 'Check-in, badge collection & morning refreshments', color: '#00d4ff' },
    { time: '10:00 AM', title: 'Inauguration Ceremony', desc: 'Chief guest address & event launch by Department Heads', color: '#a78bfa' },
    { time: '10:30 AM', title: 'Technical Presentations Begin', desc: 'Round 1: Teams present their Prompt Engineering research', color: '#7c3aed' },
    { time: '12:30 PM', title: 'Lunch Break', desc: 'Networking lunch & exhibition preview', color: '#00ff88' },
    { time: '1:30 PM', title: 'Project Expo – Live Demos', desc: 'Students showcase AI-powered projects & live demonstrations', color: '#f59e0b' },
    { time: '3:30 PM', title: 'Evaluation & Panel Q&A', desc: 'Expert jury evaluates projects and presentations', color: '#ef4444' },
    { time: '4:00 PM', title: 'Valedictory & Prize Distribution', desc: 'Winners announced, certificates distributed', color: '#00d4ff' },
    { time: '4:30 PM', title: 'Closing Ceremony', desc: 'Vote of thanks & group photo session', color: '#00ff88' },
];

export function ScheduleSection() {
    return (
        <section id="schedule" className="relative py-24 md:py-36 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
                <div className="absolute inset-0 grid-bg opacity-15" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-green-500/4 rounded-full blur-3xl" />
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-cyan-500/4 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-16 reveal">
                    <div className="section-badge mb-4">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Event Schedule
                    </div>
                    <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-4">
                        Day{' '}
                        <span className="gradient-text-green">Timeline</span>
                    </h2>
                    <p className="font-space text-slate-400 text-lg">
                        A packed day of innovation, learning, and collaboration
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative stagger-children">
                    {/* Vertical line */}
                    <div
                        className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px"
                        style={{
                            background: 'linear-gradient(180deg, #00d4ff33 0%, #7c3aed33 50%, #00ff8833 100%)',
                            transform: 'translateX(-50%)',
                        }}
                        aria-hidden="true"
                    />

                    {schedule.map((item, i) => (
                        <div
                            key={i}
                            className={`relative flex gap-6 sm:gap-0 items-start mb-8 last:mb-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                                }`}
                        >
                            {/* Content */}
                            <div className={`w-full pl-16 sm:pl-0 sm:w-5/12 ${i % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:pl-10'}`}>
                                <div
                                    className="p-5 rounded-xl card-shine"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(13,17,23,0.95), rgba(13,17,23,0.8))',
                                        border: `1px solid ${item.color}20`,
                                    }}
                                >
                                    <p
                                        className="font-orbitron text-xs font-bold mb-1 tracking-wider"
                                        style={{ color: item.color }}
                                    >
                                        {item.time}
                                    </p>
                                    <h3 className="font-space font-bold text-white text-base mb-1">{item.title}</h3>
                                    <p className="font-space text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            </div>

                            {/* Center dot */}
                            <div
                                className="absolute left-8 sm:left-1/2 top-5 w-4 h-4 rounded-full -translate-x-1/2 z-10"
                                style={{
                                    background: item.color,
                                    boxShadow: `0 0 12px ${item.color}80`,
                                }}
                                aria-hidden="true"
                            />

                            {/* Spacer for opposite side */}
                            <div className="hidden sm:block sm:w-5/12" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
