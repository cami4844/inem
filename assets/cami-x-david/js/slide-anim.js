/* ============================================================
   CAMI × DAVID — slide-anim.js  v4  (STANDALONE)
   Dispara animaciones reveal al cargar la página.
   ============================================================ */

(function() {
  function triggerAnimations() {
    const anims = document.querySelectorAll('.anim');
    if (!anims.length) return;

    anims.forEach((el) => {
      const variant = el.dataset.anim || 'fade-up';
      const delay = el.dataset.delay || '';

      el.classList.remove(
        'anim-fade-up', 'anim-fade-down', 'anim-fade-left', 'anim-fade-right',
        'anim-scale', 'anim-scale-pop', 'anim-blur', 'anim-fade',
        'anim-rotate', 'anim-flip-y', 'anim-slide-bottom'
      );

      void el.offsetWidth;

      if (delay) el.style.animationDelay = delay;

      el.classList.add(`anim-${variant}`);
    });
  }

  function enforceVisibility() {
    document.querySelectorAll(".anim").forEach((el) => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.05) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      }
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(triggerAnimations, 50));
    } else {
      setTimeout(triggerAnimations, 50);
    }

    setTimeout(enforceVisibility, 1500);
    setTimeout(enforceVisibility, 3500);

    window.SlideAnim = { triggerAnimations, enforceVisibility };
  }

  init();
})();
