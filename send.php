<?php
// ── CONFIGURACIÓN ──────────────────────────────────────
$gmail_usuario    = "pedmormes@gmail.com";
$gmail_password   = "yqwy zpqw bdhz cocxz";
$destinatario     = "pedmormes@gmail.com";
$asunto_solicitud = "Nueva solicitud de artículo – BLIGTER";
$asunto_contacto  = "Nuevo mensaje de contacto – BLIGTER";

// ── CABECERAS CORS (para pruebas en local) ─────────────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Responder a preflight OPTIONS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ── SOLO ACEPTAR POST ──────────────────────────────────
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["ok" => false, "error" => "Método no permitido"]);
    exit;
}

// ── LEER DATOS ─────────────────────────────────────────
$datos = json_decode(file_get_contents("php://input"), true);
if (!$datos) {
    echo json_encode(["ok" => false, "error" => "Datos no válidos"]);
    exit;
}

$tipo       = htmlspecialchars($datos["tipo"]       ?? "");
$longitud   = htmlspecialchars($datos["longitud"]   ?? "");
$medio      = htmlspecialchars($datos["medio"]      ?? "");
$nombre     = htmlspecialchars($datos["nombre"]     ?? "");
$email      = htmlspecialchars($datos["email"]      ?? "");
$fecha      = htmlspecialchars($datos["fecha"]      ?? "");
$tematica   = htmlspecialchars($datos["tematica"]   ?? "");
$formulario = $datos["formulario"] ?? "solicitud";

// ── VALIDAR EMAIL ──────────────────────────────────────
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["ok" => false, "error" => "Email no válido"]);
    exit;
}

// ── COMPROBAR QUE EXISTE LA CARPETA src ───────────────
if (!file_exists('src/PHPMailer.php')) {
    echo json_encode(["ok" => false, "error" => "No se encuentra src/PHPMailer.php. Comprueba la carpeta src."]);
    exit;
}

// ── CARGAR PHPMAILER ───────────────────────────────────
require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Debug SMTP — muestra errores detallados
    $mail->SMTPDebug  = 0; // Cambia a 2 para ver logs completos en pantalla
    $mail->Debugoutput = function($str, $level) {
        error_log("PHPMailer: $str");
    };

    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $gmail_usuario;
    $mail->Password   = $gmail_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($gmail_usuario, 'BLIGTER Web');
    $mail->addAddress($destinatario);
    $mail->addReplyTo($email, $nombre ?: 'Visitante');

    if ($formulario === "contacto") {
        $mail->Subject = $asunto_contacto;
        $mail->Body    = "=== NUEVO MENSAJE DE CONTACTO ===\n\nMensaje: $tematica\nEmail: $email";
    } else {
        $mail->Subject = $asunto_solicitud;
        $mail->Body    = "=== NUEVA SOLICITUD DE ARTÍCULO ===\n\nNombre: $nombre\nEmail: $email\nTipo: $tipo\nLongitud: $longitud\nMedio: $medio\nFecha: $fecha\nTemática: $tematica";
    }

    $mail->send();
    echo json_encode(["ok" => true]);

} catch (Exception $e) {
    echo json_encode([
        "ok"    => false,
        "error" => $mail->ErrorInfo
    ]);
}
?>