# Build context: repository root (yarn workspaces monorepo).
FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/api/package.json apps/api/
COPY apps/web-app/package.json apps/web-app/
RUN yarn workspaces focus web-app

COPY apps/web-app apps/web-app
WORKDIR /repo/apps/web-app
RUN yarn build

FROM nginx:alpine
COPY apps/web-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web-app/dist /usr/share/nginx/html
EXPOSE 5173
