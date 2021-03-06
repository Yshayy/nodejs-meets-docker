# dockerfile intro
FROM node:10-alpine
WORKDIR /app
COPY . /app
RUN npm i --production
CMD ["npm", "start"]