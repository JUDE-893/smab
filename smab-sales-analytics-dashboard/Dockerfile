# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Allow passing public env vars required at build time (Next.js)
ARG NEXT_PUBLIC_BACKEND_API_BASE_URL
ENV NEXT_PUBLIC_BACKEND_API_BASE_URL=${NEXT_PUBLIC_BACKEND_API_BASE_URL}
RUN npm run build

# Production runtime (standalone)
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3004
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user (Debian)
RUN groupadd -r nodejs && useradd -r -g nodejs nodeuser

# Copy required files
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN chown -R nodeuser:nodejs /app

USER nodeuser
EXPOSE 3004
CMD ["node", "server.js"]
