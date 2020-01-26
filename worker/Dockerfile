FROM node:alpine

WORKDIR /usr/worker

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]