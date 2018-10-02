const http = require('http');
const magic = require('./magic')(['underline', 'inverse', 'grey', 'yellow', 'red', 'green','blue', 'white', 'cyan', 'magenta']);

const app = new http.Server((req, res) => {
  const message = magic(req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end('\n');
});

app.listen(3000, () => {
  console.log(`server is listening on port 3000`);
});