/* ============================================================
   CAMI × DAVID — cine-depth.js  (v24.0 LIQUID NEON)
   Capa de profundidad cinematográfica para las 31 páginas.
   ------------------------------------------------------------
   Módulos (todos independientes, cada uno en try/catch):
     1. Gate html.cd-js (igual que entrance-cinema).
     2. FocusPull   — dolly de cámara: los fondos entran
                      desenfocados y se enfocan al llegar.
     3. Curtain     — cortina de transición entre páginas
                      (direccional: fwd / back / up).
     4. ScrollParallax — fondos del website derivan con el
                      scroll (rAF + passive, solo transform).
     5. MouseDepth  — badges y lockup derivan en capas.
     6. Magnetic    — atracción sutil en prev / next / home.
     7. MenuStagger — filas del menú lateral escalonadas.
     8. Spotlight   — luz dorada que sigue al cursor en cards.
     9. SmartPause  — decoraciones en pausa con pestaña oculta.
    10. Atmosphere  — sistema ambiental: orbes de luz +
                      partículas visibles + haz de barrido.
    11. CursorFX    — ripple al click + estados del visor
                      refinados (capa visual, sin tocar cursor.js).
    12. MicroFeel   — tilt 3D sutil en cards (slide 02) y
                      brillo deslizante en la paleta (slide 05).
    13. WebCinema   — website: haz en el héroe, glow de
                      secciones al entrar y parallax de imágenes.
    14. FilmGrade   — grano de película + viñeta (texturas
                      reales assets/fx/, v23).
    15. LightLeak   — fuga de luz de proyector por página.
    16. BokehHero   — campo bokeh de marca sobre los héroes.
    17. Nebula      — nubes de profundidad (portada y cierre).
   REGLAS:
     · Nunca toca .anim / [data-anim] / [data-reveal].
     · Failsafe a 2.6s fuerza el estado natural (nada oculto).
     · prefers-reduced-motion: capa completa desactivada.
     · Cero intervalos; listeners únicos con rAF.
   ============================================================ */
