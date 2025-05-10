import { Metadata } from 'next';
import { privacyMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return privacyMetadata(params.locale);
}
