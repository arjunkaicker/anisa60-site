/* ============================================
   STUDIO 60 — Shared header & footer injection
   Allows every page to embed nav + footer with one tag.
   ============================================ */

const NAV_HTML = `
<nav class="top-nav" aria-label="Primary">
  <div class="nav-inner">
    <a class="nav-brand" href="index.html" aria-label="Studio 60 Home">
      <img src="assets/studio60-logo.png" alt="Studio 60" />
    </a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
    <ul class="nav-links">
      <li><a class="nav-link" href="rsvp.html">RSVP</a></li>
      <li><a class="nav-link" href="run-of-show.html">Run of Show</a></li>
      <li><a class="nav-link" href="venue.html">Venue</a></li>
      <li><a class="nav-link" href="dress-code.html">Dress Code</a></li>
      <li><a class="nav-link" href="request-a-song.html">Request a Song</a></li>
      <li><a class="nav-link" href="travel.html">Travel</a></li>
      <li><a class="nav-link" href="advocacy.html">Advocacy</a></li>
    </ul>
  </div>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer">
  <img class="footer-logo" src="assets/studio60-logo.png" alt="Studio 60" />
  <div class="footer-tag">Create · Connect · Celebrate</div>
  <p style="margin-top: 16px;">Anisa's 60th · July 24, 2026 · Atlanta, GA</p>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  const navMount = document.getElementById('site-nav');
  const footMount = document.getElementById('site-footer');
  if (navMount) navMount.outerHTML = NAV_HTML;
  if (footMount) footMount.outerHTML = FOOTER_HTML;
});
