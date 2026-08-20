// =============================================================================
// Données de démonstration — Avis clients, Questions/Réponses & Forum
// =============================================================================
// Contenu généré pour donner une impression de communauté active et crédible.
// Aucune donnée n'est ensemencée avec un _id/created_at ici : route.js assigne
// id (uuid), created_at (à partir de `days_ago`) et status='approved' à l'insert.
// =============================================================================

// Catégories du forum communautaire (libellés tri-lingues).
export const FORUM_CATEGORIES = [
  { id: 'routine', icon: 'ListChecks', fr: 'Routines & conseils', en: 'Routines & tips', ar: 'روتين ونصائح' },
  { id: 'ingredients', icon: 'FlaskConical', fr: 'Ingrédients & science', en: 'Ingredients & science', ar: 'المكوّنات والعلم' },
  { id: 'hair', icon: 'Scissors', fr: 'Cheveux & cuir chevelu', en: 'Hair & scalp', ar: 'الشعر وفروة الرأس' },
  { id: 'wellness', icon: 'HeartPulse', fr: 'Bien-être & compléments', en: 'Wellness & supplements', ar: 'العافية والمكمّلات' },
  { id: 'brands', icon: 'Building2', fr: 'Marques allemandes', en: 'German brands', ar: 'العلامات الألمانية' },
]

const NAMES = [
  'Sophie L.', 'Amélie R.', 'Karim B.', 'Julie M.', 'Thomas P.', 'Nadia K.', 'Claire D.',
  'Marc V.', 'Inès F.', 'Lucas G.', 'Fatima Z.', 'Camille T.', 'Antoine B.', 'Laura S.',
  'Yasmine H.', 'Émilie C.', 'Hugo D.', 'Sarah B.', 'Léa N.', 'Mehdi A.', 'Chloé P.',
  'Pauline R.', 'Nicolas L.', 'Sabrina M.', 'Vincent T.', 'Manon G.', 'Rachid O.', 'Elodie V.',
]

// Corpus de titres + corps d'avis, classés par ressenti (5/4 = positif, 3 = mitigé).
const POS_TITLES = [
  'Vraiment convaincue', 'Un incontournable', 'Excellent produit', 'Je recommande à 100%',
  'Résultats visibles', 'Ma peau adore', 'Parfait au quotidien', 'Rapport qualité-prix top',
  'Efficace et doux', 'Adopté définitivement',
]
const POS_BODIES = [
  "J'utilise ce produit depuis quelques semaines et la différence est nette. Texture agréable, il pénètre vite et ne laisse pas de film gras.",
  "Parfait pour ma peau sensible, aucune réaction. Je le rachèterai sans hésiter, c'est devenu un essentiel de ma routine.",
  "Formule sérieuse, on sent que c'est basé sur la science. Résultats visibles au bout d'un mois, ma peau est plus uniforme.",
  "Très bon produit allemand, sobre et efficace. Pas de parfum agressif, exactement ce que je cherchais.",
  "Je l'ai découvert grâce à cette plateforme et je ne regrette pas. La composition est clean et les résultats au rendez-vous.",
  "Excellent au quotidien. Un peu suffit, donc le tube dure longtemps. Ma peau est visiblement plus douce.",
  "Je confirme les avis positifs : hydratation durable et absorption rapide. Idéal matin et soir.",
]
const MID_TITLES = ['Correct sans plus', 'Bien mais...', 'Mitigé', 'Peut mieux faire']
const MID_BODIES = [
  "Produit correct mais je n'ai pas vu de résultat spectaculaire. La texture est agréable cela dit.",
  "Bien pour l'hydratation mais le parfum ne me convient pas totalement. À voir sur la durée.",
  "Efficace mais un peu cher pour ce que c'est. Je cherche une alternative dans la même gamme.",
]

