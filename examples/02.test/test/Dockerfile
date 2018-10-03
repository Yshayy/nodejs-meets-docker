FROM node:10-alpine
WORKDIR /tests
COPY package.json /tests
RUN npm i
COPY . /tests
CMD ["npm", "test"]