# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production image, copy all files and run the app
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

# Copy app
COPY --from=builder /app .

# Ensure logs dir exists and is writable
RUN mkdir -p /app/logs && chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 5002
CMD ["node", "src/server.js"]


