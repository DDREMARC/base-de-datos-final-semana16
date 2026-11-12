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

## Conectar el panel a Oracle (siguiente paso)

Cambiar en `js/datos.js` las funciones `api.list / insert / update / remove`
por `fetch()` a un backend (PHP con oci8, Node con oracledb o Java JDBC).
La interfaz no cambia.
