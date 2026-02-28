/**
 * SuperI.TBoyz — Buyer Automation & Chatbot
 * Connects buyers to Phu Quoc Nguyen's jewelry listings
 */

/* ---- Contact details ---- */
const STORE = {
  name:     'SuperI.TBoyz',
  owner:    'Phu Quoc Nguyen',
  email:    'anhvankiet81@gmail.com',
  phone:    '+13653662208',
  facebook: 'https://www.facebook.com/profile.php?id=phuhanddevice81',
};

/* ---- Automated response knowledge base ---- */
const AUTO_REPLIES = [
  {
    keywords: ['price', 'cost', 'how much', 'pricing'],
    reply: `Our gold plated ruby jewelry starts at just $29.99! 🏷️\n\n• Ruby Stud Earrings — $29.99\n• Ruby Drop Earrings — $34.99\n• Ruby Hoop Earrings — $39.99\n• Ruby Solitaire Ring — $44.99\n• Ruby Cluster Ring  — $54.99\n• Ruby Eternity Ring — $64.99\n\nAll prices include free gift wrapping! 🎁`,
  },
  {
    keywords: ['ship', 'shipping', 'deliver', 'delivery'],
    reply: `🚚 We ship worldwide!\n\n• USA — 3–5 business days (FREE on orders $50+)\n• Canada / UK — 7–12 days\n• Worldwide — 10–18 days\n\nAll orders come with tracking. Need express shipping? Message Phu directly!`,
  },
  {
    keywords: ['return', 'refund', 'exchange'],
    reply: `✅ We offer a 30-day hassle-free return policy.\n\nIf you're not 100% happy with your purchase, reach out to us:\n📧 ${STORE.email}\n📞 ${STORE.phone}\n\nWe'll make it right! 💎`,
  },
  {
    keywords: ['gold', 'plated', 'real', 'material', 'quality'],
    reply: `💎 All our pieces are 18K gold plated over premium sterling silver.\n\nThe rubies are high-grade synthetic gemstones that are:\n✅ Nickel-free & hypoallergenic\n✅ Fade-resistant with proper care\n✅ Polished to a brilliant finish\n\nWe stand behind our quality 100%!`,
  },
  {
    keywords: ['facebook', 'fb', 'marketplace', 'social'],
    reply: `📘 Find Phu on Facebook!\n\n👉 ${STORE.facebook}\n\nYou can browse all listings, message directly, and even pay through Facebook Marketplace. Super convenient! 🛍️`,
  },
  {
    keywords: ['contact', 'reach', 'call', 'email', 'phone', 'text', 'message'],
    reply: `📬 You can reach ${STORE.owner} anytime:\n\n📧 Email: ${STORE.email}\n📞 Phone/Text: ${STORE.phone}\n📘 Facebook: ${STORE.facebook}\n\nResponse time is usually within a few hours. We love hearing from our customers! 💛`,
  },
  {
    keywords: ['earring', 'stud', 'hoop', 'drop'],
    reply: `👂 Our earring collection is perfect for any occasion!\n\n• Ruby Stud Earrings — $29.99 (everyday elegance)\n• Ruby Drop Earrings — $34.99 (evening glamour)\n• Ruby Hoop Earrings — $39.99 (bold statement)\n\nClick any earring card above to inquire or place an order! ✨`,
  },
  {
    keywords: ['ring', 'solitaire', 'cluster', 'eternity', 'band'],
    reply: `💍 Our ring collection is stunning!\n\n• Ruby Solitaire Ring — $44.99 (bold & classic)\n• Ruby Cluster Ring  — $54.99 (sparkle from every angle)\n• Ruby Eternity Ring — $64.99 (endless love symbol)\n\nAll rings are available in sizes 5–12. Click any ring card above to inquire! 💎`,
  },
  {
    keywords: ['size', 'sizes', 'fit'],
    reply: `📏 Rings are available in US sizes 5 through 12.\n\nNot sure of your size? No problem — send Phu a message and he'll guide you through measuring at home:\n📞 ${STORE.phone}\n📧 ${STORE.email}`,
  },
  {
    keywords: ['gift', 'wrap', 'packaging', 'box'],
    reply: `🎁 Every order comes with complimentary luxury gift packaging!\n\nWant a personalized gift message? Just let us know at checkout or send a message to Phu:\n📧 ${STORE.email}`,
  },
  {
    keywords: ['discount', 'sale', 'coupon', 'offer', 'deal', 'promo'],
    reply: `🔥 Special offer LIVE now!\n\nBuy any 2 pieces and get 15% OFF your order! 🛍️\n\nTo claim your discount, mention code RUBY15 when messaging Phu:\n📘 ${STORE.facebook}\n📞 ${STORE.phone}`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    reply: `Hello! 👋 Welcome to ${STORE.name}!\n\nI'm Phu's automated assistant. I can help you with:\n• Pricing & products\n• Shipping info\n• Returns & refunds\n• Connecting you to Phu directly\n\nWhat would you like to know? 💎`,
  },
];

/* ---- Fallback reply ---- */
const FALLBACK = `That's a great question! Let me connect you directly with Phu 📲\n\n📧 ${STORE.email}\n📞 ${STORE.phone}\n📘 Facebook: ${STORE.facebook}\n\nPhu typically responds within a few hours. Thank you for your interest in ${STORE.name}! 💎`;

/* ---- Chat state ---- */
let chatOpen = false;

/* ---- Toggle chat window ---- */
function toggleChat() {
  const win = document.getElementById('chat-window');
  chatOpen = !chatOpen;
  win.classList.toggle('hidden', !chatOpen);
  if (chatOpen) {
    document.getElementById('chat-input').focus();
  }
}

/* ---- Open chat with a product inquiry pre-filled ---- */
function openChat(productName) {
  const win = document.getElementById('chat-window');
  chatOpen = true;
  win.classList.remove('hidden');

  const input = document.getElementById('chat-input');
  input.value = `I'm interested in the ${productName}`;
  input.focus();

  // Auto-send after a short delay to feel responsive
  setTimeout(() => sendMessage(), 400);
}

/* ---- Handle Enter key ---- */
function handleKey(event) {
  if (event.key === 'Enter') sendMessage();
}

/* ---- Send a message and generate automated reply ---- */
function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';

  // Show typing indicator
  const typing = appendMessage('…', 'bot');

  setTimeout(() => {
    const reply = generateReply(text);
    typing.textContent = reply;
    scrollToBottom();

    // If the user mentions a product, offer the Facebook link
    const productKeywords = ['earring', 'ring', 'solitaire', 'cluster', 'eternity', 'stud', 'hoop', 'drop'];
    if (productKeywords.some(k => text.toLowerCase().includes(k))) {
      setTimeout(() => {
        appendMessage(`🛍️ View this item on Facebook Marketplace: ${STORE.facebook}`, 'bot');
        scrollToBottom();
      }, 800);
    }
  }, 900);
}

/* ---- Match user input against knowledge base ---- */
function generateReply(text) {
  const lower = text.toLowerCase();
  for (const entry of AUTO_REPLIES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.reply;
    }
  }
  return FALLBACK;
}

/* ---- Append a message bubble ---- */
function appendMessage(text, role) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.style.whiteSpace = 'pre-line';
  div.textContent = text;
  container.appendChild(div);
  scrollToBottom();
  return div;
}

/* ---- Scroll chat to bottom ---- */
function scrollToBottom() {
  const container = document.getElementById('chat-messages');
  container.scrollTop = container.scrollHeight;
}
