// Identité du site, partagée par les métadonnées, robots.txt, le sitemap et le
// manifeste.
//
// L'URL absolue est indispensable : WhatsApp, Facebook, LinkedIn et X refusent
// une `og:image` relative — l'aperçu s'affiche alors sans visuel. Elle est lue
// au moment du build (la page d'accueil est prérendue), donc la variable doit
// être présente à l'étape `yarn build`, pas seulement à l'exécution.
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.PUBLIC_APP_URL ||
  'https://lab.clickexpert.solutions'

export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, '')
export const SITE_NAME = 'Dermalyze'

export const SITE_TITLE = 'Dermalyze — La beauté & le bien-être allemands décryptés par la science'

// ~155 caractères : au-delà, Google tronque l'extrait dans ses résultats.
export const SITE_DESCRIPTION =
  'Analysez les ingrédients, comparez les produits et trouvez votre routine idéale. Un focus unique sur les marques allemandes de santé & beauté. FR/EN.'

// Visuel de partage (1200 × 630) : ratio 1.91:1 attendu par les aperçus de lien.
export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: SITE_TITLE,
}

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
