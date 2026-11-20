const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// mobile menu
const toggle = $(".nav__toggle");
const menu = $("#nav-links");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open);
}

toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// header gets a border once you scroll
const header = $(".header");
const updateHeader = () => header.classList.toggle("is-scrolled", scrollY > 8);
addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

$("[data-year]").textContent = new Date().getFullYear();

// highlight the nav link for the section in view
const navLinks = $$(".nav__links a[href^='#']");
const navObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of navLinks) {
      link.setAttribute("aria-current", link.hash === `#${entry.target.id}`);
    }
  }
}, { rootMargin: "-45% 0px -50% 0px" });

for (const link of navLinks) {
  const section = $(link.hash);
  if (section) navObserver.observe(section);
}

// everything below is animation
const hero = $(".hero");
const stack = $("[data-stack]");

if (reducedMotion) {
  hero.classList.add("is-ready");
  stack.classList.add("is-ready");
  $$(".reveal").forEach((el) => el.classList.add("is-in"));
  $$(".decision").forEach((el) => el.classList.add("is-decided"));
  $(".method").classList.add("is-drawn");
} else {
  animateHero();
  animateOnScroll();
}

function animateHero() {
  requestAnimationFrame(() => {
    hero.classList.add("is-ready");
    stack.classList.add("is-ready");
  });

  // statuses start as "Syncing" and flip to their real value one by one
  $$(".board .status").forEach((pill, i) => {
    const { className, textContent } = pill;
    pill.className = "status status--pending";
    pill.textContent = "Syncing";

    setTimeout(() => {
      pill.className = `${className} is-synced`;
      pill.textContent = textContent;
      pill.closest(".board__row").classList.add("is-flash");
    }, 900 + i * 380);
  });

  if (!finePointer) return;

  // tilt the board stack towards the cursor
  let frame;
  hero.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = stack.getBoundingClientRect();
      const x = clamp((e.clientX - box.left - box.width / 2) / box.width);
      const y = clamp((e.clientY - box.top - box.height / 2) / box.height);
      stack.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
      stack.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
    });
  });
  hero.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    stack.style.removeProperty("--rx");
    stack.style.removeProperty("--ry");
  });
}

function animateOnScroll() {
  $$(".method li").forEach((step, i) => {
    step.style.transitionDelay = `${i * 180}ms`;
    step.style.setProperty("--delay", `${i * 180}ms`);
  });

  onceVisible($$(".reveal"), (el) => el.classList.add("is-in"), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  onceVisible($$(".method"), (el) => el.classList.add("is-drawn"), { threshold: 0.3 });
  onceVisible($$("[data-count]"), countUp, { threshold: 0.6 });
  onceVisible($$(".decision"), decide, { threshold: 0.4 });
}

function countUp(el) {
  const target = Number(el.dataset.count);
  const duration = 1400;
  let start;
  let finished = false;

  const finish = () => {
    finished = true;
    el.textContent = target;
  };

  const tick = (now) => {
    if (finished) return;
    start ??= now;
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - (1 - progress) ** 4));
    if (progress < 1) requestAnimationFrame(tick);
    else finish();
  };

  el.textContent = 0;
  requestAnimationFrame(tick);
  // rAF pauses in background tabs; make sure the real number always lands
  setTimeout(finish, duration + 200);
}

// walk through options A, B, C, then settle on the chosen one
function decide(record) {
  const options = $$(".decision__options li", record);
  let i = 0;

  const timer = setInterval(() => {
    options.forEach((o) => o.classList.remove("is-considering"));
    if (i < options.length) {
      options[i++].classList.add("is-considering");
    } else {
      clearInterval(timer);
      record.classList.add("is-decided");
    }
  }, 420);
}

function onceVisible(elements, callback, options) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      callback(entry.target);
    }
  }, options);
  elements.forEach((el) => observer.observe(el));
}

function clamp(n) {
  return Math.max(-1, Math.min(1, n));
}
