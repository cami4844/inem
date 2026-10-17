/* ============================================================
   CAMI × DAVID — lightbox.js  v11  LEFT BAR
   Visor con controles a la izquierda, sin tapar imagen al zoom
   ============================================================ */

window.Lightbox = (function() {
  const state = {
    gallery: [],
    currentIndex: 0,
    scale: 1,
    x: 0, y: 0,
    dragging: false,
    startX: 0, startY: 0,
    overlay: null,
    stage: null,
    imageEl: null,
    captionEl: null,
    counterEl: null,
    bound: false,
  };
  const MIN_SCALE = 1;
  const MAX_SCALE = 3.5;
  const ZOOM_STEP = 0.32;

  function buildOverlay() {
    if (state.overlay) return;
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Visor de imagen");
    overlay.innerHTML = `
      <div class="lightbox-leftbar" aria-label="Controles">
        <button class="lb-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
        </button>
        <div class="lb-sep"></div>
        <div class="lb-counter"><span class="current">01</span> <span style="opacity:0.5">/</span> <span class="total">01</span></div>
        <div class="lb-sep"></div>
        <button class="lb-zoom-in" aria-label="Acercar"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <button class="lb-zoom-out" aria-label="Alejar"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <button class="lb-reset" aria-label="Ajustar"><svg viewBox="0 0 24 24"><path d="M3 9h4V5"/><path d="M21 15h-4v4"/><path d="M3 15h4v4"/><path d="M21 9h-4V5"/></svg></button>
        <div class="lb-sep"></div>
        <button class="lb-prev" aria-label="Anterior"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button class="lb-next" aria-label="Siguiente"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
      <div class="lightbox-stage"><img class="lightbox-image" alt="" draggable="false" /></div>
      <div class="lightbox-caption"></div>
      <div class="lightbox-hint">ESC CERRAR · ← → NAVEGAR · RUEDA ZOOM · ARRASTRA</div>
    `;
    document.body.appendChild(overlay);
    state.overlay = overlay;
    state.stage = overlay.querySelector(".lightbox-stage");
    state.imageEl = overlay.querySelector(".lightbox-image");
    state.captionEl = overlay.querySelector(".lightbox-caption");
    state.counterEl = overlay.querySelector(".lb-counter");

    overlay.querySelector(".lb-close").addEventListener("click", close);
    overlay.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); prev(); });
    overlay.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); next(); });
    overlay.querySelector(".lb-zoom-in").addEventListener("click", (e) => { e.stopPropagation(); zoomIn(); });
    overlay.querySelector(".lb-zoom-out").addEventListener("click", (e) => { e.stopPropagation(); zoomOut(); });
    overlay.querySelector(".lb-reset").addEventListener("click", (e) => { e.stopPropagation(); resetZoom(); });

    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    state.stage.addEventListener("click", (e) => { if (e.target === state.stage) close(); });

    state.imageEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.scale === 1) zoomIn();
      else resetZoom();
    });
    state.imageEl.addEventListener("dblclick", (e) => { e.preventDefault(); e.stopPropagation(); resetZoom(); });

    state.imageEl.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    state.stage.addEventListener("wheel", onWheel, { passive: false });
    state.imageEl.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  }

  function setupGlobalClickDelegation() {
    if (state.bound) return;
    state.bound = true;
    document.addEventListener("click", (e) => {
      // No abrir si click en botón o chip
      if (e.target.closest('button, .chip, .lightbox-leftbar')) return;
      const zoomableEl = e.target.closest("img.zoomable");
      if (!zoomableEl) return;
      e.stopPropagation();
      e.preventDefault();
      openFromElement(zoomableEl);
    });
    document.addEventListener("keydown", (e) => {
      if (!state.overlay || !state.overlay.classList.contains("open")) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomOut(); }
      else if (e.key === "0") { e.preventDefault(); resetZoom(); }
    });
  }

  function openFromElement(imgEl) {
    const galleryName = imgEl.dataset.lightboxGallery || "default";
    const allZoomables = document.querySelectorAll(`img.zoomable`);
    // Agrupar por galleryName si existe, si no todos
    let candidates = Array.from(allZoomables);
    if (galleryName !== "default") {
      const named = Array.from(document.querySelectorAll(`img.zoomable[data-lightbox-gallery="${galleryName}"]`));
      if (named.length) candidates = named;
    }
    const seen = new Set();
    state.gallery = [];
    candidates.forEach((img) => {
      const src = img.dataset.lightboxSrc || img.currentSrc || img.src;
      if (!src || seen.has(src)) return;
      seen.add(src);
      state.gallery.push({ src, alt: img.alt || "", caption: img.dataset.lightboxCaption || img.getAttribute("aria-label") || "" });
    });
    if (!state.gallery.length) return;
    const targetSrc = imgEl.dataset.lightboxSrc || imgEl.currentSrc || imgEl.src;
    state.currentIndex = state.gallery.findIndex((g) => g.src === targetSrc);
    if (state.currentIndex < 0) state.currentIndex = 0;
    buildOverlay();
    state.overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    resetTransform();
    show();
  }

  function show() {
    if (!state.gallery.length) return;
    const item = state.gallery[state.currentIndex];
    resetTransform();
    const tempImg = new Image();
    tempImg.onload = () => {
      state.imageEl.src = item.src;
      state.imageEl.alt = item.alt;
      state.imageEl.style.opacity = "0";
      requestAnimationFrame(() => {
        state.imageEl.style.transition = "opacity 0.32s ease";
        state.imageEl.style.opacity = "1";
      });
    };
    tempImg.onerror = () => { state.imageEl.alt = "Imagen no disponible"; state.imageEl.style.opacity = "1"; };
    tempImg.src = item.src;
    if (item.caption) { state.captionEl.innerHTML = item.caption; state.captionEl.style.display = "block"; }
    else state.captionEl.style.display = "none";
    const cur = state.counterEl.querySelector(".current");
    const tot = state.counterEl.querySelector(".total");
    cur.textContent = String(state.currentIndex + 1).padStart(2, "0");
    tot.textContent = String(state.gallery.length).padStart(2, "0");
    const prevBtn = state.overlay.querySelector(".lb-prev");
    const nextBtn = state.overlay.querySelector(".lb-next");
    prevBtn.disabled = state.currentIndex === 0;
    nextBtn.disabled = state.currentIndex === state.gallery.length - 1;
    [state.currentIndex-1, state.currentIndex+1].forEach(i => {
      if (i>=0 && i<state.gallery.length) { const im = new Image(); im.src = state.gallery[i].src; }
    });
  }

  function close() {
    if (!state.overlay) return;
    state.overlay.classList.remove("open","zoomed");
    document.body.style.overflow = "";
    resetTransform();
  }
  function next() { if (state.currentIndex < state.gallery.length - 1) { state.currentIndex++; resetTransform(); show(); } }
  function prev() { if (state.currentIndex > 0) { state.currentIndex--; resetTransform(); show(); } }

  function applyTransform() {
    state.imageEl.style.setProperty("--lb-scale", state.scale);
    state.imageEl.style.setProperty("--lb-x", state.x + "px");
    state.imageEl.style.setProperty("--lb-y", state.y + "px");
    state.overlay.classList.toggle("zoomed", state.scale > 1.01);
  }
  function resetTransform() { state.scale=1; state.x=0; state.y=0; applyTransform(); }
  function resetZoom() { state.scale=1; state.x=0; state.y=0; applyTransform(); state.imageEl.style.transition = "transform 0.42s cubic-bezier(0.16,1,0.3,1)"; setTimeout(()=> state.imageEl.style.transition="none", 460); }
  function zoomIn() { state.scale = Math.min(MAX_SCALE, state.scale + ZOOM_STEP); applyTransform(); }
  function zoomOut() { state.scale = Math.max(MIN_SCALE, state.scale - ZOOM_STEP); if (state.scale===1){ state.x=0; state.y=0;} applyTransform(); }
  function toggleZoom() { if (state.scale===1) zoomIn(); else resetZoom(); }

  function onWheel(e) {
    if (!state.overlay.classList.contains("open")) return;
    e.preventDefault();
    const delta = -e.deltaY;
    if (delta > 0) zoomIn(); else zoomOut();
  }
  function onDragStart(e) {
    if (state.scale <= 1.01) return;
    state.dragging = true;
    state.startX = e.clientX - state.x;
    state.startY = e.clientY - state.y;
    state.imageEl.style.transition = "none";
    e.preventDefault();
  }
  function onDragMove(e) {
    if (!state.dragging || state.scale <= 1.01) return;
    state.x = e.clientX - state.startX;
    state.y = e.clientY - state.startY;
    const limitX = (state.scale - 1) * 200;
    const limitY = (state.scale - 1) * 150;
    state.x = Math.max(-limitX, Math.min(limitX, state.x));
    state.y = Math.max(-limitY, Math.min(limitY, state.y));
    applyTransform();
  }
  function onDragEnd() { if (state.dragging) { state.dragging=false; state.imageEl.style.transition=""; } }

  let lastTouchDist = 0;
  function getTouchDist(touches){ const dx=touches[0].clientX-touches[1].clientX; const dy=touches[0].clientY-touches[1].clientY; return Math.hypot(dx,dy); }
  function onTouchStart(e){
    if (e.touches.length===1 && state.scale>1.01){ state.dragging=true; state.startX=e.touches[0].clientX - state.x; state.startY=e.touches[0].clientY - state.y; }
    else if (e.touches.length===2){ lastTouchDist=getTouchDist(e.touches); e.preventDefault(); }
  }
  function onTouchMove(e){
    if (e.touches.length===1 && state.dragging){ state.x = e.touches[0].clientX - state.startX; state.y = e.touches[0].clientY - state.startY; applyTransform(); }
    else if (e.touches.length===2){ const dist=getTouchDist(e.touches); if (lastTouchDist){ const diff=(dist-lastTouchDist)*0.009; state.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, state.scale + diff)); applyTransform(); } lastTouchDist=dist; e.preventDefault(); }
  }
  function onTouchEnd(e){ if (e.touches.length===0){ state.dragging=false; lastTouchDist=0; } }

  function init() { buildOverlay(); setupGlobalClickDelegation(); console.log("[Lightbox] v11 LEFT-BAR OK"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  return { openFromElement, close, next, prev, toggleZoom, zoomIn, zoomOut, resetZoom, getState: () => ({ ...state }) };
})();