// Génère `count` avis pour une cible, avec une majorité de 5/4 étoiles pour un
// score moyen crédible (~4.6-4.8), quelques avis vérifiés et des dates étalées.
function makeReviews(target_type, target_slug, count, seed = 0) {
  const out = []
  for (let i = 0; i < count; i++) {
    const k = seed + i
    const r = (k * 7) % 10
    const rating = r < 6 ? 5 : r < 9 ? 4 : 3 // ~60% 5*, ~30% 4*, ~10% 3*
    const positive = rating >= 4
    const titles = positive ? POS_TITLES : MID_TITLES
    const bodies = positive ? POS_BODIES : MID_BODIES
    out.push({
      target_type,
      target_slug,
      author_name: NAMES[(k * 3) % NAMES.length],
      rating,
      title: titles[k % titles.length],
      body: bodies[k % bodies.length],
      verified: (k % 3) !== 0, // ~2/3 vérifiés
      helpful: (k * 5) % 24,
      lang: 'fr',
      days_ago: 3 + ((k * 11) % 210),
    })
  }
  return out
}

// Cibles couvertes par les avis de démo (produits + marques + ingrédients).
const REVIEW_PLAN = [
  ['product', 'weleda-skin-food', 39],
  ['product', 'eucerin-hyaluron-filler-serum', 27],
  ['product', 'nivea-luminous630-serum', 22],
  ['product', 'sebamed-clear-face-gel', 18],
  ['product', 'eucerin-dermopure-serum', 15],
  ['product', 'alpecin-caffeine-shampoo-c1', 24],
  ['product', 'doppelherz-magnesium-400', 17],
  ['product', 'kneipp-huile-bain-relax', 12],
  ['brand', 'weleda', 14],
  ['brand', 'eucerin', 11],
  ['ingredient', 'niacinamide', 9],
  ['ingredient', 'retinol', 8],
]

export function buildReviews() {
  let seed = 1
  return REVIEW_PLAN.flatMap(([type, slug, n]) => {
    const rows = makeReviews(type, slug, n, seed)
    seed += n * 2 + 1
    return rows
  })
}

// ---- Questions / Réponses par produit ----------------------------------
const STAFF = 'Équipe Dermalyze'
export const SEED_QUESTIONS = [
  {
    product_slug: 'weleda-skin-food', author_name: 'Julie M.', lang: 'fr', days_ago: 40,
    body: "Est-ce que la Skin Food convient aussi pour le corps et les mains très sèches, ou uniquement le visage ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 39, body: "Oui, la Skin Food est polyvalente : visage, mains, coudes et talons. Sur le visage, une petite quantité suffit car la texture est riche." },
      { author_name: 'Marc V.', is_staff: false, lang: 'fr', days_ago: 38, body: "Je l'utilise sur les mains l'hiver, c'est radical contre les gerçures." },
    ],
  },
  {
    product_slug: 'weleda-skin-food', author_name: 'Karim B.', lang: 'fr', days_ago: 22,
    body: "La texture est-elle grasse ? J'ai la peau mixte et j'ai peur que ça brille.",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 21, body: "La texture est riche et donc plutôt destinée aux peaux sèches à normales. Sur peau mixte, réservez-la aux zones sèches (joues) plutôt qu'à la zone T." },
    ],
  },
  {
    product_slug: 'eucerin-hyaluron-filler-serum', author_name: 'Nadia K.', lang: 'fr', days_ago: 30,
    body: "Peut-on utiliser ce sérum matin ET soir, et avant ou après la crème hydratante ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 29, body: "Oui, matin et soir. On applique toujours le sérum AVANT la crème (du plus fluide au plus riche), sur peau propre." },
    ],
  },
  {
    product_slug: 'alpecin-caffeine-shampoo-c1', author_name: 'Thomas P.', lang: 'fr', days_ago: 18,
    body: "Faut-il laisser poser le shampoing quelques minutes pour que la caféine agisse ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 17, body: "Oui, le fabricant recommande de laisser agir environ 2 minutes avant de rincer, pour laisser le temps au complexe caféine d'atteindre le follicule." },
      { author_name: 'Mehdi A.', is_staff: false, lang: 'fr', days_ago: 16, body: "2 min chrono sous la douche, utilisé quotidiennement depuis 3 mois, je constate moins de chute." },
    ],
  },
  {
    product_slug: 'doppelherz-magnesium-400', author_name: 'Camille T.', lang: 'fr', days_ago: 12,
    body: "À quel moment de la journée vaut-il mieux prendre le magnésium ?",
    answers: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 11, body: "Le magnésium se prend indifféremment, mais beaucoup le prennent le soir car il favorise la détente musculaire. À prendre au cours d'un repas pour une meilleure tolérance digestive." },
    ],
  },
]

