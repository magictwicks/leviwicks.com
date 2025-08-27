# ---- Build stage ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    # Build Next.js (creates .next, including .next/standalone)
    RUN npm run build
    
    # ---- Run stage ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    # Cloud Run will send requests to $PORT; Next must listen on it.
    ENV NODE_ENV=production
    ENV PORT=8080
    
    # Copy the minimal server produced by 'standalone'
    COPY --from=builder /app/.next/standalone ./
    # Next also needs its static assets and public/ if used
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    
    # Cloud Run health check expects the server to bind 0.0.0.0:$PORT
    EXPOSE 8080
    CMD ["node", "server.js"]
    