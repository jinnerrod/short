FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && \
    test -f dist/server/entry.mjs || \
    (echo "ERROR: dist/server/entry.mjs no fue generado — el build falló" && exit 1)


FROM node:22-alpine

# Librería de runtime requerida por el binario nativo de better-sqlite3
RUN apk add --no-cache libstdc++

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p /app/data

EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

CMD ["node", "./dist/server/entry.mjs"]
