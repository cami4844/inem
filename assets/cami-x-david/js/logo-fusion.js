/* ============================================================
   CAMI × DAVID — logo-fusion.js  (v23 FX ENGINE)
   ------------------------------------------------------------
   MINIEXPLOSIÓN DE LOGOS EN LA X — solo slide 01 (portada).

   Coreografía (tiempos desde lf-go):
     0.00s  logos CAMORA y SUPER entran como meteoritos con
            estelas de luz (canvas) y chispas de velocidad
     0.85s  COLISIÓN en la zona de la X:
            · canvas: chispas XL + chispas + escombros +
              humo + 3 ondas de choque + destello anamórfico
            · flash blanco-oro a pantalla completa
            · sacudida de cámara sobre .slide-main
     0.85s  la X NACE del epicentro (lfXBurst 0.42s)
     1.95s  estado lf-done: levitación + glow respirando

   SEGURIDAD:
   · html.lf-js es el GATE: sin JS => intro v21.1 intacta.
   · prefers-reduced-motion => el script ni se activa.
   · Failsafes: lf-go forzado a 2.6s; lf-js retirado a 5s
     si la secuencia no arrancó; canvas con fecha de caducidad.
   · Sprites: si una textura falla, se dibuja un glow
     procedural (la explosión ocurre igual).
   · Teardown total: rAF cancelado, canvas y listeners
     eliminados al morir la última partícula.
   ============================================================ */
