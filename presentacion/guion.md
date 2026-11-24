# Guion de exposición · El Tío Sam Chifa · 10 minutos

Formato: 10 min de diapositivas, hablado. Después, cada integrante corre **una** query en vivo (aparte de los 10 min).
Ritmo: unas 130 palabras por minuto. Cada bloque abajo ya está medido.
Datos tomados del informe y del script Oracle (tio_sam_oracle.sql).

| Bloque | Quién | Diapositivas | Tiempo |
|---|---|---|---|
| Apertura | Gabriel | 1 | 0:45 |
| Parte 1 | Gabriel | 2–3 | 1:45 |
| Parte 2 | Banda | 4–5 | 2:15 |
| Parte 3 | Bustinza | 6–7 | 1:45 |
| Parte 4 | Toledo | 8–9 | 1:45 |
| Cierre | Toledo | 10 | 0:30 |
| Margen | — | — | 1:15 |

Por persona: Gabriel 2:30 (apertura y parte 1), Banda 2:15, Bustinza 1:45, Toledo 2:15 (parte 4 y cierre). Total 10:00. Las cuatro consultas en vivo (diapositivas 11 a 14) quedan fuera de los 10 minutos.
Cronometrar con todo el grupo. Si pasan de 10 min, recorten los ejemplos de consultas.

---

## Apertura · Gabriel · 0:45

Buenas. Somos Gabriel, Banda, Bustinza y Toledo, y les presentamos la base de datos de **El Tío Sam Chifa**, un restaurante chifa. La hicimos en Oracle.

La base cubre el recorrido completo del negocio: alguien entra al sistema, mira el menú, hace un pedido y paga. Eso mismo es lo que vamos a seguir en la exposición, en cuatro partes. Yo empiezo con el menú y el acceso, Banda sigue con los diagramas, Bustinza con las mesas y los pedidos, y Toledo cierra con el detalle y los pagos.

Al final cada uno corre una consulta en vivo.

---

## Parte 1 · Gabriel · 1:45 · "La carta y la puerta de entrada"

Empiezo por el prototipo. Es una página clicable con 9 pantallas: login, catálogo, modificar un plato, clientes, pedidos, detalle, pagos, resumen del día y el SQL que se genera. *(Mostrar la captura del catálogo, Fig 2.)*

Detrás de esas pantallas hay dos tablas mías.

**`menu_platos`** es la carta. Tiene 7 campos y 12 platos de prueba. Cada plato tiene su código, su nombre, su categoría y su precio.

**`usuarios`** es el acceso. Cada usuario es un cliente o un empleado, nunca los dos a la vez. Lo agregamos en la versión 2, porque la primera versión no tenía login.

Mis consultas son de la 1 a la 6. Por ejemplo, la Q2 busca los platos que cuestan entre S/ 20 y S/ 30, y salen 5. La Q6 muestra los pedidos sin mesa, que son los de para llevar.

*(Pasa la palabra a Banda.)* Ahora Banda les muestra cómo se conecta todo.

---

## Parte 2 · Banda · 2:15 · "Quién compra y quién atiende"

Gracias. Yo les muestro los dos diagramas.

El **MER**, el modelo entidad-relación, es el mapa del negocio. Ahí se ven las entidades y cómo se relacionan: un pedido pertenece a un cliente, lo atiende un empleado y puede tener una mesa. *(Mostrar Fig 10.)*

El **DER** baja ese mapa a tablas. Cada tabla tiene su llave primaria, que es el campo `id`, y sus llaves foráneas. Por ejemplo, `pedidos.cliente_id` apunta a `clientes.id`. *(Mostrar Fig 11.)*

Mis dos tablas:

**`clientes`** guarda el DNI, que tiene 8 dígitos y es único, para que no se repita un cliente.

**`empleados`** guarda el cargo. Solo se permiten cuatro: Cocinero, Mozo, Cajero y Administrador. Eso lo controla una restricción CHECK.

El curso pedía hasta 2FN, y el diseño la cumple y además llega a 3FN. Cada tabla tiene una llave primaria de un solo campo, el id, así que todo atributo depende de la llave completa: eso es 2FN. No hay dependencias transitivas, salvo una que conviene decir: `usuarios.rol` se deduce de `cliente_id` o `empleado_id`.

