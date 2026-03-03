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

// ─── IMAGE COMPRESSOR ────────────────────────────────────────────────────────
async function compressImage(file: File, maxPx = 1200, quality = 0.72): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
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
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 grid-bg opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="font-orbitron text-2xl font-black gradient-text-animated tracking-widest">SAMAGRA</span>
                    <p className="font-space text-xs text-slate-500 tracking-widest uppercase mt-1">Admin Dashboard · 2026</p>
                </div>

                {/* Card */}
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
                            <p className="font-space text-xs text-slate-500">Gallery management portal</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block font-space text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                placeholder="admin@samagra2026.com"
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
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                >
                                    {showPass ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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
                            {loading ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            )}
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center font-space text-xs text-slate-700 mt-6">
                    SAMAGRA 2026 · Faculty Admin Panel
                </p>
            </div>
        </div>
    );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({
    category,
    onClose,
}: {
    category: GalleryCategory;
    onClose: () => void;
}) {
    const [files, setFiles] = useState<{ file: File; preview: string; caption: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (selected: FileList | null) => {
        if (!selected) return;
        const arr = Array.from(selected).filter((f) => f.type.startsWith('image/'));
        const mapped = await Promise.all(
            arr.map(async (file) => ({
                file,
                preview: URL.createObjectURL(file),
                caption: '',
            }))
        );
        setFiles((prev) => [...prev, ...mapped]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const updateCaption = (index: number, caption: string) => {
        setFiles((prev) => prev.map((f, i) => i === index ? { ...f, caption } : f));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setProgress(0);

        for (let i = 0; i < files.length; i++) {
            const { file, caption } = files[i];
            const compressed = await compressImage(file);
            const imagesRef = ref(rtdb, `gallery/${category.id}/images`);
            const newRef = push(imagesRef);
            await set(newRef, {
                data: compressed,
                caption: caption.trim(),
                uploadedAt: new Date().toISOString(),
            });
            setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        setUploading(false);
        setDone(true);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
                style={{ background: '#0d1117', border: '1px solid rgba(0,212,255,0.2)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-orbitron font-bold text-lg text-white">Upload Photos</h2>
                        <p className="font-space text-xs text-slate-500 mt-0.5">to — {category.name}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {done ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-orbitron font-bold text-white text-lg mb-1">Upload Complete!</p>
                        <p className="font-space text-slate-400 text-sm mb-4">{files.length} photo{files.length !== 1 ? 's' : ''} added to {category.name}</p>
                        <button onClick={onClose} className="btn-primary-gradient px-6 py-2.5 rounded-xl font-space font-bold text-sm">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Drop zone */}
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 transition-all duration-200 text-center mb-4 cursor-pointer"
                            style={{ background: 'rgba(13,17,23,0.5)' }}
                        >
                            <svg className="w-10 h-10 mx-auto mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-space text-sm text-slate-400 mb-1">Click to select photos</p>
                            <p className="font-space text-xs text-slate-600">JPG, PNG, WEBP — Multiple allowed · Auto-compressed</p>
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

                        {/* Preview grid */}
                        {files.length > 0 && (
                            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <img src={f.preview} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-space text-xs text-slate-400 truncate mb-1.5">{f.file.name}</p>
                                            <input
                                                type="text"
                                                placeholder="Caption (optional)"
                                                value={f.caption}
                                                onChange={(e) => updateCaption(i, e.target.value)}
                                                className="input-glow w-full px-3 py-1.5 rounded-lg text-xs font-space"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="w-7 h-7 flex-shrink-0 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Progress bar */}
                        {uploading && (
                            <div className="mb-4">
                                <div className="flex justify-between font-space text-xs text-slate-500 mb-1.5">
                                    <span>Compressing & uploading…</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-space text-sm text-slate-400 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading || files.length === 0}
                                className="flex-1 btn-primary-gradient py-3 rounded-xl font-space font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                )}
                                Upload {files.length > 0 ? `(${files.length})` : ''}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCatName, setNewCatName] = useState('');
    const [addingCat, setAddingCat] = useState(false);
    const [showAddCat, setShowAddCat] = useState(false);
    const [uploadModal, setUploadModal] = useState<GalleryCategory | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'cat' | 'img'; catId: string; imgId?: string } | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editingCatName, setEditingCatName] = useState('');

    useEffect(() => {
        const galleryRef = ref(rtdb, 'gallery');
        const unsub = onValue(galleryRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) { setCategories([]); setLoading(false); return; }
            const cats: GalleryCategory[] = Object.entries(data).map(([id, val]: [string, unknown]) => {
                const cat = val as { name: string; createdAt: string; images?: Record<string, Omit<GalleryImage, 'id'>> };
                const images: GalleryImage[] = cat.images
                    ? Object.entries(cat.images).map(([imgId, img]) => ({ id: imgId, ...img }))
                    : [];
                return { id, name: cat.name, createdAt: cat.createdAt, images };
            });
            cats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setCategories(cats);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const addCategory = async () => {
        if (!newCatName.trim()) return;
        setAddingCat(true);
        const galleryRef = ref(rtdb, 'gallery');
        const newRef = push(galleryRef);
        await set(newRef, { name: newCatName.trim(), createdAt: new Date().toISOString() });
        setNewCatName('');
        setShowAddCat(false);
        setAddingCat(false);
    };

    const renameCategory = async (catId: string) => {
        if (!editingCatName.trim()) return;
        await update(ref(rtdb, `gallery/${catId}`), { name: editingCatName.trim() });
        setEditingCatId(null);
    };

    const deleteCategory = async (catId: string) => {
        setDeletingId(catId);
        await remove(ref(rtdb, `gallery/${catId}`));
        setDeletingId(null);
        setDeleteConfirm(null);
    };

    const deleteImage = async (catId: string, imgId: string) => {
        setDeletingId(imgId);
        await remove(ref(rtdb, `gallery/${catId}/images/${imgId}`));
        setDeletingId(null);
        setDeleteConfirm(null);
    };

    const toggleExpand = (catId: string) =>
        setExpandedCats((prev) => {
            const next = new Set(prev);
            next.has(catId) ? next.delete(catId) : next.add(catId);
            return next;
        });

    const totalImages = categories.reduce((s, c) => s + c.images.length, 0);

    return (
        <div className="min-h-screen" style={{ background: '#030712' }}>
            {/* Top bar */}
            <header className="sticky top-0 z-40 glass border-b border-cyan-500/10 px-4 sm:px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-orbitron font-bold text-sm text-white">Gallery Admin</span>
                            <p className="font-space text-[10px] text-slate-500 tracking-wider">SAMAGRA 2026</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/gallery" target="_blank"
                            className="hidden sm:flex items-center gap-1.5 font-space text-xs text-slate-400 hover:text-cyan-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Gallery
                        </Link>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1.5 font-space text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Categories', value: categories.length, color: '#00d4ff' },
                        { label: 'Total Photos', value: totalImages, color: '#7c3aed' },
                        { label: 'Status', value: 'Live', color: '#00ff88' },
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="font-orbitron font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="font-space text-xs text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Add Category */}
                <div className="mb-6">
                    {!showAddCat ? (
                        <button
                            onClick={() => setShowAddCat(true)}
                            className="flex items-center gap-2 btn-primary-gradient px-5 py-3 rounded-xl font-space font-bold text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Category
                        </button>
                    ) : (
                        <div className="flex gap-3 items-center p-4 rounded-2xl"
                            style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)' }}>
                            <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <input
                                type="text"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                                placeholder="Category name (e.g. Registration Day, Prize Distribution…)"
                                autoFocus
                                className="input-glow flex-1 px-4 py-2.5 rounded-xl text-sm font-space"
                            />
                            <button
                                onClick={addCategory}
                                disabled={addingCat || !newCatName.trim()}
                                className="btn-primary-gradient px-5 py-2.5 rounded-xl font-space font-bold text-sm disabled:opacity-50 whitespace-nowrap"
                            >
                                {addingCat ? 'Creating…' : 'Create'}
                            </button>
                            <button onClick={() => { setShowAddCat(false); setNewCatName(''); }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-24">
                        <svg className="w-8 h-8 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                )}

                {/* Empty */}
                {!loading && categories.length === 0 && (
                    <div className="text-center py-20">
                        <p className="font-space text-slate-500 text-sm">No categories yet. Create one above to get started!</p>
                    </div>
                )}

                {/* Category List */}
                <div className="space-y-4">
                    {categories.map((cat) => {
                        const isExpanded = expandedCats.has(cat.id);
                        return (
                            <div key={cat.id} className="rounded-2xl overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {/* Category header */}
                                <div className="flex items-center gap-3 px-5 py-4">
                                    <button
                                        onClick={() => toggleExpand(cat.id)}
                                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                    >
                                        <svg
                                            className="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200"
                                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {editingCatId === cat.id ? (
                                            <input
                                                type="text"
                                                value={editingCatName}
                                                onChange={(e) => setEditingCatName(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') renameCategory(cat.id); if (e.key === 'Escape') setEditingCatId(null); }}
                                                onClick={(e) => e.stopPropagation()}
                                                autoFocus
                                                className="input-glow flex-1 px-3 py-1.5 rounded-lg text-sm font-space"
                                            />
                                        ) : (
                                            <span className="font-orbitron font-bold text-base text-white truncate">{cat.name}</span>
                                        )}
                                        <span className="font-space text-xs text-slate-500 flex-shrink-0">
                                            {cat.images.length} photo{cat.images.length !== 1 ? 's' : ''}
                                        </span>
                                    </button>

                                    {/* Category actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {editingCatId === cat.id ? (
                                            <>
                                                <button onClick={() => renameCategory(cat.id)}
                                                    className="px-3 py-1.5 rounded-lg font-space text-xs font-bold text-green-400 hover:bg-green-500/10 transition-colors">
                                                    Save
                                                </button>
                                                <button onClick={() => setEditingCatId(null)}
                                                    className="px-3 py-1.5 rounded-lg font-space text-xs text-slate-500 hover:bg-white/5 transition-colors">
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setUploadModal(cat)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-space text-xs font-bold text-cyan-400 transition-colors hover:bg-cyan-400/10"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Add Photos
                                                </button>
                                                <button
                                                    onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                                                    aria-label="Rename category"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'cat', catId: cat.id })}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                                                    aria-label="Delete category"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Images grid (expanded) */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                                        {cat.images.length === 0 ? (
                                            <div className="flex items-center justify-center h-24 rounded-xl font-space text-sm text-slate-600"
                                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.05)' }}>
                                                No photos yet — click &quot;Add Photos&quot; above
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                                {cat.images.map((img) => (
                                                    <div key={img.id} className="relative group rounded-xl overflow-hidden"
                                                        style={{ aspectRatio: '1', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                        <img src={img.data} alt={img.caption || ''} className="w-full h-full object-cover" />
                                                        {/* Delete overlay */}
                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                                                            style={{ background: 'rgba(0,0,0,0.6)' }}>
                                                            <button
                                                                onClick={() => setDeleteConfirm({ type: 'img', catId: cat.id, imgId: img.id })}
                                                                className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                                                                aria-label="Delete image"
                                                            >
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        {img.caption && (
                                                            <div className="absolute bottom-0 left-0 right-0 px-2 py-1"
                                                                style={{ background: 'rgba(0,0,0,0.7)' }}>
                                                                <p className="font-space text-[9px] text-slate-300 truncate">{img.caption}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Upload Modal */}
            {uploadModal && (
                <UploadModal category={uploadModal} onClose={() => setUploadModal(null)} />
            )}

            {/* Delete Confirm Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="w-full max-w-sm p-6 rounded-2xl" style={{ background: '#0d1117', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="font-orbitron font-bold text-white text-center mb-2">
                            {deleteConfirm.type === 'cat' ? 'Delete Category?' : 'Delete Photo?'}
                        </h3>
                        <p className="font-space text-sm text-slate-400 text-center mb-6">
                            {deleteConfirm.type === 'cat'
                                ? 'This will permanently delete the category and all its photos.'
                                : 'This photo will be permanently removed.'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2.5 rounded-xl font-space text-sm text-slate-400"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteConfirm.type === 'cat'
                                    ? deleteCategory(deleteConfirm.catId)
                                    : deleteImage(deleteConfirm.catId, deleteConfirm.imgId!)
                                }
                                disabled={!!deletingId}
                                className="flex-1 py-2.5 rounded-xl font-space font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
                            >
                                {deletingId ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── PAGE ENTRY ──────────────────────────────────────────────────────────────
export default function AdminPage() {
    const [authed, setAuthed] = useState<boolean | null>(null);

    useEffect(() => {
        setAuthed(sessionStorage.getItem('samagra_admin') === '1');
    }, []);

    const handleLogin = () => setAuthed(true);
    const handleLogout = () => {
        sessionStorage.removeItem('samagra_admin');
        setAuthed(false);
    };

    if (authed === null) {
        return <div className="min-h-screen" style={{ background: '#030712' }} />;
    }

    return authed
        ? <AdminDashboard onLogout={handleLogout} />
        : <LoginScreen onLogin={handleLogin} />;
}
