import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client = null
let db = null

async function getDb() {
  if (db) return db
  client = new MongoClient(process.env.MONGO_URL)
  await client.connect()
  db = client.db(process.env.DB_NAME)
  return db
}

const NOID = { projection: { _id: 0 } }

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function OPTIONS() {
  return json({})
}

// ============ SEED DATA ============
const IMG = {
  hero: 'https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1?crop=entropy&cs=srgb&fm=jpg&q=85',
  p1: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?crop=entropy&cs=srgb&fm=jpg&q=85',
  p2: 'https://images.pexels.com/photos/4119559/pexels-photo-4119559.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  p3: 'https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  p4: 'https://images.pexels.com/photos/10574130/pexels-photo-10574130.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  p5: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?crop=entropy&cs=srgb&fm=jpg&q=85',
  p6: 'https://images.pexels.com/photos/35899861/pexels-photo-35899861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  p7: 'https://images.unsplash.com/photo-1713768704571-6aeb0d0e5105?crop=entropy&cs=srgb&fm=jpg&q=85',
  p8: 'https://images.unsplash.com/photo-1710410815589-dd83514104d0?crop=entropy&cs=srgb&fm=jpg&q=85',
}

const SEED_BRANDS = [
  { slug: 'sebamed', name: 'Sebamed', country: 'Allemagne', german: true, founded: 1957, city: 'Boppard', website: 'https://www.sebamed.com', description: { fr: "Pionnier du pH 5.5, Sebamed développe depuis 1957 des soins dermatologiques doux qui respectent le manteau acide de la peau. Recommandée par les dermatologues pour les peaux sensibles et à problèmes.", en: "Pioneer of pH 5.5, Sebamed has been developing gentle dermatological care since 1957 that respects the skin's acid mantle. Recommended by dermatologists for sensitive and problem skin." } },
  { slug: 'eucerin', name: 'Eucerin', country: 'Allemagne', german: true, founded: 1900, city: 'Hambourg', website: 'https://www.eucerin.com', description: { fr: "Marque dermo-cosmétique de Beiersdorf (Hambourg), Eucerin allie plus de 120 ans de recherche dermatologique à des formules cliniquement prouvées pour tous les types de peau.", en: "Dermo-cosmetic brand from Beiersdorf (Hamburg), Eucerin combines over 120 years of dermatological research with clinically proven formulas for all skin types." } },
  { slug: 'nivea', name: 'NIVEA', country: 'Allemagne', german: true, founded: 1911, city: 'Hambourg', website: 'https://www.nivea.com', description: { fr: "Icône allemande du soin depuis 1911, NIVEA propose des soins accessibles et efficaces, appuyés par la recherche Beiersdorf, dont le fameux Luminous630 contre les taches pigmentaires.", en: "German skincare icon since 1911, NIVEA offers accessible and effective care backed by Beiersdorf research, including the famous Luminous630 against dark spots." } },
  { slug: 'dr-hauschka', name: 'Dr. Hauschka', country: 'Allemagne', german: true, founded: 1967, city: 'Bad Boll', website: 'https://www.drhauschka.com', description: { fr: "Cosmétique naturelle certifiée depuis 1967, Dr. Hauschka (WALA) formule des soins biologiques et anthroposophiques à base de plantes médicinales cultivées en biodynamie.", en: "Certified natural cosmetics since 1967, Dr. Hauschka (WALA) formulates organic, plant-based skincare using biodynamically grown medicinal plants." } },
  { slug: 'annemarie-borlind', name: 'Annemarie Börlind', country: 'Allemagne', german: true, founded: 1959, city: 'Calw', website: 'https://www.boerlind.com', description: { fr: "Entreprise familiale de la Forêt-Noire, Annemarie Börlind crée des cosmétiques naturels haut de gamme, végans et sans tests sur les animaux depuis 1959.", en: "Family business from the Black Forest, Annemarie Börlind has been creating premium natural, vegan and cruelty-free cosmetics since 1959." } },
  { slug: 'weleda', name: 'Weleda', country: 'Suisse', german: false, founded: 1921, city: 'Arlesheim', website: 'https://www.weleda.com', description: { fr: "Fondée en 1921, Weleda est la référence mondiale de la cosmétique naturelle et anthroposophique certifiée NATRUE, célèbre pour son iconique Skin Food.", en: "Founded in 1921, Weleda is the world reference for NATRUE-certified natural and anthroposophic cosmetics, famous for its iconic Skin Food." } },
]

