'use client';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { EventCategories } from '@/components/event-categories';
import { ScheduleSection } from '@/components/schedule-section';
import { RegistrationForm } from '@/components/registration-form';
import { CoordinatorsSection } from '@/components/coordinators-section';
import { Footer } from '@/components/footer';
import { ScrollRevealInit } from '@/hooks/use-scroll-reveal';

export default function Home() {
  return (
    <>
      {/* Scroll reveal initializer */}
      <ScrollRevealInit />

      {/* Navigation */}
      <Navigation />

      <main className="relative bg-background text-foreground">
        {/* Hero */}
        <HeroSection />

        {/* Section divider */}
        <div className="section-divider" aria-hidden="true" />

        {/* About Prompt Engineering */}
        <AboutSection />

        <div className="section-divider" aria-hidden="true" />

        {/* Event Categories */}
        <EventCategories />

        <div className="section-divider" aria-hidden="true" />

        {/* Schedule */}
        <ScheduleSection />

        <div className="section-divider" aria-hidden="true" />

        {/* Registration */}
        <RegistrationForm />

        <div className="section-divider" aria-hidden="true" />

        {/* Coordinators */}
        <CoordinatorsSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
