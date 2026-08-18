# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first to maximize build cache reuse.
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Build static assets.
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

# Replace default server config with SPA-friendly routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
