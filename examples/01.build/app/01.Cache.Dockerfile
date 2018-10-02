FROM node:10-alpine
COPY package.json /app
RUN npm i
COPY . /app
CMD ["node", "index.js"]