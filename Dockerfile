# Imagem base
FROM node:20-alpine AS base

# Instala dependências necessárias para o Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Define variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Estágio de desenvolvimento
FROM base AS deps
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm ci

# Estágio de build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Adiciona variáveis de ambiente para build
ARG OPENAI_API_KEY
ARG STABILITY_AI_API_KEY
ARG CRAWLERX_WP_API_KEY
ARG CRAWLERX_WP_API_URL
ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_USERNAME
ARG AUTH_PASSWORD
ARG AUTH_TRUST_HOST

ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV STABILITY_AI_API_KEY=$STABILITY_AI_API_KEY
ENV CRAWLERX_WP_API_KEY=$CRAWLERX_WP_API_KEY
ENV CRAWLERX_WP_API_URL=$CRAWLERX_WP_API_URL
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_USERNAME=$AUTH_USERNAME
ENV AUTH_PASSWORD=$AUTH_PASSWORD
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
ENV NODE_ENV=production

# Gera o Prisma Client e faz o build da aplicação
RUN npx prisma generate
RUN npm run build

# Estágio de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Cria um usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/prisma ./prisma

# Define permissões corretas
RUN chown -R nextjs:nodejs .

# Define o usuário não-root
USER nextjs

# Expõe a porta
EXPOSE 3000

# Define as variáveis de ambiente de runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]