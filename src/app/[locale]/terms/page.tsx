'use client';

import { Metadata } from 'next';
import { termsMetadata } from '@/lib/seo';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return termsMetadata(params.locale);
}

export default function TermsPage() {
  const t = useTranslations();
  const { locale } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Instead of returning null, render a hidden placeholder
  // This ensures the DOM structure is the same during SSR and CSR
  if (!mounted) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-8"
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
      >
        <div className="prose max-w-none">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('terms.title')}</h1>

      <div className="prose max-w-none">
        <p className="my-4">{t('terms.intro')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.contentOwnership.title')}</h2>
        <p>{t('terms.contentOwnership.text')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.usageLimitations.title')}</h2>
        <p>{t('terms.usageLimitations.text')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.prohibitedActivities.title')}</h2>
        <p>{t('terms.prohibitedActivities.text')}</p>

        <div className="mt-8">
          <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800">
            {t('navigation.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
