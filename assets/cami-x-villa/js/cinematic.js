/* ============================================================
   CAMI × DAVID — cinematic.js  v8.0 (PERF + PARALLAX)
   Efectos ambientales optimizados:
   - Decoraciones: menos nodos, glow estático, animaciones GPU
   - Sparkles con pool reutilizable (sin crear/destruir DOM)
   - Tilt de tarjetas: rect cacheado en mouseenter (cero layout
     thrashing en mousemove)
   - Parallax de capas [data-parallax] con transform
   - Pausa total cuando la pestaña está oculta
   - Respeta prefers-reduced-motion
   ============================================================ */

(function() {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["#F5C842", "#1E40FF", "#FF6B1A", "#FFFFFF", "#6B2FBC"];

  // ============================================================
  // 1. DECORACIONES (cuenta reducida, solo si hay movimiento)
  // ============================================================
  function injectDecorations() {
    if (REDUCED) return;

    // Formas flotantes (3)
    for (let i = 1; i <= 3; i++) {
      const el = document.createElement("div");
      el.className = "floating-shape floating-shape--" + i;
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    // Líneas de luz (3)
    for (let i = 1; i <= 3; i++) {
      const el = document.createElement("div");
      el.className = "light-streak light-streak--" + i;
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    // Resplandor que sigue al cursor
    const glow = document.createElement("div");
    glow.className = "mouse-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    // Barra de progreso vertical
    const progress = document.createElement("div");
    progress.className = "scroll-progress-vertical";
    progress.setAttribute("aria-hidden", "true");
    const fill = document.createElement("div");
    fill.className = "scroll-progress-vertical__fill";
    fill.style.height = "0%";
    progress.appendChild(fill);
    document.body.appendChild(progress);

    // Campo de partículas (10, drift lento hacia arriba)
    const field = document.createElement("div");
    field.className = "particle-field";
    field.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement("div");
      dot.className = "particle-field__dot";
      dot.style.left = (Math.random() * 100) + "%";
      dot.style.top = (Math.random() * 100 + 100) + "%";
      const c = COLORS[i % COLORS.length];
      dot.style.background = c;
      dot.style.boxShadow = "0 0 6px " + c;
      dot.style.animationDuration = (18 + Math.random() * 18) + "s";
      dot.style.animationDelay = (-Math.random() * 20) + "s";
      field.appendChild(dot);
    }
    document.body.appendChild(field);

    // Puntos ambientales (5, pulso suave)
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("div");
      dot.className = "ambient-dot";
      dot.style.left = (5 + Math.random() * 90) + "%";
      dot.style.top = (8 + Math.random() * 84) + "%";
      const c = COLORS[i % COLORS.length];
      dot.style.background = c;
      dot.style.color = c;
      dot.style.animationDelay = (-Math.random() * 6) + "s";
      document.body.appendChild(dot);
    }

    setupAutoSparkles();
  }

  // Pool de chispas: 5 nodos reutilizados (antes: crear+borrar cada 1.8s)
  function setupAutoSparkles() {
    const POOL = 5;
    const pool = [];
    for (let i = 0; i < POOL; i++) {
      const s = document.createElement("div");
      s.className = "auto-sparkle";
      s.style.opacity = "0";
      document.body.appendChild(s);
      pool.push(s);
    }
    let idx = 0;
    setInterval(() => {
      if (document.hidden || REDUCED) return;
      const s = pool[idx = (idx + 1) % POOL];
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      s.style.left = (Math.random() * 100) + "%";
      s.style.top = (Math.random() * 100) + "%";
      s.style.background = c;
      s.style.color = c;
      s.style.animation = "none";
      void s.offsetWidth; // reinicia la animacion
      s.style.animation = "";
    }, 2600);
  }

  // ============================================================
  // 2. MOUSE TRACKING — variables CSS globales con rAF
  // ============================================================
  function setupMouseTracking() {
    let ticking = false;
    let lastX = window.innerWidth / 2, lastY = window.innerHeight / 2;
    document.addEventListener("mousemove", (e) => {
      lastX = e.clientX; lastY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--mouse-x", lastX + "px");
          document.documentElement.style.setProperty("--mouse-y", lastY + "px");
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // 3. PARALLAX DE CAPAS — [data-parallax="profundidad"]
  // Movimiento ambiental al mover el cursor. Solo transform.
  // ============================================================
  function setupParallaxLayers() {
    if (REDUCED) return;
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;
    const meta = layers.map(el => ({
      el,
      depth: parseFloat(el.dataset.parallax) || 10,
    }));
    let mx = 0, my = 0, raf = null;
    document.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        for (const m of meta) {
          m.el.style.transform =
            "translate3d(" + (-mx * m.depth).toFixed(1) + "px," + (-my * m.depth * 0.7).toFixed(1) + "px,0)";
        }
        raf = null;
      });
    }, { passive: true });
  }

  // ============================================================
  // 4. CLICK SPARKLE BURST
  // ============================================================
  function setupClickSparkles() {
    if (REDUCED) return;
    function burst(x, y) {
      const count = 10;
      for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "sparkle-particle";
        s.style.left = x + "px";
        s.style.top = y + "px";
        s.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5);
        const dist = 55 + Math.random() * 70;
        s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1000);
      }
    }
    const SKIP = "input, textarea, button.menu-button, .side-menu a, a.btn-prev, a.btn-next, a.btn-home, a.btn-back-origin";
    document.addEventListener("click", (e) => {
      if (e.target.closest(SKIP)) return;
      burst(e.clientX, e.clientY);
    });
  }

  // ============================================================
  // 5. TILT DE TARJETAS — rect cacheado (antes: getBoundingClientRect
  //    en cada mousemove = layout thrashing en paginas con 30 cards)
  // ============================================================
  function setupTiltCards() {
    if (REDUCED) return;
    document.querySelectorAll(".tilt-card, .hover-lift, .card").forEach(card => {
      if (card.dataset.tiltInit === "true") return;
      card.dataset.tiltInit = "true";
      let rect = null, raf = null;
      card.addEventListener("mouseenter", () => {
        rect = card.getBoundingClientRect(); // cache: 1 sola vez por entrada
      }, { passive: true });
      card.addEventListener("mousemove", (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -8;
        const ry = (x - 0.5) * 8;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          card.style.setProperty("--rx", rx.toFixed(2) + "deg");
          card.style.setProperty("--ry", ry.toFixed(2) + "deg");
          card.style.setProperty("--tx", (x * 100).toFixed(1) + "%");
          card.style.setProperty("--ty", (y * 100).toFixed(1) + "%");
          card.classList.add("tilt-card");
          raf = null;
        });
      }, { passive: true });
      card.addEventListener("mouseleave", () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        rect = null;
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--tx", "50%");
        card.style.setProperty("--ty", "50%");
      }, { passive: true });
    });
  }

  // ============================================================
  // 6. SCROLL PROGRESS VERTICAL
  // ============================================================
  function setupScrollProgress() {
    const fill = document.querySelector(".scroll-progress-vertical__fill");
    if (!fill) return;
    let ticking = false;
    function update() {
      const top = window.pageYOffset || 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.height = (h > 0 ? Math.min(100, (top / h) * 100) : 0) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // 6b. Realce de entrada para chip/titulo/subtitulo
  function setupVideoLoop() {
    const c = document.querySelector(".slide-main .chip");
    if (c) c.classList.add("video-loop-in");
    const t = document.querySelector(".slide-main h2, .slide-main h1");
    if (t) t.classList.add("video-loop-in", "video-loop-in--delay1");
    const p = document.querySelector(".slide-main p");
    if (p) p.classList.add("video-loop-in", "video-loop-in--delay2");
    const si = document.querySelector(".scroll-indicator");
    if (si) si.classList.add("video-loop-in");
  }

  function init() {
    injectDecorations();
    setupMouseTracking();
    setupParallaxLayers();
    setupClickSparkles();
    setupTiltCards();
    setupScrollProgress();
    setupVideoLoop();
    setTimeout(setupTiltCards, 600);
    setTimeout(setupVideoLoop, 800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.Cinematic = { setupTiltCards, setupClickSparkles };
})();
