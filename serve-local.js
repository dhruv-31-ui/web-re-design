var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var PORT = 3000;
var ROOT = __dirname;

var MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url);
  var pathname = parsedUrl.pathname;

  // Default to index.html for root
  if (pathname === '/') pathname = '/index.html';

  // Try direct file first, then .html extension
  var filePath = path.join(ROOT, pathname);
  var ext = path.extname(filePath).toLowerCase();

  function serveFile(fp) {
    fs.readFile(fp, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 Not Found</h1><p>' + fp + '</p>');
        return;
      }
      var fileExt = path.extname(fp).toLowerCase();
      var mime = MIME[fileExt] || 'application/octet-stream';
      res.writeHead(200, {'Content-Type': mime});
      res.end(data);
    });
  }

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.stat(filePath, function(err, stat) {
        if (stat && stat.isDirectory()) {
          serveFile(path.join(filePath, 'index.html'));
        } else {
          serveFile(filePath);
        }
      });
    } else if (!ext) {
      // Try appending .html
      serveFile(filePath + '.html');
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end('<h1>404 Not Found</h1>');
    }
  });
});

server.listen(PORT, function() {
  console.log('Server running at http://localhost:' + PORT + '/');
  console.log('Press Ctrl+C to stop.');
});
