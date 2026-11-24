-- =====================================================================
-- EL TÍO SAM CHIFA — Consultas SQL (Q1 a Q20)
-- Curso: Bases de Datos — Tecsup 2026 — Grupo: Gabriel, Banda, Bustinza, Toledo
-- Requiere Oracle 12c o superior.
-- Ejecutar DESPUÉS de sql/tio_sam_oracle.sql (crea las tablas, la vista y los datos).
-- Fuente: Informe Final BDD - Grupo01, sección 4.3 (20 consultas SELECT).
-- Los resultados esperados son los que indica el informe (datos de la sección 4.2).
-- Nota: tio_sam_oracle.sql carga solo una parte de esos datos, así que los
-- resultados no coinciden fila por fila hasta cargar el conjunto completo.
-- =====================================================================

-- Q1: Tipos de categoría que existen en la carta
-- Resultado esperado:
-- categoria
-- Dulces
-- Guarniciones
-- Platos Comunes
-- Platos Mixtos
SELECT DISTINCT categoria
FROM menu_platos
ORDER BY categoria;

-- Q2: Platos con precio entre S/ 20 y S/ 30, del más caro al más barato
-- Resultado esperado:
-- codigo | nombre | precio
-- CHI-004 | Chaufa Mixto | 29
-- CHI-005 | Aeropuerto | 27
-- CHI-002 | Lomo Saltado | 26
-- CHI-003 | Tallarín Saltado | 23
-- CHI-001 | Arroz Chaufa | 22
SELECT codigo, nombre, precio
FROM menu_platos
WHERE precio BETWEEN 20 AND 30
ORDER BY precio DESC;

-- Q3: Platos «saltados» con el nombre en mayúsculas
-- Resultado esperado:
-- codigo | plato | precio
-- CHI-002 | LOMO SALTADO | 26
-- CHI-003 | TALLARÍN SALTADO | 23
SELECT codigo, UPPER(nombre) AS plato, precio
FROM menu_platos
WHERE nombre LIKE '%Saltado%';

-- Q4: Empleados mozos o cajeros con sueldo desde S/ 1,300
-- Resultado esperado:
-- codigo | nombre | cargo | sueldo_soles
-- E-002 | Daniela Pérez Rojas | Mozo | 1300
-- E-003 | Kevin Huaman Soto | Cajero | 1400
-- E-005 | Rubén Choy Vargas | Mozo | 1300
SELECT codigo, nombre, cargo, sueldo AS sueldo_soles
FROM empleados
WHERE cargo IN ('Mozo','Cajero') AND sueldo >= 1300;

-- Q5: Etiqueta de cliente: nombre + código, inicio del DNI y largo del nombre
-- Resultado esperado:
-- cliente | dni_oculto | largo_nombre
-- María Quispe Flores (C-001) | 4578**** | 19
-- Jorge Huamán Ríos (C-002) | 4123**** | 17
-- Rosa Delgado Paredes (C-003) | 0987**** | 20
-- Carlos Mendoza Vera (C-004) | 4765**** | 19
-- Lucía Torres Campos (C-005) | 4332**** | 19
-- Pedro Salas Gutiérrez (C-006) | 0876**** | 21
SELECT nombre || ' (' || codigo || ')' AS cliente,
       SUBSTR(dni, 1, 4) || '****' AS dni_oculto,
       LENGTH(nombre) AS largo_nombre
FROM clientes;

-- Q6: Pedidos que no tienen mesa (para llevar o delivery)
-- Resultado esperado:
-- id | modalidad | mesa
-- 2 | Para llevar | 0
-- 4 | Para llevar | 0
-- 6 | Delivery | 0
SELECT id, modalidad, NVL(mesa_id, 0) AS mesa
FROM pedidos
WHERE mesa_id IS NULL;

-- Q7: Precio mínimo, máximo y promedio por categoría
-- Resultado esperado:
-- categoria | minimo | maximo | promedio
-- Dulces | 6 | 10 | 8
-- Guarniciones | 6 | 12 | 9
-- Platos Comunes | 22 | 26 | 23.67
-- Platos Mixtos | 27 | 32 | 29.33
SELECT categoria,
       MIN(precio) AS minimo,
       MAX(precio) AS maximo,
       ROUND(AVG(precio), 2) AS promedio
