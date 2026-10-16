/* ============================================================
   INENSENA — motor de la página (sin dependencias externas)
   GSAP + ScrollTrigger van incrustados en assets/js para que
   funcione con doble clic y sin internet. Si algo fallara, la
   red de seguridad deja TODO visible y todo funcionando.
   ============================================================ */
(function () {
  "use strict";

  var reduceMov = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hayGSAP = !!(window.gsap && typeof window.gsap.to === "function" && typeof window.gsap.fromTo === "function");
  if (hayGSAP && typeof window.ScrollTrigger === "undefined") { hayGSAP = false; }

  /* ============ 1. BARRA DE PROGRESO DE LECTURA ============ */
  var progreso = document.getElementById("progreso");
  var progresoPend = false;
  var hudTc = document.getElementById("hud-tc");
  function pintaProgreso() {
    var alto = document.documentElement.scrollHeight - innerHeight;
    var avance = alto > 0 ? (scrollY / alto) : 0;
    progreso.style.transform = "scaleX(" + Math.min(1, Math.max(0, avance)) + ")";
    if (hudTc) {
      var seg = Math.round(Math.min(1, Math.max(0, avance)) * 150);
      hudTc.textContent = ("0" + Math.floor(seg / 60)).slice(-2) + ":" + ("0" + (seg % 60)).slice(-2);
    }
    progresoPend = false;
  }
  addEventListener("scroll", function () {
    if (!progresoPend) { progresoPend = true; requestAnimationFrame(pintaProgreso); }
  }, { passive: true });
  pintaProgreso();

  /* ============ 2. CHIP ACTIVO DEL MENÚ ============ */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".nav__chips a"));
  var secciones = chips
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);
  var hudEsc = document.getElementById("hud-esc");
  function pintaActivo(id) {
    chips.forEach(function (a) {
      a.classList.toggle("activo", a.getAttribute("href") === "#" + id);
      if (hudEsc && a.getAttribute("href") === "#" + id) { hudEsc.textContent = a.textContent; }
    });
  }
  if ("IntersectionObserver" in window && secciones.length) {
    var ioNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { pintaActivo(e.target.id); }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secciones.forEach(function (s) { ioNav.observe(s); });
  }

  /* ============ 3. ANIMACIONES (GSAP local + red de seguridad) ============
     Nada se esconde desde el CSS: GSAP anima "desde" un estado, así que
     sin JS o con GSAP roto la página se ve completa de una vez. */
  var revelados = new WeakSet();

  function marcaRevelado(el) { revelados.add(el); }

  if (hayGSAP && !reduceMov) {
    gsap.registerPlugin(ScrollTrigger);

    /* — Hero: entrada de cine — */
    var titulo = document.getElementById("hero-titulo");
    if (titulo) {
      var texto = titulo.textContent;
      titulo.setAttribute("aria-label", texto);
      titulo.textContent = "";
      texto.split("").forEach(function (letra) {
        var s = document.createElement("span");
        s.className = "hero__letra";
        s.textContent = letra === " " ? "\u00A0" : letra;
        s.setAttribute("aria-hidden", "true");
        titulo.appendChild(s);
      });
      gsap.from("#hero-titulo .hero__letra", {
        y: 90, opacity: 0, rotateX: -50,
        duration: 1, stagger: 0.07, ease: "back.out(1.6)", delay: 0.25,
        clearProps: "transform,opacity"
      });
    }
    gsap.from("#hero-hud", { y: -26, opacity: 0, duration: .8, ease: "power3.out", delay: .1 });
    gsap.from("#hero-sub", { y: 26, opacity: 0, duration: .9, ease: "power3.out", delay: .75 });
    gsap.from("#hero-autores span", { y: 30, opacity: 0, scale: .85, duration: .7, stagger: .12, ease: "back.out(1.8)", delay: .95 });
    gsap.from("#hero-nota", { y: 24, opacity: 0, duration: .9, ease: "power3.out", delay: 1.25 });
    gsap.from("#hero-cta a", { y: 26, opacity: 0, scale: .9, duration: .7, stagger: .14, ease: "back.out(1.7)", delay: 1.45 });
    gsap.from(".hero__flecha", { opacity: 0, duration: 1, delay: 1.9 });
    gsap.from(".hero__flotante", {
      scale: 0, opacity: 0, rotate: 40,
      duration: 1.1, stagger: .12, ease: "back.out(1.9)", delay: .55,
      clearProps: "opacity,visibility"
    });

    /* — Flotantes: respiración + paralaje con el mouse — */
    var flotantes = Array.prototype.slice.call(document.querySelectorAll(".hero__flotante"));
    flotantes.forEach(function (f, i) {
      gsap.to(f, {
        y: (i % 2 === 0 ? -18 : 16),
        duration: 2.6 + i * 0.4,
        yoyo: true, repeat: -1, ease: "sine.inOut"
      });
    });
    if (window.matchMedia("(hover: hover)").matches) {
      var movidos = flotantes.map(function (f) {
        return {
          x: gsap.quickTo(f, "x", { duration: .9, ease: "power3.out" }),
          y2: gsap.quickTo(f, "y", { duration: .9, ease: "power3.out" }),
          depth: parseFloat(f.getAttribute("data-depth") || "20")
        };
      });
      document.getElementById("inicio").addEventListener("mousemove", function (e) {
        var cx = (e.clientX / innerWidth - .5);
        var cy = (e.clientY / innerHeight - .5);
        movidos.forEach(function (m) {
          m.x(cx * m.depth);
          m.y2(cy * m.depth * .6);
        });
      }, { passive: true });
    }

    /* — Revelados al hacer scroll — */
    Array.prototype.slice.call(document.querySelectorAll("[data-anim]")).forEach(function (el, i) {
      var tipo = el.getAttribute("data-anim");
      var vars = {
        scrollTrigger: { trigger: el, start: "top 88%", once: true, onEnter: function () { marcaRevelado(el); } }
      };
      if (tipo === "pop") {
        gsap.from(el, Object.assign(vars, {
          scale: .82, opacity: 0, y: 30, duration: .9, ease: "back.out(1.6)", clearProps: "transform"
        }));
      } else if (tipo === "plano") {
        var lado = parseFloat(el.getAttribute("data-lado") || "1");
        gsap.from(el, Object.assign(vars, {
          x: 90 * lado, opacity: 0, rotate: lado * 3, duration: .85, ease: "power3.out", clearProps: "transform"
        }));
      } else if (tipo === "fin") {
        gsap.from(el, Object.assign(vars, {
          scale: 2.6, opacity: 0, rotate: -18, duration: .55, ease: "power4.in", clearProps: "transform"
        }));
      } else {
        gsap.from(el, Object.assign(vars, {
          y: 44, opacity: 0, duration: .9, ease: "power3.out", clearProps: "transform"
        }));
      }
    });

  } else {
    /* Sin GSAP o con movimiento reducido: todo visible, cero estados ocultos */
    Array.prototype.slice.call(document.querySelectorAll("[data-anim]")).forEach(marcaRevelado);
  }

  /* Red de seguridad: a los 4 s, todo lo que esté en pantalla y no se
     haya animado (o cuyo trigger fallara) se limpia a estado natural. */
  setTimeout(function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-anim]")).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!revelados.has(el) && r.top < innerHeight && r.bottom > 0) {
        if (hayGSAP) { gsap.set(el, { clearProps: "all" }); }
        marcaRevelado(el);
      }
    });
  }, 4000);

  /* ============ 4. LIGHTBOX DE LA GALERÍA ============ */
  var piezas = Array.prototype.slice.call(document.querySelectorAll(".pieza"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbTitulo = document.getElementById("lightbox-titulo");
  var lbEtiqueta = document.getElementById("lightbox-etiqueta");
  var indice = 0;

  function abreLightbox(i) {
    indice = (i + piezas.length) % piezas.length;
    var p = piezas[indice];
    var img = p.querySelector("img");
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt") || "";
    lbTitulo.textContent = p.getAttribute("data-titulo") || "";
    lbEtiqueta.textContent = p.getAttribute("data-etiqueta") || "";
    lbEtiqueta.className = "etiqueta " + (p.getAttribute("data-clase-et") || "");
    lb.classList.add("abierto");
    document.body.style.overflow = "hidden";
    if (hayGSAP && !reduceMov) {
      gsap.fromTo("#lightbox .lightbox__caja", { scale: .84, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: .5, ease: "back.out(1.6)" });
      gsap.fromTo("#lightbox .lightbox__nav, #lightbox .lightbox__btn", { opacity: 0 },
        { opacity: 1, duration: .4, delay: .15 });
    }
  }
  function cierraLightbox() {
    lb.classList.remove("abierto");
    document.body.style.overflow = "";
  }

  piezas.forEach(function (p, i) {
    p.addEventListener("click", function () { abreLightbox(i); });
  });
  document.getElementById("lightbox-cerrar").addEventListener("click", cierraLightbox);
  document.getElementById("lightbox-ant").addEventListener("click", function () { abreLightbox(indice - 1); });
  document.getElementById("lightbox-sig").addEventListener("click", function () { abreLightbox(indice + 1); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) { cierraLightbox(); }
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("abierto")) { return; }
    if (e.key === "Escape") { cierraLightbox(); }
    if (e.key === "ArrowLeft") { abreLightbox(indice - 1); }
    if (e.key === "ArrowRight") { abreLightbox(indice + 1); }
  });

  /* ============ 5. ABECEDARIO COMPLETO DE LAS FUENTES (ver, no descargar) ============ */
  var modalFuente = document.getElementById("modal-fuente");
  var mfTitulo = document.getElementById("mf-titulo");
  var mfTexto = document.getElementById("mf-texto");
  var mfNota = document.getElementById("mf-nota");
  var FILAS = {
    trad: "ABCDEFG<br>HIJKLMN<br>OPQRSTU<br>VWXYZ<br>abcdefg<br>hijklmn<br>opqrstu<br>vwxyz<br>012345<br>6789<br>!?.,:;<br>()+*-#%&=@",
    got: "ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>abcdefghijklm<br>nopqrstuvwxyz<br>0123456789<br>!?.,:;()<br>+*-#%&=@"
  };
  function abreFuente(clave) {
    if (clave === "trad") {
      mfTitulo.textContent = "Fuente «cami» tradicional — abecedario completo";
      mfNota.textContent = "Diseño en mosaico construido punto a punto en FontStruct.";
    } else {
      mfTitulo.textContent = "Fuente «cami» temática gótica — abecedario completo";
      mfNota.textContent = "Letras góticas con carácter medieval, trazo a trazo. Nota honesta: en el archivo .ttf que exporta FontStruct, la m minúscula salió dibujada igual a la n; tu diseño original sí la distingue (mira la captura). La M mayúscula está perfecta.";
    }
    mfTexto.className = "modal-fuente__texto modal-fuente__texto--" + clave;
    mfTexto.innerHTML = FILAS[clave] || "";
    modalFuente.classList.add("abierto");
    document.body.style.overflow = "hidden";
    if (hayGSAP && !reduceMov) {
      gsap.fromTo("#modal-fuente .modal-fuente__caja", { scale: .85, opacity: 0, y: 26 },
        { scale: 1, opacity: 1, y: 0, duration: .5, ease: "back.out(1.6)" });
    }
  }
  function cierraFuente() {
    modalFuente.classList.remove("abierto");
    document.body.style.overflow = "";
  }
  Array.prototype.slice.call(document.querySelectorAll("[data-fuente]")).forEach(function (b) {
    b.addEventListener("click", function () { abreFuente(b.getAttribute("data-fuente")); });
  });
  document.getElementById("mf-cerrar").addEventListener("click", cierraFuente);
  modalFuente.addEventListener("click", function (e) {
    if (e.target === modalFuente) { cierraFuente(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalFuente.classList.contains("abierto")) { cierraFuente(); }
  });

  /* ============ 6. VISOR DE PDF (PDF.js local) ============ */
  var visor = document.getElementById("visor");
  var lienzo = document.getElementById("visor-lienzo");
  var canvas = document.getElementById("pdf-canvas");
  var visorTitulo = document.getElementById("visor-titulo");
  var visorEnlace = document.getElementById("visor-enlace");
  var visorEstado = document.getElementById("visor-estado");
  var rotuloPagina = document.getElementById("pdf-pagina");
  var rotuloZoom = document.getElementById("pdf-zoom");
  var pdfjsListo = false;
  var pdfDoc = null;
  var paginaActual = 1;
  var zoomIdx = 1;
  var ZOOMS = [0.75, 1, 1.35, 1.75, 2.25];
  var tareaRender = null;

  function cargaScript(src, alTerminar) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = function () { alTerminar(null); };
    s.onerror = function () { alTerminar("No se pudo cargar " + src); };
    document.head.appendChild(s);
  }

  function bytesDeBase64(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i); }
    return bytes;
  }

  function renderizaPagina() {
    if (!pdfDoc) { return; }
    var num = pdfDoc.numPages;
    paginaActual = Math.min(Math.max(paginaActual, 1), num);
    document.getElementById("pdf-ant").disabled = paginaActual <= 1;
    document.getElementById("pdf-sig").disabled = paginaActual >= num;
    rotuloPagina.textContent = "Página " + paginaActual + " de " + num;
    rotuloZoom.textContent = Math.round(ZOOMS[zoomIdx] * 100) + "%";
    visorEstado.textContent = "Renderizando página…";
    if (tareaRender) { tareaRender.cancel(); tareaRender = null; }
    pdfDoc.getPage(paginaActual).then(function (pagina) {
      var base = lienzo.clientWidth - 48;
      var vp1 = pagina.getViewport({ scale: 1 });
      var escala = Math.max(0.3, (base / vp1.width)) * ZOOMS[zoomIdx];
      var vp = pagina.getViewport({ scale: escala });
      var ctx = canvas.getContext("2d");
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      tareaRender = pagina.render({ canvasContext: ctx, viewport: vp });
      tareaRender.promise.then(function () {
        tareaRender = null;
        visorEstado.textContent = "";
      }).catch(function () { /* render cancelado por otro cambio de pagina */ });
    });
  }

  function abreDocumento(clave, ruta, titulo) {
    visorTitulo.textContent = titulo;
    visorEnlace.href = ruta;
    visor.classList.add("abierto");
    document.body.style.overflow = "hidden";
    visorEstado.textContent = "Cargando el documento…";
    canvas.width = 0; canvas.height = 0;
    if (hayGSAP && !reduceMov) {
      gsap.fromTo("#visor", { opacity: 0 }, { opacity: 1, duration: .3 });
    }

    function conDatos() {
      var datos = bytesDeBase64(window.DATOS_PDF[clave]);
      pdfjsLib.getDocument({ data: datos }).promise.then(function (doc) {
        pdfDoc = doc;
        paginaActual = 1;
        zoomIdx = 1;
        renderizaPagina();
      }).catch(function () {
        visorEstado.textContent = "No se pudo abrir el documento: usa «Abrir en pestaña nueva».";
      });
    }
    function conLibreria() {
      if (window.DATOS_PDF && window.DATOS_PDF[clave]) { conDatos(); return; }
      cargaScript("assets/pdf/datos-" + clave + ".js", function (err) {
        if (err) { visorEstado.textContent = "No se pudo cargar el documento."; return; }
        conDatos();
      });
    }
    if (!pdfjsListo) {
      visorEstado.textContent = "Preparando el visor por primera vez…";
      cargaScript("assets/pdf/pdf.min.js", function (err) {
        if (err || !window.pdfjsLib) { visorEstado.textContent = "No se pudo preparar el visor."; return; }
        pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf/pdf.worker.min.js";
        pdfjsListo = true;
        conLibreria();
      });
    } else {
      conLibreria();
    }
  }

  function cierraVisor() {
    if (tareaRender) { tareaRender.cancel(); tareaRender = null; }
    if (pdfDoc) { pdfDoc.destroy(); pdfDoc = null; }
    visor.classList.remove("abierto");
    canvas.width = 0; canvas.height = 0;
    document.body.style.overflow = "";
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-pdf]")).forEach(function (b) {
    b.addEventListener("click", function () {
      abreDocumento(b.getAttribute("data-clave"), b.getAttribute("data-pdf"), b.getAttribute("data-titulo") || "Documento");
    });
  });
  document.getElementById("visor-cerrar").addEventListener("click", cierraVisor);
  visor.addEventListener("click", function (e) {
    if (e.target === visor) { cierraVisor(); }
  });
  document.getElementById("pdf-ant").addEventListener("click", function () { paginaActual--; renderizaPagina(); });
  document.getElementById("pdf-sig").addEventListener("click", function () { paginaActual++; renderizaPagina(); });
  document.getElementById("pdf-mas").addEventListener("click", function () { if (zoomIdx < ZOOMS.length - 1) { zoomIdx++; renderizaPagina(); } });
  document.getElementById("pdf-menos").addEventListener("click", function () { if (zoomIdx > 0) { zoomIdx--; renderizaPagina(); } });
  document.addEventListener("keydown", function (e) {
    if (!visor.classList.contains("abierto")) { return; }
    if (e.key === "Escape") { cierraVisor(); }
    if (e.key === "ArrowLeft") { paginaActual--; renderizaPagina(); }
    if (e.key === "ArrowRight") { paginaActual++; renderizaPagina(); }
  });

  /* ============ 7. CAMI X DE VILLA: visor bajo demanda ============ */
  var btnEmbed = document.getElementById("btn-embed");
  var hueco = document.getElementById("estrella-hueco");
  var nota = document.getElementById("estrella-nota");
  if (btnEmbed && hueco) {
    btnEmbed.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.setAttribute("title", "Página completa de la productora Cami X de Villa");
      iframe.setAttribute("loading", "lazy");
      iframe.src = "assets/cami-x-villa/index.html";
      hueco.innerHTML = "";
      if (hayGSAP && !reduceMov) {
        var carga = document.createElement("div");
        carga.className = "cargando-marco";
        carga.textContent = "PREPARANDO LA FUNCIÓN...";
        hueco.appendChild(carga);
        iframe.addEventListener("load", function () {
          if (carga.parentNode) { carga.remove(); }
          gsap.from(iframe, { opacity: 0, scale: .96, duration: .8, ease: "power3.out", clearProps: "transform,opacity" });
        });
      }
      hueco.appendChild(iframe);
      nota.hidden = false;
      btnEmbed.disabled = true;
      btnEmbed.textContent = "Visor cargado abajo";
      if (hayGSAP && !reduceMov) {
        gsap.from(hueco, { opacity: 0, y: 30, duration: .8, ease: "power3.out", clearProps: "transform,opacity" });
      }
    });
  }

  /* ============ 8. TOQUES DE ESTRENO ============ */

  /* — Apertura de película: barras letterbox + contador de leader — */
  var leader = document.getElementById("hero-leader");
  var barraSup = document.querySelector(".hero__barra--sup");
  var barraInf = document.querySelector(".hero__barra--inf");
  if (leader && barraSup && hayGSAP && !reduceMov) {
    try {
      gsap.set(barraSup, { yPercent: -102 });
      if (barraInf) { gsap.set(barraInf, { yPercent: 102 }); }
      var numL = document.getElementById("leader-num");
      var arco = document.getElementById("leader-arco");
      var tl = gsap.timeline();
      tl.to([barraSup, barraInf], { yPercent: 0, duration: .4, ease: "power2.out" }, .15)
        .fromTo(leader, { opacity: 0 }, { opacity: 1, duration: .2 }, .45);
      if (arco) {
        tl.fromTo(arco, { strokeDashoffset: 339 }, { strokeDashoffset: 0, duration: 1.45, ease: "none" }, .5);
      }
      [3, 2, 1].forEach(function (n, i) {
        tl.call(function () {
          if (numL) {
            numL.textContent = n;
            gsap.fromTo(numL, { scale: 1.4, opacity: .35 }, { scale: 1, opacity: 1, duration: .3, ease: "power2.out" });
          }
        }, null, .55 + i * .48);
      });
      tl.to(leader, { opacity: 0, duration: .25 }, 2.0)
        .to([barraSup, barraInf], { yPercent: (barraInf ? [-102, 102] : -102), duration: .55, ease: "power2.inOut" }, 2.05)
        .set(leader, { display: "none" });
    } catch (e) { /* la funcion abre igual sin la animacion */ }
  }

  /* — Claquetas que aplauden al entrar cada escena — */
  if (hayGSAP && !reduceMov) {
    Array.prototype.slice.call(document.querySelectorAll(".claqueta")).forEach(function (c) {
      var brazo = c.querySelector(".claqueta__brazo");
      if (!brazo) { return; }
      gsap.from(brazo, {
        rotation: -34, duration: .55, ease: "bounce.out", transformOrigin: "6% 100%",
        scrollTrigger: { trigger: c, start: "top 82%", once: true }
      });
    });
  }

  /* — Foco que sigue el cursor en el hero — */
  var foco = document.getElementById("hero-foco");
  var heroSec = document.getElementById("inicio");
  if (foco && heroSec) {
    heroSec.addEventListener("mousemove", function (e) {
      foco.style.setProperty("--mx", (e.clientX / innerWidth * 100).toFixed(2) + "%");
      foco.style.setProperty("--my", (e.clientY / innerHeight * 100).toFixed(2) + "%");
    }, { passive: true });
  }

  /* — Cursor mirilla de camara (solo mouse fino, nunca en tactil) — */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMov) {
    var puntoC = document.createElement("div");
    var anilloC = document.createElement("div");
    puntoC.className = "cursor-punto";
    anilloC.className = "cursor-anillo";
    document.body.appendChild(puntoC);
    document.body.appendChild(anilloC);
    document.body.classList.add("cursor-vivo");
    var cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
    addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      puntoC.style.transform = "translate(" + cx + "px," + cy + "px)";
      puntoC.classList.add("on");
      anilloC.classList.add("on");
    }, { passive: true });
    (function sigue() {
      rx += (cx - rx) * .16; ry += (cy - ry) * .16;
      anilloC.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)" +
        (anilloC.classList.contains("crece") ? " rotate(45deg)" : "");
      requestAnimationFrame(sigue);
    })();
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      anilloC.classList.toggle("crece", !!(t.closest && t.closest("a, button, input, .pieza")));
    });
  }

  /* — Lupa de pixeles en la fruta del dragon — */
  var lupa = document.getElementById("lupa-fruta");
  if (lupa && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var imgL = lupa.querySelector("img");
    var lente = lupa.querySelector(".lupa__lente");
    if (imgL && lente) {
      var LZ = 2.6, LL = 210;
      imgL.addEventListener("mousemove", function (e) {
        var r = imgL.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        if (x < 0 || y < 0 || x > r.width || y > r.height) { lupa.classList.remove("lupa--activa"); return; }
        lupa.classList.add("lupa--activa");
        lente.style.backgroundImage = 'url("' + (imgL.currentSrc || imgL.src) + '")';
        lente.style.backgroundSize = (r.width * LZ) + "px " + (r.height * LZ) + "px";
        lente.style.left = (x - LL / 2) + "px";
        lente.style.top = (y - LL / 2) + "px";
        lente.style.backgroundPosition = (-(x * LZ - LL / 2)) + "px " + (-(y * LZ - LL / 2)) + "px";
      }, { passive: true });
      imgL.addEventListener("mouseleave", function () { lupa.classList.remove("lupa--activa"); });
    }
  }

  /* — Prueba en vivo de las fuentes: escribes y lo ves al instante — */
  Array.prototype.slice.call(document.querySelectorAll("[data-prueba]")).forEach(function (inp) {
    var out = document.querySelector('[data-out="' + inp.getAttribute("data-prueba") + '"]');
    if (!out) { return; }
    function pinta() {
      var v = inp.value.replace(/\s+/g, " ");
      out.textContent = v === "" ? "..." : v;
    }
    inp.addEventListener("input", pinta);
    pinta();
  });

  /* ============ 9. NADA QUIETO: fondo vivo, choque y scroll ============ */
  if (hayGSAP && !reduceMov) {

    /* — Chispas que titilan: aparecen y desaparecen — */
    function siembraChispas(contenedor, cuantas) {
      if (!contenedor) { return; }
      for (var i = 0; i < cuantas; i++) {
        var chispa = document.createElement("i");
        chispa.style.left = (Math.random() * 100) + "%";
        chispa.style.top = (Math.random() * 100) + "%";
        var t = 2 + Math.random() * 3;
        chispa.style.width = chispa.style.height = t.toFixed(1) + "px";
        contenedor.appendChild(chispa);
        gsap.to(chispa, {
          opacity: .9, scale: 1 + Math.random(),
          duration: .6 + Math.random() * 1.6,
          delay: Math.random() * 2.5,
          repeat: -1, yoyo: true, ease: "sine.inOut"
        });
      }
    }
    siembraChispas(document.getElementById("estrellas-hero"), 42);
    siembraChispas(document.getElementById("estrellas-pie"), 30);

    /* — Sprites del fondo: aparecen y desaparecen suavemente — */
    Array.prototype.slice.call(document.querySelectorAll(".fondo-sprites img")).forEach(function (im) {
      gsap.to(im, {
        opacity: .06, duration: 2.2 + Math.random() * 2.2,
        delay: Math.random() * 2, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
    });

    /* — Choque estilo intro de videojuego: caballero contra hamburguesa — */
    var cab = document.querySelector(".hero__flotante--1");
    var ham = document.querySelector(".hero__flotante--2");
    var heroChoque = document.getElementById("inicio");
    if (cab && ham && heroChoque) {
      setTimeout(function () {
        var rC = cab.getBoundingClientRect(), rH = ham.getBoundingClientRect(), rHero = heroChoque.getBoundingClientRect();
        var centroX = rHero.left + rHero.width / 2;
        var dxC = centroX - (rC.left + rC.width / 2) - 60;
        var dxH = centroX - (rH.left + rH.width / 2) + 60;
        gsap.timeline()
          .to(cab, { x: "+=" + dxC, rotation: -16, duration: .55, ease: "power2.in" }, 0)
          .to(ham, { x: "+=" + dxH, rotation: 16, duration: .55, ease: "power2.in" }, 0)
          .add(function () {
            var golpe = document.createElement("div");
            golpe.className = "golpe";
            golpe.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#F2B01E" d="M12 1l2.6 7.1L22 10l-7.4 1.9L12 19l-2.6-7.1L2 10l7.4-1.9z"/></svg>';
            golpe.style.left = (centroX - rHero.left) + "px";
            golpe.style.top = ((rC.top + rC.height / 2) - rHero.top) + "px";
            heroChoque.appendChild(golpe);
            gsap.fromTo(golpe, { scale: .2, opacity: 1, rotate: -40 }, {
              scale: 2.6, opacity: 0, rotate: 30, duration: .7, ease: "power2.out",
              onComplete: function () { golpe.remove(); }
            });
            gsap.fromTo(heroChoque, { x: -9 }, { x: 9, duration: .06, repeat: 5, yoyo: true, ease: "none", clearProps: "x" });
          })
          .to(cab, { x: "-=" + dxC, rotation: -8, duration: .9, ease: "elastic.out(1, .45)" }, .7)
          .to(ham, { x: "-=" + dxH, rotation: 7, duration: .9, ease: "elastic.out(1, .45)" }, .7);
      }, 3400);
    }

    /* — Animaciones atadas al scroll: la página responde mientras bajas — */
    gsap.fromTo(".fruta__marco", { scale: .95 }, {
      scale: 1.04, ease: "none",
      scrollTrigger: { trigger: ".fruta__marco", start: "top bottom", end: "bottom top", scrub: 1.2 }
    });
    gsap.fromTo(".cinta__viaje", { x: 0 }, {
      x: -130, ease: "none",
      scrollTrigger: { trigger: ".cinta", start: "top bottom", end: "bottom top", scrub: 1.5 }
    });
    Array.prototype.slice.call(document.querySelectorAll(".claqueta")).forEach(function (c) {
      gsap.fromTo(c, { rotate: -3 }, {
        rotate: 3, ease: "none",
        scrollTrigger: { trigger: c.closest(".seccion"), start: "top bottom", end: "bottom top", scrub: 1.4 }
      });
    });
    var sello = document.querySelector(".pie__sello");
    if (sello) {
      gsap.fromTo(sello, { letterSpacing: ".14em" }, {
        letterSpacing: ".5em", ease: "none",
        scrollTrigger: { trigger: ".pie", start: "top bottom", end: "bottom bottom", scrub: 1.2 }
      });
    }
    gsap.to(".hero__flotante", {
      yPercent: function (i) { return 30 + (i % 3) * 18; },
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });

    /* — Tilt 3D que sigue el cursor — */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      Array.prototype.slice.call(document.querySelectorAll(".pieza, .tarjeta, .plano")).forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width - .5;
          var ny = (e.clientY - r.top) / r.height - .5;
          c.style.setProperty("--rx", (-ny * 7).toFixed(2) + "deg");
          c.style.setProperty("--ry", (nx * 9).toFixed(2) + "deg");
        });
        c.addEventListener("pointerleave", function () {
          c.style.setProperty("--rx", "0deg");
          c.style.setProperty("--ry", "0deg");
        });
      });
    }

    /* — La sala se oscurece cuando suena el video (modo cine) — */
    var videoSala = document.querySelector(".video__marco video");
    if (videoSala) {
      videoSala.addEventListener("play", function () { document.body.classList.add("sala-oscura"); });
      videoSala.addEventListener("pause", function () { document.body.classList.remove("sala-oscura"); });
      videoSala.addEventListener("ended", function () { document.body.classList.remove("sala-oscura"); });
    }

    /* — La fruta se dibuja por bandas mientras bajas — */
    var imgFruta = document.querySelector(".fruta__marco .lupa img");
    if (imgFruta) {
      gsap.fromTo(imgFruta, { clipPath: "inset(0 0 100% 0)" }, {
        clipPath: "inset(0 0 0% 0)", ease: "none",
        scrollTrigger: { trigger: ".fruta__marco", start: "top 85%", end: "center 45%", scrub: 1 }
      });
    }

    /* — Las letras de los monogramas caen como typesetter — */
    Array.prototype.slice.call(document.querySelectorAll(".fuente__monograma span")).forEach(function (m) {
      gsap.from(m, {
        y: -70, opacity: 0, rotate: -10, duration: .8, ease: "back.out(1.7)",
        scrollTrigger: { trigger: m.closest(".tarjeta"), start: "top 75%", once: true },
        clearProps: "transform,opacity"
      });
    });

    /* — La fila de planos respira con el scroll — */
    gsap.fromTo(".planos", { scale: .985 }, {
      scale: 1.015, ease: "none",
      scrollTrigger: { trigger: ".planos", start: "top bottom", end: "bottom top", scrub: 1.2 }
    });

    /* — Cierre de escena: la línea del clap se dibuja — */
    Array.prototype.slice.call(document.querySelectorAll(".pasos")).forEach(function (p) {
      gsap.fromTo(p, { "--sx": 0 }, {
        "--sx": 1, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: p, start: "top 88%", once: true }
      });
    });

    /* — Estallido de chispas al hacer clic en cualquier parte — */
    document.addEventListener("click", function (e) {
      for (var i = 0; i < 5; i++) {
        var p = document.createElement("i");
        p.className = "chispa-libre";
        p.style.left = e.clientX + "px";
        p.style.top = e.clientY + "px";
        document.body.appendChild(p);
        var ang = (Math.PI * 2 * i) / 5 + Math.random();
        (function (el) {
          gsap.to(el, {
            x: Math.cos(ang) * (36 + Math.random() * 30),
            y: Math.sin(ang) * (36 + Math.random() * 30),
            opacity: 0, scale: .2, duration: .6 + Math.random() * .3,
            ease: "power2.out", onComplete: function () { el.remove(); }
          });
        })(p);
      }
    });
  }
})();