(function () {
  "use strict";

  var html = document.documentElement;
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var row = document.querySelector(".intro-logo-camora")
          ? document.querySelector(".intro-logo-camora").parentElement
          : null;

  /* Solo la portada tiene esta coreografía */
  if (!row || !document.querySelector(".intro-x")) return;
  if (REDUCED) return;

  var MOBILE = window.matchMedia("(max-width: 768px)").matches;

  /* ── Constantes del show ─────────────────────────────── */
  var T_COLLIDE = 850;     /* ms hasta el impacto            */
  var T_DONE    = 1950;    /* ms hasta estado final          */
  var T_TEARDOWN_MAX = 4200; /* ms: el canvas muere sí o sí */

  html.classList.add("lf-js");                          // ← GATE

  /* ── Failsafes registrados ANTES de cualquier riesgo ── */
  var boomed = false, went = false;
  var fsGo = setTimeout(function () { go(true); }, 2600);
  var fsRestore = setTimeout(function () {
    if (!went) html.classList.remove("lf-js");          /* vuelve v21.1 */
  }, 5000);

  /* ── Rutas y sprites ────────────────────────────────── */
  var BASE = "";
  try {
    if (document.currentScript && document.currentScript.src) {
      BASE = document.currentScript.src.replace(/js\/[^\/]*$/, "");
    }
  } catch (e) {}
  if (!BASE) BASE = "../";

  var SPRITES = {};
  var LIST = ["spark-gold", "spark-blue", "spark-orange", "spark-violet",
              "spark-white", "spark-xl-gold", "spark-xl-blue", "spark-xl-orange",
              "shockwave", "flare-star", "debris-shard-1", "debris-shard-2",
              "smoke-soft-1", "smoke-soft-2", "smoke-soft-3", "trail-streak"];

  /* Carga temprana (durante el velo del preloader) */
  LIST.forEach(function (n) {
    var im = new Image();
    im.decoding = "async";
    im.onload = function () { SPRITES[n] = im; };
    im.src = BASE + "assets/fx/" + n + ".png";
  });

  /* Glow procedural de emergencia por color */
  var FALLBACK = {};
  function fallbackSprite(color) {
    if (FALLBACK[color]) return FALLBACK[color];
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var g = c.getContext("2d");
    var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "#ffffff");
    gr.addColorStop(0.35, color);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    FALLBACK[color] = c;
    return c;
  }
  function spr(name, color) {
    return SPRITES[name] || fallbackSprite(color || "#f5c842");
  }

  /* ── Canvas ─────────────────────────────────────────── */
  var cv = null, ctx = null, DPR = 1, W = 0, H = 0;
  var rafId = 0, particles = [], t0 = 0, boomAt = 0;
  var logoPrev = { cam: null, sup: null };
  var onResize = null;

  function makeCanvas() {
    cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;z-index:9980;pointer-events:none;";
    DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2);
    sizeCanvas();
    document.body.appendChild(cv);
    ctx = cv.getContext("2d");
    onResize = function () { if (cv) sizeCanvas(); };
    window.addEventListener("resize", onResize, { passive: true });
  }
  function sizeCanvas() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + "px"; cv.style.height = H + "px";
  }

  /* ── Física de partículas ───────────────────────────── */
  function P(o) {
    this.spr = o.spr; this.color = o.color || "#f5c842";
    this.x = o.x; this.y = o.y;
    this.vx = o.vx || 0; this.vy = o.vy || 0;
    this.g = o.g || 0; this.drag = (o.drag === undefined ? 0.9 : o.drag);
    this.rot = o.rot || 0; this.vrot = o.vrot || 0;
    this.size = o.size; this.grow = o.grow || 0;
    this.life = o.life; this.t = 0;
    this.add = !!o.add; this.fade = o.fade || 1;
    this.flicker = !!o.flicker;
    this.delay = o.delay || 0;
    particles.push(this);
  }
  P.prototype.step = function (dt) {
    if (this.delay > 0) { this.delay -= dt; return true; }
    this.t += dt;
    if (this.t >= this.life) return false;
    var k = Math.pow(this.drag, dt * 60);
    this.vx *= k; this.vy = this.vy * k + this.g * dt;
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.rot += this.vrot * dt;
    this.size += this.grow * dt;
    return true;
  };
  P.prototype.alpha = function () {
    if (this.delay > 0) return 0;
    var u = this.t / this.life;
    var a = u < 0.12 ? u / 0.12 : 1 - (u - 0.12) / 0.88;
    a = Math.max(0, a) * this.fade;
    if (this.flicker) a *= 0.72 + 0.28 * Math.sin(this.t * 55);
    return a;
  };

  /* ── Estelas de aproximación ────────────────────────── */
  function drawTrail(el, prev, color, t) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (!prev) return { x: cx, y: cy };
    var dx = cx - prev.x, dy = cy - prev.y;
    var speed = Math.sqrt(dx * dx + dy * dy);
    if (speed < 2) return { x: cx, y: cy };
    var ang = Math.atan2(dy, dx);
    var len = Math.min(speed * 3.2, 340);
    var a = Math.min(0.85, speed / 90) * (1 - t / T_COLLIDE * 0.35);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = a;
    ctx.translate(cx * DPR, cy * DPR);
    ctx.rotate(ang);
    var w = len * DPR, h = Math.max(r.height * 0.42, 26) * DPR;
    ctx.drawImage(spr("trail-streak", color), -w, -h / 2, w, h);
    ctx.restore();
    /* chispas de velocidad tras el logo */
    if (Math.random() < 0.55) {
      new P({
        spr: spr(["spark-gold", "spark-white", "spark-blue"][Math.floor(Math.random() * 3)]),
        x: cx - Math.cos(ang) * r.width * 0.32,
        y: cy - Math.sin(ang) * r.height * 0.32,
        vx: -dx * 2.2 + (Math.random() - 0.5) * 120,
        vy: -dy * 2.2 + (Math.random() - 0.5) * 120,
        g: 240, size: 5 + Math.random() * 9, life: 0.28 + Math.random() * 0.2,
        add: true, fade: 0.9
      });
    }
    return { x: cx, y: cy };
  }

  /* ── Explosión en el epicentro ──────────────────────── */
  function explode(cx, cy) {
    var vm = Math.min(W, H);
    var K = MOBILE ? 0.6 : 1;

    /* Destello anamórfico central */
    new P({ spr: spr("flare-star"), x: cx, y: cy, vx: 0, vy: 0,
            size: vm * 0.42, grow: vm * 0.5, life: 0.34, add: true, fade: 1 });

    /* Chispas XL cercanas a cámara */
    var XL = ["spark-xl-gold", "spark-xl-blue", "spark-xl-orange"];
    for (var i = 0; i < Math.round(11 * K); i++) {
      var a1 = Math.random() * Math.PI * 2, s1 = 200 + Math.random() * 560;
      new P({ spr: spr(XL[i % 3]), x: cx, y: cy,
              vx: Math.cos(a1) * s1, vy: Math.sin(a1) * s1 - 90,
              g: 560, drag: 0.9, size: 70 + Math.random() * 110,
              rot: Math.random() * 6.3, vrot: (Math.random() - 0.5) * 5,
              life: 0.85 + Math.random() * 0.5, add: true, flicker: true, fade: 1 });
    }

    /* Chispas de marca */
    var SM = ["spark-gold", "spark-blue", "spark-orange", "spark-white", "spark-violet"];
    for (var j = 0; j < Math.round(76 * K); j++) {
      var a2 = Math.random() * Math.PI * 2, s2 = 160 + Math.random() * 820;
      new P({ spr: spr(SM[Math.floor(Math.random() * SM.length)]), x: cx, y: cy,
              vx: Math.cos(a2) * s2, vy: Math.sin(a2) * s2 - 60,
              g: 620, drag: 0.885, size: 14 + Math.random() * 42,
              rot: Math.random() * 6.3, vrot: (Math.random() - 0.5) * 9,
              life: 0.6 + Math.random() * 0.85, add: true, fade: 1,
              flicker: Math.random() < 0.4 });
    }

    /* Escombros angulares */
    for (var d = 0; d < Math.round(13 * K); d++) {
      var a3 = Math.random() * Math.PI * 2, s3 = 300 + Math.random() * 460;
      new P({ spr: spr(d % 2 ? "debris-shard-2" : "debris-shard-1"), x: cx, y: cy,
              vx: Math.cos(a3) * s3, vy: Math.sin(a3) * s3 - 190,
              g: 820, drag: 0.94, size: 26 + Math.random() * 46,
              rot: Math.random() * 6.3, vrot: (Math.random() - 0.5) * 13,
              life: 0.95 + Math.random() * 0.55, add: true, fade: 0.95 });
    }

    /* Ondas de choque escalonadas */
    for (var wv = 0; wv < 3; wv++) {
      new P({ spr: spr("shockwave"), x: cx, y: cy, vx: 0, vy: 0,
              size: vm * 0.06, grow: vm * (wv === 0 ? 1.15 : 0.8),
              life: 0.52 + wv * 0.1, add: true, fade: 0.85 - wv * 0.18,
              delay: wv * 0.075 });
    }

    /* Humo del aftermath (normal blending: tapa luz) */
    var SMK = ["smoke-soft-1", "smoke-soft-2", "smoke-soft-3"];
    for (var s = 0; s < Math.round(7 * K); s++) {
      new P({ spr: spr(SMK[s % 3]), x: cx + (Math.random() - 0.5) * 70,
              y: cy + (Math.random() - 0.5) * 40,
              vx: (Math.random() - 0.5) * 90, vy: -30 - Math.random() * 60,
              g: -12, drag: 0.97, size: 130 + Math.random() * 160,
              grow: 150, rot: Math.random() * 6.3, vrot: (Math.random() - 0.5) * 1.2,
              life: 1.5 + Math.random() * 0.7, add: false, fade: 0.4,
              delay: 0.1 + Math.random() * 0.28 });
    }

    /* Brasas que quedan flotando */
    for (var e = 0; e < Math.round(11 * K); e++) {
      new P({ spr: spr("spark-gold"), x: cx + (Math.random() - 0.5) * 120,
              y: cy + (Math.random() - 0.5) * 60,
              vx: (Math.random() - 0.5) * 70, vy: -40 - Math.random() * 70,
              g: -16, drag: 0.985, size: 7 + Math.random() * 10,
              life: 1.4 + Math.random() * 0.9, add: true, fade: 0.8,
              flicker: true, delay: 0.12 + Math.random() * 0.3 });
    }
  }

  /* ── Bucle rAF ──────────────────────────────────────── */
  var last = 0;
  function frame(now) {
    if (!ctx) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    var t = now - t0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);

    /* Fase 1: estelas mientras se aproximan */
    if (!boomed) {
      var colorC = "#1E40FF", colorS = "#FF6B1A";
      logoPrev.cam = drawTrail(row.querySelector(".intro-logo-camora"), logoPrev.cam, colorC, t);
      logoPrev.sup = drawTrail(row.querySelector(".intro-logo-super"), logoPrev.sup, colorS, t);
    }

    /* Partículas: humo primero (detrás), luego aditivas */
    var i, p;
    for (i = particles.length - 1; i >= 0; i--) {
      if (particles[i].add) continue;
      if (!particles[i].step(dt)) particles.splice(i, 1);
    }
    for (i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].add) continue;
      if (!particles[i].step(dt)) particles.splice(i, 1);
    }
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      if (p.delay > 0) continue;
      var a = p.alpha();
      if (a <= 0.01) continue;
      ctx.save();
      ctx.globalCompositeOperation = p.add ? "lighter" : "source-over";
      ctx.globalAlpha = a;
      ctx.translate(p.x * DPR, p.y * DPR);
      if (p.rot) ctx.rotate(p.rot);
      var s = p.size * DPR;
      ctx.drawImage(p.spr, -s / 2, -s / 2, s, s);
      ctx.restore();
    }

    /* Caducidad: cuando todo murió (o tope duro), teardown */
    if ((boomed && particles.length === 0 && t > T_COLLIDE + 300) || t > T_TEARDOWN_MAX) {
      teardown();
      return;
    }
    rafId = requestAnimationFrame(frame);
  }

  function teardown() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (onResize) window.removeEventListener("resize", onResize);
    onResize = null;
    if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
    cv = null; ctx = null; particles = [];
  }

  /* ── Estados ────────────────────────────────────────── */
  function go(forced) {
    if (went) return;
    went = true;
    clearTimeout(fsGo);
    html.classList.add("lf-go");
    try { makeCanvas(); } catch (e) { cv = null; }
    t0 = performance.now();
    last = t0;
    if (cv) rafId = requestAnimationFrame(frame);
    setTimeout(boom, T_COLLIDE);
    setTimeout(function () { html.classList.add("lf-done"); }, T_DONE);
  }

  function boom() {
    if (boomed) return;
    boomed = true;
    html.classList.add("lf-boom");

    /* Epicentro: el centro exacto de la X */
    var xEl = document.querySelector(".intro-x");
    var r = xEl.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    /* Flash a pantalla completa */
    var fl = document.createElement("div");
    fl.className = "lf-flash";
    fl.setAttribute("aria-hidden", "true");
    fl.style.setProperty("--lf-x", (cx / W * 100).toFixed(1) + "%");
    fl.style.setProperty("--lf-y", (cy / H * 100).toFixed(1) + "%");
    document.body.appendChild(fl);
    setTimeout(function () { if (fl.parentNode) fl.parentNode.removeChild(fl); }, 750);

    /* Sacudida de cámara */
    var sm = document.querySelector(".slide-main");
    if (sm) {
      sm.classList.add("lf-shake");
      setTimeout(function () { sm.classList.remove("lf-shake"); }, 500);
    }

    if (ctx) explode(cx, cy);
  }

  /* ── Espera: preloader levantado Y fila visible ─────── */
  (function waitShow() {
    var t0w = Date.now();
    var pre = document.getElementById("cdPre");
    (function check() {
      var veilGone = true;
      var p = document.getElementById("cdPre");
      if (p && p.isConnected && !p.classList.contains("done")) veilGone = false;
      var rowOp = 1;
      try { rowOp = parseFloat(getComputedStyle(row).opacity); } catch (e) {}
      if ((veilGone && rowOp >= 0.35) || Date.now() - t0w > 3600) {
        go();
        return;
      }
      setTimeout(check, 70);
    })();
    void pre;
  })();

  /* Gancho de QA: tiempos y estado internos verificables */
  window.CamiLogoFusion = {
    version: "23.0",
    T_COLLIDE: T_COLLIDE,
    T_DONE: T_DONE,
    state: function () {
      return {
        gate: html.classList.contains("lf-js"),
        go: html.classList.contains("lf-go"),
        boom: html.classList.contains("lf-boom"),
        done: html.classList.contains("lf-done"),
        canvasAlive: !!cv,
        particles: particles.length
      };
    }
  };
})();
