<?php
// ── CONFIGURACIÓN ──────────────────────────────────────
$destinatario = "pedmormes@gmail.com";
$asunto_solicitud = "Nueva solicitud de artículo – BLIGTER";
$asunto_contacto  = "Nuevo mensaje de contacto – BLIGTER";

// ── CABECERAS CORS (para pruebas en local) ─────────────
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// ── SOLO ACEPTAR POST ──────────────────────────────────
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["ok" => false, "error" => "Método no permitido"]);
    exit;
}

// ── LEER DATOS JSON ────────────────────────────────────
$datos = json_decode(file_get_contents("php://input"), true);
if (!$datos) {
    echo json_encode(["ok" => false, "error" => "Datos no válidos"]);
    exit;
}

$tipo      = htmlspecialchars($datos["tipo"]      ?? "");
$longitud  = htmlspecialchars($datos["longitud"]  ?? "");
$medio     = htmlspecialchars($datos["medio"]     ?? "");
$nombre    = htmlspecialchars($datos["nombre"]    ?? "");
$email     = htmlspecialchars($datos["email"]     ?? "");
$fecha     = htmlspecialchars($datos["fecha"]     ?? "");
$tematica  = htmlspecialchars($datos["tematica"]  ?? "");
$formulario = $datos["formulario"] ?? "solicitud";

// ── VALIDAR EMAIL ──────────────────────────────────────
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["ok" => false, "error" => "Email no válido"]);
    exit;
}

// ── CONSTRUIR MENSAJE ──────────────────────────────────
if ($formulario === "contacto") {
    $asunto  = $asunto_contacto;
    $mensaje = "
=== NUEVO MENSAJE DE CONTACTO ===

Mensaje:  $tematica
Email:    $email
";
} else {
    $asunto  = $asunto_solicitud;
    $mensaje = "
=== NUEVA SOLICITUD DE ARTÍCULO ===

Nombre:            $nombre
Email:             $email
Tipo de contenido: $tipo
Longitud:          $longitud
Medio:             $medio
Fecha deseada:     $fecha
Temática extra:    $tematica
";
}

// ── CABECERAS DEL EMAIL ────────────────────────────────
$cabeceras  = "From: noreply@bligter.com\r\n";
$cabeceras .= "Reply-To: $email\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

// ── ENVIAR ─────────────────────────────────────────────
$enviado = mail($destinatario, $asunto, $mensaje, $cabeceras);

if ($enviado) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "Error al enviar el email"]);
}
?>