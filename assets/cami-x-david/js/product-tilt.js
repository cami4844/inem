/* ============================================================
   CAMI × DAVID — product-tilt.js  v1.0
   Experiencia de la pieza en slides 07-16:
   - Tilt 3D suave del marco con la imagen como protagonista
   - Luz ambiental que sigue al cursor dentro del marco
   - Botón AMPLIAR elegante → abre el lightbox real
   Optimizado: rect cacheado por entrada, solo transform,
   un solo rAF por frame, inactivo en táctil/reduced-motion.
   ============================================================ */
(function() {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COARSE = window.matchMedia("(pointer: coarse)").matches;

  function init() {
    const stages = document.querySelectorAll(".product-stage");
    stages.forEach(stage => {
      if (stage.dataset.ptInit) return;
      stage.dataset.ptInit = "1";

      const img = stage.querySelector("img.zoomable");

      // Luz ambiental que sigue al cursor (variables CSS, sin layout)
      if (!COARSE && !REDUCED) {
        let rect = null, raf = null, px = 50, py = 50;
        const light = document.createElement("div");
        light.className = "product-spotlight";
        stage.prepend(light);

        stage.addEventListener("mouseenter", () => { rect = stage.getBoundingClientRect(); }, { passive: true });
        stage.addEventListener("mousemove", (e) => {
          if (!rect) rect = stage.getBoundingClientRect();
          px = ((e.clientX - rect.left) / rect.width) * 100;
          py = ((e.clientY - rect.top) / rect.height) * 100;
          if (raf) return;
          raf = requestAnimationFrame(() => {
            stage.style.setProperty("--spot-x", px.toFixed(1) + "%");
            stage.style.setProperty("--spot-y", py.toFixed(1) + "%");
            raf = null;
          });
        }, { passive: true });
        stage.addEventListener("mouseleave", () => {
          rect = null;
          stage.style.setProperty("--spot-x", "50%");
          stage.style.setProperty("--spot-y", "42%");
        }, { passive: true });

        // Tilt 3D suave (reutiliza el mismo rect cacheado)
        let traf = null;
        stage.addEventListener("mousemove", (e) => {
          if (!rect) rect = stage.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          if (traf) return;
          traf = requestAnimationFrame(() => {
            stage.style.setProperty("--tilt-rx", (ny * -3.4).toFixed(2) + "deg");
            stage.style.setProperty("--tilt-ry", (nx * 3.4).toFixed(2) + "deg");
            if (img) img.style.setProperty("--img-float",
              (nx * -10).toFixed(1) + "px," + (ny * -8).toFixed(1) + "px,0");
            traf = null;
          });
        }, { passive: true });
        stage.addEventListener("mouseleave", () => {
          stage.style.setProperty("--tilt-rx", "0deg");
          stage.style.setProperty("--tilt-ry", "0deg");
          if (img) img.style.setProperty("--img-float", "0px,0px,0");
        }, { passive: true });
      }

      // Boton AMPLIAR -> lightbox real (nunca un boton muerto)
      const btn = stage.querySelector(".btn-ampliar");
      if (btn && img) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.Lightbox) window.Lightbox.openFromElement(img);
        });
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
