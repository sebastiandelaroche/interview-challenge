# Build context: repository root (yarn workspaces monorepo).
FROM node:24-alpine
WORKDIR /repo
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/api/package.json apps/api/
COPY apps/web-app/package.json apps/web-app/
RUN yarn workspaces focus api

COPY apps/api apps/api
WORKDIR /repo/apps/api
# prisma.config.ts reads POSTGRES_URL at load time; generate doesn't connect.
RUN POSTGRES_URL=postgresql://build/build npx prisma generate && yarn build

ENV NODE_ENV=production PORT=3000
EXPOSE 3000

# Apply pending migrations, then start the API.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
