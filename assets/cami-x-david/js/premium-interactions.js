/* ============================================================
   PREMIUM INTERACTIONS — CAMI × DAVID / CAMORA × SUPER
   v1.0 (2026-08-22) — interacciones avanzadas, cero dependencias
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Ripple global en botones y enlaces ---------- */
  document.addEventListener('click', function (e) {
    var host = e.target.closest('.btn, .pa-ripple-host, button');
    if (!host || reduced) return;
    var r = host.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'pa-ripple';
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top = (e.clientY - r.top) + 'px';
    host.classList.add('pa-ripple-host');
    host.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 700);
  });

  /* ---------- 2. Botones magnéticos ---------- */
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.pa-magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });

    /* ---------- 3. Tilt 3D con glare ---------- */
    document.querySelectorAll('.pa-tilt').forEach(function (el) {
      if (!el.querySelector(':scope > .pa-glare')) {
        var g = document.createElement('div'); g.className = 'pa-glare'; el.appendChild(g);
      }
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--gx', px * 100 + '%');
        el.style.setProperty('--gy', py * 100 + '%');
        el.style.transform = 'perspective(800px) rotateY(' + (px - .5) * 12 + 'deg) rotateX(' + (.5 - py) * 10 + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- 4. Liquid hover coords ---------- */
  document.querySelectorAll('.pa-liquid').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- 5. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.pa-reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: .12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  // Failsafe: nada queda invisible más de 4s
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }, 4000);

  /* ---------- 6. Contadores animados ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.paCount || el.textContent.replace(/[^\d.]/g, '')) || 0;
    var dur = parseInt(el.dataset.paDur || '1400', 10);
    var suffix = el.dataset.paSuffix || '';
    if (reduced) { el.textContent = target + suffix; return; }
    var t0 = performance.now();
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var counters = document.querySelectorAll('[data-pa-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: .4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(animateCounter); }

  /* ---------- 7. Stagger de letras para títulos ---------- */
  document.querySelectorAll('[data-pa-letters]').forEach(function (el) {
    var text = el.textContent; el.setAttribute('aria-label', text); el.textContent = '';
    text.split('').forEach(function (ch, i) {
      var s = document.createElement('span');
      s.className = 'pa-letter'; s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = (i * 40) + 'ms';
      el.appendChild(s);
    });
  });

  /* ---------- 8. Doble-tap corazón (delegado: contenedores [data-pa-heart]) ---------- */
  document.addEventListener('click', function (e) {
    var zone = e.target.closest('[data-pa-heart]');
    if (!zone || reduced) return;
    var now = Date.now(), last = zone._lastTap || 0;
    zone._lastTap = now;
    if (now - last < 350) {
      var h = document.createElement('div');
      h.className = 'pa-heart-burst'; h.textContent = '\u2764';
      zone.appendChild(h);
      setTimeout(function () { h.remove(); }, 1050);
      haptic(20);
      zone.dispatchEvent(new CustomEvent('pa:heartburst'));
    }
  });

  /* ---------- 9. Haptic feedback (vibración móvil) ---------- */
  function haptic(ms) { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (_) {} }
  window.paHaptic = haptic;

  /* ---------- 10. Confetti burst ---------- */
  var PA_COLORS = ['#7c3aed', '#06b6d4', '#ec4899', '#f59e0b', '#22c55e'];
  window.paConfetti = function (count) {
    if (reduced) return;
    count = count || 60;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('i');
      p.className = 'pa-confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = PA_COLORS[i % PA_COLORS.length];
      p.style.setProperty('--cx', (Math.random() * 200 - 100) + 'px');
      p.style.setProperty('--cdur', (1.8 + Math.random() * 1.6) + 's');
      p.style.width = (6 + Math.random() * 8) + 'px';
      p.style.height = (10 + Math.random() * 10) + 'px';
      document.body.appendChild(p);
      setTimeout(function (node) { return function () { node.remove(); }; }(p), 3600);
    }
  };

  /* ---------- 11. Toasts ---------- */
  window.paToast = function (msg, ms) {
    ms = ms || 2200;
    var t = document.createElement('div');
    t.className = 'pa-toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('pa-toast--out'); }, ms);
    setTimeout(function () { t.remove(); }, ms + 400);
  };

  /* ---------- 12. Copiar al portapapeles ---------- */
  window.paCopy = function (text, msg) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(function () { window.paToast(msg || 'Copiado \u2713'); })
      .catch(function () { window.paToast('No se pudo copiar'); });
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-pa-copy]');
    if (el) window.paCopy(el.dataset.paCopy, el.dataset.paMsg);
  });

  /* ---------- 13. Swipe gestures (contenedores [data-pa-swipe]) ---------- */
  document.querySelectorAll('[data-pa-swipe]').forEach(function (zone) {
    var sx = 0, sy = 0, active = false;
    zone.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; active = true;
    }, { passive: true });
    zone.addEventListener('touchend', function (e) {
      if (!active) return; active = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 48 && Math.abs(dy) < 48) return;
      var dir;
      if (Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? 'right' : 'left';
      else dir = dy > 0 ? 'down' : 'up';
      zone.dispatchEvent(new CustomEvent('pa:swipe', { detail: dir }));
    }, { passive: true });
  });

  /* ---------- 14. Atajos de teclado globales ---------- */
  document.addEventListener('keydown', function (e) {
    /* v24: no despachar atajos mientras el usuario escribe
       (chat de WhatsApp usa contenteditable — bug corregido) */
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'Escape') document.dispatchEvent(new CustomEvent('pa:escape'));
  });

})();
