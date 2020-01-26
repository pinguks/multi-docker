FROM node:alpine AS build

WORKDIR /usr/client

COPY package*.json ./

RUN npm i

COPY ./ ./

RUN npm run build


FROM nginx

EXPOSE 80

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/client/build /usr/share/nginx/html