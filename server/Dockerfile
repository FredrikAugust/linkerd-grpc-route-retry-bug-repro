FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm i

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

EXPOSE 4242
ENTRYPOINT ["node", "--experimental-strip-types", "src/index.ts"]