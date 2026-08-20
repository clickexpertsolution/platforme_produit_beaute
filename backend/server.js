import express from 'express'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { LlmChat, UserMessage } from 'emergentintegrations'
import { SEED_HUBS } from './lib/seed-hubs.js'

const app = express()
app.use(express.json())

// ============ CORS ============
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '*').split(',').map((o) => o.trim())

app.use((req, res, next) => {
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).json({})
  next()
})

// ============ DATABASE ============
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

function send(res, data, status = 200) {
  res.status(status).json(data)
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
  h1: 'https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?crop=entropy&cs=srgb&fm=jpg&q=85',
  h2: 'https://images.pexels.com/photos/7440056/pexels-photo-7440056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  h3: 'https://images.unsplash.com/photo-1701992678972-d5a053ad0fb0?crop=entropy&cs=srgb&fm=jpg&q=85',
  h4: 'https://images.unsplash.com/photo-1608571423539-e951b9b3871e?crop=entropy&cs=srgb&fm=jpg&q=85',
  h5: 'https://images.pexels.com/photos/4408447/pexels-photo-4408447.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  w1: 'https://images.unsplash.com/photo-1664956618021-73c47736845e?crop=entropy&cs=srgb&fm=jpg&q=85',
  w2: 'https://images.unsplash.com/photo-1624362772755-4d5843e67047?crop=entropy&cs=srgb&fm=jpg&q=85',
  w3: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?crop=entropy&cs=srgb&fm=jpg&q=85',
  w4: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?crop=entropy&cs=srgb&fm=jpg&q=85',
  w5: 'https://images.unsplash.com/photo-1605040056130-38d9faad3534?crop=entropy&cs=srgb&fm=jpg&q=85',
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
  { slug: 'eucerin-vitamin-c-booster', name: 'Hyaluron-Filler Vitamine C Booster', brand_slug: 'eucerin', brand_name: 'Eucerin', category: 'serum', price_eur: 22.9, rating: 4.5, image: IMG.p7, german_made: true, concerns: ['aging', 'pigmentation'], skin_types: ['normal', 'dry', 'combination', 'oily'], ingredients: ['vitamine-c', 'acide-hyaluronique', 'glycerine'], affiliate_url: 'https://www.eucerin.com', description: { fr: "Booster fraîchement activé à 10% de vitamine C pure et acide hyaluronique. Éclat immédiat, teint plus uniforme en 7 jours.", en: "Freshly activated booster with 10% pure vitamin C and hyaluronic acid. Immediate glow, more even skin tone in 7 days." } },
  { slug: 'borlind-retinol-nature-serum', name: 'Sérum Rétinol Nature', brand_slug: 'annemarie-borlind', brand_name: 'Annemarie Börlind', category: 'serum', price_eur: 39.9, rating: 4.2, image: IMG.p6, german_made: true, concerns: ['aging', 'pigmentation'], skin_types: ['normal', 'dry', 'combination'], ingredients: ['retinol', 'squalane', 'glycerine'], affiliate_url: 'https://www.boerlind.com', description: { fr: "Sérum de nuit au rétinol végétal stabilisé et squalane. Lisse les rides et affine le grain de peau. À introduire progressivement, toujours avec un SPF le matin.", en: "Night serum with stabilized plant-based retinol and squalane. Smooths wrinkles and refines skin texture. Introduce gradually, always with SPF in the morning." } },
]

const SEED_ARTICLES = [
  { slug: 'comprendre-peau-sensible', category: 'learn', image: IMG.p4, published_at: '2025-05-12', title: { fr: 'Comprendre la peau sensible : causes, signes et solutions', en: 'Understanding sensitive skin: causes, signs and solutions' }, excerpt: { fr: "Rougeurs, tiraillements, picotements... La peau sensible touche près d'une personne sur deux. Voici comment la reconnaître et en prendre soin.", en: "Redness, tightness, tingling... Sensitive skin affects nearly one in two people. Here's how to recognize and care for it." }, content: { fr: "La peau sensible n'est pas un type de peau mais un état : une réactivité excessive aux facteurs externes (froid, pollution, cosmétiques) ou internes (stress, hormones). Elle se manifeste par des rougeurs, tiraillements, picotements ou échauffements.\n\nLa cause principale est une barrière cutanée fragilisée : le film hydrolipidique et les lipides intercellulaires (céramides, cholestérol, acides gras) ne jouent plus leur rôle de bouclier, laissant pénétrer les irritants et s'échapper l'eau.\n\nPour en prendre soin : privilégiez des nettoyants doux sans savon au pH physiologique (5.5), des formules courtes sans parfum ni alcool, et des actifs réparateurs comme le panthénol, les céramides et l'acide hyaluronique.\n\nLes marques dermatologiques allemandes comme Sebamed ont bâti leur réputation sur le respect du pH 5.5, précisément pour préserver ce manteau acide protecteur. En cas de réactivité persistante, consultez un dermatologue pour écarter une rosacée ou une dermatite.", en: "Sensitive skin is not a skin type but a condition: an excessive reactivity to external factors (cold, pollution, cosmetics) or internal ones (stress, hormones). It shows as redness, tightness, tingling or burning sensations.\n\nThe main cause is a weakened skin barrier: the hydrolipidic film and intercellular lipids (ceramides, cholesterol, fatty acids) no longer act as a shield, letting irritants in and water out.\n\nTo care for it: choose gentle soap-free cleansers at physiological pH (5.5), short formulas without fragrance or alcohol, and repairing actives such as panthenol, ceramides and hyaluronic acid.\n\nGerman dermatological brands like Sebamed built their reputation on respecting pH 5.5, precisely to preserve this protective acid mantle. If reactivity persists, see a dermatologist to rule out rosacea or dermatitis." } },
  { slug: 'routine-skincare-debutant', category: 'guide', image: IMG.p7, published_at: '2025-05-20', title: { fr: 'Construire sa première routine skincare en 3 étapes', en: 'Building your first skincare routine in 3 steps' }, excerpt: { fr: "Pas besoin de 10 produits pour bien commencer. Nettoyant, hydratant, SPF : la routine minimaliste validée par les dermatologues.", en: "You don't need 10 products to start well. Cleanser, moisturizer, SPF: the minimalist routine approved by dermatologists." }, content: { fr: "La règle d'or d'une première routine : la simplicité. Trois produits suffisent pour couvrir 90% des besoins de la peau.\n\nÉtape 1 — Nettoyer : matin et soir, avec un nettoyant doux adapté à votre type de peau. Gel purifiant pour les peaux grasses, lait ou crème pour les peaux sèches et sensibles.\n\nÉtape 2 — Hydrater : toutes les peaux, même grasses, ont besoin d'hydratation. Cherchez glycérine, acide hyaluronique et céramides. Texture gel pour les peaux grasses, crème riche pour les peaux sèches.\n\nÉtape 3 — Protéger : le SPF quotidien est le meilleur geste anti-âge qui existe. SPF 30 minimum, 50 idéalement, chaque matin, même par temps couvert.\n\nUne fois cette base maîtrisée pendant 4 à 6 semaines, vous pouvez introduire UN actif ciblé (niacinamide, vitamine C, rétinol...) selon votre préoccupation principale. Notre Product Finder peut vous aider à choisir.", en: "The golden rule of a first routine: simplicity. Three products cover 90% of your skin's needs.\n\nStep 1 — Cleanse: morning and evening, with a gentle cleanser suited to your skin type. Purifying gel for oily skin, milk or cream for dry and sensitive skin.\n\nStep 2 — Moisturize: every skin, even oily, needs hydration. Look for glycerin, hyaluronic acid and ceramides. Gel texture for oily skin, rich cream for dry skin.\n\nStep 3 — Protect: daily SPF is the single best anti-aging habit. SPF 30 minimum, ideally 50, every morning, even on cloudy days.\n\nOnce this base is mastered for 4 to 6 weeks, you can introduce ONE targeted active (niacinamide, vitamin C, retinol...) based on your main concern. Our Product Finder can help you choose." } },
  { slug: 'lire-liste-inci', category: 'learn', image: IMG.p6, published_at: '2025-06-01', title: { fr: 'Comment lire une liste INCI comme un pro', en: 'How to read an INCI list like a pro' }, excerpt: { fr: "La liste INCI révèle tout ce que contient votre cosmétique. Apprenez à la décrypter en 5 minutes.", en: "The INCI list reveals everything your cosmetic contains. Learn to decode it in 5 minutes." }, content: { fr: "INCI signifie International Nomenclature of Cosmetic Ingredients : c'est la liste obligatoire et standardisée des ingrédients, présente sur tout cosmétique vendu en Europe.\n\nRègle n°1 : les ingrédients sont classés par ordre décroissant de concentration jusqu'à 1%. Les 5 premiers ingrédients représentent souvent plus de 80% de la formule.\n\nRègle n°2 : en dessous de 1%, l'ordre est libre. Un actif cité en fin de liste peut donc être présent à une concentration efficace... ou symbolique.\n\nRègle n°3 : les noms latins désignent des extraits végétaux (Aloe Barbadensis = aloe vera), les noms anglais des molécules (Sodium Hyaluronate = acide hyaluronique).\n\nSur notre plateforme, chaque fiche produit détaille les actifs clés avec leur niveau de preuve scientifique, pour que vous n'ayez plus jamais à déchiffrer seul une étiquette.", en: "INCI stands for International Nomenclature of Cosmetic Ingredients: the mandatory, standardized ingredient list found on every cosmetic sold in Europe.\n\nRule #1: ingredients are listed in descending order of concentration down to 1%. The first 5 ingredients often make up more than 80% of the formula.\n\nRule #2: below 1%, the order is free. An active listed at the end may be present at an effective concentration... or a symbolic one.\n\nRule #3: Latin names refer to plant extracts (Aloe Barbadensis = aloe vera), English names to molecules (Sodium Hyaluronate = hyaluronic acid).\n\nOn our platform, every product page details the key actives with their level of scientific evidence, so you never have to decode a label alone again." } },
  { slug: 'niacinamide-que-dit-la-science', category: 'research', image: IMG.p8, published_at: '2025-06-10', title: { fr: 'Niacinamide : que dit vraiment la science ?', en: 'Niacinamide: what does the science really say?' }, excerpt: { fr: "Actif star des réseaux sociaux, la niacinamide est-elle à la hauteur ? Revue des études cliniques.", en: "Social media's star active — does niacinamide live up to the hype? A review of clinical studies." }, content: { fr: "La niacinamide (vitamine B3) est l'un des actifs cosmétiques les plus étudiés, avec plusieurs dizaines d'essais cliniques randomisés publiés.\n\nCe qui est solidement démontré : à 2-5%, elle réduit la production de sébum (étude de Draelos, 2006), améliore la barrière cutanée en stimulant la synthèse de céramides (Tanno, 2000), et atténue les hyperpigmentations en bloquant le transfert de mélanosomes (Hakozaki, 2002).\n\nCe qui est plausible mais moins prouvé : la réduction des pores visibles et des rides, observée dans des études plus petites ou financées par les industriels.\n\nCe qui est faux : le mythe selon lequel niacinamide et vitamine C ne peuvent pas être combinées. Cette croyance repose sur des études des années 1960 dans des conditions non réalistes (hautes températures).\n\nVerdict : un actif polyvalent, très bien toléré, au rapport bénéfice/risque excellent. À 5%, c'est l'un des meilleurs premiers actifs à introduire dans une routine.", en: "Niacinamide (vitamin B3) is one of the most studied cosmetic actives, with dozens of published randomized clinical trials.\n\nWhat is solidly proven: at 2-5%, it reduces sebum production (Draelos, 2006), improves the skin barrier by boosting ceramide synthesis (Tanno, 2000), and fades hyperpigmentation by blocking melanosome transfer (Hakozaki, 2002).\n\nWhat is plausible but less proven: the reduction of visible pores and wrinkles, observed in smaller or industry-funded studies.\n\nWhat is false: the myth that niacinamide and vitamin C cannot be combined. This belief is based on 1960s studies under unrealistic conditions (high temperatures).\n\nVerdict: a versatile, very well-tolerated active with an excellent benefit/risk ratio. At 5%, it is one of the best first actives to introduce into a routine." } },
]