// ---- Forum communautaire : discussions + réponses ----------------------
export const FORUM_THREADS_SEED = [
  {
    category: 'routine', author_name: 'Sophie L.', lang: 'fr', days_ago: 26, pinned: true,
    title: "Par quel actif commencer quand on débute ?",
    body: "Bonjour à tous ! Je débute en skincare et je suis un peu perdue avec tous les actifs. On me conseille niacinamide, d'autres rétinol... par quoi commencer sans irriter ma peau ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 25, body: "Bienvenue ! La niacinamide est un excellent premier actif : polyvalente, bien tolérée, elle régule le sébum et unifie le teint. Le rétinol s'introduit plus tard, progressivement, et toujours avec un SPF le matin." },
      { author_name: 'Amélie R.', is_staff: false, lang: 'fr', days_ago: 24, body: "+1 pour la niacinamide. J'ai commencé avec 5% et zéro irritation. Le plus important au début c'est surtout : nettoyant doux + hydratant + SPF." },
      { author_name: 'Lucas G.', is_staff: false, lang: 'fr', days_ago: 20, body: "N'oublie pas d'introduire un seul actif à la fois pour repérer ce qui te réussit (ou pas)." },
    ],
  },
  {
    category: 'ingredients', author_name: 'Inès F.', lang: 'fr', days_ago: 19, pinned: false,
    title: "Niacinamide et vitamine C : vraiment incompatibles ?",
    body: "J'ai lu partout qu'il ne faut pas mélanger niacinamide et vitamine C. C'est vrai ou c'est un mythe ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 18, body: "C'est un mythe tenace ! Il repose sur des études des années 1960 dans des conditions non réalistes (hautes températures). Dans les formules modernes, les deux cohabitent très bien." },
      { author_name: 'Claire D.', is_staff: false, lang: 'fr', days_ago: 15, body: "Je les utilise ensemble tous les matins depuis un an, aucun souci et le teint est plus lumineux." },
    ],
  },
  {
    category: 'hair', author_name: 'Rachid O.', lang: 'fr', days_ago: 14, pinned: false,
    title: "Shampoing à la caféine : au bout de combien de temps voit-on un effet ?",
    body: "Je viens de commencer un shampoing à la caféine contre la chute. Réaliste d'espérer un résultat, et sous combien de temps ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 13, body: "Les preuves cliniques sont de niveau modéré : la caféine agit surtout en prévention/ralentissement sur la chute héréditaire, pas comme un traitement miracle. Comptez au moins 3 à 4 mois d'usage quotidien pour juger, le cycle du cheveu étant long." },
      { author_name: 'Vincent T.', is_staff: false, lang: 'fr', days_ago: 8, body: "3 mois ici, la chute a nettement diminué. À combiner avec le tonique sans rinçage pour un effet 24h." },
    ],
  },
  {
    category: 'wellness', author_name: 'Pauline R.', lang: 'fr', days_ago: 9, pinned: false,
    title: "Mélatonine vs valériane pour mieux dormir ?",
    body: "Entre la mélatonine en spray et la valériane, laquelle choisir pour des difficultés d'endormissement occasionnelles ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 8, body: "La mélatonine (1 mg) a une allégation EFSA reconnue pour réduire le temps d'endormissement — utile en cas de décalage horaire. La valériane relève d'un usage traditionnel, plutôt pour la détente. À éviter la mélatonine chez la femme enceinte." },
    ],
  },
  {
    category: 'brands', author_name: 'Laura S.', lang: 'fr', days_ago: 5, pinned: false,
    title: "Pourquoi les marques allemandes tiennent autant au pH 5.5 ?",
    body: "Je vois souvent 'pH 5.5' sur les produits Sebamed et Eucerin. Qu'est-ce que ça change concrètement ?",
    posts: [
      { author_name: STAFF, is_staff: true, lang: 'fr', days_ago: 4, body: "Le pH 5.5 correspond à celui du manteau acide protecteur de la peau. Respecter ce pH préserve la barrière cutanée et le microbiome, ce qui réduit sensibilité et irritations — d'où l'attachement des marques dermatologiques allemandes à cette valeur." },
      { author_name: 'Yasmine H.', is_staff: false, lang: 'fr', days_ago: 2, body: "Depuis que je suis passée à un nettoyant pH 5.5, fini les tiraillements après le lavage !" },
    ],
  },
]
