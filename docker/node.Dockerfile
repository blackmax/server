# Docker-файл контейнера, который загружает зависимости остальных проектов
FROM node:9

#RUN apk update && apk add g++ make python git bash && npm i npm@latest -g

WORKDIR /opt/project

COPY . .

RUN npm cache verify && npm install

CMD ./node_modules/.bin/pm2-runtime process.yml
