# Manual Técnico – **AR View** con MindAR JS y A‑Frame


---

## Descripción general
**AR View** es una aplicación web de realidad aumentada que utiliza **MindAR JS** para el reconocimiento de marcadores y **A‑Frame** como motor de renderizado 3D. El sistema permite superponer imágenes, videos e información contextual sobre marcadores impresos o mostrados en pantalla. Los datos de las "maravillas" (lugares turísticos, puntos de interés, etc.) se cargan dinámicamente desde `localStorage`, con distintos formatos de respaldo.

### Objetivos
- Reconocer múltiples marcadores definidos en un archivo `.mind`.
- Mostrar portafolios de imágenes y videos asociados a cada marcador.
- Proporcionar botones interactivos (descripción, mapa, sitio web, cámara con filtro, etc.).
- Facilitar la ampliación del sistema sin recompilar el código fuente.

---

## Requisitos previos
### Hardware
| Requisito | Detalle |
|-----------|---------|
| **Cámara** | WebCam o cámara móvil con acceso vía navegador |
| **Impresión de marcadores** | Hoja con los marcadores generados desde *MindAR Creator* |

### Software
| Requisito | Versión mín. | Notas |
|-----------|--------------|-------|
| **Navegador** | Chrome 96 +, Edge 96 +, Safari 15 + | Debe soportar WebXR o getUserMedia |
| **Servidor estático** | Cualquiera | Ej.: *Live Server*, *http‑server*, *serve* o Nginx |
| **Node.js** (opcional) | 14 + | Para levantar un servidor local rápidamente |

### Dependencias web
Las bibliotecas se cargan vía CDN en el `<head>`:
```html
<script src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.2/dist/aframe.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.2/dist/mindar.js"></script>
<script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js"></script>
```
*Nota:* si necesitas soporte offline, descarga estos archivos y referencia rutas locales.

---

## Estructura del proyecto
```
project-root/
├── index.html              
├── Camara.html             
├── mero.mind               
├── completa.mind           
├── maravillas/
│   ├── 0.jpeg … 19.jpeg    
│   └── videos/
│       ├── muralla1.mp4
│       └── …
├── assets/
│   ├── filtros/            
│   ├── audios/             
│   └── icons/              
└── README.md / docs/       
```

---

## Flujo de ejecución
```
+--------------+      cámara       +-----------------+     render        +------------------+
| Marcador (.mind) | ─────────────▶ | MindAR Detector | ────────────────▶ | Entidades A‑Frame |
+--------------+                   +-----------------+                  +------------------+
        ▲                                   │                                      |
        │        datos dinámicos            │ crea entidades / eventos             ▼
        └───────────── localStorage  ◀──────┴──────────  scripts JS      Portafolio & UI
```
1. **MindAR** reconoce un `targetIndex` según la cámara.
2. El script genera dinámicamente un `<a-entity>` por cada índice.
3. Se adjuntan planos, textos y botones interactivos.
4. El usuario puede navegar imágenes, abrir links o activar filtros.

---