const BRAND_EXTRAS = {
  sebamed: { manufacturer: 'Sebapharma GmbH & Co. KG', certifications: ['Made in Germany', 'pH 5.5', 'Dermatologiquement testé'], verticals: ['skincare', 'hair'] },
  eucerin: { manufacturer: 'Beiersdorf AG', certifications: ['Made in Germany', 'Dermatologiquement testé', 'Non comédogène'], verticals: ['skincare', 'hair'] },
  nivea: { manufacturer: 'Beiersdorf AG', certifications: ['Made in Germany', 'Dermatologiquement testé'], verticals: ['skincare'] },
  'dr-hauschka': { manufacturer: 'WALA Heilmittel GmbH', certifications: ['NATRUE', 'Made in Germany', 'Cosmétique biologique'], verticals: ['skincare'] },
  'annemarie-borlind': { manufacturer: 'Börlind GmbH', certifications: ['Vegan', 'Sans cruauté', 'Made in Germany'], verticals: ['skincare'] },
  weleda: { manufacturer: 'Weleda AG', certifications: ['NATRUE', 'UEBT', 'B Corp'], verticals: ['skincare', 'hair'] },
}

const NEW_BRANDS = [
  { slug: 'alpecin', name: 'Alpecin', country: 'Allemagne', german: true, founded: 1930, city: 'Bielefeld', website: 'https://www.alpecin.com', manufacturer: 'Dr. Kurt Wolff GmbH & Co. KG', certifications: ['Made in Germany', 'Dermatologiquement testé'], verticals: ['hair'], description: { fr: "Marque du laboratoire Dr. Kurt Wolff (Bielefeld), Alpecin est le pionnier de la recherche sur la caféine appliquée au cuir chevelu. Ses shampoings à la caféine, développés avec des universités allemandes, ciblent la chute de cheveux héréditaire.", en: "A brand from the Dr. Kurt Wolff laboratory (Bielefeld), Alpecin pioneered research on caffeine applied to the scalp. Its caffeine shampoos, developed with German universities, target hereditary hair loss." } },
  { slug: 'schwarzkopf', name: 'Schwarzkopf', country: 'Allemagne', german: true, founded: 1898, city: 'Düsseldorf', website: 'https://www.schwarzkopf.com', manufacturer: 'Henkel AG & Co. KGaA', certifications: ['Made in Germany', 'Testé sous contrôle dermatologique'], verticals: ['hair'], description: { fr: "Fondée à Berlin en 1898, Schwarzkopf (groupe Henkel) est l'une des marques capillaires les plus vendues au monde. Sa gamme Gliss répare les cheveux abîmés grâce à des technologies de kératine issues de la recherche allemande.", en: "Founded in Berlin in 1898, Schwarzkopf (Henkel group) is one of the world's best-selling hair care brands. Its Gliss range repairs damaged hair with keratin technologies from German research." } },
  { slug: 'doppelherz', name: 'Doppelherz', country: 'Allemagne', german: true, founded: 1919, city: 'Flensburg', website: 'https://www.doppelherz.com', manufacturer: 'Queisser Pharma GmbH & Co. KG', certifications: ['Made in Germany', 'GMP', 'ISO 9001'], verticals: ['wellness'], description: { fr: "Marque n°1 des compléments alimentaires en Allemagne, Doppelherz (Queisser Pharma, Flensburg) propose depuis 1919 des vitamines et minéraux dosés selon les recommandations scientifiques, fabriqués selon les normes pharmaceutiques allemandes.", en: "Germany's #1 food supplement brand, Doppelherz (Queisser Pharma, Flensburg) has offered since 1919 vitamins and minerals dosed according to scientific recommendations, manufactured to German pharmaceutical standards." } },
  { slug: 'kneipp', name: 'Kneipp', country: 'Allemagne', german: true, founded: 1891, city: 'Würzburg', website: 'https://www.kneipp.com', manufacturer: 'Kneipp GmbH', certifications: ['Made in Germany', 'Vegan (majorité)', 'Site neutre en carbone'], verticals: ['wellness'], description: { fr: "Héritière de la philosophie naturopathe de Sebastian Kneipp (1891), la marque Kneipp allie plantes médicinales et science moderne : huiles de bain, compléments et soins bien-être fabriqués à Würzburg.", en: "Heir to Sebastian Kneipp's naturopathic philosophy (1891), the Kneipp brand combines medicinal plants and modern science: bath oils, supplements and wellness products made in Würzburg." } },
  { slug: 'salus', name: 'Salus', country: 'Allemagne', german: true, founded: 1916, city: 'Bruckmühl', website: 'https://www.salus.de', manufacturer: 'SALUS Haus GmbH & Co. KG', certifications: ['Bio (EU Organic)', 'Made in Germany', 'Demeter (sélection)'], verticals: ['wellness'], description: { fr: "Pionnier bavarois de la phytothérapie depuis 1916, Salus produit toniques, tisanes et extraits de plantes certifiés bio, dont le célèbre Floradix. Production écologique à Bruckmühl, en Bavière.", en: "A Bavarian phytotherapy pioneer since 1916, Salus produces certified organic tonics, herbal teas and plant extracts, including the famous Floradix. Ecological production in Bruckmühl, Bavaria." } },
]

