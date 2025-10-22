# -------------------- Build Stage --------------------
FROM node:24-trixie-slim AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN ls -R src/Apis

RUN npm run build

# -------------------- Production Stage --------------------
FROM node:24-trixie-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD ["npm", "run", "start:prod:server"]