Mis consultas son de la 7 a la 12. La Q7 saca mínimo, máximo y promedio de precio por categoría. La Q11 calcula el total de cada pedido.

---

## Parte 3 · Bustinza · 1:45 · "Mesas y pedidos del día a día"

Yo explico el centro del sistema.

**`mesas`** guarda el número de mesa, que es único. Hay 3 zonas y 3 estados posibles.

**`pedidos`** es la cabecera de cada pedido: quién compra, quién atiende, la fecha, la modalidad y el estado. Dos decisiones de diseño importantes:

Primera, **no guardamos el total**. Se calcula sumando el detalle. Así nunca hay un total desactualizado.

Segunda, **la mesa solo es obligatoria si el pedido es de modalidad Mesa**. Los de para llevar no tienen mesa. Eso lo asegura una restricción.

Mis consultas son de la 13 a la 17. La Q13 muestra los platos que nunca se pidieron, que son Kam Lu Wantán y Alfajor Chino. La Q17 junta dos listas con UNION.

---

## Parte 4 · Toledo · 1:45 · "Del pedido al cobro"

Cierro el recorrido.

**`detalle_pedido`** tiene una línea por plato dentro de un pedido. Un plato no se puede repetir en el mismo pedido, porque hay una restricción UNIQUE sobre pedido y plato. Si piden dos porciones, va en la cantidad. Guardamos también `precio_unitario`, a propósito: así el pedido conserva el precio que se cobró aunque después cambie la carta.

**`pagos`** guarda cada cobro, ligado a su pedido. Se paga en Efectivo, Tarjeta o Yape/Plin, y el estado puede ser Pagado, Pendiente o Anulado.

Mis consultas son de la 18 a la 20. La Q19 muestra los platos más vendidos, y la Q20 suma lo cobrado por método de pago: Efectivo S/ 96, Tarjeta S/ 68 y Yape/Plin S/ 27.

---

## Cierre · Toledo · 0:30

Para resumir: ocho tablas y una vista, 37 restricciones, 20 consultas y 30 cláusulas distintas, todo sobre el mismo esquema. El total sale del detalle y el precio queda guardado como historial.

Gracias. Ahora cada uno corre una consulta en vivo, y después respondemos preguntas.

---

## Consultas en vivo (fuera de los 10 min)

Una por persona. Correrla antes en Oracle 12c o superior y llevar una captura de respaldo. Nada de este SQL se ha ejecutado en Oracle todavía.

| Quién | Sugerida | Qué muestra |
|---|---|---|
| Gabriel | Q2 | Platos entre S/ 20 y S/ 30 (5 filas) |
| Banda | Q11 | Total de cada pedido (JOIN + SUM + GROUP BY) |
| Bustinza | Q13 | Platos nunca pedidos (LEFT JOIN + IS NULL) |
| Toledo | Q20 | Cobro por método de pago |

## Preguntas que pueden hacerles

- **¿Por qué no hay total en `pedidos`?** Para no repetir datos. Si cambia una línea, el total se recalcula solo.
- **¿Por qué `mesa_id` puede ser nulo?** Un pedido para llevar no tiene mesa. La regla pide mesa solo en modalidad Mesa.
- **¿Por qué un plato no se repite en un pedido?** Por el UNIQUE (pedido, plato). Las porciones van en `cantidad`.
- **¿Por qué `precio_unitario`?** Para conservar el precio cobrado aunque la carta cambie. Es una copia deliberada: el precio cambia con el tiempo, así que no depende solo del plato, y por eso no rompe 2FN ni 3FN.
- **¿Cumple 3FN?** Cumple 2FN (lo que pidió el curso) y además 3FN. Hay dos excepciones: `usuarios.rol`, que se deduce de `cliente_id` o `empleado_id`, y `precio_unitario`, que repite el precio de la carta a propósito.
- **¿Qué pasa al borrar un pedido?** No hay cascade. Primero se borran sus líneas de detalle.
- **¿Qué cambió de la versión 1 a la 2?** Se agregó `usuarios`, `pagos` ahora depende de `pedidos`, `resumen_dia` pasó a ser una vista y se quitó `pedidos.total`.
