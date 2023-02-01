FROM node:14 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod


FROM nginx:1.19
COPY --from=build /usr/src/app/dist/claims-americold/ /usr/share/nginx/html

