FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy peer deps to handle Next.js 15 requirements
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the Next.js application using npm scripts
# Expect package.json to define "build" and "start" scripts (Next.js default)
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only the necessary artifacts to run "npm run start"
# 1) App files for runtime (package.json + lock for npm to run scripts if needed)
COPY package.json package-lock.json* ./
# 2) Compiled output and required runtime assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# 3) Node modules from deps (contains production deps)
COPY --from=deps /app/node_modules ./node_modules

# Set correct ownership
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Run using npm scripts (Next.js will serve via "next start")
CMD ["npm", "run", "start"]