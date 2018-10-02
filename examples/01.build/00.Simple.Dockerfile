FROM node:10-alpine
COPY . /app
RUN npm i
CMD ["node", "index.js"]