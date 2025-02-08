FROM node:23-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx npm run build --  --configuration=production && npx cap copy

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/www/browser /usr/share/nginx/html
COPY src/api/cert /usr/src/app/cert
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
