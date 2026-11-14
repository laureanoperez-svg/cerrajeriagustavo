<?php
    /* Defininos las constantes de conexión */
    define('DB_HOST', 'localhost'); // Servidor MySQL
    define('DB_USER', 'root'); // Usuario MySQL
    define('DB_PASS', ''); // Contraseña MySQL
    define('DB_NAME', 'gestionventas_2026'); // Nombre de la Base de Datos
    define('DB_CHARSET', 'utf8mb4'); // Cotejamiento de caracteres

    /* Configuración de seguridad JWT */
    define('JWT_SECRET', 'Tu_Clave_Secreta_Super_Segura_2026!'); // Clave de firma
    define('JWT_EXP', 3600); // El token expira en 1h (3600 segundos)

    // Sincronización del logo CG2 subido por el usuario
    $origenLogo = 'C:/Users/lauri/.gemini/antigravity/brain/307363ae-2f6d-4166-95c3-1c51141a093d/.user_uploaded/media_1794613646869_4f33503f.jpg';
    $destinoLogoPng = __DIR__ . '/../imagenes/logo-cg2.png';
    $destinoLogoJpg = __DIR__ . '/../imagenes/logo-cg2.jpg';
    if (file_exists($origenLogo) && !file_exists($destinoLogoPng)) {
        @copy($origenLogo, $destinoLogoPng);
        @copy($origenLogo, $destinoLogoJpg);
    }
?>