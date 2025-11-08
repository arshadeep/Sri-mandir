import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/shared/Navigation';

export const metadata: Metadata = {
  title: 'Sri Mandir - Daily Devotion & Ritual Tracker',
  description: 'Track your daily devotional practices and build spiritual streaks',
  manifest: '/manifest.json',
  themeColor: '#ff6b35',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sri Mandir',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        <main className="min-h-screen pb-16">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
