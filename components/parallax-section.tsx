'use client';

import { useEffect, useRef } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxSection({ children, className = '' }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const moveX = (x - rect.width / 2) * 0.02;
      const moveY = (y - rect.height / 2) * 0.02;

      sectionRef.current.style.setProperty('--mouse-x', `${moveX}px`);
      sectionRef.current.style.setProperty('--mouse-y', `${moveY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative transition-transform duration-200 ${className}`}
      style={{
        transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))',
      }}
    >
      {children}
    </div>
  );
}
