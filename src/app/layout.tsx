import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrackFundAI — Intelligence for Alternative Investment Funds',
  description:
    'The intelligent operating system for Alternative Investment Funds. SEBI compliance, LP management, and AI-driven portfolio intelligence — built for India.',
  keywords: [
    'TrackFundAI',
    'AIF',
    'fund management',
    'SEBI compliance',
    'AI fund operations',
    'venture capital software',
    'portfolio intelligence',
    'GIFT City',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
