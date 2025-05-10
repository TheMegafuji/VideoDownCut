'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PrivacyPage() {
  const t = useTranslations();
  const { locale } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get collection items as array from translations
  const collectionItems = [
    t('privacy.infoCollection.items.0'),
    t('privacy.infoCollection.items.1'),
    t('privacy.infoCollection.items.2'),
  ];

  // Get usage items as array from translations
  const usageItems = [
    t('privacy.infoUsage.items.0'),
    t('privacy.infoUsage.items.1'),
    t('privacy.infoUsage.items.2'),
  ];

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
      <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>

      <div className="prose max-w-none">
        <p className="my-4">{t('privacy.intro')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.infoCollection.title')}</h2>
        <p>{t('privacy.infoCollection.text')}</p>
        <ul className="list-disc pl-6 my-3">
          {collectionItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.infoUsage.title')}</h2>
        <p>{t('privacy.infoUsage.text')}</p>
        <ul className="list-disc pl-6 my-3">
          {usageItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{t('privacy.infoUsage.additional')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.cookies.title')}</h2>
        <p>{t('privacy.cookies.text')}</p>

        <div className="mt-8">
          <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800">
            {t('navigation.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
