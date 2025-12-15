# --- Frontend build stage ---------------------------------------------------
FROM node:22 AS client-build

WORKDIR /client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# --- Runtime stage ----------------------------------------------------------
FROM ghcr.io/puppeteer/puppeteer:22.7.0

ARG NODE_ENV=production

WORKDIR /service

COPY package.json yarn.lock ./
USER root
RUN apt-get update && apt-get install -y fonts-noto-color-emoji && rm -rf /var/lib/apt/lists/*
RUN yarn install --frozen-lockfile

COPY . .
RUN touch .env && chown pptruser:pptruser .env
COPY --from=client-build /client/dist ./client/dist

USER pptruser

ENV PORT 2305
EXPOSE 2305
CMD ["node", "src/index"]
