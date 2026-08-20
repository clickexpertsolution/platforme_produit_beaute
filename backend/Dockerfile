# ── Backend Dermalyze — Express API ──────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package.json ./
RUN npm install --omit=dev

# Copy source + shared lib (seed-hubs.js)
COPY backend/server.js ./
COPY lib/ ./lib/

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "server.js"]
