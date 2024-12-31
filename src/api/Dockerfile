FROM node:18-slim

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

RUN npm install

CMD ["node", "index.js"]
