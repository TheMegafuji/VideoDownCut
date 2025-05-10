import 'server-only';
import { locales } from './config';

type Dictionary = {
  [key: string]: {
    [key: string]:
      | string
      | {
          [key: string]: string;
        };
  };
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Validate that locale is valid and exists in locales
  if (!locales.includes(locale as any)) {
    throw new Error(`Locale ${locale} not supported.`);
  }

  // Import the messages for the current locale
  const messages = (await import(`./messages/${locale}`)).default;
  return messages;
};
