'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState('2025'); // Default for SSR

  // Fix hydration issues by only rendering after component is mounted
  // and computing the year client-side
  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  // Define paths for the terms and privacy pages
  const termsPath = `/${locale}/terms`;
  const privacyPath = `/${locale}/privacy`;

  // Return the same structure for both mounted and unmounted states
  // Just hide content until mounted to prevent hydration issues
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-6">
          <div>
            <Link href={termsPath} className="text-gray-600 hover:text-gray-900">
              {mounted ? t('termsLink') : 'Terms'}
            </Link>
          </div>
          <div>
            <Link href={privacyPath} className="text-gray-600 hover:text-gray-900">
              {mounted ? t('privacyLink') : 'Privacy'}
            </Link>
          </div>
        </div>
        <p className="mt-3 max-w-2xl mx-auto">{mounted ? t('disclaimer') : ''}</p>
        <p className="mt-2">
          © {currentYear} VideoDownCut
          {mounted ? (
            <>
              -{t('licensedUnder')}
              <a
                href="https://opensource.org/licenses/MIT"
                className="underline hover:text-gray-900"
              >
                {t('mitLicense')}
              </a>
            </>
          ) : (
            <>
              - Licensed under
              <a
                href="https://opensource.org/licenses/MIT"
                className="underline hover:text-gray-900"
              >
                MIT License
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
