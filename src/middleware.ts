import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Path to next-intl.config.js (can be empty if stored at root)
  pathnames: {},

  // Auto-detect the user's locale from headers
  localeDetection: true,
});

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. favicon.ico)
  // - api paths
  // - _next paths
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
