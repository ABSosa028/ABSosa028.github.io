# Panel de Administración TurisAR

Este directorio contiene los archivos relacionados con el panel de administración del sistema TurisAR.

## Credenciales de acceso

Para ingresar al panel de administración, utilice cualquiera de las siguientes credenciales:

- **Usuario:** admin
- **Contraseña:** admin123

o bien:

- **Usuario:** profesor
- **Contraseña:** ia12025

## Funcionalidades principales

El panel de administración permite:

1. **Gestión de sitios turísticos:** Agregar, editar y eliminar sitios turísticos, incluyendo toda su información asociada.
2. **Gestión de marcadores AR:** Administrar los marcadores de realidad aumentada que el sistema puede reconocer.
3. **Gestión de filtros faciales:** Administrar los filtros de realidad aumentada disponibles para cada sitio turístico.

## Estructura de datos

Los datos se almacenan en el localStorage del navegador con las siguientes claves:

- `turisarAuth`: Estado de autenticación
- `turisarUsername`: Nombre del usuario actual
- `turisarSites`: Array JSON de sitios turísticos
- `turisarMarkers`: Array JSON de marcadores AR
- `turisarFilters`: Array JSON de filtros faciales

## Extensibilidad

Para agregar nuevas funcionalidades al panel de administración:

1. Añadir una nueva opción de menú en la barra lateral del archivo dashboard.html
2. Crear una nueva sección de contenido en el mismo archivo
3. Implementar la lógica en el archivo admin.js
4. Definir los estilos necesarios en admin.css
