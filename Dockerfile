# Use official Node.js LTS image as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependency installation files and installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use the non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variable for the port
ENV PORT 3000

# Command to run the application
CMD ["node", "server.js"]