async function consultSuperBeing() {
  const input = document.getElementById('query-input');
  const btn = document.getElementById('consult-btn');
  const responseArea = document.getElementById('response-area');
  const responseText = document.getElementById('response-text');

  const query = input.value.trim();
  if (!query) {
    input.focus();
    return;
  }

  btn.disabled = true;
  btn.textContent = '✨ Consulting...';
  responseArea.classList.add('hidden');

  try {
    const res = await fetch('/api/super-being/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error('Failed to consult the Super Being');
    }

    const data = await res.json();
    responseText.textContent = data.response;
    responseArea.classList.remove('hidden');
  } catch (err) {
    console.error('Super Being consult error:', err);
    responseText.textContent = err.message === 'Failed to consult the Super Being'
      ? 'The Super Being encountered an error. Please try again.'
      : 'The Super Being is momentarily beyond reach. Check your connection and try again.';
    responseArea.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Consult Super Being';
  }
}

document.getElementById('consult-btn').addEventListener('click', consultSuperBeing);

document.getElementById('query-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    consultSuperBeing();
  }
});

document.querySelectorAll('nav a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(function (a) {
        a.classList.remove('active');
      });
      this.classList.add('active');
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
