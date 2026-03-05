'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { rtdb } from '@/lib/firebase';

// ─── HARDCODED ADMIN CREDENTIALS ─────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@samagra2026.com';
const ADMIN_PASSWORD = 'Samagra@2026';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type GalleryImage = {
    id: string;
    data: string;
    caption: string;
    uploadedAt: string;
};

type GalleryCategory = {
    id: string;
    name: string;
    createdAt: string;
    images: GalleryImage[];
};

type Registration = {
    id: string;
    fullName: string;
    collegeName: string;
    branch: string;
    year: string;
    email: string;
    phone: string;
    teamName: string;
    numberOfParticipants: string;
    teamLeadName: string;
    teamLeadPhone: string;
    events: string[];
    paymentMethod: string;
    totalAmount: number;
    transactionId: string;
    screenshotBase64?: string;
    status: string;
    submittedAt: string;
};

// ─── IMAGE COMPRESSOR ────────────────────────────────────────────────────────
// Iteratively compresses using Canvas API (no third-party libs)
// Guarantees output base64 stays under 9.5 MB for Firebase compatibility
const MAX_DATA_BYTES = 9.5 * 1024 * 1024; // 9.5 MB base64 limit

async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Start at up to 1600px wide, quality 0.85
                let maxPx = 1600;
                let quality = 0.85;

                const tryCompress = (): string => {
                    const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.round(img.width * ratio);
                    canvas.height = Math.round(img.height * ratio);
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    return canvas.toDataURL('image/jpeg', quality);
                };

                let result = tryCompress();

                // Iteratively reduce until within Firebase limit
                while (result.length > MAX_DATA_BYTES && (quality > 0.2 || maxPx > 400)) {
                    if (quality > 0.2) {
                        quality = Math.max(0.2, quality - 0.1);
                    } else {
                        maxPx = Math.max(400, Math.round(maxPx * 0.75));
                        quality = 0.6; // reset quality on each dimension reduction
                    }
                    result = tryCompress();
                }

                resolve(result);
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // small UX delay
        if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('samagra_admin', '1');
            onLogin();
        } else {
            setError('Invalid email or password.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#030712' }}>
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 grid-bg opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="font-orbitron text-2xl font-black gradient-text-animated tracking-widest">SAMAGRA</span>
                    <p className="font-space text-xs text-slate-500 tracking-widest uppercase mt-1">Admin Dashboard · 2026</p>
                </div>

                <div className="form-card p-8" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(0,212,255,0.1))', border: '1px solid rgba(124,58,237,0.3)' }}>
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-orbitron font-bold text-lg text-white">Admin Login</h1>
                            <p className="font-space text-xs text-slate-500">Access management portal</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                placeholder="Enter Admin Email"
                                autoComplete="email"
                                required
                                className="input-glow w-full px-4 py-3 rounded-xl text-sm font-space"
                            />
                        </div>
                        <div>
                            <label className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="input-glow w-full px-4 py-3 pr-11 rounded-xl text-sm font-space"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPass ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="font-space text-xs text-red-400 flex items-center gap-1.5" role="alert">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary-gradient py-3 rounded-xl font-space font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ category, onClose }: { category: GalleryCategory; onClose: () => void }) {
    const [files, setFiles] = useState<{ file: File; preview: string; caption: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (selected: FileList | null) => {
        if (!selected) return;
        // Accept images (auto-compressed) and videos up to 50MB
        const arr = Array.from(selected).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
        const validArr = arr.filter(f => !f.type.startsWith('video/') || f.size <= 50 * 1024 * 1024);
        if (validArr.length < arr.length) {
            alert('Some videos were skipped because they exceed the 50MB limit.');
        }
        const mapped = await Promise.all(
            validArr.map(async (file) => ({
                file,
                preview: URL.createObjectURL(file),
                caption: '',
            }))
        );
        setFiles((prev) => [...prev, ...mapped]);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setProgress(0);
        for (let i = 0; i < files.length; i++) {
            const { file, caption } = files[i];
            const IMAGE_COMPRESS_THRESHOLD = 10 * 1024 * 1024; // 10 MB
            const data = file.type.startsWith('video/')
                ? await fileToDataURL(file)
                : file.size > IMAGE_COMPRESS_THRESHOLD
                    ? await compressImage(file)          // > 10MB → compress
                    : await fileToDataURL(file);         // ≤ 10MB → upload as-is
            const imagesRef = ref(rtdb, `gallery/${category.id}/images`);
            const newRef = push(imagesRef);
            await set(newRef, { data, caption: caption.trim(), uploadedAt: new Date().toISOString() });
            setProgress(Math.round(((i + 1) / files.length) * 100));
        }
        setUploading(false);
        setDone(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-[#0d1117] border border-cyan-500/20" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-orbitron font-bold text-lg text-white">Upload Photos to {category.name}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>
                {done ? (
                    <div className="text-center py-10">
                        <p className="text-white font-bold mb-4">Complete!</p>
                        <button onClick={onClose} className="btn-primary-gradient px-6 py-2 rounded-xl">Close</button>
                    </div>
                ) : (
                    <>
                        <button onClick={() => fileRef.current?.click()} className="w-full p-8 border-2 border-dashed border-slate-700 rounded-xl mb-4 text-slate-400">
                            Click to select photos or videos (Max 10MB per video)
                        </button>
                        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                        <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                            {files.map((f, i) => (
                                <div key={i} className="flex gap-3 p-2 bg-white/5 rounded-lg">
                                    {f.file.type.startsWith('video/') ? (
                                        <video src={f.preview} className="w-12 h-12 object-cover rounded bg-black" />
                                    ) : (
                                        <img src={f.preview} className="w-12 h-12 object-cover rounded" />
                                    )}
                                    <input type="text" placeholder="Caption" value={f.caption} onChange={(e) => setFiles(prev => prev.map((item, idx) => idx === i ? { ...item, caption: e.target.value } : item))} className="flex-1 bg-black/50 p-2 text-xs rounded" />
                                </div>
                            ))}
                        </div>
                        {uploading && <div className="text-cyan-400 text-xs text-center mb-2">Uploading: {progress}%</div>}
                        <button onClick={handleUpload} disabled={uploading || files.length === 0} className="w-full btn-primary-gradient py-3 rounded-xl disabled:opacity-50">
                            Upload {files.length} Files
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
    const [view, setView] = useState<'gallery' | 'registrations'>('gallery');
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCatName, setNewCatName] = useState('');
    const [showAddCat, setShowAddCat] = useState(false);
    const [uploadModal, setUploadModal] = useState<GalleryCategory | null>(null);
    const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'cat' | 'img' | 'reg'; id: string; catId?: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const galleryRef = ref(rtdb, 'gallery');
        const unsubGallery = onValue(galleryRef, (snap) => {
            const data = snap.val();
            if (!data) setCategories([]);
            else {
                const cats = Object.entries(data).map(([id, val]: any) => ({
                    id,
                    ...val,
                    images: val.images ? Object.entries(val.images).map(([imgId, img]: any) => ({ id: imgId, ...img })) : []
                }));
                setCategories(cats.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
            }
        });

        const regRef = ref(rtdb, 'registrations');
        const unsubReg = onValue(regRef, (snap) => {
            const data = snap.val();
            if (!data) setRegistrations([]);
            else {
                const regs = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
                setRegistrations(regs.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
            }
            setLoading(false);
        });

        return () => { unsubGallery(); unsubReg(); };
    }, []);

    const updateStatus = async (id: string, status: string) => {
        await update(ref(rtdb, `registrations/${id}`), { status });
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        const { type, id, catId } = deleteConfirm;
        if (type === 'cat') await remove(ref(rtdb, `gallery/${id}`));
        else if (type === 'img') await remove(ref(rtdb, `gallery/${catId}/images/${id}`));
        else if (type === 'reg') await remove(ref(rtdb, `registrations/${id}`));
        setDeleteConfirm(null);
    };

    const filteredRegs = registrations.filter(r =>
        (r.fullName && r.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.teamName && r.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.teamLeadName && r.teamLeadName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.phone && r.phone.includes(searchQuery)) ||
        (r.teamLeadPhone && r.teamLeadPhone.includes(searchQuery)) ||
        (r.collegeName && r.collegeName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/5 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <span className="font-orbitron font-black text-xl gradient-text-animated">SAMAGRA ADMIN</span>
                        <nav className="flex gap-1 bg-white/5 p-1 rounded-xl">
                            <button onClick={() => setView('gallery')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'gallery' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}>Gallery</button>
                            <button onClick={() => setView('registrations')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'registrations' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500'}`}>Registrations</button>
                        </nav>
                    </div>
                    <button onClick={onLogout} className="text-slate-500 hover:text-red-400 text-xs p-2">Logout</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">Loading Dashboard…</div>
                ) : view === 'gallery' ? (
                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-orbitron font-bold text-xl">Gallery Management</h2>
                            <button onClick={() => setShowAddCat(true)} className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold">+ New Category</button>
                        </div>

                        {showAddCat && (
                            <div className="flex gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Category Name" className="flex-1 bg-black/50 border border-white/10 p-2 rounded-xl text-sm" />
                                <button onClick={async () => {
                                    if (!newCatName.trim()) return;
                                    await set(push(ref(rtdb, 'gallery')), { name: newCatName.trim(), createdAt: new Date().toISOString() });
                                    setNewCatName(''); setShowAddCat(false);
                                }} className="bg-cyan-500 px-4 py-2 rounded-xl text-xs font-bold">Create</button>
                                <button onClick={() => setShowAddCat(false)} className="text-slate-500">Cancel</button>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpandedCats(prev => { const n = new Set(prev); if (n.has(cat.id)) n.delete(cat.id); else n.add(cat.id); return n; })}>
                                            <span className="text-slate-500">{expandedCats.has(cat.id) ? '▼' : '▶'}</span>
                                            <h3 className="font-bold">{cat.name}</h3>
                                            <span className="text-xs text-slate-500">{cat.images.length} photos</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setUploadModal(cat)} className="text-cyan-400 text-xs font-bold hover:underline">Add Photos</button>
                                            <button onClick={() => setDeleteConfirm({ type: 'cat', id: cat.id })} className="text-red-500 text-xs opacity-50 hover:opacity-100">Delete</button>
                                        </div>
                                    </div>
                                    {expandedCats.has(cat.id) && (
                                        <div className="p-4 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 border-t border-white/5">
                                            {cat.images.map(img => (
                                                <div key={img.id} className="relative group aspect-square bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
                                                    {img.data.startsWith('data:video/') ? (
                                                        <video src={img.data} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                                    ) : (
                                                        <img src={img.data} className="w-full h-full object-cover" />
                                                    )}
                                                    <button onClick={() => setDeleteConfirm({ type: 'img', id: img.id, catId: cat.id })} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="font-orbitron font-bold text-xl">Event Registrations</h2>
                            <div className="relative w-full sm:w-64">
                                <input type="text" placeholder="Search name, phone…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-sm pl-8" />
                                <span className="absolute left-2.5 top-2.5 opacity-30">🔍</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/10">
                                    <tr>
                                        <th className="p-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Team / Lead</th>
                                        <th className="p-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Events</th>
                                        <th className="p-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Payment</th>
                                        <th className="p-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                                        <th className="p-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredRegs.map(reg => (
                                        <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold">
                                                    {reg.teamName ? `${reg.teamName} (${reg.teamLeadName || reg.fullName})` : reg.fullName}
                                                </div>
                                                <div className="text-[11px] text-slate-500">{reg.collegeName}</div>
                                                <div className="text-[11px] text-cyan-500">{reg.teamLeadPhone || reg.phone}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {reg.events.map(e => <span key={e} className="bg-white/10 px-2 py-0.5 rounded text-[10px]">{e}</span>)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-xs uppercase text-slate-400">{reg.paymentMethod}</div>
                                                <div className="font-bold">₹{reg.totalAmount}</div>
                                                {reg.transactionId && <div className="text-[10px] font-mono text-purple-400">{reg.transactionId}</div>}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${reg.status === 'pending_verification' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    reg.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                                        reg.status === 'pay_at_venue' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20'
                                                    }`}>
                                                    {reg.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => setSelectedReg(reg)} className="text-cyan-400 font-bold hover:underline py-1">View</button>
                                                    <button onClick={() => setDeleteConfirm({ type: 'reg', id: reg.id })} className="text-red-500 opacity-50 hover:opacity-100 py-1">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* Registration Details Modal */}
            {selectedReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedReg(null)}>
                    <div className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 lg:p-10" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="font-orbitron font-black text-2xl text-white">Registration Details</h2>
                            <button onClick={() => setSelectedReg(null)} className="text-slate-500 hover:text-white text-2xl">✕</button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">{selectedReg.teamName ? 'Lead Name' : 'Full Name'}</label>
                                        <p className="text-sm font-semibold">{selectedReg.teamLeadName || selectedReg.fullName}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Phone</label>
                                        <p className="text-sm font-semibold text-cyan-400">{selectedReg.teamLeadPhone || selectedReg.phone}</p>
                                    </div>
                                    {selectedReg.teamName && (
                                        <div className="bg-white/5 p-4 rounded-2xl">
                                            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Team Name</label>
                                            <p className="text-sm font-semibold">{selectedReg.teamName}</p>
                                        </div>
                                    )}
                                    {selectedReg.numberOfParticipants && (
                                        <div className="bg-white/5 p-4 rounded-2xl">
                                            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Team Size</label>
                                            <p className="text-sm font-semibold">{selectedReg.numberOfParticipants} members</p>
                                        </div>
                                    )}
                                    <div className="bg-white/5 p-4 rounded-2xl col-span-2">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">College</label>
                                        <p className="text-sm font-semibold">{selectedReg.collegeName}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Payment Method</label>
                                        <p className="text-sm font-semibold uppercase">{selectedReg.paymentMethod}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Amount</label>
                                        <p className="text-sm font-semibold">₹{selectedReg.totalAmount}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl col-span-2">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Transaction ID</label>
                                        <p className="text-xs font-mono text-purple-400">{selectedReg.transactionId}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => updateStatus(selectedReg.id, 'verified')} className="flex-1 bg-green-500 h-10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-green-600 transition-colors">Verify Payment</button>
                                    <button onClick={() => updateStatus(selectedReg.id, 'pending_verification')} className="flex-1 border border-yellow-500/50 text-yellow-500 h-10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-500/10 transition-colors">Set Pending</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] text-slate-500 uppercase font-bold block">Payment Screenshot</label>
                                {selectedReg.screenshotBase64 ? (
                                    <div className="rounded-2xl overflow-hidden border border-white/10">
                                        <img src={selectedReg.screenshotBase64} alt="Screenshot" className="w-full h-auto" />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 text-sm border-2 border-dashed border-white/5">
                                        No screenshot uploaded
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90">
                    <div className="bg-[#0d1117] border border-red-500/20 p-8 rounded-3xl max-w-sm w-full text-center">
                        <div className="text-red-500 text-3xl mb-4">⚠️</div>
                        <h3 className="font-bold text-white mb-2 uppercase tracking-widest text-sm">Permanent Action</h3>
                        <p className="text-slate-400 text-xs mb-8">Are you sure you want to delete this {deleteConfirm.type === 'cat' ? 'category' : deleteConfirm.type === 'img' ? 'photo' : 'registration'}? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white/5 h-10 rounded-xl text-xs font-bold text-slate-400">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-500 h-10 rounded-xl text-xs font-bold text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {uploadModal && <UploadModal category={uploadModal} onClose={() => setUploadModal(null)} />}
        </div>
    );
}

export default function AdminPage() {
    const [authed, setAuthed] = useState<boolean | null>(null);
    useEffect(() => { setAuthed(sessionStorage.getItem('samagra_admin') === '1'); }, []);
    if (authed === null) return null;
    return authed ? <AdminDashboard onLogout={() => { sessionStorage.removeItem('samagra_admin'); setAuthed(false); }} /> : <LoginScreen onLogin={() => setAuthed(true)} />;
}
