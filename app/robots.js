import { SITE_URL } from '@/lib/site'

// Sert /robots.txt. Les routes /api/* sont des données brutes : rien à indexer,
// et les laisser ouvertes gaspille le budget d'exploration.
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
