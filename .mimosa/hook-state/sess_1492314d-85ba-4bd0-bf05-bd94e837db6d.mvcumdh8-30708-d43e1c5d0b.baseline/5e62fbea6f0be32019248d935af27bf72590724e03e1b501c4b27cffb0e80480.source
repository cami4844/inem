/* ============================================================
   CAMI × DAVID — reveal.js  v1.0
   Aparición progresiva al hacer scroll (IntersectionObserver).
   Jerarquía:
     data-reveal="up"     → entrada media (por defecto)
     data-reveal="scale"  → entrada fuerte (elemento principal)
     data-reveal="blur"   → entrada cinematográfica (héroe)
     data-reveal="left|right|soft" → direccional / fondo suave
   Stagger por grupo:
     <div data-reveal-stagger="0.09"> ... hijos ... </div>
   Los hijos reciben delays automáticos escalonados.
   Optimizado: observer único, sin listeners de scroll.
   ============================================================ */
(function() {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STYLES = {
    up:    "translate3d(0,10px,0)",
    left:  "translate3d(-46px,0,0)",
    right: "translate3d(46px,0,0)",
    scale: "scale(0.92)",
    blur:  "translate3d(0,26px,0) scale(1.04)",
    soft:  "translate3d(0,18px,0)",
  };

  function prepare(el, type, delay) {
    el.style.willChange = "opacity, transform";
    if (type === "blur") el.style.willChange += ", filter";
    el.style.opacity = "0";
    el.style.transform = STYLES[type] || STYLES.up;
    if (type === "blur") el.style.filter = "blur(10px)";
    if (delay) el.style.transitionDelay = delay + "s";
    el.style.transitionProperty = "opacity, transform" + (type === "blur" ? ", filter" : "");
    el.style.transitionDuration = type === "soft" ? "0.7s" : (type === "scale" ? "0.9s" : "0.8s");
    el.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function show(el) {
    el.style.opacity = "1";
    el.style.transform = "translate3d(0,0,0) scale(1)";
    if (el.style.filter) el.style.filter = "blur(0)";
    el.dataset.revealed = "1";
  }

  function init() {
    const items = [];
    document.querySelectorAll("[data-reveal-stagger]").forEach(group => {
      const step = parseFloat(group.dataset.revealStagger) || 0.09;
      Array.from(group.children).forEach((child, i) => {
        child.setAttribute("data-reveal", child.dataset.reveal || "up");
        child.setAttribute("data-reveal-delay", (i * step).toFixed(2));
      });
    });
    document.querySelectorAll("[data-reveal]").forEach(el => {
      const type = (el.dataset.reveal || "up").toLowerCase();
      const delay = parseFloat(el.dataset.revealDelay || "0");
      if (REDUCED) { show(el); return; }
      prepare(el, type, delay);
      items.push(el);
    });
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));

    // Failsafe: a los 4s todo visible (nunca contenido oculto por un fallo del observer)
    setTimeout(() => items.forEach(el => { if (el.dataset.revealed !== "1") show(el); }), 4000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.CAMIReveal = { init };
})();
