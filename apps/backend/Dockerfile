# ── Build ──
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
RUN npm ci --workspace=apps/backend
COPY apps/backend apps/backend
RUN npm run build --workspace=apps/backend && npm prune --omit=dev

# ── Production ──
FROM node:20-alpine
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
WORKDIR /app
COPY --from=build --chown=appuser:appgroup /app/node_modules node_modules
COPY --from=build --chown=appuser:appgroup /app/apps/backend/node_modules apps/backend/node_modules
COPY --from=build --chown=appuser:appgroup /app/apps/backend/dist apps/backend/dist
COPY --from=build --chown=appuser:appgroup /app/apps/backend/package.json apps/backend/package.json
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "apps/backend/dist/main"]
