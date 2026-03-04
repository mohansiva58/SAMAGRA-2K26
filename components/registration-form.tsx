'use client';

import { useState, useRef, useCallback } from 'react';
import { ref, push, set } from 'firebase/database';
import { rtdb } from '@/lib/firebase';

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const config = {
  upiId: '',          // ← Replace with real UPI ID
  payeeName: 'SAMAGRA 2026',
  pricePerEvent: 200,                 // ₹200 per event
  eventNote: 'SAMAGRA2026 Registration',
};

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type FormData = {
  fullName: string;
  collegeName: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  eventType: string[];
  // Team fields
  teamName: string;
  numberOfParticipants: string;
  teamLeadName: string;
  teamLeadPhone: string;
  paymentMethod: 'online' | 'venue' | '';
};

type PaymentData = {
  transactionId: string;
  screenshotFile: File | null;
  screenshotPreview: string | null;
};

type FormErrors = Partial<Record<keyof FormData | keyof PaymentData, string>>;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const branches = [
  { value: '', label: 'Select Branch' },
  { value: 'CS', label: 'Computer Science & related Branches' },
  { value: 'ECE', label: 'EEE' },
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

const participantOptions = ['1', '2', '3'];

const eventOptions = [
  {
    value: 'technical-presentation',
    label: 'Technical Presentation',
    description: 'Present your research on Prompt Engineering',
    colorHex: '#00d4ff',
  },
  {
    value: 'project-expo',
    label: 'Project Expo',
    description: 'Showcase your AI-powered live project',
    colorHex: '#7c3aed',
  },
];

// ─── VALIDATION ─────────────────────────────────────────────────────────────────
function validateStep1(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.collegeName.trim()) errors.collegeName = 'College name is required';
  if (!data.branch) errors.branch = 'Please select your branch';
  if (!data.year) errors.year = 'Please select your year';
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    errors.email = 'Enter a valid email address';
  if (!data.phone.match(/^[6-9]\d{9}$/))
    errors.phone = 'Enter a valid 10-digit Indian phone number';
  if (data.eventType.length === 0)
    errors.eventType = 'Please select at least one event';
  // Team validations
  if (!data.teamName.trim()) errors.teamName = 'Team name is required';
  if (!data.numberOfParticipants) errors.numberOfParticipants = 'Please select number of participants';
  if (!data.teamLeadName.trim()) errors.teamLeadName = 'Team lead name is required';
  if (!data.teamLeadPhone.match(/^[6-9]\d{9}$/))
    errors.teamLeadPhone = 'Enter a valid 10-digit mobile number';
  if (!data.paymentMethod) errors.paymentMethod = 'Please select a payment method';
  return errors;
}

function validateStep2(payment: PaymentData): FormErrors {
  const errors: FormErrors = {};
  if (!payment.transactionId.trim())
    errors.transactionId = 'Transaction ID is required';
  else if (payment.transactionId.trim().length < 6)
    errors.transactionId = 'Enter a valid UPI Transaction ID';
  if (!payment.screenshotFile)
    errors.screenshotFile = 'Payment screenshot is required';
  return errors;
}

