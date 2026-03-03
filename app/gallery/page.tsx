'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '@/lib/firebase';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type GalleryImage = {
    id: string;
    data: string;       // base64
    caption?: string;
    uploadedAt: string;
};

type GalleryCategory = {
    id: string;
    name: string;
    createdAt: string;
    images: GalleryImage[];
};

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({
    images,
    startIndex,
    categoryName,
    onClose,
}: {
    images: GalleryImage[];
    startIndex: number;
    categoryName: string;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState(startIndex);

    const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose, prev, next]);

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
        >
            {/* Close */}
            <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
                onClick={onClose}
                aria-label="Close lightbox"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 font-space text-xs text-slate-400 tracking-widest uppercase">
                {categoryName} · {current + 1} / {images.length}
            </div>

            {/* Prev */}
            {images.length > 1 && (
                <button
                    className="absolute left-4 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors z-10"
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    aria-label="Previous image"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Image */}
            <div className="relative max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
                <img
                    src={images[current].data}
                    alt={images[current].caption || `Image ${current + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                    style={{ boxShadow: '0 0 60px rgba(0,212,255,0.15)' }}
                />
                {images[current].caption && (
                    <p className="text-center font-space text-sm text-slate-400 mt-3">{images[current].caption}</p>
                )}
            </div>

            {/* Next */}
            {images.length > 1 && (
                <button
                    className="absolute right-4 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors z-10"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    aria-label="Next image"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xs overflow-x-auto px-2 py-1">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                            className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200"
                            style={{
                                border: i === current ? '2px solid #00d4ff' : '2px solid rgba(255,255,255,0.1)',
                                opacity: i === current ? 1 : 0.5,
                            }}
                            aria-label={`Go to image ${i + 1}`}
                        >
                            <img src={img.data} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── SKELETON CARD ───────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div
            className="rounded-xl overflow-hidden animate-pulse"
            style={{ background: 'rgba(255,255,255,0.05)', aspectRatio: '4/3' }}
        />
    );
}

// ─── MAIN GALLERY PAGE ───────────────────────────────────────────────────────
export default function GalleryPage() {
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; startIndex: number; name: string } | null>(null);

    useEffect(() => {
        const galleryRef = ref(rtdb, 'gallery');
        const unsub = onValue(galleryRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setCategories([]);
                setLoading(false);
                return;
            }
            const cats: GalleryCategory[] = Object.entries(data).map(([id, val]: [string, unknown]) => {
                const cat = val as { name: string; createdAt: string; images?: Record<string, Omit<GalleryImage, 'id'>> };
                const images: GalleryImage[] = cat.images
                    ? Object.entries(cat.images).map(([imgId, img]) => ({ id: imgId, ...img }))
                    : [];
                return { id, name: cat.name, createdAt: cat.createdAt, images };
            });
            // Sort by createdAt descending
            cats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setCategories(cats);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const totalImages = categories.reduce((s, c) => s + c.images.length, 0);

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-background" style={{ background: '#030712' }}>
                {/* ── Hero Banner ── */}
                <section className="relative pt-32 pb-16 overflow-hidden">
                    <div className="absolute inset-0" aria-hidden="true">
                        <div className="absolute inset-0 grid-bg opacity-10" />
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
                        />
                    </div>
                    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 font-space text-xs uppercase tracking-widest"
                            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Event Gallery
                        </div>
                        <h1 className="font-orbitron font-black text-4xl sm:text-5xl md:text-6xl mb-4">
                            <span className="gradient-text-cyan">SAMAGRA</span> 2026
                        </h1>
                        <p className="font-space text-slate-400 text-lg max-w-xl mx-auto mb-6">
                            Capturing every moment — registration, events, prizes &amp; more
                        </p>
                        {!loading && (
                            <div className="flex items-center justify-center gap-6">
                                <div className="text-center">
                                    <p className="font-orbitron font-bold text-2xl" style={{ color: '#00d4ff' }}>{categories.length}</p>
                                    <p className="font-space text-xs text-slate-500 uppercase tracking-wider">Categories</p>
                                </div>
                                <div className="w-px h-8" style={{ background: 'rgba(0,212,255,0.2)' }} />
                                <div className="text-center">
                                    <p className="font-orbitron font-bold text-2xl" style={{ color: '#7c3aed' }}>{totalImages}</p>
                                    <p className="font-space text-xs text-slate-500 uppercase tracking-wider">Photos</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Gallery Body ── */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">

                    {/* Loading */}
                    {loading && (
                        <div className="space-y-16">
                            {[1, 2].map((s) => (
                                <div key={s}>
                                    <div className="h-8 w-48 rounded-lg animate-pulse mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && categories.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                                style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
                            >
                                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="font-orbitron font-bold text-xl text-slate-400 mb-2">No Photos Yet</h2>
                            <p className="font-space text-slate-600 text-sm">Gallery will be updated after the event. Check back soon!</p>
                        </div>
                    )}

                    {/* Categories */}
                    {!loading && categories.map((cat) => (
                        <div key={cat.id} className="mb-20">
                            {/* Category heading */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex flex-col">
                                    <h2 className="font-orbitron font-bold text-2xl sm:text-3xl text-white">{cat.name}</h2>
                                    <p className="font-space text-xs text-slate-500 mt-1">{cat.images.length} photo{cat.images.length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.3), transparent)' }} />
                            </div>

                            {/* Empty category */}
                            {cat.images.length === 0 && (
                                <div
                                    className="flex items-center justify-center h-40 rounded-2xl font-space text-sm text-slate-600"
                                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)' }}
                                >
                                    No photos in this category yet
                                </div>
                            )}

                            {/* Image grid */}
                            {cat.images.length > 0 && (
                                <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                                    {cat.images.map((img, idx) => (
                                        <div
                                            key={img.id}
                                            className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
                                            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                                            onClick={() => setLightbox({ images: cat.images, startIndex: idx, name: cat.name })}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`View image ${idx + 1} in ${cat.name}`}
                                            onKeyDown={(e) => e.key === 'Enter' && setLightbox({ images: cat.images, startIndex: idx, name: cat.name })}
                                        >
                                            <img
                                                src={img.data}
                                                alt={img.caption || `${cat.name} photo ${idx + 1}`}
                                                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}>
                                                <div className="p-3 w-full">
                                                    {img.caption && (
                                                        <p className="font-space text-xs text-white truncate">{img.caption}</p>
                                                    )}
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                        <span className="font-space text-[10px] text-cyan-400">View</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* Back to home */}
                <div className="flex justify-center pb-16">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-space text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </main>

            {/* Lightbox */}
            {lightbox && (
                <Lightbox
                    images={lightbox.images}
                    startIndex={lightbox.startIndex}
                    categoryName={lightbox.name}
                    onClose={() => setLightbox(null)}
                />
            )}
        </>
    );
}
