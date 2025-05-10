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

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'VideoDownCut - Video Downloader & Cutter',
  description: 'Download videos from any website and optionally cut them to your needs',
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

  return (
    <html lang={locale} className="h-full">
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
      </body>
    </html>
  );
}
