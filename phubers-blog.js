/**
 * Phubers Blog module
 * Blog component for phubers.blog
 */

'use strict';

const posts = [
  {
    id: 1,
    title: 'Introducing Phu AI',
    body: 'Phu AI is a next-generation webapp powered by PhuOptimizer 81.',
    date: '2026-02-20',
  },
];

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const items = posts
    .map((p) => `<li><strong>${p.title}</strong> (${p.date})<br>${p.body}</li>`)
    .join('');
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>Phubers Blog</title></head>
      <body>
        <h1>Phubers Blog</h1>
        <ul>${items}</ul>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
}

module.exports = { handler, posts };
