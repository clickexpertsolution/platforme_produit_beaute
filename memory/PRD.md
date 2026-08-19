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

### 🔜 Étape 2 — Content hubs + CMS (NEXT)
Hubs per concern (uses concern ids), articles CMS in admin (FR+EN, publish state), AI-assisted article generation via Emergent LLM key, ~15 demo articles.

### 🔜 Étape 3 — Conversion
Affiliate links management, Product Finder extended to hair/wellness, newsletter signup + admin export.

### 🔜 Étape 4 — B2B Market Entry
"For German brands" landing (localization, leads, distributors services), B2B lead form + admin lead management (basic leads already exist).

## Tech
- Next.js single API route /app/app/api/[[...path]]/route.js, SPA /app/app/page.js (hash routing), MongoDB (process.env.MONGO_URL + DB_NAME=dermalyze).
- Admin: password admin123 (ADMIN_PASSWORD env), Bearer token in sessions collection.
