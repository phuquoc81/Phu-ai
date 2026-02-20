/**
 * Phu AI - Main Application Entry Point
 * Integrates PhuOptimizer 81 and Phubers Blog
 */

'use strict';

const http = require('http');
const phubersBlog = require('./phubers-blog');
const phuhandDevice = require('./phuhanddevice81');

const PORT = process.env.PORT || 3000;

const routes = {
  '/': homePage,
  '/blog': phubersBlog.handler,
  '/device': devicePage,
};

function homePage(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>Phu AI</title></head>
      <body>
        <h1>Welcome to Phu AI</h1>
        <p>Powered by PhuOptimizer 81</p>
        <ul>
          <li><a href="/blog">Phubers Blog</a></li>
          <li><a href="/device">PhuHand Device 81</a></li>
        </ul>
      </body>
    </html>
  `);
}

function devicePage(req, res) {
  const config = phuhandDevice.getConfig();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(config, null, 2));
}

const server = http.createServer((req, res) => {
  const handler = routes[req.url] || notFound;
  handler(req, res);
});

function notFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
}

server.listen(PORT, () => {
  console.log(`Phu AI running on port ${PORT}`);
  console.log(`PhuHand Device 81 VLAN: ${phuhandDevice.getConfig().vlan.id}`);
});

module.exports = server;
