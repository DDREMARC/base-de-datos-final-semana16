# El Tío Sam Chifa — Proyecto final Bases de Datos

Tecsup 2026 · C24S A-1 · Grupo: Gabriel, Banda, Bustinza, Toledo.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Panel web: login, una pestaña por tabla, agregar / editar / borrar. |
| `css/estilos.css` | Estilos (colores del chifa). |
| `js/datos.js` | Capa de datos (`api`) y datos iniciales. Genera el SQL Oracle de cada acción. |
| `js/app.js` | Esquema de campos, pantallas y acciones. |
| `sql/tio_sam_oracle.sql` | Esquema Oracle v2: 8 tablas, 1 vista, datos de prueba. Requiere Oracle 12c+. |
| `Gabriel.sql`, `Banda.sql`, `Bustinza.sql`, `Toledo.sql` | Tablas por integrante (versión anterior). |
| `tablas-proyecto-final.sql` | Esquema v1 (anterior). |

## Cómo probar el panel

Abrir `index.html` en el navegador. Usuario `admin`, clave `admin123`.
Los cambios se guardan en el navegador. La pestaña **SQL Oracle** muestra el
`INSERT` / `UPDATE` / `DELETE` equivalente para pegar en SQL Developer.

## Cómo crear la base en Oracle

1. Abrir SQL Developer con Oracle 12c o superior.
2. Ejecutar `sql/tio_sam_oracle.sql` completo (F5).
3. Al final imprime los constraints por tabla y la vista `v_resumen_dia`.

## Conectar el panel a Oracle

El navegador no puede hablar con Oracle directo. El camino es:

`index.html` + `js/` → `api/api.php` (PHP en XAMPP) → Oracle

| Archivo | Qué hace |
|---|---|
| `api/conexion.php` | Usuario, clave y cadena de conexión a Oracle. |
| `api/api.php` | Recibe los pedidos del panel y ejecuta SELECT / INSERT / UPDATE / DELETE. |

### Pasos

1. **Crear la base.** Ejecutar `sql/tio_sam_oracle.sql` en Oracle 12c o superior.
2. **Copiar el proyecto a XAMPP.** Toda la carpeta dentro de `C:\xampp\htdocs\tio-sam\`.
3. **Habilitar oci8 en PHP.**
   - Instalar Oracle Instant Client (Basic, 64 bits) y agregar su carpeta al `PATH` de Windows.
   - En `C:\xampp\php\php.ini`, quitar el `;` de la línea `extension=oci8_19` (o `oci8_12c`, según la versión).
   - Reiniciar Apache. Comprobar en `http://localhost/dashboard/phpinfo.php` que aparece la sección **oci8**.
4. **Poner tus datos** en `api/conexion.php` (usuario, clave, cadena `//host:1521/servicio`).
5. **Probar el puente.** Abrir `http://localhost/tio-sam/api/api.php?tabla=clientes`. Debe salir una lista JSON.
6. **Activar el modo Oracle.** En `js/datos.js` cambiar `const USAR_ORACLE = false;` a `true`.
7. Abrir `http://localhost/tio-sam/`. Arriba debe decir **Oracle** en verde.

Importante: se abre con `http://localhost/...`, no con doble clic al archivo.
Con `USAR_ORACLE = false` el panel sigue funcionando solo, sin servidor.

Las reglas las pone Oracle: si un CHECK, UNIQUE o llave foránea rechaza el cambio,
el panel muestra el motivo.
