'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    color: string;
}

interface Connection {
    p1: Particle;
    p2: Particle;
    distance: number;
}

export function NeuralCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const colors = ['#00d4ff', '#7c3aed', '#00ff88', '#a78bfa'];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

        const initParticles = () => {
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 90);
            particlesRef.current = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2.5 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
        };

        const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r},${g},${b}`;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const particles = particlesRef.current;
            const mouse = mouseRef.current;
            const maxDist = 130;

            // Update & draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.vx += (dx / dist) * 0.05;
                    p.vy += (dy / dist) * 0.05;
                }

                // Dampen velocity
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Draw particle
                const rgb = hexToRgb(p.color);
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
                grad.addColorStop(0, `rgba(${rgb},${p.opacity})`);
                grad.addColorStop(1, `rgba(${rgb},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb},${p.opacity})`;
                ctx.fill();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach((p2) => {
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.35;
                        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        grad.addColorStop(0, `rgba(${hexToRgb(p1.color)},${alpha})`);
                        grad.addColorStop(1, `rgba(${hexToRgb(p2.color)},${alpha})`);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
            });

            animFrameRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animFrameRef.current);
            } else {
                draw();
            }
        };

        resize();
        draw();

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        />
    );
}