const NEW_INGREDIENTS = [
  { slug: 'cafeine', name: 'Caféine', inci: 'Caffeine', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['hair-loss', 'energy'], description: { fr: "Appliquée sur le cuir chevelu, la caféine stimule la microcirculation et pénètre jusqu'au follicule pileux en 2 minutes. Des études in vitro montrent qu'elle contrecarre l'effet de la DHT, hormone impliquée dans la chute héréditaire.", en: "Applied to the scalp, caffeine stimulates microcirculation and reaches the hair follicle within 2 minutes. In vitro studies show it counteracts DHT, the hormone involved in hereditary hair loss." }, benefits: { fr: ['Stimule la microcirculation du cuir chevelu', 'Contrecarre la DHT (in vitro)', 'Énergise la racine du cheveu', 'Bien toléré au quotidien'], en: ['Stimulates scalp microcirculation', 'Counteracts DHT (in vitro)', 'Energizes the hair root', 'Well tolerated daily'] }, regulatory: { fr: "Autorisée sans restriction dans les cosmétiques UE (Règlement CE 1223/2009). Les preuves cliniques sur la chute de cheveux restent de niveau modéré.", en: "Authorized without restriction in EU cosmetics (Regulation EC 1223/2009). Clinical evidence on hair loss remains moderate." } },
  { slug: 'romarin', name: 'Huile de Romarin', inci: 'Rosmarinus Officinalis Leaf Oil', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['hair-loss', 'dandruff'], description: { fr: "Huile essentielle traditionnelle du soin capillaire. Une étude randomisée de 2015 a montré une efficacité comparable au minoxidil 2% sur l'alopécie androgénétique après 6 mois, avec moins d'irritation du cuir chevelu.", en: "A traditional hair care essential oil. A 2015 randomized study showed efficacy comparable to minoxidil 2% on androgenetic alopecia after 6 months, with less scalp irritation." }, benefits: { fr: ['Favorise la croissance capillaire', 'Améliore la circulation locale', 'Purifie le cuir chevelu', 'Alternative naturelle étudiée'], en: ['Supports hair growth', 'Improves local circulation', 'Purifies the scalp', 'A studied natural alternative'] }, regulatory: { fr: "Huile essentielle autorisée en cosmétique UE. Contient des allergènes naturels (limonène, linalol) à déclarer sur l'étiquette INCI.", en: "Essential oil authorized in EU cosmetics. Contains natural allergens (limonene, linalool) that must be declared on the INCI label." } },
  { slug: 'piroctone-olamine', name: 'Piroctone Olamine', inci: 'Piroctone Olamine', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['dandruff'], description: { fr: "Actif antipelliculaire de référence, alternative moderne au zinc pyrithione (interdit en UE depuis 2022). Il régule la prolifération de Malassezia, la levure responsable des pellicules, tout en étant doux pour le cuir chevelu.", en: "The reference anti-dandruff active, a modern alternative to zinc pyrithione (banned in the EU since 2022). It controls the growth of Malassezia, the yeast behind dandruff, while staying gentle on the scalp." }, benefits: { fr: ['Élimine les pellicules efficacement', 'Régule la levure Malassezia', 'Apaise les démangeaisons', 'Doux pour un usage fréquent'], en: ['Effectively removes dandruff', 'Controls Malassezia yeast', 'Soothes itching', 'Gentle for frequent use'] }, regulatory: { fr: "Conservateur/actif autorisé en UE (max 1% dans les produits rincés). A remplacé le zinc pyrithione, classé CMR et interdit en 2022.", en: "Active/preservative authorized in the EU (max 1% in rinse-off products). Replaced zinc pyrithione, classified CMR and banned in 2022." } },
  { slug: 'biotine', name: 'Biotine (Vitamine B8)', inci: 'Biotin', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['hair-loss', 'energy'], description: { fr: "Vitamine essentielle au métabolisme de la kératine. Une carence provoque chute de cheveux et ongles cassants ; la supplémentation n'a d'effet démontré qu'en cas de déficit avéré.", en: "A vitamin essential to keratin metabolism. Deficiency causes hair loss and brittle nails; supplementation has proven effects only in cases of actual deficiency." }, benefits: { fr: ['Contribue au maintien de cheveux normaux', 'Soutient le métabolisme énergétique', 'Renforce les ongles', 'Sûre aux doses usuelles'], en: ['Contributes to maintenance of normal hair', 'Supports energy metabolism', 'Strengthens nails', 'Safe at usual doses'] }, regulatory: { fr: "Allégation EFSA autorisée : « contribue au maintien de cheveux normaux » (Règlement UE 432/2012). Dose journalière de référence : 50 µg.", en: "Authorized EFSA claim: 'contributes to the maintenance of normal hair' (EU Regulation 432/2012). Reference daily dose: 50 µg." } },
  { slug: 'uree', name: 'Urée', inci: 'Urea', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['dryness', 'dry-hair', 'sensitive-scalp'], description: { fr: "Composant naturel du facteur naturel d'hydratation (NMF) de la peau. À 5%, elle hydrate intensément peau et cuir chevelu ; au-delà de 10%, elle devient kératolytique et lisse les zones rugueuses.", en: "A natural component of the skin's Natural Moisturizing Factor (NMF). At 5%, it intensely hydrates skin and scalp; above 10%, it becomes keratolytic and smooths rough areas." }, benefits: { fr: ['Hydratation profonde et durable', 'Apaise cuir chevelu sec et irrité', 'Kératolytique à forte dose', 'Référence dermatologique allemande'], en: ['Deep, lasting hydration', 'Soothes dry, irritated scalp', 'Keratolytic at high doses', 'A German dermatology reference'] }, regulatory: { fr: "Autorisée sans restriction en cosmétique UE. Très utilisée par les marques dermatologiques allemandes (Eucerin UreaRepair).", en: "Authorized without restriction in EU cosmetics. Widely used by German dermatological brands (Eucerin UreaRepair)." } },
  { slug: 'magnesium', name: 'Magnésium', inci: 'Magnesium', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['stress', 'sleep', 'energy'], description: { fr: "Minéral impliqué dans plus de 300 réactions enzymatiques. Il contribue à réduire la fatigue et au fonctionnement normal du système nerveux. Les formes citrate et bisglycinate sont les mieux absorbées.", en: "A mineral involved in over 300 enzymatic reactions. It helps reduce fatigue and supports normal nervous system function. Citrate and bisglycinate forms are best absorbed." }, benefits: { fr: ['Réduit la fatigue (allégation EFSA)', 'Soutient le système nerveux', 'Contribue à la fonction musculaire', 'Aide en période de stress'], en: ['Reduces fatigue (EFSA claim)', 'Supports the nervous system', 'Contributes to muscle function', 'Helps during stress periods'] }, regulatory: { fr: "Allégations EFSA autorisées : réduction de la fatigue, fonctionnement normal du système nerveux et des muscles (Règlement UE 432/2012). VNR : 375 mg/jour.", en: "Authorized EFSA claims: reduction of fatigue, normal nervous system and muscle function (EU Regulation 432/2012). NRV: 375 mg/day." } },
  { slug: 'melatonine', name: 'Mélatonine', inci: 'Melatonin', safety: 'caution', evidence: 'strong', comedogenic: 0, good_for: ['sleep'], description: { fr: "Hormone naturelle du sommeil sécrétée par la glande pinéale. En complément, 1 mg avant le coucher réduit le temps d'endormissement — allégation officiellement reconnue par l'EFSA. À éviter chez la femme enceinte.", en: "The natural sleep hormone secreted by the pineal gland. As a supplement, 1 mg before bedtime reduces sleep onset time — an officially recognized EFSA claim. Avoid during pregnancy." }, benefits: { fr: ["Réduit le temps d'endormissement", 'Aide en cas de décalage horaire', 'Non accoutumante aux doses usuelles', 'Effet dès 1 mg'], en: ['Reduces time to fall asleep', 'Helps with jet lag', 'Non habit-forming at usual doses', 'Effective from 1 mg'] }, regulatory: { fr: "Allégation EFSA autorisée à 1 mg : « contribue à réduire le temps d'endormissement ». En Allemagne, certains dosages relèvent du médicament.", en: "EFSA claim authorized at 1 mg: 'contributes to reducing sleep onset time'. In Germany, some dosages are classified as medicinal." } },
  { slug: 'valeriane', name: 'Valériane', inci: 'Valeriana Officinalis Root Extract', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['sleep', 'stress'], description: { fr: "Racine utilisée depuis l'Antiquité pour favoriser détente et sommeil. Les méta-analyses suggèrent une amélioration subjective de la qualité du sommeil, avec un excellent profil de tolérance.", en: "A root used since antiquity to promote relaxation and sleep. Meta-analyses suggest a subjective improvement in sleep quality, with an excellent tolerance profile." }, benefits: { fr: ['Favorise la détente nerveuse', 'Améliore la qualité du sommeil perçue', 'Sans dépendance', 'Usage traditionnel reconnu'], en: ['Promotes nervous relaxation', 'Improves perceived sleep quality', 'No dependence', 'Recognized traditional use'] }, regulatory: { fr: "Usage traditionnel reconnu par la monographie HMPC (Agence européenne des médicaments) pour la tension nerveuse légère et les troubles du sommeil.", en: "Traditional use recognized by the HMPC monograph (European Medicines Agency) for mild nervous tension and sleep disorders." } },
  { slug: 'lavande', name: 'Huile de Lavande', inci: 'Lavandula Angustifolia Oil', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['sleep', 'stress', 'sensitive'], description: { fr: "Huile essentielle apaisante de référence. Des essais cliniques (notamment sur le Silexan allemand) montrent un effet anxiolytique léger par voie orale et une amélioration de la relaxation en aromathérapie et en bain.", en: "The reference calming essential oil. Clinical trials (notably on German Silexan) show a mild anxiolytic effect orally and improved relaxation in aromatherapy and bathing." }, benefits: { fr: ['Apaise et détend', 'Favorise un sommeil serein', 'Parfum naturel relaxant', 'Étudiée cliniquement (Silexan)'], en: ['Calms and relaxes', 'Promotes restful sleep', 'Natural relaxing scent', 'Clinically studied (Silexan)'] }, regulatory: { fr: "Autorisée en cosmétique UE ; allergènes naturels (linalol) à déclarer. En Allemagne, l'extrait Silexan est enregistré comme médicament de phytothérapie.", en: "Authorized in EU cosmetics; natural allergens (linalool) must be declared. In Germany, the Silexan extract is registered as a herbal medicine." } },
  { slug: 'vitamine-d3', name: 'Vitamine D3', inci: 'Cholecalciferol', safety: 'green', evidence: 'strong', comedogenic: 0, good_for: ['immunity', 'energy'], description: { fr: "Vitamine synthétisée par la peau sous l'action des UVB, souvent déficitaire en hiver. Elle contribue au fonctionnement normal du système immunitaire et au maintien d'une ossature normale.", en: "A vitamin synthesized by the skin under UVB, often deficient in winter. It contributes to normal immune system function and the maintenance of normal bones." }, benefits: { fr: ['Soutient le système immunitaire', 'Contribue à la santé osseuse', 'Aide à la fonction musculaire', 'Essentielle en hiver'], en: ['Supports the immune system', 'Contributes to bone health', 'Aids muscle function', 'Essential in winter'] }, regulatory: { fr: "Allégations EFSA autorisées : immunité, os, muscles (Règlement UE 432/2012). VNR : 5 µg/jour ; dose max recommandée BfR (Allemagne) : 20 µg/jour.", en: "Authorized EFSA claims: immunity, bones, muscles (EU Regulation 432/2012). NRV: 5 µg/day; German BfR recommended max: 20 µg/day." } },
  { slug: 'fer', name: 'Fer', inci: 'Iron', safety: 'caution', evidence: 'strong', comedogenic: 0, good_for: ['energy'], description: { fr: "Minéral indispensable au transport de l'oxygène par l'hémoglobine. La carence en fer — fréquente chez les femmes — provoque fatigue et chute de cheveux diffuse. Les formes liquides (gluconate) sont bien tolérées.", en: "A mineral essential for oxygen transport by hemoglobin. Iron deficiency — common in women — causes fatigue and diffuse hair loss. Liquid forms (gluconate) are well tolerated." }, benefits: { fr: ['Réduit la fatigue (allégation EFSA)', "Soutient le transport de l'oxygène", 'Aide la fonction cognitive', 'Important pour les cheveux'], en: ['Reduces fatigue (EFSA claim)', 'Supports oxygen transport', 'Aids cognitive function', 'Important for hair'] }, regulatory: { fr: "Allégation EFSA autorisée : réduction de la fatigue. Ne pas dépasser les doses recommandées sans avis médical (risque de surcharge). VNR : 14 mg/jour.", en: "Authorized EFSA claim: reduction of fatigue. Do not exceed recommended doses without medical advice (overload risk). NRV: 14 mg/day." } },
  { slug: 'fenouil', name: 'Fenouil', inci: 'Foeniculum Vulgare Fruit Extract', safety: 'green', evidence: 'moderate', comedogenic: 0, good_for: ['digestion'], description: { fr: "Graine aromatique traditionnellement utilisée pour soulager ballonnements et inconfort digestif. Son huile essentielle (anéthole) détend les muscles lisses de l'intestin.", en: "An aromatic seed traditionally used to relieve bloating and digestive discomfort. Its essential oil (anethole) relaxes the smooth muscles of the gut." }, benefits: { fr: ['Soulage les ballonnements', 'Facilite la digestion', 'Doux, adapté au quotidien', 'Usage traditionnel reconnu'], en: ['Relieves bloating', 'Aids digestion', 'Gentle for daily use', 'Recognized traditional use'] }, regulatory: { fr: "Usage traditionnel reconnu par la monographie HMPC pour les troubles digestifs légers (spasmes, ballonnements).", en: "Traditional use recognized by the HMPC monograph for mild digestive complaints (spasms, bloating)." } },
]

