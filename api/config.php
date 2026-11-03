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
?>