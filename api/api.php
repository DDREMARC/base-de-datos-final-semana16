<?php
/* =====================================================================
   API — El Tío Sam Chifa. Puente entre js/datos.js y Oracle.

   GET    api.php?tabla=clientes            -> lista todas las filas
   GET    api.php?tabla=v_resumen_dia        -> vista calculada
   POST   api.php?tabla=clientes             -> inserta (body: JSON)
   PUT    api.php?tabla=clientes&id=5        -> actualiza (body: JSON)
   DELETE api.php?tabla=clientes&id=5        -> borra
   POST   api.php?accion=login               -> body: {usuario, clave}
   ===================================================================== */

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/conexion.php';

// Columnas reales por tabla. Deben calzar con sql/tio_sam_oracle.sql.
// (el id y las columnas calculadas, como el total del pedido, no van aquí)
$TABLAS = [
    'menu_platos'    => ['codigo','nombre','categoria','precio','disponible','descripcion'],
    'clientes'       => ['codigo','nombre','dni','telefono','email','direccion'],
    'empleados'      => ['codigo','nombre','dni','telefono','cargo','sueldo','activo'],
    'usuarios'       => ['usuario','clave','rol','cliente_id','empleado_id','activo'],
    'mesas'          => ['numero','capacidad','zona','estado'],
    'pedidos'        => ['cliente_id','empleado_id','mesa_id','fecha','modalidad','estado'],
    'detalle_pedido' => ['pedido_id','plato_id','cantidad','precio_unitario'],
    'pagos'          => ['pedido_id','metodo','monto','fecha','estado'],
];
$COLUMNAS_FECHA = ['fecha']; // estas columnas son DATE en Oracle

/* ---------- Ayudantes ---------- */

// Traduce el error de Oracle a un mensaje que un estudiante entienda
function responder_error_oracle($stmt) {
    $e = oci_error($stmt);
    $codigo = $e['code'] ?? 0;
    $mensajes = [
        1    => 'Ese valor ya existe (restricción UNIQUE).',
        1400 => 'Falta llenar un campo obligatorio (NOT NULL).',
        2290 => 'Ese valor no está permitido para ese campo (restricción CHECK).',
        2291 => 'Ese ID no existe en la tabla relacionada (llave foránea).',
        2292 => 'No se puede borrar: otra tabla todavía usa este registro (llave foránea).',
    ];
    $msg = $mensajes[$codigo] ?? ('Error de Oracle (' . $codigo . '): ' . ($e['message'] ?? ''));
    http_response_code(400);
    echo json_encode(['error' => $msg]);
    exit;
}

// Ejecuta un SELECT y devuelve un array de filas con columnas en minúscula
function filas($conexion, $sql, $binds = []) {
    $stmt = oci_parse($conexion, $sql);
    foreach ($binds as $nombre => &$valor) {
        oci_bind_by_name($stmt, $nombre, $valor);
    }
    if (!oci_execute($stmt)) responder_error_oracle($stmt);
    $resultado = [];
    oci_fetch_all($stmt, $resultado, null, OCI_FETCHSTATEMENT_BY_ROW, OCI_ASSOC);
    oci_free_statement($stmt);
    // Solo estas columnas son números. El DNI y el teléfono se quedan como texto
    // (si no, un DNI como 09873421 perdería el cero inicial).
    $numericas = ['id','cliente_id','empleado_id','mesa_id','pedido_id','plato_id','precio','sueldo',
                  'numero','capacidad','cantidad','precio_unitario','monto','total_pedidos','recaudado'];
    return array_map(function ($fila) use ($numericas) {
        $limpia = [];
        foreach ($fila as $col => $val) {
            $col = strtolower($col);
            $limpia[$col] = (in_array($col, $numericas) && $val !== null) ? $val + 0 : $val;
        }
        return $limpia;
    }, $resultado);
}

/* ---------- Ruta: login ---------- */
if (($_GET['accion'] ?? '') === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];
    $usuario = $cuerpo['usuario'] ?? '';
    $clave   = $cuerpo['clave'] ?? '';
    $resultado = filas($conexion,
        "SELECT id, usuario, rol, cliente_id, empleado_id, activo
         FROM usuarios
         WHERE usuario = :usuario AND clave = :clave AND activo = 'S'",
        [':usuario' => $usuario, ':clave' => $clave]
    );
    if (!$resultado) {
        http_response_code(401);
        echo json_encode(['error' => 'Usuario o contraseña incorrectos']);
        exit;
    }
    echo json_encode($resultado[0]);
    exit;
}

