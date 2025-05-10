import { Metadata } from 'next';
import { termsMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return termsMetadata(params.locale);
}
