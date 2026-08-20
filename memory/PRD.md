# PRD — Dermalyze / German Health & Beauty MENA Platform

## Vision (source: uploaded PDF "Plateforme_German_Health_Beauty_MENA_FR")
Education-first discovery platform (not a classic shop) connecting MENA consumers with German health & beauty brands. Funnel: Problem → Learn → Understand → Discover → Compare → Recommend → Buy. Bilingual FR/EN (Arabic postponed by user decision).

## User decisions (June 2025)
- Execute all 4 phases in order: (1) Catalog foundation, (2) Content hubs + CMS, (3) Conversion (affiliate/finder/newsletter), (4) B2B Market Entry.
- Arabic: later; stay FR/EN.
- 3 verticals: Skincare, Hair & Scalp, Wellness.
- Content: admin CMS + AI-assisted generation (Emergent LLM key) + demo articles written by agent.
- Realistic German brand data (Eucerin, Sebamed, Weleda, Dr. Hauschka, Alpecin, Schwarzkopf, Doppelherz, Kneipp, Salus...).

## Status
### ✅ Étape 1 — Catalog foundation (DONE, backend tested 93/93)
- 3 verticals via `vertical` field on products; new categories (shampoo, conditioner, hair-treatment, scalp-serum, supplement, tea, bath-body); new concerns (hair-loss, dandruff, dry-hair, sensitive-scalp, sleep, stress, energy, digestion, immunity).
- 30 products (14 skincare / 8 hair / 8 wellness), 11 German/European brands, 24 ingredients (12 with regulatory{fr,en} EU context).
- Brands enriched: manufacturer, certifications[], verticals[].
- Versioned re-seed: meta.seed_version=2 wipes + reseeds (bump SEED_VERSION const in route.js to force reseed).
- Frontend: vertical tabs on Products page, 3-universe home section with concern chips, brand manufacturer/certifications cards, ingredient regulatory box, admin fields updated.
- Finder restricted to skincare (sends vertical:'skincare'); multi-vertical finder planned Étape 3.

### ✅ Étape 2a — Content hubs (DONE, backend tested 67/67)
- 15 hubs (1 par préoccupation : 6 skincare, 4 hair, 5 wellness), seed dans /app/lib/seed-hubs.js, SEED_VERSION=3.
- Hub = title/definition/causes/mistakes/buying_guide (bilingue), key_ingredients, 3 FAQs bilingues, produits recommandés (par concern, triés par note), disclaimer médical.
- Endpoints: GET /api/hubs (?vertical), GET /api/hubs/:slug. Admin CRUD hubs + stats.
- Frontend: nav "Conseils", liste groupée par univers, page détail complète (accordéon FAQ shadcn), puces d'accueil → hubs. Admin: onglet Hubs (FAQ éditable en JSON).

### 🔜 Étape 2b — CMS articles + génération IA (NEXT)
Articles CMS déjà présents (admin), ajouter : génération assistée IA (Emergent LLM key), état publié/brouillon, ~15 articles démo, lien articles ↔ hubs.

### 🔜 Étape 3 — Conversion
Affiliate links management, Product Finder extended to hair/wellness, newsletter signup + admin export.
- ✅ Partage de routine (Share Routine): POST /api/routines (snapshot routine+alternatives+profile → id court unique) + GET /api/routines/:id. Frontend: bouton "Partager ma routine" dans le Finder (lien #/routine/{id}, copie presse-papiers + partage natif), page SharedRoutineView en lecture seule (RoutineDisplay réutilisé, badges profil, CTA Finder). Backend testé 44/44.

## Phase A — Conversion (DONE, backend tested 33/33)
- Product Finder MULTI-UNIVERS: POST /api/finder retourne routine.sections[] génériques (skincare=morning+evening avec compat legacy morning/evening/warnings; hair=1 section shampoo>conditioner>hair-treatment>scalp-serum; wellness=1 section supplement>tea>bath-body). Nouveau paramètre avoid_ingredients[] (exclut produits contenant ces actifs). Frontend: FinderView machine à phases (univers → [peau] → préoccupations → budget → ingrédients à éviter → résultats).
- Affiliation: produits ont affiliate_url; BuyButton "Où acheter" + POST /api/track (events) pour suivi des clics; stats admin affiliate_clicks.
- Newsletter: POST /api/newsletter (dedupe, validation), GET /api/admin/subscribers, export CSV admin, composant NewsletterSignup (footer + fin de finder), stats subscribers.

## Phase B — Authority (DONE backend, IA bloquée par budget clé)
- Génération de contenu IA: POST /api/admin/generate (auth) via emergentintegrations LlmChat + EMERGENT_LLM_KEY (openai/gpt-4o-mini). Retourne article bilingue {slug,category,vertical,title,excerpt,content}. Admin: bouton "Générer avec l'IA" (onglet Articles) → ouvre le brouillon pré-rempli pour révision avant publication. NOTE: la Universal Key a son budget épuisé (max 0.001) — recharger via Profile→Manage plan→Universal Key→Add Balance pour utiliser la génération.
- Articles: champ status (draft/published) — GET /api/articles public exclut les drafts, ?all=1 les inclut (liste admin). Filtre catégorie "how-to" ajouté dans Learn.
- SEO léger: <title> + meta description dynamiques par route (client-side).
- Reste à faire (Phase B): JSON-LD/sitemap, avis/preuves, ~15 articles démo, lien articles↔hubs.

### 🔜 Étape 4 — B2B Market Entry
"For German brands" landing (localization, leads, distributors services), B2B lead form + admin lead management (basic leads already exist).

## Tech
- Next.js single API route /app/app/api/[[...path]]/route.js, SPA /app/app/page.js (hash routing), MongoDB (process.env.MONGO_URL + DB_NAME=dermalyze).
- Admin: password admin123 (ADMIN_PASSWORD env), Bearer token in sessions collection.
