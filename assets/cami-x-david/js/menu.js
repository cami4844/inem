/* ============================================================
   CAMI × DAVID — menu.js
   Toggle del side menu. Standalone, sin dependencias.
   ============================================================ */

(function() {
  function init() {
    const menuBtn = document.querySelector(".menu-button");
    const sideMenu = document.querySelector(".side-menu");

    if (!menuBtn || !sideMenu) {
      console.log("[Menu] No se encontró .menu-button o .side-menu");
      return;
    }

    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      sideMenu.classList.toggle("open");
    });

    // Click fuera del menu → cerrar
    document.addEventListener("click", (e) => {
      if (sideMenu.classList.contains("open") &&
          !sideMenu.contains(e.target) &&
          !menuBtn.contains(e.target)) {
        menuBtn.classList.remove("open");
        sideMenu.classList.remove("open");
      }
    });

    // Click en un link del menu → navegar (es <a href> real, no necesita JS, pero cerramos el menu)
    sideMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("open");
        sideMenu.classList.remove("open");
      });
    });

    console.log("[Menu] Init OK.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
