/* ============================================================
   CAMI × DAVID — animations.js  v4  (STANDALONE)
   Animaciones GSAP + IntersectionObserver para scroll reveal.
   ============================================================ */

window.Animations = (function() {
  function initScrollReveal() {
    const reveals = document.querySelectorAll("[data-reveal]");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseFloat(el.dataset.delay || "0");
            setTimeout(() => el.classList.add("revealed"), delay * 1000);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function initRipples() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement("span");
        ripple.style.cssText = `
          position: absolute;
          top: ${y}px; left: ${x}px;
          width: 4px; height: 4px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: rippleExpand 0.6s ease-out forwards;
        `;
        if (getComputedStyle(this).position === "static") {
          this.style.position = "relative";
        }
        this.style.overflow = "hidden";
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  function init() {
    initScrollReveal();
    initRipples();
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll(".parallax").forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed || "0.3");
        gsap.to(el, {
          y: speed * 100, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }
    console.log("[Animations] Init OK.");
  }

  if (!document.getElementById("ripple-style")) {
    const style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = `@keyframes rippleExpand { to { width: 300px; height: 300px; opacity: 0; } }`;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { init };
})();