/* ---------- Ruta: vista resumen del día ---------- */
if (($_GET['tabla'] ?? '') === 'v_resumen_dia') {
    echo json_encode(filas($conexion, 'SELECT * FROM v_resumen_dia'));
    exit;
}

/* ---------- Validar tabla pedida ---------- */
$tabla = $_GET['tabla'] ?? '';
if (!isset($TABLAS[$tabla])) {
    http_response_code(404);
    echo json_encode(['error' => 'Tabla no permitida: ' . $tabla]);
    exit;
}
$columnas = $TABLAS[$tabla];
$metodo = $_SERVER['REQUEST_METHOD'];

/* ---------- GET: listar ---------- */
if ($metodo === 'GET') {
    echo json_encode(filas($conexion, "SELECT * FROM $tabla ORDER BY id"));
    exit;
}

$cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];

/* ---------- POST: insertar ---------- */
if ($metodo === 'POST') {
    $campos_enviados = [];
    $binds = [];
    foreach ($columnas as $c) {
        if (!array_key_exists($c, $cuerpo)) continue;
        $campos_enviados[] = $c;
        $binds[":$c"] = ($cuerpo[$c] === '' ? null : $cuerpo[$c]);
    }
    $valores_sql = array_map(function ($c) use ($COLUMNAS_FECHA) {
        return in_array($c, $COLUMNAS_FECHA) ? "TO_DATE(:$c,'YYYY-MM-DD')" : ":$c";
    }, $campos_enviados);

    $sql = "INSERT INTO $tabla (" . implode(', ', $campos_enviados) . ")
            VALUES (" . implode(', ', $valores_sql) . ")
            RETURNING id INTO :nuevo_id";
    $stmt = oci_parse($conexion, $sql);
    foreach ($binds as $nombre => &$valor) {
        oci_bind_by_name($stmt, $nombre, $valor, $valor === null ? -1 : 4000);
    }
    $nuevo_id = 0;
    oci_bind_by_name($stmt, ':nuevo_id', $nuevo_id, 20);
    if (!oci_execute($stmt)) responder_error_oracle($stmt);
    oci_commit($conexion);

    $fila_nueva = filas($conexion, "SELECT * FROM $tabla WHERE id = :id", [':id' => $nuevo_id]);
    echo json_encode($fila_nueva[0] ?? ['id' => $nuevo_id]);
    exit;
}

/* ---------- PUT: actualizar ---------- */
if ($metodo === 'PUT') {
    $id = $_GET['id'] ?? 0;
    $sets = [];
    $binds = [':id_where' => $id];
    foreach ($columnas as $c) {
        if (!array_key_exists($c, $cuerpo)) continue;
        $sets[] = in_array($c, $COLUMNAS_FECHA) ? "$c = TO_DATE(:$c,'YYYY-MM-DD')" : "$c = :$c";
        $binds[":$c"] = ($cuerpo[$c] === '' ? null : $cuerpo[$c]);
    }
    if (!$sets) { echo json_encode(['ok' => true]); exit; }

    $sql = "UPDATE $tabla SET " . implode(', ', $sets) . " WHERE id = :id_where";
    $stmt = oci_parse($conexion, $sql);
    foreach ($binds as $nombre => &$valor) {
        oci_bind_by_name($stmt, $nombre, $valor, $valor === null ? -1 : 4000);
    }
    if (!oci_execute($stmt)) responder_error_oracle($stmt);
    oci_commit($conexion);
    echo json_encode(['ok' => true]);
    exit;
}

/* ---------- DELETE: borrar ---------- */
if ($metodo === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $stmt = oci_parse($conexion, "DELETE FROM $tabla WHERE id = :id");
    oci_bind_by_name($stmt, ':id', $id);
    if (!oci_execute($stmt)) responder_error_oracle($stmt);
    oci_commit($conexion);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido: ' . $metodo]);
