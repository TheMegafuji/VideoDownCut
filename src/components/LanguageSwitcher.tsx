'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { locales } from '@/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Mount component on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = (newLocale: string) => {
    // Get the path without the locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Construct the new path with the new locale
    const newPath = `/${newLocale}${pathWithoutLocale || '/'}`;
    router.push(newPath);
  };

  // Render placeholder for server side
  // The structure is the same to avoid hydration mismatches
  if (!mounted) {
    return (
      <div className="flex space-x-2">
        {locales.map((l) => (
          <button
            key={l}
            className={`px-2 py-1 text-sm font-medium rounded ${
              l === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            aria-label={l === 'en' ? 'Switch to English' : 'Mudar para Português'}
            aria-hidden="true"
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 text-sm font-medium rounded ${
            locale === l ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          aria-label={l === 'en' ? 'Switch to English' : 'Mudar para Português'}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
