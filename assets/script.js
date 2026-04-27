/* ============================================
   STUDIO 60 — Shared site script
   ============================================ */

// Mobile nav toggle
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', links.classList.contains('is-open'));
  });
}

// Highlight active nav link based on current page
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });
}

// Countdown to event date
function initCountdown() {
  const wrap = document.getElementById('countdown');
  if (!wrap) return;

  // Event: July 24, 2026 at 7:00 PM Eastern Time (Atlanta, GA)
  // ET in late July is EDT = UTC-4
  const eventTime = new Date('2026-07-24T19:00:00-04:00').getTime();

  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-minutes'),
    s: document.getElementById('cd-seconds'),
  };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, eventTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);

    if (els.d) els.d.textContent = days;
    if (els.h) els.h.textContent = pad(hours);
    if (els.m) els.m.textContent = pad(minutes);
    if (els.s) els.s.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

// Run of Show tabs
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab');
  const panes = document.querySelectorAll('.timeline-pane');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panes.forEach(p => p.classList.toggle('is-active', p.dataset.pane === target));
    });
  });
}

// Form submission feedback (RSVP / Song request) — front-end only stub
function initForms() {
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successId = form.dataset.success;
      const success = successId ? document.getElementById(successId) : null;
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNav();
  initCountdown();
  initTimelineTabs();
  initForms();
});
