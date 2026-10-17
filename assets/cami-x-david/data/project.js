/**
 * data/project.js — Contenido del proyecto CAMI × DAVID.
 * Source of truth centralizada para slides + sitio web.
 * Sin datos inventados. "PROPUESTA" marcado donde aplica.
 */

const PROJECT = {
  meta: {
    nombre: "CAMI × DAVID",
    marcas: "CAMORA × SUPER",
    colaboracion: "CAMI × DAVID",
    ciudad: "Tunja, Boyacá, Colombia",
    ctxAcademico: "Colegio Rural del Sur",
    ctxFormacion: "SENA",
    claim: "Transformamos ideas en contenido que se ve, se siente y se recuerda.",
    tagline: "Productora audiovisual + creacion de contenido",
    cierreFrase: "Dos visiones. Una misma puerta.",
  },

  // INDICE (slide 02) — referencias a slide numbers nuevos (20 slides)
  indice: [
    { num: "01", titulo: "INTRODUCCION",      desc: "Quienes somos y que nos mueve",                slide: 3,  accent: "#1E40FF" },
    { num: "02", titulo: "DOS EMPRESAS",      desc: "Vision CAMORA + SUPER",                        slide: 4,  accent: "#FF6B1A" },
    { num: "03", titulo: "IDENTIDAD VISUAL",  desc: "Colores, tipografias, X de colaboracion",       slide: 5,  accent: "#1E40FF" },
    { num: "04", titulo: "RESENA HISTORICA", desc: "Trayectoria del proyecto",                     slide: 6,  accent: "#FF6B1A" },
    { num: "05", titulo: "MATERIALES",        desc: "10 piezas del sistema de identidad",            slide: 7,  accent: "#1E40FF" },
    { num: "06", titulo: "REDES SOCIALES",    desc: "Presencia digital conceptual",                 slide: 17, accent: "#FF6B1A" },
    { num: "07", titulo: "COMERCIAL",         desc: "Video de colaboracion 10s",                    slide: 18, accent: "#1E40FF" },
    { num: "08", titulo: "SITIO WEB",         desc: "Pieza digital del proyecto",                   slide: 19, accent: "#FF6B1A" },
  ],

  // INTRODUCCION (slide 03)
  introduccion: {
    bloques: [
      {
        label: "APRENDIZAJE",
        accent: "#BFCBFF",
        desc: "Mas de un ano formandonos en Illustrator, Photoshop y CorelDRAW. Base tecnica solida para producir contenido.",
      },
      {
        label: "EQUIPO",
        accent: "#E0CBFF",
        desc: "Jovenes estudiantes con deseo de aplicar lo aprendido en un ambito real. De la teoria del aula al proyecto concreto.",
      },
      {
        label: "PROPOSITO",
        accent: "#FFD2B8",
        desc: "Potenciar anuncios, ayudar a negocios y convertir ideas en realidad. Pasion y esfuerzo como motor.",
      },
    ],
    bloqueSena: {
      titulo: "NUESTRO RECORRIDO DE FORMACION",
      desc: "Parte de nuestro aprendizaje y desarrollo creativo se construyo durante nuestro recorrido de formacion SENA.",
      chip: "FORMACION // CREATIVIDAD",
      aclaracion: "Recorrido de formacion tecnica SENA.",
      imagen: "assets/instituciones/imagen-sena-cine.png",
    },
    jerarquia: [
      { nombre: "CAMORA x SUPER", rol: "Proyecto creativo", accent: "#1E40FF" },
      { nombre: "SENA", rol: "Formacion tecnica", accent: "#F5C842" },
      { nombre: "Colegio Rural del Sur", rol: "Contexto academico", accent: "#FF6B1A" },
    ],
  },

  // DOS EMPRESAS (slide 04)
  dosEmpresas: {
    camora: {
      nombre: "CAMORA",
      rol: "PRODUCTORA AUDIOVISUAL",
      keywords: ["VISION", "PRODUCCION", "CREATIVIDAD", "TECNOLOGIA"],
      descripcion: "Produccion cinematografica con mirada juvenil y tecnica profesional.",
      accent: "#1E40FF",
    },
    super: {
      nombre: "SUPER",
      rol: "CREACION DE CONTENIDO",
      keywords: ["CREACION", "CONTENIDO", "ENERGIA", "DINAMISMO"],
      descripcion: "Contenido digital con energia, identidad y ritmo propio.",
      accent: "#FF6B1A",
    },
    cierre: "CAMI × DAVID",
  },

  // RESENA HISTORICA (slide 06) — sin fechas inventadas, etapas conceptuales
  timeline: [
    { id: "01", titulo: "INICIO",      tag: "SENA // BASE",            desc: "Surge la idea de unir produccion audiovisual y creacion de contenido. Base construida durante la formacion SENA.", accent: "#1E40FF" },
    { id: "02", titulo: "IDENTIDAD",   tag: "CAMORA + SUPER",          desc: "Diseno de logos, paleta de colores y definicion de personalidad de cada marca.", accent: "#C39BFF" },
    { id: "03", titulo: "SERVICIOS",   tag: "PROPUESTA",               desc: "Propuesta de servicios audiovisuales y de contenido. Estructuracion de formatos.", accent: "#F5C842" },
    { id: "04", titulo: "EXPANSION",   tag: "APLICACION",             desc: "Materiales, mockups, redes y piezas graficas. Aplicacion practica de la identidad.", accent: "#6FB5FF" },
    { id: "05", titulo: "DIGITAL",     tag: "PROPUESTA",              desc: "Sitio web y presencia digital como siguiente paso natural del proyecto.", accent: "#FF6B1A" },
  ],

  // MATERIALES (slides 07-16) — 10 piezas individuales, UNA POR SLIDE
  materiales: [
    { id: 1,  archivo: "assets/productos/camisetas.png",            nombre: "CAMISETAS",                tipo: "TEXTIL",       desc: "Camiseta oscura con logo CAMORA al pecho. Algodon premium, corte moderno.",                  accent: "#1E40FF", slide: 7  },
    { id: 2,  archivo: "assets/productos/camiseta-blanca.png",      nombre: "CAMISETA BLANCA",          tipo: "TEXTIL",       desc: "Camiseta blanca con marca SUPER al pecho. Algodon premium, corte moderno.",                  accent: "#6B2FBC", slide: 8  },
    { id: 3,  archivo: "assets/productos/gorra.png",                nombre: "GORRA",                    tipo: "ACCESORIO",    desc: "Gorra estructurada con bordado de identidad. Ajuste trasero metalico.",                       accent: "#FF6B1A", slide: 9  },
    { id: 4,  archivo: "assets/productos/pocillo-taza.png",        nombre: "POCILLO / TAZA",           tipo: "CERAMICA",     desc: "Pocillo ceramico negro con marca SUPER en bajo relieve. Acabado mate.",                       accent: "#1E40FF", slide: 10 },
    { id: 5,  archivo: "assets/productos/tarjeta-presentacion.png", nombre: "TARJETA DE PRESENTACION", tipo: "CORPORATIVO", desc: "Tarjeta bidimensional. Anverso CAMORA, reverso SUPER. Acabado mate con detalle de color.",   accent: "#6B2FBC", slide: 11 },
    { id: 6,  archivo: "assets/productos/membrete.png",             nombre: "MEMBRETE",                 tipo: "CORPORATIVO", desc: "Cabecera institucional con logo CAMORA x SUPER. Aplicacion en documentos oficiales.",         accent: "#FF6B1A", slide: 12 },
    { id: 7,  archivo: "assets/productos/afiche.png",                nombre: "AFICHE",                   tipo: "GRAN FORMATO", desc: "Pieza visual de gran formato para campanas. Composicion cinematografica.",                    accent: "#1E40FF", slide: 13 },
    { id: 8,  archivo: "assets/productos/volante.png",               nombre: "VOLANTE",                  tipo: "DIFUSION",     desc: "Pieza de difusion directa. Frente con impacto visual, reverso con informacion esencial.",     accent: "#6B2FBC", slide: 14 },
    { id: 9,  archivo: "assets/productos/folleto.png",               nombre: "FOLLETO",                  tipo: "EDITORIAL",    desc: "Folleto triptico con info del proyecto, servicios y contacto. Estructura editorial limpia.", accent: "#FF6B1A", slide: 15 },
    { id: 10, archivo: "assets/productos/pendon.png",               nombre: "PENDON",                   tipo: "EVENTOS",      desc: "Pendon roll-up para eventos y presentaciones. Identidad CAMORA x SUPER en gran formato vertical.", accent: "#1E40FF", slide: 16 },
  ],

  // REDES SOCIALES (slide 17) — CEROS REALES. Sin inventar.
  redes: {
    instagram: {
      handle: "@camora.super",
      bio: "CAMORA x SUPER — Productora audiovisual + creacion de contenido. Proyecto academico.",
      seguidores: 0,
      posts: 0,
      siguiendo: 0,
      propuesta: true,
      accent: "#1E40FF",
      appPath: "apps/instagram.html",
    },
    tiktok: {
      handle: "@camora.super",
      bio: "Contenido audiovisual y creativo. Tunja, Colombia.",
      seguidores: 0,
      likes: 0,
      videos: 0,
      propuesta: true,
      accent: "#FF6B1A",
      appPath: "apps/tiktok.html",
    },
    disclaimer: "Contacto real: wa.me/+573052144235",
  },

  // COMERCIAL (slide 18) — VIDEO REAL 10s, subido TRUE
  comercial: {
    titulo: "VIDEO DE COLABORACION",
    subtitulo: "Video de colaboracion. 10 segundos.",
    descripcion: "Logo SUPER → Logo CAMORA → Encuentro → X → CAMI × DAVID",
    fraseFinal: "DOS VISIONES. UNA MISMA PUERTA.",
    duracion: "00:10",
    storyboard: [
      { id: "01", titulo: "IDEA",        tag: "CAMORA // PREPRODUCCION",          desc: "Lluvia de ideas. Concepto central. Definicion del mensaje.", accent: "#1E40FF" },
      { id: "02", titulo: "GRABACION",   tag: "CAMORA // PRODUCCION",              desc: "Captura en set. Iluminacion, audio y direccion. Produccion cinematografica.", accent: "#6B2FBC" },
      { id: "03", titulo: "EDICION",     tag: "CAMORA + SUPER // POSTPRODUCCION", desc: "Montaje, color, sonido y efectos. Postproduccion completa.", accent: "#F5C842" },
      { id: "04", titulo: "PUBLICACION", tag: "SUPER // DISTRIBUCION",             desc: "Distribucion digital. Adaptacion por plataforma. Optimizacion.", accent: "#0F6FFF" },
      { id: "05", titulo: "IMPACTO",     tag: "CAMORA X SUPER // RESULTADO",       desc: "Llegada a audiencia. Reconocimiento de marca. Crecimiento.", accent: "#FF6B1A" },
    ],
    video: {
      src: "assets/video/colaboracion.mp4",
      poster: "assets/video/colaboracion-miniatura.png",
      subido: true,
      nota: "MP4 real subido por Cami.",
    },
  },

  // SITIO WEB (slide 19) — navegador funcional
  sitioWeb: {
    secciones: ["INICIO", "NOSOTROS", "SERVICIOS", "PORTAFOLIO", "PROCESO", "REDES", "CONTACTO"],
    url: "PENDIENTE",
    localPath: "website/index.html",
    estado: "CONSTRUIDO",
    previews: {
      hero:      "assets/website/31_web_hero.png",
      nosotros:  "assets/website/32_web_nosotros.png",
      servicios: "assets/website/33_web_servicios.png",
      portafolio:"assets/website/34_web_portafolio.png",
      proceso:   "assets/website/35_web_proceso.png",
      redes:     "assets/website/36_web_redes.png",
      contacto:  "assets/website/37_web_contacto.png",
    },
  },

  // CIERRE (slide 20)
  cierre: {
    principal: "CAMI × DAVID",
    secundario: "CAMORA × SUPER",
    frase: "Dos visiones. Una misma puerta.",
    cierreCinematografico: true,
  },

  // SERVICIOS (para sitio web) — marcado PROPUESTA cuando aplica
  servicios: [
    { titulo: "PRODUCCION AUDIOVISUAL", desc: "Cortometrajes, comerciales, videos institucionales. Vision cinematografica aplicada a cada pieza.", accent: "#1E40FF", propuesta: false },
    { titulo: "CREACION DE CONTENIDO",  desc: "Contenido digital para redes sociales, branding y estrategia de marca.", accent: "#FF6B1A", propuesta: false },
    { titulo: "EDICION Y POSTPRODUCCION", desc: "Montaje, color grading, sonido y efectos visuales. Postproduccion completa.", accent: "#6B2FBC", propuesta: true },
    { titulo: "ESTRATEGIA DIGITAL",     desc: "Plan de contenidos, calendario, gestion de redes y metricas.", accent: "#F5C842", propuesta: true },
  ],

  // PROCESO (5 etapas — para sitio web)
  proceso: [
    { id: "01", titulo: "IDEA",          desc: "Lluvia de ideas, concepto central, definicion del mensaje.",          accent: "#1E40FF" },
    { id: "02", titulo: "PREPRODUCCION", desc: "Guion, storyboard, planificacion, casting y locaciones.",             accent: "#6B2FBC" },
    { id: "03", titulo: "PRODUCCION",    desc: "Captura en set. Iluminacion, audio y direccion cinematografica.",     accent: "#F5C842" },
    { id: "04", titulo: "POSTPRODUCCION", desc: "Montaje, color, sonido y efectos. Postproduccion completa.",          accent: "#0F6FFF" },
    { id: "05", titulo: "DISTRIBUCION",  desc: "Distribucion digital. Adaptacion por plataforma y optimizacion.",      accent: "#FF6B1A" },
  ],

  // PORTAFOLIO — marcado PROYECTO CONCEPTUAL
  portafolio: {
    categorias: ["VIDEO", "FOTOGRAFIA", "BRANDING", "REDES", "PUBLICIDAD"],
    piezas: [
      { titulo: "Sistema de identidad CAMI x DAVID",                                      categoria: "BRANDING",   concepto: true, accent: "#1E40FF" },
      { titulo: "Comercial de colaboracion 10s",                                          categoria: "VIDEO",      concepto: true, accent: "#FF6B1A" },
      { titulo: "Piezas impresas (afiche, volante, folleto, pendon)",                     categoria: "PUBLICIDAD", concepto: true, accent: "#6B2FBC" },
      { titulo: "Sitio web CAMORA x SUPER",                                              categoria: "BRANDING",   concepto: true, accent: "#F5C842" },
      { titulo: "Materiales: camisetas, gorra, pocillo, tarjeta, membrete",               categoria: "BRANDING",   concepto: true, accent: "#0F6FFF" },
    ],
  },
};

window.CAMI_PROJECT = PROJECT;
