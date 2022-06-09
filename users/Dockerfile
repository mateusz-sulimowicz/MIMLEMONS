# syntax=docker/dockerfile:1

FROM node:16-alpine
#ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "./"]
RUN npm install

COPY . .

CMD [ "npm", "start" ]
