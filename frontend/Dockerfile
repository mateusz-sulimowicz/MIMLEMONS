# syntax=docker/dockerfile:1

FROM node:16-alpine
#ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "./"]
RUN npm install

COPY . .

EXPOSE 3000

RUN [ "npm", "run", "build" ]
CMD  npx serve -s build

