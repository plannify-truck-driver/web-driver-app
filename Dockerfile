FROM node:25.6-alpine AS base

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Change ownership of the app directory to the non-root user
RUN chown -R reactuser:nodejs /app

FROM base AS deps

USER reactuser

COPY --chown=reactuser:nodejs package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

ARG VITE_ENV=development
ARG VITE_API_URL=http://localhost:3000

ENV VITE_ENV=$VITE_ENV
ENV VITE_API_URL=$VITE_API_URL

# Copy node_modules from deps stage
COPY --from=deps --chown=reactuser:nodejs /app/node_modules ./node_modules

COPY --chown=reactuser:nodejs . .

USER reactuser

RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.29.5-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY docker-entrypoint.sh /docker-entrypoint.sh
USER root
RUN chmod +x /docker-entrypoint.sh
USER nginx

EXPOSE 5173

ENV NGINX_PORT=5173

ENTRYPOINT ["/docker-entrypoint.sh"]