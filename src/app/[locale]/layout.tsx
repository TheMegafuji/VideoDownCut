import '../globals.css';
import '../utilities.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { locales } from '@/config';
import { Providers } from './providers';
import Footer from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Default metadata (will be overridden by page-specific metadata)
export const metadata: Metadata = {
  title: 'VideoDownCut - Free Video Downloader & Cutter',
  description:
    'Free online tool to download videos from YouTube, Instagram, Twitter and many websites, plus cut sections and convert to MP3.',
  keywords:
    'video downloader, video cutter, mp3 converter, youtube downloader, online video editor',
  metadataBase: new URL('https://www.videodowncut.com'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      pt: '/pt',
    },
  },
  openGraph: {
    title: 'VideoDownCut - Free Video Downloader & Cutter',
    description:
      'Free online tool to download videos from YouTube, Instagram, Twitter and many websites, plus cut sections and convert to MP3.',
    url: 'https://www.videodowncut.com',
    siteName: 'VideoDownCut',
    images: [
      {
        url: 'https://www.videodowncut.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VideoDownCut - Video Downloader and Cutter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoDownCut - Free Video Downloader & Cutter',
    description:
      'Free online tool to download videos from YouTube, Instagram, Twitter and many websites, plus cut sections and convert to MP3.',
    images: ['https://www.videodowncut.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: { 'msvalidate.01': 'bing-verification-code' },
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}`)).default;
  } catch (error) {
    notFound();
  }

  // English description for structured data
  const description =
    'Free online tool to download videos from YouTube, Instagram, Twitter and many websites, plus cut sections and convert to MP3.';

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="canonical" href={`https://www.videodowncut.com/${locale}`} />
        {locales.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc}
            href={`https://www.videodowncut.com/${loc}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://www.videodowncut.com" />
        <meta name="theme-color" content="#3B82F6" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M3C5893DN4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M3C5893DN4');
          `}
        </Script>
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers locale={locale} messages={messages}>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <header className="bg-white shadow-sm relative">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center">
                  <Link href={`/${locale}`} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-500 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-900">VideoDownCut</h1>
                  </Link>
                </div>
                <nav className="flex items-center space-x-6">
                  <LanguageSwitcher />
                  <ul className="flex space-x-4">
                    <li>
                      <a
                        href="https://github.com/TheMegafuji/VideoDownCut"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        GitHub
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            <main className="flex-grow max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer locale={locale} />
          </div>
        </Providers>
        {/* Add structured data script for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'VideoDownCut',
              url: 'https://www.videodowncut.com',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: description,
            }),
          }}
        />
      </body>
    </html>
  );
}