const NEW_PRODUCTS = [
  { slug: 'alpecin-caffeine-shampoo-c1', name: 'Shampoing Caféine C1', brand_slug: 'alpecin', brand_name: 'Alpecin', vertical: 'hair', category: 'shampoo', price_eur: 8.9, rating: 4.3, image: IMG.h3, german_made: true, concerns: ['hair-loss'], skin_types: [], ingredients: ['cafeine', 'zinc-pca'], affiliate_url: 'https://www.alpecin.com', description: { fr: "Le shampoing à la caféine le plus vendu d'Allemagne. Le complexe caféine atteint le follicule en 120 secondes et énergise la racine pour freiner la chute héréditaire. Usage quotidien.", en: "Germany's best-selling caffeine shampoo. The caffeine complex reaches the follicle in 120 seconds and energizes the root to slow hereditary hair loss. Daily use." } },
  { slug: 'alpecin-liquid-hair-energizer', name: 'Caffeine Liquid — Tonique Cuir Chevelu', brand_slug: 'alpecin', brand_name: 'Alpecin', vertical: 'hair', category: 'scalp-serum', price_eur: 9.9, rating: 4.2, image: IMG.h5, german_made: true, concerns: ['hair-loss'], skin_types: [], ingredients: ['cafeine'], affiliate_url: 'https://www.alpecin.com', description: { fr: "Tonique sans rinçage à appliquer sur le cuir chevelu après le shampoing. La caféine agit 24h sur la racine. Idéal en complément du shampoing C1.", en: "Leave-in tonic applied to the scalp after shampooing. Caffeine works on the root for 24h. Ideal alongside the C1 shampoo." } },
  { slug: 'schwarzkopf-gliss-total-repair-shampoo', name: 'Gliss Total Repair Shampoing', brand_slug: 'schwarzkopf', brand_name: 'Schwarzkopf', vertical: 'hair', category: 'shampoo', price_eur: 5.5, rating: 4.1, image: IMG.h1, german_made: true, concerns: ['dry-hair'], skin_types: [], ingredients: ['panthenol', 'glycerine'], affiliate_url: 'https://www.schwarzkopf.com', description: { fr: "Shampoing réparateur à la kératine liquide pour cheveux secs et abîmés. Reconstruit la fibre capillaire et réduit la casse dès le premier lavage.", en: "Repairing shampoo with liquid keratin for dry, damaged hair. Rebuilds the hair fiber and reduces breakage from the first wash." } },
  { slug: 'schwarzkopf-gliss-ultimate-repair-masque', name: 'Gliss Ultimate Repair Masque', brand_slug: 'schwarzkopf', brand_name: 'Schwarzkopf', vertical: 'hair', category: 'hair-treatment', price_eur: 6.9, rating: 4.4, image: IMG.h2, german_made: true, concerns: ['dry-hair'], skin_types: [], ingredients: ['panthenol', 'glycerine'], affiliate_url: 'https://www.schwarzkopf.com', description: { fr: "Masque intensif 4 minutes pour cheveux très abîmés. La technologie kératine + panthénol comble les brèches de la fibre et redonne souplesse et brillance.", en: "4-minute intensive mask for very damaged hair. Keratin + panthenol technology fills gaps in the fiber and restores softness and shine." } },
  { slug: 'sebamed-anti-dandruff-shampoo', name: 'Shampoing Antipelliculaire pH 5.5', brand_slug: 'sebamed', brand_name: 'Sebamed', vertical: 'hair', category: 'shampoo', price_eur: 9.5, rating: 4.3, image: IMG.h1, german_made: true, concerns: ['dandruff', 'sensitive-scalp'], skin_types: [], ingredients: ['piroctone-olamine', 'panthenol'], affiliate_url: 'https://www.sebamed.com', description: { fr: "Shampoing antipelliculaire à la piroctone olamine et au pH 5.5. Élimine jusqu'à 100% des pellicules visibles en respectant le microbiome du cuir chevelu sensible.", en: "Anti-dandruff shampoo with piroctone olamine at pH 5.5. Removes up to 100% of visible dandruff while respecting the sensitive scalp microbiome." } },
  { slug: 'eucerin-dermocapillaire-uree', name: 'DermoCapillaire Shampoing Calmant 5% Urée', brand_slug: 'eucerin', brand_name: 'Eucerin', vertical: 'hair', category: 'shampoo', price_eur: 13.5, rating: 4.5, image: IMG.h3, german_made: true, concerns: ['sensitive-scalp', 'dry-hair'], skin_types: [], ingredients: ['uree', 'glycerine'], affiliate_url: 'https://www.eucerin.com', description: { fr: "Shampoing dermatologique à 5% d'urée pour cuir chevelu sec, irrité et qui démange. Sans parfum, apaise durablement dès les premières utilisations.", en: "Dermatological shampoo with 5% urea for dry, irritated, itchy scalp. Fragrance-free, provides lasting relief from the first uses." } },
  { slug: 'weleda-huile-cheveux-romarin', name: 'Huile Capillaire Revitalisante au Romarin', brand_slug: 'weleda', brand_name: 'Weleda', vertical: 'hair', category: 'hair-treatment', price_eur: 11.9, rating: 4.4, image: IMG.h4, german_made: false, concerns: ['dry-hair', 'hair-loss'], skin_types: [], ingredients: ['romarin'], affiliate_url: 'https://www.weleda.com', description: { fr: "Huile de soin traditionnelle au romarin bio qui fortifie les cheveux, nourrit les longueurs sèches et revitalise le cuir chevelu. Certifiée NATRUE.", en: "Traditional care oil with organic rosemary that strengthens hair, nourishes dry lengths and revitalizes the scalp. NATRUE certified." } },
  { slug: 'sebamed-everyday-shampoo', name: 'Shampoing Usage Fréquent pH 5.5', brand_slug: 'sebamed', brand_name: 'Sebamed', vertical: 'hair', category: 'shampoo', price_eur: 8.5, rating: 4.2, image: IMG.h2, german_made: true, concerns: ['sensitive-scalp'], skin_types: [], ingredients: ['panthenol', 'glycerine'], affiliate_url: 'https://www.sebamed.com', description: { fr: "Shampoing ultra-doux sans savon pour lavages fréquents. Le pH 5.5 protège le film hydrolipidique du cuir chevelu sensible. Convient à toute la famille.", en: "Ultra-gentle soap-free shampoo for frequent washing. pH 5.5 protects the sensitive scalp's hydrolipidic film. Suitable for the whole family." } },
  { slug: 'doppelherz-magnesium-400', name: 'Magnésium 400 + B12 Comprimés', brand_slug: 'doppelherz', brand_name: 'Doppelherz', vertical: 'wellness', category: 'supplement', price_eur: 6.9, rating: 4.5, image: IMG.w2, german_made: true, concerns: ['stress', 'energy'], skin_types: [], ingredients: ['magnesium'], affiliate_url: 'https://www.doppelherz.com', description: { fr: "400 mg de magnésium + vitamine B12 par comprimé. Contribue à réduire la fatigue et soutient muscles et système nerveux. Le best-seller allemand du magnésium.", en: "400 mg of magnesium + vitamin B12 per tablet. Helps reduce fatigue and supports muscles and the nervous system. Germany's best-selling magnesium." } },
  { slug: 'doppelherz-vitamin-d3-2000', name: 'Vitamine D3 2000 U.I.', brand_slug: 'doppelherz', brand_name: 'Doppelherz', vertical: 'wellness', category: 'supplement', price_eur: 7.5, rating: 4.6, image: IMG.w1, german_made: true, concerns: ['immunity', 'energy'], skin_types: [], ingredients: ['vitamine-d3'], affiliate_url: 'https://www.doppelherz.com', description: { fr: "Vitamine D3 hautement dosée (2000 U.I.) pour le système immunitaire, les os et les muscles. Un comprimé tous les deux jours suffit. Fabriqué selon les normes pharmaceutiques allemandes.", en: "High-dose vitamin D3 (2000 IU) for the immune system, bones and muscles. One tablet every other day is enough. Made to German pharmaceutical standards." } },
  { slug: 'doppelherz-melatonin-spray', name: 'Mélatonine Spray Nuit', brand_slug: 'doppelherz', brand_name: 'Doppelherz', vertical: 'wellness', category: 'supplement', price_eur: 9.9, rating: 4.3, image: IMG.w1, german_made: true, concerns: ['sleep'], skin_types: [], ingredients: ['melatonine', 'lavande'], affiliate_url: 'https://www.doppelherz.com', description: { fr: "Spray sublingual à 1 mg de mélatonine et arôme lavande-mélisse. Réduit le temps d'endormissement — à vaporiser juste avant le coucher. Action rapide.", en: "Sublingual spray with 1 mg melatonin and lavender-lemon balm flavor. Reduces sleep onset time — spray just before bedtime. Fast acting." } },
  { slug: 'kneipp-valeriane-nuit', name: 'Valériane Nuit Dragées', brand_slug: 'kneipp', brand_name: 'Kneipp', vertical: 'wellness', category: 'supplement', price_eur: 11.5, rating: 4.2, image: IMG.w2, german_made: true, concerns: ['sleep', 'stress'], skin_types: [], ingredients: ['valeriane'], affiliate_url: 'https://www.kneipp.com', description: { fr: "Extrait concentré de racine de valériane (500 mg) selon la tradition Kneipp. Favorise l'endormissement naturel et un sommeil réparateur, sans accoutumance.", en: "Concentrated valerian root extract (500 mg) in the Kneipp tradition. Promotes natural sleep onset and restful sleep, without dependence." } },
  { slug: 'kneipp-huile-bain-relax', name: 'Huile de Bain Détente Profonde', brand_slug: 'kneipp', brand_name: 'Kneipp', vertical: 'wellness', category: 'bath-body', price_eur: 8.9, rating: 4.6, image: IMG.w5, german_made: true, concerns: ['stress', 'sleep'], skin_types: [], ingredients: ['lavande'], affiliate_url: 'https://www.kneipp.com', description: { fr: "Huile de bain aux huiles essentielles naturelles de lavande et patchouli. L'hydrothérapie selon Kneipp : 15 minutes de bain chaud pour relâcher les tensions du soir.", en: "Bath oil with natural lavender and patchouli essential oils. Kneipp hydrotherapy: a 15-minute warm bath to release evening tension." } },
  { slug: 'salus-floradix-fer', name: 'Floradix Fer + Vitamines Tonique', brand_slug: 'salus', brand_name: 'Salus', vertical: 'wellness', category: 'supplement', price_eur: 16.9, rating: 4.4, image: IMG.w1, german_made: true, concerns: ['energy'], skin_types: [], ingredients: ['fer', 'vitamine-c'], affiliate_url: 'https://www.salus.de', description: { fr: "Le tonique au fer le plus connu d'Allemagne : fer bien assimilé, vitamines B et C, extraits de plantes bio. Réduit la fatigue, idéal pour les femmes actives.", en: "Germany's best-known iron tonic: well-absorbed iron, B and C vitamins, organic plant extracts. Reduces fatigue, ideal for active women." } },
  { slug: 'salus-tisane-fenouil-bio', name: 'Tisane Bio Fenouil Digestion', brand_slug: 'salus', brand_name: 'Salus', vertical: 'wellness', category: 'tea', price_eur: 4.5, rating: 4.5, image: IMG.w3, german_made: true, concerns: ['digestion'], skin_types: [], ingredients: ['fenouil'], affiliate_url: 'https://www.salus.de', description: { fr: "Tisane de fenouil bio cultivé selon les standards Demeter. Apaise les ballonnements et facilite la digestion après les repas. Douce et naturellement sucrée.", en: "Organic fennel tea grown to Demeter standards. Soothes bloating and aids digestion after meals. Mild and naturally sweet." } },
  { slug: 'salus-tisane-nuit-paisible', name: 'Tisane Bio Nuit Paisible', brand_slug: 'salus', brand_name: 'Salus', vertical: 'wellness', category: 'tea', price_eur: 4.9, rating: 4.3, image: IMG.w4, german_made: true, concerns: ['sleep', 'stress'], skin_types: [], ingredients: ['valeriane', 'lavande'], affiliate_url: 'https://www.salus.de', description: { fr: "Mélange bio de valériane, lavande et mélisse pour un rituel du soir apaisant. À infuser 10 minutes, 30 minutes avant le coucher.", en: "Organic blend of valerian, lavender and lemon balm for a calming evening ritual. Steep 10 minutes, drink 30 minutes before bed." } },
]

