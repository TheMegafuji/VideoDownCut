import { redirect } from 'next/navigation';
import { defaultLocale } from '@/config';

export default function Home() {
  // Redirect to the default locale
  // This prevents duplicate rendering on the homepage
  redirect(`/${defaultLocale}`);
}
