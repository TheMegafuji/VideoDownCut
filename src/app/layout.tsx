import './globals.css';
import './utilities.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VideoDownCut - Video Downloader & Cutter',
  description: 'Download videos from any website and optionally cut them to your needs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // This is a simplified layout that just passes through to children
  // All the actual layout elements are in the [locale] layout
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
