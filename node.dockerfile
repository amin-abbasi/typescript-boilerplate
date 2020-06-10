FROM node:12.17.0-alpine

RUN npm install -g nodemon


WORKDIR /usr/src/app

COPY package.json ./package.json
RUN npm install

COPY . .
RUN npm install

EXPOSE 3000
CMD ["nodemon","init.js"]
