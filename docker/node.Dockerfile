# Docker-файл контейнера, который загружает зависимости остальных проектов
FROM node:8

#RUN apk update && apk add g++ make python git bash && npm i npm@latest -g

WORKDIR /opt/project

COPY . .
CMD ls
CMD rm -fRv node_modules && npm cache verify && npm install && npm ls&& npm audit

EXPOSE 3000 3080

CMD ./node_modules/.bin/pm2-runtime process.yml
