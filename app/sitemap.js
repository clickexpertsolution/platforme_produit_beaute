import { SITE_URL } from '@/lib/site'

// Sert /sitemap.xml.
//
// L'application navigue par fragment d'URL (`/#/products/mon-produit`) : pour un
// moteur de recherche, tout ce qui suit le `#` n'est pas une URL distincte et
// n'est jamais exploré séparément. La seule adresse réellement indexable est
// donc la racine ; y ajouter des liens en `/#/...` créerait des doublons de la
// page d'accueil. Rendre les fiches indexables demande de vraies routes Next
// (`app/produits/[slug]/page.js`), c'est-à-dire un changement de navigation.
export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
