/* =============================================================
   Peggy's Bookkeeping & Tax Service — interactions
   - Progressive enhancement: all content is visible without JS.
     GSAP only *animates from* a hidden state, so a load failure
     or reduced-motion preference simply leaves everything shown.
   - The "neon thread" is the signature element: a single SVG line
     in the brand gradient that draws itself down the page on scroll.
   ============================================================= */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReduce = function () { return reduceQuery.matches || document.documentElement.classList.contains("a11y-pause"); };
  var hasGSAP = function () { return typeof window.gsap !== "undefined"; };
  var hasST = function () { return hasGSAP() && typeof window.ScrollTrigger !== "undefined"; };
  var DESKTOP = function () { return window.matchMedia("(min-width:881px)").matches; };

  /* ---------- footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =============================================================
     NAV: scroll state + mobile menu
     ============================================================= */
  var nav = $("#nav");
  var onScrollNav = function () {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  var navToggle = $("#navToggle");
  var mobileMenu = $("#mobileMenu");
  var openMenu = function () {
    if (!mobileMenu) return;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (navToggle) { navToggle.setAttribute("aria-expanded", "true"); navToggle.setAttribute("aria-label", "Close menu"); }
    document.body.style.overflow = "hidden";
  };
  var closeMenu = function () {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (navToggle) { navToggle.setAttribute("aria-expanded", "false"); navToggle.setAttribute("aria-label", "Open menu"); }
    document.body.style.overflow = "";
  };
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) closeMenu(); else openMenu();
    });
    $$("a", mobileMenu).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) { closeMenu(); navToggle.focus(); }
    });
  }

  /* ---------- active section in nav ---------- */
  (function navActive() {
    var links = $$(".nav__links a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) {
      var id = (l.getAttribute("href") || "").replace("#", "");
      if (id) map[id] = l;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var l = map[en.target.id];
        if (!l) return;
        if (en.isIntersecting) {
          links.forEach(function (x) { x.classList.remove("is-active"); x.removeAttribute("aria-current"); });
          l.classList.add("is-active"); l.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* =============================================================
     MOTION (GSAP) — hero intro, scroll reveals, neon thread
     All wrapped so it can be torn down/rebuilt (resize, a11y pause).
     ============================================================= */
  var motionBuilt = false;

  function killMotion() {
    if (hasST()) { window.ScrollTrigger.getAll().forEach(function (t) { t.kill(); }); }
    if (hasGSAP()) { window.gsap.globalTimeline.clear(); }
    // Ensure everything that motion may have hidden is fully visible.
    $$("[data-reveal]").forEach(function (el) { el.style.opacity = ""; el.style.transform = ""; });
    motionBuilt = false;
  }

  function heroIntro() {
    if (!hasGSAP()) return;
    var gsap = window.gsap;
    var tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
    tl.from(".hero__eyebrow", { y: 18, opacity: 0, duration: 0.7 })
      .from(".hero__title .line", { yPercent: 110, opacity: 0, stagger: 0.09 }, "-=0.35")
      .from(".hero__sub", { y: 18, opacity: 0 }, "-=0.55")
      .from(".hero__cta > *", { y: 16, opacity: 0, stagger: 0.08 }, "-=0.6")
      .from(".hero__promo", { y: 14, opacity: 0 }, "-=0.6")
      .from(".hero__stats .chip", { y: 18, opacity: 0, stagger: 0.07 }, "-=0.6")
      .from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.2");
  }

  function reveals() {
    if (!hasST()) return;
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var items = $$("[data-reveal]");
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 26 });
    ST.batch(items, {
      start: "top 86%",
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }); },
      once: true
    });
  }

  /* ---------- the neon thread ---------- */
  var threadSvg = $("#threadSvg");
  var threadWrap = $(".thread");

  function buildThread() {
    if (!threadSvg || !threadWrap || !hasGSAP()) return;
    var gsap = window.gsap;

    var docH = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight
    );
    if (docH < 200) return;

    // Make the absolutely-positioned column span the full document.
    threadWrap.style.height = docH + "px";

    // viewBox: 100 wide (maps to the ~64px column), docH tall (1:1 vertical).
    var VW = 100;
    threadSvg.setAttribute("viewBox", "0 0 " + VW + " " + docH);
    threadSvg.setAttribute("width", VW);
    threadSvg.setAttribute("height", docH);

    var cx = 52, amp = 26; // meander around column centre
    // Wavelength scales gently with page height for an easy, organic drift.
    var wl = Math.max(620, docH / Math.max(5, Math.round(docH / 900)));
    var step = 7, d = "M " + cx.toFixed(1) + " 0";
    for (var y = step; y <= docH; y += step) {
      var x = cx + amp * Math.sin((y / wl) * Math.PI * 2);
      d += " L " + x.toFixed(2) + " " + y.toFixed(1);
    }

    // Section anchor nodes (vertical centre of each section).
    var nodeY = [];
    $$("main > section, section.trust").forEach(function (s) {
      var r = s.getBoundingClientRect();
      var mid = r.top + window.scrollY + r.height / 2;
      if (mid > 40 && mid < docH - 20) nodeY.push(mid);
    });

    var nodes = nodeY.map(function (y) {
      var x = cx + amp * Math.sin((y / wl) * Math.PI * 2);
      return '<circle class="thread__node" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(1) + '" r="3.4" opacity="0"></circle>';
    }).join("");

    threadSvg.innerHTML =
      '<defs><linearGradient id="threadGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + docH + '">' +
      '<stop offset="0" stop-color="#C45CE8"/>' +
      '<stop offset="0.34" stop-color="#37D2F0"/>' +
      '<stop offset="0.68" stop-color="#9BE63D"/>' +
      '<stop offset="1" stop-color="#F2B85C"/>' +
      '</linearGradient></defs>' +
      '<path class="thread__path" d="' + d + '"></path>' + nodes;

    var path = $(".thread__path", threadSvg);
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;

    if (prefersReduce() || !hasST()) {
      // Static: show the whole thread + nodes, no scrubbing.
      path.style.strokeDashoffset = 0;
      $$(".thread__node", threadSvg).forEach(function (n) { n.setAttribute("opacity", "1"); });
      return;
    }

    var ST = window.ScrollTrigger;
    path.style.strokeDashoffset = len;
    ST.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: function (self) { path.style.strokeDashoffset = len * (1 - self.progress); }
    });

    $$(".thread__node", threadSvg).forEach(function (n) {
      gsap.to(n, {
        opacity: 1, duration: 0.4, ease: "power2.out", paused: true,
        scrollTrigger: { trigger: document.body, start: (parseFloat(n.getAttribute("cy")) - window.innerHeight * 0.5) + "px top", toggleActions: "play none none reverse" }
      });
    });
  }

  function buildMotion() {
    if (motionBuilt) return;
    if (!hasGSAP() || prefersReduce()) return; // content already visible; nothing to do
    if (hasST() && window.gsap.registerPlugin) { try { window.gsap.registerPlugin(window.ScrollTrigger); } catch (e) {} }
    heroIntro();
    reveals();
    if (DESKTOP()) buildThread();
    if (hasST()) window.ScrollTrigger.refresh();
    motionBuilt = true;
  }

  function rebuildThread() {
    if (!hasGSAP() || prefersReduce()) return;
    if (!DESKTOP()) {
      if (threadSvg) threadSvg.innerHTML = "";
      return;
    }
    // Drop just the thread's scroll triggers, then rebuild against new height.
    if (hasST()) {
      window.ScrollTrigger.getAll().forEach(function (t) {
        if (t.vars && t.vars.trigger === document.body) t.kill();
      });
    }
    buildThread();
    if (hasST()) window.ScrollTrigger.refresh();
  }

  // Build after full load (fonts/images settle the page height).
  if (document.readyState === "complete") buildMotion();
  else window.addEventListener("load", buildMotion);

  // Debounced resize → rebuild thread to the new document height.
  var rT;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (hasST()) window.ScrollTrigger.refresh();
      rebuildThread();
    }, 220);
  });

  // If the reduced-motion preference flips at runtime, react.
  var onReduceChange = function () {
    if (prefersReduce()) killMotion();
    else { motionBuilt = false; buildMotion(); }
  };
  if (reduceQuery.addEventListener) reduceQuery.addEventListener("change", onReduceChange);
  else if (reduceQuery.addListener) reduceQuery.addListener(onReduceChange);

  /* =============================================================
     ACCESSIBILITY WIDGET
     ============================================================= */
  var a11yToggle = $("#a11yToggle");
  var a11yPanel = $("#a11yPanel");
  var a11yClose = $("#a11yClose");
  var a11yReset = $("#a11yReset");
  var a11yStatement = $("#a11yStatement");
  var STORE_KEY = "peggys_a11y_v1";
  var OPTIONS = ["contrast", "biggertext", "readable", "links", "spacing", "pause", "cursor", "dyslexia"];

  function readStore() {
    try { var v = window.localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : {}; }
    catch (e) { return {}; }
  }
  function writeStore(obj) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function applyOption(name, on, persist) {
    document.documentElement.classList.toggle("a11y-" + name, on);
    var btn = $('[data-a11y="' + name + '"]');
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");

    if (name === "pause") {
      if (on) killMotion();
      else { motionBuilt = false; buildMotion(); }
    }
    if (persist) {
      var store = readStore();
      if (on) store[name] = 1; else delete store[name];
      writeStore(store);
    }
  }

  // Restore saved prefs on load.
  (function restore() {
    var store = readStore();
    OPTIONS.forEach(function (name) { if (store[name]) applyOption(name, true, false); });
  })();

  function openPanel() {
    if (!a11yPanel) return;
    a11yPanel.hidden = false;
    if (a11yToggle) a11yToggle.setAttribute("aria-expanded", "true");
    var first = $(".a11y__opt", a11yPanel);
    if (first) first.focus();
  }
  function closePanel(focusToggle) {
    if (!a11yPanel) return;
    a11yPanel.hidden = true;
    if (a11yToggle) { a11yToggle.setAttribute("aria-expanded", "false"); if (focusToggle) a11yToggle.focus(); }
  }
  if (a11yToggle && a11yPanel) {
    a11yToggle.addEventListener("click", function () {
      if (a11yPanel.hidden) openPanel(); else closePanel(false);
    });
  }
  if (a11yClose) a11yClose.addEventListener("click", function () { closePanel(true); });
  if (a11yStatement) a11yStatement.addEventListener("click", function (e) { e.preventDefault(); openPanel(); });

  $$("[data-a11y]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.getAttribute("data-a11y");
      var on = !document.documentElement.classList.contains("a11y-" + name);
      applyOption(name, on, true);
    });
  });

  if (a11yReset) {
    a11yReset.addEventListener("click", function () {
      OPTIONS.forEach(function (name) { applyOption(name, false, false); });
      writeStore({});
    });
  }

  // Close panel on ESC / outside click.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && a11yPanel && !a11yPanel.hidden) closePanel(true);
  });
  document.addEventListener("click", function (e) {
    if (!a11yPanel || a11yPanel.hidden) return;
    var widget = $(".a11y");
    if (widget && !widget.contains(e.target)) closePanel(false);
  });
})();
