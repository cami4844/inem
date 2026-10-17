/* ============================================================
   CAMI × DAVID — cursor.js  v3.0 (VIEWFINDER · INSTANTÁNEO)
   Cursor propio del proyecto: retícula de visor de cámara.
   - v25.8: CERO retardo. El aro y el núcleo siguen al ratón al
     INSTANTE (1:1 con el cursor del sistema). El lag que se
     sentía era el lerp deliberado del aro — ya no existe.
   - Render dirigido por eventos: solo se pinta un frame cuando
     el ratón SE MUEVE (coste cero en reposo; sin bucle rAF
     infinito compitiendo con nada).
   - estados: link/btn (expande), zoom (lupa +), click (flash)
   ============================================================ */
(function() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const INTERACTIVE = "a, button, [data-action], .menu-button, .browser-tab, .lightbox-close, .lightbox-nav, .ig-tab, .tt-tab, .back-link, .chip, .side-menu a, .ig-highlight, .pill, select, input, textarea, .tt-action-btn, .tt-bottom-nav-item";
  const ZOOMABLE = "img.zoomable, [data-zoom]";

  let core, ring, tag;
  let mX = innerWidth / 2, mY = innerHeight / 2;
  let pX = mX, pY = mY;          /* posición del frame anterior (para el "lean") */
  let rafId = 0;
  let state = "default";
  let lastTarget = null;

  function build() {
    core = document.createElement("div");
    core.className = "vf-core";
    document.body.appendChild(core);
    ring = document.createElement("div");
    ring.className = "vf-ring";
    ring.innerHTML = '<i class="vf-c vf-c--tl"></i><i class="vf-c vf-c--tr"></i><i class="vf-c vf-c--br"></i><i class="vf-c vf-c--bl"></i>';
    document.body.appendChild(ring);
    tag = document.createElement("div");
    tag.className = "vf-tag";
    document.body.appendChild(tag);
    document.documentElement.classList.add("vf-cursor-on");
  }

  function setState(next, label) {
    if (state === next) return;
    state = next;
    ring.dataset.state = next;
    core.dataset.state = next;
    if (label) { tag.textContent = label; tag.classList.add("on"); }
    else tag.classList.remove("on");
  }

  /* Un solo frame de render por movimiento: todo a la posición EXACTA
     del ratón, sin interpolación de ningún tipo. */
  function render() {
    rafId = 0;
    const dx = mX - pX, dy = mY - pY;
    core.style.transform = "translate3d(" + mX + "px," + mY + "px,0)";
    ring.style.transform = "translate3d(" + mX + "px," + mY + "px,0)";
    tag.style.transform  = "translate3d(" + (mX + 18) + "px," + (mY + 18) + "px,0)";
    /* la retícula se inclina levemente hacia el sentido del movimiento */
    ring.style.setProperty("--vf-lean", Math.max(-6, Math.min(6, dx * 0.6)) + "deg");
    pX = mX; pY = mY;
  }

  function schedule() { if (!rafId) rafId = requestAnimationFrame(render); }

  function move(e) {
    mX = e.clientX; mY = e.clientY;
    schedule();
    const t = e.target;
    if (!(t instanceof Element) || t === lastTarget) return; /* estado solo al cambiar de objetivo */
    lastTarget = t;
    if (t.closest(ZOOMABLE)) setState("zoom", "AMPLIAR");
    else if (t.closest(INTERACTIVE)) setState("link", "");
    else setState("default", "");
  }

  function down() { ring.classList.add("vf-down"); core.classList.add("vf-down"); }
  function up()   { ring.classList.remove("vf-down"); core.classList.remove("vf-down"); }

  function init() {
    build();
    render(); /* posición inicial inmediata (centro) */
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mousedown", down, { passive: true });
    document.addEventListener("mouseup", up, { passive: true });
    document.addEventListener("mouseleave", () => { core.style.opacity = "0"; ring.style.opacity = "0"; tag.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { core.style.opacity = ""; ring.style.opacity = ""; tag.style.opacity = ""; });
    perfProbe();
  }

  /* ══════════════════════════════════════════════════════════════
     v25.9 · MODO ADAPTATIVO (vf-lite)
     El cursor va 1:1 al ritmo de los frames de la página: si la GPU
     está saturada por capas de fondo (auroras con blur a pantalla
     completa, ken-burns, halos), la página cae de FPS y el ratón se
     SIENTE lento aunque el código sea instantáneo.
     Este sondeo mide el frame time real 1.8s después de cargar (ya
     sin animaciones de entrada) y, si la mediana supera 24ms
     (< ~42 fps), activa html.vf-lite: se apagan SOLO las capas
     pesadas de fondo. En máquinas capaces no cambia nada.
     ══════════════════════════════════════════════════════════════ */
  function perfProbe() {
    var style = document.createElement("style");
    style.textContent =
      "html.vf-lite .mouse-glow{display:none !important}" +
      "html.vf-lite .ken-burns,html.vf-lite .pa-ken-burns img,html.vf-lite img.pa-ken-burns," +
      "html.vf-lite body::before,html.vf-lite body::after," +
      "html.vf-lite .ambient-particles::before,html.vf-lite .ambient-particles::after," +
      "html.vf-lite .ambient-dot,html.vf-lite .auto-sparkle,html.vf-lite .sparkle-particle," +
      "html.vf-lite .glow-line,html.vf-lite .floating-shape,html.vf-lite .light-streak," +
      "html.vf-lite .web-hero-bg,html.vf-lite .v24-blob,html.vf-lite .aurora-layer," +
      "html.vf-lite .cd-grain" +
      "{animation:none !important}";
    document.head.appendChild(style);

    /* Memoria de sesión: si esta pestaña ya midió una máquina lenta,
       las siguientes páginas activan lite AL INSTANTE (sin re-medir). */
    try {
      if (sessionStorage.getItem("vf-lite") === "1") {
        document.documentElement.classList.add("vf-lite");
      }
    } catch (e) {}

    /* observable para QA/depuración: window.__vfProbe = {med, on, attempts} */
    var attempts = 0;
    function startProbe() {
      attempts++;
      if (window.__vfProbe) window.__vfProbe.attempts = attempts;
      if (document.hidden) {                       /* pestaña oculta: reintentar más tarde */
        if (attempts < 4) setTimeout(startProbe, 2500);
        return;
      }
      var n = 0, deltas = [], last = performance.now();
      function step(now) {
        if (document.hidden) { if (attempts < 4) setTimeout(startProbe, 2500); return; }
        deltas.push(now - last); last = now;
        if (++n < 50) { requestAnimationFrame(step); return; }
        deltas.sort(function (a, b) { return a - b; });
        var med = deltas[Math.floor(deltas.length / 2)];
        var on = med > 24;                          /* mediana < ~42 fps → modo lite */
        window.__vfProbe = { med: Math.round(med * 10) / 10, on: on, attempts: attempts };
        document.documentElement.classList.toggle("vf-lite", on);
        try { sessionStorage.setItem("vf-lite", on ? "1" : "0"); } catch (e) {}
      }
      requestAnimationFrame(step);
    }
    setTimeout(startProbe, 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
