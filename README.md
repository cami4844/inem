# Todos mis proyectos — Portafolio para el INEM

Portafolio de los proyectos del SENA del grado 10-1 del **Colegio Rural del Sur** (**Andrés Camilo Rachén Cuy** y **Juan David Martínez Amaya**), armado como una noche de estreno para presentarse en el colegio INEM de Tunja con un solo doble clic y sin internet.

## Cómo se usa

1. Copia la carpeta `Inen-Sena` completa a la USB (o al escritorio del equipo del salón).
2. Abre `index.html` con doble clic (Chrome o Edge).
3. La exposición sigue el orden de la película: ocho entregas y, al final de cada una, el botón «Siguiente» lleva a la que sigue.
4. Al abrir la página, la premiere arranca SOLA: un cursor animado baja y presiona el botón, las letras se separan y la función comienza; al final, los créditos rodantes dejan paso a la página completa. También se puede forzar con `index.html#estreno`. Flechas, pausa y Esc funcionan en todo momento.

No necesita internet, ni programas, ni instalación. Si cambias la carpeta de nombre o mueves archivos de sitio, las rutas se rompen: muévela completa.

## La experiencia (diseño «noche de estreno»)

- La página abre como una función de cine: barras letterbox, contador 3-2-1 y el título letra por letra (si el equipo tiene animaciones desactivadas, el contenido aparece directo y completo).
- **Modo estreno (premiere automática)**: arranca solo al abrir la página (un cursor animado presiona el botón); escena por escena con claqueta entre escenas, los nombres en grande que se acomodan en la apertura, los pixel arts que se autoforman, el choque de los logos CAMORA × SUPER, la portada del video sin spoilers, el storyboard de las mini secuencias y los créditos rodantes que dan paso a la página completa.
- **Choque estilo intro de videojuego**: el Titán TV Man y la hamburguesa vuelan al centro, chocan con destello y sacudida, y rebotan a su sitio.
- Cada sección abre con una **claqueta que aplaude** al entrar en pantalla, y la página entera responde al scroll: la fruta crece al bajar, la tira de celuloide se desplaza, las claquetas se inclinan y el sello final se abre letra por letra.
- Los botones son **claquetas**: esquinas cortadas, barra rayada arriba y se hunden al presionar.
- Tarjetas, piezas y planos se **inclinan en 3D siguiendo el cursor**, los sprites del hero saltan al pasar por encima y cada clic suelta un estallido de chispas.
- Las imágenes viajan en una **tira de celuloide de 35 mm** con perforaciones; toda la página lleva grano de película, viñeta de sala, chispas que titilan, letras de las fuentes flotando en el fondo y sprites que aparecen y desaparecen.
- **Modo cine real**: al darle play al video, la sala entera se oscurece como en un teatro; la fruta del dragón **se dibuja por bandas** mientras bajas; los monogramas de las fuentes caen como typesetter; cada escena cierra con la línea del clap dibujándose.
- Siempre hay **HUD de cámara** (REC + timecode del recorrido + escena actual), **mirilla de esquinas** fijas y **créditos rodantes** con sello «FIN DE LA FUNCIÓN» al final.
- El menú superior son timecodes de escena (ESC 01 a ESC 08).
- **Rendimiento**: la página detecta solita los equipos modestos o el proyector y apaga lo costoso (desenfuques de fondo, grano, tilt 3D); los GIF solo animan cuando su escena está en pantalla, las miniaturas de los PDF se pintan por tandas y las decoraciones se pausan mientras corre la premiere o el visor. El cursor personalizado se retiró de las dos páginas (portafolio y Cami X de David) por orden de Cami: presentación en televisor táctil y menos costo.

## Qué contiene (ocho entregas en orden cronológico)

| Escena | Contenido | Cómo se ve |
|---|---|---|
| 1 · Físico y digital | Los 6 pixel arts en versión **sin fondo** (transparencia verificada), la marca Z-R-T-I-S-T · Creatiz y el PDF de los dibujos (11 páginas) | Lightbox con escaneo CRT; el sprite salta al pasar el cursor |
| 2 · Letras | Las 2 fuentes «cami» (tradicional y temática gótica) hechas en FontStruct | **Prueba en vivo**: escribe y lo ves al instante en la fuente; abecedario completo en un modal; PDFs del proceso; descarga .ttf opcional |
| 3 · Fruta del dragón | El primer producto terminado en pixel art | **Lupa de píxeles**: al pasar el cursor se ven los puntos ampliados |
| 4 · Cami X de David | La página web completa v25.9 (~108 MB), intacta | Marquesina con luces que se persiguen; se abre en pestaña nueva o embebida bajo demanda |
| 5 · Planos | Guion técnico de CAMORA: los 11 encuadres reales y el PDF de 21 páginas | Storyboard en celuloide + visor de PDF |
| 6 · Video | El video de movimientos de cámara (113 s) y su PDF de 24 páginas | Sala de cine con haz de proyector; el video se reproduce aquí mismo |
| 7 · Real vs IA | El documento de la productora con la comparación de imágenes reales contra IA (57 páginas) | Tira de páginas de muestra + visor con miniaturas, zoom amplio y pantalla completa |
| 8 · Animación digital | La Actividad 1 de conceptos de imagen digital, las dos mini secuencias en GIF y su storyboard cuadro a cuadro | Cinco tarjetas de conceptos + los GIFs en marcos de sala + el storyboard de los 30 fotogramas |

## Visor de PDF sin internet

Los documentos están incrustados en la carpeta y se ven con PDF.js local: el visor es TODO pantalla para la presentación — la barra de controles aparece solo al tocar la pantalla y se esconde sola; el documento se pasa solo, una página cada 2 segundos (con pausa), y los documentos LARGOS (como el de 57 páginas) no se pasan completos: primeras 15 páginas y salto directo a las últimas. Lo demás son solo los botones necesarios: anterior, siguiente, zoom del 50% al 300% y pantalla completa. Primera apertura de cada documento tarda un instante.

## Dónde cambiar cosas

- Textos de las secciones: `index.html` (cada bloque está comentado).
- Colores y tamaños: `assets/css/estilos.css` (variables al inicio del archivo).
- Para reemplazar una imagen o un PDF: sustituye el archivo en `assets/` con el mismo nombre y no hay que tocar nada más.
- El proyecto grande está en `assets/cami-x-david/` tal como fue entregado: no renombrar sus archivos internos.

## Créditos y licencias

- Fuentes «cami» tradicional y gótica: creadas por **cami4844** en FontStruct (licencia FontStruct Non-Commercial; ver `assets/fonts/licencia-fuente.txt` y `leeme-fuente.txt`).
- GSAP 3.12.5 y PDF.js 3.11.174 incrustados localmente (cdnjs y Mozilla); detalles en `CREDITOS.md`.

## Nota

La comparación de imágenes con IA volvió al portafolio por orden de Cami (2026-10-17) como escena propia: «Real vs IA», con el documento completo de 57 páginas.
