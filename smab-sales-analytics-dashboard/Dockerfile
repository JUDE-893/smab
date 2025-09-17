# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS base
WORKDIR /app

# Install dependencies including brotli
FROM base AS deps
RUN apt-get update && apt-get install -y brotli
# Skip puppeteer Chrome download to avoid network issues
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install brotli in builder stage
RUN apt-get update && apt-get install -y brotli

# Allow passing public env vars required at build time (Next.js)
ARG NEXT_PUBLIC_BACKEND_API_BASE_URL
ENV NEXT_PUBLIC_BACKEND_API_BASE_URL=${NEXT_PUBLIC_BACKEND_API_BASE_URL}

# ⚠️ NO CHROMIUM INSTALLATION HERE - not needed for build
RUN npm run build

# Production runtime (standalone)
FROM node:20-bullseye-slim AS runner
WORKDIR /app

# Install brotli in production image
RUN apt-get update && apt-get install -y brotli

# Pass build-time arguments as environment variables during build
ARG NEXT_PUBLIC_ALGOLIA_APP_ID
ARG NEXT_PUBLIC_ALGOLIA_INDEX_NAME
ARG NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
ARG NEXT_PUBLIC_BACKEND_API_BASE_URL
ARG NEXT_PUBLIC_GENERATE_PDF_REPORT_API
ARG BROWSER_PATH
ENV NEXT_PUBLIC_ALGOLIA_APP_ID=$NEXT_PUBLIC_ALGOLIA_APP_ID \
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME=$NEXT_PUBLIC_ALGOLIA_INDEX_NAME \
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=$NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY \
    NEXT_PUBLIC_BACKEND_API_BASE_URL=$NEXT_PUBLIC_BACKEND_API_BASE_URL \
    NEXT_PUBLIC_GENERATE_PDF_REPORT_API=$NEXT_PUBLIC_GENERATE_PDF_REPORT_API \
    BROWSER_PATH=$BROWSER_PATH \
    NODE_ENV=production \
    PORT=3004 \
    NEXT_TELEMETRY_DISABLED=1 

# Create non-root user (Debian)
RUN groupadd -r nodejs && useradd -r -g nodejs nodeuser

# Copy required files INCLUDING node_modules (for chromium-min)
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules

# ✅ INSTALL CHROMIUM HERE - at RUNTIME (when container starts)
RUN npx --yes @sparticuz/chromium-min install

RUN chown -R nodeuser:nodejs /app

USER nodeuser
EXPOSE 3004
CMD ["node", "server.js"]