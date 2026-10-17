/**
 * data/branding.js — Identidad de marca CAMORA × SUPER.
 * Paleta, tipografías, reglas de uso. No altera logos oficiales.
 */

const BRANDING = {
  marcas: {
    CAMORA: {
      nombre: "CAMORA",
      rol: "Productora audiovisual",
      keywords: ["VISION", "PRODUCCION", "CREATIVIDAD", "TECNOLOGIA"],
      descripcion: "Produccion cinematografica con mirada juvenil y tecnica profesional.",
      logo: "assets/logos/camora.png",
      colores: [
        { hex: "#1E40FF", name: "AZUL",     desc: "Principal. Confianza y profundidad cinematografica." },
        { hex: "#6B2FBC", name: "MORADO",   desc: "Creatividad, misterio y diferenciacion." },
        { hex: "#FFFFFF", name: "BLANCO",   desc: "Lectura, contraste y limpieza." },
        { hex: "#F5C842", name: "AMARILLO", desc: "Acento energetico, llamado de atencion." },
      ],
    },
    SUPER: {
      nombre: "SUPER",
      rol: "Creacion de contenido",
      keywords: ["CREACION", "CONTENIDO", "ENERGIA", "DINAMISMO"],
      descripcion: "Contenido digital con energia, identidad y ritmo propio.",
      logo: "assets/logos/super.png",
      colores: [
        { hex: "#0F6FFF", name: "AZUL",    desc: "Principal. Tecnologia y dinamismo." },
        { hex: "#FF6B1A", name: "NARANJA", desc: "Energia, accion y creatividad." },
        { hex: "#FFFFFF", name: "BLANCO",  desc: "Legibilidad, frescura y contraste." },
      ],
    },
  },

  colaboracion: {
    nombre: "CAMI × DAVID",
    composicion: "CAMORA × SUPER",
    xSignificado: "Colaboracion entre dos marcas independientes. NO es un nuevo logotipo.",
    frase: "Dos visiones. Una misma puerta.",
  },

  paleta: {
    bgDeep:    "#060A1A",
    bgDark:    "#0A0F24",
    bgPanel:   "#0B1B5E",
    camoraAzul:      "#1E40FF",
    camoraMorado:    "#6B2FBC",
    camoraBlanco:    "#FFFFFF",
    camoraAmarillo:  "#F5C842",
    superAzul:    "#0F6FFF",
    superNaranja: "#FF6B1A",
    superBlanco:  "#FFFFFF",
    tintAzul:     "#BFCBFF",
    tintMorado:   "#E0CBFF",
    tintNaranja:  "#FFD2B8",
    tintAmarillo: "#FEE9A8",
    textPrimary:   "#FFFFFF",
    textSecondary: "#BFCBFF",
    textAccent:    "#F5C842",
  },

  tipografias: {
    titular: {
      familia: "Bebas Neue, Oswald, sans-serif",
      peso: 400,
      uso: "Titulares de slides y hero del sitio",
    },
    cuerpo: {
      familia: "Inter, system-ui, sans-serif",
      pesos: [300, 400, 500, 600, 700, 800],
      uso: "Texto de cuerpo, descripciones, navegacion",
    },
    numerica: {
      familia: "Space Mono, JetBrains Mono, monospace",
      peso: [400, 700],
      uso: "Numeros, etiquetas, codigos, hex colors",
    },
  },

  instituciones: {
    sena: {
      nombre: "SENA",
      rol: "Formacion tecnica",
      aclaracion: "Parte del recorrido de formacion tecnica del equipo.",
      logo: "assets/instituciones/sena-white.png",
      posicion: "Esquina inferior derecha",
      tamanoPx: 96,   // coincide con --corner-logo-sena en tokens.css (desktop)
    },
    colegio: {
      nombre: "Colegio Rural del Sur",
      rol: "Contexto academico",
      aclaracion: "Institucion academica donde se desarrolla el proyecto.",
      logo: "assets/instituciones/colegio-rural-sur.png",
      posicion: "Esquina superior derecha",
      tamanoPx: 100,  // coincide con --corner-logo-institution en tokens.css (desktop)
    },
  },

  reglas: [
    "NO redisenar los logos oficiales CAMORA y SUPER",
    "NO reinterpretar, NO fusionar, NO simplificar los logos",
    "NO cambiar colores ni tipografias internas de los logos",
    "Solo permitir: posicion, escala, opacidad, sombra/glow externo, animacion de entrada",
    "La X representa colaboracion, NO es un nuevo logotipo",
    "CAMORA y SUPER son dos marcas independientes",
    "Logo SENA en TODAS las slides (tamano via --corner-logo-sena)",
    "Logo Colegio en TODAS las slides (tamano via --corner-logo-institution)",
    "Sin datos inventados: marcar PROPUESTA cuando aplique",
    "NUNCA emojis en entregables. Usar SVG, texto o simbolos ASCII",
  ],
};

window.CAMI_BRANDING = BRANDING;
