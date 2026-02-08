# ── Build ──
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/
RUN npm ci --workspace=apps/frontend
COPY apps/frontend apps/frontend
RUN npm run build --workspace=apps/frontend && npm prune --omit=dev

# ── Production ──
FROM node:20-alpine
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
WORKDIR /app
COPY --from=build --chown=appuser:appgroup /app/node_modules node_modules
COPY --from=build --chown=appuser:appgroup /app/apps/frontend/dist apps/frontend/dist
COPY --from=build --chown=appuser:appgroup /app/apps/frontend/package.json apps/frontend/package.json
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["npm", "start", "--workspace=apps/frontend"]
