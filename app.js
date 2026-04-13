'use strict';

// ── Nav scroll effect ────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mode tabs ────────────────────────────────────────────────────────────────
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Role toggle ──────────────────────────────────────────────────────────────
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Enter key to send ────────────────────────────────────────────────────────
document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ── Demo responses ───────────────────────────────────────────────────────────
const DEMO_RESPONSES = [
  {
    tension: 'high',
    tags: ['avoids', 'escalating'],
    what: 'She\'s reacting from anxiety, not accusation. The question is a signal, not an attack.',
    reply: '"I hear you. I\'m not hiding anything — I just didn\'t want to bring work stress into our evening. Can we talk about what\'s really bothering you?"',
  },
  {
    tension: 'medium',
    tags: ['listens', 'avoids'],
    what: 'He\'s withdrawing to process, not to punish. Silence here is self-protection.',
    reply: '"I notice you\'ve gone quiet. I\'m not trying to pressure you — I just want to understand what you\'re feeling right now."',
  },
  {
    tension: 'low',
    tags: ['listens'],
    what: 'The tension is low. She\'s open to dialogue but needs to feel heard first.',
    reply: '"Thank you for telling me that. I want to make sure I understand — can you say more about what bothered you most?"',
  },
  {
    tension: 'high',
    tags: ['escalating', 'avoids'],
    what: 'This is a pattern of escalation. The real issue is unmet need for acknowledgment.',
    reply: '"You\'re right that I haven\'t been present lately. That\'s on me. Can we sit down tonight and actually talk — no phones, no distractions?"',
  },
  {
    tension: 'medium',
    tags: ['listens', 'avoids'],
    what: 'There\'s confusion, not hostility. He doesn\'t understand the impact of his words.',
    reply: '"When you said that, it felt dismissive to me — even if that wasn\'t your intention. I need you to know that it matters."',
  },
];

let responseIndex = 0;

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const messagesEl = document.getElementById('chatMessages');
  const welcomeEl = messagesEl.querySelector('.chat-welcome');
  if (welcomeEl) welcomeEl.remove();

  // Add user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'msg-bubble user';
  userBubble.textContent = text;
  messagesEl.appendChild(userBubble);
  input.value = '';
  messagesEl.scrollTop = messagesEl.scrollHeight;

  // Hide reply box while typing
  document.getElementById('chatReplyBox').style.display = 'none';
  document.getElementById('chatInsights').style.display = 'none';

  // Show typing indicator
  const typingBubble = document.createElement('div');
  typingBubble.className = 'msg-bubble typing';
  typingBubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  messagesEl.appendChild(typingBubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  // Simulate response after delay
  setTimeout(() => {
    typingBubble.remove();

    const resp = DEMO_RESPONSES[responseIndex % DEMO_RESPONSES.length];
    responseIndex++;

    // Update tension badge
    const badge = document.getElementById('tensionBadge');
    const dot = badge.querySelector('.tension-dot');
    const label = badge.querySelector('.tension-label');
    dot.className = 'tension-dot ' + resp.tension;
    label.textContent = resp.tension;

    // Show insights
    const insightsEl = document.getElementById('chatInsights');
    const insightRow = insightsEl.querySelector('.insight-row');
    insightRow.innerHTML = resp.tags.map(t => `<span class="insight-tag ${t}">${t}</span>`).join('');
    document.getElementById('insightWhat').textContent = resp.what;
    insightsEl.style.display = 'block';

    // Show reply box
    document.getElementById('replyText').textContent = resp.reply;
    document.getElementById('chatReplyBox').style.display = 'block';

    // Add assistant bubble (brief)
    const asstBubble = document.createElement('div');
    asstBubble.className = 'msg-bubble assistant';
    asstBubble.textContent = 'Analysis complete. See suggested reply below.';
    messagesEl.appendChild(asstBubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 1200 + Math.random() * 600);
}

// ── Copy reply ───────────────────────────────────────────────────────────────
function copyReply() {
  const text = document.getElementById('replyText').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard ✓'));
}

// ── Rewrite reply ────────────────────────────────────────────────────────────
const SOFTER_SUFFIX = ' I really value what we have and want us to figure this out together.';
const FIRMER_SUFFIX = ' I need you to hear me clearly on this.';

function rewriteReply(style) {
  const el = document.getElementById('replyText');
  const base = el.textContent.replace(SOFTER_SUFFIX, '').replace(FIRMER_SUFFIX, '');
  el.textContent = style === 'softer' ? base + SOFTER_SUFFIX : base + FIRMER_SUFFIX;
  showToast(style === 'softer' ? 'Made it softer ✓' : 'Made it firmer ✓');
}

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Demo section copy buttons ────────────────────────────────────────────────
document.querySelector('.demo-copy-btn').addEventListener('click', () => {
  const text = document.querySelector('.demo-reply-text').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard ✓'));
});

document.querySelector('.demo-soft-btn').addEventListener('click', () => {
  showToast('Softer version generated ✓');
});

document.querySelector('.demo-firm-btn').addEventListener('click', () => {
  showToast('Firmer version generated ✓');
});

// ── Scroll-in animations ─────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.how-card, .forwho-card, .pricing-card, .demo-insight-card, .why-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