const ALL_BRANDS = [...SEED_BRANDS.map((b) => ({ ...b, ...(BRAND_EXTRAS[b.slug] || {}) })), ...NEW_BRANDS]
const ALL_INGREDIENTS = [...SEED_INGREDIENTS, ...NEW_INGREDIENTS]
const ALL_PRODUCTS = [...SEED_PRODUCTS.map((p) => ({ vertical: 'skincare', ...p })), ...NEW_PRODUCTS]


// ============ REELS / SHORTS ============
// Vidéos verticales courtes (format Shorts / Reels), embarquées depuis une
// plateforme externe. `video_url` est l'URL d'origine collée au back-office ;
// le provider et l'identifiant en sont dérivés côté client.
//
// ATTENTION — contenu de démonstration : toutes les entrées pointent vers
// l'URL de référence fournie au cadrage. Chaque reel doit recevoir l'URL de
// sa propre vidéo avant mise en production.
const REEL_PLACEHOLDER_URL = 'https://youtube.com/shorts/I1nvw5Y0sBM'

const SEED_REELS = [
  {
    slug: 'retinol-par-ou-commencer', video_url: REEL_PLACEHOLDER_URL, duration_s: 48,
    vertical: 'skincare', ingredient_slug: 'retinol', published_at: '2025-06-18',
    title: { fr: 'Rétinol : par où commencer', en: 'Retinol: where to start' },
    caption: {
      fr: "Une à deux applications par semaine, le soir, sur peau sèche. On augmente seulement quand la peau ne tiraille plus.",
      en: 'Once or twice a week, at night, on dry skin. Increase only once your skin stops feeling tight.',
    },
  },
  {
    slug: 'lire-une-liste-inci', video_url: REEL_PLACEHOLDER_URL, duration_s: 55,
    vertical: 'skincare', published_at: '2025-06-22',
    title: { fr: 'Lire une liste INCI en 30 secondes', en: 'Read an INCI list in 30 seconds' },
    caption: {
      fr: "Les cinq premiers ingrédients représentent souvent plus de 80% de la formule. Le reste se joue sous la barre des 1%.",
      en: 'The first five ingredients often make up over 80% of the formula. The rest plays out below the 1% mark.',
    },
  },
  {
    slug: 'ph-5-5-pourquoi', video_url: REEL_PLACEHOLDER_URL, duration_s: 41,
    vertical: 'skincare', product_slug: 'sebamed-clear-face-gel', published_at: '2025-06-29',
    title: { fr: 'Pourquoi le pH 5.5 change tout', en: 'Why pH 5.5 changes everything' },
    caption: {
      fr: "Le manteau acide de la peau tourne autour de 5.5. Un nettoyant trop alcalin le décape et fragilise la barrière.",
      en: "The skin's acid mantle sits around 5.5. An overly alkaline cleanser strips it and weakens the barrier.",
    },
  },
  {
    slug: 'thiamidol-taches-pigmentaires', video_url: REEL_PLACEHOLDER_URL, duration_s: 52,
    vertical: 'skincare', product_slug: 'nivea-luminous630-serum', published_at: '2025-07-04',
    title: { fr: 'Taches pigmentaires : ce qui marche', en: 'Dark spots: what actually works' },
    caption: {
      fr: "Thiamidol et Luminous630 sortent de la recherche Beiersdorf. Comptez quatre semaines avant de juger un résultat.",
      en: 'Thiamidol and Luminous630 come out of Beiersdorf research. Give it four weeks before judging results.',
    },
  },
  {
    slug: 'biotine-chute-de-cheveux', video_url: REEL_PLACEHOLDER_URL, duration_s: 46,
    vertical: 'hair', ingredient_slug: 'biotine', published_at: '2025-07-11',
    title: { fr: 'Biotine : utile ou marketing ?', en: 'Biotin: useful or marketing?' },
    caption: {
      fr: "La supplémentation n'a d'effet démontré qu'en cas de carence avérée. Sans déficit, le bénéfice reste théorique.",
      en: 'Supplementation has proven effects only in cases of actual deficiency. Without one, the benefit stays theoretical.',
    },
  },
]

