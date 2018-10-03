FROM node:10-alpine
WORKDIR /app
COPY package.json /app
RUN npm i
COPY . /app
RUN npm test
CMD ["npm", "start"]