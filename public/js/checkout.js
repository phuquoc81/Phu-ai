'use strict';
/* global Stripe */

// ── Read URL params ────────────────────────────────────────────────────────
const params = new URLSearchParams(location.search);
const productId = params.get('id');
const initMethod = ['card', 'acss_debit'].includes(params.get('method'))
  ? params.get('method')
  : 'card';

// ── Helpers ────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function showError(msg) {
  document.getElementById('error-msg').textContent = msg || '';
}

// ── Active payment method state ────────────────────────────────────────────
let activeMethod = initMethod;

// ── Load Stripe & product ──────────────────────────────────────────────────
async function init() {
  const pkMeta = document.querySelector('meta[name="stripe-pk"]');
  const publishableKey = pkMeta ? pkMeta.content : 'pk_test_placeholder';

  const res = await fetch('/api/products');
  const products = await res.json();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    document.getElementById('product-summary').textContent = 'Product not found.';
    return;
  }

  document.getElementById('product-summary').innerHTML = `
    <div class="emoji">${escHtml(product.image)}</div>
    <div>
      <h3>${escHtml(product.name)}</h3>
      <div class="price">$${(product.price / 100).toFixed(2)} ${product.currency.toUpperCase()}</div>
    </div>
  `;

  // ── Stripe Elements ──────────────────────────────────────────────────────
  const stripe = Stripe(publishableKey);
  const elements = stripe.elements();

  const cardElement = elements.create('card', {
    style: {
      base: { fontSize: '16px', color: '#1a1a2e', '::placeholder': { color: '#aaa' } },
      invalid: { color: '#e94560' },
    },
  });
  cardElement.mount('#card-element');
  cardElement.on('focus', () =>
    document.getElementById('card-element').classList.add('focused')
  );
  cardElement.on('blur', () =>
    document.getElementById('card-element').classList.remove('focused')
  );
  cardElement.on('change', (e) => {
    showError(e.error ? e.error.message : '');
    updatePayBtn();
  });

  // ── Tab switching ────────────────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeMethod = btn.dataset.method;
      document.querySelectorAll('.tab-btn').forEach((b) =>
        b.classList.toggle('active', b === btn)
      );
      document.querySelectorAll('.method-section').forEach((s) => {
        s.classList.toggle('visible', s.id === `section-${activeMethod}`);
      });
      updatePayBtn();
    });
    if (btn.dataset.method === initMethod) btn.click();
  });

  function updatePayBtn() {
    const nameOk =
      document.getElementById('cust-name').value.trim().length > 0;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      document.getElementById('cust-email').value.trim()
    );
    document.getElementById('pay-btn').disabled = !(nameOk && emailOk);
  }

  ['cust-name', 'cust-email'].forEach((id) => {
    document.getElementById(id).addEventListener('input', updatePayBtn);
  });

  // ── Submit handler ───────────────────────────────────────────────────────
  document.getElementById('pay-btn').addEventListener('click', async () => {
    const btn = document.getElementById('pay-btn');
    btn.disabled = true;
    btn.textContent = 'Processing…';
    showError('');

    const customerName = document.getElementById('cust-name').value.trim();
    const customerEmail = document.getElementById('cust-email').value.trim();

    try {
      const resp = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          paymentMethodType: activeMethod,
          customerName,
          customerEmail,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(
          (data.errors && data.errors[0]?.msg) || data.error || 'Unknown error'
        );
      }

      const { clientSecret } = data;

      let result;
      if (activeMethod === 'card') {
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: customerName, email: customerEmail },
          },
        });
      } else if (activeMethod === 'acss_debit') {
        result = await stripe.confirmAcssDebitPayment(clientSecret, {
          payment_method: {
            billing_details: { name: customerName, email: customerEmail },
          },
        });
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      window.location.href = '/success.html';
    } catch (err) {
      showError(err.message || 'Payment failed. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Pay now';
    }
  });
}

init().catch((err) => {
  console.error(err);
  document.getElementById('product-summary').textContent =
    'Failed to load checkout.';
});