const SEED_INGREDIENTS = [
  { slug: 'niacinamide', name: 'Niacinamide', inci: 'Niacinamide', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['acne', 'oily', 'pigmentation', 'aging'], description: { fr: "Forme active de la vitamine B3, la niacinamide est l'un des actifs les plus polyvalents et les mieux étudiés : elle régule le sébum, atténue les taches, renforce la barrière cutanée et réduit les rougeurs. Efficace dès 2-5%, très bien tolérée.", en: "The active form of vitamin B3, niacinamide is one of the most versatile and well-studied actives: it regulates sebum, fades dark spots, strengthens the skin barrier and reduces redness. Effective from 2-5%, very well tolerated." }, benefits: { fr: ['Régule la production de sébum', 'Atténue les taches pigmentaires', 'Renforce la barrière cutanée', 'Réduit les rougeurs et pores visibles'], en: ['Regulates sebum production', 'Fades dark spots', 'Strengthens the skin barrier', 'Reduces redness and visible pores'] } },
  { slug: 'acide-hyaluronique', name: 'Acide Hyaluronique', inci: 'Sodium Hyaluronate', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['dryness', 'aging', 'sensitive'], description: { fr: "Molécule naturellement présente dans la peau, capable de retenir jusqu'à 1000 fois son poids en eau. Hydrate intensément, repulpe et lisse les ridules de déshydratation. Convient à tous les types de peau.", en: "A molecule naturally present in the skin, able to hold up to 1000 times its weight in water. Intensely hydrates, plumps and smooths dehydration lines. Suitable for all skin types." }, benefits: { fr: ['Hydratation intense et durable', 'Effet repulpant immédiat', 'Lisse les ridules de déshydratation', 'Convient aux peaux sensibles'], en: ['Intense, lasting hydration', 'Immediate plumping effect', 'Smooths dehydration lines', 'Suitable for sensitive skin'] } },
  { slug: 'retinol', name: 'Rétinol', inci: 'Retinol', safety: 'caution', evidence: 'strong', comedogenic: 2, good_for: ['aging', 'acne', 'pigmentation'], description: { fr: "Dérivé de la vitamine A, le rétinol est l'actif anti-âge de référence : il stimule le renouvellement cellulaire et la production de collagène. À introduire progressivement (irritation possible) et à utiliser le soir avec un SPF le matin.", en: "A vitamin A derivative, retinol is the gold-standard anti-aging active: it stimulates cell renewal and collagen production. Introduce gradually (possible irritation) and use at night with SPF in the morning." }, benefits: { fr: ['Stimule le renouvellement cellulaire', 'Réduit rides et ridules', 'Améliore la texture de la peau', "Aide contre l'acné"], en: ['Stimulates cell renewal', 'Reduces wrinkles and fine lines', 'Improves skin texture', 'Helps with acne'] } },
  { slug: 'vitamine-c', name: 'Vitamine C', inci: 'Ascorbic Acid', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['pigmentation', 'aging'], description: { fr: "Antioxydant puissant, la vitamine C protège du stress oxydatif, éclaircit le teint, atténue les taches et stimule le collagène. La forme pure (acide L-ascorbique) est la plus efficace mais aussi la plus instable.", en: "A powerful antioxidant, vitamin C protects against oxidative stress, brightens the complexion, fades spots and boosts collagen. The pure form (L-ascorbic acid) is the most effective but also the most unstable." }, benefits: { fr: ['Éclaircit et unifie le teint', 'Protection antioxydante', 'Stimule la synthèse de collagène', 'Atténue les taches brunes'], en: ['Brightens and evens skin tone', 'Antioxidant protection', 'Boosts collagen synthesis', 'Fades dark spots'] } },
  { slug: 'acide-salicylique', name: 'Acide Salicylique', inci: 'Salicylic Acid', safety: 'caution', evidence: 'strong', comedogenic: 0, good_for: ['acne', 'oily'], description: { fr: "BHA liposoluble capable de pénétrer dans les pores pour les désobstruer. Référence contre les points noirs, l'acné et l'excès de sébum. Utiliser à 0,5-2%, peut assécher les peaux sensibles.", en: "An oil-soluble BHA able to penetrate pores and unclog them. The reference against blackheads, acne and excess sebum. Use at 0.5-2%, may dry out sensitive skin." }, benefits: { fr: ['Désobstrue les pores en profondeur', 'Exfolie en douceur', 'Réduit points noirs et imperfections', 'Action anti-inflammatoire'], en: ['Deeply unclogs pores', 'Gently exfoliates', 'Reduces blackheads and blemishes', 'Anti-inflammatory action'] } },
  { slug: 'panthenol', name: 'Panthénol', inci: 'Panthenol', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['sensitive', 'dryness'], description: { fr: "Provitamine B5 apaisante et réparatrice, le panthénol hydrate, calme les irritations et accélère la régénération cutanée. Incontournable pour les peaux sensibles et fragilisées.", en: "A soothing and repairing provitamin B5, panthenol hydrates, calms irritation and speeds up skin regeneration. A must-have for sensitive and weakened skin." }, benefits: { fr: ['Apaise les irritations', 'Hydrate en profondeur', 'Accélère la réparation cutanée', 'Renforce la barrière cutanée'], en: ['Soothes irritation', 'Deeply hydrates', 'Speeds up skin repair', 'Strengthens the skin barrier'] } },
  { slug: 'ceramides', name: 'Céramides', inci: 'Ceramide NP', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['dryness', 'sensitive', 'aging'], description: { fr: "Lipides naturellement présents dans la couche cornée, les céramides sont le ciment de la barrière cutanée. Ils restaurent les peaux sèches, sensibilisées ou matures et limitent la perte en eau.", en: "Lipids naturally present in the stratum corneum, ceramides are the cement of the skin barrier. They restore dry, sensitized or mature skin and limit water loss." }, benefits: { fr: ['Restaure la barrière cutanée', 'Limite la perte insensible en eau', 'Apaise les peaux sensibilisées', 'Effet anti-âge préventif'], en: ['Restores the skin barrier', 'Limits transepidermal water loss', 'Soothes sensitized skin', 'Preventive anti-aging effect'] } },
  { slug: 'squalane', name: 'Squalane', inci: 'Squalane', safety: 'green', evidence: 'moderate', comedogenic: 1, good_for: ['dryness', 'sensitive'], description: { fr: "Émollient biomimétique dérivé du squalène naturellement produit par la peau. Nourrit sans effet gras, non comédogène, idéal pour toutes les peaux, même sensibles.", en: "A biomimetic emollient derived from squalene naturally produced by the skin. Nourishes without greasiness, non-comedogenic, ideal for all skin types, even sensitive." }, benefits: { fr: ['Nourrit sans effet gras', 'Renforce le film hydrolipidique', 'Non comédogène', 'Toucher sec et léger'], en: ['Nourishes without greasiness', 'Strengthens the hydrolipidic film', 'Non-comedogenic', 'Dry, lightweight feel'] } },
  { slug: 'zinc-pca', name: 'Zinc PCA', inci: 'Zinc PCA', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['oily', 'acne'], description: { fr: "Association de zinc et d'acide L-PCA, sébo-régulatrice et purifiante. Réduit la brillance, resserre visuellement les pores et limite la prolifération bactérienne.", en: "A combination of zinc and L-PCA acid, sebum-regulating and purifying. Reduces shine, visually tightens pores and limits bacterial growth." }, benefits: { fr: ['Régule la production de sébum', 'Action purifiante', 'Matifie la peau', 'Limite les imperfections'], en: ['Regulates sebum production', 'Purifying action', 'Mattifies the skin', 'Limits blemishes'] } },
  { slug: 'coenzyme-q10', name: 'Coenzyme Q10', inci: 'Ubiquinone', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['aging'], description: { fr: "Antioxydant naturellement présent dans les cellules, le Q10 protège du vieillissement induit par les radicaux libres et soutient la production d'énergie cellulaire. Popularisé par la recherche allemande (Beiersdorf).", en: "An antioxidant naturally present in cells, Q10 protects against free-radical aging and supports cellular energy production. Popularized by German research (Beiersdorf)." }, benefits: { fr: ['Protection antioxydante', "Réduit les signes de l'âge", "Soutient l'énergie cellulaire", 'Bien toléré'], en: ['Antioxidant protection', 'Reduces signs of aging', 'Supports cellular energy', 'Well tolerated'] } },
  { slug: 'aloe-vera', name: 'Aloe Vera', inci: 'Aloe Barbadensis Leaf Juice', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['sensitive', 'dryness'], description: { fr: "Gel végétal hydratant, apaisant et rafraîchissant, riche en polysaccharides. Calme les échauffements et convient aux peaux réactives.", en: "A hydrating, soothing and refreshing plant gel, rich in polysaccharides. Calms overheated skin and suits reactive skin." }, benefits: { fr: ['Apaise immédiatement', 'Hydrate et rafraîchit', 'Calme les rougeurs', 'Convient aux peaux réactives'], en: ['Immediately soothes', 'Hydrates and refreshes', 'Calms redness', 'Suits reactive skin'] } },
  { slug: 'glycerine', name: 'Glycérine', inci: 'Glycerin', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['dryness', 'sensitive'], description: { fr: "Humectant de référence, la glycérine attire et retient l'eau dans l'épiderme. Présente dans la quasi-totalité des soins hydratants, sûre et efficace à toute concentration usuelle.", en: "The reference humectant, glycerin attracts and retains water in the epidermis. Present in almost all moisturizers, safe and effective at any usual concentration." }, benefits: { fr: ['Hydratation immédiate', "Retient l'eau dans la peau", 'Très bien tolérée', 'Compatible avec tous les actifs'], en: ['Immediate hydration', 'Retains water in the skin', 'Very well tolerated', 'Compatible with all actives'] } },
]

