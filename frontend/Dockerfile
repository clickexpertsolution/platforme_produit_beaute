# ── Frontend Dermalyze — Next.js 15 ──────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# ── Deps ──────────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json ./
RUN yarn install

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garantit que public/ existe même si absent du repo (il contient les icônes,
# le visuel de partage et le manifeste)
RUN mkdir -p public

# Variable principale (Coolify) — exposée navigateur + proxy SSR
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
# Fallback docker-compose (réseau interne Docker)
ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL
# URL publique du site : sert de base aux métadonnées de partage (og:image
# absolue pour WhatsApp), au canonical, à robots.txt et au sitemap.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

RUN yarn build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
