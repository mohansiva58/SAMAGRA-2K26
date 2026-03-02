'use client';

import { useState, useRef } from 'react';

const branches = [
  { value: '', label: 'Select Branch' },
  { value: 'csd', label: 'Computer Science & Design (CSD)' },
  { value: 'csit', label: 'Computer Science & IT (CSIT)' },
  { value: 'cse', label: 'Computer Science & Engineering' },
  { value: 'ece', label: 'Electronics & Communication' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'ce', label: 'Civil Engineering' },
  { value: 'other', label: 'Other' },
];

const years = [
  { value: '', label: 'Select Year' },
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

type FormData = {
  fullName: string;
  collegeName: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  eventType: string[];
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.collegeName.trim()) errors.collegeName = 'College name is required';
  if (!data.branch) errors.branch = 'Please select your branch';
  if (!data.year) errors.year = 'Please select your year';
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Enter a valid email address';
  if (!data.phone.match(/^[6-9]\d{9}$/)) errors.phone = 'Enter a valid 10-digit Indian phone number';
  if (data.eventType.length === 0) errors.eventType = 'Please select at least one event';
  return errors;
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    collegeName: '',
    branch: '',
    year: '',
    email: '',
    phone: '',
    eventType: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      eventType: checked
        ? [...prev.eventType, value]
        : prev.eventType.filter((v) => v !== value),
    }));
    if (errors.eventType) setErrors((prev) => ({ ...prev, eventType: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: '', collegeName: '', branch: '', year: '', email: '', phone: '', eventType: [] });
    }, 5000);
  };

  const inputClass = (field: keyof FormData) =>
    `input-glow w-full px-4 py-3 rounded-xl text-sm font-space ${errors[field] ? 'border-red-500/60' : ''}`;

  return (
    <section id="registration" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="section-badge mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Registration
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-4">
            Register{' '}
            <span className="gradient-text-cyan">Now</span>
          </h2>
          <p className="font-space text-slate-400 text-lg">
            Secure your spot at SAMAGRA 2026 — the national-level Prompt Engineering showcase
          </p>
        </div>

        {/* Form Card */}
        <div className="reveal form-card p-8 sm:p-10">
          {submitted ? (
            // Success State
            <div className="text-center py-12">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center neon-glow-anim"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 40px rgba(0,212,255,0.5)',
                }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-white mb-3">You're Registered!</h3>
              <p className="font-space text-slate-400 mb-2">
                Welcome to <span className="text-cyan-400 font-semibold">SAMAGRA 2026</span>
              </p>
              <p className="font-space text-slate-500 text-sm">
                We look forward to seeing you at SRKR Engineering College. Details will be shared separately.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="SAMAGRA 2026 Registration Form">
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block font-space text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Full Name <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Sujay Kumar"
                    autoComplete="name"
                    className={inputClass('fullName')}
                    aria-required="true"
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="font-space text-xs text-red-400 mt-1" role="alert">{errors.fullName}</p>
                  )}
                </div>

                {/* College Name */}
                <div>
                  <label htmlFor="collegeName" className="block font-space text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    College Name <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="collegeName"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Your college name"
                    autoComplete="organization"
                    className={inputClass('collegeName')}
                    aria-required="true"
                    aria-describedby={errors.collegeName ? 'collegeName-error' : undefined}
                  />
                  {errors.collegeName && (
                    <p id="collegeName-error" className="font-space text-xs text-red-400 mt-1" role="alert">{errors.collegeName}</p>
                  )}
                </div>

                {/* Branch + Year */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="branch" className="block font-space text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Branch <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className={inputClass('branch')}
                      aria-required="true"
                    >
                      {branches.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                    {errors.branch && (
                      <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.branch}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="year" className="block font-space text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Year <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={inputClass('year')}
                      aria-required="true"
                    >
                      {years.map((y) => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.year}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-space text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Email Address <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass('email')}
                    aria-required="true"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="font-space text-xs text-red-400 mt-1" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block font-space text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Phone Number <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="input-glow px-3 py-3 rounded-xl text-sm font-space text-slate-400 flex items-center" style={{ minWidth: 56 }}>
                      +91
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      autoComplete="tel-national"
                      maxLength={10}
                      className={`input-glow flex-1 px-4 py-3 rounded-xl text-sm font-space ${errors.phone ? 'border-red-500/60' : ''}`}
                      aria-required="true"
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className="font-space text-xs text-red-400 mt-1" role="alert">{errors.phone}</p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <fieldset>
                    <legend className="block font-space text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                      Event Category <span className="text-red-400" aria-hidden="true">*</span>
                    </legend>
                    <div className="space-y-3">
                      {[
                        { value: 'technical-presentation', label: 'Technical Presentation', icon: '#00d4ff' },
                        { value: 'project-expo', label: 'Project Expo', icon: '#7c3aed' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
                          style={{
                            background: formData.eventType.includes(opt.value)
                              ? `${opt.icon}08`
                              : 'rgba(13,17,23,0.6)',
                            border: `1px solid ${formData.eventType.includes(opt.value) ? opt.icon + '40' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          <input
                            type="checkbox"
                            value={opt.value}
                            checked={formData.eventType.includes(opt.value)}
                            onChange={handleCheckbox}
                            className="custom-checkbox"
                            aria-label={opt.label}
                          />
                          <span className="font-space text-sm text-slate-200 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.eventType && (
                      <p className="font-space text-xs text-red-400 mt-2" role="alert">{errors.eventType}</p>
                    )}
                  </fieldset>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary-gradient btn-shimmer py-4 rounded-xl font-space font-bold text-base flex items-center justify-center gap-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Submit registration for SAMAGRA 2026"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Register for SAMAGRA 2026
                    </>
                  )}
                </button>

                <p className="font-space text-xs text-slate-600 text-center">
                  By registering, you agree to participate in SAMAGRA 2026. Your information is used solely for event coordination.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