FROM menu_platos
GROUP BY categoria
ORDER BY categoria;

-- Q8: Categorías cuyo precio promedio supera S/ 15
-- Resultado esperado:
-- categoria | cantidad_platos | promedio
-- Platos Comunes | 3 | 23.67
-- Platos Mixtos | 3 | 29.33
SELECT categoria, COUNT(*) AS cantidad_platos, ROUND(AVG(precio), 2) AS promedio
FROM menu_platos
GROUP BY categoria
HAVING AVG(precio) > 15;

-- Q9: Clasificación de platos según su precio
-- Resultado esperado:
-- nombre | precio | rango
-- Alfajor Chino | 6 | Económico
-- Arroz Blanco | 6 | Económico
-- Duraznos en Almíbar | 8 | Económico
-- Papas Fritas | 9 | Económico
-- Helado de Lúcuma | 10 | Estándar
-- Wantán Frito | 12 | Estándar
-- Arroz Chaufa | 22 | Estándar
-- Tallarín Saltado | 23 | Estándar
-- Lomo Saltado | 26 | Premium
-- Aeropuerto | 27 | Premium
-- Chaufa Mixto | 29 | Premium
-- Kam Lu Wantán | 32 | Premium
SELECT nombre, precio,
       CASE WHEN precio < 10 THEN 'Económico'
            WHEN precio < 25 THEN 'Estándar'
            ELSE 'Premium'
       END AS rango
FROM menu_platos
ORDER BY precio, nombre;

-- Q10: Pedidos con el nombre del cliente y del empleado que atendió
-- Resultado esperado:
-- pedido | cliente | atendio | modalidad | estado
-- 1 | María Quispe Flores | Daniela Pérez Rojas | Mesa | Entregado
-- 2 | Jorge Huamán Ríos | Kevin Huaman Soto | Para llevar | Entregado
-- 3 | Carlos Mendoza Vera | Daniela Pérez Rojas | Mesa | En cocina
-- 4 | Lucía Torres Campos | Kevin Huaman Soto | Para llevar | Pendiente
-- 5 | Pedro Salas Gutiérrez | Rubén Choy Vargas | Mesa | Entregado
-- 6 | María Quispe Flores | Kevin Huaman Soto | Delivery | Entregado
SELECT p.id AS pedido, c.nombre AS cliente, e.nombre AS atendio, p.modalidad, p.estado
FROM pedidos p
INNER JOIN clientes c ON c.id = p.cliente_id
INNER JOIN empleados e ON e.id = p.empleado_id
ORDER BY p.id;

-- Q11: Total de cada pedido calculado desde el detalle
-- Resultado esperado:
-- pedido | cliente | total
-- 3 | Carlos Mendoza Vera | 112
-- 5 | Pedro Salas Gutiérrez | 68
-- 1 | María Quispe Flores | 56
-- 6 | María Quispe Flores | 40
-- 2 | Jorge Huamán Ríos | 27
-- 4 | Lucía Torres Campos | 23
SELECT p.id AS pedido, c.nombre AS cliente, SUM(d.cantidad * d.precio_unitario) AS total
FROM pedidos p
JOIN detalle_pedido d ON d.pedido_id = p.id
JOIN clientes c ON c.id = p.cliente_id
GROUP BY p.id, c.nombre
ORDER BY total DESC;

-- Q12: Cantidad de pedidos por cliente (incluye quienes no pidieron)
-- Resultado esperado:
-- nombre | pedidos
-- María Quispe Flores | 2
-- Carlos Mendoza Vera | 1
-- Jorge Huamán Ríos | 1
-- Lucía Torres Campos | 1
-- Pedro Salas Gutiérrez | 1
-- Rosa Delgado Paredes | 0
SELECT c.nombre, COUNT(p.id) AS pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.nombre
ORDER BY pedidos DESC, c.nombre;

