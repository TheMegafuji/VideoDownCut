import { Metadata } from 'next';

type SeoProps = {
  title: string;
  description: string;
  keywords?: string;
  locale: string;
  path: string;
  type?: 'website' | 'article';
  imageUrl?: string;
};

export function generateMetadata({
  title,
  description,
  keywords = '',
  locale,
  path,
  type = 'website',
  imageUrl = '/og-image.jpg',
}: SeoProps): Metadata {
  const url = `https://www.videodowncut.com/${path}`;
  const ogLocale = locale === 'en' ? 'en_US' : 'pt_BR';

  return {
    title,
    description,
    keywords,
    metadataBase: new URL('https://www.videodowncut.com'),
    alternates: {
      canonical: url,
      languages: {
        en: path.startsWith('en')
          ? url
          : `https://www.videodowncut.com/en/${path.replace(/^pt\//, '')}`,
        pt: path.startsWith('pt')
          ? url
          : `https://www.videodowncut.com/pt/${path.replace(/^en\//, '')}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'VideoDownCut',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: ogLocale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// Usage examples for each page
export const homeMetadata = (locale: string) => {
  const title =
    locale === 'en'
      ? 'VideoDownCut - Free Video Downloader & Cutter'
      : 'VideoDownCut - Download & Corte de Vídeos Online Gratuito';

  const description =
    locale === 'en'
      ? 'Free online tool to download videos from YouTube, Vimeo, Twitter and many websites, plus cut sections and convert to MP3.'
      : 'Ferramenta online gratuita para baixar vídeos do YouTube, Vimeo, Twitter e diversos sites, além de cortar trechos e converter para MP3.';

  const keywords =
    locale === 'en'
      ? 'video downloader, video cutter, mp3 converter, youtube downloader, online video editor'
      : 'download de vídeo, cortar vídeo, converter vídeo, youtube downloader, mp3 extractor, editor de vídeo online';

  return generateMetadata({
    title,
    description,
    keywords,
    locale,
    path: locale,
  });
};

export const termsMetadata = (locale: string) => {
  const title = locale === 'en' ? 'Terms of Use - VideoDownCut' : 'Termos de Uso - VideoDownCut';

  const description =
    locale === 'en'
      ? 'Terms and conditions for using VideoDownCut, the free online video downloader and editor.'
      : 'Termos e condições para uso do VideoDownCut, o serviço gratuito de download e edição de vídeos online.';

  return generateMetadata({
    title,
    description,
    locale,
    path: `${locale}/terms`,
  });
};

export const privacyMetadata = (locale: string) => {
  const title =
    locale === 'en' ? 'Privacy Policy - VideoDownCut' : 'Política de Privacidade - VideoDownCut';

  const description =
    locale === 'en'
      ? 'Privacy policy and data handling information for VideoDownCut video downloader service.'
      : 'Política de privacidade e informações sobre tratamento de dados do serviço de download de vídeos VideoDownCut.';

  return generateMetadata({
    title,
    description,
    locale,
    path: `${locale}/privacy`,
  });
};