## Configuración y puesta en marcha
1. **Clona** o descarga el repositorio.
2. Genera tu propio archivo `.mind` (via [MindAR Creator](https://hiukim.github.io/mind-ar-js-doc/)) y reemplaza `mero.mind`.
3. Copia tus imágenes, videos y audios en las carpetas indicadas.
4. Edita `index.html` para actualizar las rutas dentro del objeto `jsonData` *o* precarga datos en `localStorage` usando la consola:
   ```js
   localStorage.setItem("originalMaravillasJSON", JSON.stringify({
     mind: "mero.mind",
     maravillas: [ /* … */ ]
   }));
   ```
5. **Levanta un servidor** local (requerido por la API de cámara):
   ```bash
   # con Node.js
   npx http-server . -p 8080 -c-1
   ```
6. Abre `http://localhost:8080` en un navegador compatible y concede permiso a la cámara.

---

## Detalle del código
### 1. Encabezado `<head>`
| Sección | Propósito |
|---------|-----------|
| *Meta tags* | Habilitar PWA y viewport responsive |
| *Scripts CDN* | Cargar A‑Frame + MindAR |
| *Estilos*    | Elimina márgenes y ocupa toda la pantalla |

### 2. Escena A‑Frame
```html
<a-scene mindar-image="imageTargetSrc: mero.mind; autoStart: true;"
         renderer="colorManagement: true; physicallyCorrectLights"
         vr-mode-ui="enabled: true"
         device-orientation-permission-ui="enabled: true">
  <a-camera position="0 0 0" cursor="rayOrigin: mouse;" raycaster="objects: .clickable"></a-camera>
</a-scene>
```
- `mindar-image` liga la escena al archivo `.mind`.
- `raycaster` permite hacer *click* en iconos desde móvil (tap) o escritorio (mouse).

### 3. Carga de datos dinámica
La función `loadMaravillasData()` busca, en orden:
1. `originalMaravillasJSON`
2. `siteDB`
3. `turisarSites`

Si ninguna clave existe, muestra un mensaje y retorna una estructura vacía.

### 4. Generación de assets
```js
const assets = document.createElement("a-assets");
// Imágenes
img.setAttribute("id", `maravilla-image-${idx + 1}`);
// Videos
vid.setAttribute("autoplay", "false");
vid.setAttribute("loop", "true");
```
Todos los recursos se precargan para evitar *flicker* al mostrar.

### 5. Entidades por marcador
Por cada `targetIndex` se crea:
- Plano con imagen principal (`a-plane`).
- Portafolio (`a-entity`) que contiene todas las imágenes y botones de navegación (`icon-left`, `icon-right`).
- Botones inferiores: filtro de cámara, descripción, web, mapa, historia, etc. Cada botón actualiza un `a-text` inferior.

### 6. Navegación de portafolio
La entidad guarda el índice actual en `data-current-img`. Los eventos `click` en los iconos actualizan `visible` en la imagen correspondiente.

```js
currentIndex = (currentIndex + 1) % imagenesPortafolio.length;
```

---

## Extensión y personalización
| Caso | Acción |
|------|--------|
| **Añadir una nueva maravilla** | Agrega un objeto dentro de `maravillas` o inserta vía `localStorage`. Incluye índices consecutivos de tu `.mind`. |
| **Cambiar iconos** | Sustituye archivos PNG en `assets/`. Asegúrate de conservar los `id` en el arreglo `icons`. |
| **Filtros AR adicionales** | Crea un PNG transparente y actualiza la URL de `filtro` en la maravilla. El filtro se aplica en `Camara.html`. |
| **Soporte multilingüe** | Internacionaliza textos almacenando claves `i18n` y usando `navigator.language` para elegir. |

---

## Despliegue a producción
1. **HTTPS obligatorio**: cámaras sólo funcionan en orígenes seguros. Usa *GitHub Pages*, *Vercel*, *Netlify* o configura HTTPS en tu servidor.
2. **Optimiza assets**: comprime imágenes (`webp/avif`) y videos (H.264 AAC, resolución ≤ 720 p).
3. **Service Worker (opcional)**: convierte la app en PWA para acceso offline.

---

## Pruebas y depuración
| Herramienta | Uso |
|-------------|-----|
| **Consola del navegador** | Busca errores de CORS o rutas incorrectas. |
| **`mindar.js` dev tools** | `window.MINDAR.IMAGE.debug()` muestra bounding‑boxes. |
| **Lighthouse** | Audita desempeño y PWA compliance. |

---

## Prácticas y seguridad
- Valida la entrada antes de almacenarla en `localStorage` para evitar XSS.
- Usa *Subresource Integrity* (SRI) o empaqueta dependencias para evitar ataques de *supply chain*.
- Divide tu `.mind` en varios archivos si superas **100 targets** (limite práctico en móviles antiguos).
- Respeta los derechos de autor de imágenes, videos y audios.

---

## Glosario
| Término | Definición |
|---------|------------|
| **MindAR** | Librería JavaScript libre para RA basada en visión por computador. |
| **Target Index** | Posición numérica del marcador dentro del archivo `.mind`. |
| **A‑Frame** | Framework de alto nivel para WebXR basado en entidades/componentes. |
| **Raycaster** | Mecanismo de A‑Frame para detectar colisiones entre un rayo y entidades clicables. |

---

## Licencia y créditos
Este proyecto se distribuye bajo la licencia **MIT** salvo que se indique lo contrario. Los iconos provienen del set *HeroIcons* (licencia MIT). MindAR JS es de @hiukim (licencia MIT). A‑Frame es un proyecto de Mozilla (licencia MPL 2.0).

---