const SEED_VERSION = 3

async function seedIfEmpty(database) {
  const before = await database.collection('meta').findOneAndUpdate(
    { key: 'seed_version' },
    { $set: { key: 'seed_version', version: SEED_VERSION, at: new Date().toISOString() } },
    { upsert: true, returnDocument: 'before' }
  )
  if (before && before.version >= SEED_VERSION) return
  const now = new Date().toISOString()
  await Promise.all(['brands', 'ingredients', 'products', 'articles', 'hubs'].map((c) => database.collection(c).deleteMany({})))
  await database.collection('brands').insertMany(ALL_BRANDS.map((b) => ({ ...b, id: uuidv4(), created_at: now })))
  await database.collection('ingredients').insertMany(ALL_INGREDIENTS.map((i) => ({ ...i, id: uuidv4(), created_at: now })))
  await database.collection('products').insertMany(ALL_PRODUCTS.map((p) => ({ ...p, id: uuidv4(), created_at: now })))
  await database.collection('articles').insertMany(SEED_ARTICLES.map((a) => ({ ...a, id: uuidv4(), created_at: now })))
  await database.collection('hubs').insertMany(SEED_HUBS.map((h) => ({ ...h, id: uuidv4(), created_at: now })))
}

// Les reels sont seedés indépendamment du reste : ajouter une collection ne
// doit pas forcer une remise à zéro complète du contenu, qui effacerait les
// saisies du back-office.
async function seedReelsIfEmpty(database) {
  const count = await database.collection('reels').countDocuments()
  if (count > 0) return
  const now = new Date().toISOString()
  await database.collection('reels').insertMany(SEED_REELS.map((r) => ({ ...r, id: uuidv4(), created_at: now })))
}

async function requireAdmin(req, database) {
  const auth = req.headers['authorization'] || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  return await database.collection('sessions').findOne({ token })
}

const ADMIN_COLLECTIONS = ['products', 'brands', 'ingredients', 'articles', 'hubs', 'reels']

// ============ INGREDIENT CONFLICT RULES ============
const INGREDIENT_CONFLICTS = [
  {
    pair: ['retinol', 'acide-salicylique'], severity: 'high',
    title: { fr: 'Rétinol + Acide salicylique', en: 'Retinol + Salicylic acid' },
    message: { fr: "Risque élevé d'irritation et de dessèchement lorsqu'ils sont appliqués dans la même session. Alternez : BHA un soir, rétinol le soir suivant.", en: 'High risk of irritation and dryness when applied in the same session. Alternate: BHA one evening, retinol the next.' },
  },
  {
    pair: ['retinol', 'vitamine-c'], severity: 'medium',
    title: { fr: 'Rétinol + Vitamine C pure', en: 'Retinol + Pure vitamin C' },
    message: { fr: "Leurs pH optimaux sont incompatibles et le cumul peut irriter. Préférez la vitamine C le matin et le rétinol le soir.", en: 'Their optimal pH levels are incompatible and combining them can irritate. Use vitamin C in the morning and retinol at night.' },
  },
  {
    pair: ['acide-salicylique', 'vitamine-c'], severity: 'medium',
    title: { fr: 'Acide salicylique + Vitamine C pure', en: 'Salicylic acid + Pure vitamin C' },
    message: { fr: "Deux actifs acides dans la même session augmentent le risque de picotements et de rougeurs. Espacez les applications ou alternez matin/soir.", en: 'Two acidic actives in the same session increase the risk of stinging and redness. Space out applications or alternate morning/evening.' },
  },
]

const LAYERING_ACTIVES = {
  'acide-salicylique': {
    severity: 'medium',
    title: { fr: 'Acide salicylique en double', en: 'Doubled salicylic acid' },
    message: { fr: "Plusieurs produits de cette routine contiennent de l'acide salicylique : risque de sur-exfoliation. Commencez par un seul produit BHA, puis augmentez progressivement si la peau tolère.", en: 'Several products in this routine contain salicylic acid: risk of over-exfoliation. Start with a single BHA product, then increase gradually if your skin tolerates it.' },
  },
  'retinol': {
    severity: 'high',
    title: { fr: 'Rétinol en double', en: 'Doubled retinol' },
    message: { fr: "Plusieurs produits de cette routine contiennent du rétinol : risque important d'irritation. N'utilisez qu'un seul produit au rétinol par session.", en: 'Several products in this routine contain retinol: significant risk of irritation. Use only one retinol product per session.' },
  },
  'vitamine-c': {
    severity: 'low',
    title: { fr: 'Vitamine C en double', en: 'Doubled vitamin C' },
    message: { fr: "Plusieurs produits contiennent de la vitamine C : inutile de cumuler, un seul suffit pour un effet optimal.", en: 'Several products contain vitamin C: no need to stack them, one is enough for optimal effect.' },
  },
}

function detectConflicts(steps) {
  const map = {}
  steps.forEach((s) => (s.product.ingredients || []).forEach((ing) => {
    map[ing] = map[ing] || []
    if (!map[ing].includes(s.product.name)) map[ing].push(s.product.name)
  }))
  const warnings = []
  for (const c of INGREDIENT_CONFLICTS) {
    const [x, y] = c.pair
    if (map[x] && map[y]) {
      warnings.push({ type: 'pair', severity: c.severity, title: c.title, message: c.message, products: [...new Set([...map[x], ...map[y]])] })
    }
  }
  for (const [active, rule] of Object.entries(LAYERING_ACTIVES)) {
    if ((map[active] || []).length >= 2) {
      warnings.push({ type: 'duplicate', severity: rule.severity, title: rule.title, message: rule.message, products: map[active] })
    }
  }
  const order = { high: 0, medium: 1, low: 2 }
  return warnings.sort((a, b) => order[a.severity] - order[b.severity])
}

