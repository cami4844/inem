(function() {
  const TOTAL_SLIDES = 20;
  const FIRST_SLIDE = "01-portada.html";
  const LAST_SLIDE = "20-cierre.html";

  function getQueryParam(name) {
    try { return new URL(window.location.href).searchParams.get(name); } catch(e) { return null; }
  }

  function buildBackURL() {
    const from = getQueryParam("from");
    if (!from) {
      const dir2 = window.location.pathname.split('/').slice(-2,-1)[0];
      if (dir2 === 'apps') return '../slides/17-redes.html';
      return "../index.html";
    }
    if (from.startsWith("../")) return from;
    const dir = window.location.pathname.split('/').slice(-2,-1)[0];
    // from calificado con carpeta (slides/xx.html, apps/xx.html, website/xx.html):
    // es relativo a la raíz del proyecto → subir un nivel si estamos en un subdirectorio
    if (from.includes("/")) return dir ? "../" + from : from;
    // from con nombre simple: es un slide
    if (dir === 'slides') return from;
    if (dir === 'apps' || dir === 'website') return '../slides/' + from;
    return from;
  }

  function appendFrom(url) {
    const from = getQueryParam("from");
    if (from && !url.includes("?")) return url + "?from=" + from;
    return url;
  }

  /* v25.1 FIX (bug preexistente): Home/End navegaban a
     "01-portada.html" / "20-cierre.html" tal cual — rutas relativas
     que SOLO funcionan dentro de slides/. Desde apps/ o website/
     daban 404 (apps/01-portada.html no existe). Este helper califica
     la ruta según la carpeta actual, igual que buildBackURL. */
  function slidesPath(file) {
    const dir = window.location.pathname.split('/').slice(-2,-1)[0];
    if (dir === 'slides') return file;
    if (dir === 'apps' || dir === 'website') return '../slides/' + file;
    return 'slides/' + file; /* raíz del proyecto (index.html) */
  }

  /* v25: LOGOS + X EN TODAS LAS NAVIGACIONES.
     Teclado y swipe antes hacian location.href directo y se
     saltaban la transicion colaborativa (solo los clicks la
     tenian). Ahora todo pasa por cdGo():
       · si window.CDGo existe (cine-depth.js activo), la cortina
         logos+X cubre la pantalla y navega a los 620ms
       · si NO existe (JS caido, reduced-motion), navegacion
         directa igual que siempre — failsafe intacto */
  function cdGo(url, dir) {
    const href = appendFrom(url);
    if (typeof window.CDGo === "function") {
      try { if (window.CDGo(new URL(href, window.location.href).href, dir)) return; } catch (e) {}
    }
    window.location.href = href;
  }

  /* v24 FIX CRÍTICO (bug WhatsApp): el chat falso usa contenteditable
     (un DIV), no INPUT/TEXTAREA — al escribir, espacio/teclas b,f,m
     navegaban de diapositiva. Defensa triple:
       1) target del evento editable (o dentro de un contenteditable)
       2) SELECT también bloqueado
       3) activeElement editable (navegadores que reportan body) */
  function isTypingTarget(el) {
    if (!el || !el.tagName) return false;
    var t = el.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return true;
    /* v25.4 FIX: VIDEO/AUDIO con foco (controles nativos) usan espacio y
       flechas para pausar/adelantar — la navegación NO debe secuestrarlas
       (antes: espacio para pausar te cambiaba de diapositiva). */
    if (t === "VIDEO" || t === "AUDIO") return true;
    if (el.isContentEditable) return true;
    try { if (el.closest && el.closest("[contenteditable]")) return true; } catch (e) {}
    return false;
  }

  function handleKeydown(e) {
    if (isTypingTarget(e.target)) return;
    var active = document.activeElement;
    if (active && active !== e.target && isTypingTarget(active)) return;
    if (document.querySelector(".wa-input:focus-within, [contenteditable]:focus")) return;
    if (document.querySelector(".lightbox-overlay.open")) {
      if (e.key === "Escape") { window.Lightbox?.close(); e.preventDefault(); }
      else if (e.key === "ArrowRight") { window.Lightbox?.next(); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { window.Lightbox?.prev(); e.preventDefault(); }
      else if (e.key === "+" || e.key === "=") { window.Lightbox?.toggleZoom(); e.preventDefault(); }
      return;
    }
    const body = document.body;
    const prev = body.dataset.prev;
    const next = body.dataset.next;
    switch (e.key) {
      case "ArrowRight": case " ": case "PageDown":
        e.preventDefault(); if (next) cdGo(next, "fwd"); break;
      case "ArrowLeft": case "PageUp":
        e.preventDefault(); if (prev) cdGo(prev, "back"); break;
      case "Home": e.preventDefault(); cdGo(slidesPath(FIRST_SLIDE), "up"); break;
      case "End": e.preventDefault(); cdGo(slidesPath(LAST_SLIDE), "fwd"); break;
      case "b": case "B":
        if (!e.ctrlKey && !e.metaKey) cdGo(buildBackURL(), "up"); break;
      case "Escape":
        const menu = document.querySelector(".side-menu.open");
        if (menu) { document.querySelector(".menu-button")?.classList.remove("open"); menu.classList.remove("open"); break; }
        if (document.fullscreenElement) document.exitFullscreen?.(); break;
      case "f": case "F":
        if (!e.ctrlKey && !e.metaKey) {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
          else document.exitFullscreen?.();
        } break;
      case "m": case "M":
        if (!e.ctrlKey && !e.metaKey) {
          document.querySelector(".menu-button")?.classList.toggle("open");
          document.querySelector(".side-menu")?.classList.toggle("open");
        } break;
      case "l": case "L":
        if (!e.ctrlKey && !e.metaKey) {
          const z = document.querySelector("img.zoomable");
          if (z && window.Lightbox) window.Lightbox.openFromElement(z);
        } break;
    }
  }

  let tX=0,tY=0,eX=0,eY=0;
  function handleTouchStart(e) { tX=e.changedTouches[0].screenX; tY=e.changedTouches[0].screenY; }
  function handleTouchEnd(e) {
    eX=e.changedTouches[0].screenX; eY=e.changedTouches[0].screenY;
    const dx=eX-tX, dy=eY-tY;
    if (Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)) {
      const body=document.body;
      if (dx<0 && body.dataset.next) cdGo(body.dataset.next, "fwd");
      else if (dx>0 && body.dataset.prev) cdGo(body.dataset.prev, "back");
    }
  }

  function init() {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("touchstart", handleTouchStart, {passive:true});
    document.addEventListener("touchend", handleTouchEnd, {passive:true});
    const slideNum = document.body.dataset.slideNum;
    if (slideNum) {
      const num = parseInt(slideNum,10);
      const fill = document.querySelector(".progress-fill");
      if (fill) fill.style.width = ((num/TOTAL_SLIDES)*100) + "%";
      document.querySelectorAll(".side-menu li a").forEach(l => { if (l.dataset.num === slideNum) l.classList.add("active"); });
    }
    let currentFrom = getQueryParam("from");
    if (!currentFrom) {
      // Calificar con la carpeta para que el "volver" funcione entre slides/apps/website
      const parts = window.location.pathname.split("/");
      const fn = parts.pop();
      const dir = parts.pop();
      if (fn && fn.endsWith(".html") && fn !== "index.html" && dir) {
        currentFrom = dir + "/" + fn;
      }
    }
    if (currentFrom) {
      const addFrom = (a) => {
        const h = a.getAttribute("href");
        if (!h || h.startsWith("http") || h.startsWith("#") || h.includes("?") || h.endsWith("index.html") || h.startsWith("https://wa.me") || h.startsWith("javascript:")) return;
        /* v25.8: el reproductor aislado y el archivo directo .mp4 van LIMPIOS
           (sin ?from) — son pestañas nuevas de video, no navegación de slides */
        if (h.includes("video-player.html") || h.split("?")[0].endsWith(".mp4")) return;
        a.setAttribute("href", h + "?from=" + currentFrom);
      };
      document.querySelectorAll(".side-menu a[href]").forEach(addFrom);
      document.querySelectorAll(".slide-bottombar a.btn-prev, .slide-bottombar a.btn-next").forEach(addFrom);
      document.querySelectorAll(".slide-main a[href]").forEach(addFrom);
      // También en apps (no solo slide-main) para que ?from= se preserve al navegar apps→website
      document.querySelectorAll("a[href]").forEach(addFrom);
    }
    document.querySelectorAll(".btn-back-origin, .back-link").forEach(b => b.setAttribute("href", buildBackURL()));
    // Asegurar que los botones de TikTok/IG siempre sean visibles y apunten a 17 si no hay from
    document.querySelectorAll(".app-container .btn").forEach(b => { if (b.textContent.includes("VOLVER")) b.style.visibility = "visible"; });
    console.log("[Navigation] Init OK.");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
