FROM node:20-bookworm

WORKDIR /app

# Native modules (better-sqlite3) need build tools on Linux
RUN apt-get update && apt-get install -y python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
# postinstall runs prisma generate — needs schema + config present
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci --include=dev

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/var/data
ENV DATABASE_URL=file:/var/data/app.db

EXPOSE 3000

CMD ["npm", "start"]
