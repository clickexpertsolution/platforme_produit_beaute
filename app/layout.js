import './globals.css'
import { Providers } from './providers'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE, absoluteUrl } from '@/lib/site'
import { Archivo, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'

// Typographie du handoff : Archivo (UI), Instrument Serif (display),
// IBM Plex Mono (données / meta).
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-archivo',
  display: 'swap',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

// Métadonnées servies dans le HTML initial : c'est la seule chose que lisent les
// robots d'aperçu de lien (WhatsApp, Facebook, LinkedIn, X), qui n'exécutent pas
// le JavaScript. Les titres par route mis à jour côté client dans page.js les
// complètent pour l'utilisateur, sans les remplacer.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'skincare', 'soins de la peau', 'ingrédients cosmétiques', 'INCI',
    'comparateur de produits', 'routine visage', 'marques allemandes',
    'dermatologie', 'beauté', 'bien-être',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: '/' },
  // Aperçu de lien : WhatsApp lit og:title, og:description et og:image, et exige
  // une URL d'image absolue (metadataBase la résout).
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  // `max-image-preview: large` autorise Google à afficher la grande vignette
  // dans les résultats et dans Discover.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false },
}

export const viewport = {
  themeColor: '#F6F5F2',
  colorScheme: 'light',
}

// Données structurées : aident Google à rattacher le nom, le logo et le domaine
// à une même entité (panneau de connaissance, favicon dans les résultats).
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon-512.png'),
        width: 512,
        height: 512,
      },
      image: absoluteUrl(OG_IMAGE.url),
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: ['fr-FR', 'en-US'],
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className={`${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
