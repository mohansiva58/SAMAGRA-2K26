import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030712',
};

export const metadata: Metadata = {
  title: 'SAMAGRA 2026 – Prompt Engineering | SRKR Engineering College',
  description:
    'SAMAGRA 2026 – National Level Prompt Engineering event at SRKR Engineering College. Technical Presentation & Project Expo organized by Dept. of CSD & CSIT. Register now!',
  keywords: ['SAMAGRA 2026', 'Prompt Engineering', 'SRKR Engineering College', 'Technical Presentation', 'Project Expo', 'CSD', 'CSIT', 'Bhimavaram', 'AI Event'],
  authors: [{ name: 'SRKR Engineering College, Dept. of CSD & CSIT' }],
  openGraph: {
    title: 'SAMAGRA 2026 – Prompt Engineering',
    description: 'National Level Event at SRKR Engineering College. Join us for Technical Presentation & Project Expo!',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-space antialiased bg-background text-foreground overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
