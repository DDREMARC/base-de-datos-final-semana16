<?php
/* =====================================================================
   Conexión a Oracle (oci8). El Tío Sam Chifa.

   Ajusta estos 3 datos a TU Oracle (usuario, clave y cadena de conexión).
   La cadena suele ser  //host:puerto/servicio
   - Oracle XE 11g/18c/21c instalado local: servicio suele ser "XE" o "XEPDB1"
   - Si usas el Oracle de Tecsup/la nube, pide la cadena al profesor.

   Requiere la extensión php_oci8 habilitada en XAMPP (ver README.md).
   ===================================================================== */

$usuario_bd = 'tiosam';
$clave_bd   = 'tiosam123';
$cadena_bd  = '//localhost:1521/XE';   // Oracle XE 11.2 local. En 18c/21c sería XEPDB1

$conexion = @oci_connect($usuario_bd, $clave_bd, $cadena_bd, 'AL32UTF8');

if (!$conexion) {
    $err = oci_error();
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No se pudo conectar a Oracle: ' . ($err['message'] ?? 'desconocido')]);
    exit;
}

// Las fechas salen y entran siempre como AAAA-MM-DD (igual que el <input type="date">)
$formato = oci_parse($conexion, "ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD'");
oci_execute($formato);
