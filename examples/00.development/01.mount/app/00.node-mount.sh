docker run --rm -v `pwd`:/app node:10 node /app.index.js
docker run --rm -v `pwd`:/app node:10 node --experimental-modules /app.index.mjs