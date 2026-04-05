// ============================================================
// src/app/layout.js — Root Layout (সব page এ share হয়)
// ============================================================

import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io'),
  title: {
    default: 'Movie App — ফ্রি বাংলা হিন্দি হলিউড মুভি ডাউনলোড ও দেখুন',
    template: '%s | Movie App',
  },
  description:
    'বাংলা, হিন্দি, হলিউড, সাউথ ইন্ডিয়ান সব মুভি ও ওয়েব সিরিজ দেখুন। Hollywood, Bollywood, Bengali, South Indian, Korean, Anime সব category।',
  keywords: [
    'বাংলা মুভি', 'হিন্দি মুভি', 'হলিউড মুভি', 'ওয়েব সিরিজ',
    'movie app bangla', 'free movies online', 'bangla movie',
    'hindi movie online', 'hollywood movie', 'south indian movie',
  ],
  authors: [{ name: 'Movie App' }],
  creator: 'Movie App',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    siteName: 'Movie App',
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Bangladesh" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Movie App',
              alternateName: 'মুভি অ্যাপ',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              description: 'বাংলা, হিন্দি, হলিউড, সাউথ ইন্ডিয়ান সব মুভি দেখুন।',
              inLanguage: ['bn', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
