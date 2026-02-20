/* global Stripe */
'use strict';

(async function () {
  // ---------------------------------------------------------------------------
  // Fetch the Stripe publishable key from the server so it doesn't have to be
  // hard-coded in this static file.
  // ---------------------------------------------------------------------------
  let publishableKey;
  try {
    const configRes = await fetch('/api/payments/config');
    if (!configRes.ok) throw new Error('Failed to load payment config');
    const config = await configRes.json();
    publishableKey = config.publishableKey;
  } catch (err) {
    showResult('error', 'Could not load payment configuration. Please refresh the page.');
    return;
  }

  if (!publishableKey || publishableKey.startsWith('pk_test_your')) {
    showResult(
      'error',
      'Stripe publishable key is not configured. Set STRIPE_PUBLISHABLE_KEY in your .env file.',
    );
    return;
  }

  const stripe = Stripe(publishableKey);
  const elements = stripe.elements();

  // Mount the Card Element
  const cardElement = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': { color: '#9ca3af' },
      },
    },
  });
  cardElement.mount('#card-element');

  // Real-time card validation errors
  cardElement.on('change', (event) => {
    const errorDiv = document.getElementById('card-errors');
    errorDiv.textContent = event.error ? event.error.message : '';
  });

  // ---------------------------------------------------------------------------
  // Form submission
  // ---------------------------------------------------------------------------
  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);
    clearResult();

    const amountInput = document.getElementById('amount');
    const amount = parseInt(amountInput.value, 10);

    if (!amount || amount < 50) {
      showResult('error', 'Amount must be at least 50 cents (e.g. 50 = $0.50).');
      setLoading(false);
      return;
    }

    // 1. Create PaymentIntent on the server
    let clientSecret;
    try {
      const intentRes = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'usd', description: 'Phu AI payment' }),
      });
      const intentData = await intentRes.json();
      if (!intentRes.ok) {
        showResult('error', intentData.error || 'Failed to create payment intent.');
        setLoading(false);
        return;
      }
      clientSecret = intentData.clientSecret;
    } catch {
      showResult('error', 'Network error. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    // 2. Confirm the payment with the Card Element
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      showResult('error', error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      showResult('success', '✅ Payment succeeded! Thank you for your purchase.');
      form.reset();
      cardElement.clear();
    } else {
      showResult('error', 'Payment could not be completed. Please try again.');
    }

    setLoading(false);
  });

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function setLoading(loading) {
    const btn = document.getElementById('submit-btn');
    btn.disabled = loading;
    btn.textContent = loading ? 'Processing…' : 'Pay Now';
  }

  function showResult(type, message) {
    const div = document.getElementById('result');
    div.className = type;
    div.textContent = message;
    div.style.display = 'block';
  }

  function clearResult() {
    const div = document.getElementById('result');
    div.style.display = 'none';
    div.textContent = '';
    div.className = '';
  }
})();
