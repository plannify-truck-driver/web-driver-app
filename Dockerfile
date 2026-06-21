FROM node:26.3.1-alpine AS base

# Patch CVE-2026-22184 (zlib HIGH), CVE-2026-40200 (musl HIGH)
RUN apk upgrade --no-cache zlib musl musl-utils

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001

# Install pnpm via corepack (built into Node, no extra layer)
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

# Change ownership of the app directory to the non-root user
RUN chown -R reactuser:nodejs /app

FROM base AS deps

USER reactuser

COPY --chown=reactuser:nodejs package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder

ARG VITE_ENV=development
ARG VITE_VERSION=0.1.0
ARG VITE_API_URL=http://localhost:3000

ENV VITE_ENV=$VITE_ENV
ENV VITE_VERSION=$VITE_VERSION
ENV VITE_API_URL=$VITE_API_URL

USER reactuser

# Copy node_modules from deps stage
COPY --from=deps --chown=reactuser:nodejs /app/node_modules ./node_modules

COPY --chown=reactuser:nodejs . .

RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.31.2-alpine AS production

# Patch CVE-2026-22184 (zlib HIGH), CVE-2026-40200 (musl HIGH)
USER root
RUN apk upgrade --no-cache zlib musl musl-utils
USER nginx

# Patch CVE-2026-22184 (zlib HIGH), CVE-2026-40200 (musl HIGH)
USER root
RUN apk upgrade --no-cache zlib musl musl-utils
USER nginx

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY docker-entrypoint.sh /docker-entrypoint.sh
USER root
RUN chmod +x /docker-entrypoint.sh
USER nginx

EXPOSE 80

ENV NGINX_PORT=80

ENTRYPOINT ["/docker-entrypoint.sh"]