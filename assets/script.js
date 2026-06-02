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

// Form submission — POSTs to data-endpoint if set, otherwise just shows success UI
function initForms() {
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let successId = form.dataset.success;
      const attending = form.querySelector('input[name="attending"]:checked');
      if (attending && attending.value === 'no' && form.dataset.successDecline) {
        successId = form.dataset.successDecline;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : null;

      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending…';
        }
        try {
          const body = new URLSearchParams(new FormData(form));
          await fetch(endpoint, { method: 'POST', mode: 'no-cors', body });
        } catch (err) {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          alert("Sorry — couldn't send your RSVP. Check your connection and try again, or email info@anisa60.com.");
          return;
        }
      }

      document.querySelectorAll('.form-success.is-visible').forEach(el => el.classList.remove('is-visible'));

      const success = successId ? document.getElementById(successId) : null;
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  });
}

// Soundtrack page — fetch and render the list of song requests
function initSongList() {
  const wrap = document.querySelector('[data-songs]');
  if (!wrap) return;
  const endpoint = wrap.dataset.songsEndpoint;
  const list = wrap.querySelector('[data-songs-list]');
  const status = wrap.querySelector('[data-songs-status]');
  if (!endpoint || !list || !status) return;

  function escape(str) {
    const div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
  }

  fetch(endpoint, { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
    .then(data => {
      const songs = (data && Array.isArray(data.songs)) ? data.songs : [];
      if (!songs.length) {
        status.textContent = 'No requests yet — be the first.';
        return;
      }
      status.textContent = songs.length + ' song' + (songs.length === 1 ? '' : 's') + ' so far';
      list.innerHTML = songs.map(s => {
        const song = escape(s.song);
        const artist = escape(s.artist);
        return '<li class="songs-list-row">' +
                 '<span class="songs-list-title">' + song + '</span>' +
                 (artist ? '<span class="songs-list-artist">' + artist + '</span>' : '') +
               '</li>';
      }).join('');
      list.classList.add('is-loaded');
    })
    .catch(() => {
      // Endpoint not yet returning JSON (e.g. doGet hasn't been added/redeployed).
      // Hide the section quietly so the page still looks intentional.
      wrap.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initActiveNav();
  initCountdown();
  initTimelineTabs();
  initForms();
  initSongList();
});
