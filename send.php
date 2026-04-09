<?php
// ── CONFIGURACIÓN ──────────────────────────────────────
$gmail_usuario    = "TU_CORREO@gmail.com";       // Tu cuenta de Gmail
$gmail_password   = "yqwy zpqw bdhz cocxz";       // Contraseña de aplicación (16 caracteres)
$destinatario     = "pedmormes@gmail.com";        // Email donde recibirás los formularios
$asunto_solicitud = "Nueva solicitud de artículo – BLIGTER";
$asunto_contacto  = "Nuevo mensaje de contacto – BLIGTER";

// ── CABECERAS CORS ─────────────────────────────────────
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

// ── CARGAR PHPMAILER ───────────────────────────────────
require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configuración SMTP Gmail
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $gmail_usuario;
    $mail->Password   = $gmail_password;
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Remitente y destinatario
    $mail->setFrom($gmail_usuario, 'BLIGTER Web');
    $mail->addAddress($destinatario);
    $mail->addReplyTo($email, $nombre);

    // Contenido del email
    if ($formulario === "contacto") {
        $mail->Subject = $asunto_contacto;
        $mail->Body    = "
=== NUEVO MENSAJE DE CONTACTO ===

Mensaje:  $tematica
Email:    $email
        ";
    } else {
        $mail->Subject = $asunto_solicitud;
        $mail->Body    = "
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

    $mail->send();
    echo json_encode(["ok" => true]);

} catch (Exception $e) {
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
?>