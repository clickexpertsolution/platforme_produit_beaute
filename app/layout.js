import './globals.css'
import { Providers } from './providers'
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

export const metadata = {
  title: 'Dermalyze — Comparateur skincare transparent | Transparent skincare comparison',
  description: 'Analysez les ingrédients, comparez les produits skincare et trouvez votre routine idéale. Focus sur les marques dermatologiques allemandes. FR/EN.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className={`${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
