# Todos mis proyectos — Portafolio para el INEN

Portafolio de los proyectos del SENA de **Andrés Camilo Rachén Cuy** y **Juan David Martínez Amaya** (grado 10-1), armado como una noche de estreno para exponer en el colegio INEN de Tunja con un solo doble clic y sin internet.

## Cómo se usa

1. Copia la carpeta `Inen-Sena` completa a la USB (o al escritorio del equipo del salón).
2. Abre `index.html` con doble clic (Chrome o Edge).
3. La exposición sigue el orden de la película: siete entregas y, al final de cada una, el botón «Siguiente» lleva a la que sigue.
4. Para exponer sin tocar nada: botón «Reproducir la premiere automática» del inicio (o abre `index.html#estreno`): las escenas se pasan solas, con claqueta entre escenas y el video reproducido en vivo. Flechas, pausa y Esc funcionan en todo momento.

No necesita internet, ni programas, ni instalación. Si cambias la carpeta de nombre o mueves archivos de sitio, las rutas se rompen: muévela completa.

## La experiencia (diseño «noche de estreno»)

- La página abre como una función de cine: barras letterbox, contador 3-2-1 y el título letra por letra (si el equipo tiene animaciones desactivadas, el contenido aparece directo y completo).
- **Modo estreno (premiere automática)**: el portafolio completo se pasa solo, escena por escena, con claqueta entre escenas, el video reproducido en vivo y pantalla final de créditos con «Repetir».
- **Choque estilo intro de videojuego**: el Titán TV Man y la hamburguesa vuelan al centro, chocan con destello y sacudida, y rebotan a su sitio.
- Cada sección abre con una **claqueta que aplaude** al entrar en pantalla, y la página entera responde al scroll: la fruta crece al bajar, la tira de celuloide se desplaza, las claquetas se inclinan y el sello final se abre letra por letra.
- Los botones son **claquetas**: esquinas cortadas, barra rayada arriba y se hunden al presionar.
- Tarjetas, piezas y planos se **inclinan en 3D siguiendo el cursor**, los sprites del hero saltan al pasar por encima y cada clic suelta un estallido de chispas.
- Las imágenes viajan en una **tira de celuloide de 35 mm** con perforaciones; toda la página lleva grano de película, viñeta de sala, chispas que titilan, letras de las fuentes flotando en el fondo y sprites que aparecen y desaparecen.
- **Modo cine real**: al darle play al video, la sala entera se oscurece como en un teatro; la fruta del dragón **se dibuja por bandas** mientras bajas; los monogramas de las fuentes caen como typesetter; cada escena cierra con la línea del clap dibujándose.
- Siempre hay **HUD de cámara** (REC + timecode del recorrido + escena actual), **mirilla de esquinas** fijas y **créditos rodantes** con sello «FIN DE LA FUNCIÓN» al final.
- El menú superior son timecodes de escena (ESC 01 a ESC 07) y hay un **cursor mirilla** cuando hay mouse. Además, el botón dorado «PREMIERE AUTO» de la esquina inferior izquierda arranca la función automática en cualquier momento.

## Qué contiene (siete entregas en orden cronológico)

| Escena | Contenido | Cómo se ve |
|---|---|---|
| 1 · Físico y digital | Los 6 pixel arts en versión **sin fondo** (transparencia verificada), la marca Z-R-T-I-S-T · Creatiz y el PDF de los dibujos (11 páginas) | Lightbox con escaneo CRT; el sprite salta al pasar el cursor |
| 2 · Letras | Las 2 fuentes «cami» (tradicional y temática gótica) hechas en FontStruct | **Prueba en vivo**: escribe y lo ves al instante en la fuente; abecedario completo en un modal; PDFs del proceso; descarga .ttf opcional |
| 3 · Fruta del dragón | El primer producto terminado en pixel art | **Lupa de píxeles**: al pasar el cursor se ven los puntos ampliados |
| 4 · Cami X de David | La página web completa v25.9 (~108 MB), intacta, y el PDF CAMORA de la productora (57 páginas) | Marquesina con luces que se persiguen; se abre en pestaña nueva o embebida bajo demanda |
| 5 · Planos | Guion técnico de CAMORA: los 11 encuadres reales y el PDF de 21 páginas | Storyboard en celuloide + visor de PDF |
| 6 · Video | El video de movimientos de cámara (113 s) y su PDF de 24 páginas | Sala de cine con haz de proyector; el video se reproduce aquí mismo |
| 7 · Animación digital | La Actividad 1 de conceptos de imagen digital y las dos mini secuencias en GIF (pájaro y hoja) | Cinco tarjetas de conceptos + los GIFs en marcos de sala de proyección, cuadro a cuadro |

## Visor de PDF sin internet

Los documentos están incrustados en la carpeta y se ven con PDF.js local: cada página ajustada a la pantalla del computador, tira de miniaturas abajo para saltar de página con un clic, controles de página y zoom, y el botón «Abrir en pestaña nueva» como respaldo. Primera apertura de cada documento tarda un instante.

## Dónde cambiar cosas

- Textos de las secciones: `index.html` (cada bloque está comentado).
- Colores y tamaños: `assets/css/estilos.css` (variables al inicio del archivo).
- Para reemplazar una imagen o un PDF: sustituye el archivo en `assets/` con el mismo nombre y no hay que tocar nada más.
- El proyecto grande está en `assets/cami-x-david/` tal como fue entregado: no renombrar sus archivos internos.

## Créditos y licencias

- Fuentes «cami» tradicional y gótica: creadas por **cami4844** en FontStruct (licencia FontStruct Non-Commercial; ver `assets/fonts/licencia-fuente.txt` y `leeme-fuente.txt`).
- GSAP 3.12.5 y PDF.js 3.11.174 incrustados localmente (cdnjs y Mozilla); detalles en `CREDITOS.md`.

## Nota

Por decisión del equipo, la comparación de imágenes con IA no hace parte del portafolio (los archivos siguen en `assets/img` porque la marca Z-R-T-I-S-T sí se usa en la escena 1).
