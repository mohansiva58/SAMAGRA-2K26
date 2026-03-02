'use client';

import { useEffect } from 'react';

export function useScrollReveal() {
    useEffect(() => {
        const observerOptions: IntersectionObserverInit = {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
        );
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}

export function ScrollRevealInit() {
    useScrollReveal();
    return null;
}