const SEED_PRODUCTS = [
  { slug: 'eucerin-hyaluron-filler-serum', name: 'Hyaluron-Filler Sérum Concentré', brand_slug: 'eucerin', brand_name: 'Eucerin', category: 'serum', price_eur: 29.9, rating: 4.6, image: IMG.p1, german_made: true, concerns: ['aging', 'dryness'], skin_types: ['normal', 'dry', 'combination', 'sensitive'], ingredients: ['acide-hyaluronique', 'glycerine'], affiliate_url: 'https://www.eucerin.com', description: { fr: "Sérum concentré à l'acide hyaluronique de haut et bas poids moléculaire. Repulpe les rides en profondeur et hydrate intensément. Testé cliniquement, convient aux peaux sensibles.", en: "Concentrated serum with high and low molecular weight hyaluronic acid. Plumps deep wrinkles and intensely hydrates. Clinically tested, suitable for sensitive skin." } },
  { slug: 'sebamed-clear-face-gel', name: 'Clear Face Gel Nettoyant', brand_slug: 'sebamed', brand_name: 'Sebamed', category: 'cleanser', price_eur: 8.5, rating: 4.4, image: IMG.p2, german_made: true, concerns: ['acne', 'oily'], skin_types: ['oily', 'combination'], ingredients: ['acide-salicylique', 'panthenol', 'glycerine'], affiliate_url: 'https://www.sebamed.com', description: { fr: "Gel nettoyant sans savon au pH 5.5, formulé pour les peaux à imperfections. Élimine l'excès de sébum sans dessécher et respecte le manteau acide de la peau.", en: "Soap-free cleansing gel at pH 5.5, formulated for blemish-prone skin. Removes excess sebum without drying and respects the skin's acid mantle." } },
  { slug: 'weleda-skin-food', name: 'Skin Food Original', brand_slug: 'weleda', brand_name: 'Weleda', category: 'moisturizer', price_eur: 12.9, rating: 4.7, image: IMG.p3, german_made: false, concerns: ['dryness', 'sensitive'], skin_types: ['dry', 'normal', 'sensitive'], ingredients: ['glycerine', 'aloe-vera', 'squalane'], affiliate_url: 'https://www.weleda.com', description: { fr: "Crème culte ultra-nourrissante aux extraits de calendula, camomille et pensée sauvage. Sauve les peaux très sèches du visage et du corps depuis 1926.", en: "Cult ultra-nourishing cream with calendula, chamomile and wild pansy extracts. Rescuing very dry skin on face and body since 1926." } },
  { slug: 'dr-hauschka-creme-jour-rose', name: 'Crème de Jour à la Rose', brand_slug: 'dr-hauschka', brand_name: 'Dr. Hauschka', category: 'moisturizer', price_eur: 21.0, rating: 4.5, image: IMG.p4, german_made: true, concerns: ['sensitive', 'dryness'], skin_types: ['dry', 'sensitive', 'normal'], ingredients: ['squalane', 'aloe-vera', 'glycerine'], affiliate_url: 'https://www.drhauschka.com', description: { fr: "Soin bio emblématique aux extraits de rose de Damas. Protège, apaise et harmonise les peaux sensibles et sujettes aux rougeurs. Certifié NATRUE.", en: "Iconic organic care with Damask rose extracts. Protects, soothes and balances sensitive, redness-prone skin. NATRUE certified." } },
  { slug: 'eucerin-sun-oil-control-spf50', name: 'Sun Oil Control SPF 50+', brand_slug: 'eucerin', brand_name: 'Eucerin', category: 'sunscreen', price_eur: 17.5, rating: 4.6, image: IMG.p5, german_made: true, concerns: ['oily', 'acne'], skin_types: ['oily', 'combination'], ingredients: ['glycerine'], affiliate_url: 'https://www.eucerin.com', description: { fr: "Protection solaire très haute SPF 50+ au toucher sec, spécialement conçue pour les peaux grasses et à imperfections. Effet matifiant 8h, non comédogène.", en: "Very high SPF 50+ sun protection with a dry touch, specially designed for oily and blemish-prone skin. 8h mattifying effect, non-comedogenic." } },
  { slug: 'borlind-ll-regeneration-creme', name: 'LL Régénération Crème de Jour', brand_slug: 'annemarie-borlind', brand_name: 'Annemarie Börlind', category: 'moisturizer', price_eur: 34.9, rating: 4.3, image: IMG.p6, german_made: true, concerns: ['aging', 'dryness'], skin_types: ['normal', 'dry'], ingredients: ['acide-hyaluronique', 'squalane', 'glycerine'], affiliate_url: 'https://www.boerlind.com', description: { fr: "Crème anti-âge naturelle qui lisse les ridules et améliore l'élasticité. Formule végane à l'acide hyaluronique végétal, fabriquée en Forêt-Noire.", en: "Natural anti-aging cream that smooths fine lines and improves elasticity. Vegan formula with plant-based hyaluronic acid, made in the Black Forest." } },
  { slug: 'sebamed-anti-age-q10', name: 'Crème Anti-Âge Q10 Lifting', brand_slug: 'sebamed', brand_name: 'Sebamed', category: 'moisturizer', price_eur: 14.9, rating: 4.2, image: IMG.p3, german_made: true, concerns: ['aging'], skin_types: ['normal', 'dry', 'combination', 'sensitive'], ingredients: ['coenzyme-q10', 'glycerine', 'panthenol'], affiliate_url: 'https://www.sebamed.com', description: { fr: "Crème anti-âge au coenzyme Q10 et pH 5.5. Réduit visiblement les rides en 28 jours tout en respectant les peaux sensibles. Excellent rapport qualité-prix.", en: "Anti-aging cream with coenzyme Q10 at pH 5.5. Visibly reduces wrinkles in 28 days while respecting sensitive skin. Excellent value for money." } },
  { slug: 'nivea-luminous630-serum', name: 'Cellular Luminous630 Sérum Anti-Taches', brand_slug: 'nivea', brand_name: 'NIVEA', category: 'serum', price_eur: 24.9, rating: 4.4, image: IMG.p7, german_made: true, concerns: ['pigmentation', 'aging'], skin_types: ['normal', 'combination', 'dry', 'oily'], ingredients: ['niacinamide', 'acide-hyaluronique', 'glycerine'], affiliate_url: 'https://www.nivea.com', description: { fr: "Sérum anti-taches breveté Luminous630, fruit de 10 ans de recherche Beiersdorf. Réduit visiblement les taches pigmentaires en 4 semaines et prévient leur réapparition.", en: "Patented Luminous630 anti-dark-spot serum, the result of 10 years of Beiersdorf research. Visibly reduces dark spots in 4 weeks and prevents their return." } },
  { slug: 'eucerin-dermopure-serum', name: 'DermoPure Sérum Triple Action', brand_slug: 'eucerin', brand_name: 'Eucerin', category: 'serum', price_eur: 19.9, rating: 4.5, image: IMG.p8, german_made: true, concerns: ['acne', 'oily', 'pigmentation'], skin_types: ['oily', 'combination'], ingredients: ['acide-salicylique', 'niacinamide', 'glycerine'], affiliate_url: 'https://www.eucerin.com', description: { fr: "Sérum triple action pour peaux à imperfections : réduit les boutons, atténue les marques post-acné et prévient leur réapparition. Avec acide salicylique et Thiamidol.", en: "Triple action serum for blemish-prone skin: reduces spots, fades post-acne marks and prevents their return. With salicylic acid and Thiamidol." } },
  { slug: 'weleda-lotion-nettoyante-douce', name: 'Lait Nettoyant Doux', brand_slug: 'weleda', brand_name: 'Weleda', category: 'cleanser', price_eur: 9.9, rating: 4.3, image: IMG.p2, german_made: false, concerns: ['sensitive', 'dryness'], skin_types: ['dry', 'sensitive', 'normal'], ingredients: ['aloe-vera', 'glycerine'], affiliate_url: 'https://www.weleda.com', description: { fr: "Lait nettoyant naturel qui élimine impuretés et maquillage sans agresser. Aux extraits de pivoine et hamamélis, certifié NATRUE.", en: "Natural cleansing milk that removes impurities and makeup without stripping. With peony and witch hazel extracts, NATRUE certified." } },
  { slug: 'dr-hauschka-serum-nuit', name: 'Sérum de Nuit Régénérant', brand_slug: 'dr-hauschka', brand_name: 'Dr. Hauschka', category: 'serum', price_eur: 32.0, rating: 4.1, image: IMG.p1, german_made: true, concerns: ['aging', 'sensitive'], skin_types: ['normal', 'dry', 'sensitive'], ingredients: ['aloe-vera', 'glycerine'], affiliate_url: 'https://www.drhauschka.com', description: { fr: "Sérum de nuit bio qui soutient le renouvellement naturel de la peau pendant le sommeil. Sans huile, aux extraits de cynorrhodon et d'argousier.", en: "Organic night serum that supports the skin's natural renewal during sleep. Oil-free, with rosehip and sea buckthorn extracts." } },
  { slug: 'nivea-sun-uv-face-spf50', name: 'Sun UV Face Sensitive SPF 50', brand_slug: 'nivea', brand_name: 'NIVEA', category: 'sunscreen', price_eur: 12.5, rating: 4.2, image: IMG.p5, german_made: true, concerns: ['sensitive'], skin_types: ['sensitive', 'normal', 'dry', 'combination'], ingredients: ['glycerine', 'panthenol'], affiliate_url: 'https://www.nivea.com', description: { fr: "Protection solaire visage SPF 50 pour peaux sensibles : 0% parfum, 0% alcool. Texture légère non grasse, résistante à l'eau.", en: "SPF 50 face sun protection for sensitive skin: 0% fragrance, 0% alcohol. Lightweight non-greasy texture, water resistant." } },
]

