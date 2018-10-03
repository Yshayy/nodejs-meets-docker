FROM node:10-alpine
WORKDIR /app
COPY . /app
RUN npm i
CMD ["npm", "start"]