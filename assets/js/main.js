/* Satish Prajapati — assets/js/main.js
   Progressive enhancement only: the page is fully readable without JS. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -- Mobile drawer ------------------------------------------------------ */
  var burger = document.querySelector("[data-burger]");
  var drawer = document.getElementById("nav-drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        drawer.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (m) {
      if (m.matches) {
        drawer.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* -- Scroll progress bar ------------------------------------------------ */
  var bar = document.querySelector("[data-progress]");
  if (bar) {
    var tick = function () {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, d.scrollTop / max) : 0) + ")";
    };
    window.addEventListener("scroll", tick, { passive: true });
    tick();
  }

  /* -- Active nav link ---------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* -- Delivery-stage tabs ------------------------------------------------ */
  var STAGES = [
    { num: "01", title: "Understand", c: "#7C5CFF", line: "Before anything is planned, the goal has to be unambiguous.", items: ["Business goals", "User needs", "Constraints", "Success criteria"] },
    { num: "02", title: "Structure",  c: "#22D3EE", line: "Turn intent into a shape the team can actually execute.",   items: ["Scope", "Priorities", "Roadmap", "Resources", "Dependencies"] },
    { num: "03", title: "Align",      c: "#B6F24A", line: "Everyone should be able to describe the plan the same way.", items: ["Business", "Design", "Engineering", "QA", "Stakeholders"] },
    { num: "04", title: "Execute",    c: "#FFB020", line: "Momentum comes from decisions made on time, not from more meetings.", items: ["Sprints", "Tracking", "Communication", "Risk management", "Decision making"] },
    { num: "05", title: "Launch",     c: "#FF4D9D", line: "A release is a coordinated event, not the end of a sprint.", items: ["QA", "Release planning", "Deployment", "Stakeholder sign-off"] },
    { num: "06", title: "Improve",    c: "#FFFFFF", line: "Shipping is where the product starts earning its case.",     items: ["Measure", "Learn", "Iterate"] }
  ];

  var tabs  = Array.prototype.slice.call(document.querySelectorAll("[data-stage]"));
  var panelK = document.querySelector("[data-stage-k]");
  var panelL = document.querySelector("[data-stage-line]");
  var panelI = document.querySelector("[data-stage-items]");

  function selectStage(i) {
    var s = STAGES[i];
    if (!s) return;
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.setAttribute("aria-selected", String(on));
      t.style.background = on ? "linear-gradient(120deg, " + s.c + "33, rgba(255,255,255,0.03))" : "";
      t.style.borderColor = on ? s.c + "88" : "";
      t.style.boxShadow = on ? "0 12px 34px " + s.c + "33" : "";
    });
    if (panelK) panelK.textContent = s.num + " — " + s.title;
    if (panelL) panelL.textContent = s.line;
    if (panelI) {
      panelI.innerHTML = "";
      s.items.forEach(function (it) {
        var li = document.createElement("li");
        li.textContent = it;
        panelI.appendChild(li);
      });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectStage(i); });
    t.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      var next = (i + (e.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      selectStage(next);
    });
  });
  if (tabs.length) selectStage(0);

  if (reduceMotion) return;

  /* -- Count-up metrics --------------------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var pre = el.dataset.prefix || "";
    var suf = el.dataset.suffix || "";
    var t0 = performance.now();
    function step(t) {
      var p = Math.min(1, (t - t0) / 1100);
      el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = pre + "0" + suf;
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || e.target.dataset.counted) return;
        e.target.dataset.counted = "1";
        countUp(e.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll("[data-count]").forEach(function (el) { countIo.observe(el); });

    var revealIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting || e.target.dataset.revealed) return;
        e.target.dataset.revealed = "1";
        e.target.classList.add("reveal");
        e.target.style.animationDelay = (i % 4) * 70 + "ms";
      });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-tilt]").forEach(function (el) { revealIo.observe(el); });
  }

  /* -- Pointer tilt ------------------------------------------------------- */
  if (window.matchMedia("(hover: hover)").matches) {
    var tiltEls  = document.querySelectorAll("[data-tilt]");
    var stackEls = document.querySelectorAll(".stack__inner");
    window.addEventListener("pointermove", function (ev) {
      tiltEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > window.innerHeight + 80) return;
        var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
        var near = Math.abs(dx) < 1.1 && Math.abs(dy) < 1.6;
        var k = near ? 6 : 1.6;
        el.style.transform = "rotateY(" + (dx * k).toFixed(2) + "deg) rotateX(" + (-dy * k).toFixed(2) + "deg) translateZ(" + (near ? 14 : 0) + "px)";
      });
      stackEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var dx = Math.max(-1, Math.min(1, (ev.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
        el.style.transform = "rotateX(" + (52 - dx * 7).toFixed(1) + "deg) rotateZ(" + (-32 + dx * 8).toFixed(1) + "deg) scale(0.78)";
      });
    }, { passive: true });
  }
})();