const SEED_ARTICLES = [
  { slug: 'comprendre-peau-sensible', category: 'learn', image: IMG.p4, published_at: '2025-05-12', title: { fr: 'Comprendre la peau sensible : causes, signes et solutions', en: 'Understanding sensitive skin: causes, signs and solutions' }, excerpt: { fr: "Rougeurs, tiraillements, picotements... La peau sensible touche près d'une personne sur deux. Voici comment la reconnaître et en prendre soin.", en: "Redness, tightness, tingling... Sensitive skin affects nearly one in two people. Here's how to recognize and care for it." }, content: { fr: "La peau sensible n'est pas un type de peau mais un état : une réactivité excessive aux facteurs externes (froid, pollution, cosmétiques) ou internes (stress, hormones). Elle se manifeste par des rougeurs, tiraillements, picotements ou échauffements.\n\nLa cause principale est une barrière cutanée fragilisée : le film hydrolipidique et les lipides intercellulaires (céramides, cholestérol, acides gras) ne jouent plus leur rôle de bouclier, laissant pénétrer les irritants et s'échapper l'eau.\n\nPour en prendre soin : privilégiez des nettoyants doux sans savon au pH physiologique (5.5), des formules courtes sans parfum ni alcool, et des actifs réparateurs comme le panthénol, les céramides et l'acide hyaluronique.\n\nLes marques dermatologiques allemandes comme Sebamed ont bâti leur réputation sur le respect du pH 5.5, précisément pour préserver ce manteau acide protecteur. En cas de réactivité persistante, consultez un dermatologue pour écarter une rosacée ou une dermatite.", en: "Sensitive skin is not a skin type but a condition: an excessive reactivity to external factors (cold, pollution, cosmetics) or internal ones (stress, hormones). It shows as redness, tightness, tingling or burning sensations.\n\nThe main cause is a weakened skin barrier: the hydrolipidic film and intercellular lipids (ceramides, cholesterol, fatty acids) no longer act as a shield, letting irritants in and water out.\n\nTo care for it: choose gentle soap-free cleansers at physiological pH (5.5), short formulas without fragrance or alcohol, and repairing actives such as panthenol, ceramides and hyaluronic acid.\n\nGerman dermatological brands like Sebamed built their reputation on respecting pH 5.5, precisely to preserve this protective acid mantle. If reactivity persists, see a dermatologist to rule out rosacea or dermatitis." } },
  { slug: 'routine-skincare-debutant', category: 'guide', image: IMG.p7, published_at: '2025-05-20', title: { fr: 'Construire sa première routine skincare en 3 étapes', en: 'Building your first skincare routine in 3 steps' }, excerpt: { fr: "Pas besoin de 10 produits pour bien commencer. Nettoyant, hydratant, SPF : la routine minimaliste validée par les dermatologues.", en: "You don't need 10 products to start well. Cleanser, moisturizer, SPF: the minimalist routine approved by dermatologists." }, content: { fr: "La règle d'or d'une première routine : la simplicité. Trois produits suffisent pour couvrir 90% des besoins de la peau.\n\nÉtape 1 — Nettoyer : matin et soir, avec un nettoyant doux adapté à votre type de peau. Gel purifiant pour les peaux grasses, lait ou crème pour les peaux sèches et sensibles.\n\nÉtape 2 — Hydrater : toutes les peaux, même grasses, ont besoin d'hydratation. Cherchez glycérine, acide hyaluronique et céramides. Texture gel pour les peaux grasses, crème riche pour les peaux sèches.\n\nÉtape 3 — Protéger : le SPF quotidien est le meilleur geste anti-âge qui existe. SPF 30 minimum, 50 idéalement, chaque matin, même par temps couvert.\n\nUne fois cette base maîtrisée pendant 4 à 6 semaines, vous pouvez introduire UN actif ciblé (niacinamide, vitamine C, rétinol...) selon votre préoccupation principale. Notre Product Finder peut vous aider à choisir.", en: "The golden rule of a first routine: simplicity. Three products cover 90% of your skin's needs.\n\nStep 1 — Cleanse: morning and evening, with a gentle cleanser suited to your skin type. Purifying gel for oily skin, milk or cream for dry and sensitive skin.\n\nStep 2 — Moisturize: every skin, even oily, needs hydration. Look for glycerin, hyaluronic acid and ceramides. Gel texture for oily skin, rich cream for dry skin.\n\nStep 3 — Protect: daily SPF is the single best anti-aging habit. SPF 30 minimum, ideally 50, every morning, even on cloudy days.\n\nOnce this base is mastered for 4 to 6 weeks, you can introduce ONE targeted active (niacinamide, vitamin C, retinol...) based on your main concern. Our Product Finder can help you choose." } },
  { slug: 'lire-liste-inci', category: 'learn', image: IMG.p6, published_at: '2025-06-01', title: { fr: 'Comment lire une liste INCI comme un pro', en: 'How to read an INCI list like a pro' }, excerpt: { fr: "La liste INCI révèle tout ce que contient votre cosmétique. Apprenez à la décrypter en 5 minutes.", en: "The INCI list reveals everything your cosmetic contains. Learn to decode it in 5 minutes." }, content: { fr: "INCI signifie International Nomenclature of Cosmetic Ingredients : c'est la liste obligatoire et standardisée des ingrédients, présente sur tout cosmétique vendu en Europe.\n\nRègle n°1 : les ingrédients sont classés par ordre décroissant de concentration jusqu'à 1%. Les 5 premiers ingrédients représentent souvent plus de 80% de la formule.\n\nRègle n°2 : en dessous de 1%, l'ordre est libre. Un actif cité en fin de liste peut donc être présent à une concentration efficace... ou symbolique.\n\nRègle n°3 : les noms latins désignent des extraits végétaux (Aloe Barbadensis = aloe vera), les noms anglais des molécules (Sodium Hyaluronate = acide hyaluronique).\n\nSur notre plateforme, chaque fiche produit détaille les actifs clés avec leur niveau de preuve scientifique, pour que vous n'ayez plus jamais à déchiffrer seul une étiquette.", en: "INCI stands for International Nomenclature of Cosmetic Ingredients: the mandatory, standardized ingredient list found on every cosmetic sold in Europe.\n\nRule #1: ingredients are listed in descending order of concentration down to 1%. The first 5 ingredients often make up more than 80% of the formula.\n\nRule #2: below 1%, the order is free. An active listed at the end may be present at an effective concentration... or a symbolic one.\n\nRule #3: Latin names refer to plant extracts (Aloe Barbadensis = aloe vera), English names to molecules (Sodium Hyaluronate = hyaluronic acid).\n\nOn our platform, every product page details the key actives with their level of scientific evidence, so you never have to decode a label alone again." } },
  { slug: 'niacinamide-que-dit-la-science', category: 'research', image: IMG.p8, published_at: '2025-06-10', title: { fr: 'Niacinamide : que dit vraiment la science ?', en: 'Niacinamide: what does the science really say?' }, excerpt: { fr: "Actif star des réseaux sociaux, la niacinamide est-elle à la hauteur ? Revue des études cliniques.", en: "Social media's star active — does niacinamide live up to the hype? A review of clinical studies." }, content: { fr: "La niacinamide (vitamine B3) est l'un des actifs cosmétiques les plus étudiés, avec plusieurs dizaines d'essais cliniques randomisés publiés.\n\nCe qui est solidement démontré : à 2-5%, elle réduit la production de sébum (étude de Draelos, 2006), améliore la barrière cutanée en stimulant la synthèse de céramides (Tanno, 2000), et atténue les hyperpigmentations en bloquant le transfert de mélanosomes (Hakozaki, 2002).\n\nCe qui est plausible mais moins prouvé : la réduction des pores visibles et des rides, observée dans des études plus petites ou financées par les industriels.\n\nCe qui est faux : le mythe selon lequel niacinamide et vitamine C ne peuvent pas être combinées. Cette croyance repose sur des études des années 1960 dans des conditions non réalistes (hautes températures).\n\nVerdict : un actif polyvalent, très bien toléré, au rapport bénéfice/risque excellent. À 5%, c'est l'un des meilleurs premiers actifs à introduire dans une routine.", en: "Niacinamide (vitamin B3) is one of the most studied cosmetic actives, with dozens of published randomized clinical trials.\n\nWhat is solidly proven: at 2-5%, it reduces sebum production (Draelos, 2006), improves the skin barrier by boosting ceramide synthesis (Tanno, 2000), and fades hyperpigmentation by blocking melanosome transfer (Hakozaki, 2002).\n\nWhat is plausible but less proven: the reduction of visible pores and wrinkles, observed in smaller or industry-funded studies.\n\nWhat is false: the myth that niacinamide and vitamin C cannot be combined. This belief is based on 1960s studies under unrealistic conditions (high temperatures).\n\nVerdict: a versatile, very well-tolerated active with an excellent benefit/risk ratio. At 5%, it is one of the best first actives to introduce into a routine." } },
]

