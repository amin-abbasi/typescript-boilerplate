FROM node:12.17.0-alpine

RUN npm install -g nodemon


WORKDIR /usr/src/app

COPY package.json ./package.json
RUN npm install

COPY . .
RUN npm install

RUN npm run build

EXPOSE 4000
CMD ["nodemon","dist/server.js"]
