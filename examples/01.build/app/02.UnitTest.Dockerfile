FROM node:10-alpine
COPY package.json /app
RUN npm i
COPY . /app
RUN npm test
CMD ["node", "index.js"]