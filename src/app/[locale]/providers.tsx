'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';

export function Providers({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: any;
  children: ReactNode;
}) {
  // Use client-side only rendering to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only show the content once it's fully mounted on the client side
    setMounted(true);
  }, []);

  // This approach renders the provider during SSR but not the children
  // to avoid hydration mismatches while keeping the structure consistent
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="America/Sao_Paulo" // Set a fixed timezone to prevent hydration errors
      // Force the provider to skip hydration and reinitialize on client
      now={new Date()}
    >
      {mounted ? children : <div style={{ visibility: 'hidden', height: '100%' }}>{children}</div>}
    </NextIntlClientProvider>
  );
}
