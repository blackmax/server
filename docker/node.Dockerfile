# Docker-файл контейнера, который загружает зависимости остальных проектов
FROM node:9-alpine

RUN apk update && apk add g++ make python git bash && npm i npm@latest -g

WORKDIR /opt/project

CMD rm -fRv node_modules && npm cache verify && npm install && npm ls&& npm audit && node ./server.js