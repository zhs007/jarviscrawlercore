FROM node:latest

MAINTAINER zerro "zerrozhao@gmail.com"

WORKDIR /usr/src/app/

COPY package.json ./
COPY package-lock.json ./
RUN npm i -dd

COPY ./ ./

