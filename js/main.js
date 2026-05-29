/* ============================================================
   APTUS – Additive Components · main.js
   ============================================================ */

/* ---- 1. Höhenlinien-Wave im Hero (an das Logo angelehnt) ---- */
(function buildWave() {
  const host = document.getElementById('heroWave');
  if (!host) return;

  const W = 1440, H = 900, LINES = 26;
  let paths = '';

  // Mehrere fließende, leicht versetzte Linien erzeugen
  for (let i = 0; i < LINES; i++) {
    const baseY = 120 + i * ((H - 240) / LINES);
    const amp = 26 + Math.sin(i * 0.6) * 18;
    const freq = 1.6 + (i % 5) * 0.12;
    const phase = i * 0.45;
    let d = `M -40 ${baseY}`;
    for (let x = 0; x <= W + 40; x += 24) {
      const t = x / W;
      // zwei überlagerte Wellen + leichte Drift nach rechts oben (wie im Logo)
      const y = baseY
        + Math.sin(t * Math.PI * freq + phase) * amp
        + Math.sin(t * Math.PI * 4 + phase * 2) * (amp * 0.18)
        - t * 70;
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    const op = (0.05 + (1 - i / LINES) * 0.16).toFixed(3);
    paths += `<path d="${d}" style="opacity:${op}"/>`;
  }

  host.innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;

  // sanfte, langsame Drift der Linien
  const svg = host.querySelector('svg');
  let raf, start = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    function tick(ts) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      svg.style.transform = `translateY(${Math.sin(t * 0.25) * 8}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }
})();

/* ---- 2. Sticky-Header ------------------------------------- */
(function stickyHeader() {
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---- 3. Mobile-Navigation --------------------------------- */
(function mobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ---- 4. Scroll-Reveal ------------------------------------- */
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // gestaffelte Einblendung je Gruppe
        e.target.style.transitionDelay = (i % 4) * 80 + 'ms';
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
})();

/* ---- 5. Jahr in der Fußzeile ------------------------------ */
document.getElementById('year').textContent = new Date().getFullYear();
