/* ============================================================
   CAMI × DAVID — entrance-cinema.js  (v21.1)
   Coreografia de entrada automatica para las 31 paginas.
   ------------------------------------------------------------
   1. Marca <html class="ec-js"> al instante (gate del CSS).
   2. Agrega .ec-prep (oculto) SOLO via JS => si este script
      no corre, nada se oculta (anti slides-vacios).
   3. Respeta el sistema existente: nunca toca elementos con
      .anim / [data-anim] (esos son de slide-anim.js).
   4. Cascada: topbar > badges > titulos > bloques > botones.
   5. Failsafe a 2.5s fuerza visibilidad total.
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 0 · Gate + vela de luz ─────────────────────────────── */
  document.documentElement.classList.add("ec-js");
  if (REDUCED) return;

  var sweep = document.createElement("div");
  sweep.className = "ec-sweep";
  sweep.setAttribute("aria-hidden", "true");

  function mountSweep() {
    document.body.appendChild(sweep);
    setTimeout(function () {
      if (sweep.parentNode) sweep.parentNode.removeChild(sweep);
    }, 1100);
  }
  if (document.body) { mountSweep(); }
  else { document.addEventListener("DOMContentLoaded", mountSweep); }

  /* ── 1 · Roles y selectores reales del proyecto ─────────── */
  var SEL = {
    topbar: [
      ".slide-topbar", ".topbar", "header.site-header",
      ".wa-head", ".ig-topbar", ".tt-topbar", ".brandbar"
    ],
    badges: [
      ".badge-colegio", ".badge-sena", ".corner-badge", ".corner-logo"
    ],
    heroContent: [
      ".web-hero-content > *", ".web-hero-bg", ".ig-header",
      ".ig-profile-row", ".tt-cover", ".tt-prow"
    ],
    blocks: [
      ".slide-main > *", ".font-mono", ".chip:not(.anim)",
      ".scroll-story-title", ".scroll-story-sub"
    ],
    buttons: [
      ".btn-prev", ".btn-next", ".btn-home", ".btn-back-origin",
      ".back-link", ".btn--primary", ".btn--secondary",
      ".slide-nav .btn", ".nav-buttons .btn", "a.btn"
    ]
  };

  function q(selList) {
    var out = [], i, j;
    for (i = 0; i < selList.length; i++) {
      try {
        var found = document.querySelectorAll(selList[i]);
        for (j = 0; j < found.length; j++) out.push(found[j]);
      } catch (e) { /* selector no aplica en esta pagina */ }
    }
    return out;
  }

  /* ¿Ya animado por el sistema existente? => no tocar */
  function isOwned(el) {
    if (el.classList.contains("anim")) return true;
    if (el.closest && el.closest(".anim, [data-anim]")) return true;
    return false;
  }

  function isHidden(el) {
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    return el.offsetParent === null && cs.position !== "fixed";
  }

  var seen = [];
  function unique(els) {
    var out = [];
    els.forEach(function (el) {
      if (seen.indexOf(el) === -1) { seen.push(el); out.push(el); }
    });
    return out;
  }

  /* ── 2 · Preparar la coreografia ────────────────────────── */
  function prep() {
    var stage = [];
    seen = [];

    /* a) Topbar: desciende */
    unique(q(SEL.topbar)).forEach(function (el) {
      if (isOwned(el) || isHidden(el)) return;
      el.classList.add("ec-prep", "ec-topbar");
      stage.push([el, 0.05]);
    });

    /* b) Badges institucionales: pop escalonado */
    unique(q(SEL.badges)).forEach(function (el, idx) {
      if (isOwned(el) || isHidden(el)) return;
      el.classList.add("ec-prep", "ec-pop");
      stage.push([el, 0.16 + idx * 0.1]);
    });

    /* c) Hero / encabezados de website y apps: suben */
    unique(q(SEL.heroContent)).forEach(function (el, idx) {
      if (isOwned(el) || isHidden(el)) return;
      el.classList.add("ec-prep", "ec-rise");
      stage.push([el, 0.24 + idx * 0.09]);
    });

    /* d) Bloques de contenido sin .anim: suben */
    unique(q(SEL.blocks)).forEach(function (el, idx) {
      if (isOwned(el) || isHidden(el)) return;
      /* si el padre ya esta en escena, saltarlo */
      if (el.parentElement && el.parentElement.classList.contains("ec-prep")) return;
      el.classList.add("ec-prep", "ec-rise");
      stage.push([el, 0.3 + idx * 0.07]);
    });

    /* e) Botones de navegacion: al final, en fila */
    unique(q(SEL.buttons)).forEach(function (el, idx) {
      if (isOwned(el) || isHidden(el)) return;
      el.classList.add("ec-prep", "ec-rise");
      stage.push([el, 0.55 + idx * 0.07]);
    });

    return stage;
  }

  /* ── 3 · Disparar ───────────────────────────────────────── */
  function fire(stage) {
    stage.forEach(function (pair) {
      var el = pair[0], delay = pair[1];
      setTimeout(function () {
        el.classList.remove("ec-prep");
        el.classList.add("ec-in");
      }, delay * 1000);
    });
  }

  /* ── 4 · Failsafe anti slides vacios ───────────────────── */
  function enforce() {
    document.querySelectorAll(".ec-prep").forEach(function (el) {
      el.classList.remove("ec-prep");
      if (!el.classList.contains("ec-in")) el.classList.add("ec-in");
    });
  }

  /* ── 5 · Arranque ──────────────────────────────────────── */
  function start() {
    try {
      var stage = prep();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { fire(stage); });
      });
    } catch (e) { enforce(); }
    setTimeout(enforce, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 40); });
  } else {
    setTimeout(start, 40);
  }
})();
