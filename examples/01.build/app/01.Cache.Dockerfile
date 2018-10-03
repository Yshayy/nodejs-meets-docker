FROM node:10-alpine
WORKDIR /app
COPY package.json /app
RUN npm i --production
COPY . /app
CMD ["npm", "start"]