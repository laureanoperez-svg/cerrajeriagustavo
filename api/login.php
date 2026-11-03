<?php
header("Content-Type: aaplication/json; charset=utf-8");

require_once 'config.php';
require_once 'modelos.php';

$usuario_recibido = $_POST['usuario'] ?? '';
$pass_recibida = $_POST['password'] ?? '';

if(empty($usuario_recibido) | empty($pass_recibida)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, proporcione usuario y contraseña'
    ]);
    exit;
}

$tabla = new Modelo('usuarios');
$tabla -> setCriterio("usuario='$usuario_recibido'");
$resultado = $tabla->seleccionar();

if(!empty($resultado)) {
    $usuario = $resultado[0];
    if(password_verify($pass_recibida, $usuario['password'])) {

        // Estructura de JWT
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

        // Incluimos los datos reales del usuario y el nivel de acceso
        $payload = json_encode([
            'user_id'=> $usuario['id'],
            'usuario' => $usuario['usuario'],
            'rol' => $usuario['rol'],
            'iat' => time(),
            'exp' => time() + JWT_EXP
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        // Firma HMAC-SHA256 con la clave secreta
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true );
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        // Token JWT final
        $jwt = $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;

        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => 'Autenticación exitosa',
            'token' => $jwt,
            'usuario' => [
                'id' => $usuario['usuario'],
                'nombre' => $usuario['nombre'],
                'apellido' => $usuario['apellido'],
                'usuario' => $usuario['usuario'],
                'rol' => $usuario['rol']
            ]
        ]);
        exit;
    }
}

// Si el usuario no existe o la contraseña no coincidió
http_response_code(401);
echo json_encode([
    'success' => false,
    'message' => 'Usuario o contraseña incorrecta'
]);

?>