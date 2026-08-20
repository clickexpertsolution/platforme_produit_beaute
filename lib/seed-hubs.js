// Bilingual content hubs — one per concern (15 total across 3 verticals)
export const SEED_HUBS = [
  // ================= SKINCARE =================
  {
    slug: 'acne', vertical: 'skincare',
    title: { fr: 'Acné & imperfections', en: 'Acne & blemishes' },
    definition: {
      fr: "L'acné est une maladie inflammatoire du follicule pilo-sébacé : excès de sébum, pores obstrués et prolifération de la bactérie C. acnes provoquent boutons, points noirs et microkystes. Elle touche 80% des adolescents mais aussi de nombreux adultes, surtout les femmes.",
      en: "Acne is an inflammatory disease of the pilosebaceous follicle: excess sebum, clogged pores and proliferation of the C. acnes bacterium cause pimples, blackheads and microcysts. It affects 80% of teenagers but also many adults, especially women.",
    },
    causes: {
      fr: ['Surproduction de sébum (hormones, stress, génétique)', 'Hyperkératinisation qui obstrue les pores', 'Prolifération de la bactérie Cutibacterium acnes', 'Cosmétiques comédogènes ou nettoyage trop agressif'],
      en: ['Sebum overproduction (hormones, stress, genetics)', 'Hyperkeratinization that clogs pores', 'Proliferation of the Cutibacterium acnes bacterium', 'Comedogenic cosmetics or over-aggressive cleansing'],
    },
    mistakes: {
      fr: ["Décaper la peau avec des nettoyants agressifs : elle produit encore plus de sébum en réaction", 'Percer les boutons, ce qui aggrave l’inflammation et laisse des marques', "Zapper l'hydratation par peur de « graisser » la peau", 'Cumuler trop d’actifs exfoliants en même temps'],
      en: ['Stripping the skin with harsh cleansers: it produces even more sebum in reaction', 'Popping pimples, which worsens inflammation and leaves marks', 'Skipping moisturizer for fear of "greasing" the skin', 'Stacking too many exfoliating actives at once'],
    },
    buying_guide: {
      fr: ["Un nettoyant doux sans savon au pH 5.5, matin et soir", "Un sérum à l'acide salicylique (0,5-2%) ou à la niacinamide (5%)", 'Une crème hydratante légère non comédogène', 'Un SPF 50 toucher sec spécial peaux grasses — indispensable avec les actifs exfoliants'],
      en: ['A gentle soap-free cleanser at pH 5.5, morning and evening', 'A serum with salicylic acid (0.5-2%) or niacinamide (5%)', 'A lightweight non-comedogenic moisturizer', 'A dry-touch SPF 50 for oily skin — essential when using exfoliating actives'],
    },
    key_ingredients: ['acide-salicylique', 'niacinamide', 'zinc-pca'],
    faqs: [
      { q: { fr: "Le chocolat donne-t-il de l'acné ?", en: 'Does chocolate cause acne?' }, a: { fr: "Aucune étude solide ne l'a démontré. En revanche, les aliments à index glycémique élevé et les produits laitiers écrémés sont associés à une aggravation chez certaines personnes.", en: 'No solid study has proven it. However, high-glycemic foods and skimmed dairy products are associated with worsening in some people.' } },
      { q: { fr: 'Combien de temps avant de voir des résultats ?', en: 'How long before seeing results?' }, a: { fr: "Comptez 6 à 8 semaines de routine régulière. L'acné peut sembler empirer les 2 premières semaines (purge) avec les actifs exfoliants — c'est normal.", en: 'Allow 6 to 8 weeks of consistent routine. Acne may seem to worsen in the first 2 weeks (purging) with exfoliating actives — this is normal.' } },
      { q: { fr: 'Quand consulter un dermatologue ?', en: 'When to see a dermatologist?' }, a: { fr: "Si l'acné est kystique, douloureuse, laisse des cicatrices ou résiste à 3 mois de soins bien conduits : des traitements sur ordonnance existent.", en: 'If acne is cystic, painful, scarring or resistant to 3 months of well-conducted care: prescription treatments exist.' } },
    ],
  },
  {
    slug: 'sensitive', vertical: 'skincare',
    title: { fr: 'Peau sensible', en: 'Sensitive skin' },
    definition: {
      fr: "La peau sensible n'est pas un type de peau mais un état de réactivité excessive : rougeurs, tiraillements, picotements face au froid, aux cosmétiques ou au stress. La cause principale est une barrière cutanée fragilisée qui laisse pénétrer les irritants.",
      en: 'Sensitive skin is not a skin type but a state of excessive reactivity: redness, tightness, tingling in response to cold, cosmetics or stress. The main cause is a weakened skin barrier that lets irritants in.',
    },
    causes: {
      fr: ['Barrière cutanée altérée (céramides et lipides insuffisants)', 'Nettoyants trop détergents ou eau calcaire', 'Parfums, alcool et huiles essentielles dans les cosmétiques', 'Facteurs internes : stress, hormones, rosacée sous-jacente'],
      en: ['Impaired skin barrier (insufficient ceramides and lipids)', 'Over-detergent cleansers or hard water', 'Fragrance, alcohol and essential oils in cosmetics', 'Internal factors: stress, hormones, underlying rosacea'],
    },
    mistakes: {
      fr: ['Multiplier les nouveaux produits sans période de test', 'Exfolier une peau déjà irritée', "Utiliser de l'eau très chaude pour se nettoyer le visage", 'Choisir des produits « naturels » riches en huiles essentielles irritantes'],
      en: ['Trying multiple new products without a test period', 'Exfoliating already irritated skin', 'Washing the face with very hot water', 'Choosing "natural" products rich in irritating essential oils'],
    },
    buying_guide: {
      fr: ['Formules courtes, sans parfum ni alcool dénaturé', 'pH physiologique 5.5 pour préserver le manteau acide', 'Actifs réparateurs : panthénol, céramides, aloe vera', 'La mention « testé sur peaux sensibles » des marques dermatologiques allemandes'],
      en: ['Short formulas, without fragrance or denatured alcohol', 'Physiological pH 5.5 to preserve the acid mantle', 'Repairing actives: panthenol, ceramides, aloe vera', 'The "tested on sensitive skin" label from German dermatological brands'],
    },
    key_ingredients: ['panthenol', 'ceramides', 'aloe-vera'],
    faqs: [
      { q: { fr: 'Peau sensible ou peau allergique : quelle différence ?', en: 'Sensitive vs allergic skin: what is the difference?' }, a: { fr: "La sensibilité est une réactivité non spécifique (picotements, échauffements). L'allergie est une réaction immunitaire à un ingrédient précis (eczéma de contact). En cas de doute, un allergologue peut faire des tests épicutanés.", en: 'Sensitivity is a non-specific reactivity (tingling, burning). Allergy is an immune reaction to a specific ingredient (contact eczema). When in doubt, an allergist can perform patch tests.' } },
      { q: { fr: 'Comment tester un nouveau produit ?', en: 'How to test a new product?' }, a: { fr: "Appliquez-le 3 soirs de suite dans le pli du coude ou derrière l'oreille. Sans réaction après 72h, introduisez-le seul dans votre routine.", en: 'Apply it 3 evenings in a row on the inner elbow or behind the ear. If no reaction after 72h, introduce it alone into your routine.' } },
      { q: { fr: 'Le pH 5.5 est-il vraiment important ?', en: 'Does pH 5.5 really matter?' }, a: { fr: "Oui : le manteau acide (pH 4,7-5,7) protège des bactéries et limite la perte en eau. Les savons classiques (pH 9-10) le neutralisent pendant plusieurs heures — d'où la règle pH 5.5 popularisée par Sebamed.", en: 'Yes: the acid mantle (pH 4.7-5.7) protects against bacteria and limits water loss. Classic soaps (pH 9-10) neutralize it for several hours — hence the pH 5.5 rule popularized by Sebamed.' } },
    ],
  },
  {
    slug: 'aging', vertical: 'skincare',
    title: { fr: 'Anti-âge', en: 'Anti-aging' },
    definition: {
      fr: "Le vieillissement cutané combine facteurs internes (chute du collagène de 1%/an dès 25 ans) et externes — le soleil cause à lui seul 80% du vieillissement visible. Rides, perte de fermeté et taches peuvent être ralenties par des actifs prouvés.",
      en: 'Skin aging combines internal factors (collagen drops 1%/year from age 25) and external ones — the sun alone causes 80% of visible aging. Wrinkles, loss of firmness and spots can be slowed by proven actives.',
    },
    causes: {
      fr: ['Exposition UV cumulée (photo-vieillissement)', 'Diminution naturelle du collagène et de l’élastine', 'Stress oxydatif : pollution, tabac, sucre', 'Déshydratation chronique qui accentue les ridules'],
      en: ['Cumulative UV exposure (photo-aging)', 'Natural decline of collagen and elastin', 'Oxidative stress: pollution, smoking, sugar', 'Chronic dehydration that accentuates fine lines'],
    },
    mistakes: {
      fr: ['Investir dans des crèmes chères mais négliger le SPF quotidien', 'Commencer le rétinol à trop forte dose et abandonner à la première irritation', 'Attendre les rides installées pour agir : la prévention prime', 'Négliger cou et mains, qui trahissent l’âge en premier'],
      en: ['Investing in expensive creams while neglecting daily SPF', 'Starting retinol at too high a dose and quitting at the first irritation', 'Waiting for established wrinkles before acting: prevention comes first', 'Neglecting neck and hands, which show age first'],
    },
    buying_guide: {
      fr: ['Le trio prouvé : SPF 50 le matin, vitamine C antioxydante, rétinol le soir', "L'acide hyaluronique pour repulper immédiatement les ridules", 'Le Q10, antioxydant bien toléré popularisé par la recherche allemande', 'Introduire le rétinol progressivement : 2 soirs/semaine puis augmenter'],
      en: ['The proven trio: SPF 50 in the morning, antioxidant vitamin C, retinol at night', 'Hyaluronic acid to instantly plump fine lines', 'Q10, a well-tolerated antioxidant popularized by German research', 'Introduce retinol gradually: 2 nights/week then increase'],
    },
    key_ingredients: ['retinol', 'vitamine-c', 'acide-hyaluronique', 'coenzyme-q10'],
    faqs: [
      { q: { fr: 'À quel âge commencer une routine anti-âge ?', en: 'At what age should I start an anti-aging routine?' }, a: { fr: "La protection solaire quotidienne se commence dès l'adolescence. Les antioxydants (vitamine C, Q10) dès 25 ans, le rétinol vers 28-30 ans en prévention.", en: 'Daily sun protection should start in adolescence. Antioxidants (vitamin C, Q10) from age 25, retinol around 28-30 as prevention.' } },
      { q: { fr: 'Le rétinol est-il compatible avec une peau sensible ?', en: 'Is retinol compatible with sensitive skin?' }, a: { fr: 'Oui, avec la méthode « sandwich » : crème hydratante, puis rétinol faiblement dosé, puis crème. Commencez 1 à 2 soirs par semaine et augmentez selon la tolérance.', en: 'Yes, with the "sandwich" method: moisturizer, then low-dose retinol, then moisturizer. Start 1-2 nights a week and increase as tolerated.' } },
      { q: { fr: 'Les crèmes peuvent-elles vraiment effacer les rides ?', en: 'Can creams really erase wrinkles?' }, a: { fr: "Elles atténuent les rides superficielles et préviennent leur aggravation (rétinol, preuves solides). Les rides profondes d'expression relèvent de la médecine esthétique.", en: 'They soften superficial wrinkles and prevent worsening (retinol, strong evidence). Deep expression lines are a matter for aesthetic medicine.' } },
    ],
  },
  {
    slug: 'dryness', vertical: 'skincare',
    title: { fr: 'Sécheresse cutanée', en: 'Dry skin' },
    definition: {
      fr: "La peau sèche manque de lipides (sébum, céramides) et laisse s'évaporer l'eau : tiraillements, rugosités, desquamation. À distinguer de la peau déshydratée, qui manque d'eau et peut toucher même les peaux grasses.",
      en: 'Dry skin lacks lipids (sebum, ceramides) and lets water evaporate: tightness, roughness, flaking. Not to be confused with dehydrated skin, which lacks water and can affect even oily skin.',
    },
    causes: {
      fr: ['Barrière lipidique appauvrie (génétique, âge)', 'Chauffage, climatisation et douches trop chaudes', 'Nettoyants moussants détergents', 'Climat : froid sec en hiver, soleil en été'],
      en: ['Depleted lipid barrier (genetics, age)', 'Heating, air conditioning and overly hot showers', 'Detergent foaming cleansers', 'Climate: dry cold in winter, sun in summer'],
    },
    mistakes: {
      fr: ["Boire plus d'eau en pensant que cela hydrate la peau directement", 'Multiplier les gommages pour éliminer les squames', 'Utiliser une crème trop légère en hiver', "Se doucher à l'eau très chaude, qui dissout le film lipidique"],
      en: ['Drinking more water thinking it directly hydrates the skin', 'Over-exfoliating to remove flakes', 'Using a cream that is too light in winter', 'Showering with very hot water, which dissolves the lipid film'],
    },
    buying_guide: {
      fr: ['Associer humectants (glycérine, acide hyaluronique, urée) et occlusifs (beurres, squalane)', 'Chercher les céramides, ciment naturel de la barrière', 'Nettoyant lait ou crème plutôt que gel moussant', "L'urée à 5-10%, spécialité des marques dermatologiques allemandes"],
      en: ['Combine humectants (glycerin, hyaluronic acid, urea) and occlusives (butters, squalane)', 'Look for ceramides, the natural cement of the barrier', 'Milk or cream cleanser rather than foaming gel', 'Urea at 5-10%, a specialty of German dermatological brands'],
    },
    key_ingredients: ['acide-hyaluronique', 'ceramides', 'uree', 'squalane', 'glycerine'],
    faqs: [
      { q: { fr: 'Peau sèche ou déshydratée : comment savoir ?', en: 'Dry or dehydrated skin: how to tell?' }, a: { fr: 'La peau sèche est un type permanent (fine, pores invisibles, inconfort constant). La déshydratation est temporaire : ridules de surface et tiraillements, même sur peau mixte. La déshydratée a besoin d’eau, la sèche a aussi besoin de gras.', en: 'Dry skin is a permanent type (thin, invisible pores, constant discomfort). Dehydration is temporary: surface lines and tightness, even on combination skin. Dehydrated needs water; dry also needs lipids.' } },
      { q: { fr: "L'acide hyaluronique suffit-il pour une peau sèche ?", en: 'Is hyaluronic acid enough for dry skin?' }, a: { fr: "Non : c'est un humectant qui attire l'eau, mais sans occlusif par-dessus (crème riche, squalane), l'eau s'évapore. Toujours sceller l'hydratation.", en: 'No: it is a humectant that attracts water, but without an occlusive on top (rich cream, squalane), the water evaporates. Always seal in hydration.' } },
      { q: { fr: 'Pourquoi ma peau est-elle plus sèche en hiver ?', en: 'Why is my skin drier in winter?' }, a: { fr: "Froid + vent + chauffage abaissent l'humidité ambiante et la production de sébum. Passez à une crème plus riche et évitez les douches brûlantes.", en: 'Cold + wind + heating lower ambient humidity and sebum production. Switch to a richer cream and avoid scalding showers.' } },
    ],
  },
  {
    slug: 'oily', vertical: 'skincare',
    title: { fr: 'Peau grasse', en: 'Oily skin' },
    definition: {
      fr: 'La peau grasse produit un excès de sébum : brillance dès la mi-journée, pores dilatés, tendance aux imperfections. Bien prise en charge, elle a un avantage : elle vieillit plus lentement que la peau sèche.',
      en: 'Oily skin produces excess sebum: midday shine, enlarged pores, blemish tendency. Properly managed, it has one advantage: it ages more slowly than dry skin.',
    },
    causes: {
      fr: ['Hormones androgènes qui stimulent les glandes sébacées', 'Génétique et climat chaud/humide', 'Déshydratation : la peau surcompense en sébum', 'Produits trop décapants qui provoquent un effet rebond'],
      en: ['Androgen hormones stimulating sebaceous glands', 'Genetics and hot/humid climate', 'Dehydration: the skin overcompensates with sebum', 'Over-stripping products causing a rebound effect'],
    },
    mistakes: {
      fr: ['Se nettoyer le visage plus de deux fois par jour', "Sauter la crème hydratante : la peau grasse a besoin d'eau", "Abuser des lingettes matifiantes et de l'alcool", 'Choisir un SPF gras non adapté, qui obstrue les pores'],
      en: ['Cleansing the face more than twice a day', 'Skipping moisturizer: oily skin needs water', 'Overusing mattifying wipes and alcohol', 'Choosing an unsuitable greasy SPF that clogs pores'],
    },
    buying_guide: {
      fr: ['Gel nettoyant doux pH 5.5 sans savon', 'Niacinamide 5% ou zinc PCA pour réguler le sébum', 'Hydratant texture gel ou fluide non comédogène', 'SPF 50 toucher sec avec effet matifiant longue durée'],
      en: ['Gentle soap-free pH 5.5 cleansing gel', 'Niacinamide 5% or zinc PCA to regulate sebum', 'Non-comedogenic gel or fluid moisturizer', 'Dry-touch SPF 50 with long-lasting mattifying effect'],
    },
    key_ingredients: ['niacinamide', 'zinc-pca', 'acide-salicylique'],
    faqs: [
      { q: { fr: 'Faut-il hydrater une peau grasse ?', en: 'Should oily skin be moisturized?' }, a: { fr: "Absolument. Une peau grasse déshydratée produit encore plus de sébum pour compenser. Choisissez une texture gel légère avec glycérine ou acide hyaluronique.", en: 'Absolutely. Dehydrated oily skin produces even more sebum to compensate. Choose a light gel texture with glycerin or hyaluronic acid.' } },
      { q: { fr: 'Peut-on resserrer les pores dilatés ?', en: 'Can enlarged pores be tightened?' }, a: { fr: 'Leur taille est en partie génétique, mais on peut les rendre moins visibles : BHA pour les désobstruer, niacinamide pour réguler le sébum, SPF pour éviter leur relâchement.', en: 'Their size is partly genetic, but they can look smaller: BHA to unclog them, niacinamide to regulate sebum, SPF to prevent sagging.' } },
      { q: { fr: 'La peau grasse vieillit-elle vraiment moins vite ?', en: 'Does oily skin really age more slowly?' }, a: { fr: 'Le film lipidique plus épais protège mieux de la déshydratation et les rides apparaissent plus tard. En revanche, elle reste aussi vulnérable aux UV et aux taches.', en: 'The thicker lipid film protects better against dehydration and wrinkles appear later. However, it remains just as vulnerable to UV and dark spots.' } },
    ],
  },
  {
    slug: 'pigmentation', vertical: 'skincare',
    title: { fr: 'Taches pigmentaires', en: 'Dark spots' },
    definition: {
      fr: "Les hyperpigmentations sont des dépôts localisés de mélanine : taches solaires, masque de grossesse (mélasma) ou marques post-inflammatoires laissées par l'acné. Fréquentes sur les peaux mates à foncées, elles exigent patience et protection solaire stricte.",
      en: 'Hyperpigmentation is a localized deposit of melanin: sun spots, pregnancy mask (melasma) or post-inflammatory marks left by acne. Common on medium to dark skin tones, it requires patience and strict sun protection.',
    },
    causes: {
      fr: ["Exposition UV qui stimule la mélanine", 'Inflammation post-acné ou post-lésion', 'Hormones : pilule, grossesse (mélasma)', 'Frottements répétés et parfums photosensibilisants'],
      en: ['UV exposure stimulating melanin', 'Post-acne or post-lesion inflammation', 'Hormones: contraceptive pill, pregnancy (melasma)', 'Repeated friction and photosensitizing fragrances'],
    },
    mistakes: {
      fr: ['Traiter les taches sans SPF quotidien : elles reviennent systématiquement', 'Utiliser du citron ou des recettes maison irritantes', 'Attendre des résultats en moins de 8 semaines', 'Gommer agressivement, ce qui aggrave l’inflammation'],
      en: ['Treating spots without daily SPF: they systematically come back', 'Using lemon or irritating home remedies', 'Expecting results in under 8 weeks', 'Aggressive scrubbing, which worsens inflammation'],
    },
    buying_guide: {
      fr: ['SPF 50 quotidien, réappliqué en cas d’exposition — non négociable', 'Vitamine C le matin pour unifier et protéger', 'Niacinamide ou Thiamidol (breveté par Beiersdorf) pour bloquer le transfert de mélanine', 'Rétinol le soir pour accélérer le renouvellement'],
      en: ['Daily SPF 50, reapplied when exposed — non-negotiable', 'Vitamin C in the morning to even out and protect', 'Niacinamide or Thiamidol (patented by Beiersdorf) to block melanin transfer', 'Retinol at night to speed up renewal'],
    },
    key_ingredients: ['vitamine-c', 'niacinamide', 'retinol'],
    faqs: [
      { q: { fr: 'Combien de temps pour estomper une tache ?', en: 'How long to fade a dark spot?' }, a: { fr: 'Comptez 8 à 12 semaines pour les marques récentes, plusieurs mois pour les taches anciennes ou le mélasma. La régularité et le SPF font toute la différence.', en: 'Allow 8 to 12 weeks for recent marks, several months for old spots or melasma. Consistency and SPF make all the difference.' } },
      { q: { fr: 'Pourquoi le SPF est-il indispensable ?', en: 'Why is SPF essential?' }, a: { fr: 'Les UV réactivent la production de mélanine en quelques minutes : sans protection, chaque exposition efface des semaines de traitement éclaircissant.', en: 'UV reactivates melanin production within minutes: without protection, each exposure erases weeks of brightening treatment.' } },
      { q: { fr: "Qu'est-ce que le Thiamidol ?", en: 'What is Thiamidol?' }, a: { fr: "Un actif breveté par Beiersdorf (Eucerin) après 10 ans de recherche : il inhibe la tyrosinase, enzyme clé de la production de mélanine. Résultats cliniques visibles dès 2 semaines.", en: 'An active patented by Beiersdorf (Eucerin) after 10 years of research: it inhibits tyrosinase, the key enzyme in melanin production. Clinical results visible from 2 weeks.' } },
    ],
  },
  // ================= HAIR & SCALP =================
  {
    slug: 'hair-loss', vertical: 'hair',
    title: { fr: 'Chute de cheveux', en: 'Hair loss' },
    definition: {
      fr: "Perdre 50 à 100 cheveux par jour est normal. Au-delà, on distingue la chute réactionnelle (stress, carence, post-partum, saisonnière) de l'alopécie androgénétique, progressive et hormonale, qui touche 70% des hommes et 40% des femmes au cours de la vie.",
      en: 'Losing 50 to 100 hairs a day is normal. Beyond that, we distinguish reactive shedding (stress, deficiency, postpartum, seasonal) from androgenetic alopecia, progressive and hormonal, which affects 70% of men and 40% of women during their lifetime.',
    },
    causes: {
      fr: ['Sensibilité génétique à la DHT (alopécie androgénétique)', 'Carences en fer, zinc, vitamine D ou biotine', 'Stress intense ou choc (effluvium télogène)', 'Coiffures trop serrées et traitements chimiques agressifs'],
      en: ['Genetic sensitivity to DHT (androgenetic alopecia)', 'Iron, zinc, vitamin D or biotin deficiencies', 'Intense stress or shock (telogen effluvium)', 'Overly tight hairstyles and aggressive chemical treatments'],
    },
    mistakes: {
      fr: ['Espacer les shampoings par peur de « perdre plus » : les cheveux détachés tombent de toute façon', 'Attendre des mois avant d’agir alors que la précocité compte', 'Se fier aux compléments miracles sans vérifier une carence par prise de sang', 'Changer de produit toutes les 3 semaines sans laisser le temps d’agir'],
      en: ['Spacing out shampoos for fear of "losing more": detached hairs fall out anyway', 'Waiting months before acting when earliness matters', 'Trusting miracle supplements without checking deficiencies via blood test', 'Switching products every 3 weeks without giving them time to work'],
    },
    buying_guide: {
      fr: ["Shampoing à la caféine (recherche allemande Dr. Wolff) en usage quotidien", 'Tonique sans rinçage pour prolonger l’action sur le cuir chevelu', "L'huile de romarin, alternative naturelle étudiée face au minoxidil 2%", 'En cas de carence avérée : fer + biotine en complément'],
      en: ['Caffeine shampoo (German Dr. Wolff research) for daily use', 'Leave-in tonic to prolong action on the scalp', 'Rosemary oil, a studied natural alternative to minoxidil 2%', 'If deficiency is confirmed: iron + biotin supplements'],
    },
    key_ingredients: ['cafeine', 'romarin', 'biotine', 'fer'],
    faqs: [
      { q: { fr: 'La caféine fonctionne-t-elle vraiment contre la chute ?', en: 'Does caffeine really work against hair loss?' }, a: { fr: "Les études in vitro montrent qu'elle contrecarre l'effet de la DHT sur le follicule et pénètre en 2 minutes. Les preuves cliniques restent modérées : efficace en prévention et en complément, pas en traitement unique d'une alopécie avancée.", en: 'In vitro studies show it counteracts the DHT effect on the follicle and penetrates within 2 minutes. Clinical evidence remains moderate: effective for prevention and as a complement, not as sole treatment for advanced alopecia.' } },
      { q: { fr: 'Chute saisonnière : faut-il s’inquiéter ?', en: 'Seasonal shedding: should I worry?' }, a: { fr: "Non, une chute accrue en automne et au printemps est physiologique et dure 4 à 6 semaines. Au-delà de 2 mois ou si le volume diminue visiblement, consultez.", en: 'No, increased shedding in autumn and spring is physiological and lasts 4 to 6 weeks. Beyond 2 months or if volume visibly decreases, seek advice.' } },
      { q: { fr: 'Quand consulter un dermatologue ?', en: 'When to see a dermatologist?' }, a: { fr: "Si la chute dure plus de 3 mois, si la densité baisse sur les tempes/le sommet, ou en cas de plaques : un trichogramme et un bilan sanguin orienteront le traitement.", en: 'If shedding lasts more than 3 months, if density drops at the temples/crown, or in case of patches: a trichogram and blood test will guide treatment.' } },
    ],
  },
  {
    slug: 'dandruff', vertical: 'hair',
    title: { fr: 'Pellicules', en: 'Dandruff' },
    definition: {
      fr: "Les pellicules résultent d'un renouvellement accéléré du cuir chevelu, le plus souvent lié à la prolifération de la levure Malassezia. On distingue les pellicules sèches (fines, volatiles) des pellicules grasses (jaunâtres, adhérentes), souvent accompagnées de démangeaisons.",
      en: 'Dandruff results from accelerated scalp cell turnover, most often linked to the proliferation of the Malassezia yeast. Dry dandruff (fine, loose) differs from oily dandruff (yellowish, sticky), often accompanied by itching.',
    },
    causes: {
      fr: ['Prolifération de la levure Malassezia globosa', 'Excès de sébum qui nourrit la levure', 'Stress, fatigue et changements de saison', 'Shampoings trop agressifs ou mal rincés'],
      en: ['Proliferation of the Malassezia globosa yeast', 'Excess sebum feeding the yeast', 'Stress, fatigue and seasonal changes', 'Overly harsh or poorly rinsed shampoos'],
    },
    mistakes: {
      fr: ['Gratter le cuir chevelu, ce qui entretient l’inflammation', "Utiliser un shampoing antipelliculaire agressif tous les jours", 'Arrêter le traitement dès la disparition des pellicules', "Confondre pellicules et simple sécheresse du cuir chevelu"],
      en: ['Scratching the scalp, which maintains inflammation', 'Using a harsh anti-dandruff shampoo every day', 'Stopping treatment as soon as dandruff disappears', 'Confusing dandruff with simple scalp dryness'],
    },
    buying_guide: {
      fr: ['Piroctone olamine : l’actif antipelliculaire de référence en UE depuis l’interdiction du zinc pyrithione', 'Alterner shampoing traitant (2-3x/semaine) et shampoing doux pH 5.5', 'Poursuivre 2 à 4 semaines après disparition pour éviter la récidive', 'En cas de plaques rouges et squames épaisses, penser à la dermatite séborrhéique (consulter)'],
      en: ['Piroctone olamine: the reference anti-dandruff active in the EU since zinc pyrithione was banned', 'Alternate treating shampoo (2-3x/week) with a gentle pH 5.5 shampoo', 'Continue 2 to 4 weeks after clearing to prevent recurrence', 'If red patches and thick scales appear, consider seborrheic dermatitis (seek advice)'],
    },
    key_ingredients: ['piroctone-olamine', 'romarin'],
    faqs: [
      { q: { fr: 'Les pellicules sont-elles contagieuses ?', en: 'Is dandruff contagious?' }, a: { fr: 'Non. La levure Malassezia est présente sur tous les cuirs chevelus ; seule une réactivité individuelle déclenche les pellicules.', en: 'No. The Malassezia yeast is present on every scalp; only individual reactivity triggers dandruff.' } },
      { q: { fr: 'Pourquoi le zinc pyrithione a-t-il disparu des shampoings ?', en: 'Why did zinc pyrithione disappear from shampoos?' }, a: { fr: "Classé CMR, il est interdit dans les cosmétiques UE depuis mars 2022. La piroctone olamine, aussi efficace et mieux tolérée, l'a remplacé dans les formules européennes.", en: 'Classified as CMR, it has been banned in EU cosmetics since March 2022. Piroctone olamine, equally effective and better tolerated, replaced it in European formulas.' } },
      { q: { fr: 'Un shampoing antipelliculaire abîme-t-il les cheveux ?', en: 'Does anti-dandruff shampoo damage hair?' }, a: { fr: "Les formules modernes (pH 5.5, sans sulfates agressifs) respectent la fibre. Appliquez le shampoing traitant sur le cuir chevelu, pas sur les longueurs.", en: 'Modern formulas (pH 5.5, without harsh sulfates) respect the fiber. Apply the treating shampoo to the scalp, not the lengths.' } },
    ],
  },
  {
    slug: 'dry-hair', vertical: 'hair',
    title: { fr: 'Cheveux secs & abîmés', en: 'Dry & damaged hair' },
    definition: {
      fr: "Le cheveu sec manque de lipides et d'eau : écailles ouvertes, toucher rêche, fourches et casse. Contrairement à la peau, le cheveu est une fibre morte : on ne le « répare » pas biologiquement, mais on peut combler les brèches et sceller les écailles.",
      en: 'Dry hair lacks lipids and water: open cuticles, rough feel, split ends and breakage. Unlike skin, hair is a dead fiber: it cannot be biologically "repaired", but gaps can be filled and cuticles sealed.',
    },
    causes: {
      fr: ['Chaleur : sèche-cheveux, fers à lisser/boucler', 'Colorations, décolorations et défrisages chimiques', 'UV, eau de mer et chlore en été', 'Brossages agressifs sur cheveux mouillés'],
      en: ['Heat: blow-dryers, straightening/curling irons', 'Coloring, bleaching and chemical relaxing', 'UV, seawater and chlorine in summer', 'Aggressive brushing on wet hair'],
    },
    mistakes: {
      fr: ['Appliquer les masques sur les racines au lieu des longueurs', 'Utiliser le fer à lisser sur cheveux humides', "Négliger le protecteur de chaleur avant le brushing", 'Laver trop souvent avec des sulfates détergents'],
      en: ['Applying masks to roots instead of lengths', 'Using a flat iron on damp hair', 'Skipping heat protectant before blow-drying', 'Washing too often with detergent sulfates'],
    },
    buying_guide: {
      fr: ['Shampoing doux + masque à la kératine ou au panthénol 1 à 2 fois/semaine', 'Huile capillaire sur les pointes pour sceller les écailles', 'Protecteur de chaleur systématique avant tout appareil chauffant', 'Couper les fourches régulièrement : aucun soin ne les ressoude durablement'],
      en: ['Gentle shampoo + keratin or panthenol mask 1-2 times/week', 'Hair oil on the ends to seal cuticles', 'Systematic heat protectant before any hot tool', 'Trim split ends regularly: no treatment permanently fuses them'],
    },
    key_ingredients: ['panthenol', 'uree', 'romarin'],
    faqs: [
      { q: { fr: 'Un soin peut-il vraiment réparer les fourches ?', en: 'Can a treatment really repair split ends?' }, a: { fr: "Non, aucun produit ne ressoude définitivement une fourche : les soins les colmatent temporairement et évitent qu'elles remontent. Seule la coupe les élimine.", en: 'No product permanently fuses a split end: treatments temporarily patch them and prevent them from travelling up. Only a trim removes them.' } },
      { q: { fr: 'À quelle fréquence faire un masque ?', en: 'How often should I use a mask?' }, a: { fr: '1 à 2 fois par semaine sur les longueurs et pointes, 5 à 10 minutes de pose. Au-delà, risque de surcharge qui alourdit le cheveu.', en: '1-2 times a week on lengths and ends, 5-10 minutes. More than that risks buildup that weighs hair down.' } },
      { q: { fr: 'Faut-il rincer les huiles capillaires ?', en: 'Should hair oils be rinsed out?' }, a: { fr: 'Les deux usages existent : en bain avant-shampoing (30 min, puis lavage) pour nourrir en profondeur, ou 2-3 gouttes sur les pointes sèches en finition sans rinçage.', en: 'Both uses exist: as a pre-shampoo treatment (30 min, then wash) for deep nourishment, or 2-3 drops on dry ends as a leave-in finish.' } },
    ],
  },
  {
    slug: 'sensitive-scalp', vertical: 'hair',
    title: { fr: 'Cuir chevelu sensible', en: 'Sensitive scalp' },
    definition: {
      fr: "Démangeaisons, picotements, sensation de brûlure ou tiraillements : le cuir chevelu sensible réagit de façon excessive aux agressions. Comme la peau du visage, il possède une barrière qui peut se fragiliser — il est d'ailleurs plus riche en terminaisons nerveuses.",
      en: 'Itching, tingling, burning or tightness: a sensitive scalp overreacts to aggressions. Like facial skin, it has a barrier that can weaken — and it is even richer in nerve endings.',
    },
    causes: {
      fr: ['Shampoings détergents (sulfates agressifs) et lavages trop fréquents', 'Résidus de produits coiffants et silicones occlusifs', 'Stress, pollution, eau calcaire', 'Colorations avec ammoniaque et PPD'],
      en: ['Detergent shampoos (harsh sulfates) and over-frequent washing', 'Styling product residues and occlusive silicones', 'Stress, pollution, hard water', 'Coloring with ammonia and PPD'],
    },
    mistakes: {
      fr: ["Se gratter, ce qui entretient le cercle irritation-démangeaison", "Utiliser de l'eau très chaude au rinçage", 'Multiplier les produits coiffants sans nettoyer le cuir chevelu', 'Choisir un shampoing antipelliculaire agressif alors qu’il n’y a pas de pellicules'],
      en: ['Scratching, which maintains the irritation-itch cycle', 'Rinsing with very hot water', 'Layering styling products without cleansing the scalp', 'Choosing a harsh anti-dandruff shampoo when there is no dandruff'],
    },
    buying_guide: {
      fr: ['Shampoing sans parfum ni sulfates agressifs, pH 5.5', "L'urée à 5% pour apaiser et réhydrater (référence dermatologique allemande)", 'Le panthénol pour calmer les irritations', 'Rincer à l’eau tiède et espacer les colorations'],
      en: ['Fragrance-free shampoo without harsh sulfates, pH 5.5', 'Urea 5% to soothe and rehydrate (a German dermatological reference)', 'Panthenol to calm irritation', 'Rinse with lukewarm water and space out colorings'],
    },
    key_ingredients: ['uree', 'panthenol'],
    faqs: [
      { q: { fr: 'Pourquoi mon cuir chevelu me démange-t-il sans pellicules ?', en: 'Why does my scalp itch without dandruff?' }, a: { fr: "Sécheresse, résidus de produits, stress ou eau calcaire suffisent à déclencher des démangeaisons. Un shampoing apaisant à l'urée règle la plupart des cas en 2 à 4 semaines.", en: 'Dryness, product residues, stress or hard water are enough to trigger itching. A soothing urea shampoo resolves most cases within 2 to 4 weeks.' } },
      { q: { fr: 'Laver tous les jours abîme-t-il le cuir chevelu ?', en: 'Does daily washing damage the scalp?' }, a: { fr: "Non, si le shampoing est doux (pH 5.5, sans sulfates agressifs). C'est la formule qui compte, pas la fréquence.", en: 'No, if the shampoo is gentle (pH 5.5, no harsh sulfates). The formula matters, not the frequency.' } },
      { q: { fr: 'Quand consulter ?', en: 'When to seek medical advice?' }, a: { fr: 'Si les démangeaisons persistent plus d’un mois malgré des soins doux, ou en cas de plaques rouges, croûtes ou chute associée : psoriasis et dermatite séborrhéique doivent être écartés.', en: 'If itching persists over a month despite gentle care, or with red patches, crusts or associated hair loss: psoriasis and seborrheic dermatitis must be ruled out.' } },
    ],
  },
  // ================= WELLNESS =================
  {
    slug: 'sleep', vertical: 'wellness',
    title: { fr: 'Sommeil', en: 'Sleep' },
    definition: {
      fr: "Un adulte a besoin de 7 à 9 heures de sommeil. Insomnie d'endormissement, réveils nocturnes ou sommeil non réparateur touchent 1 personne sur 3. Avant les somnifères, l'hygiène de sommeil et la phytothérapie validée (valériane, mélatonine) sont les premières réponses.",
      en: 'An adult needs 7 to 9 hours of sleep. Sleep-onset insomnia, night wakings or non-restorative sleep affect 1 in 3 people. Before sleeping pills, sleep hygiene and validated phytotherapy (valerian, melatonin) are the first answers.',
    },
    causes: {
      fr: ['Écrans le soir : la lumière bleue retarde la sécrétion de mélatonine', 'Stress et ruminations au coucher', 'Caféine après 14h, alcool le soir', 'Horaires irréguliers qui dérèglent l’horloge interne'],
      en: ['Evening screens: blue light delays melatonin secretion', 'Stress and rumination at bedtime', 'Caffeine after 2pm, alcohol in the evening', 'Irregular schedules disrupting the internal clock'],
    },
    mistakes: {
      fr: ['Compenser par de longues siestes ou des grasses matinées le week-end', "Rester au lit sans dormir plus de 20 minutes", "Prendre la mélatonine au mauvais moment (elle se prend 30 min avant le coucher)", "Croire que l'alcool aide à dormir : il fragmente le sommeil"],
      en: ['Compensating with long naps or weekend lie-ins', 'Staying in bed awake for more than 20 minutes', 'Taking melatonin at the wrong time (it should be taken 30 min before bed)', 'Believing alcohol helps sleep: it fragments it'],
    },
    buying_guide: {
      fr: ["Mélatonine 1 mg 30 min avant le coucher : seule dose portant l'allégation EFSA", 'Valériane en extrait concentré (300-600 mg) pour les tensions nerveuses', 'Rituel du soir : tisane ou bain à la lavande 1h avant le coucher', 'Privilégier les fabricants pharmaceutiques allemands (normes GMP)'],
      en: ['Melatonin 1 mg 30 min before bed: the only dose carrying the EFSA claim', 'Valerian as concentrated extract (300-600 mg) for nervous tension', 'Evening ritual: lavender tea or bath 1h before bed', 'Prefer German pharmaceutical manufacturers (GMP standards)'],
    },
    key_ingredients: ['melatonine', 'valeriane', 'lavande'],
    faqs: [
      { q: { fr: 'La mélatonine crée-t-elle une dépendance ?', en: 'Is melatonin habit-forming?' }, a: { fr: "Non, aux doses usuelles (1 mg) elle n'entraîne ni dépendance ni accoutumance. Elle resynchronise l'horloge interne mais ne remplace pas une bonne hygiène de sommeil.", en: 'No, at usual doses (1 mg) it causes neither dependence nor tolerance. It resynchronizes the internal clock but does not replace good sleep hygiene.' } },
      { q: { fr: 'Valériane ou mélatonine : que choisir ?', en: 'Valerian or melatonin: which to choose?' }, a: { fr: "Mélatonine si le problème est l'endormissement ou le décalage horaire ; valériane si c'est la tension nerveuse et les réveils liés au stress. Elles peuvent se combiner.", en: 'Melatonin if the problem is falling asleep or jet lag; valerian if it is nervous tension and stress-related wakings. They can be combined.' } },
      { q: { fr: 'Au bout de combien de temps la valériane agit-elle ?', en: 'How long before valerian works?' }, a: { fr: "Contrairement à la mélatonine, son effet s'installe progressivement : comptez 2 à 4 semaines de prise régulière pour un bénéfice net.", en: 'Unlike melatonin, its effect builds gradually: allow 2 to 4 weeks of regular intake for a clear benefit.' } },
    ],
  },
  {
    slug: 'stress', vertical: 'wellness',
    title: { fr: 'Stress & détente', en: 'Stress & relaxation' },
    definition: {
      fr: "Le stress chronique maintient le cortisol élevé : tensions musculaires, troubles du sommeil, fatigue, fringales et peau réactive. La gestion passe par l'hygiène de vie, la relaxation active et des soutiens validés comme le magnésium — dont le stress augmente justement l'élimination.",
      en: 'Chronic stress keeps cortisol high: muscle tension, sleep problems, fatigue, cravings and reactive skin. Management involves lifestyle, active relaxation and validated supports like magnesium — whose elimination is precisely increased by stress.',
    },
    causes: {
      fr: ['Charge mentale et surconnexion permanente', 'Manque de sommeil qui amplifie la réponse au stress', 'Carence en magnésium (cercle vicieux : le stress le vide)', 'Sédentarité et absence de moments de récupération'],
      en: ['Mental load and permanent hyperconnection', 'Lack of sleep amplifying the stress response', 'Magnesium deficiency (vicious circle: stress depletes it)', 'Sedentary lifestyle and lack of recovery moments'],
    },
    mistakes: {
      fr: ['Compenser par caféine, sucre ou alcool', 'Attendre le burn-out pour ralentir', "S'imposer une méditation « parfaite » au lieu de 5 minutes réalistes", 'Prendre du magnésium mal absorbé (oxyde) et conclure que « ça ne marche pas »'],
      en: ['Compensating with caffeine, sugar or alcohol', 'Waiting for burnout before slowing down', 'Forcing "perfect" meditation instead of a realistic 5 minutes', 'Taking poorly absorbed magnesium (oxide) and concluding "it does not work"'],
    },
    buying_guide: {
      fr: ['Magnésium bien absorbé (citrate, bisglycinate) 300-400 mg/jour', 'Lavande : bain, huile ou extrait oral étudié (Silexan)', 'Valériane en journée à faible dose pour la nervosité', "L'hydrothérapie Kneipp : bains chauds et alternance chaud/froid"],
      en: ['Well-absorbed magnesium (citrate, bisglycinate) 300-400 mg/day', 'Lavender: bath, oil or studied oral extract (Silexan)', 'Low-dose daytime valerian for nervousness', 'Kneipp hydrotherapy: warm baths and hot/cold alternation'],
    },
    key_ingredients: ['magnesium', 'lavande', 'valeriane'],
    faqs: [
      { q: { fr: 'Comment savoir si je manque de magnésium ?', en: 'How do I know if I lack magnesium?' }, a: { fr: 'Signes évocateurs : paupière qui saute, crampes nocturnes, fatigue, irritabilité. La prise de sang classique est peu fiable (98% du magnésium est intracellulaire) — un essai de supplémentation de 4 semaines est souvent le meilleur test.', en: 'Suggestive signs: eyelid twitching, night cramps, fatigue, irritability. Standard blood tests are unreliable (98% of magnesium is intracellular) — a 4-week supplementation trial is often the best test.' } },
      { q: { fr: 'Quelle forme de magnésium choisir ?', en: 'Which form of magnesium to choose?' }, a: { fr: "Citrate et bisglycinate sont bien absorbés et bien tolérés. L'oxyde, courant dans les produits bas de gamme, est mal absorbé et laxatif.", en: 'Citrate and bisglycinate are well absorbed and well tolerated. Oxide, common in low-end products, is poorly absorbed and laxative.' } },
      { q: { fr: 'Les bains chauds sont-ils vraiment efficaces ?', en: 'Are warm baths really effective?' }, a: { fr: "Oui : un bain à 38-40°C de 15 minutes abaisse le cortisol et la tension musculaire, et pris 1 à 2h avant le coucher, il facilite l'endormissement en provoquant une baisse de température corporelle.", en: 'Yes: a 15-minute bath at 38-40°C lowers cortisol and muscle tension, and taken 1-2h before bed, it eases sleep onset by triggering a drop in body temperature.' } },
    ],
  },
  {
    slug: 'energy', vertical: 'wellness',
    title: { fr: 'Énergie & fatigue', en: 'Energy & fatigue' },
    definition: {
      fr: "La fatigue persistante malgré le repos mérite attention : carences (fer, vitamine D, B12, magnésium), sommeil de mauvaise qualité, stress chronique ou sédentarité en sont les causes les plus fréquentes. Les femmes réglées sont particulièrement concernées par le manque de fer.",
      en: 'Persistent fatigue despite rest deserves attention: deficiencies (iron, vitamin D, B12, magnesium), poor sleep quality, chronic stress or a sedentary lifestyle are the most frequent causes. Menstruating women are particularly affected by iron deficiency.',
    },
    causes: {
      fr: ['Carence en fer (surtout chez les femmes) ou en vitamine D (hiver)', 'Sommeil insuffisant ou fragmenté', 'Alimentation ultra-transformée et pics glycémiques', 'Surmenage et absence de vraie récupération'],
      en: ['Iron deficiency (especially in women) or vitamin D deficiency (winter)', 'Insufficient or fragmented sleep', 'Ultra-processed diet and glycemic spikes', 'Overwork and lack of true recovery'],
    },
    mistakes: {
      fr: ['Enchaîner les cafés, qui masquent la fatigue sans la traiter', 'Se supplémenter en fer « au hasard » sans bilan sanguin', 'Ignorer la vitamine D alors que 60% des Européens en manquent en hiver', 'Supprimer le sport alors qu’une activité modérée redonne de l’énergie'],
      en: ['Chaining coffees, which mask fatigue without treating it', 'Supplementing iron "randomly" without a blood test', 'Ignoring vitamin D when 60% of Europeans lack it in winter', 'Cutting out exercise when moderate activity restores energy'],
    },
    buying_guide: {
      fr: ['Fer en tonique liquide (type Floradix) mieux toléré que les comprimés — après confirmation par bilan', 'Vitamine D3 1000-2000 UI/jour d’octobre à avril', 'Magnésium + vitamines B pour le métabolisme énergétique', 'Choisir des fabricants pharmaceutiques allemands aux dosages conformes EFSA'],
      en: ['Iron as a liquid tonic (like Floradix), better tolerated than tablets — after blood test confirmation', 'Vitamin D3 1000-2000 IU/day from October to April', 'Magnesium + B vitamins for energy metabolism', 'Choose German pharmaceutical manufacturers with EFSA-compliant dosages'],
    },
    key_ingredients: ['fer', 'vitamine-d3', 'magnesium', 'biotine'],
    faqs: [
      { q: { fr: 'Puis-je prendre du fer sans prise de sang ?', en: 'Can I take iron without a blood test?' }, a: { fr: "Déconseillé : l'excès de fer est pro-oxydant et peut masquer une autre cause. Un dosage de la ferritine confirme la carence et guide la durée de supplémentation.", en: 'Not recommended: excess iron is pro-oxidant and can mask another cause. A ferritin test confirms deficiency and guides supplementation duration.' } },
      { q: { fr: 'Combien de temps pour ressentir les effets ?', en: 'How long before feeling the effects?' }, a: { fr: 'Vitamine D : 4 à 6 semaines. Fer : 4 à 8 semaines (la ferritine remonte lentement). Magnésium : 2 à 4 semaines. La régularité prime sur la dose.', en: 'Vitamin D: 4-6 weeks. Iron: 4-8 weeks (ferritin rises slowly). Magnesium: 2-4 weeks. Consistency matters more than dose.' } },
      { q: { fr: 'Pourquoi les toniques liquides au fer sont-ils mieux tolérés ?', en: 'Why are liquid iron tonics better tolerated?' }, a: { fr: 'Le fer y est présent sous forme de gluconate faiblement dosé mais bien absorbé, associé à la vitamine C : moins de troubles digestifs que les comprimés fortement dosés.', en: 'Iron is present as low-dose but well-absorbed gluconate, combined with vitamin C: fewer digestive issues than high-dose tablets.' } },
    ],
  },
  {
    slug: 'digestion', vertical: 'wellness',
    title: { fr: 'Digestion', en: 'Digestion' },
    definition: {
      fr: "Ballonnements, lourdeurs, transit irrégulier : les troubles digestifs fonctionnels touchent près d'une personne sur deux. L'alimentation, le stress (l'intestin est notre « deuxième cerveau ») et le rythme des repas jouent un rôle central. Les plantes carminatives comme le fenouil ont un usage validé.",
      en: 'Bloating, heaviness, irregular transit: functional digestive disorders affect nearly one in two people. Diet, stress (the gut is our "second brain") and meal rhythm play a central role. Carminative plants like fennel have validated use.',
    },
    causes: {
      fr: ['Repas rapides, mal mâchés, riches en aliments ultra-transformés', "Stress qui perturbe l'axe intestin-cerveau", 'Déséquilibre du microbiote (antibiotiques, manque de fibres)', 'Intolérances (lactose, FODMAPs) non identifiées'],
      en: ['Fast, poorly chewed meals rich in ultra-processed foods', 'Stress disrupting the gut-brain axis', 'Microbiome imbalance (antibiotics, lack of fiber)', 'Unidentified intolerances (lactose, FODMAPs)'],
    },
    mistakes: {
      fr: ['Boire glacé pendant les repas et manger en 10 minutes', 'Supprimer des groupes alimentaires entiers sans avis professionnel', "S'allonger juste après le repas", 'Abuser des laxatifs au lieu d’augmenter fibres et hydratation'],
      en: ['Drinking iced water during meals and eating in 10 minutes', 'Cutting entire food groups without professional advice', 'Lying down right after a meal', 'Overusing laxatives instead of increasing fiber and hydration'],
    },
    buying_guide: {
      fr: ['Tisane de fenouil après les repas : usage traditionnel reconnu (monographie HMPC)', 'Privilégier les tisanes bio de qualité pharmaceutique allemande (Demeter, Salus)', 'Marcher 10 minutes après les repas principaux', 'Consulter si les troubles persistent plus de 4 semaines ou s’accompagnent de signes d’alerte'],
      en: ['Fennel tea after meals: recognized traditional use (HMPC monograph)', 'Prefer organic teas of German pharmaceutical quality (Demeter, Salus)', 'Walk 10 minutes after main meals', 'Seek advice if symptoms persist over 4 weeks or come with warning signs'],
    },
    key_ingredients: ['fenouil'],
    faqs: [
      { q: { fr: 'Le fenouil est-il vraiment efficace contre les ballonnements ?', en: 'Is fennel really effective against bloating?' }, a: { fr: "Son huile essentielle (anéthole) détend les muscles lisses de l'intestin et facilite l'évacuation des gaz. Son usage traditionnel est officiellement reconnu par l'Agence européenne des médicaments (HMPC).", en: 'Its essential oil (anethole) relaxes the smooth muscles of the gut and eases gas evacuation. Its traditional use is officially recognized by the European Medicines Agency (HMPC).' } },
      { q: { fr: 'Quand boire la tisane digestive ?', en: 'When to drink digestive tea?' }, a: { fr: "Idéalement 15 à 30 minutes après le repas, infusée 10 minutes à couvert pour préserver les huiles essentielles volatiles.", en: 'Ideally 15 to 30 minutes after the meal, steeped 10 minutes covered to preserve the volatile essential oils.' } },
      { q: { fr: 'Quels signes doivent alerter ?', en: 'Which signs should raise concern?' }, a: { fr: 'Perte de poids inexpliquée, sang dans les selles, douleurs nocturnes, troubles apparus après 50 ans : consultez rapidement un médecin.', en: 'Unexplained weight loss, blood in stool, night pain, symptoms starting after age 50: see a doctor promptly.' } },
    ],
  },
  {
    slug: 'immunity', vertical: 'wellness',
    title: { fr: 'Immunité', en: 'Immunity' },
    definition: {
      fr: "Le système immunitaire dépend de piliers simples : sommeil, alimentation variée, activité physique et statut suffisant en micronutriments clés — vitamine D en tête, dont 60% des Européens manquent en hiver. Aucun complément ne « booste » l'immunité au-delà de la correction des carences.",
      en: "The immune system depends on simple pillars: sleep, varied diet, physical activity and sufficient key micronutrient status — vitamin D first, which 60% of Europeans lack in winter. No supplement 'boosts' immunity beyond correcting deficiencies.",
    },
    causes: {
      fr: ['Carence en vitamine D (manque de soleil d’octobre à avril)', 'Sommeil insuffisant : moins de 6h double le risque d’infection', 'Stress chronique qui épuise les défenses', 'Alimentation pauvre en fruits, légumes et fibres'],
      en: ['Vitamin D deficiency (lack of sun from October to April)', 'Insufficient sleep: under 6h doubles infection risk', 'Chronic stress exhausting defenses', 'Diet poor in fruits, vegetables and fiber'],
    },
    mistakes: {
      fr: ["Empiler les compléments « boost immunité » sans corriger le sommeil", 'Prendre de la vitamine D à très forte dose sans suivi', 'Négliger la vaccination et l’hygiène de base', 'Attendre d’être malade pour s’occuper de son statut en vitamine D'],
      en: ['Stacking "immune boost" supplements without fixing sleep', 'Taking very high-dose vitamin D without monitoring', 'Neglecting vaccination and basic hygiene', 'Waiting to be sick before addressing vitamin D status'],
    },
    buying_guide: {
      fr: ['Vitamine D3 1000-2000 UI/jour d’octobre à avril (recommandation BfR allemande : max 20 µg/j sans suivi)', 'Associer à un repas gras pour une meilleure absorption', 'Zinc en cure courte au tout début des symptômes hivernaux', 'Privilégier des fabricants aux dosages transparents et conformes EFSA'],
      en: ['Vitamin D3 1000-2000 IU/day from October to April (German BfR recommendation: max 20 µg/day without monitoring)', 'Take with a fatty meal for better absorption', 'Short-course zinc at the very start of winter symptoms', 'Prefer manufacturers with transparent, EFSA-compliant dosages'],
    },
    key_ingredients: ['vitamine-d3'],
    faqs: [
      { q: { fr: 'Faut-il prendre de la vitamine D toute l’année ?', en: 'Should vitamin D be taken all year round?' }, a: { fr: "D'octobre à avril pour la plupart des adultes en Europe. En été, 15-20 minutes de soleil sur bras et visage suffisent généralement — sauf peau foncée, âge avancé ou faible exposition.", en: 'From October to April for most adults in Europe. In summer, 15-20 minutes of sun on arms and face is usually enough — except for dark skin, older age or low exposure.' } },
      { q: { fr: 'La vitamine C prévient-elle les rhumes ?', en: 'Does vitamin C prevent colds?' }, a: { fr: "Chez la population générale, elle ne réduit pas l'incidence des rhumes mais peut raccourcir légèrement leur durée (environ 8%). Chez les sportifs intensifs, un effet préventif modeste existe.", en: 'In the general population, it does not reduce cold incidence but may slightly shorten duration (about 8%). In intensive athletes, a modest preventive effect exists.' } },
      { q: { fr: 'Peut-on surdoser la vitamine D ?', en: 'Can you overdose on vitamin D?' }, a: { fr: "Oui, à long terme au-delà de 4000 UI/jour sans suivi : risque d'hypercalcémie. L'institut allemand BfR recommande de ne pas dépasser 20 µg (800 UI) en auto-supplémentation quotidienne prolongée.", en: 'Yes, long-term above 4000 IU/day without monitoring: risk of hypercalcemia. The German BfR institute recommends not exceeding 20 µg (800 IU) for prolonged daily self-supplementation.' } },
    ],
  },
]