// ============ PATH HELPER ============
function parsePath(req) {
  const p = req.path.replace(/^\//, '')
  return p ? p.split('/') : []
}

// ============ ROUTER ============
const router = express.Router()

// GET
router.get('/*', async (req, res) => {
  try {
    const path = parsePath(req)
    const database = await getDb()
    await seedIfEmpty(database)
    await seedReelsIfEmpty(database)
    const q = req.query

    if (path.length === 0 || path[0] === 'root') {
      return send(res, { status: 'ok', service: 'dermalyze-api' })
    }

    if (path[0] === 'products') {
      if (path[1]) {
        const product = await database.collection('products').findOne({ slug: path[1] }, NOID)
        if (!product) return send(res, { error: 'Product not found' }, 404)
        const ingredientDetails = await database.collection('ingredients').find({ slug: { $in: product.ingredients || [] } }, NOID).toArray()
        const brand = await database.collection('brands').findOne({ slug: product.brand_slug }, NOID)
        return send(res, { ...product, ingredient_details: ingredientDetails, brand })
      }
      const filter = {}
      if (q.vertical) filter.vertical = q.vertical
      if (q.category) filter.category = q.category
      if (q.concern) filter.concerns = q.concern
      if (q.skin_type) filter.skin_types = q.skin_type
      if (q.brand) filter.brand_slug = q.brand
      if (q.german === 'true') filter.german_made = true
      if (q.search) filter.$or = [{ name: { $regex: q.search, $options: 'i' } }, { brand_name: { $regex: q.search, $options: 'i' } }]
      const products = await database.collection('products').find(filter, NOID).limit(parseInt(q.limit || '100')).toArray()
      return send(res, { products, total: products.length })
    }

    if (path[0] === 'ingredients') {
      if (path[1]) {
        const ingredient = await database.collection('ingredients').findOne({ slug: path[1] }, NOID)
        if (!ingredient) return send(res, { error: 'Ingredient not found' }, 404)
        const products = await database.collection('products').find({ ingredients: path[1] }, NOID).toArray()
        return send(res, { ...ingredient, products })
      }
      const ingredients = await database.collection('ingredients').find({}, NOID).toArray()
      return send(res, { ingredients, total: ingredients.length })
    }

    if (path[0] === 'brands') {
      if (path[1]) {
        const brand = await database.collection('brands').findOne({ slug: path[1] }, NOID)
        if (!brand) return send(res, { error: 'Brand not found' }, 404)
        const products = await database.collection('products').find({ brand_slug: path[1] }, NOID).toArray()
        return send(res, { ...brand, products })
      }
      const filter = {}
      if (q.german === 'true') filter.german = true
      const brands = await database.collection('brands').find(filter, NOID).toArray()
      return send(res, { brands, total: brands.length })
    }

    if (path[0] === 'hubs') {
      if (path[1]) {
        const hub = await database.collection('hubs').findOne({ slug: path[1] }, NOID)
        if (!hub) return send(res, { error: 'Hub not found' }, 404)
        const [products, ingredientDetails] = await Promise.all([
          database.collection('products').find({ concerns: path[1] }, NOID).sort({ rating: -1 }).toArray(),
          database.collection('ingredients').find({ slug: { $in: hub.key_ingredients || [] } }, NOID).toArray(),
        ])
        return send(res, { ...hub, products, ingredient_details: ingredientDetails })
      }
      const filter = {}
      if (q.vertical) filter.vertical = q.vertical
      const hubs = await database.collection('hubs').find(filter, NOID).toArray()
      return send(res, { hubs, total: hubs.length })
    }

    if (path[0] === 'articles') {
      if (path[1]) {
        const article = await database.collection('articles').findOne({ slug: path[1] }, NOID)
        if (!article) return send(res, { error: 'Article not found' }, 404)
        return send(res, article)
      }
      const filter = {}
      if (q.category) filter.category = q.category
      if (q.all !== '1') filter.status = { $ne: 'draft' }
      const articles = await database.collection('articles').find(filter, NOID).sort({ published_at: -1 }).toArray()
      return send(res, { articles, total: articles.length })
    }

    if (path[0] === 'reels') {
      if (path[1]) {
        const reel = await database.collection('reels').findOne({ slug: path[1] }, NOID)
        if (!reel) return send(res, { error: 'Reel not found' }, 404)
        return send(res, reel)
      }
      const filter = {}
      if (q.vertical) filter.vertical = q.vertical
      if (q.product_slug) filter.product_slug = q.product_slug
      if (q.ingredient_slug) filter.ingredient_slug = q.ingredient_slug
      if (q.all !== '1') filter.status = { $ne: 'draft' }
      const reels = await database.collection('reels').find(filter, NOID).sort({ published_at: -1 }).toArray()
      return send(res, { reels, total: reels.length })
    }

    if (path[0] === 'compare') {
      const a = await database.collection('products').findOne({ slug: q.a }, NOID)
      const b = await database.collection('products').findOne({ slug: q.b }, NOID)
      if (!a || !b) return send(res, { error: 'One or both products not found' }, 404)
      const commonIngredients = (a.ingredients || []).filter((i) => (b.ingredients || []).includes(i))
      const allSlugs = [...new Set([...(a.ingredients || []), ...(b.ingredients || [])])]
      const ingredientDetails = await database.collection('ingredients').find({ slug: { $in: allSlugs } }, NOID).toArray()
      return send(res, { a, b, common_ingredients: commonIngredients, ingredient_details: ingredientDetails })
    }

    if (path[0] === 'routines' && path[1]) {
      const routineDoc = await database.collection('routines').findOne({ id: path[1] }, NOID)
      if (!routineDoc) return send(res, { error: 'Routine not found' }, 404)
      return send(res, routineDoc)
    }

    if (path[0] === 'admin') {
      const session = await requireAdmin(req, database)
      if (!session) return send(res, { error: 'Unauthorized' }, 401)
      if (path[1] === 'leads') {
        const leads = await database.collection('leads').find({}, NOID).sort({ created_at: -1 }).toArray()
        return send(res, { leads, total: leads.length })
      }
      if (path[1] === 'subscribers') {
        const subscribers = await database.collection('subscribers').find({}, NOID).sort({ created_at: -1 }).toArray()
        return send(res, { subscribers, total: subscribers.length })
      }
      if (path[1] === 'stats') {
        const [products, brands, ingredients, articles, leads, hubs, subscribers, affiliate_clicks] = await Promise.all([
          database.collection('products').countDocuments(),
          database.collection('brands').countDocuments(),
          database.collection('ingredients').countDocuments(),
          database.collection('articles').countDocuments(),
          database.collection('leads').countDocuments(),
          database.collection('hubs').countDocuments(),
          database.collection('subscribers').countDocuments(),
          database.collection('events').countDocuments({ type: 'affiliate_click' }),
        ])
        return send(res, { products, brands, ingredients, articles, leads, hubs, subscribers, affiliate_clicks })
      }
      return send(res, { error: 'Not found' }, 404)
    }

    return send(res, { error: 'Not found' }, 404)
  } catch (e) {
    console.error('GET error', e)
    return send(res, { error: e.message }, 500)
  }
})

// POST
router.post('/*', async (req, res) => {
  try {
    const path = parsePath(req)
    const database = await getDb()
    await seedIfEmpty(database)
    await seedReelsIfEmpty(database)
    const body = req.body || {}

    if (path[0] === 'finder') {
      const { skin_type, concerns = [], budget = 'high', category, vertical = 'skincare', avoid_ingredients = [] } = body
      const filter = {}
      if (vertical) filter.vertical = vertical
      if (category) filter.category = category
      let products = await database.collection('products').find(filter, NOID).toArray()
      if (Array.isArray(avoid_ingredients) && avoid_ingredients.length) {
        products = products.filter((p) => !(p.ingredients || []).some((i) => avoid_ingredients.includes(i)))
      }
      const budgetMax = budget === 'low' ? 15 : budget === 'mid' ? 25 : Infinity
      const maxScore = 30 + concerns.length * 25 + 10 + 20
      const scoredAll = products
        .map((p) => {
          let score = 0
          const reasons = []
          if (skin_type && (p.skin_types || []).includes(skin_type)) { score += 30; reasons.push('skin_type') }
          const matched = (p.concerns || []).filter((c) => concerns.includes(c))
          score += matched.length * 25
          matched.forEach((c) => reasons.push(c))
          if (p.price_eur <= budgetMax) { score += 10; reasons.push('budget') } else { score -= 20 }
          score += Math.round((p.rating || 0) * 4)
          return { ...p, score, match_reasons: reasons, matched_concerns: matched, match_percent: Math.min(99, Math.max(5, Math.round((score / maxScore) * 100))) }
        })
        .sort((x, y) => y.score - x.score)

      const bestOf = (cat, excludeSlugs = []) => scoredAll.find((p) => p.category === cat && !excludeSlugs.includes(p.slug)) || null
      const buildSteps = (cats) => cats.map((cat) => bestOf(cat)).filter(Boolean).map((p, idx) => ({ order: idx + 1, category: p.category, product: p }))

      let sections = []
      if (vertical === 'hair') {
        const steps = buildSteps(['shampoo', 'conditioner', 'hair-treatment', 'scalp-serum'])
        sections = [{ id: 'routine', title: { fr: 'Votre routine capillaire', en: 'Your hair routine' }, icon: 'hair', steps, warnings: detectConflicts(steps) }]
      } else if (vertical === 'wellness') {
        const steps = buildSteps(['supplement', 'tea', 'bath-body'])
        sections = [{ id: 'routine', title: { fr: 'Votre programme bien-être', en: 'Your wellness program' }, icon: 'wellness', steps, warnings: detectConflicts(steps) }]
      } else {
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
        sections = [
          { id: 'morning', title: { fr: 'Routine du matin', en: 'Morning routine' }, icon: 'sun', steps: morning, warnings: detectConflicts(morning) },
          { id: 'evening', title: { fr: 'Routine du soir', en: 'Evening routine' }, icon: 'moon', steps: evening, warnings: detectConflicts(evening) },
        ]
      }

      const routineSlugs = new Set(sections.flatMap((s) => s.steps.map((st) => st.product.slug)))
      const alternatives = scoredAll.filter((p) => !routineSlugs.has(p.slug) && p.score > 20).slice(0, 4)
      const results = scoredAll.filter((p) => p.score > 20).slice(0, 6)
      const morningSec = sections.find((s) => s.id === 'morning')
      const eveningSec = sections.find((s) => s.id === 'evening')
      const routine = {
        vertical, sections,
        morning: morningSec ? morningSec.steps : [],
        evening: eveningSec ? eveningSec.steps : [],
        warnings: { morning: morningSec?.warnings || [], evening: eveningSec?.warnings || [] },
      }
      return send(res, { routine, alternatives, results, total: results.length })
    }

    if (path[0] === 'routines') {
      const routine = body.routine
      const hasSteps = routine && (
        (Array.isArray(routine.sections) && routine.sections.some((s) => s.steps?.length)) ||
        routine.morning?.length || routine.evening?.length
      )
      if (!hasSteps) return send(res, { error: 'routine is required' }, 400)
      const shortId = uuidv4().replace(/-/g, '').slice(0, 10)
      const doc = { id: shortId, routine, alternatives: Array.isArray(body.alternatives) ? body.alternatives : [], profile: body.profile || {}, created_at: new Date().toISOString() }
      await database.collection('routines').insertOne({ ...doc })
      return send(res, { id: shortId }, 201)
    }

    if (path[0] === 'newsletter') {
      const email = (body.email || '').trim().toLowerCase()
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      if (!valid) return send(res, { error: 'valid email is required' }, 400)
      const existing = await database.collection('subscribers').findOne({ email })
      if (existing) return send(res, { ok: true, already: true })
      await database.collection('subscribers').insertOne({ id: uuidv4(), email, lang: body.lang || 'fr', source: body.source || 'site', created_at: new Date().toISOString() })
      return send(res, { ok: true, already: false }, 201)
    }

    if (path[0] === 'track') {
      const evt = { id: uuidv4(), type: body.type || 'affiliate_click', product_slug: body.product_slug || null, vertical: body.vertical || null, created_at: new Date().toISOString() }
      await database.collection('events').insertOne({ ...evt })
      return send(res, { ok: true }, 201)
    }

    if (path[0] === 'leads') {
      if (!body.email || !body.brand_name) return send(res, { error: 'brand_name and email are required' }, 400)
      const lead = { id: uuidv4(), brand_name: body.brand_name, contact_name: body.contact_name || '', email: body.email, message: body.message || '', created_at: new Date().toISOString() }
      await database.collection('leads').insertOne({ ...lead })
      return send(res, lead, 201)
    }

    if (path[0] === 'admin' && path[1] === 'login') {
      const expected = process.env.ADMIN_PASSWORD || 'admin123'
      if (body.password !== expected) return send(res, { error: 'Invalid password' }, 401)
      const token = uuidv4()
      await database.collection('sessions').insertOne({ token, created_at: new Date().toISOString() })
      return send(res, { token })
    }

    if (path[0] === 'admin' && path[1] === 'generate') {
      const session = await requireAdmin(req, database)
      if (!session) return send(res, { error: 'Unauthorized' }, 401)
      const key = process.env.EMERGENT_LLM_KEY
      if (!key || !key.startsWith('sk-emergent-')) return send(res, { error: 'EMERGENT_LLM_KEY missing' }, 500)
      const topic = (body.topic || '').trim()
      if (topic.length < 3) return send(res, { error: 'topic is required (min 3 chars)' }, 400)
      const vertical = body.vertical || 'skincare'
      const category = body.category || 'guide'
      const provider = process.env.LLM_PROVIDER || 'openai'
      const model = process.env.LLM_MODEL || 'gpt-4o-mini'
      const system = `You are a bilingual (French/English) senior editorial writer for a science-led German health & beauty discovery platform (skincare, hair, wellness). Write an original, evidence-based, non-promotional educational article. Avoid medical claims. Return ONLY valid minified JSON on a single line with EXACTLY this shape:\n{"slug":"kebab-case-slug","category":"guide|research|learn|how-to","title":{"fr":"...","en":"..."},"excerpt":{"fr":"...","en":"..."},"content":{"fr":["para1","para2","para3"],"en":["para1","para2","para3"]}}\nRules: FR and EN must be natural and semantically equivalent (not word-for-word). content is an ARRAY of 3 to 5 plain paragraph strings; each paragraph is a single line WITHOUT any line breaks, markdown, or quotes inside. title <= 90 chars, excerpt <= 220 chars. slug is lowercase kebab-case derived from the FR title. Output must be strictly valid JSON.`
      const prompt = `Topic: ${topic}\nUniverse/vertical: ${vertical}\nPreferred category: ${category}\nWrite the article now as JSON only.`
      try {
        const chat = new LlmChat(key, `dermalyze-gen-${uuidv4()}`, system).withModel(provider, model).withParams({ temperature: 0.5, max_tokens: 2500 })
        const reply = await chat.sendMessage(new UserMessage({ text: prompt }))
        let raw = String(reply).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
        const start = raw.indexOf('{'); const end = raw.lastIndexOf('}')
        if (start >= 0 && end > start) raw = raw.slice(start, end + 1)
        raw = raw.replace(/[\u0000-\u001F]+/g, ' ')
        let article
        try { article = JSON.parse(raw) } catch { return send(res, { error: 'Model did not return valid JSON', raw }, 502) }
        const joinContent = (c) => Array.isArray(c) ? c.join('\n\n') : (c || '')
        if (article.content) { article.content = { fr: joinContent(article.content.fr), en: joinContent(article.content.en) } }
        if (!article?.title?.fr || !article?.content?.fr) return send(res, { error: 'Incomplete generation', article }, 502)
        article.vertical = vertical
        article.category = article.category || category
        return send(res, { article })
      } catch (e) {
        console.error('AI generate error', e?.message)
        return send(res, { error: 'Generation failed', detail: e?.message }, 502)
      }
    }

    if (path[0] === 'admin' && ADMIN_COLLECTIONS.includes(path[1])) {
      const session = await requireAdmin(req, database)
      if (!session) return send(res, { error: 'Unauthorized' }, 401)
      if (!body.slug) return send(res, { error: 'slug is required' }, 400)
      const existing = await database.collection(path[1]).findOne({ slug: body.slug })
      if (existing) return send(res, { error: 'slug already exists' }, 409)
      const doc = { ...body, id: uuidv4(), created_at: new Date().toISOString() }
      await database.collection(path[1]).insertOne({ ...doc })
      delete doc._id
      return send(res, doc, 201)
    }

    return send(res, { error: 'Not found' }, 404)
  } catch (e) {
    console.error('POST error', e)
    return send(res, { error: e.message }, 500)
  }
})

// PUT
router.put('/*', async (req, res) => {
  try {
    const path = parsePath(req)
    const database = await getDb()
    const body = req.body || {}

    if (path[0] === 'admin' && ADMIN_COLLECTIONS.includes(path[1]) && path[2]) {
      const session = await requireAdmin(req, database)
      if (!session) return send(res, { error: 'Unauthorized' }, 401)
      delete body._id
      delete body.id
      const result = await database.collection(path[1]).updateOne({ id: path[2] }, { $set: { ...body, updated_at: new Date().toISOString() } })
      if (result.matchedCount === 0) return send(res, { error: 'Not found' }, 404)
      const updated = await database.collection(path[1]).findOne({ id: path[2] }, NOID)
      return send(res, updated)
    }
    return send(res, { error: 'Not found' }, 404)
  } catch (e) {
    console.error('PUT error', e)
    return send(res, { error: e.message }, 500)
  }
})

// DELETE
router.delete('/*', async (req, res) => {
  try {
    const path = parsePath(req)
    const database = await getDb()

    if (path[0] === 'admin' && [...ADMIN_COLLECTIONS, 'leads'].includes(path[1]) && path[2]) {
      const session = await requireAdmin(req, database)
      if (!session) return send(res, { error: 'Unauthorized' }, 401)
      const result = await database.collection(path[1]).deleteOne({ id: path[2] })
      if (result.deletedCount === 0) return send(res, { error: 'Not found' }, 404)
      return send(res, { success: true })
    }
    return send(res, { error: 'Not found' }, 404)
  } catch (e) {
    console.error('DELETE error', e)
    return send(res, { error: e.message }, 500)
  }
})

app.use('/api', router)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Dermalyze running on port ${PORT}`)
})
