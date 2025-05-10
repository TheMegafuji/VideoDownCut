import { Metadata } from 'next';
import HomeClient from './page-client';
import { homeMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return homeMetadata(params.locale);
}

export default function Home() {
  return <HomeClient />;
}
