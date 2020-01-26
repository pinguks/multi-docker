FROM mhart/alpine-node

WORKDIR /usr/api

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]