FROM node:22-slim AS build

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

# Generate SSL certificates in the container

# Copy the openssl configuration file
# COPY cert/ca.cnf /usr/src/app/cert/ca.cnf

# Generate the SSL certificates
# RUN mkdir -p /usr/src/app/cert && \
#     openssl genrsa -out /usr/src/app/cert/client.key 4096 && \
#     openssl req -new -x509 -key /usr/src/app/cert/client.key -out /usr/src/app/cert/client.crt -days 3650 -config /usr/src/app/cert/ca.cnf

# In case of generate the certfiles inside the container, the following command should be used in your terminal to copy the certfiles to the host machine

# docker cp prova-hidrica-backend:/usr/src/app/cert/client.crt ./client.crt
# docker cp prova-hidrica-backend:/usr/src/app/cert/client.key ./client.key

#

RUN npm install

CMD ["node", "index.js"]
