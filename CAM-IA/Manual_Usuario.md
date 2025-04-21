# Manual de Usuario – **TurisAR**


---
![image](https://github.com/user-attachments/assets/e1a29d63-fecb-4259-84cd-69e270972bbe)


## 1. ¿Qué es TurisAR?

TurisAR es una aplicación web que combina **turismo** y **realidad aumentada (AR)** para que cualquier persona explore sitios increíbles ― desde las 7 Maravillas del Mundo hasta tesoros de Guatemala ― apuntando la cámara a marcadores impresos o en pantalla.

| Área visible                                     | Propósito principal                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Sitio Público** (`index.html`)                 | Presenta la experiencia AR al visitante.                                                     |
| **Panel de Administración** (`admin/admin.html`) | Permite a los administradores gestionar sitios turísticos, marcadores AR y filtros faciales. |

---

## 2. Requisitos básicos

| Recurso       | Detalle                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| **Navegador** | Chrome, Edge u Opera / Firefox 2022 o posterior (soporte WebGL y WebRTC). |
| **Cámara**    | Cualquier cámara web o de móvil con resolución mínima 720 p.              |
| **Conexión**  | Internet estable para descargar modelos y multimedia.                     |

---

## 3. Estructura del proyecto


![image](https://github.com/user-attachments/assets/502f0c2f-dc8e-424c-b2be-3fdc72017600)

---

## 4. Uso del Sitio Público (`index.html`)
![image](https://github.com/user-attachments/assets/01e3ae2a-803d-4fcd-ac77-35d48cd9f229)
### 4.1 Navegación principal

- **Inicio** ▸ regresa a la portada.
- **Maravillas** ▸ muestra la galería de sitios (en desarrollo).
- **Iniciar Sesión** ▸ acceso exclusivo para administradores.

### 4.2 Secciones destacadas

| Sección             | Acción principal                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| **Hero**            | Pulsar **“Iniciar Experiencia AR”** abre `ar-view.html` para comenzar el escaneo.              |
| **Características** | Tarjetas que resumen: *Maravillas del Mundo*, *Maravillas de Guatemala* y *Filtros temáticos*. |

---

## 5. Experiencia AR (`ar-view.html`)

1. **Permite** el acceso a la cámara cuando el navegador lo solicite.
2. **Enfoca** un marcador válido (imagen de alta definición con buen contraste).
3. Aparecerá un **modelo 3D** o panel informativo sobre el sitio reconocido.
4. Presiona en pantalla para alternar vistas o capturar fotos con filtros temáticos.

> **Consejo:** ilumina bien el marcador y evita reflejos para mejorar la detección.

![image](https://github.com/user-attachments/assets/a991834e-1ec2-45bd-b7b2-5ea316a5b4a1)
![image](https://github.com/user-attachments/assets/e4ae7850-3776-42c5-aa7d-4013171a9135)


---

## 6. Panel de Administración (`admin/admin.html`)

| Sección               | Funcionalidades clave                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| **Dashboard**         | Estadísticas rápidas y accesos directos a acciones frecuentes.                   |
| **Sitios Turísticos** | CRUD completo de lugares: crear, listar, editar y eliminar.                      |
| **Marcadores AR**     | Subir imágenes‑marcador y asignarlas a sitios.                                   |
| **Filtros Faciales**  | Añadir, editar y eliminar modelos 3D para selfies.                               |
| **Configuración**     | Exportar / Importar toda la configuración vía JSON; editor de texto incorporado. |
| **Cerrar Sesión**     | Finaliza la sesión administrativa.                                               |

![image](https://github.com/user-attachments/assets/f6ee6125-c27a-423e-a011-540fa6b539d1)


### 6.1 Flujo para agregar un nuevo sitio

1. **Inicia sesión** como administrador desde `login.html`.
2. Ve a **Sitios Turísticos** y pulsa **`+ Nuevo Sitio`**.
3. Completa el formulario:
   - **ID único** (ej. `GT-001`).
   - **Nombre**, **País**, **Tipo** (mundial, Guatemala u otro).
   - **Descripción** breve y **Historia** detallada.
   - Enlaces a **mapa** (Google Maps) y **web** oficial.
   - Selecciona un **marcador AR** y un **filtro facial** previamente creados.
   - Sube hasta **4 imágenes** (previstas al instante).
4. Pulsa **Guardar**. El sitio se mostrará en la tabla y estará disponible en la experiencia AR.

### 6.2 Gestión de marcadores y filtros

| Acción                  | Ruta                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------- |
| **Crear marcador**      | Sección *Marcadores AR* → **`+ Nuevo Marcador`** → subir PNG/JPG de alto contraste. |
| **Crear filtro facial** | Sección *Filtros Faciales* → **`+ Nuevo Filtro`** → subir o elegir modelo 3D.       |
| **Editar / eliminar**   | Íconos  (editar) o (borrar) sobre cada tarjeta.                               |

---

---

## Solución rápida de problemas

| Problema                              | Posible causa                      | Solución                                                     |
| ------------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| **La cámara no se activa**            | Permiso denegado en el navegador.  | Haz clic en el candado 🔒 junto a la URL y permite "Cámara". |
| **Marcador no reconocido**            | Mala iluminación o imagen borrosa. | Mejora la luz o imprime el marcador en alta resolución.      |
| **No se guardan datos**               | Campos obligatorios vacíos.        | Revisa mensajes de error y completa los campos resaltados.   |
| **Botón Importar JSON deshabilitado** | No se ha seleccionado archivo.     | Usa "Seleccionar archivo JSON" antes de importar.            |


---



