const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const baseDir = __dirname;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url;
  if (reqPath === '/') reqPath = '/index.html';
  const safePath = path.normalize(path.join(baseDir, reqPath));
  if (!safePath.startsWith(baseDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    if (stats.isDirectory()) {
      res.statusCode = 301;
      res.setHeader('Location', req.url + '/');
      res.end();
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type);

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.statusCode = 500;
      res.end('Server error');
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
