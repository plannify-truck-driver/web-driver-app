FROM node:26.8.1-alpine3.24 AS base

# Patch CVE-2026-22184 (zlib HIGH), CVE-2026-40200 (musl HIGH), CVE-2026-45186 (libexpat HIGH)
# RUN apk upgrade --no-cache zlib musl musl-utils libexpat

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001

# Install pnpm
RUN npm install -g pnpm@11.8.0 --ignore-scripts

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

FROM nginxinc/nginx-unprivileged:1.31.5-alpine3.24 AS production

# Patch CVE-2026-22184 (zlib HIGH), CVE-2026-40200 (musl HIGH), CVE-2026-45186 (libexpat HIGH), CVE-2026-33630 (c-ares HIGH)
# USER root
# RUN apk upgrade --no-cache zlib musl musl-utils libexpat c-ares
# USER nginx

# Patch util-linux family CVEs (CVE-2026-53612/53613/53614/76642/78408/78409/78410, all HIGH).
# libuuid is a separate apk package built from the util-linux source, so it must be
# upgraded explicitly — `apk upgrade util-linux` alone does not bump it.
USER root
RUN apk upgrade --no-cache util-linux libuuid
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