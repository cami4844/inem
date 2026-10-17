/* ============================================================
   CAMI × DAVID — 3D interactions v16 (landing index.html)
   - Cubos 3D ambientales
   - Tilt 3D con glint en tarjetas/filas
   - Parallax 3D del hero con el mouse (rAF, sin layout)
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  /* ---------- 1. Escena de cubos 3D ---------- */
  var scene = document.createElement("div");
  scene.className = "scene3d";
  scene.setAttribute("aria-hidden", "true");
  var cubes = [
    { c: "",   x: "8vw",  y: "18vh", s: "44px", t: "22s", d: "0s"  },
    { c: "c2", x: "85vw", y: "12vh", s: "34px", t: "26s", d: "-6s" },
    { c: "c3", x: "78vw", y: "72vh", s: "56px", t: "30s", d: "-12s"},
    { c: "c2", x: "14vw", y: "78vh", s: "30px", t: "20s", d: "-3s" }
  ];
  cubes.forEach(function (k) {
    var el = document.createElement("div");
    el.className = "cube3d " + k.c;
    el.style.cssText = "--x:" + k.x + ";--y:" + k.y + ";--s:" + k.s + ";--t:" + k.t + ";animation-delay:" + k.d + ";";
    for (var i = 0; i < 6; i++) el.appendChild(document.createElement("i"));
    scene.appendChild(el);
  });
  document.body.appendChild(scene);

  /* ---------- 2. Tilt 3D + glint en elementos marcados ---------- */
  var TILT_SEL = ".vault-web, .vault-apps > a, .idx-row, .marquee";
  function bindTilt(el) {
    var rect = null;
    el.addEventListener("pointerenter", function () { rect = el.getBoundingClientRect(); }, { passive: true });
    el.addEventListener("pointermove", function (e) {
      if (!rect) rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (0.5 - py) * 7;   /* grados */
      var ry = (px - 0.5) * 9;
      el.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    }, { passive: true });
    el.addEventListener("pointerleave", function () {
      el.style.transform = "";
      rect = null;
    }, { passive: true });
  }
  document.querySelectorAll(TILT_SEL).forEach(function (el) {
    if (!el.classList.contains("marquee")) bindTilt(el);
  });

  /* ---------- 3. Parallax 3D del hero con el mouse ---------- */
  var hero = document.querySelector(".hero-logos");
  if (hero && !window.matchMedia("(max-width: 768px)").matches) {
    var cam = document.querySelector(".hero-logos img:first-child");
    var sup = document.querySelector(".hero-logos img:last-of-type");
    var xx  = document.querySelector(".hero-logos .x");
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (cam) cam.style.translate = (cx * -14) + "px " + (cy * -8) + "px";
      if (sup) sup.style.translate = (cx * 14) + "px " + (cy * -8) + "px";
      if (xx)  xx.style.translate  = (cx * 6) + "px " + (cy * 4) + "px";
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ---------- 4. Reveal tipo flip para filas del indice ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("revealed"); io.unobserve(en.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.idx-row[data-reveal="flip"]').forEach(function (el) { io.observe(el); });
})();
