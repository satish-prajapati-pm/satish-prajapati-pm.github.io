/* ── Custom cursor ── */
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
if (cursor && cursorRing) {
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function ringLoop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(ringLoop);
  })();
  document.querySelectorAll('a, button, .proj, .metric, .pillar, .skill-card, .tl-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('big'); cursorRing.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('big'); cursorRing.classList.remove('big'); });
  });
}

/* ── Preloader ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 500);
});

/* ── Nav: scroll class + active section ── */
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id], header.hero');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 40);

  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 120) current = s.id || 'hero';
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.classList.toggle('active', href === current);
  });

  tlScroll();
  toTop.classList.toggle('show', scrollY > 600);
}, { passive: true });
nav.classList.toggle('scrolled', scrollY > 40);

/* ── Typed effect ── */
const phrases = [
  'ship_mvp --on-time --on-budget',
  'align_stakeholders --timezones=all',
  'reduce_risk --by=40%',
  'lead_team --size=42 --mode=agile'
];
const typedEl = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function type() {
  const cur = phrases[pi];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 32 : 62);
}
if (reduced) { typedEl.textContent = phrases[0]; } else { type(); }

/* ── Scroll reveal ── */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: .13 });
document.querySelectorAll('.reveal, .tl-item').forEach(el => revealIO.observe(el));

/* ── Counters ── */
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const dur = 1400;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    if (reduced) { el.textContent = target; } else { requestAnimationFrame(tick); }
    counterIO.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

/* ── Timeline progress bar ── */
const tl  = document.getElementById('tl');
const bar = document.getElementById('tlbar');
function tlScroll() {
  if (!tl || !bar) return;
  const r  = tl.getBoundingClientRect();
  const vh = innerHeight;
  const p  = Math.min(Math.max((vh * 0.7 - r.top) / r.height, 0), 1);
  bar.style.height = (p * 100) + '%';
}
tlScroll();

/* ── Back to top ── */
const toTop = document.getElementById('toTop');
toTop.onclick = () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
