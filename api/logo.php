<?php
/**
 * Servidor y sincronizador automático del Logo CG2
 */
$origen = 'C:/Users/lauri/.gemini/antigravity/brain/307363ae-2f6d-4166-95c3-1c51141a093d/.user_uploaded/media_1794613646869_4f33503f.jpg';
$destinoPng = dirname(__DIR__) . '/imagenes/logo-cg2.png';
$destinoJpg = dirname(__DIR__) . '/imagenes/logo-cg2.jpg';

// Si existe el archivo subido, asegurar copia en la carpeta de imágenes del proyecto
if (file_exists($origen)) {
    if (!file_exists($destinoPng)) {
        @copy($origen, $destinoPng);
    }
    if (!file_exists($destinoJpg)) {
        @copy($origen, $destinoJpg);
    }
    
    // Servir la imagen
    header('Content-Type: image/jpeg');
    header('Cache-Control: public, max-age=86400');
    readfile($origen);
    exit;
} elseif (file_exists($destinoPng)) {
    header('Content-Type: image/png');
    readfile($destinoPng);
    exit;
} elseif (file_exists($destinoJpg)) {
    header('Content-Type: image/jpeg');
    readfile($destinoJpg);
    exit;
} else {
    http_response_code(404);
    echo "Logo no encontrado";
}
