// FORJA motion runtime — sin dependencias. En React: llamar initForjaMotion(root) en un useEffect.
// En Shopify: <script src="{{ 'forja-motion.js' | asset_url }}" defer></script> (se autoinicia).
(function (global) {
  function init(root) {
    root = root || document;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (root.querySelector(".forja-page") || document.documentElement).classList.add("forja-motion");

    // Stagger: índice por hijo
    root.querySelectorAll('[data-forja-reveal="stagger"]').forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (child, i) { child.style.setProperty("--i", i); });
    });

    // Reveal una sola vez
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        var target = e.target.getAttribute("data-forja-count");
        if (target) countUp(e.target, Number(target), reduce);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
    root.querySelectorAll("[data-forja-reveal], [data-forja-count], .forja-pop").forEach(function (el) { io.observe(el); });

    // CTA sticky: visible cuando el CTA del hero no se ve y la oferta todavía no
    var sticky = root.querySelector(".forja-sticky-cta");
    var heroCta = root.querySelector("[data-forja-hero-cta]");
    var offer = root.querySelector("[data-forja-offer]");
    if (sticky && heroCta) {
      var state = { hero: true, offer: false };
      var update = function () { sticky.classList.toggle("is-visible", !state.hero && !state.offer); };
      new IntersectionObserver(function (e) { state.hero = e[0].isIntersecting; update(); }).observe(heroCta);
      if (offer) new IntersectionObserver(function (e) { state.offer = e[0].isIntersecting; update(); }).observe(offer);
    }
    return function destroy() { io.disconnect(); };
  }

  function countUp(el, to, reduce) {
    if (reduce) { el.textContent = to.toLocaleString(); return; }
    var start = performance.now(), dur = 800;
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(to * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  global.initForjaMotion = init;
  if (typeof document !== "undefined" && document.currentScript && document.currentScript.hasAttribute("defer")) {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  }
})(typeof window !== "undefined" ? window : globalThis);
