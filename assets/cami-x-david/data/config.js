/**
 * data/config.js — Configuración global CAMI × DAVID.
 * Source of truth para presentación + sitio web.
 * Cambiar aqui y todo el proyecto refleja el cambio.
 */

const CONFIG = {
  // ============================================================
  // IDENTIDAD
  // ============================================================
  nombre: "CAMI × DAVID",
  marcas: "CAMORA × SUPER",
  ciudad: "Tunja, Boyacá, Colombia",
  ctxAcademico: "Colegio Rural del Sur",
  ctxFormacion: "SENA",
  lang: "es",

  // ============================================================
  // SITIO WEB
  // ============================================================
  siteUrl: "PENDIENTE",
  siteLocalPath: "website/index.html",

  // ============================================================
  // VIDEO DE COLABORACIÓN
  // Subido: TRUE. El MP4 está en assets/video/colaboracion.mp4
  // ============================================================
  videoColaboracion: {
    src: "assets/video/colaboracion.mp4",
    poster: "assets/video/colaboracion-miniatura.png",
    duracion: "00:10",
    descripcion: "Logo SUPER → Logo CAMORA → Encuentro → X → CAMI × DAVID",
    subido: true,
    nota: "Video de colaboracion audiovisual. 10 segundos. MP4 real.",
  },

  // ============================================================
  // REDES SOCIALES (CEROS REALES — SIN INVENTAR)
  // ============================================================
  redes: {
    instagram: {
      handle: "@camora.super",
      url: "PENDIENTE",
      seguidores: 0,
      posts: 0,
      siguiendo: 0,
      propuesta: true,
    },
    tiktok: {
      handle: "@camora.super",
      url: "PENDIENTE",
      seguidores: 0,
      likes: 0,
      videos: 0,
      propuesta: true,
    },
    disclaimer: "Perfiles conceptuales. No se inventan metricas reales.",
  },

  // ============================================================
  // CONTACTO (SIN DATOS INVENTADOS)
  // ============================================================
  contacto: {
    telefono: "PENDIENTE",
    correo: "PENDIENTE",
    direccion: "Tunja, Boyacá, Colombia",
    formularioFuncional: false,
    nota: "Formulario preparado para integracion futura. No hay backend activo.",
  },

  // ============================================================
  // PRESENTACIÓN — 20 SLIDES
  // Sin límite: si hace falta dividir más, se divide.
  // ============================================================
  presentacion: {
    totalSlides: 20,
    formato: "16:9",
    resoluciones: ["1920x1080", "1600x900", "1366x768", "1280x720"],
    transicionDefault: "fade",
    autoPlay: false,
    autoPlayInterval: 8000,
  },

  // ============================================================
  // RUTAS BASE
  // ============================================================
  rutas: {
    slides: "slides/",
    css: "css/",
    js: "js/",
    assets: "assets/",
    website: "website/",
    apps: "apps/",
    data: "data/",
  },

  // ============================================================
  // FLAGS ANTI-INVENCIÓN
  // ============================================================
  flags: {
    permiteInventarDatos: false,
    marcarPropuestas: true,
    respetarLogos: true,
    senaEnTodas: true,
    colegioEnTodas: true,
  },
};

// LISTA DE 20 SLIDES (source of truth)
CONFIG.SLIDE_LIST = [
  { num: 1,  file: "slides/01-portada.html",            title: "PORTADA",              chapter: "00" },
  { num: 2,  file: "slides/02-indice.html",             title: "INDICE",               chapter: "00" },
  { num: 3,  file: "slides/03-introduccion.html",       title: "INTRODUCCION",         chapter: "01" },
  { num: 4,  file: "slides/04-identidad.html",          title: "DOS EMPRESAS",         chapter: "02" },
  { num: 5,  file: "slides/05-paleta.html",             title: "IDENTIDAD VISUAL",     chapter: "03" },
  { num: 6,  file: "slides/06-historia.html",           title: "RESENA HISTORICA",     chapter: "04" },
  { num: 7,  file: "slides/07-camisetas.html",          title: "MATERIAL // CAMISETAS",       chapter: "05" },
  { num: 8,  file: "slides/08-camiseta-blanca.html",    title: "MATERIAL // CAMISETA BLANCA", chapter: "05" },
  { num: 9,  file: "slides/09-gorra.html",              title: "MATERIAL // GORRA",          chapter: "05" },
  { num: 10, file: "slides/10-pocillo-taza.html",       title: "MATERIAL // POCILLO",        chapter: "05" },
  { num: 11, file: "slides/11-tarjeta-presentacion.html", title: "MATERIAL // TARJETA",      chapter: "05" },
  { num: 12, file: "slides/12-membrete.html",           title: "MATERIAL // MEMBRETE",       chapter: "05" },
  { num: 13, file: "slides/13-afiche.html",             title: "MATERIAL // AFICHE",         chapter: "05" },
  { num: 14, file: "slides/14-volante.html",            title: "MATERIAL // VOLANTE",        chapter: "05" },
  { num: 15, file: "slides/15-folleto.html",            title: "MATERIAL // FOLLETO",        chapter: "05" },
  { num: 16, file: "slides/16-pendon.html",             title: "MATERIAL // PENDON",         chapter: "05" },
  { num: 17, file: "slides/17-redes.html",              title: "REDES SOCIALES",             chapter: "06" },
  { num: 18, file: "slides/18-comercial.html",         title: "COMERCIAL",                  chapter: "07" },
  { num: 19, file: "slides/19-sitio-web.html",         title: "SITIO WEB",                 chapter: "08" },
  { num: 20, file: "slides/20-cierre.html",             title: "CIERRE",                    chapter: "00" },
];

window.CAMI_CONFIG = CONFIG;
