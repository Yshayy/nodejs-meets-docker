FROM node:10-alpine as base
####
FROM base as deps
WORKDIR /deps
COPY package.json /deps
RUN npm i --production

###
FROM base as tests
WORKDIR /tests
COPY --from=deps /deps /tests
RUN npm i
COPY . /tests
RUN npm test

###
FROM base as release
WORKDIR /app
COPY --from=deps deps /app
COPY . /app
CMD ["npm", "start"]