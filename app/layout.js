import './globals.css'
import { Providers } from './providers'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

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
      <body className={`${inter.variable} ${playfair.variable}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
