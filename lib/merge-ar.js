// Fusionne la couche arabe (lib/content-ar.js) dans les documents de seed.
//
// Le contenu source reste bilingue FR/EN dans ses fichiers d'origine : on ne
// duplique donc rien, on ajoute seulement la clé `ar` aux champs multilingues.
// Chargé aussi bien par Next que par le backend Express — pas d'import React.

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

// `faqs` est un tableau d'objets { q: {fr,en}, a: {fr,en} } : la traduction est
// un tableau parallèle [{ q, a }], apparié par position.
export const mergeFaqs = (faqs, arFaqs) =>
  (faqs || []).map((f, i) => ({
    ...f,
    q: { ...(f.q || {}), ...(arFaqs?.[i]?.q ? { ar: arFaqs[i].q } : {}) },
    a: { ...(f.a || {}), ...(arFaqs?.[i]?.a ? { ar: arFaqs[i].a } : {}) },
  }))

export function mergeArItem(item, ar) {
  if (!ar) return item
  const out = { ...item }
  for (const key of Object.keys(ar)) {
    if (key === 'faqs') {
      out.faqs = mergeFaqs(item.faqs, ar.faqs)
      continue
    }
    const current = item[key]
    out[key] = isPlainObject(current) ? { ...current, ar: ar[key] } : { ar: ar[key] }
  }
  return out
}

// Fusionne une liste entière, appariée par `slug`.
export function mergeAr(list, arMap = {}) {
  return list.map((item) => mergeArItem(item, arMap[item.slug]))
}

// Champs multilingues dont on veut propager la clé `ar` vers une base déjà
// ensemencée : `$set` ciblé sur `champ.ar`, sans jamais toucher fr/en ni
// écraser le contenu saisi au back-office. `faqs` (tableau) est traité par
// mergeFaqs() côté appelant, à partir du document réellement stocké.
export function arUpdateSet(ar) {
  const set = {}
  for (const key of Object.keys(ar)) {
    if (key === 'faqs') continue
    set[`${key}.ar`] = ar[key]
  }
  return set
}