async function seedIfEmpty(database) {
  // Atomic lock via meta collection to avoid concurrent seeding race condition
  const existing = await database.collection('meta').findOneAndUpdate(
    { key: 'seeded' },
    { $setOnInsert: { key: 'seeded', at: new Date().toISOString() } },
    { upsert: true, returnDocument: 'before' }
  )
  if (existing) return
  const now = new Date().toISOString()
  await database.collection('brands').insertMany(SEED_BRANDS.map((b) => ({ ...b, id: uuidv4(), created_at: now })))
  await database.collection('ingredients').insertMany(SEED_INGREDIENTS.map((i) => ({ ...i, id: uuidv4(), created_at: now })))
  await database.collection('products').insertMany(SEED_PRODUCTS.map((p) => ({ ...p, id: uuidv4(), created_at: now })))
  await database.collection('articles').insertMany(SEED_ARTICLES.map((a) => ({ ...a, id: uuidv4(), created_at: now })))
}

async function requireAdmin(request, database) {
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  return await database.collection('sessions').findOne({ token })
}

const ADMIN_COLLECTIONS = ['products', 'brands', 'ingredients', 'articles']

// ============ GET ============
export async function GET(request, { params }) {
  try {
    const { path = [] } = await params
    const database = await getDb()
    await seedIfEmpty(database)
    const url = new URL(request.url)
    const q = Object.fromEntries(url.searchParams)

    if (path.length === 0 || path[0] === 'root') {
      return json({ status: 'ok', service: 'dermalyze-api' })
    }

    // ---- PRODUCTS ----
    if (path[0] === 'products') {
      if (path[1]) {
        const product = await database.collection('products').findOne({ slug: path[1] }, NOID)
        if (!product) return json({ error: 'Product not found' }, 404)
        const ingredientDetails = await database.collection('ingredients').find({ slug: { $in: product.ingredients || [] } }, NOID).toArray()
        const brand = await database.collection('brands').findOne({ slug: product.brand_slug }, NOID)
        return json({ ...product, ingredient_details: ingredientDetails, brand })
      }
      const filter = {}
      if (q.category) filter.category = q.category
      if (q.concern) filter.concerns = q.concern
      if (q.skin_type) filter.skin_types = q.skin_type
      if (q.brand) filter.brand_slug = q.brand
      if (q.german === 'true') filter.german_made = true
      if (q.search) filter.$or = [{ name: { $regex: q.search, $options: 'i' } }, { brand_name: { $regex: q.search, $options: 'i' } }]
      const products = await database.collection('products').find(filter, NOID).limit(parseInt(q.limit || '100')).toArray()
      return json({ products, total: products.length })
    }

    // ---- INGREDIENTS ----
    if (path[0] === 'ingredients') {
      if (path[1]) {
        const ingredient = await database.collection('ingredients').findOne({ slug: path[1] }, NOID)
        if (!ingredient) return json({ error: 'Ingredient not found' }, 404)
        const products = await database.collection('products').find({ ingredients: path[1] }, NOID).toArray()
        return json({ ...ingredient, products })
      }
      const ingredients = await database.collection('ingredients').find({}, NOID).toArray()
      return json({ ingredients, total: ingredients.length })
    }

    // ---- BRANDS ----
    if (path[0] === 'brands') {
      if (path[1]) {
        const brand = await database.collection('brands').findOne({ slug: path[1] }, NOID)
        if (!brand) return json({ error: 'Brand not found' }, 404)
        const products = await database.collection('products').find({ brand_slug: path[1] }, NOID).toArray()
        return json({ ...brand, products })
      }
      const filter = {}
      if (q.german === 'true') filter.german = true
      const brands = await database.collection('brands').find(filter, NOID).toArray()
      return json({ brands, total: brands.length })
    }

    // ---- ARTICLES ----
    if (path[0] === 'articles') {
      if (path[1]) {
        const article = await database.collection('articles').findOne({ slug: path[1] }, NOID)
        if (!article) return json({ error: 'Article not found' }, 404)
        return json(article)
      }
      const filter = {}
      if (q.category) filter.category = q.category
      const articles = await database.collection('articles').find(filter, NOID).sort({ published_at: -1 }).toArray()
      return json({ articles, total: articles.length })
    }

    // ---- COMPARE ----
    if (path[0] === 'compare') {
      const a = await database.collection('products').findOne({ slug: q.a }, NOID)
      const b = await database.collection('products').findOne({ slug: q.b }, NOID)
      if (!a || !b) return json({ error: 'One or both products not found' }, 404)
      const commonIngredients = (a.ingredients || []).filter((i) => (b.ingredients || []).includes(i))
      const allSlugs = [...new Set([...(a.ingredients || []), ...(b.ingredients || [])])]
      const ingredientDetails = await database.collection('ingredients').find({ slug: { $in: allSlugs } }, NOID).toArray()
      return json({ a, b, common_ingredients: commonIngredients, ingredient_details: ingredientDetails })
    }

    // ---- ADMIN ----
    if (path[0] === 'admin') {
      const session = await requireAdmin(request, database)
      if (!session) return json({ error: 'Unauthorized' }, 401)
      if (path[1] === 'leads') {
        const leads = await database.collection('leads').find({}, NOID).sort({ created_at: -1 }).toArray()
        return json({ leads, total: leads.length })
      }
      if (path[1] === 'stats') {
        const [products, brands, ingredients, articles, leads] = await Promise.all([
          database.collection('products').countDocuments(),
          database.collection('brands').countDocuments(),
          database.collection('ingredients').countDocuments(),
          database.collection('articles').countDocuments(),
          database.collection('leads').countDocuments(),
        ])
        return json({ products, brands, ingredients, articles, leads })
      }
      return json({ error: 'Not found' }, 404)
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error('GET error', e)
    return json({ error: e.message }, 500)
  }
}

// ============ POST ============
export async function POST(request, { params }) {
  try {
    const { path = [] } = await params
    const database = await getDb()
    await seedIfEmpty(database)
    const body = await request.json().catch(() => ({}))

    // ---- PRODUCT FINDER ----
    if (path[0] === 'finder') {
      const { skin_type, concerns = [], budget = 'high', category } = body
      const filter = {}
      if (category) filter.category = category
      const products = await database.collection('products').find(filter, NOID).toArray()
      const budgetMax = budget === 'low' ? 15 : budget === 'mid' ? 25 : Infinity
      const maxScore = 30 + concerns.length * 25 + 10 + 20
      const scoredAll = products
        .map((p) => {
          let score = 0
          const reasons = []
          if (skin_type && (p.skin_types || []).includes(skin_type)) {
            score += 30
            reasons.push('skin_type')
          }
          const matched = (p.concerns || []).filter((c) => concerns.includes(c))
          score += matched.length * 25
          matched.forEach((c) => reasons.push(c))
          if (p.price_eur <= budgetMax) {
            score += 10
            reasons.push('budget')
          } else {
            score -= 20
          }
          score += Math.round((p.rating || 0) * 4)
          return {
            ...p, score, match_reasons: reasons, matched_concerns: matched,
            match_percent: Math.min(99, Math.max(5, Math.round((score / maxScore) * 100))),
          }
        })
        .sort((x, y) => y.score - x.score)

      // Build step-by-step morning/evening routine (best product per category)
      const bestOf = (cat, excludeSlugs = []) => scoredAll.find((p) => p.category === cat && !excludeSlugs.includes(p.slug)) || null
      const cleanser = bestOf('cleanser')
      const serumAM = bestOf('serum')
      const moisturizer = bestOf('moisturizer')
      const sunscreen = bestOf('sunscreen')
      const serumPM = bestOf('serum', serumAM ? [serumAM.slug] : []) || serumAM
      const morning = [
        cleanser && { order: 1, category: 'cleanser', product: cleanser },
        serumAM && { order: 2, category: 'serum', product: serumAM },
        moisturizer && { order: 3, category: 'moisturizer', product: moisturizer },
        sunscreen && { order: 4, category: 'sunscreen', product: sunscreen },
      ].filter(Boolean).map((s, idx) => ({ ...s, order: idx + 1 }))
      const evening = [
        cleanser && { order: 1, category: 'cleanser', product: cleanser },
        serumPM && { order: 2, category: 'serum', product: serumPM },
        moisturizer && { order: 3, category: 'moisturizer', product: moisturizer },
      ].filter(Boolean).map((s, idx) => ({ ...s, order: idx + 1 }))

      const routineSlugs = new Set([...morning, ...evening].map((s) => s.product.slug))
      const alternatives = scoredAll.filter((p) => !routineSlugs.has(p.slug) && p.score > 20).slice(0, 4)
      const results = scoredAll.filter((p) => p.score > 20).slice(0, 6)
      return json({ routine: { morning, evening }, alternatives, results, total: results.length })
    }

    // ---- LEADS ----
    if (path[0] === 'leads') {
      if (!body.email || !body.brand_name) return json({ error: 'brand_name and email are required' }, 400)
      const lead = {
        id: uuidv4(),
        brand_name: body.brand_name,
        contact_name: body.contact_name || '',
        email: body.email,
        message: body.message || '',
        created_at: new Date().toISOString(),
      }
      await database.collection('leads').insertOne({ ...lead })
      return json(lead, 201)
    }

    // ---- ADMIN LOGIN ----
    if (path[0] === 'admin' && path[1] === 'login') {
      const expected = process.env.ADMIN_PASSWORD || 'admin123'
      if (body.password !== expected) return json({ error: 'Invalid password' }, 401)
      const token = uuidv4()
      await database.collection('sessions').insertOne({ token, created_at: new Date().toISOString() })
      return json({ token })
    }

    // ---- ADMIN CREATE ----
    if (path[0] === 'admin' && ADMIN_COLLECTIONS.includes(path[1])) {
      const session = await requireAdmin(request, database)
      if (!session) return json({ error: 'Unauthorized' }, 401)
      if (!body.slug) return json({ error: 'slug is required' }, 400)
      const existing = await database.collection(path[1]).findOne({ slug: body.slug })
      if (existing) return json({ error: 'slug already exists' }, 409)
      const doc = { ...body, id: uuidv4(), created_at: new Date().toISOString() }
      await database.collection(path[1]).insertOne({ ...doc })
      delete doc._id
      return json(doc, 201)
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error('POST error', e)
    return json({ error: e.message }, 500)
  }
}

// ============ PUT ============
export async function PUT(request, { params }) {
  try {
    const { path = [] } = await params
    const database = await getDb()
    const body = await request.json().catch(() => ({}))

    if (path[0] === 'admin' && ADMIN_COLLECTIONS.includes(path[1]) && path[2]) {
      const session = await requireAdmin(request, database)
      if (!session) return json({ error: 'Unauthorized' }, 401)
      delete body._id
      delete body.id
      const result = await database.collection(path[1]).updateOne({ id: path[2] }, { $set: { ...body, updated_at: new Date().toISOString() } })
      if (result.matchedCount === 0) return json({ error: 'Not found' }, 404)
      const updated = await database.collection(path[1]).findOne({ id: path[2] }, NOID)
      return json(updated)
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error('PUT error', e)
    return json({ error: e.message }, 500)
  }
}

// ============ DELETE ============
export async function DELETE(request, { params }) {
  try {
    const { path = [] } = await params
    const database = await getDb()

    if (path[0] === 'admin' && [...ADMIN_COLLECTIONS, 'leads'].includes(path[1]) && path[2]) {
      const session = await requireAdmin(request, database)
      if (!session) return json({ error: 'Unauthorized' }, 401)
      const result = await database.collection(path[1]).deleteOne({ id: path[2] })
      if (result.deletedCount === 0) return json({ error: 'Not found' }, 404)
      return json({ success: true })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) {
    console.error('DELETE error', e)
    return json({ error: e.message }, 500)
  }
}