(function () {
  "use strict";

  var html = document.documentElement;
  html.classList.add("cd-js");                       // ← GATE

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) return;                               // cero movimiento

  var FINE = window.matchMedia("(pointer: fine)").matches;
  var MOBILE = window.matchMedia("(max-width: 768px)").matches;

  /* ¿Pertenece a otro sistema de animación? => no tocar */
  function isOwned(el) {
    if (!el || !el.classList) return true;
    if (el.classList.contains("anim")) return true;
    if (el.hasAttribute && el.hasAttribute("data-reveal")) return true;
    if (el.closest && el.closest(".anim, [data-anim], [data-reveal]")) return true;
    return false;
  }

  /* ══════════════════════════════════════════════════════
     0 · ESPERA DEL PRELOADER — la coreografía de entrada
     arranca cuando el velo #cdPre se levanta (o a los 600ms,
     lo que ocurra antes). Nunca bloquea la carga.
     Requiere DOS condiciones: preloader abierto + prep listo
     (patrón deliver: evita la condición de carrera).
     ══════════════════════════════════════════════════════ */
  var preloaderDone = false;   // ← declarado ANTES del uso (sin hoisting sorpresas)
  var gateFired = false, started = false, delivered = false;
  var gateTimers = [];

  function onGateOpen() {
    gateFired = true;
    deliver();
  }
  function deliver() {
    if (delivered || !gateFired || !started) return;
    delivered = true;
    gateTimers.forEach(clearTimeout);
    gateTimers = [];
    fireFocusPull();
    fireCurtainOut();
    fxReveal();                      /* v23: capas de cine entran tras el velo */
  }
  (function waitForPreloader() {
    var t0 = Date.now();
    var pre = document.getElementById("cdPre");
    if (!pre) { preloaderDone = true; onGateOpen(); return; }
    function check() {
      var p = document.getElementById("cdPre");
      if (!p || !p.isConnected || p.classList.contains("done")) {
        preloaderDone = true; onGateOpen(); return;
      }
      if (Date.now() - t0 > 600) { onGateOpen(); return; }  // llegó tarde: sin cortina de llegada
      gateTimers.push(setTimeout(check, 60));
    }
    check();
  })();

  /* ══════════════════════════════════════════════════════
     1 · FOCUS PULL — dolly sobre los fondos de escena
     ══════════════════════════════════════════════════════ */
  var bgTargets = [];
  function findBgTargets() {
    var out = [];
    /* Landing del index */
    var lb = document.querySelector(".landing-bg");
    if (lb) out.push(lb);
    /* Website: héroe */
    document.querySelectorAll(".web-hero-bg, .web-hero-overlay").forEach(function (el) {
      if (out.indexOf(el) === -1) out.push(el);
    });
    /* Slides: hijos absolute de .slide-main (envolturas de fondo) */
    var sm = document.querySelector(".slide-main");
    if (sm) {
      Array.prototype.forEach.call(sm.children, function (el) {
        if (el.tagName !== "DIV") return;
        if (isOwned(el)) return;
        var pos = getComputedStyle(el).position;
        if (pos === "absolute" && out.indexOf(el) === -1) out.push(el);
      });
    }
    return out;
  }
  function prepFocusPull() {
    bgTargets = findBgTargets();
    bgTargets.forEach(function (el) { el.classList.add("cd-prep-bg"); });
  }
  function fireFocusPull() {
    bgTargets.forEach(function (el) {
      el.classList.remove("cd-prep-bg");
      el.classList.add("cd-in-bg");
      el.addEventListener("animationend", function onEnd(ev) {
        if (ev.target !== el) return;
        el.removeEventListener("animationend", onEnd);
        el.classList.remove("cd-in-bg");
        el.style.transform = ""; el.style.filter = "";
        el.classList.add("cd-settled");   // señal para el parallax
      });
    });
    /* Failsafe local del dolly */
    setTimeout(function () {
      bgTargets.forEach(function (el) {
        el.classList.remove("cd-prep-bg");
        el.style.transform = ""; el.style.filter = "";
        el.classList.add("cd-settled");
      });
    }, 2600);
    setTimeout(activateParallax, 1250);   // el parallax toma el control al asentarse
  }

  /* ══════════════════════════════════════════════════════
     2 · TRANSICIÓN "X COLABORATIVA" (v24)
     ------------------------------------------------------------
     Reemplaza la cortina con blur: al navegar, la pantalla
     se cubre y aparecen los DOS LOGOS JUNTOS (colaboración)
     unidos por la X con neón que cambia de color; un instante
     después se revela la página siguiente. Rápida (0.62s de
     cubrimiento) y con failsafe absoluto de navegación.
     · Logos = imágenes oficiales assets/logos (ya en caché).
     · Si una imagen falla => solo la X con neón (fallback).
     · Reduced-motion: .cd-curtain display:none (CSS) y la
       navegación es instantánea vía el failsafe.
     ══════════════════════════════════════════════════════ */
  var SS_KEY = "cd-curtain-dir";
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function ssDel(k) { try { sessionStorage.removeItem(k); } catch (e) {} }

  var LOGO_BASE = "";
  try {
    if (document.currentScript && document.currentScript.src) {
      LOGO_BASE = document.currentScript.src.replace(/js\/[^\/]*$/, "");
    }
  } catch (e) {}
  if (!LOGO_BASE) LOGO_BASE = "../";

  function buildCurtain(dir) {
    var c = document.createElement("div");
    c.className = "cd-curtain";
    c.setAttribute("aria-hidden", "true");
    var edgeCls = dir === "up" ? "cd-edge cd-edge--h" : "cd-edge";
    /* Lockup colaborativo: los dos logos JUNTOS + X de neón */
    c.innerHTML =
      '<div class="cd-sheet"></div>' +
      '<div class="' + edgeCls + '"></div>' +
      '<div class="cd-xlock" aria-hidden="true">' +
        '<span class="cd-xl-ring"></span>' +
        '<img class="cd-xl-logo cd-xl-camora" src="' + LOGO_BASE + 'assets/logos/camora.png" alt="" draggable="false">' +
        '<span class="cd-xl-x">&times;</span>' +
        '<img class="cd-xl-logo cd-xl-super" src="' + LOGO_BASE + 'assets/logos/super.png" alt="" draggable="false">' +
        '<span class="cd-xl-word">COLABORACI&Oacute;N</span>' +
      '</div>';
    /* Logos caídos => la X y el neón cuentan la historia igual */
    try {
      c.querySelectorAll(".cd-xl-logo").forEach(function (im) {
        im.addEventListener("error", function () { im.style.display = "none"; }, { once: true });
      });
    } catch (e) {}
    document.body.appendChild(c);
    return c;
  }

  /* — Llegada: el lockup se disuelve y revela la nueva página — */
  var arrivalDir = ssGet(SS_KEY);
  ssDel(SS_KEY);
  function fireCurtainOut() {
    if (!arrivalDir || !preloaderDone) return;
    try {
      var c = buildCurtain(arrivalDir);
      c.classList.add("cd-live", "cd-" + arrivalDir + "-out");
      setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 950);
    } catch (e) {}
  }

  /* — Salida: cubrir con el lockup colaborativo y navegar — */
  var navigating = false;
  function directionFor(a) {
    if (a.closest(".btn-prev")) return "back";
    if (a.closest(".btn-next")) return "fwd";
    var file = (a.getAttribute("href") || "").split("/").pop().split("?")[0];
    var body = document.body.dataset || {};
    if (body.prev && body.prev === file) return "back";
    if (body.next && body.next === file) return "fwd";
    if (a.closest(".btn-home, .btn-back-origin, .back-link, .brand-lockup, .side-menu, " +
                  ".website-nav, .website-logo-lockup, .footer-nav, .idx, .vault")) return "up";
    return "fwd";
  }
  function isInternalLink(a) {
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return false;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    var url;
    try { url = new URL(a.href, window.location.href); } catch (e) { return false; }
    if (url.origin !== window.location.origin) return false;
    if (!/\.html?($|\?|#)/i.test(url.pathname)) return false;
    if (url.pathname === window.location.pathname) return false;
    if (url.href.split("#")[0] === window.location.href.split("#")[0]) return false;
    return true;
  }
  /* — v25: HOOK GLOBAL — teclado y swipe también usan la cortina.
     Así el lockup logos+X aparece en TODAS las navegaciones,
     no solo en clicks. window.CDGo(url, dir):
       · construye la cortina, espera 620ms y navega
       · failsafe 950ms (si algo falla, navega igual)
       · sin cortina posible (excepción) => navegación directa
     Devuelve true si tomó el control de la navegación. */
  function coverAndGo(url, dir) {
    if (navigating || !url) return false;
    var curtain;
    try {
      curtain = buildCurtain(dir || "fwd");
      curtain.classList.add("cd-live", "cd-" + (dir || "fwd") + "-in");
    } catch (err) { return false; }                   /* sin cortina: que navegue el llamador */
    ssSet(SS_KEY, dir || "fwd");
    navigating = true;
    var lockTimer = setTimeout(go, 620);              /* logos juntos visibles ~0.5s */
    var navTimer  = setTimeout(go, 950);              /* failsafe absoluto */
    function go() {
      clearTimeout(lockTimer); clearTimeout(navTimer);
      if (navigating) { navigating = false; window.location.href = url; }
    }
    return true;
  }
  window.CDGo = coverAndGo;                           /* API para navigation.js */

  document.addEventListener("click", function (e) {
    if (navigating || e.defaultPrevented) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || !isInternalLink(a)) return;
    if (a.closest(".lightbox-overlay")) return;
    var dir = directionFor(a);
    if (coverAndGo(a.href, dir)) e.preventDefault();  /* cortina viva: interceptamos */
  });
  /* bfcache: al volver con "atrás" el flag debe liberarse */
  window.addEventListener("pageshow", function (ev) {
    if (ev.persisted) {
      navigating = false;
      var c = document.querySelector(".cd-curtain");
      if (c && c.parentNode) c.parentNode.removeChild(c);
    }
  });

  /* ══════════════════════════════════════════════════════
     3 · PARALLAX DE SCROLL — solo website + landing
     ------------------------------------------------------------
     ARQUITECTURA DEL PROYECTO: html y body tienen height:100%
     (global.css), por lo que el contenedor de scroll real es
     el BODY en las páginas del website y el .slide-main en la
     landing y slides. Los eventos de scroll NUNCA llegan a
     window. Esta capa instala un PUENTE:
       · escucha body + .slide-main + window
       · re-dispatcha 'scroll' en window (revive listeners
         existentes: barra de progreso vertical de cinematic.js
         y el render del scroll-story en táctil)
       · shim de window.scrollTo hacia el scroller real
         (revive la navegación por puntos del scroll-story)
     Todo aditivo: cero modificaciones a archivos existentes.
     ══════════════════════════════════════════════════════ */
  var paraEls = [], paraOn = false, paraRaf = false;

  function realScroller() {
    if (document.body && document.body.scrollHeight > document.body.clientHeight + 4) return document.body;
    var sm = document.querySelector(".slide-main");
    if (sm && sm.scrollHeight > sm.clientHeight + 4) return sm;
    return null;
  }
  function getScrollY() {
    /* a lo sumo UNO de los contenedores scrollea en cada página */
    var sm = document.querySelector(".slide-main");
    return (window.pageYOffset || 0) +
           (document.body ? (document.body.scrollTop || 0) : 0) +
           (sm ? (sm.scrollTop || 0) : 0);
  }

  /* Shim: window.scrollTo delega en el scroller real cuando
     la ventana no puede scrollear. Revive los puntos del
     scroll-story (window.scrollTo({top,behavior}) -> body). */
  (function shimScrollTo() {
    var nativeScrollTo = window.scrollTo ? window.scrollTo.bind(window) : null;
    window.scrollTo = function () {
      var sc = realScroller();
      if (sc) { try { return sc.scrollTo.apply(sc, arguments); } catch (e) {} }
      if (nativeScrollTo) return nativeScrollTo.apply(null, arguments);
    };
  })();

  /* Puente de eventos: scroll del contenedor real -> window */
  var bridgeInstalled = false;
  function installScrollBridge() {
    if (bridgeInstalled) return;
    bridgeInstalled = true;
    [document.body, document.querySelector(".slide-main")].forEach(function (sc) {
      if (!sc || sc === window) return;
      sc.addEventListener("scroll", function () {
        if (!document.hidden) window.dispatchEvent(new Event("scroll"));
      }, { passive: true });
    });
    /* DRIVER DE PROGRESO: la barra vertical de cinematic.js lee
       window.pageYOffset (siempre 0 con body como scroller) y
       quedó clavada en 0%. Este driver la actualiza con el
       scroll REAL. Solo escribe el estilo; el elemento pertenece
       a cinematic.js (si no existe, no hace nada). */
    window.addEventListener("scroll", driveProgress, { passive: true });
  }
  var progRaf = false;
  function driveProgress() {
    if (progRaf) return;
    progRaf = requestAnimationFrame(function () {
      progRaf = false;
      var fill = document.querySelector(".scroll-progress-vertical__fill");
      if (!fill) return;
      var sc = realScroller();
      var top = sc ? sc.scrollTop : (window.pageYOffset || 0);
      var h = sc ? (sc.scrollHeight - sc.clientHeight)
                 : (document.documentElement.scrollHeight - window.innerHeight);
      fill.style.height = (h > 0 ? Math.min(100, (top / h) * 100) : 0) + "%";
    });
  }

  function activateParallax() {
    if (MOBILE || paraOn) return;
    paraEls = [];
    var lb = document.querySelector(".landing-bg");
    if (lb) paraEls.push({ el: lb, fixed: true });
    document.querySelectorAll(".web-hero-bg").forEach(function (el) {
      paraEls.push({ el: el, fixed: false });
    });
    if (!paraEls.length) return;
    paraOn = true;
    paraEls.forEach(function (p) { p.el.classList.add("cd-para"); });
    window.addEventListener("scroll", onParaScroll, { passive: true });
    onParaScroll();
  }
  function onParaScroll() {
    if (paraRaf) return;
    paraRaf = requestAnimationFrame(function () {
      paraRaf = false;
      var vh = window.innerHeight;
      paraEls.forEach(function (p) {
        var r = p.el.getBoundingClientRect();
        var inView = r.bottom > -120 && r.top < vh + 120;
        if (!inView) return;                        // nada de trabajo fuera de pantalla
        var y;
        if (p.fixed) {
          y = -getScrollY() * 0.095;                 // fondo fijo: deriva con el scroll (v23: +18%)
        } else {
          var center = r.top + r.height / 2 - vh / 2;
          y = -center * 0.14;                       // sección: se mueve más lento (v23: +17%)
        }
        y = Math.max(-44, Math.min(44, y));
        p.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     4 · MOUSE DEPTH — variables globales --cd-mx / --cd-my
     ══════════════════════════════════════════════════════ */
  if (FINE && !MOBILE) {
    var mRaf = false, mx = 0, my = 0;
    document.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (mRaf) return;
      mRaf = requestAnimationFrame(function () {
        mRaf = false;
        html.style.setProperty("--cd-mx", mx.toFixed(3));
        html.style.setProperty("--cd-my", my.toFixed(3));
      });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     5 · MAGNETIC — prev / next / home (máx 3px)
     ══════════════════════════════════════════════════════ */
  if (FINE && !MOBILE) {
    document.querySelectorAll(".btn-prev, .btn-next, .btn-home").forEach(function (btn) {
      var rect = null, raf = null;
      btn.addEventListener("pointerenter", function () {
        if (btn.classList.contains("disabled")) return;
        rect = btn.getBoundingClientRect();
      }, { passive: true });
      btn.addEventListener("pointermove", function (e) {
        if (!rect || btn.classList.contains("disabled")) return;
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          btn.style.setProperty("--mgx", (px * 8).toFixed(1) + "px");
          btn.style.setProperty("--mgy", (py * 6).toFixed(1) + "px");
        });
      }, { passive: true });
      btn.addEventListener("pointerleave", function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        rect = null;
        btn.style.setProperty("--mgx", "0px");
        btn.style.setProperty("--mgy", "0px");
      }, { passive: true });
    });
  }

  /* ══════════════════════════════════════════════════════
     6 · MENU STAGGER — delay por fila (la animación vive
     en CSS y solo existe mientras .open está presente)
     ══════════════════════════════════════════════════════ */
  try {
    document.querySelectorAll(".side-menu li").forEach(function (li, i) {
      li.style.setProperty("--cd-d", (Math.min(i, 18) * 0.022).toFixed(3) + "s");
    });
  } catch (e) {}

  /* ══════════════════════════════════════════════════════
     7 · SPOTLIGHT — luz que sigue al cursor en cards
     ══════════════════════════════════════════════════════ */
  if (FINE && !MOBILE) {
    var sRaf = false, sTarget = null, sX = 50, sY = 50;
    document.addEventListener("pointermove", function (e) {
      var card = e.target && e.target.closest
        ? e.target.closest(".service-card, .portfolio-card, .social-card, .brand-card")
        : null;
      sTarget = card;
      if (card) {
        var r = card.getBoundingClientRect();
        sX = ((e.clientX - r.left) / r.width) * 100;
        sY = ((e.clientY - r.top) / r.height) * 100;
      }
      if (sRaf) return;
      sRaf = requestAnimationFrame(function () {
        sRaf = false;
        if (!sTarget) return;
        sTarget.style.setProperty("--gx", sX.toFixed(1) + "%");
        sTarget.style.setProperty("--gy", sY.toFixed(1) + "%");
      });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     8 · SMART PAUSE — decoraciones quietas con pestaña oculta
     ══════════════════════════════════════════════════════ */
  document.addEventListener("visibilitychange", function () {
    html.classList.toggle("cd-paused", document.hidden);
  });

  /* ══════════════════════════════════════════════════════
     10 · ATMÓSFERA — sistema ambiental visual (v22.1)
     ------------------------------------------------------------
     Un contenedor fijo con:
       · 2 orbes de luz (azul CAMORA / naranja SUPER, blur 90px);
       · partículas VISIBLES (6–14 según página) que derivan
         lentamente con parpadeo — tamaños 5–14px, no microscópicas;
       · 1 haz de luz diagonal que barre la escena cada ~11s.
     Densidad por tipo de página: landing 14, website 12,
     slides 10, apps 6. Móvil: la mitad. Todo CSS puro:
     cero bucles JS, cero rAF, pausa con .cd-paused.
     z-index 1: por encima de los fondos (z-0), por debajo
     del contenido (z-2+), topbar, menú y lightbox.
     ══════════════════════════════════════════════════════ */
  try {
    (function atmosphere() {
      var path = location.pathname;
      var isWebsite = !!document.querySelector(".website-header") || /\/website\//.test(path);
      var isApp = /\/apps\//.test(path);
      var slideNum = document.body.getAttribute("data-slide-num");
      var isLanding = slideNum === "00" || (!slideNum && !isWebsite && !isApp);

      var count = isLanding ? 14 : isWebsite ? 12 : isApp ? 6 : 10;
      if (MOBILE) count = Math.ceil(count / 2);

      var box = document.createElement("div");
      box.className = "cd-atmos";
      box.setAttribute("aria-hidden", "true");

      /* Orbes de luz de marca */
      box.appendChild(makeOrb("cd-orb--camora"));
      box.appendChild(makeOrb("cd-orb--super"));

      /* Haz de barrido ocasional (no en apps: pantallas pequeñas) */
      if (!isApp) {
        var beam = document.createElement("i");
        beam.className = "cd-beam";
        box.appendChild(beam);
      }

      /* Partículas visibles con posiciones aleatorias */
      var COLORS = ["#F5C842", "#1E40FF", "#FF6B1A", "#6B2FBC", "#FFFFFF"];
      for (var p = 0; p < count; p++) {
        var d = document.createElement("i");
        d.className = "cd-dot";
        var c = COLORS[p % COLORS.length];
        var size = 6 + Math.round(Math.random() * 11);        /* 6–17px: visibles (v23) */
        d.style.cssText =
          "left:" + (Math.random() * 100).toFixed(1) + "%;" +
          "top:" + (Math.random() * 100).toFixed(1) + "%;" +
          "width:" + size + "px;height:" + size + "px;" +
          "--c:" + c + ";" +
          "--dur:" + (7 + Math.random() * 9).toFixed(1) + "s;" +
          "--del:" + (Math.random() * 8).toFixed(1) + "s;" +
          "--drift:" + (14 + Math.random() * 36).toFixed(0) + "px;" +
          "--tw:" + (2.4 + Math.random() * 3.2).toFixed(1) + "s;";
        box.appendChild(d);
      }

      function makeOrb(cls) {
        var o = document.createElement("i");
        o.className = "cd-orb " + cls;
        return o;
      }

      document.body.appendChild(box);
    })();
  } catch (e) {}

  /* ══════════════════════════════════════════════════════
     11 · CURSOR FX — ripple al click (v22.1)
     ------------------------------------------------------------
     Refina el visor de cursor.js SIN tocarlo: en cada click
     nace un anillo dorado que se expande y muere. Delegado
     único, solo puntero fino. Los estados refinados del
     visor (esquinas doradas en link, zoom ampliado) viven
     en cine-depth.css (se carga después de cursor.css).
     ══════════════════════════════════════════════════════ */
  if (FINE && !MOBILE) {
    try {
      var sparkBudget = 0;                       /* v23: tope de chispas vivas */
      document.addEventListener("mousedown", function (ev) {
        if (ev.button !== 0) return;
        var r = document.createElement("span");
        r.className = "vf-ripple";
        r.style.left = ev.clientX + "px";
        r.style.top = ev.clientY + "px";
        document.body.appendChild(r);
        r.addEventListener("animationend", function () {
          if (r.parentNode) r.parentNode.removeChild(r);
        }, { once: true });
        /* Failsafe de limpieza */
        setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 1400);
        /* v23: chispas de marca que salen del click */
        if (sparkBudget < 24) {
          var CLS = ["s-gold", "s-blue", "s-white"];
          for (var i = 0; i < 5; i++) {
            var s = document.createElement("i");
            s.className = "vf-spark " + CLS[i % 3];
            var a = Math.random() * Math.PI * 2;
            var dist = 22 + Math.random() * 42;
            s.style.setProperty("--sx", (Math.cos(a) * dist).toFixed(1) + "px");
            s.style.setProperty("--sy", (Math.sin(a) * dist - 16).toFixed(1) + "px");
            s.style.left = ev.clientX + "px";
            s.style.top = ev.clientY + "px";
            document.body.appendChild(s);
            sparkBudget++;
            (function (el) {
              setTimeout(function () {
                if (el.parentNode) el.parentNode.removeChild(el);
                sparkBudget--;
              }, 800);
            })(s);
          }
        }
      }, { passive: true });
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════
     12 · MICRO-FEEL — tilt 3D en cards + brillo en paleta (v22.1)
     ------------------------------------------------------------
     · Slide 02 (y otras): las .card.hover-lift se inclinan
       ±3° siguiendo el cursor (rotateX/Y, solo transform,
       rect cacheado por card, un rAF compartido).
     · Slide 05: los swatches de la paleta reciben un brillo
       deslizante escalonado (::after en CSS, clase .cd-sheen).
     Nunca roba el cursor: la inclinación es sutil y vuelve
     a 0 al salir.
     ══════════════════════════════════════════════════════ */
  if (FINE && !MOBILE) {
    try {
      /* Tilt con PROPIEDADES INDIVIDUALES rotate/translate: componen
         con el transform de .anim-* (fill forwards) y con el lift del
         hover sin pisarse — mismo patrón que MouseDepth en v22.0.
         Este Chromium solo acepta rotate de UN eje+ángulo, así que
         rotateX+rotateY se componen en una sola rotación (quaternion
         -> eje/ángulo) y se escriben como --cd-rot. */
      function tiltToRotate(rx, ry) {
        var ax = rx * Math.PI / 180, ay = ry * Math.PI / 180;
        var c1 = Math.cos(ax / 2), s1 = Math.sin(ax / 2);
        var c2 = Math.cos(ay / 2), s2 = Math.sin(ay / 2);
        var w = c1 * c2, x = s1 * c2, y = c1 * s2, z = -s1 * s2;
        var ang = 2 * Math.acos(Math.max(-1, Math.min(1, w)));
        var s = Math.sqrt(Math.max(0, 1 - w * w));
        if (s < 1e-4) return "0deg";
        return (x / s).toFixed(3) + " " + (y / s).toFixed(3) + " " + (z / s).toFixed(3) +
               " " + (ang * 180 / Math.PI).toFixed(2) + "deg";
      }
      var tiltCards = document.querySelectorAll(".card.hover-lift");
      tiltCards.forEach(function (card) {
        var rect = null, raf = null;
        card.addEventListener("pointerenter", function () {
          rect = card.getBoundingClientRect();
          card.classList.add("cd-tilt");
        }, { passive: true });
        card.addEventListener("pointermove", function (ev) {
          if (!rect) rect = card.getBoundingClientRect();
          if (raf) return;
          var cx = ev.clientX, cy = ev.clientY;
          raf = requestAnimationFrame(function () {
            raf = null;
            var px = (cx - rect.left) / rect.width - 0.5;
            var py = (cy - rect.top) / rect.height - 0.5;
            card.style.setProperty("--cd-rot", tiltToRotate(py * -4.5, px * 4.5));
            card.style.setProperty("--cd-tx", (px * 5).toFixed(1) + "px");
            card.style.setProperty("--cd-ty", (py * 5).toFixed(1) + "px");
          });
        }, { passive: true });
        card.addEventListener("pointerleave", function () {
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          rect = null;
          card.style.setProperty("--cd-rot", "0deg");
          card.style.setProperty("--cd-tx", "0px");
          card.style.setProperty("--cd-ty", "0px");
          setTimeout(function () { card.classList.remove("cd-tilt"); }, 200);
        }, { passive: true });
      });
    } catch (e) {}
  }

  try {
    /* Paleta (slide 05): brillo de luz recorriendo los colores.
       El sheen es un ::after del propio swatch: no toca la
       animación de entrada del ancestro .anim. Se filtra por
       tamaño para no tocar los puntos decorativos inline
       (que también llevan background:# pero miden <100px).
       Es animación CSS pura: también vive en táctil. */
    if (document.body.dataset.slideNum === "05") {
      var swatches = document.querySelectorAll('.slide-main div[style*="background:#"]');
      var si = 0;
      swatches.forEach(function (sw) {
        if (sw.hasAttribute("data-anim") || sw.hasAttribute("data-reveal")) return;
        if (sw.offsetWidth < 100 || sw.offsetHeight < 60) return;   /* no es un swatch */
        sw.classList.add("cd-sheen");
        sw.style.setProperty("--sh-del", (si * 0.55).toFixed(2) + "s");
        si++;
      });
    }
  } catch (e) {}

  /* ══════════════════════════════════════════════════════
     13 · WEB CINEMA — website: haz + secciones + parallax (v22.1)
     ------------------------------------------------------------
     · Haz de luz que barre el héroe cada ~9s (.cd-hero-beam).
     · Cada .web-section recibe .cd-seen al entrar en viewport
       (IntersectionObserver): eleva levemente su brillo de
       borde — una sola vez, sin bucles.
     · Parallax suave (±18px) en las imágenes protagonistas de
       las brand-cards (la card la anima reveal.js; la imagen
       interna queda libre — verificación de propiedad propia).
     ══════════════════════════════════════════════════════ */
  try {
    var hero = document.querySelector(".web-hero");
    if (hero) {
      var hb = document.createElement("i");
      hb.className = "cd-hero-beam";
      hb.setAttribute("aria-hidden", "true");
      hero.appendChild(hb);

      /* Secciones: presencia al entrar */
      if ("IntersectionObserver" in window) {
        var seen = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("cd-seen");
              seen.unobserve(en.target);   /* una sola vez, cero trabajo luego */
            }
          });
        }, { threshold: 0.18 });
        document.querySelectorAll(".web-section").forEach(function (s) { seen.observe(s); });
      }

      /* Parallax interno de las imágenes de las brand-cards */
      if (!MOBILE) {
        var brandImgs = [];
        document.querySelectorAll(".web-brands .brand-card > img").forEach(function (im) {
          /* La card la anima reveal.js (transform en la CARD); la imagen
             interna queda libre — solo se excluye si la propia imagen
             llevara data-reveal/data-anim. */
          if (im.hasAttribute("data-reveal") || im.hasAttribute("data-anim")) return;
          im.classList.add("cd-para-img");
          brandImgs.push(im);
        });
        if (brandImgs.length) {
          var bRaf = false;
          var onBrandScroll = function () {
            if (bRaf) return;
            bRaf = requestAnimationFrame(function () {
              bRaf = false;
              var vh = window.innerHeight;
              brandImgs.forEach(function (im) {
                var r = im.getBoundingClientRect();
                if (r.bottom < -80 || r.top > vh + 80) return;
                var center = r.top + r.height / 2 - vh / 2;
                var y = Math.max(-18, Math.min(18, -center * 0.06));
                im.style.transform = "translate3d(0," + y.toFixed(1) + "px,0) scale(1.08)";
              });
            });
          };
          window.addEventListener("scroll", onBrandScroll, { passive: true });
          onBrandScroll();
        }
      }
    }
  } catch (e) {}

  /* ══════════════════════════════════════════════════════
     14-17 · CAPAS DE CINE v23 (texturas reales assets/fx/)
     ------------------------------------------------------------
     Los elementos se crean de inmediato (las texturas se
     descargan en paralelo, sin bloquear) pero SOLO se
     revelan (clase .on) cuando el velo del preloader se
     levanta: cero costo en el primer paint.
       · FilmGrade: grano que vibra con steps(1) + viñeta.
       · LightLeak: fuga de luz de proyector (screen blend).
       · BokehHero: discos de luz de marca sobre los héroes.
       · Nebula: nubes oscuras de profundidad (portada/cierre).
     Todo pointer-events:none + transform/opacity only.
     ══════════════════════════════════════════════════════ */
  var fxLayers = [];

  try {
    (function filmGrade() {
      var g = document.createElement("div");
      g.className = "cd-grade";
      g.setAttribute("aria-hidden", "true");
      /* v25: GRANO RETIRADO a peticion del usuario — solo queda
         la vineta (::after), sutil y sin costo de repaint.
         (El elemento <i class="cd-grain"> ya no se crea.) */
      document.body.appendChild(g);
      fxLayers.push({ el: g, delay: 250 });
    })();
  } catch (e) {}

  try {
    (function lightLeak() {
      var path = location.pathname;
      var slideNum = document.body.getAttribute("data-slide-num");
      var isApp = /\/apps\//.test(path);
      if (isApp) return;                   /* pantallas de app: limpias */
      var defs = [];
      if (slideNum === "01") {             /* portada: dual de marca */
        defs.push(["gold", 0.14], ["blue", 0.11]);
      } else if (document.querySelector(".web-hero") || document.querySelector(".website-header")) {
        defs.push(["gold", 0.15]);         /* website: proyector cálido */
      } else if (slideNum === "20") {      /* cierre: fuego */
        defs.push(["gold", 0.16]);
      } else if (slideNum === "00" || (!slideNum && !isApp)) {
        defs.push(["blue", 0.12]);         /* landing: azul CAMORA */
      } else {
        /* slides: paridad oro / violeta (variedad con criterio) */
        var n = parseInt(slideNum, 10) || 0;
        defs.push([n % 2 === 0 ? "violet" : "gold", 0.12]);
      }
      defs.forEach(function (d, i) {
        var l = document.createElement("i");
        l.className = "cd-leak cd-leak--" + d[0] + " alive";
        l.setAttribute("aria-hidden", "true");
        l.style.setProperty("--leak-op", d[1]);
        document.body.appendChild(l);
        fxLayers.push({ el: l, delay: 500 + i * 350 });
      });
    })();
  } catch (e) {}

  try {
    (function bokehHero() {
      var hero = document.querySelector(".web-hero");
      var slideNum = document.body.getAttribute("data-slide-num");
      var isLanding = slideNum === "00" || (!slideNum && !hero &&
                     !/\/apps\//.test(location.pathname) && !/\/website\//.test(location.pathname));
      var host = null, alt = false;
      if (slideNum === "01") { host = document.querySelector(".slide-main"); alt = true; }
      else if (hero) { host = hero; }
      else if (isLanding) { host = document.querySelector(".landing-bg") || document.body; }
      if (!host) return;
      var b = document.createElement("i");
      b.className = "cd-bokeh alive" + (alt ? " alt" : "");
      b.setAttribute("aria-hidden", "true");
      b.style.setProperty("--bokeh-op", alt ? "0.15" : "0.16");
      host.appendChild(b);
      fxLayers.push({ el: b, delay: 700 });
    })();
  } catch (e) {}

  try {
    (function nebula() {
      var slideNum = document.body.getAttribute("data-slide-num");
      var host = null, kind = null, op = 0.5;
      if (slideNum === "01") { host = document.querySelector(".slide-main"); kind = "deep"; op = 0.55; }
      else if (slideNum === "20") { host = document.querySelector(".slide-main"); kind = "ember"; op = 0.5; }
      else if (document.querySelector(".web-hero")) { host = document.querySelector(".web-hero"); kind = "deep"; op = 0.38; }
      if (!host || !kind) return;
      var nb = document.createElement("i");
      nb.className = "cd-nebula cd-nebula--" + kind + " alive";
      nb.setAttribute("aria-hidden", "true");
      nb.style.setProperty("--neb-op", op);
      host.appendChild(nb);
      fxLayers.push({ el: nb, delay: 400 });
    })();
  } catch (e) {}

  /* ══════════════════════════════════════════════════════
     18 · NEON FX (v24) — luces de neón que CAMBIAN DE COLOR
     ------------------------------------------------------------
     Más notorias que el grano: dos tubos de neón en los
     bordes del viewport que ciclan azul→oro→naranja→violeta,
     subrayado neón bajo los títulos y neón en la navegación.
     CSS puro (opacidad entre capas pre-renderizadas: cero
     repaint de sombras), pausa con pestaña oculta.
     ══════════════════════════════════════════════════════ */
  try {
    (function neonFX() {
      if (MOBILE) return;                          /* táctil: limpio */
      var path = location.pathname;
      if (/\/apps\//.test(path)) return;           /* apps: limpio   */

      /* Tubos de neón en los bordes del viewport */
      var box = document.createElement("div");
      box.className = "cd-neonframe";
      box.setAttribute("aria-hidden", "true");
      box.innerHTML = '<i class="cd-neon-tube cd-neon-tube--top"></i>' +
                      '<i class="cd-neon-tube cd-neon-tube--bottom"></i>';
      document.body.appendChild(box);
      fxLayers.push({ el: box, delay: 900 });

      /* Subrayado neón bajo los títulos protagonistas */
      var host = null;
      if (document.querySelector(".web-hero")) host = document.querySelector(".web-hero-content h1");
      else if (document.body.dataset.slideNum) {
        /* v25.4: cadena robusta — el landing (data-slide-num="00") usa
           .hero-title, no .text-display; antes quedaba sin rayita. */
        var t = document.querySelector(".slide-main .text-display") ||
                document.querySelector(".slide-main .hero-title") ||
                document.querySelector("main h1");
        if (t) host = t;
      } else {
        var lh = document.querySelector(".landing-content h1") || document.querySelector("main h1");
        if (lh) host = lh;
      }
      if (host) {
        host.classList.add("cd-neon-title");
        /* v25.4 · la rayita se ancla según la alineación REAL del título:
           centrado → centrada bajo las letras; izquierda → arranca en la
           primera letra (antes flotaba al centro del bloque: buguiado). */
        try {
          var ta = getComputedStyle(host).textAlign;
          if (ta === "center" || ta === "-webkit-center" || ta === "justify") {
            host.classList.add("cd-neon-title--center");
          }
        } catch (e) {}
        fxLayers.push({ el: host, delay: 1000 });
      }
    })();
  } catch (e) {}

  /* ══════════════════════════════════════════════════════
     19 · LIQUID FX (v24) — animaciones líquidas "gota"
     ------------------------------------------------------------
     El efecto que enamoró del intro, hecho sistema:
       · Portada: la X respira con gotas líquidas — anillos
         que nacen del centro y se funden (cada ~3.4s).
       · Botones: relleno líquido que sube al hover.
       · Click: la onda existente ahora es una gota doble.
     CSS puro + inyección mínima; reduced-motion fuera.
     ══════════════════════════════════════════════════════ */
  try {
    (function liquidFX() {
      /* Gotas alrededor de la X de la portada */
      var x = document.querySelector(".intro-x");
      if (x && document.body.dataset.slideNum === "01") {
        var wrap = x.parentElement;
        if (wrap) {
          wrap.classList.add("cd-lqd-host");
          for (var i = 0; i < 3; i++) {
            var drop = document.createElement("i");
            drop.className = "cd-lqd-drop";
            drop.style.animationDelay = (i * 1.15).toFixed(2) + "s";
            wrap.appendChild(drop);
          }
          fxLayers.push({ el: wrap, delay: 1200 });
        }
      }
      /* Botones líquidos: solo se marca el HTML, el CSS hace el resto */
      document.querySelectorAll(".btn--primary, .btn--secondary, .wa-cta, .ig-btn--follow, .tt-btn--follow").forEach(function (b) {
        b.classList.add("cd-lqd-btn");
      });
    })();
  } catch (e) {}

  /* Revelado escalonado tras el velo del preloader */
  function fxReveal() {
    fxLayers.forEach(function (f) {
      setTimeout(function () { f.el.classList.add("on"); }, f.delay);
    });
  }

  /* ══════════════════════════════════════════════════════
     9 · ARRANQUE + FAILSAFE GLOBAL
     ══════════════════════════════════════════════════════ */
  function start() {
    try { installScrollBridge(); } catch (e) {}   /* revive listeners de window en TODAS las páginas */
    try { prepFocusPull(); } catch (e) {}
    started = true;
    deliver();
    /* Failsafe maestro: nunca contenido oculto por un fallo */
    setTimeout(function () {
      document.querySelectorAll(".cd-prep-bg").forEach(function (el) {
        el.classList.remove("cd-prep-bg");
      });
    }, 2600);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 30); });
  } else {
    setTimeout(start, 30);
  }

  window.CineDepth = { version: "24.0-liquid-neon" };
})();
