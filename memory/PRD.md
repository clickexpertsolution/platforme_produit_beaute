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

### 🔜 Étape 4 — B2B Market Entry
"For German brands" landing (localization, leads, distributors services), B2B lead form + admin lead management (basic leads already exist).

## Tech
- Next.js single API route /app/app/api/[[...path]]/route.js, SPA /app/app/page.js (hash routing), MongoDB (process.env.MONGO_URL + DB_NAME=dermalyze).
- Admin: password admin123 (ADMIN_PASSWORD env), Bearer token in sessions collection.