// ─── UPI URL ──────────────────────────────────────────────────────────────────
function buildUpiUrl(amount: number): string {
  const params = new URLSearchParams({
    pa: config.upiId,
    pn: config.payeeName,
    am: amount.toString(),
    cu: 'INR',
    tn: config.eventNote,
  });
  return `upi://pay?${params.toString()}`;
}

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ['Details', 'Payment', 'Done'];
  return (
    <div className="flex items-center justify-center gap-0 mb-8" role="list" aria-label="Registration steps">
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = step === num;
        const isDone = step > num;
        return (
          <div key={label} className="flex items-center" role="listitem">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-orbitron font-bold transition-all duration-400"
                style={{
                  background: isDone
                    ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                    : isActive
                      ? 'linear-gradient(135deg, #00d4ff20, #7c3aed20)'
                      : 'rgba(255,255,255,0.04)',
                  border: isActive
                    ? '2px solid #00d4ff'
                    : isDone
                      ? '2px solid transparent'
                      : '2px solid rgba(255,255,255,0.1)',
                  color: isDone ? '#000' : isActive ? '#00d4ff' : '#64748b',
                  boxShadow: isActive ? '0 0 16px rgba(0,212,255,0.4)' : 'none',
                }}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className="font-space text-[10px] tracking-wider uppercase"
                style={{ color: isActive ? '#00d4ff' : isDone ? '#64748b' : '#374151' }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 h-px mx-2 mb-4 transition-all duration-500"
                style={{
                  background: step > num
                    ? 'linear-gradient(90deg, #00d4ff, #7c3aed)'
                    : 'rgba(255,255,255,0.08)',
                }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PRICE BADGE ──────────────────────────────────────────────────────────────
function PriceBadge({ count, amount }: { count: number; amount: number }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))',
        border: '1px solid rgba(0,212,255,0.15)',
      }}
    >
      <div>
        <p className="font-space text-xs text-slate-500 uppercase tracking-wider mb-0.5">Registration Fee</p>
        <p className="font-space text-sm text-slate-300">
          {count} event{count > 1 ? 's' : ''} × ₹{config.pricePerEvent}
        </p>
      </div>
      <div className="text-right">
        <p
          className="font-orbitron font-black text-3xl"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ₹{amount}
        </p>
        <p className="font-space text-[10px] text-slate-600 tracking-widest uppercase">Total</p>
      </div>
    </div>
  );
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px" style={{ background: 'rgba(0,212,255,0.12)' }} />
      <span
        className="font-space text-[10px] uppercase tracking-widest px-2"
        style={{ color: '#00d4ff99' }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(0,212,255,0.12)' }} />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    collegeName: '',
    branch: '',
    year: '',
    email: '',
    phone: '',
    eventType: [],
    teamName: '',
    numberOfParticipants: '',
    teamLeadName: '',
    teamLeadPhone: '',
    paymentMethod: '',
  });
  const [payment, setPayment] = useState<PaymentData>({
    transactionId: '',
    screenshotFile: null,
    screenshotPreview: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalAmount = formData.eventType.length * config.pricePerEvent;
  const upiUrl = buildUpiUrl(totalAmount);

  // ── Handlers ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleCheckbox = (value: string, checked: boolean) => {
    setFormData((p) => ({
      ...p,
      eventType: checked
        ? [...p.eventType, value]
        : p.eventType.filter((v) => v !== value),
    }));
    if (errors.eventType) setErrors((p) => ({ ...p, eventType: '' }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayment((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof PaymentData]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, screenshotFile: 'Please upload an image file (JPG/PNG)' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, screenshotFile: 'File size must be less than 5MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPayment((p) => ({
        ...p,
        screenshotFile: file,
        screenshotPreview: ev.target?.result as string,
      }));
      setErrors((p) => ({ ...p, screenshotFile: '' }));
    };
    reader.readAsDataURL(file);
  }, []);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(config.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // Clipboard API may be blocked
    }
  };

  // ── Registration Submission ──
  const submitRegistration = async (actualPayment?: PaymentData) => {
    setLoading(true);
    setSubmitError('');

    try {
      // 1. Convert screenshot to base64 if it exists
      let screenshotBase64 = '';
      if (actualPayment?.screenshotFile) {
        screenshotBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string ?? '');
          reader.onerror = reject;
          reader.readAsDataURL(actualPayment.screenshotFile!);
        });
      }

      // 2. Save everything to Firebase Realtime Database
      const registrationsRef = ref(rtdb, 'registrations');
      const newEntryRef = push(registrationsRef);

      const isOnline = formData.paymentMethod === 'online';

      await set(newEntryRef, {
        fullName: formData.fullName.trim(),
        collegeName: formData.collegeName.trim(),
        branch: formData.branch,
        year: formData.year,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        teamName: formData.teamName.trim(),
        numberOfParticipants: formData.numberOfParticipants,
        teamLeadName: formData.teamLeadName.trim(),
        teamLeadPhone: formData.teamLeadPhone.trim(),
        events: formData.eventType,
        paymentMethod: formData.paymentMethod,
        totalAmount,
        transactionId: isOnline ? (actualPayment?.transactionId.trim() || '') : 'PAY_AT_VENUE',
        screenshotBase64: isOnline ? screenshotBase64 : '',
        status: isOnline ? 'pending_verification' : 'pay_at_venue',
        submittedAt: new Date().toISOString(),
      });

      setLoading(false);
      setStep(3);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to submit. Please check your connection and try again.');
      setLoading(false);
    }
  };

  // ── Step 1 → 2 or Submit ──
  const handleNext = async () => {
    const errs = validateStep1(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (formData.paymentMethod === 'online') {
      setStep(2);
      setTimeout(() => {
        document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      await submitRegistration();
    }
  };

  // ── Step 2 → 3 (Submit Online Payment) ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2(payment);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await submitRegistration(payment);
  };

  const inputClass = (field: string) =>
    `input-glow w-full px-4 py-3 rounded-xl text-sm font-space ${errors[field as keyof FormErrors] ? 'border-red-500/60' : ''
    }`;

  // ── RENDER ──
  return (
    <section id="registration" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 reveal">
          <div className="section-badge mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Registration &amp; Payment
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl mb-3">
            Register{' '}
            <span className="gradient-text-cyan">Now</span>
          </h2>
          <p className="font-space text-slate-400 text-base">
            Secure your spot · <span className="text-cyan-400 font-semibold">₹{config.pricePerEvent}</span> per event
          </p>
        </div>

        {/* Card */}
        <div className="reveal form-card p-7 sm:p-9">
          <StepIndicator step={step} />

          {/* ═══════════ STEP 1: Details ═══════════ */}
          {step === 1 && (
            <div>
              <p className="font-space text-xs text-slate-500 uppercase tracking-widest mb-5 text-center">
                Step 1 — Fill your details
              </p>

              <div className="space-y-4">
                {/* ── Personal Info ── */}
                <SectionDivider title="Personal Info" />

                {/* Name */}
                <div>
                  <label htmlFor="fullName" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Full Name <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName}
                    onChange={handleChange} placeholder="e.g. Mohan Siva"
                    autoComplete="name" className={inputClass('fullName')} aria-required="true" />
                  {errors.fullName && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.fullName}</p>}
                </div>

                {/* College */}
                <div>
                  <label htmlFor="collegeName" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    College Name <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input type="text" id="collegeName" name="collegeName" value={formData.collegeName}
                    onChange={handleChange} placeholder="Your college name"
                    autoComplete="organization" className={inputClass('collegeName')} aria-required="true" />
                  {errors.collegeName && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.collegeName}</p>}
                </div>

                {/* Branch + Year */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="branch" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Branch <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <select id="branch" name="branch" value={formData.branch}
                      onChange={handleChange} className={inputClass('branch')} aria-required="true">
                      {branches.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                    {errors.branch && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.branch}</p>}
                  </div>
                  <div>
                    <label htmlFor="year" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Year <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <select id="year" name="year" value={formData.year}
                      onChange={handleChange} className={inputClass('year')} aria-required="true">
                      {years.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                    {errors.year && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.year}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Email <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input type="email" id="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="you@example.com"
                    autoComplete="email" className={inputClass('email')} aria-required="true" />
                  {errors.email && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Phone <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="input-glow px-3 py-3 rounded-xl text-sm font-space text-slate-400 flex items-center flex-shrink-0">
                      +91
                    </div>
                    <input type="tel" id="phone" name="phone" value={formData.phone}
                      onChange={handleChange} placeholder="10-digit number"
                      autoComplete="tel-national" maxLength={10}
                      className={`input-glow flex-1 px-4 py-3 rounded-xl text-sm font-space ${errors.phone ? 'border-red-500/60' : ''}`}
                      aria-required="true" />
                  </div>
                  {errors.phone && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.phone}</p>}
                </div>

                {/* ── Team Info ── */}
                <SectionDivider title="Team Info" />

                {/* Team Name */}
                <div>
                  <label htmlFor="teamName" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Name of the Team <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input type="text" id="teamName" name="teamName" value={formData.teamName}
                    onChange={handleChange} placeholder="e.g. Team Nexus"
                    autoComplete="off" className={inputClass('teamName')} aria-required="true" />
                  {errors.teamName && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.teamName}</p>}
                </div>

                {/* Number of Participants */}
                <div>
                  <fieldset>
                    <legend className="block font-space text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                      Number of Participants <span className="text-red-400" aria-hidden="true">*</span>
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {participantOptions.map((num) => {
                        const isSelected = formData.numberOfParticipants === num;
                        return (
                          <label
                            key={num}
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all duration-200 select-none"
                            style={{
                              background: isSelected
                                ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))'
                                : 'rgba(13,17,23,0.6)',
                              border: `1px solid ${isSelected ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.06)'}`,
                              boxShadow: isSelected ? '0 0 12px rgba(0,212,255,0.1)' : 'none',
                            }}
                          >
                            <input
                              type="radio"
                              name="numberOfParticipants"
                              value={num}
                              checked={isSelected}
                              onChange={handleChange}
                              className="sr-only"
                              aria-label={`${num} participant${num !== '1' ? 's' : ''}`}
                            />
                            <span
                              className="font-orbitron font-bold text-xl"
                              style={{
                                color: isSelected ? '#00d4ff' : '#64748b',
                              }}
                            >
                              {num}
                            </span>
                            <span className="font-space text-[10px] uppercase tracking-wider"
                              style={{ color: isSelected ? '#00d4ff80' : '#374151' }}>
                              {num === '1' ? 'Solo' : num === '2' ? 'Duo' : 'Trio'}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.numberOfParticipants && (
                      <p className="font-space text-xs text-red-400 mt-2" role="alert">{errors.numberOfParticipants}</p>
                    )}
                  </fieldset>
                </div>

                {/* Team Lead Name */}
                <div>
                  <label htmlFor="teamLeadName" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Name of the Team Lead <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input type="text" id="teamLeadName" name="teamLeadName" value={formData.teamLeadName}
                    onChange={handleChange} placeholder="Team lead's full name"
                    autoComplete="off" className={inputClass('teamLeadName')} aria-required="true" />
                  {errors.teamLeadName && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.teamLeadName}</p>}
                </div>

                {/* Team Lead Phone */}
                <div>
                  <label htmlFor="teamLeadPhone" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Mobile Number of the Team Lead <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="input-glow px-3 py-3 rounded-xl text-sm font-space text-slate-400 flex items-center flex-shrink-0">
                      +91
                    </div>
                    <input type="tel" id="teamLeadPhone" name="teamLeadPhone" value={formData.teamLeadPhone}
                      onChange={handleChange} placeholder="10-digit number"
                      autoComplete="off" maxLength={10}
                      className={`input-glow flex-1 px-4 py-3 rounded-xl text-sm font-space ${errors.teamLeadPhone ? 'border-red-500/60' : ''}`}
                      aria-required="true" />
                  </div>
                  {errors.teamLeadPhone && <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.teamLeadPhone}</p>}
                </div>

                {/* ── Event Selection ── */}
                <SectionDivider title="Event Selection" />

                {/* Event Selection */}
                <div>
                  <fieldset>
                    <legend className="block font-space text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                      Event Category <span className="text-red-400" aria-hidden="true">*</span>
                      <span className="ml-2 text-slate-500 normal-case tracking-normal">— ₹{config.pricePerEvent} each</span>
                    </legend>
                    <div className="space-y-3">
                      {eventOptions.map((opt) => {
                        const selected = formData.eventType.includes(opt.value);
                        return (
                          <label
                            key={opt.value}
                            className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
                            style={{
                              background: selected ? `${opt.colorHex}08` : 'rgba(13,17,23,0.6)',
                              border: `1px solid ${selected ? opt.colorHex + '45' : 'rgba(255,255,255,0.06)'}`,
                              boxShadow: selected ? `0 0 15px ${opt.colorHex}12` : 'none',
                            }}
                          >
                            <input
                              type="checkbox"
                              value={opt.value}
                              checked={selected}
                              onChange={(e) => handleCheckbox(opt.value, e.target.checked)}
                              className="custom-checkbox mt-0.5"
                              aria-label={opt.label}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-space text-sm text-slate-200 font-semibold">{opt.label}</span>
                                <span
                                  className="font-orbitron text-sm font-bold flex-shrink-0"
                                  style={{ color: opt.colorHex }}
                                >
                                  ₹{config.pricePerEvent}
                                </span>
                              </div>
                              <p className="font-space text-xs text-slate-500 mt-0.5">{opt.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {errors.eventType && (
                      <p className="font-space text-xs text-red-400 mt-2" role="alert">{errors.eventType}</p>
                    )}
                  </fieldset>
                </div>

                {/* ── Payment Method ── */}
                <SectionDivider title="Payment Method" />

                <div className="mb-6">
                  <fieldset>
                    <legend className="block font-space text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                      How would you like to pay? <span className="text-red-400" aria-hidden="true">*</span>
                    </legend>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {/* Online Payment */}
                      <label
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none"
                        style={{
                          background: formData.paymentMethod === 'online'
                            ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))'
                            : 'rgba(13,17,23,0.6)',
                          border: `1px solid ${formData.paymentMethod === 'online' ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.06)'}`,
                          boxShadow: formData.paymentMethod === 'online' ? '0 0 12px rgba(0,212,255,0.1)' : 'none',
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500/10 text-cyan-400 mb-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="font-space text-sm font-bold text-slate-200 text-center">Online Payment</span>
                        <span className="font-space text-[10px] text-slate-500 text-center leading-tight">Pay via UPI / QR Right Now</span>
                      </label>

                      {/* Pay at Venue */}
                      <label
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none"
                        style={{
                          background: formData.paymentMethod === 'venue'
                            ? 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(0,212,255,0.12))'
                            : 'rgba(13,17,23,0.6)',
                          border: `1px solid ${formData.paymentMethod === 'venue' ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.06)'}`,
                          boxShadow: formData.paymentMethod === 'venue' ? '0 0 12px rgba(124,58,237,0.1)' : 'none',
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="venue"
                          checked={formData.paymentMethod === 'venue'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-400 mb-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="font-space text-sm font-bold text-slate-200 text-center">Pay at Venue</span>
                        <span className="font-space text-[10px] text-slate-500 text-center leading-tight">Pay at registration desk</span>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <p className="font-space text-xs text-red-400 mt-2" role="alert">{errors.paymentMethod}</p>
                    )}
                  </fieldset>
                </div>

                {/* Price summary (only when events selected) */}
                {formData.eventType.length > 0 && (
                  <PriceBadge count={formData.eventType.length} amount={totalAmount} />
                )}

                {/* Next button */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full btn-primary-gradient btn-shimmer py-4 rounded-xl font-space font-bold text-base flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
                  aria-label={formData.paymentMethod === 'venue' ? 'Submit Registration' : 'Proceed to payment'}
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : formData.paymentMethod === 'venue' ? (
                    <>
                      Complete Registration
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

              </div>
            </div>
          )}

          {/* ═══════════ STEP 2: Payment ═══════════ */}
          {step === 2 && (
            <form onSubmit={handleSubmit} noValidate>
              <p className="font-space text-xs text-slate-500 uppercase tracking-widest mb-5 text-center">
                Step 2 — Complete UPI Payment
              </p>

              {/* Amount banner */}
              <PriceBadge count={formData.eventType.length} amount={totalAmount} />

              {/* QR Code Section */}
              <div
                className="rounded-2xl p-5 mb-5 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.04))',
                  border: '1px solid rgba(0,212,255,0.15)',
                }}
              >
                <p className="font-space text-xs text-slate-500 uppercase tracking-widest mb-4">
                  Scan QR with Google Pay / PhonePe / Paytm
                </p>

                <div className="flex justify-center mb-4">
                  <img
                    src="/qr.png"
                    alt="UPI Payment QR Code — scan with Google Pay, PhonePe or Paytm"
                    width={200}
                    height={200}
                    style={{ display: 'block', width: 200, height: 200, objectFit: 'contain', borderRadius: 12 }}
                  />
                </div>

                {/* Amount highlight */}
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-space text-xs text-yellow-400">
                    Pay exactly <span className="font-bold">₹{totalAmount}</span> — no more, no less
                  </p>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="mb-4">
                <label htmlFor="transactionId" className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  UPI Transaction ID <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  value={payment.transactionId}
                  onChange={handlePaymentChange}
                  placeholder="e.g. 408519736320"
                  autoComplete="off"
                  className={inputClass('transactionId')}
                  aria-required="true"
                  aria-describedby={errors.transactionId ? 'txn-error' : undefined}
                />
                {errors.transactionId && (
                  <p id="txn-error" className="font-space text-xs text-red-400 mt-1" role="alert">{errors.transactionId}</p>
                )}
                <p className="font-space text-[11px] text-slate-600 mt-1">
                  Find it in your UPI app under &quot;Transaction History&quot;
                </p>
              </div>

              {/* Screenshot Upload */}
              <div className="mb-6">
                <label className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Payment Screenshot <span className="text-red-400" aria-hidden="true">*</span>
                </label>

                {payment.screenshotPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-cyan-500/30">
                    <img
                      src={payment.screenshotPreview}
                      alt="Payment screenshot preview"
                      className="w-full max-h-52 object-contain bg-black/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPayment((p) => ({ ...p, screenshotFile: null, screenshotPreview: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Remove screenshot"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2 text-xs font-space text-green-400"
                      style={{ background: 'rgba(0,0,0,0.7)' }}
                    >
                      ✓ {payment.screenshotFile?.name}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-6 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${errors.screenshotFile ? 'border-red-500/50' : 'border-slate-700 hover:border-cyan-500/50'
                      }`}
                    style={{ background: 'rgba(13,17,23,0.5)' }}
                    aria-label="Click to upload payment screenshot"
                  >
                    <svg className="w-10 h-10 mx-auto mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-space text-sm text-slate-400 mb-1">Click to upload screenshot</p>
                    <p className="font-space text-xs text-slate-600">JPG, PNG — Max 5MB</p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload payment screenshot"
                />
                {errors.screenshotFile && (
                  <p className="font-space text-xs text-red-400 mt-1" role="alert">{errors.screenshotFile}</p>
                )}
              </div>

              {/* Submit error */}
              {submitError && (
                <div
                  className="mb-4 p-3 rounded-xl font-space text-xs text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  role="alert"
                >
                  ⚠ {submitError}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrors({}); setSubmitError(''); }}
                  className="flex-shrink-0 px-5 py-4 rounded-xl font-space text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  aria-label="Go back to details"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary-gradient btn-shimmer py-4 rounded-xl font-space font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Submit registration"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Confirm Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ═══════════ STEP 3: Success ═══════════ */}
          {step === 3 && (
            <div className="text-center py-8">
              {/* Animated checkmark */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center neon-glow-anim"
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                    boxShadow: '0 0 50px rgba(0,212,255,0.5)',
                  }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="font-orbitron font-black text-2xl text-white mb-2">
                Registration Successful!
              </h3>
              <p className="font-space text-slate-400 mb-4">
                Welcome to{' '}
                <span className="gradient-text-cyan font-semibold">SAMAGRA 2026</span>
              </p>

              {/* Summary card */}
              <div
                className="text-left rounded-xl p-5 mb-6 space-y-2"
                style={{
                  background: 'rgba(0,212,255,0.04)',
                  border: '1px solid rgba(0,212,255,0.15)',
                }}
              >
                <p className="font-space text-xs text-slate-600 uppercase tracking-widest mb-3">Registration Summary</p>
                {[
                  { label: 'Name', value: formData.fullName },
                  { label: 'College', value: formData.collegeName },
                  { label: 'Team', value: formData.teamName },
                  { label: 'Participants', value: formData.numberOfParticipants },
                  { label: 'Team Lead', value: formData.teamLeadName },
                  { label: 'Events', value: formData.eventType.map((e) => eventOptions.find((o) => o.value === e)?.label).join(', ') },
                  { label: 'Payment Method', value: formData.paymentMethod === 'online' ? 'Online UPI' : 'Pay at Venue' },
                  { label: 'Total Amount', value: `₹${totalAmount}` },
                  ...(formData.paymentMethod === 'online' ? [{ label: 'Transaction ID', value: payment.transactionId }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="font-space text-xs text-slate-500 flex-shrink-0">{label}</span>
                    <span className="font-space text-xs text-slate-300 font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl p-4"
                style={{
                  background: formData.paymentMethod === 'online' ? 'rgba(0,255,136,0.04)' : 'rgba(255,170,0,0.04)',
                  border: `1px solid ${formData.paymentMethod === 'online' ? 'rgba(0,255,136,0.15)' : 'rgba(255,170,0,0.15)'}`,
                }}
              >
                <p className={`font-space text-sm mb-1 font-semibold ${formData.paymentMethod === 'online' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {formData.paymentMethod === 'online' ? "What's Next?" : "Action Required"}
                </p>
                <p className="font-space text-xs text-slate-500 leading-relaxed">
                  {formData.paymentMethod === 'online'
                    ? "Your payment will be verified by our team. You'll receive confirmation details at the event."
                    : "Please visit the registration desk at the venue to complete your payment and collect your entry pass."}
                </p>
              </div>

              {/* Contact numbers */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+917075020235"
                  className="flex items-center justify-center gap-2 btn-neon-cyan px-4 py-2 rounded-lg text-sm"
                  aria-label="Call D Rohith"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  D Rohith
                </a>
                <a
                  href="tel:+917569045598"
                  className="flex items-center justify-center gap-2 btn-neon-cyan px-4 py-2 rounded-lg text-sm"
                  aria-label="Call D Prabhas"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  D Prabhas
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Security note */}
        {step !== 3 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="font-space text-[11px] text-slate-600">
              Secure registration · Your data is saved to our database for event coordination
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

