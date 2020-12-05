FROM node:12.17.0-alpine

RUN npm install -g nodemon typescript

WORKDIR /usr/src

COPY package.json ./package.json
RUN npm install

RUN npm run build

# Change Your Port
EXPOSE 4000
CMD ["nodemon","dist/server.js"]
