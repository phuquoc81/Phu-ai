'use strict';

function escHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const grid = document.getElementById('products');
  grid.innerHTML = products
    .map(
      (p) => `
    <div class="card">
      <div class="emoji">${escHtml(p.image)}</div>
      <h3>${escHtml(p.name)}</h3>
      <div class="price">$${(p.price / 100).toFixed(2)} CAD</div>
      <div class="actions">
        <a class="btn btn-primary" href="checkout.html?id=${encodeURIComponent(p.id)}&method=card">
          💳 Pay by Card
        </a>
        <a class="btn btn-secondary" href="checkout.html?id=${encodeURIComponent(p.id)}&method=acss_debit">
          🏦 Bank / e-Transfer
        </a>
      </div>
    </div>
  `
    )
    .join('');
}

loadProducts().catch(() => {
  document.getElementById('products').textContent = 'Could not load products.';
});