-- Q13: Platos de la carta que nunca se han pedido
-- Resultado esperado:
-- codigo | nombre
-- CHI-006 | Kam Lu Wantán
-- CHI-012 | Alfajor Chino
SELECT m.codigo, m.nombre
FROM menu_platos m
LEFT JOIN detalle_pedido d ON d.plato_id = m.id
WHERE d.id IS NULL
ORDER BY m.codigo;

-- Q14: Platos más caros que el precio promedio de la carta
-- Resultado esperado:
-- nombre | precio
-- Kam Lu Wantán | 32
-- Chaufa Mixto | 29
-- Aeropuerto | 27
-- Lomo Saltado | 26
-- Tallarín Saltado | 23
-- Arroz Chaufa | 22
SELECT nombre, precio
FROM menu_platos
WHERE precio > (SELECT AVG(precio) FROM menu_platos)
ORDER BY precio DESC;

-- Q15: Clientes que tienen al menos un pedido entregado
-- Resultado esperado:
-- nombre | telefono
-- María Quispe Flores | 987 654 321
-- Jorge Huamán Ríos | 945 231 876
-- Pedro Salas Gutiérrez | 913 902 456
SELECT nombre, telefono
FROM clientes
WHERE id IN (SELECT cliente_id FROM pedidos WHERE estado = 'Entregado');

-- Q16: Empleados que han atendido pedidos
-- Resultado esperado:
-- nombre | cargo
-- Daniela Pérez Rojas | Mozo
-- Kevin Huaman Soto | Cajero
-- Rubén Choy Vargas | Mozo
SELECT e.nombre, e.cargo
FROM empleados e
WHERE EXISTS (SELECT 1 FROM pedidos p WHERE p.empleado_id = e.id);

-- Q17: Lista única de personas del sistema (clientes y empleados)
-- Resultado esperado:
-- nombre | tipo
-- Carlos Mendoza Vera | Cliente
-- Jorge Huamán Ríos | Cliente
-- Lucía Torres Campos | Cliente
-- María Quispe Flores | Cliente
-- Pedro Salas Gutiérrez | Cliente
-- Rosa Delgado Paredes | Cliente
-- Daniela Pérez Rojas | Empleado
-- Kevin Huaman Soto | Empleado
-- Li Wong Tang | Empleado
-- Lian Zhang Rojas | Empleado
-- Rubén Choy Vargas | Empleado
-- Wilmer Chang Lau | Empleado
SELECT nombre, 'Cliente' AS tipo FROM clientes
UNION
SELECT nombre, 'Empleado' FROM empleados
ORDER BY tipo, nombre;

-- Q18: Empleados que todavía no han atendido ningún pedido
-- Resultado esperado:
-- id | nombre
-- 1 | Wilmer Chang Lau
-- 4 | Li Wong Tang
-- 6 | Lian Zhang Rojas
SELECT id, nombre
FROM empleados
MINUS
SELECT e.id, e.nombre
FROM empleados e
JOIN pedidos p ON p.empleado_id = e.id;

-- Q19: Los 3 platos más vendidos (por unidades)
-- Resultado esperado:
-- nombre | unidades
-- Arroz Chaufa | 3
-- Chaufa Mixto | 3
-- Papas Fritas | 3
SELECT m.nombre, SUM(d.cantidad) AS unidades
FROM detalle_pedido d
JOIN menu_platos m ON m.id = d.plato_id
GROUP BY m.nombre
ORDER BY unidades DESC, m.nombre
FETCH FIRST 3 ROWS ONLY;

-- Q20: Dinero cobrado por método de pago (solo pagos confirmados)
-- Resultado esperado:
-- metodo | pagos | total_cobrado
-- Efectivo | 2 | 96
-- Tarjeta | 1 | 68
-- Yape/Plin | 1 | 27
SELECT metodo, COUNT(*) AS pagos, SUM(monto) AS total_cobrado
FROM pagos
WHERE estado = 'Pagado'
GROUP BY metodo
ORDER BY total_cobrado DESC;
